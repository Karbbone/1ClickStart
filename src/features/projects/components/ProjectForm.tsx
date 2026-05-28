import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import {
  FolderOpen,
  Plus,
  Trash,
  Globe,
  Terminal,
} from "@phosphor-icons/react";
import { projectFormSchema } from "../validation";
import type { ProjectAction } from "../types";

interface ProjectFormProps {
  initialName?: string;
  initialPath?: string;
  initialActions?: ProjectAction[];
  submitLabel: string;
  loading: boolean;
  onSubmit: (name: string, path: string, actions: ProjectAction[]) => void;
  onCancel: () => void;
}

export function ProjectForm({
  initialName = "",
  initialPath = "",
  initialActions = [],
  submitLabel,
  loading,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [path, setPath] = useState(initialPath);
  const [name, setName] = useState(initialName);
  const [actions, setActions] = useState<ProjectAction[]>(initialActions);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSelectFolder() {
    const selected = await open({ directory: true, multiple: false });
    if (selected) {
      setPath(selected);
      const folderName = selected.split(/[/\\]/).pop() ?? "";
      if (!name) {
        setName(folderName);
      }
      setErrors((prev) => ({ ...prev, path: "" }));
    }
  }

  function addAction(type: "open_browser" | "run_terminal" | "open_terminal") {
    if (type === "open_browser") {
      setActions([...actions, { type: "open_browser", url: "" }]);
    } else if (type === "run_terminal") {
      setActions([
        ...actions,
        { type: "run_terminal", command: "", open_in_terminal: false },
      ]);
    } else {
      setActions([...actions, { type: "open_terminal" }]);
    }
  }

  function updateAction(index: number, value: string) {
    setActions(
      actions.map((a, i) => {
        if (i !== index) return a;
        if (a.type === "open_browser") return { ...a, url: value };
        if (a.type === "run_terminal") return { ...a, command: value };
        return a;
      }),
    );
  }

  function toggleOpenInTerminal(index: number) {
    setActions(
      actions.map((a, i) => {
        if (i !== index || a.type !== "run_terminal") return a;
        return { ...a, open_in_terminal: !a.open_in_terminal };
      }),
    );
  }

  function removeAction(index: number) {
    setActions(actions.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    const result = projectFormSchema.safeParse({ name, path, actions });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onSubmit(name, path, actions);
  }

  function actionError(index: number): string | undefined {
    return (
      errors[`actions.${index}.url`] ||
      errors[`actions.${index}.command`] ||
      undefined
    );
  }

  return (
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
            className={`input input-bordered join-item flex-1 ${errors.path ? "input-error" : ""}`}
          />
          <button
            onClick={handleSelectFolder}
            className="btn btn-neutral join-item"
          >
            <FolderOpen size={18} />
            Parcourir
          </button>
        </div>
        {errors.path && (
          <p className="text-error text-xs mt-1">{errors.path}</p>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Nom du projet</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
          placeholder="Nom du projet..."
          className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
        />
        {errors.name && (
          <p className="text-error text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="label">
          <span className="label-text">Actions au lancement</span>
        </label>
        <div className="flex flex-col gap-2">
          {actions.map((action, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-base-content/50">
                  {action.type === "open_browser" && <Globe size={16} />}
                  {action.type === "run_terminal" && <Terminal size={16} />}
                  {action.type === "open_terminal" && <Terminal size={16} />}
                </div>
                {action.type === "open_terminal" ? (
                  <span className="text-sm text-base-content/70 flex-1">
                    Ouvrir un terminal dans le dossier du projet
                  </span>
                ) : (
                  <input
                    type="text"
                    value={
                      action.type === "open_browser"
                        ? action.url
                        : action.command
                    }
                    onChange={(e) => updateAction(index, e.target.value)}
                    placeholder={
                      action.type === "open_browser"
                        ? "https://..."
                        : "npm run dev, docker compose up..."
                    }
                    className={`input input-bordered input-sm flex-1 ${actionError(index) ? "input-error" : ""}`}
                  />
                )}
                <button
                  onClick={() => removeAction(index)}
                  className="btn btn-ghost btn-sm btn-square text-base-content/40 hover:text-error"
                >
                  <Trash size={14} />
                </button>
              </div>
              {actionError(index) && (
                <p className="text-error text-xs ml-7">{actionError(index)}</p>
              )}
              {action.type === "run_terminal" && (
                <label className="flex items-center gap-2 ml-7 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs"
                    checked={action.open_in_terminal}
                    onChange={() => toggleOpenInTerminal(index)}
                  />
                  <span className="text-xs text-base-content/50">
                    Ouvrir dans un terminal
                  </span>
                </label>
              )}
            </div>
          ))}
        </div>
        <div className="dropdown dropdown-top mt-2">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-sm gap-1 text-base-content/50"
          >
            <Plus size={14} />
            Ajouter une action
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-200 rounded-box z-10 w-56 p-2 shadow-lg"
          >
            <li>
              <button
                onClick={() => {
                  addAction("open_terminal");
                  document.activeElement instanceof HTMLElement &&
                    document.activeElement.blur();
                }}
              >
                <Terminal size={16} />
                Ouvrir un terminal
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  addAction("run_terminal");
                  document.activeElement instanceof HTMLElement &&
                    document.activeElement.blur();
                }}
              >
                <Terminal size={16} />
                Commande terminal
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  addAction("open_browser");
                  document.activeElement instanceof HTMLElement &&
                    document.activeElement.blur();
                }}
              >
                <Globe size={16} />
                Ouvrir une page web
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onCancel} className="btn btn-ghost">
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn btn-success"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </div>
  );
}
