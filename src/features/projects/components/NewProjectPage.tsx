import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "@phosphor-icons/react";
import { createProject } from "../api";
import { useToast } from "@/features/shell";
import { ProjectForm } from "./ProjectForm";
import type { ProjectAction } from "../types";

export function NewProjectPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(
    name: string,
    path: string,
    actions: ProjectAction[],
  ) {
    setLoading(true);
    try {
      await createProject(name, path, actions);
      toast.success("Projet créé avec succès");
      navigate("/");
    } catch {
      toast.error("Échec de la création du projet");
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-xl font-bold">Nouveau projet</h1>
      </div>
      <ProjectForm
        submitLabel="Créer"
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
      />
    </div>
  );
}
