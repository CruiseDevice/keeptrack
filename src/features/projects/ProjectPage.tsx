import { useEffect, useState } from 'react';
import { projectAPI } from './projectAPI';
import { useParams } from 'react-router-dom';
import { Project } from './Project';
import ProjectDetail from './ProjectDetail';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';

function ProjectPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    setLoading(true);
    projectAPI
      .find(id)
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      })
  }, [id])
  return (
    <div>
      <>
        <h1>Project Detail</h1>

        {loading && (
          <LoadingSpinner message="Loading..." />
        )}

        {error && (
          <div className="row">
            <div className="card large error">
              <section>
                <p>
                  <span className="icon-alert inverse"></span> {error}
                </p>
              </section>
            </div>
          </div>
        )}

        {project && <ProjectDetail project={project} />}
      </>
    </div>
  )
}

export default ProjectPage;