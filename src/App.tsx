import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { ErrorBoundary, LoadingSpinner } from './shared/components';

// Lazy load page components for code splitting
const HomePage = lazy(() => import('./features/home').then(m => ({ default: m.HomePage })));
const ProjectsPage = lazy(() => import('./features/projects').then(m => ({ default: m.ProjectsPage })));
const ProjectPage = lazy(() => import('./features/projects').then(m => ({ default: m.ProjectPage })));

function App() {
  return (
    <BrowserRouter>
      <header className="stick">
        <span className="logo">
          <img src="/assets/logo-3.svg" alt="logo" width="49" height="99"/>
        </span>
        <NavLink to="/" className="button rounded">
          <span className="icon-"></span>
          Home
        </NavLink>
        <NavLink to="/projects" className="button rounded">
          Projects
        </NavLink>
      </header>
      <div className="container">
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
