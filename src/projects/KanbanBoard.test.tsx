import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import KanbanBoard from './KanbanBoard';
import { Project } from './Project';

// Mock the DragDropContext from @hello-pangea/dnd
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: any) => <div data-testid="drag-drop-context">{children}</div>,
  DropResult: {},
}));

// Mock KanbanColumn to simplify testing
jest.mock('./KanbanColumn', () => {
  return function MockKanbanColumn({ title, projects, status }: any) {
    return (
      <div data-testid={`column-${status}`} data-column-title={title}>
        <h3>{title}</h3>
        <span data-testid={`count-${status}`}>{projects.length}</span>
      </div>
    );
  };
});

const mockProjects: Project[] = [
  new Project({
    id: 1,
    name: 'Backlog Project',
    description: 'In backlog',
    budget: 10000,
    status: 'backlog',
  }),
  new Project({
    id: 2,
    name: 'Todo Project',
    description: 'To do',
    budget: 20000,
    status: 'todo',
  }),
  new Project({
    id: 3,
    name: 'In Progress Project',
    description: 'Working on it',
    budget: 30000,
    status: 'in-progress',
  }),
  new Project({
    id: 4,
    name: 'Review Project',
    description: 'In review',
    budget: 40000,
    status: 'review',
  }),
  new Project({
    id: 5,
    name: 'Done Project',
    description: 'Completed',
    budget: 50000,
    status: 'done',
  }),
  new Project({
    id: 6,
    name: 'Blocked Project',
    description: 'Blocked',
    budget: 60000,
    status: 'blocked',
  }),
];

const mockOnSave = jest.fn();

describe('KanbanBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.location.href for navigation tests
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  test('should render all six columns', () => {
    render(<KanbanBoard projects={[]} onSave={mockOnSave} />);

    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
  });

  test('should render DragDropContext wrapper', () => {
    const { container } = render(<KanbanBoard projects={[]} onSave={mockOnSave} />);
    const context = container.querySelector('[data-testid="drag-drop-context"]');
    expect(context).toBeInTheDocument();
  });

  test('should render kanban-board container', () => {
    const { container } = render(<KanbanBoard projects={[]} onSave={mockOnSave} />);
    const board = container.querySelector('.kanban-board');
    expect(board).toBeInTheDocument();
  });

  test('should display correct project counts per column', () => {
    render(<KanbanBoard projects={mockProjects} onSave={mockOnSave} />);

    expect(screen.getByTestId('count-backlog')).toHaveTextContent('1');
    expect(screen.getByTestId('count-todo')).toHaveTextContent('1');
    expect(screen.getByTestId('count-in-progress')).toHaveTextContent('1');
    expect(screen.getByTestId('count-review')).toHaveTextContent('1');
    expect(screen.getByTestId('count-done')).toHaveTextContent('1');
    expect(screen.getByTestId('count-blocked')).toHaveTextContent('1');
  });

  test('should display zero counts when no projects', () => {
    render(<KanbanBoard projects={[]} onSave={mockOnSave} />);

    expect(screen.getByTestId('count-backlog')).toHaveTextContent('0');
    expect(screen.getByTestId('count-todo')).toHaveTextContent('0');
    expect(screen.getByTestId('count-in-progress')).toHaveTextContent('0');
    expect(screen.getByTestId('count-review')).toHaveTextContent('0');
    expect(screen.getByTestId('count-done')).toHaveTextContent('0');
    expect(screen.getByTestId('count-blocked')).toHaveTextContent('0');
  });

  test('should handle multiple projects in same column', () => {
    const multipleTodoProjects: Project[] = [
      mockProjects[1], // Todo
      new Project({
        id: 7,
        name: 'Another Todo',
        description: 'Also todo',
        budget: 15000,
        status: 'todo',
      }),
      new Project({
        id: 8,
        name: 'Third Todo',
        description: 'Still todo',
        budget: 25000,
        status: 'todo',
      }),
    ];

    render(<KanbanBoard projects={multipleTodoProjects} onSave={mockOnSave} />);

    expect(screen.getByTestId('count-todo')).toHaveTextContent('3');
  });

  test('should group projects correctly by status', () => {
    render(<KanbanBoard projects={mockProjects} onSave={mockOnSave} />);

    // Each column should have exactly one project
    const columns = [
      'count-backlog',
      'count-todo',
      'count-in-progress',
      'count-review',
      'count-done',
      'count-blocked',
    ];

    columns.forEach((columnTestId) => {
      const countElement = screen.getByTestId(columnTestId);
      expect(countElement).toHaveTextContent('1');
    });
  });

  test('should handle projects with missing status gracefully', () => {
    const projectWithoutStatus = new Project({
      id: 99,
      name: 'No Status Project',
      description: 'Has no status',
      budget: 1000,
    });
    // Project defaults to 'backlog' when no status is provided

    render(<KanbanBoard projects={[projectWithoutStatus]} onSave={mockOnSave} />);

    expect(screen.getByTestId('count-backlog')).toHaveTextContent('1');
  });

  test('should render empty board without errors', () => {
    expect(() => {
      render(<KanbanBoard projects={[]} onSave={mockOnSave} />);
    }).not.toThrow();
  });

  test('should render with large number of projects', () => {
    const manyProjects: Project[] = Array.from({ length: 50 }, (_, i) => {
      const statuses: Array<'backlog' | 'todo' | 'in-progress' | 'review' | 'done' | 'blocked'> = [
        'backlog',
        'todo',
        'in-progress',
        'review',
        'done',
        'blocked',
      ];
      return new Project({
        id: i + 1,
        name: `Project ${i + 1}`,
        description: `Description ${i + 1}`,
        budget: 1000 * (i + 1),
        status: statuses[i % 6],
      });
    });

    expect(() => {
      render(<KanbanBoard projects={manyProjects} onSave={mockOnSave} />);
    }).not.toThrow();

    // Verify distribution: 50 projects / 6 statuses = 8 remainder 2
    // So backlog and todo get 9 each (the first 2 statuses), rest get 8
    expect(screen.getByTestId('count-backlog')).toHaveTextContent('9');
    expect(screen.getByTestId('count-todo')).toHaveTextContent('9');
  });

  test('should have all required column statuses', () => {
    const { container } = render(<KanbanBoard projects={[]} onSave={mockOnSave} />);

    expect(container.querySelector('[data-testid="column-backlog"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="column-todo"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="column-in-progress"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="column-review"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="column-done"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="column-blocked"]')).toBeInTheDocument();
  });
});
