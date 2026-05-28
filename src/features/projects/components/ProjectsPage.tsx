import { useState, useEffect, useCallback } from "react";
import { ProjectGrid } from "./ProjectGrid";
import { ProjectList } from "./ProjectList";
import { ViewToggle } from "./ViewToggle";
import { listProjects, deleteProject, launchProject } from "../api";
import type { ViewMode } from "../types";
import type { Project } from "../types";

export function ProjectsPage() {
  const [view, setView] = useState<ViewMode>("list");
  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = useCallback(() => {
    listProjects()
      .then(setProjects)
      .catch((err) => console.error("Failed to load projects:", err));
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function handleDelete(id: string) {
    await deleteProject(id);
    loadProjects();
  }

  async function handleLaunch(id: string) {
    await launchProject(id);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Mes Projets</h1>
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      {view === "grid" ? (
        <ProjectGrid
          projects={projects}
          onDelete={handleDelete}
          onLaunch={handleLaunch}
        />
      ) : (
        <ProjectList
          projects={projects}
          onDelete={handleDelete}
          onLaunch={handleLaunch}
        />
      )}
    </div>
  );
}
