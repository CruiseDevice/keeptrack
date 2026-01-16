import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Project } from './Project';

interface KanbanCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  index: number;
}

/**
 * KanbanCard component displays a single project card that can be dragged
 * between columns in the Kanban board.
 *
 * @param project - The project to display
 * @param onEdit - Callback function when edit button is clicked
 * @param index - Position of this card in the column (required for drag-and-drop)
 */
const KanbanCard: React.FC<KanbanCardProps> = ({ project, onEdit, index }) => {
  return (
    <Draggable draggableId={project.id?.toString() || ''} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-card ${snapshot.isDragging ? 'dragging' : ''}`}
        >
          {project.imageUrl && (
            <div className="kanban-card-image">
              <img src={project.imageUrl} alt={project.name} />
            </div>
          )}
          <div className="kanban-card-content">
            <h3 className="kanban-card-title">{project.name}</h3>
            <p className="kanban-card-description">
              {project.description.length > 100
                ? `${project.description.substring(0, 100)}...`
                : project.description}
            </p>
            <div className="kanban-card-footer">
              <span className="kanban-card-budget">
                ${project.budget.toLocaleString()}
              </span>
              <button
                className="kanban-card-edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}
                aria-label={`Edit ${project.name}`}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
