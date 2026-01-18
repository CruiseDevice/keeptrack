import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

/**
 * Extended Request type with authenticated user properties
 */
export interface AuthRequest extends Request {
  userId?: number;
  userRole?: string;
}

/**
 * Middleware to require authentication for protected routes
 * Checks for JWT token in httpOnly cookie and verifies it
 *
 * Usage: router.get('/protected', requireAuth, handler)
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Attach user info to request for use in route handlers
  req.userId = payload.userId;
  req.userRole = payload.role;
  next();
}

/**
 * Factory function to create middleware requiring a specific role
 * Admin users bypass role checks
 *
 * Usage: router.post('/admin', requireAuth, requireRole('admin'), handler)
 *
 * @param role - The required role (e.g., 'admin', 'member')
 * @returns Express middleware function
 */
export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Admin users have access to everything
    if (req.userRole === 'admin') {
      return next();
    }

    if (req.userRole !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}
