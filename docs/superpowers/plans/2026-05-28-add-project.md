# Add Project Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to create projects by selecting a folder, with persistence via tauri-plugin-store and folder selection via tauri-plugin-dialog.

**Architecture:** Frontend feature `projects` gets a new page `/projects/new` with a form. Backend gets hexagonal architecture: domain model + port, application commands, infrastructure adapter using tauri-plugin-store. Plugins dialog and store are wired in Tauri.

**Tech Stack:** React 19, React Router 7, DaisyUI 5, Phosphor Icons, Tauri v2, tauri-plugin-store, tauri-plugin-dialog, Rust

---

## File Structure

```
src-tauri/
├── Cargo.toml                              # Modify — add plugin deps
├── capabilities/default.json               # Modify — add permissions
├── src/
│   ├── lib.rs                              # Modify — register plugins + commands
│   ├── domain/
│   │   ├── mod.rs                          # Create
│   │   ├── models/
│   │   │   ├── mod.rs                      # Create
│   │   │   └── project.rs                  # Create — Project struct
│   │   └── ports/
│   │       ├── mod.rs                      # Create
│   │       └── project_repository.rs       # Create — trait ProjectRepository
│   ├── application/
│   │   ├── mod.rs                          # Create
│   │   ├── commands/
│   │   │   ├── mod.rs                      # Create
│   │   │   └── project_commands.rs         # Create — Tauri commands
│   │   └── dto/
│   │       ├── mod.rs                      # Create
│   │       └── project_dto.rs              # Create — serde DTOs
│   └── infrastructure/
│       ├── mod.rs                          # Create
│       └── store_project_repository.rs     # Create — tauri-plugin-store adapter

src/
├── App.tsx                                 # Modify — add /projects/new route
├── features/projects/
│   ├── api.ts                              # Create — Tauri invoke wrappers
│   ├── components/
│   │   ├── NewProjectPage.tsx              # Create — form page
│   │   ├── AddProjectButton.tsx            # Create — "+" button
│   │   ├── ProjectGrid.tsx                 # Modify — add "+" button
│   │   ├── ProjectList.tsx                 # Modify — add "+" button
│   │   └── ProjectsPage.tsx               # Modify — load from backend
│   └── index.ts                            # Modify — add exports
```

---

### Task 1: Install Tauri plugins (Rust + JS)

**Files:**

- Modify: `src-tauri/Cargo.toml`
- Modify: `package.json`

- [ ] **Step 1: Add Rust plugin dependencies**

Add to `[dependencies]` in `src-tauri/Cargo.toml`:

```toml
tauri-plugin-store = "2"
tauri-plugin-dialog = "2"
```

The full `[dependencies]` section becomes:

```toml
[dependencies]
tauri = { version = "2", features = [] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tauri-plugin-store = "2"
tauri-plugin-dialog = "2"
```

- [ ] **Step 2: Install JS bindings**

Run:

```bash
bun add @tauri-apps/plugin-store @tauri-apps/plugin-dialog
```

- [ ] **Step 3: Add permissions to capabilities**

Update `src-tauri/capabilities/default.json`:

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Capability for the main window",
  "windows": ["main"],
  "permissions": ["core:default", "store:default", "dialog:default"]
}
```

- [ ] **Step 4: Verify Rust compiles**

Run:

```bash
cd src-tauri && cargo check
```

Expected: compiles without errors.

- [ ] **Step 5: Commit**

```bash
git add src-tauri/Cargo.toml src-tauri/Cargo.lock src-tauri/capabilities/default.json package.json bun.lock
git commit -m "chore: add tauri-plugin-store and tauri-plugin-dialog"
```

---

### Task 2: Domain layer — Project model and port

**Files:**

- Create: `src-tauri/src/domain/mod.rs`
- Create: `src-tauri/src/domain/models/mod.rs`
- Create: `src-tauri/src/domain/models/project.rs`
- Create: `src-tauri/src/domain/ports/mod.rs`
- Create: `src-tauri/src/domain/ports/project_repository.rs`

- [ ] **Step 1: Create domain module**

Create `src-tauri/src/domain/mod.rs`:

```rust
pub mod models;
pub mod ports;
```

- [ ] **Step 2: Create Project model**

Create `src-tauri/src/domain/models/mod.rs`:

```rust
pub mod project;
pub use project::Project;
```

Create `src-tauri/src/domain/models/project.rs`:

```rust
#[derive(Debug, Clone, PartialEq)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub path: String,
}

impl Project {
    pub fn new(name: String, path: String) -> Self {
        let id = uuid_v4();
        Self { id, name, path }
    }
}

fn uuid_v4() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    format!("{:x}", timestamp)
}
```

Note: Simple timestamp-based ID. No `uuid` crate needed (YAGNI).

- [ ] **Step 3: Create ProjectRepository port**

Create `src-tauri/src/domain/ports/mod.rs`:

```rust
pub mod project_repository;
pub use project_repository::ProjectRepository;
```

Create `src-tauri/src/domain/ports/project_repository.rs`:

```rust
use crate::domain::models::Project;

pub trait ProjectRepository: Send + Sync {
    fn list(&self) -> Result<Vec<Project>, String>;
    fn save(&self, project: &Project) -> Result<(), String>;
}
```

- [ ] **Step 4: Verify compilation**

Run:

```bash
cd src-tauri && cargo check
```

Note: `lib.rs` needs `mod domain;` added for this to compile. Add it:

At the top of `src-tauri/src/lib.rs`, add:

```rust
mod domain;
```

Expected: compiles without errors.

- [ ] **Step 5: Commit**

```bash
git add src-tauri/src/domain/ src-tauri/src/lib.rs
git commit -m "feat: add Project domain model and ProjectRepository port"
```

---

### Task 3: Application layer — DTOs and commands

**Files:**

- Create: `src-tauri/src/application/mod.rs`
- Create: `src-tauri/src/application/dto/mod.rs`
- Create: `src-tauri/src/application/dto/project_dto.rs`
- Create: `src-tauri/src/application/commands/mod.rs`
- Create: `src-tauri/src/application/commands/project_commands.rs`
- Modify: `src-tauri/src/lib.rs`

- [ ] **Step 1: Create application module**

Create `src-tauri/src/application/mod.rs`:

```rust
pub mod commands;
pub mod dto;
```

- [ ] **Step 2: Create DTOs**

Create `src-tauri/src/application/dto/mod.rs`:

```rust
pub mod project_dto;
pub use project_dto::{ProjectDto, CreateProjectRequest};
```

Create `src-tauri/src/application/dto/project_dto.rs`:

```rust
use serde::{Deserialize, Serialize};
use crate::domain::models::Project;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectDto {
    pub id: String,
    pub name: String,
    pub path: String,
}

impl From<Project> for ProjectDto {
    fn from(p: Project) -> Self {
        Self {
            id: p.id,
            name: p.name,
            path: p.path,
        }
    }
}

impl From<ProjectDto> for Project {
    fn from(dto: ProjectDto) -> Self {
        Self {
            id: dto.id,
            name: dto.name,
            path: dto.path,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateProjectRequest {
    pub name: String,
    pub path: String,
}
```

- [ ] **Step 3: Create Tauri commands**

Create `src-tauri/src/application/commands/mod.rs`:

```rust
pub mod project_commands;
pub use project_commands::{create_project, list_projects};
```

Create `src-tauri/src/application/commands/project_commands.rs`:

```rust
use tauri::State;
use std::sync::Mutex;
use crate::domain::models::Project;
use crate::domain::ports::ProjectRepository;
use crate::application::dto::{CreateProjectRequest, ProjectDto};

#[tauri::command]
pub fn list_projects(
    repo: State<'_, Mutex<Box<dyn ProjectRepository>>>,
) -> Result<Vec<ProjectDto>, String> {
    let repo = repo.lock().map_err(|e| e.to_string())?;
    let projects = repo.list()?;
    Ok(projects.into_iter().map(ProjectDto::from).collect())
}

#[tauri::command]
pub fn create_project(
    request: CreateProjectRequest,
    repo: State<'_, Mutex<Box<dyn ProjectRepository>>>,
) -> Result<ProjectDto, String> {
    let project = Project::new(request.name, request.path);
    let repo = repo.lock().map_err(|e| e.to_string())?;
    repo.save(&project)?;
    Ok(ProjectDto::from(project))
}
```

- [ ] **Step 4: Add module declaration to lib.rs**

Add at the top of `src-tauri/src/lib.rs`:

```rust
mod application;
```

- [ ] **Step 5: Verify compilation**

Run:

```bash
cd src-tauri && cargo check
```

Expected: compiles without errors.

- [ ] **Step 6: Commit**

```bash
git add src-tauri/src/application/ src-tauri/src/lib.rs
git commit -m "feat: add application layer with DTOs and Tauri commands"
```

---

### Task 4: Infrastructure layer — Store adapter

**Files:**

- Create: `src-tauri/src/infrastructure/mod.rs`
- Create: `src-tauri/src/infrastructure/store_project_repository.rs`
- Modify: `src-tauri/src/lib.rs`

- [ ] **Step 1: Create infrastructure module**

Create `src-tauri/src/infrastructure/mod.rs`:

```rust
pub mod store_project_repository;
pub use store_project_repository::StoreProjectRepository;
```

- [ ] **Step 2: Implement StoreProjectRepository**

Create `src-tauri/src/infrastructure/store_project_repository.rs`:

```rust
use crate::application::dto::ProjectDto;
use crate::domain::models::Project;
use crate::domain::ports::ProjectRepository;
use tauri_plugin_store::Store;
use tauri::Wry;
use std::sync::Arc;

const PROJECTS_KEY: &str = "projects";

pub struct StoreProjectRepository {
    store: Arc<Store<Wry>>,
}

impl StoreProjectRepository {
    pub fn new(store: Arc<Store<Wry>>) -> Self {
        Self { store }
    }
}

impl ProjectRepository for StoreProjectRepository {
    fn list(&self) -> Result<Vec<Project>, String> {
        let projects: Vec<ProjectDto> = self
            .store
            .get(PROJECTS_KEY)
            .and_then(|v| serde_json::from_value(v).ok())
            .unwrap_or_default();
        Ok(projects.into_iter().map(Project::from).collect())
    }

    fn save(&self, project: &Project) -> Result<(), String> {
        let mut projects = self.list()?;
        projects.push(project.clone());
        let dtos: Vec<ProjectDto> = projects.into_iter().map(ProjectDto::from).collect();
        self.store
            .set(PROJECTS_KEY, serde_json::to_value(dtos).map_err(|e| e.to_string())?);
        self.store.save().map_err(|e| e.to_string())?;
        Ok(())
    }
}
```

- [ ] **Step 3: Wire everything in lib.rs**

Replace `src-tauri/src/lib.rs` entirely:

```rust
mod application;
mod domain;
mod infrastructure;

use application::commands::{create_project, list_projects};
use infrastructure::StoreProjectRepository;
use std::sync::Mutex;
use tauri_plugin_store::StoreExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let store = app.store("projects.json")?;
            let repo = StoreProjectRepository::new(store);
            let repo: Box<dyn domain::ports::ProjectRepository> = Box::new(repo);
            app.manage(Mutex::new(repo));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![create_project, list_projects])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

- [ ] **Step 4: Verify compilation**

Run:

```bash
cd src-tauri && cargo check
```

Expected: compiles without errors. If there are type issues with the Store API, check the exact `tauri_plugin_store` v2 API and adjust.

- [ ] **Step 5: Commit**

```bash
git add src-tauri/src/infrastructure/ src-tauri/src/lib.rs
git commit -m "feat: add StoreProjectRepository and wire plugins in lib.rs"
```

---

### Task 5: Frontend — API layer and AddProjectButton

**Files:**

- Create: `src/features/projects/api.ts`
- Create: `src/features/projects/components/AddProjectButton.tsx`
- Modify: `src/features/projects/index.ts`

- [ ] **Step 1: Create API layer**

Create `src/features/projects/api.ts`:

```ts
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
```

- [ ] **Step 2: Create AddProjectButton for grid view**

Create `src/features/projects/components/AddProjectButton.tsx`:

```tsx
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
```

- [ ] **Step 3: Update barrel export**

Read `src/features/projects/index.ts` first, then add:

```ts
export { AddProjectButton } from "./components/AddProjectButton";
```

- [ ] **Step 4: Add AddProjectButton to ProjectGrid**

Update `src/features/projects/components/ProjectGrid.tsx`:

```tsx
import type { Project } from "../types";
import { ProjectCard } from "./ProjectCard";
import { AddProjectButton } from "./AddProjectButton";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
      <AddProjectButton variant="card" />
    </div>
  );
}
```

- [ ] **Step 5: Add AddProjectButton to ProjectList**

Update `src/features/projects/components/ProjectList.tsx`:

```tsx
import type { Project } from "../types";
import { ProjectRow } from "./ProjectRow";
import { AddProjectButton } from "./AddProjectButton";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="flex flex-col gap-2">
      {projects.map((project) => (
        <ProjectRow key={project.id} project={project} />
      ))}
      <AddProjectButton variant="row" />
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/features/projects/
git commit -m "feat: add API layer and AddProjectButton to grid/list"
```

---

### Task 6: Frontend — NewProjectPage

**Files:**

- Create: `src/features/projects/components/NewProjectPage.tsx`
- Modify: `src/features/projects/index.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create NewProjectPage**

Create `src/features/projects/components/NewProjectPage.tsx`:

```tsx
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
            <span className="label-text">Dossier</span>
          </label>
          <div className="join w-full">
            <input
              type="text"
              readOnly
              value={path}
              placeholder="Sélectionner un dossier..."
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
```

- [ ] **Step 2: Update barrel export**

Read `src/features/projects/index.ts`, then add:

```ts
export { NewProjectPage } from "./components/NewProjectPage";
```

- [ ] **Step 3: Add route in App.tsx**

Update `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from "react-router";
import { AppLayout } from "@/features/shell";
import { ProjectsPage, NewProjectPage } from "@/features/projects";
import { SettingsPage } from "@/features/settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<ProjectsPage />} />
          <Route path="projects/new" element={<NewProjectPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/features/projects/ src/App.tsx
git commit -m "feat: add NewProjectPage with folder picker and project creation"
```

---

### Task 7: Frontend — Load projects from backend

**Files:**

- Modify: `src/features/projects/components/ProjectsPage.tsx`

- [ ] **Step 1: Replace mock data with backend call**

Update `src/features/projects/components/ProjectsPage.tsx`:

```tsx
import { useState, useEffect } from "react";
import { ProjectGrid } from "./ProjectGrid";
import { ProjectList } from "./ProjectList";
import { ViewToggle } from "./ViewToggle";
import { listProjects } from "../api";
import type { ViewMode } from "../types";
import type { Project } from "../types";

export function ProjectsPage() {
  const [view, setView] = useState<ViewMode>("list");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    listProjects().then(setProjects);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Mes Projets</h1>
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      {view === "grid" ? (
        <ProjectGrid projects={projects} />
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Remove mock data file**

Delete `src/features/projects/data.ts` — no longer needed.

```bash
rm src/features/projects/data.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/features/projects/
git commit -m "feat: load projects from backend instead of mock data"
```

---

### Task 8: Integration test — full flow

- [ ] **Step 1: Run TypeScript check**

Run:

```bash
bun run build
```

Expected: no TypeScript errors.

- [ ] **Step 2: Run existing tests**

Run:

```bash
bun run test
```

Note: some tests may need updating since ProjectsPage now calls `listProjects()` which requires Tauri. Tests that import ProjectsPage may need the invoke mocked. Fix as needed.

- [ ] **Step 3: Run full Tauri dev**

Run:

```bash
bun run tauri dev
```

Verify:

- Home page loads with empty project list
- "+" button visible at end of list
- Click "+" → navigates to `/projects/new`
- Click "Parcourir" → native folder dialog opens
- Select folder → path shown, name auto-filled with folder name
- Click "Créer" → returns to home, project visible in list
- Project persists after app restart

- [ ] **Step 4: Run Rust checks**

Run:

```bash
cd src-tauri && cargo clippy
```

Fix any warnings.

- [ ] **Step 5: Final commit if any fixes**

```bash
git add -A
git commit -m "fix: integration fixes for add-project flow"
```
