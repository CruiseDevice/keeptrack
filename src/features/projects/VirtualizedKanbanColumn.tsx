import React, { forwardRef } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Droppable, DroppableProvided, DroppableStateSnapshot, Draggable } from '@hello-pangea/dnd';
import { Project, ProjectStatus } from './Project';

interface VirtualizedKanbanColumnProps {
  title: string;
  status: ProjectStatus;
  projects: Project[];
  onEdit: (project: Project) => void;
}

interface ScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: React.CSSProperties;
}

// Status color mapping for column headers and count badges
const getStatusColors = (status: ProjectStatus) => {
  const colorMap = {
    'backlog': {
      title: 'text-text-secondary',
      count: 'bg-text-secondary text-white',
    },
    'todo': {
      title: 'text-info',
      count: 'bg-info text-white',
    },
    'in-progress': {
      title: 'text-warning',
      count: 'bg-warning text-white',
    },
    'review': {
      title: 'text-purple',
      count: 'bg-purple text-white',
    },
    'done': {
      title: 'text-success',
      count: 'bg-success text-white',
    },
    'blocked': {
      title: 'text-error',
      count: 'bg-error text-white',
    },
  };
  return colorMap[status] || colorMap['backlog'];
};

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
  const colors = getStatusColors(status);
  // Default height for the virtualized container
  const HEIGHT = 400;

  return (
    <div className="flex-shrink-0 w-[300px] min-w-[300px] max-w-[300px] flex flex-col bg-bg-primary rounded-lg shadow-md max-h-[calc(100vh-200px)] border border-border max-md:w-full max-md:min-w-full max-md:max-w-full max-md:max-h-none lg:w-[280px] lg:min-w-[280px] lg:max-w-[280px]">
      <div className="flex justify-between items-center px-5 py-4 border-b border-border rounded-t-lg bg-gradient-to-b from-bg-primary to-bg-secondary">
        <h2 className={`m-0 text-sm font-semibold uppercase tracking-wider ${colors.title}`}>{title}</h2>
        <span className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2.5 rounded-full text-xs font-semibold transition-all duration-fast ${colors.count}`}>{projects.length}</span>
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
                    className={`bg-bg-primary border border-border rounded-md mb-3.5 cursor-grab transition-all duration-base overflow-hidden relative hover:shadow-lg hover:-translate-y-0.5 hover:border-border-hover active:cursor-grabbing focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_4px_var(--color-primary-light)] kanban-card ${
                      draggableSnapshot.isDragging ? 'opacity-85 rotate-[2deg] scale-[1.02] shadow-xl cursor-grabbing' : ''
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
                  className={`flex-1 overflow-y-auto p-4 min-h-[100px] transition-colors duration-fast rounded-b-lg kanban-column-content ${
                    droppableSnapshot.isDraggingOver ? 'bg-primary-light' : ''
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
