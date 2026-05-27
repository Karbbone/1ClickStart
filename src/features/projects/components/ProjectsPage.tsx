import { useState } from "react";
import { mockProjects } from "../data";
import { ProjectGrid } from "./ProjectGrid";
import { ProjectList } from "./ProjectList";
import { ViewToggle } from "./ViewToggle";
import type { ViewMode } from "../types";

export function ProjectsPage() {
  const [view, setView] = useState<ViewMode>("list");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Mes Projets</h1>
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      {view === "grid" ? (
        <ProjectGrid projects={mockProjects} />
      ) : (
        <ProjectList projects={mockProjects} />
      )}
    </div>
  );
}
