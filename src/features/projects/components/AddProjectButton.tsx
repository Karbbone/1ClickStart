import { Plus } from "@phosphor-icons/react";
import { useNavigate } from "react-router";

interface AddProjectButtonProps {
  variant: "card" | "row";
}

export function AddProjectButton({ variant }: AddProjectButtonProps) {
  const navigate = useNavigate();

  if (variant === "card") {
    return (
      <button
        onClick={() => navigate("/projects/new")}
        className="flex flex-col items-center justify-center gap-2 border border-dashed border-base-300 rounded-xl p-4 min-h-24 hover:border-base-content/30 hover:bg-base-200 transition-colors cursor-pointer"
      >
        <Plus size={24} className="text-base-content/40" />
        <span className="text-sm text-base-content/40">Ajouter un projet</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate("/projects/new")}
      className="flex items-center justify-center gap-2 border border-dashed border-base-300 rounded-lg px-4 py-3 hover:border-base-content/30 hover:bg-base-200 transition-colors cursor-pointer"
    >
      <Plus size={16} className="text-base-content/40" />
      <span className="text-sm text-base-content/40">Ajouter un projet</span>
    </button>
  );
}
