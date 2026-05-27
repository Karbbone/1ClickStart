import { Play, GearSix } from "@phosphor-icons/react";
import type { Project } from "../types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      data-testid="project-card"
      className="group relative bg-base-200 border border-base-300 rounded-xl p-4 overflow-hidden transition-colors hover:border-base-content/20"
    >
      <h3 className="font-semibold text-base-content">{project.name}</h3>
      <p className="text-sm text-base-content/50 mt-1">
        {project.stack.join(" · ")}
      </p>
      <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-2 px-4 pb-3 pt-8 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-200">
        <button
          aria-label="Configurer"
          className="btn btn-sm btn-ghost text-base-content/60 hover:text-base-content"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <GearSix size={18} />
        </button>
        <button
          aria-label="Lancer"
          className="btn btn-sm btn-success gap-1"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Play size={14} weight="fill" />
          Lancer
        </button>
      </div>
    </div>
  );
}
