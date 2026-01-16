import React, { forwardRef } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Droppable, DroppableProvided, DroppableStateSnapshot, Draggable } from '@hello-pangea/dnd';
import { Project, ProjectStatus } from './Project';
import KanbanCard from './KanbanCard';

interface VirtualizedKanbanColumnProps {
  title: string;
  status: ProjectStatus;
  projects: Project[];
  onEdit: (project: Project) => void;
}

interface ScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: React.CSSProperties;
}

/**
 * VirtualizedKanbanColumn uses react-virtuoso to render only visible cards.
 * This significantly improves performance when columns have many (50+) projects.
 *
 * Integration with @hello-pangea/dnd:
 * - Uses Virtuoso's custom Scroller component wrapped with Droppable
 * - Each item is wrapped with Draggable for drag-and-drop support
 * - Virtual mode only renders visible items in the DOM
 */
const VirtualizedKanbanColumn: React.FC<VirtualizedKanbanColumnProps> = ({
  title,
  status,
  projects,
  onEdit,
}) => {
  // Default height for the virtualized container
  const HEIGHT = 400;

  return (
    <div className={`kanban-column kanban-column-${status}`}>
      <div className="kanban-column-header">
        <h2 className="kanban-column-title">{title}</h2>
        <span className="kanban-column-count">{projects.length}</span>
      </div>

      <Droppable droppableId={status} mode="virtual">
        {(droppableProvided: DroppableProvided, droppableSnapshot: DroppableStateSnapshot) => (
          <Virtuoso
            style={{ flex: 1, height: HEIGHT }}
            data={projects}
            itemContent={(index, project) => (
              <Draggable draggableId={project.id?.toString() || ''} index={index} key={project.id}>
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    className={`kanban-card ${draggableSnapshot.isDragging ? 'dragging' : ''}`}
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
            )}
            components={{
              // Custom Scroller that integrates with Droppable
              Scroller: forwardRef<HTMLDivElement, ScrollerProps>((props, ref) => (
                <div
                  ref={(element) => {
                    // Combine refs: Virtuoso's ref and Droppable's innerRef
                    droppableProvided.innerRef(element);
                    if (typeof ref === 'function') {
                      ref(element);
                    } else if (ref) {
                      ref.current = element;
                    }
                  }}
                  {...props}
                  {...droppableProvided.droppableProps}
                  className={`kanban-column-content ${
                    droppableSnapshot.isDraggingOver ? 'dragging-over' : ''
                  }`}
                  style={{
                    ...props.style,
                    // Ensure the container has a defined height for virtualization
                    minHeight: HEIGHT,
                  }}
                />
              )),
              // Footer renders the Droppable placeholder for drag space
              Footer: () => <>{droppableProvided.placeholder}</>,
            }}
          />
        )}
      </Droppable>
    </div>
  );
};

export default VirtualizedKanbanColumn;
