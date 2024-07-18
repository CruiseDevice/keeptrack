import React from "react";
import PropTypes from 'prop-types';
import { Project } from "./Project";

function ProjectCard(props) {
  const {project} = props;

  const handleEditClick = (project) => {
    console.log(project);
  }

  return (
    <div key={project.id} className="cols-sm">
      <div className="card">
        <img src={project.imageUrl} alt={project.name}/>
        <section className="section dark">
          <h5 className="strong">
            <strong>{project.name}</strong>
          </h5>
          <p>{project.description}</p>
          <p>Budget: {project.budget.toLocaleString()}</p>
          <button
            className="bordered"
            onClick={() => {
              handleEditClick(project)
            }}>
            <span className="icon-edit"></span>
              Edit
          </button>
        </section>
      </div>
    </div>
  )
}

ProjectCard.propTypes = {
  project: PropTypes.instanceOf(Project).isRequired,
}

export default ProjectCard;