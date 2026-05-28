import { useState, useEffect } from "react";
import { ProjectGrid } from "./ProjectGrid";
import { ProjectList } from "./ProjectList";
import { ViewToggle } from "./ViewToggle";
import { listProjects } from "../api";
import type { ViewMode } from "../types";
import type { Project } from "../types";

export function ProjectsPage() {
  const [view, setView] = useState<ViewMode>("list");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    listProjects()
      .then(setProjects)
      .catch((err) => console.error("Failed to load projects:", err));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Mes Projets</h1>
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      {view === "grid" ? (
        <ProjectGrid projects={projects} />
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  );
}
