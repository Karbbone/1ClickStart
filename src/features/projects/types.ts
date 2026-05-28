export type ViewMode = "grid" | "list";

export type ProjectAction =
  | { type: "open_browser"; url: string }
  | { type: "run_terminal"; command: string; open_in_terminal: boolean }
  | { type: "open_terminal" };

export interface Project {
  id: string;
  name: string;
  path: string;
  actions: ProjectAction[];
}
