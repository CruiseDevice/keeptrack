import './index.tailwind.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { ErrorBoundary, LoadingSpinner } from './shared/components';
import { AuthProvider, useAuth } from './shared/contexts';

// Lazy load page components for code splitting
const HomePage = lazy(() => import('./features/home').then(m => ({ default: m.HomePage })));
const ProjectsPage = lazy(() => import('./features/projects').then(m => ({ default: m.ProjectsPage })));
const ProjectPage = lazy(() => import('./features/projects').then(m => ({ default: m.ProjectPage })));
const LoginPage = lazy(() => import('./features/auth').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./features/auth').then(m => ({ default: m.RegisterPage })));

/**
 * ProtectedRoute component
 * Redirects to login if user is not authenticated
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const getNavLinkClasses = (isActive: boolean) =>
    `relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-transparent border border-transparent rounded-lg no-underline transition-all duration-fast ${
      isActive
        ? 'text-primary bg-primary-light font-semibold after:content-[""] after:absolute after:bottom-[-1px] after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-0.5 after:bg-primary after:rounded-t-lg'
        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
    } focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2`;

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppNav getNavLinkClasses={getNavLinkClasses} />
      </AuthProvider>
    </BrowserRouter>
  );
}

/**
 * AppNav component
 * Contains the navigation header and routed content.
 * Separated to use useAuth hook within AuthProvider context.
 */
function AppNav({ getNavLinkClasses }: { getNavLinkClasses: (isActive: boolean) => string }) {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-100 h-header bg-bg-primary border-b border-border px-8 flex items-center justify-between shadow-sm transition-shadow duration-base after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-border after:to-transparent sm:px-4 sm:h-16">
        <span className="logo flex items-center gap-3">
          <img src="/assets/logo-3.svg" alt="logo" width="49" height="99" className="h-10 w-auto transition-transform duration-base hover:scale-105 sm:h-8"/>
        </span>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={({ isActive }) => getNavLinkClasses(isActive)}>
            Home
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/projects" className={({ isActive }) => getNavLinkClasses(isActive)}>
              Projects
            </NavLink>
          )}
        </nav>
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary hidden sm:inline">
              {user?.name}
            </span>
            <LogoutButton />
          </div>
        )}
      </header>
      <div className="w-full p-8 sm:p-4">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner message="Loading..." />}>
            <Routes>
              <Route path="/" element={<HomePage/>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <ProjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute>
                    <ProjectPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}

/**
 * LogoutButton component
 * Displays user name and logout button when authenticated
 */
function LogoutButton() {
  const { logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="text-sm text-text-secondary hover:text-error transition-colors duration-fast disabled:opacity-50"
    >
      Logout
    </button>
  );
}

export default App;
