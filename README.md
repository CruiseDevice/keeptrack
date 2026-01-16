# KeepTrack

A modern project management application featuring an interactive Kanban board for tracking projects through various stages of development. Built with React, TypeScript, and a drag-and-drop interface for seamless project workflow management.

## Features

### Core Functionality
- **Kanban Board**: Interactive drag-and-drop interface to manage projects across different status columns
- **Project Management**: Create, read, update, and delete projects with comprehensive details
- **Status Workflow**: Track projects through six distinct stages: Backlog, To Do, In Progress, Review, Done, and Blocked
- **Project Details**: View and edit project information including name, description, budget, contract details, and status
- **Responsive Design**: Clean, modern UI that works across desktop and mobile devices

### Project Status Workflow
Projects can be moved between the following status columns:
- **Backlog**: Projects planned but not yet started
- **To Do**: Projects ready to begin work
- **In Progress**: Projects currently being worked on
- **Review**: Projects under review or testing
- **Done**: Completed projects
- **Blocked**: Projects with blockers or issues preventing progress

## Technology Stack

### Frontend
- **React 18.3**: Modern React with hooks and functional components
- **TypeScript 4.9**: Type-safe development
- **React Router 6.3**: Client-side routing
- **@hello-pangea/dnd 18.0**: Drag-and-drop functionality for Kanban board
- **mini.css 3.0**: Lightweight CSS framework

### Backend
- **json-server 0.16**: REST API mock server
- **Port 4000**: Default API server port

### Development Tools
- **Create React App 5.0**: Build tooling and development server
- **Jest & React Testing Library**: Unit and integration testing
- **ESLint**: Code linting

## Project Structure

```
keeptrack/
├── api/
│   ├── db.json              # Mock database with project data
│   └── test/                 # API test files (.http format)
├── public/
│   ├── assets/              # Static assets (images, logos)
│   └── index.html           # HTML template
├── src/
│   ├── home/
│   │   └── HomePage.tsx      # Home page component
│   ├── projects/
│   │   ├── KanbanBoard.tsx  # Main Kanban board component
│   │   ├── KanbanBoard.css  # Kanban board styles
│   │   ├── KanbanCard.tsx   # Individual project card component
│   │   ├── KanbanColumn.tsx # Single Kanban column component
│   │   ├── Project.ts       # Project model with status types
│   │   ├── ProjectCard.tsx  # Project card for list view
│   │   ├── ProjectDetail.tsx # Project detail view
│   │   ├── ProjectForm.tsx  # Project creation/edit form
│   │   ├── ProjectList.tsx  # Project list view
│   │   ├── ProjectPage.tsx  # Individual project page
│   │   ├── ProjectsPage.tsx # Main projects page with Kanban
│   │   ├── MockProjects.ts  # Mock project data
│   │   └── projectAPI.ts    # API service layer
│   ├── App.tsx              # Main app component with routing
│   ├── App.css              # Global styles
│   ├── index.tsx            # Application entry point
│   └── index.css            # Global CSS
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md               # This file
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn installed
- A modern web browser

### Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd /path/to/keeptrack
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Application

The KeepTrack application requires two servers to run: the React development server and the json-server API.

#### Option 1: Run Both Servers (Recommended)

Open two terminal windows and run:

**Terminal 1 - API Server:**
```bash
npm run api
```
This starts the json-server on `http://localhost:4000`

**Terminal 2 - React App:**
```bash
npm start
```
This starts the React development server on `http://localhost:3000`

#### Option 2: Using npm scripts

The project includes the following npm scripts:
- `npm start` - Starts the React development server
- `npm build` - Creates an optimized production build
- `npm test` - Runs the test suite in watch mode
- `npm run api` - Starts the json-server API on port 4000
- `npm run eject` - Ejects from Create React App (one-way operation)

### Accessing the Application

Once both servers are running:
- Open your browser and navigate to `http://localhost:3000`
- The application will load with the home page
- Navigate to the **Projects** page to see the Kanban board

## API Documentation

The application uses json-server to provide a RESTful API. The API is served from `http://localhost:4000`.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | Get all projects |
| GET | `/projects/:id` | Get a specific project by ID |
| POST | `/projects` | Create a new project |
| PUT | `/projects/:id` | Update a project (requires complete object) |
| DELETE | `/projects/:id` | Delete a project |

### Project Data Model

```typescript
interface Project {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  contractTypeId: number;
  contractSignedOn: Date;
  budget: number;
  isActive: boolean;
  status: ProjectStatus;
}

type ProjectStatus = 
  | 'backlog'
  | 'todo'
  | 'in-progress'
  | 'review'
  | 'done'
  | 'blocked';
```

### Important API Notes

- **Complete Object Required**: When updating a project via PUT, you must send the complete project object. Partial updates will result in data loss.
- **Status Field**: The `status` field is automatically preserved during API operations.
- **Date Handling**: Date fields (like `contractSignedOn`) are properly serialized/deserialized as ISO 8601 strings.

## Using the Kanban Board

### Moving Projects
1. Click and hold on any project card
2. Drag the card to the desired status column
3. Release to drop the card
4. The project's status will automatically update

### Creating Projects
1. Click the "Add Project" button on the Projects page
2. Fill in the project details:
   - Name (minimum 3 characters)
   - Description (required)
   - Budget (must be greater than $0)
   - Status (select from dropdown)
3. Click "Save" to create the project

### Editing Projects
1. Click the "Edit" button on any project card
2. Modify the desired fields
3. Click "Save" to update the project

### Viewing Project Details
1. Click on a project card to view its full details
2. The detail page shows all project information including status

## Testing

The project includes unit tests for key components.

### Running Tests
```bash
npm test
```

### Test Files
- [`KanbanBoard.test.tsx`](src/projects/KanbanBoard.test.tsx:1) - Kanban board component tests
- [`KanbanCard.test.tsx`](src/projects/KanbanCard.test.tsx:1) - Kanban card component tests
- [`KanbanColumn.test.tsx`](src/projects/KanbanColumn.test.tsx:1) - Kanban column component tests
- [`Project.test.ts`](src/projects/Project.test.ts:1) - Project model tests

## Development Notes

### Adding New Features
- Follow the existing component structure in [`src/projects/`](src/projects/)
- Use TypeScript for type safety
- Add tests for new components
- Update the API service layer in [`projectAPI.ts`](src/projects/projectAPI.ts:1) if needed

### Styling
- The project uses mini.css as a base framework
- Custom styles are defined in component-specific CSS files
- Kanban board styles are in [`KanbanBoard.css`](src/projects/KanbanBoard.css:1)
- Global styles are in [`App.css`](src/App.css:1)

### Status Color Scheme
The Kanban board uses the following color coding for status columns:
- **Backlog**: Gray (#6c757d)
- **To Do**: Blue (#007bff)
- **In Progress**: Yellow (#ffc107)
- **Review**: Purple (#6f42c1)
- **Done**: Green (#28a745)
- **Blocked**: Red (#dc3545)

## Known Issues & Limitations

- The json-server API stores data in memory; changes are lost when the server restarts
- Pagination is not currently implemented on the Kanban board
- Mobile touch support for drag-and-drop may have limitations

## Future Enhancements

Potential features for future development:
- Per-column pagination or virtual scrolling for large datasets
- Column limits and swimlanes
- Filtering and search functionality
- Bulk actions for moving multiple cards
- Quick add project directly to columns
- Due date tracking
- Assignee/owner field
- Keyboard navigation and improved accessibility

## License

This project is part of CS5220 coursework.

## Contributing

This is a course project. For questions or issues, please refer to the course materials or instructor.

---

**Last Updated**: 2026-01-16
**Version**: 0.1.0
