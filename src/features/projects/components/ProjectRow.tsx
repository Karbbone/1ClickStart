import { Play, GearSix, Trash } from "@phosphor-icons/react";
import { useNavigate } from "react-router";
import type { Project } from "../types";

interface ProjectRowProps {
  project: Project;
  onDelete?: (id: string) => void;
  onLaunch?: (id: string) => void;
}

export function ProjectRow({ project, onDelete, onLaunch }: ProjectRowProps) {
  const navigate = useNavigate();

  return (
    <div
      data-testid="project-row"
      className="group flex items-center gap-3 bg-base-200 border border-base-300 rounded-lg px-4 py-3 transition-colors hover:border-base-content/20"
    >
      <div className="flex-1">
        <h3 className="font-semibold text-base-content">{project.name}</h3>
        <p className="text-sm text-base-content/50">{project.path}</p>
      </div>
      <div className="flex gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
        <button
          aria-label="Supprimer"
          className="btn btn-sm btn-ghost text-base-content/40 hover:text-error"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(project.id);
          }}
        >
          <Trash size={16} />
        </button>
        <button
          aria-label="Configurer"
          className="btn btn-sm btn-ghost text-base-content/60 hover:text-base-content"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/projects/${project.id}/edit`);
          }}
        >
          <GearSix size={18} />
        </button>
        <button
          aria-label="Lancer"
          className="btn btn-sm btn-success gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onLaunch?.(project.id);
          }}
        >
          <Play size={14} weight="fill" />
          Lancer
        </button>
      </div>
    </div>
  );
}
