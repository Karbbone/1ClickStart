import type { Project } from "../types";
import { ProjectRow } from "./ProjectRow";
import { AddProjectButton } from "./AddProjectButton";

interface ProjectListProps {
  projects: Project[];
  onDelete?: (id: string) => void;
}

export function ProjectList({ projects, onDelete }: ProjectListProps) {
  return (
    <div className="flex flex-col gap-2">
      {projects.map((project) => (
        <ProjectRow key={project.id} project={project} onDelete={onDelete} />
      ))}
      <AddProjectButton variant="row" />
    </div>
  );
}
