import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Project, ProjectStatus } from './Project';
import KanbanCard from './KanbanCard';
import VirtualizedKanbanColumn from './VirtualizedKanbanColumn';

interface KanbanColumnProps {
  title: string;
  status: ProjectStatus;
  projects: Project[];
  onEdit: (project: Project) => void;
  virtualizationThreshold?: number; // Number of cards before using virtualization
}

// Threshold for using virtualization - columns with more cards use virtualized rendering
const DEFAULT_VIRTUALIZATION_THRESHOLD = 20;

/**
 * KanbanColumn component displays a single column in the Kanban board.
 * It contains a header with project count and a drop zone for draggable cards.
 *
 * Automatically switches to virtualized rendering when project count exceeds threshold
 * for better performance with large datasets.
 *
 * @param title - Display title for the column
 * @param status - The ProjectStatus this column represents
 * @param projects - Array of projects to display in this column
 * @param onEdit - Callback function when edit button is clicked on a card
 * @param virtualizationThreshold - Cards count threshold (default: 20)
 */
const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  projects,
  onEdit,
  virtualizationThreshold = DEFAULT_VIRTUALIZATION_THRESHOLD,
}) => {
  // Use virtualized column for large datasets
  if (projects.length > virtualizationThreshold) {
    return (
      <VirtualizedKanbanColumn
        title={title}
        status={status}
        projects={projects}
        onEdit={onEdit}
      />
    );
  }

  // Original non-virtualized rendering for smaller datasets
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
