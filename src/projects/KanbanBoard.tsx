import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Project, ProjectStatus } from './Project';
import KanbanColumn from './KanbanColumn';
import './KanbanBoard.css';

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
   * Handle drag end events from the drag-and-drop context
   * This implements optimistic updates with rollback support
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

    // Create updated project with new status using spread operator
    // This ensures all fields are preserved (critical for json-server)
    const updatedProject: Project = {
      ...project,
      status: destination.droppableId as ProjectStatus,
    };

    // Optimistic update - call onSave with both updated and previous project
    // The ProjectsPage's saveProject will handle the API call and rollback on error
    this.props.onSave(updatedProject, project);
  };

  /**
   * Group projects by their status
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

    return projectsByStatus;
  };

  render(): ReactNode {
    // Display error state if error boundary caught an error
    if (this.state.hasError) {
      return (
        <div className="kanban-board-error">
          <div className="card large error">
            <section>
              <p>
                <span className="icon-alert inverse"></span>
                {this.state.error || 'An error occurred in the Kanban board'}
              </p>
            </section>
          </div>
        </div>
      );
    }

    const projectsByStatus = this.getProjectsByStatus();

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="kanban-board">
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
