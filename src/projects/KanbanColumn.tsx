import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Project, ProjectStatus } from './Project';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  title: string;
  status: ProjectStatus;
  projects: Project[];
  onEdit: (project: Project) => void;
}

/**
 * KanbanColumn component displays a single column in the Kanban board.
 * It contains a header with project count and a drop zone for draggable cards.
 * 
 * @param title - Display title for the column
 * @param status - The ProjectStatus this column represents
 * @param projects - Array of projects to display in this column
 * @param onEdit - Callback function when edit button is clicked on a card
 */
const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  projects,
  onEdit,
}) => {
  return (
    <div className={`kanban-column kanban-column-${status}`}>
      <div className="kanban-column-header">
        <h2 className="kanban-column-title">{title}</h2>
        <span className="kanban-column-count">{projects.length}</span>
      </div>
      
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`kanban-column-content ${
              snapshot.isDraggingOver ? 'dragging-over' : ''
            }`}
          >
            {projects.length === 0 ? (
              <div className="kanban-column-empty">
                <p>No projects</p>
              </div>
            ) : (
              projects.map((project, index) => (
                <KanbanCard
                  key={project.id}
                  project={project}
                  onEdit={onEdit}
                  index={index}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
