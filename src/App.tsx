import './index.tailwind.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { ErrorBoundary, LoadingSpinner } from './shared/components';

// Lazy load page components for code splitting
const HomePage = lazy(() => import('./features/home').then(m => ({ default: m.HomePage })));
const ProjectsPage = lazy(() => import('./features/projects').then(m => ({ default: m.ProjectsPage })));
const ProjectPage = lazy(() => import('./features/projects').then(m => ({ default: m.ProjectPage })));

function App() {
  const getNavLinkClasses = (isActive: boolean) =>
    `relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-transparent border border-transparent rounded-lg no-underline transition-all duration-fast ${
      isActive
        ? 'text-primary bg-primary-light font-semibold after:content-[""] after:absolute after:bottom-[-1px] after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-0.5 after:bg-primary after:rounded-t-lg'
        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
    } focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2`;

  return (
    <BrowserRouter>
      <header className="sticky top-0 z-100 h-header bg-bg-primary border-b border-border px-8 flex items-center justify-between shadow-sm transition-shadow duration-base after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-border after:to-transparent sm:px-4 sm:h-16">
        <span className="logo flex items-center gap-3">
          <img src="/assets/logo-3.svg" alt="logo" width="49" height="99" className="h-10 w-auto transition-transform duration-base hover:scale-105 sm:h-8"/>
        </span>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={({ isActive }) => getNavLinkClasses(isActive)}>
            Home
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => getNavLinkClasses(isActive)}>
            Projects
          </NavLink>
        </nav>
      </header>
      <div className="w-full p-8 sm:p-4">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner message="Loading..." />}>
            <Routes>
              <Route path="/" element={<HomePage/>} />
              <Route path="/projects" element={<ProjectsPage/>}></Route>
              <Route path="/projects/:id" element={<ProjectPage />}></Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
}

export default App;
