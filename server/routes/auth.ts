import { Router } from 'express';
import { register, login, getCurrentUser, logout } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * Auth Routes
 *
 * POST   /api/auth/register  - Create new account
 * POST   /api/auth/login     - Sign in with email/password
 * GET    /api/auth/me        - Get current user (requires auth)
 * POST   /api/auth/logout    - Sign out (clears cookie)
 */

// Public routes - no authentication required
router.post('/register', register);
router.post('/login', login);

// Protected routes - authentication required
router.get('/me', requireAuth, getCurrentUser);
router.post('/logout', logout);

export default router;
