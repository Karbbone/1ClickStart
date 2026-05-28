import { useState } from "react";
import { useNavigate } from "react-router";
import { open } from "@tauri-apps/plugin-dialog";
import { ArrowLeft, FolderOpen } from "@phosphor-icons/react";
import { createProject } from "../api";

export function NewProjectPage() {
  const navigate = useNavigate();
  const [path, setPath] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSelectFolder() {
    const selected = await open({ directory: true, multiple: false });
    if (selected) {
      setPath(selected);
      const folderName = selected.split(/[/\\]/).pop() ?? "";
      if (!name) {
        setName(folderName);
      }
    }
  }

  async function handleCreate() {
    if (!path || !name) return;
    setLoading(true);
    try {
      await createProject(name, path);
      navigate("/");
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

      <div className="flex flex-col gap-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Dossier du projet</span>
          </label>
          <div className="join w-full">
            <input
              type="text"
              readOnly
              value={path}
              placeholder="Sélectionner le dossier de votre projet..."
              className="input input-bordered join-item flex-1"
            />
            <button
              onClick={handleSelectFolder}
              className="btn btn-neutral join-item"
            >
              <FolderOpen size={18} />
              Parcourir
            </button>
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Nom du projet</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du projet..."
            className="input input-bordered w-full"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => navigate("/")} className="btn btn-ghost">
            Annuler
          </button>
          <button
            onClick={handleCreate}
            disabled={!path || !name || loading}
            className="btn btn-success"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Créer"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
