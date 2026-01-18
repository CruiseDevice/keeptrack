import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../shared/contexts';

/**
 * LoginPage component
 * Provides a login form for existing users to authenticate.
 *
 * On successful login, redirects to the projects page.
 */
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/projects', { replace: true });
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      // Navigation will happen via the AuthContext state change
      // or the redirect check above
      navigate('/projects', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-secondary">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">KeepTrack</h1>
          <p className="text-text-secondary">Sign in to manage your projects</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-bg-primary rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold text-text-primary mb-6">Welcome back</h2>

          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-md">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-border rounded-md text-text-primary placeholder-text-tertiary bg-bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-fast"
                required
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-border rounded-md text-text-primary placeholder-text-tertiary bg-bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-fast"
                required
                autoComplete="current-password"
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary-hover transition-colors duration-fast"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Demo Credentials Hint */}
        <div className="mt-4 p-3 bg-bg-tertiary rounded-md text-center">
          <p className="text-xs text-text-secondary">
            Demo: <span className="font-mono">demo@keeptrack.dev</span> / <span className="font-mono">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
