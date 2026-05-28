import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "@phosphor-icons/react";
import { listProjects, updateProject } from "../api";
import { useToast } from "@/features/shell";
import { ProjectForm } from "./ProjectForm";
import type { Project, ProjectAction } from "../types";

export function EditProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    listProjects()
      .then((projects) => {
        const found = projects.find((p) => p.id === id);
        if (found) {
          setProject(found);
        } else {
          toast.error("Projet introuvable");
          navigate("/");
        }
      })
      .catch(() => {
        toast.error("Échec du chargement du projet");
        navigate("/");
      });
  }, [id, navigate, toast]);

  async function handleSubmit(
    name: string,
    path: string,
    actions: ProjectAction[],
  ) {
    if (!id) return;
    setLoading(true);
    try {
      await updateProject(id, name, path, actions);
      toast.success("Projet mis à jour avec succès");
      navigate("/");
    } catch {
      toast.error("Échec de la mise à jour du projet");
    } finally {
      setLoading(false);
    }
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/")}
          className="btn btn-ghost btn-sm btn-square"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold">Modifier le projet</h1>
      </div>
      <ProjectForm
        initialName={project.name}
        initialPath={project.path}
        initialActions={project.actions}
        submitLabel="Enregistrer"
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
      />
    </div>
  );
}
