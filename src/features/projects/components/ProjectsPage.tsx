import { useState, useEffect, useCallback } from "react";
import { ProjectGrid } from "./ProjectGrid";
import { ProjectList } from "./ProjectList";
import { ViewToggle } from "./ViewToggle";
import { listProjects, deleteProject, launchProject } from "../api";
import { useToast } from "@/features/shell";
import type { ViewMode } from "../types";
import type { Project } from "../types";

export function ProjectsPage() {
  const [view, setView] = useState<ViewMode>("list");
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  const loadProjects = useCallback(() => {
    listProjects()
      .then(setProjects)
      .catch(() => toast.error("Échec du chargement des projets"));
  }, [toast]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function handleDelete(id: string) {
    try {
      await deleteProject(id);
      toast.success("Projet supprimé avec succès");
      loadProjects();
    } catch {
      toast.error("Échec de la suppression du projet");
    }
  }

  async function handleLaunch(id: string) {
    try {
      await launchProject(id);
      toast.success("Projet lancé avec succès");
    } catch (err) {
      toast.error(
        `Échec du lancement : ${err instanceof Error ? err.message : "erreur inconnue"}`,
      );
    }
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
