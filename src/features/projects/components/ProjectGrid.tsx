import type { Project } from "../types";
import { ProjectCard } from "./ProjectCard";
import { AddProjectButton } from "./AddProjectButton";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
      <AddProjectButton variant="card" />
    </div>
  );
}
