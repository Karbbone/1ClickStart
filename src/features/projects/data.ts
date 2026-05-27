import type { Project } from "./types";

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Mon App Web",
    stack: ["React", "Docker", "Redis"],
  },
  {
    id: "2",
    name: "API Backend",
    stack: ["Rust", "PostgreSQL"],
  },
  {
    id: "3",
    name: "Mobile App",
    stack: ["React Native", "Firebase"],
  },
];
