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
          className={`bg-bg-primary border border-border rounded-md mb-3.5 cursor-grab transition-all duration-base overflow-hidden relative hover:shadow-lg hover:-translate-y-0.5 hover:border-border-hover active:cursor-grabbing focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_4px_var(--color-primary-light)] kanban-card ${
            snapshot.isDragging ? 'opacity-85 rotate-[2deg] scale-[1.02] shadow-xl cursor-grabbing' : ''
          }`}
        >
          {project.imageUrl && (
            <div className="w-full h-[120px] overflow-hidden bg-bg-tertiary">
              <img
                src={project.imageUrl}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-slow hover:scale-105 max480:h-[100px]"
              />
            </div>
          )}
          <div className="p-4 max480:p-2">
            <h3 className="m-0 mb-2 text-base font-semibold text-text-primary leading-snug max480:text-sm">{project.name}</h3>
            <p className="m-0 mb-3.5 text-sm text-text-secondary leading-relaxed line-clamp-3 overflow-hidden max480:text-xs">
              {project.description.length > 100
                ? `${project.description.substring(0, 100)}...`
                : project.description}
            </p>
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="text-sm font-semibold text-success">
                ${project.budget.toLocaleString()}
              </span>
              <button
                className="px-3.5 py-1.5 text-xs font-medium bg-primary text-white border-none rounded-sm cursor-pointer transition-all duration-fast hover:bg-primary-hover hover:-translate-y-px hover:shadow-sm focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
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
