import { useEffect, useState } from "react";
import KanbanBoard from './KanbanBoard';
import { Project } from './Project';
import { projectAPI } from './projectAPI';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';

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
        // Use functional state update to avoid closure issues with multiple concurrent saves
        setProjects((prevProjects) =>
          prevProjects.map((p: Project) =>
            p.id === project.id ? new Project(updatedProject) : p
          )
        );
      })
      .catch((e) => {
        if (e instanceof Error) {
          setError(e.message);
          // Rollback state on error for drag operations
          if (previousProject) {
            setProjects((prevProjects) =>
              prevProjects.map((p: Project) =>
                p.id === project.id ? previousProject : p
              )
            );
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
        <LoadingSpinner message="Loading..." />
      )}
    
    </>
  )
}

export default ProjectsPage;