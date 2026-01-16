import { useEffect, useState } from 'react';
import { Project } from '../Project';
import { projectAPI } from '../projectAPI';

export interface UseProjectsResult {
  projects: Project[];
  error: string | null;
  loading: boolean;
  refetch: () => Promise<void>;
  saveProject: (project: Project, previousProject?: Project) => Promise<void>;
}

export interface UseProjectResult {
  project: Project | null;
  error: string | null;
  loading: boolean;
}

/**
 * Custom hook for managing projects data.
 * Provides functionality for fetching all projects, refetching, and saving projects.
 *
 * @returns Object containing projects array, error state, loading state, refetch function, and saveProject function
 *
 * @example
 * const { projects, error, loading, saveProject } = useProjects();
 */
export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectAPI.get();
      setProjects(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const saveProject = async (project: Project, previousProject?: Project) => {
    try {
      const updatedProject = await projectAPI.put(project);
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? new Project(updatedProject) : p))
      );
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      setError(errorMessage);
      // Rollback state on error for drag operations
      if (previousProject) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? previousProject : p))
        );
      }
      throw e; // Re-throw for caller to handle if needed
    }
  };

  return {
    projects,
    error,
    loading,
    refetch: fetchProjects,
    saveProject,
  };
}

/**
 * Custom hook for fetching a single project by ID.
 *
 * @param id - The project ID to fetch
 * @returns Object containing project, error state, and loading state
 *
 * @example
 * const { project, error, loading } = useProject(123);
 */
export function useProject(id: number | null): UseProjectResult {
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id === null) return;

    setLoading(true);
    setError(null);
    projectAPI
      .find(id)
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
        setLoading(false);
      });
  }, [id]);

  return {
    project,
    error,
    loading,
  };
}
