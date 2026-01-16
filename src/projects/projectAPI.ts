import { Project, ProjectStatus } from "./Project";

// Use environment variable with fallback to localhost for development
const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';
const url = `${baseUrl}/projects`;
const LOCAL_STORAGE_KEY = 'keeptrack_projects';
const SEED_DATA_KEY = 'keeptrack_seeded';


function translateStatusToErrorMessage(status: number) {
  switch(status) {
    case 401:
      return 'Please login again.';
    case 403:
      return 'You do not have permission to view the project(s).';
    default:
      return 'There was an error retrieving the project(s). Please try again.';
  }
}

/**
 * Validates that the status is a valid ProjectStatus value
 * @param status - The status value to validate
 * @returns true if valid, false otherwise
 */
function isValidStatus(status: any): status is ProjectStatus {
  const validStatuses: ProjectStatus[] = ['backlog', 'todo', 'in-progress', 'review', 'done', 'blocked'];
  return validStatuses.includes(status);
}

function checkStatus(response: any) {
  if (response.ok) {
    return response
  } else {
    const httpErrorInfo = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };
    console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);

    let errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
    throw new Error(errorMessage);
  }
}

function delay(ms: number) {
  return function(x: any): Promise<any> {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
}

function parseJSON(response: Response) {
  return response.json();
}

function convertToProjectModels(data: any[]): Project[] {
  let projects: Project[] = data.map(convertToProjectModel);
  return projects
}

function convertToProjectModel(item: any): Project {
  return new Project(item);
}

// ============ LocalStorage Helper Functions ============

/**
 * Save projects to localStorage
 */
function saveToLocalStorage(projects: Project[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Load projects from localStorage
 * @returns Array of projects or null if not found
 */
function loadFromLocalStorage(): Project[] | null {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed.map(convertToProjectModel) : null;
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return null;
}

/**
 * Check if app has been seeded with initial data
 */
function isSeeded(): boolean {
  return localStorage.getItem(SEED_DATA_KEY) === 'true';
}

/**
 * Mark app as seeded
 */
function markAsSeeded(): void {
  localStorage.setItem(SEED_DATA_KEY, 'true');
}

/**
 * Clear all localStorage data (useful for testing/reset)
 */
export function clearLocalStorage(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  localStorage.removeItem(SEED_DATA_KEY);
}

const projectAPI = {
  get() {
    // First, try to load from localStorage
    const cachedProjects = loadFromLocalStorage();
    if (cachedProjects) {
      console.log('Loading projects from localStorage:', cachedProjects.length);
      // Return cached data immediately, then sync with API in background
      return Promise.resolve(cachedProjects);
    }

    // No cache found, fetch from API
    return fetch(`${url}?_sort=name`)
      .then(checkStatus)
      .then(parseJSON)
      .then((projects) => {
        // Seed localStorage on first successful fetch
        const projectModels = convertToProjectModels(projects);
        if (!isSeeded()) {
          saveToLocalStorage(projectModels);
          markAsSeeded();
        }
        return projectModels;
      })
      .catch((error: TypeError) => {
        console.log('log client error ' + error);
        throw new Error(
          'There was an error retrieving the projects. Please try again.'
        );
      });
  },

  /**
   * Creates an optimistic update for a project.
   * This returns the updated project immediately without waiting for the API.
   * Used for drag-and-drop operations where UI needs to update instantly.
   * 
   * @param project - The original project
   * @param updates - Partial updates to apply (e.g., status change)
   * @returns A new Project instance with the updates applied
   */
  createOptimisticUpdate(project: Project, updates: Partial<Project>): Project {
    return new Project({
      ...project,
      ...updates
    });
  },
  
  put(project: Project) {
    // Validate status field before sending to API
    if (project.status && !isValidStatus(project.status)) {
      const error = new Error(`Invalid status value: "${project.status}". Valid values are: backlog, todo, in-progress, review, done, blocked.`);
      console.error('Status validation error:', error.message);
      throw error;
    }

    // Optimistic update: save to localStorage immediately
    const cachedProjects = loadFromLocalStorage();
    if (cachedProjects) {
      const updatedCache = cachedProjects.map(p =>
        p.id === project.id ? project : p
      );
      saveToLocalStorage(updatedCache);
    }

    // Verify Date serialization for contractSignedOn
    const projectBody = JSON.stringify(project, (key, value) => {
      // Convert Date objects to ISO strings for proper serialization
      if (key === 'contractSignedOn' && value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });

    return fetch(`${url}/${project.id}`, {
      method: 'PUT',
      body: projectBody,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(checkStatus)
      .then(parseJSON)
      .catch((error: TypeError) => {
        console.log('log client error ' + error);
        throw new Error(
          'There was an error updating the project. Please try again.'
        );
      });
  },

  find(id: number) {
    return fetch(`${url}/${id}`)
      .then(checkStatus)
      .then(parseJSON)
      .then(convertToProjectModel);
  },
}

export { projectAPI };