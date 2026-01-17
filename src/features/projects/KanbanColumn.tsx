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
  const colors = getStatusColors(status);

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
    <div className="flex-shrink-0 w-[300px] min-w-[300px] max-w-[300px] flex flex-col bg-bg-primary rounded-lg shadow-md max-h-[calc(100vh-200px)] border border-border max-md:w-full max-md:min-w-full max-md:max-w-full max-md:max-h-none lg:w-[280px] lg:min-w-[280px] lg:max-w-[280px]">
      <div className="flex justify-between items-center px-5 py-4 border-b border-border rounded-t-lg bg-gradient-to-b from-bg-primary to-bg-secondary">
        <h2 className={`m-0 text-sm font-semibold uppercase tracking-wider ${colors.title}`}>{title}</h2>
        <span className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2.5 rounded-full text-xs font-semibold transition-all duration-fast ${colors.count}`}>{projects.length}</span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto p-4 min-h-[100px] transition-colors duration-fast rounded-b-lg kanban-column-content ${
              snapshot.isDraggingOver ? 'bg-primary-light' : ''
            }`}
          >
            {projects.length === 0 ? (
              <div className="flex items-center justify-center h-[100px] text-text-tertiary italic text-sm">
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
