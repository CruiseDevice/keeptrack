/**
 * Projects Feature Module
 *
 * Public API exports for the projects feature.
 * Internal components and utilities should not be re-exported here.
 */

// Pages - Route-level components
export { default as ProjectsPage } from './ProjectsPage';
export { default as ProjectPage } from './ProjectPage';

// API - Service layer for project data operations
export { projectAPI } from './projectAPI';

// Models - Domain types
export { Project } from './Project';
export type { ProjectStatus } from './Project';

// Hooks - Custom React hooks for state management
export { useProjects, useProject } from './hooks';
export type { UseProjectsResult, UseProjectResult } from './hooks';
