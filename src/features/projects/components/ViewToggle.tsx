import { SquaresFour, List } from "@phosphor-icons/react";
import type { ViewMode } from "../types";

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="join">
      <button
        className={`join-item btn btn-sm ${view === "grid" ? "btn-active" : ""}`}
        onClick={() => onViewChange("grid")}
        aria-label="Grille"
      >
        <SquaresFour size={16} />
      </button>
      <button
        className={`join-item btn btn-sm ${view === "list" ? "btn-active" : ""}`}
        onClick={() => onViewChange("list")}
        aria-label="Liste"
      >
        <List size={16} />
      </button>
    </div>
  );
}
