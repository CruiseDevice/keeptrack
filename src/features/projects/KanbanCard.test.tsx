import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import KanbanCard from './KanbanCard';
import { Project } from './Project';

// Mock the Draggable component from @hello-pangea/dnd
jest.mock('@hello-pangea/dnd', () => ({
  Draggable: ({ children }: any) => (
    <div data-testid="draggable-wrapper">
      {children(
        {
          innerRef: jest.fn(),
          draggableProps: { 'data-rbd-draggable-context-id': '0', 'data-rbd-draggable-id': '0' },
          dragHandleProps: { 'data-rbd-drag-handle-context-id': '0', 'data-rbd-drag-handle-id': '0', role: 'button' },
        },
        {}
      )}
    </div>
  ),
}));

const mockProject = new Project({
  id: 1,
  name: 'Test Project',
  description: 'This is a test project description',
  budget: 50000,
  imageUrl: 'http://example.com/image.jpg',
  status: 'todo',
});

const mockOnEdit = jest.fn();

describe('KanbanCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render project name', () => {
    render(<KanbanCard project={mockProject} onEdit={mockOnEdit} index={0} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  test('should render project description', () => {
    render(<KanbanCard project={mockProject} onEdit={mockOnEdit} index={0} />);
    expect(screen.getByText('This is a test project description')).toBeInTheDocument();
  });

  test('should render project image when imageUrl is provided', () => {
    const { getByAltText } = render(
      <KanbanCard project={mockProject} onEdit={mockOnEdit} index={0} />
    );
    const image = getByAltText('Test Project');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'http://example.com/image.jpg');
  });

  test('should not render image when imageUrl is not provided', () => {
    const projectWithoutImage = new Project({
      id: 2,
      name: 'Project Without Image',
      description: 'No image',
      budget: 10000,
    });
    render(<KanbanCard project={projectWithoutImage} onEdit={mockOnEdit} index={0} />);
    const image = screen.queryByAltText('Project Without Image');
    expect(image).not.toBeInTheDocument();
  });

  test('should render budget with correct formatting', () => {
    render(<KanbanCard project={mockProject} onEdit={mockOnEdit} index={0} />);
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  test('should render Edit button', () => {
    render(<KanbanCard project={mockProject} onEdit={mockOnEdit} index={0} />);
    expect(screen.getByRole('button', { name: /edit test project/i })).toBeInTheDocument();
  });

  test('should call onEdit when Edit button is clicked', () => {
    render(<KanbanCard project={mockProject} onEdit={mockOnEdit} index={0} />);
    const editButton = screen.getByRole('button', { name: /edit test project/i });
    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockProject);
  });

  test('should truncate long descriptions', () => {
    const longDescriptionProject = new Project({
      id: 3,
      name: 'Long Description Project',
      description: 'a'.repeat(150), // 150 characters
      budget: 20000,
    });
    render(<KanbanCard project={longDescriptionProject} onEdit={mockOnEdit} index={0} />);
    // Should be truncated to 100 chars plus "..."
    const displayedText = screen.getByText(/a{100}\.\.\./);
    expect(displayedText).toBeInTheDocument();
  });

  test('should render with draggable wrapper', () => {
    const { container } = render(
      <KanbanCard project={mockProject} onEdit={mockOnEdit} index={0} />
    );
    const wrapper = container.querySelector('[data-testid="draggable-wrapper"]');
    expect(wrapper).toBeInTheDocument();
  });

  test('should not throw error with minimal project data', () => {
    const minimalProject = new Project({
      id: 999,
      name: 'Minimal Project',
      description: 'Minimal desc',
      budget: 1000,
    });
    expect(() => {
      render(<KanbanCard project={minimalProject} onEdit={mockOnEdit} index={0} />);
    }).not.toThrow();
  });
});
