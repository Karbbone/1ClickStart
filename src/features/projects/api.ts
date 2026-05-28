import { invoke } from "@tauri-apps/api/core";
import type { Project, ProjectAction } from "./types";

export async function listProjects(): Promise<Project[]> {
  return invoke<Project[]>("list_projects");
}

export async function createProject(
  name: string,
  path: string,
  actions: ProjectAction[],
): Promise<Project> {
  return invoke<Project>("create_project", {
    request: { name, path, actions },
  });
}

export async function updateProject(
  id: string,
  name: string,
  path: string,
  actions: ProjectAction[],
): Promise<Project> {
  return invoke<Project>("update_project", {
    request: { id, name, path, actions },
  });
}

export async function deleteProject(id: string): Promise<void> {
  return invoke("delete_project", { id });
}

export async function launchProject(id: string): Promise<void> {
  return invoke("launch_project", { id });
}
