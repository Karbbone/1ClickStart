import { invoke } from "@tauri-apps/api/core";
import type { Project } from "./types";

export async function listProjects(): Promise<Project[]> {
  return invoke<Project[]>("list_projects");
}

export async function createProject(
  name: string,
  path: string,
): Promise<Project> {
  return invoke<Project>("create_project", { request: { name, path } });
}
