import './App.css';
import ProjectsPage from './features/projects/ProjectsPage';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './features/home/HomePage';
import ProjectPage from './features/projects/ProjectPage';
import { ErrorBoundary } from './shared/components';

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
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/projects" element={<ProjectsPage/>}></Route>
              <Route path="/projects/:id" element={<ProjectPage />}></Route>
          </Routes>
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
}

export default App;
