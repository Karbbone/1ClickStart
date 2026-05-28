import type { Project } from "../types";
import { ProjectCard } from "./ProjectCard";
import { AddProjectButton } from "./AddProjectButton";

interface ProjectGridProps {
  projects: Project[];
  onDelete?: (id: string) => void;
  onLaunch?: (id: string) => void;
}

export function ProjectGrid({
  projects,
  onDelete,
  onLaunch,
}: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={onDelete}
          onLaunch={onLaunch}
        />
      ))}
      <AddProjectButton variant="card" />
    </div>
  );
}
