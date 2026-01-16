import { Project, ProjectStatus } from "./Project";

describe('Project', () => {
    test('should create project with default status', () => {
        const project = new Project();
        expect(project.status).toBe('backlog');
    });
    
    test('should create project with custom status', () => {
        const project = new Project({status: 'in-progress'});
        expect(project.status).toBe('in-progress');
    });
    
    test('should accept all valid status values', () => {
        const statuses: ProjectStatus[] = [
            'backlog', 'todo', 'in-progress', 'review', 'done', 'blocked'
        ];
    
        statuses.forEach(status => {
            const project = new Project({status});
            expect(project.status).toBe(status);
        });
    });
    
    test('should load status from initializer', () => {
        const project = new Project({
            id: 1,
            name: 'Test Project',
            status: 'review'
        });
    
        expect(project.id).toBe(1);
        expect(project.name).toBe('Test Project');
        expect(project.status).toBe('review');
    });
});