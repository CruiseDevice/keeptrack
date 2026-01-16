import React, { SyntheticEvent, useState } from "react";
import { Project, ProjectStatus } from "./Project";

interface ProjectFormProps {
  project: Project;
  onCancel: () => void;
  onSave: (project: Project) => void;
}

function ProjectForm({project: initialProject, onCancel, onSave}: ProjectFormProps) {
  const [project, setProject] = useState(initialProject);
  
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
    <div>
      <form
        className="input-group vertical"
        onSubmit={handleSubmit}>
        <label htmlFor="name">Project Name</label>
        <input 
          type="text" 
          name="name" 
          placeholder="enter name"
          value={project.name}
          onChange={handleChange}/>
        {
          errors.name.length > 0 && (
            <div className='card error'>
              <p>{errors.name}</p>
            </div>
          )
        }

        <label htmlFor="description">Project Description</label>
        <textarea 
          name="description" 
          placeholder="enter description"
          value={project.description}
          onChange={handleChange}></textarea>
        {
          errors.description.length > 0 && (
            <div className='card error'>
              <p>{errors.description}</p>
            </div>
          )
        }

        <label htmlFor="budget">Project Budget</label>
        <input
          type="number"
          name="budget"
          placeholder="enter budget"
          value={project.budget}
          onChange={handleChange}/>
        {
          errors.budget.length > 0 && (
            <div className='card error'>
              <p>{errors.budget}</p>
            </div>
          )
        }

        <label htmlFor="status">Status</label>
        <select
          name="status"
          value={project.status}
          onChange={handleChange}>
          <option value="backlog">Backlog</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
          <option value="blocked">Blocked</option>
        </select>
        {
          errors.status.length > 0 && (
            <div className='card error'>
              <p>{errors.status}</p>
            </div>
          )
        }

        <label htmlFor="isActive">Active?</label>
        <input 
          type="checkbox" 
          name="isActive"
          checked={project.isActive}
          onChange={handleChange} />
        
        <div className="input-group">
          <button className="primary bordered medium">Save</button>
          <span />
          <button 
            type="button"
            className="bordered medium"
            onClick={onCancel}>
            cancel
          </button>
        </div>
      </form>
    </div>  
  );
}

export default ProjectForm;