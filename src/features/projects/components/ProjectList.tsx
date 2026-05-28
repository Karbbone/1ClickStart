import type { Project } from "../types";
import { ProjectRow } from "./ProjectRow";
import { AddProjectButton } from "./AddProjectButton";

interface ProjectListProps {
  projects: Project[];
  onDelete?: (id: string) => void;
  onLaunch?: (id: string) => void;
}

export function ProjectList({
  projects,
  onDelete,
  onLaunch,
}: ProjectListProps) {
  return (
    <div className="flex flex-col gap-2">
      {projects.map((project) => (
        <ProjectRow
          key={project.id}
          project={project}
          onDelete={onDelete}
          onLaunch={onLaunch}
        />
      ))}
      <AddProjectButton variant="row" />
    </div>
  );
}
