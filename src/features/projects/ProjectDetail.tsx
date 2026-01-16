import React from 'react';
import { Project, ProjectStatus } from './Project';
import './KanbanBoard.css';

interface ProjectDetailProps {
  project: Project;
}

// Status configuration for display and styling
const getStatusConfig = (status: ProjectStatus) => {
  const statusMap: Record<ProjectStatus, { label: string; color: string }> = {
    'backlog': { label: 'Backlog', color: '#6c757d' },
    'todo': { label: 'To Do', color: '#007bff' },
    'in-progress': { label: 'In Progress', color: '#ffc107' },
    'review': { label: 'Review', color: '#6f42c1' },
    'done': { label: 'Done', color: '#28a745' },
    'blocked': { label: 'Blocked', color: '#dc3545' }
  };
  return statusMap[status];
};

function ProjectDetail({project}: ProjectDetailProps) {
  const contractSignedOn = new Date(project.contractSignedOn);
  const statusConfig = getStatusConfig(project.status);

  return (
    <div className="row">
      <div className="col-sm-6">
        <div className="card large">
          <img src={project.imageUrl} alt={project.name} className="rounded" />
          <section className="section dark">
            <h3 className="strong">
              <strong>{project.name}</strong>
            </h3>
            <p>{project.description}</p>
            <p>Budget: {project.budget}</p>
            <p>Signed: {contractSignedOn.toLocaleDateString()}</p>
            <p>
              <mark
                className="active"
                style={{
                  backgroundColor: statusConfig.color,
                  color: statusConfig.color === '#ffc107' ? '#000' : '#fff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontWeight: '600'
                }}
              >
                {statusConfig.label}
              </mark>
              {' '}
              <mark className="active">
                {project.isActive ? 'active' : 'inactive'}
              </mark>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail;