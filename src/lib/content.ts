import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";

export const getProjects = async () => {
  return projects;
};

export const getExperiences = async () => {
  return experiences;
};
