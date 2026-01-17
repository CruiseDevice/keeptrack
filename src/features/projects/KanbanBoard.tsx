import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Project, ProjectStatus } from './Project';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  projects: Project[];
  onSave: (project: Project, previousProject?: Project) => void;
}

interface KanbanBoardState {
  hasError: boolean;
  error: string | null;
}

/**
 * KanbanBoard component is the main container for the Kanban-style project management board.
 * It manages drag-and-drop operations, displays projects in columns by status, and handles
 * optimistic updates with error rollback.
 * 
 * @param projects - Array of all projects to display
 * @param onSave - Callback function to save project changes (includes rollback support)
 */
class KanbanBoard extends Component<KanbanBoardProps, KanbanBoardState> {
  state: KanbanBoardState = {
    hasError: false,
    error: null,
  };

  // Column definitions with titles and corresponding status values
  private columns: Array<{ title: string; status: ProjectStatus }> = [
    { title: 'Backlog', status: 'backlog' },
    { title: 'To Do', status: 'todo' },
    { title: 'In Progress', status: 'in-progress' },
    { title: 'Review', status: 'review' },
    { title: 'Done', status: 'done' },
    { title: 'Blocked', status: 'blocked' },
  ];

  /**
   * Error boundary to catch and display errors in the Kanban board
   */
  static getDerivedStateFromError(error: Error): KanbanBoardState {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('KanbanBoard error:', error, errorInfo);
  }

  /**
   * Reorders projects within a column by recalculating their order values
   * Returns array of projects that need to be updated
   */
  private reorderProjectsInColumn = (
    projectsInColumn: Project[],
    movedProject: Project,
    newIndex: number
  ): Project[] => {
    // Filter out the moved project from current position
    const otherProjects = projectsInColumn.filter((p) => p.id !== movedProject.id);

    // Insert the moved project at the new position
    const reordered = [
      ...otherProjects.slice(0, newIndex),
      movedProject,
      ...otherProjects.slice(newIndex),
    ];

    // Assign new order values to all projects in the column
    return reordered.map((project, index) => ({
      ...project,
      order: index,
    }));
  };

  /**
   * Handle drag end events from the drag-and-drop context
   * This implements optimistic updates with rollback support
   * Tracks position within columns using the order field
   */
  onDragEnd = (result: DropResult): void => {
    const { destination, source, draggableId } = result;

    // Drop was cancelled (dropped outside valid drop zone)
    if (!destination) return;

    // Dropped in same position - no action needed
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the project being dragged
    const project = this.props.projects.find(
      (p) => p.id === parseInt(draggableId)
    );

    if (!project) {
      console.error(`Project with id ${draggableId} not found`);
      return;
    }

    const sourceStatus = source.droppableId as ProjectStatus;
    const destStatus = destination.droppableId as ProjectStatus;

    // Get projects in the relevant column(s)
    const sourceColumnProjects = this.props.projects.filter(
      (p) => p.status === sourceStatus
    );
    const destColumnProjects = this.props.projects.filter(
      (p) => p.status === destStatus
    );

    const projectsToUpdate: Project[] = [];

    if (sourceStatus === destStatus) {
      // Moving within the same column - reorder all projects in that column
      const updatedProjects = this.reorderProjectsInColumn(
        sourceColumnProjects,
        project,
        destination.index
      );
      projectsToUpdate.push(...updatedProjects);
    } else {
      // Moving across columns - update both columns
      // 1. Remove from source column and reorder remaining
      const sourceWithoutMoved = sourceColumnProjects.filter(
        (p) => p.id !== project.id
      );
      const updatedSource = sourceWithoutMoved.map((p, i) => ({ ...p, order: i }));
      projectsToUpdate.push(...updatedSource);

      // 2. Add to destination column at the new position
      const destWithoutMoved = destColumnProjects.filter(
        (p) => p.id !== project.id
      );
      const movedWithNewStatus = {
        ...project,
        status: destStatus,
      };
      const updatedDest = this.reorderProjectsInColumn(
        destWithoutMoved,
        movedWithNewStatus,
        destination.index
      );
      projectsToUpdate.push(...updatedDest);
    }

    // Save all affected projects (optimistic update with rollback)
    const previousProjects = new Map(
      projectsToUpdate.map((p) => [p.id, this.props.projects.find((orig) => orig.id === p.id)])
    );

    projectsToUpdate.forEach((updatedProject) => {
      const previousProject = previousProjects.get(updatedProject.id);
      this.props.onSave(updatedProject, previousProject);
    });
  };

  /**
   * Group projects by their status and sort by order within each status
   */
  getProjectsByStatus = (): Map<ProjectStatus, Project[]> => {
    const projectsByStatus = new Map<ProjectStatus, Project[]>();

    // Initialize all columns with empty arrays
    this.columns.forEach((column) => {
      projectsByStatus.set(column.status, []);
    });

    // Group projects by status
    this.props.projects.forEach((project) => {
      const statusProjects = projectsByStatus.get(project.status) || [];
      statusProjects.push(project);
      projectsByStatus.set(project.status, statusProjects);
    });

    // Sort projects by order within each status column
    projectsByStatus.forEach((projects) => {
      projects.sort((a, b) => a.order - b.order);
    });

    return projectsByStatus;
  };

  render(): ReactNode {
    // Display error state if error boundary caught an error
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-error bg-bg-primary rounded-lg border border-border">
          <p>{this.state.error || 'An error occurred in the Kanban board'}</p>
        </div>
      );
    }

    const projectsByStatus = this.getProjectsByStatus();

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="flex flex-row gap-5 overflow-x-auto p-6 min-h-[calc(100vh-200px)] bg-transparent items-stretch max-md:flex-col max-md:gap-3 max-md:p-3 max480:gap-2 max480:p-2">
          {this.columns.map((column) => (
            <KanbanColumn
              key={column.status}
              title={column.title}
              status={column.status}
              projects={projectsByStatus.get(column.status) || []}
              onEdit={(project) => {
                // Navigate to project edit page
                // This will be handled by the parent component or routing
                window.location.href = `/projects/${project.id}`;
              }}
            />
          ))}
        </div>
      </DragDropContext>
    );
  }
}

export default KanbanBoard;
