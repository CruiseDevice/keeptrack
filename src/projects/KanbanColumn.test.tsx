import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import KanbanColumn from './KanbanColumn';
import { Project } from './Project';

// Mock the Droppable component from @hello-pangea/dnd
jest.mock('@hello-pangea/dnd', () => ({
  Droppable: ({ children }: any) => (
    <div data-testid="droppable-wrapper">
      {children(
        {
          innerRef: jest.fn(),
          droppableProps: { 'data-rbd-droppable-context-id': '0', 'data-rbd-droppable-id': 'droppable' },
        },
        {}
      )}
    </div>
  ),
}));

// Mock KanbanCard to avoid complex drag-and-drop setup
jest.mock('./KanbanCard', () => {
  return function MockKanbanCard({ project, onEdit }: any) {
    return (
      <div data-testid={`kanban-card-${project.id}`} data-project-name={project.name}>
        {project.name}
      </div>
    );
  };
});

const mockProjects = [
  new Project({
    id: 1,
    name: 'Project 1',
    description: 'Description 1',
    budget: 10000,
    status: 'todo',
  }),
  new Project({
    id: 2,
    name: 'Project 2',
    description: 'Description 2',
    budget: 20000,
    status: 'todo',
  }),
  new Project({
    id: 3,
    name: 'Project 3',
    description: 'Description 3',
    budget: 30000,
    status: 'todo',
  }),
];

const mockOnEdit = jest.fn();

describe('KanbanColumn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render column title', () => {
    render(
      <KanbanColumn
        title="To Do"
        status="todo"
        projects={[]}
        onEdit={mockOnEdit}
      />
    );
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  test('should render project count in header', () => {
    render(
      <KanbanColumn
        title="To Do"
        status="todo"
        projects={mockProjects}
        onEdit={mockOnEdit}
      />
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('should render zero count when no projects', () => {
    render(
      <KanbanColumn
        title="Backlog"
        status="backlog"
        projects={[]}
        onEdit={mockOnEdit}
      />
    );
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('should render all projects in column', () => {
    render(
      <KanbanColumn
        title="To Do"
        status="todo"
        projects={mockProjects}
        onEdit={mockOnEdit}
      />
    );
    expect(screen.getByTestId('kanban-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('kanban-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('kanban-card-3')).toBeInTheDocument();
  });

  test('should render empty state when no projects', () => {
    render(
      <KanbanColumn
        title="Backlog"
        status="backlog"
        projects={[]}
        onEdit={mockOnEdit}
      />
    );
    expect(screen.getByText('No projects')).toBeInTheDocument();
  });

  test('should not render empty state when projects exist', () => {
    render(
      <KanbanColumn
        title="To Do"
        status="todo"
        projects={mockProjects}
        onEdit={mockOnEdit}
      />
    );
    expect(screen.queryByText('No projects')).not.toBeInTheDocument();
  });

  test('should render with correct CSS class for status', () => {
    const { container } = render(
      <KanbanColumn
        title="In Progress"
        status="in-progress"
        projects={[]}
        onEdit={mockOnEdit}
      />
    );
    const column = container.querySelector('.kanban-column-in-progress');
    expect(column).toBeInTheDocument();
  });

  test('should render droppable wrapper', () => {
    const { container } = render(
      <KanbanColumn
        title="To Do"
        status="todo"
        projects={mockProjects}
        onEdit={mockOnEdit}
      />
    );
    const wrapper = container.querySelector('[data-testid="droppable-wrapper"]');
    expect(wrapper).toBeInTheDocument();
  });

  test('should render column header with title and count', () => {
    render(
      <KanbanColumn
        title="Review"
        status="review"
        projects={mockProjects}
        onEdit={mockOnEdit}
      />
    );
    const header = screen.getByText('Review').closest('.kanban-column-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Review');
    expect(header).toHaveTextContent('3');
  });

  test('should handle single project correctly', () => {
    const singleProject = [mockProjects[0]];
    render(
      <KanbanColumn
        title="Done"
        status="done"
        projects={singleProject}
        onEdit={mockOnEdit}
      />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByTestId('kanban-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('kanban-card-2')).not.toBeInTheDocument();
  });

  test('should work with all valid status values', () => {
    const statuses: Array<'backlog' | 'todo' | 'in-progress' | 'review' | 'done' | 'blocked'> = [
      'backlog',
      'todo',
      'in-progress',
      'review',
      'done',
      'blocked',
    ];

    statuses.forEach((status) => {
      const { container } = render(
        <KanbanColumn
          title={status.charAt(0).toUpperCase() + status.slice(1)}
          status={status}
          projects={[]}
          onEdit={mockOnEdit}
        />
      );
      const column = container.querySelector(`.kanban-column-${status}`);
      expect(column).toBeInTheDocument();
    });
  });
});
