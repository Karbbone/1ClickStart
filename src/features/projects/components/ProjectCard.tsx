import { Play, GearSix, Trash } from "@phosphor-icons/react";
import { useNavigate } from "react-router";
import type { Project } from "../types";

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
  onLaunch?: (id: string) => void;
}

export function ProjectCard({ project, onDelete, onLaunch }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <div
      data-testid="project-card"
      className="group relative bg-base-200 border border-base-300 rounded-xl p-4 overflow-hidden transition-colors hover:border-base-content/20"
    >
      <h3 className="font-semibold text-base-content">{project.name}</h3>
      <p className="text-sm text-base-content/50 mt-1">{project.path}</p>
      <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-2 px-4 pb-3 pt-8 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-200">
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
