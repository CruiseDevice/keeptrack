import React, { useEffect, useState } from "react";
import KanbanBoard from './KanbanBoard';
import { Project } from './Project';
import { projectAPI } from './projectAPI';

function ProjectsPage () {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const data = await projectAPI.get();
        setProjects(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [])

  const saveProject = (project: Project, previousProject?: Project) => {
    projectAPI.put(project)
      .then((updatedProject) => {
        let updatedProjects = projects.map((p: Project) => {
          return p.id === project.id ? new Project(updatedProject) : p;
        });
        setProjects(updatedProjects);
      })
      .catch((e) => {
        if (e instanceof Error) {
          setError(e.message);
          // Rollback state on error for drag operations
          if (previousProject) {
            let rolledBackProjects = projects.map((p: Project) => {
              return p.id === project.id ? previousProject : p;
            });
            setProjects(rolledBackProjects);
          }
        }
      });
  };

  return (
    <>
    <h1>Projects</h1>
      {error && (
        <div className="row">
          <div className="card large error">
            <section>
              <p>
                <span className="icon-alert inverse"></span>
                {error}
              </p>
            </section>
          </div>
        </div>
      )}

      <KanbanBoard
        projects={projects}
        onSave={saveProject}/>

      {loading && (
        <div className="center-page">
          <span className="spinner primary"></span>
          <p>Loading...</p>
        </div>
      )}
    
    </>
  )
}

export default ProjectsPage;