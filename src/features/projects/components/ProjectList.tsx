import type { Project } from "../types";
import { ProjectRow } from "./ProjectRow";
import { AddProjectButton } from "./AddProjectButton";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="flex flex-col gap-2">
      {projects.map((project) => (
        <ProjectRow key={project.id} project={project} />
      ))}
      <AddProjectButton variant="row" />
    </div>
  );
}
