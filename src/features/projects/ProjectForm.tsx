import { SyntheticEvent, useState, useEffect } from "react";
import { Project } from "./Project";

interface ProjectFormProps {
  project: Project;
  onCancel: () => void;
  onSave: (project: Project) => void;
}

function ProjectForm({project: initialProject, onCancel, onSave}: ProjectFormProps) {
  const [project, setProject] = useState(initialProject);

  // Sync form with prop when it changes (e.g., opening modal with different project)
  useEffect(() => {
    setProject(initialProject);
  }, [initialProject]);

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    budget: '',
    status: ''
  });

  function isValid() {
    return (
      errors.name.length === 0 &&
      errors.description.length === 0 &&
      errors.budget.length === 0 &&
      errors.status.length === 0
    );
  }  

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    if(!isValid()) return;
    onSave(project);
  }
  

  const handleChange = (event: any) => {
    const {type, name, value, checked} = event.target;

    let updatedValue = type === 'checkbox' ? checked : value;

    if(type === 'number') {
      updatedValue = Number(updatedValue);
    }

    const change = {
      [name]: updatedValue,
    }

    let updatedProject: Project;

    setProject((p) => {
      updatedProject = new Project({...p, ...change});
      return updatedProject;
    });
    setErrors(() => validate(updatedProject));
  };

  function validate(project: Project) {
    let errors: any = {
      name: '',
      description: '',
      budget: '',
      status: ''
    };

    if (project.name.length > 0 && project.name.length < 3) {
      errors.name = 'Name needs to be at least 3 characters.';
    }

    if (project.description.length === 0) {
      errors.description = 'Description is required';
    }

    if (project.budget === 0) {
      errors.budget = 'Budget must be more than $0';
    }

    if (!project.status) {
      errors.status = 'Status is required';
    }

    return errors;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Project Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-text-primary mb-1.5"
        >
          Project Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter project name"
          value={project.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded-md border bg-bg-primary text-text-primary placeholder:text-text-tertiary transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.name ? 'border-error focus:ring-error' : 'border-border hover:border-border-hover'
          }`}
        />
        {errors.name && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.name}
          </p>
        )}
      </div>

      {/* Project Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-text-primary mb-1.5"
        >
          Project Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          placeholder="Enter a detailed description"
          value={project.description}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded-md border bg-bg-primary text-text-primary placeholder:text-text-tertiary transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y ${
            errors.description ? 'border-error focus:ring-error' : 'border-border hover:border-border-hover'
          }`}
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.description}
          </p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-text-primary mb-1.5"
        >
          Image URL
        </label>
        <input
          type="text"
          name="imageUrl"
          id="imageUrl"
          placeholder="https://example.com/image.jpg"
          value={project.imageUrl}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-border bg-bg-primary text-text-primary placeholder:text-text-tertiary transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-border-hover"
        />
      </div>

      {/* Budget */}
      <div>
        <label
          htmlFor="budget"
          className="block text-sm font-medium text-text-primary mb-1.5"
        >
          Project Budget
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
          <input
            type="number"
            name="budget"
            id="budget"
            placeholder="0.00"
            value={project.budget}
            onChange={handleChange}
            className={`w-full pl-7 pr-3 py-2 rounded-md border bg-bg-primary text-text-primary placeholder:text-text-tertiary transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.budget ? 'border-error focus:ring-error' : 'border-border hover:border-border-hover'
            }`}
          />
        </div>
        {errors.budget && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.budget}
          </p>
        )}
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-text-primary mb-1.5"
        >
          Status
        </label>
        <div className="relative">
          <select
            name="status"
            id="status"
            value={project.status}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border bg-bg-primary text-text-primary transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer ${
              errors.status ? 'border-error focus:ring-error' : 'border-border hover:border-border-hover'
            }`}
          >
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
            <option value="blocked">Blocked</option>
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {errors.status && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.status}
          </p>
        )}
      </div>

      {/* Active Checkbox */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          checked={project.isActive}
          onChange={handleChange}
          className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer transition-all duration-fast"
        />
        <label
          htmlFor="isActive"
          className="text-sm font-medium text-text-primary cursor-pointer select-none"
        >
          Active Project
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 bg-primary text-white font-medium rounded-md transition-all duration-fast hover:bg-primary-hover hover:-translate-y-px hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 border border-border text-text-primary font-medium rounded-md transition-all duration-fast hover:bg-bg-secondary hover:border-border-hover focus-visible:outline-2 focus-visible:outline-border focus-visible:outline-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;