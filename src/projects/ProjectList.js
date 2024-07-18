import React from "react";
import PropTypes from 'prop-types';
import {Project} from './Project';
import ProjectCard from "./ProjectCard";

function ProjectList ({projects}) {
  return (
    <div className="row">
      {projects.map((project) => (
        <ProjectCard project={project}/>
      ))}
    </div>
  )
}

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.instanceOf(Project)).isRequired
};

export default ProjectList;