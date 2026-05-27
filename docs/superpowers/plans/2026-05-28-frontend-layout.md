# Frontend Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the app shell (icon sidebar + routing) and the projects homepage with grid/list toggle and hover actions.

**Architecture:** Feature-based structure with 3 features: `shell` (layout + sidebar), `projects` (homepage with project cards), `settings` (empty placeholder). React Router v7 handles navigation between the 2 pages. All data is mocked.

**Tech Stack:** React 19, React Router 7, DaisyUI 5, Tailwind CSS 4, TypeScript, Vitest + React Testing Library

---

## File Structure

```
src/
├── main.tsx                          # Modified — wrap App in RouterProvider
├── App.tsx                           # Modified — replace demo with router setup
├── index.css                         # Modified — add custom hover utilities
├── features/
│   ├── shell/
│   │   ├── components/
│   │   │   ├── AppLayout.tsx         # Create — sidebar + Outlet
│   │   │   ├── Sidebar.tsx           # Create — icon column
│   │   │   └── SidebarIcon.tsx       # Create — icon + tooltip + NavLink
│   │   └── index.ts                  # Create — barrel export
│   ├── projects/
│   │   ├── components/
│   │   │   ├── ProjectsPage.tsx      # Create — page with view toggle + list
│   │   │   ├── ProjectCard.tsx       # Create — grid card with hover actions
│   │   │   ├── ProjectRow.tsx        # Create — list row with hover actions
│   │   │   ├── ProjectGrid.tsx       # Create — grid container
│   │   │   ├── ProjectList.tsx       # Create — list container
│   │   │   └── ViewToggle.tsx        # Create — grid/list switch
│   │   ├── types.ts                  # Create — Project type
│   │   ├── data.ts                   # Create — mock projects
│   │   └── index.ts                  # Create — barrel export
│   └── settings/
│       ├── components/
│       │   └── SettingsPage.tsx       # Create — empty placeholder
│       └── index.ts                  # Create — barrel export
tests/
├── setup.ts                          # Create — testing-library setup
├── features/
│   ├── shell/
│   │   └── AppLayout.test.tsx        # Create
│   └── projects/
│       ├── ProjectCard.test.tsx      # Create
│       ├── ProjectRow.test.tsx       # Create
│       └── ViewToggle.test.tsx       # Create
```

---

### Task 1: Install dependencies

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Install react-router**

Run:

```bash
rtk bun add react-router
```

- [ ] **Step 2: Install test dependencies**

Run:

```bash
rtk bun add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Add vitest config to vite.config.ts**

Modify `vite.config.ts` — add the `/// <reference types="vitest/config" />` triple-slash directive and `test` block:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
  },
});
```

- [ ] **Step 4: Create test setup file**

Create `tests/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Add test script to package.json**

Add to `scripts` in `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: Verify install**

Run:

```bash
rtk bun run test
```

Expected: vitest runs, 0 tests found, exits cleanly.

- [ ] **Step 7: Commit**

```bash
rtk git add package.json bun.lock vite.config.ts tests/setup.ts
rtk git commit -m "chore: add react-router, vitest and testing-library"
```

---

### Task 2: Project type and mock data

**Files:**

- Create: `src/features/projects/types.ts`
- Create: `src/features/projects/data.ts`

- [ ] **Step 1: Create Project type**

Create `src/features/projects/types.ts`:

```ts
export interface Project {
  id: string;
  name: string;
  stack: string[];
}
```

- [ ] **Step 2: Create mock data**

Create `src/features/projects/data.ts`:

```ts
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
```

- [ ] **Step 3: Commit**

```bash
rtk git add src/features/projects/types.ts src/features/projects/data.ts
rtk git commit -m "feat: add Project type and mock data"
```

---

### Task 3: SidebarIcon component

**Files:**

- Create: `src/features/shell/components/SidebarIcon.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/features/shell/SidebarIcon.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { SidebarIcon } from "@/features/shell";

test("renders icon with tooltip", () => {
  render(
    <MemoryRouter>
      <SidebarIcon to="/" icon="🏠" tooltip="Accueil" />
    </MemoryRouter>,
  );
  expect(screen.getByRole("link")).toBeInTheDocument();
  expect(screen.getByRole("link")).toHaveAttribute("href", "/");
});

test("has active style when route matches", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <SidebarIcon to="/" icon="🏠" tooltip="Accueil" />
    </MemoryRouter>,
  );
  expect(screen.getByRole("link")).toHaveClass("bg-base-300");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
rtk vitest run tests/features/shell/SidebarIcon.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement SidebarIcon**

Create `src/features/shell/components/SidebarIcon.tsx`:

```tsx
import { NavLink } from "react-router";

interface SidebarIconProps {
  to: string;
  icon: React.ReactNode;
  tooltip: string;
}

export function SidebarIcon({ to, icon, tooltip }: SidebarIconProps) {
  return (
    <div className="tooltip tooltip-right" data-tip={tooltip}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `btn btn-ghost btn-sm btn-square text-lg ${isActive ? "bg-base-300" : ""}`
        }
      >
        {icon}
      </NavLink>
    </div>
  );
}
```

- [ ] **Step 4: Create barrel export**

Create `src/features/shell/index.ts`:

```ts
export { SidebarIcon } from "./components/SidebarIcon";
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
rtk vitest run tests/features/shell/SidebarIcon.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
rtk git add src/features/shell/ tests/features/shell/
rtk git commit -m "feat: add SidebarIcon component with tooltip and active state"
```

---

### Task 4: Sidebar component

**Files:**

- Create: `src/features/shell/components/Sidebar.tsx`
- Modify: `src/features/shell/index.ts`

- [ ] **Step 1: Implement Sidebar**

Create `src/features/shell/components/Sidebar.tsx`:

```tsx
import { SidebarIcon } from "./SidebarIcon";

export function Sidebar() {
  return (
    <aside className="flex flex-col items-center w-12 bg-base-200 border-r border-base-300 py-4 gap-2">
      <SidebarIcon to="/" icon="🏠" tooltip="Accueil" />
      <SidebarIcon to="/settings" icon="⚙️" tooltip="Paramètres" />
    </aside>
  );
}
```

Note: Using emoji as placeholder icons. These can be replaced with an icon library (e.g. lucide-react) later.

- [ ] **Step 2: Update barrel export**

Update `src/features/shell/index.ts`:

```ts
export { SidebarIcon } from "./components/SidebarIcon";
export { Sidebar } from "./components/Sidebar";
```

- [ ] **Step 3: Commit**

```bash
rtk git add src/features/shell/
rtk git commit -m "feat: add Sidebar component with Accueil and Paramètres icons"
```

---

### Task 5: AppLayout component

**Files:**

- Create: `src/features/shell/components/AppLayout.tsx`
- Create: `tests/features/shell/AppLayout.test.tsx`
- Modify: `src/features/shell/index.ts`

- [ ] **Step 1: Write failing test**

Create `tests/features/shell/AppLayout.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AppLayout } from "@/features/shell";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">page content</div>,
  };
});

test("renders sidebar and outlet", () => {
  render(
    <MemoryRouter>
      <AppLayout />
    </MemoryRouter>,
  );
  expect(screen.getByRole("complementary")).toBeInTheDocument(); // <aside>
  expect(screen.getByTestId("outlet")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
rtk vitest run tests/features/shell/AppLayout.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement AppLayout**

Create `src/features/shell/components/AppLayout.tsx`:

```tsx
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  return (
    <div className="flex h-screen bg-base-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Update barrel export**

Update `src/features/shell/index.ts`:

```ts
export { SidebarIcon } from "./components/SidebarIcon";
export { Sidebar } from "./components/Sidebar";
export { AppLayout } from "./components/AppLayout";
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
rtk vitest run tests/features/shell/AppLayout.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
rtk git add src/features/shell/ tests/features/shell/
rtk git commit -m "feat: add AppLayout with sidebar and main content area"
```

---

### Task 6: SettingsPage placeholder

**Files:**

- Create: `src/features/settings/components/SettingsPage.tsx`
- Create: `src/features/settings/index.ts`

- [ ] **Step 1: Create SettingsPage**

Create `src/features/settings/components/SettingsPage.tsx`:

```tsx
export function SettingsPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-base-content/40 text-lg">
        Paramètres — bientôt disponible
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create barrel export**

Create `src/features/settings/index.ts`:

```ts
export { SettingsPage } from "./components/SettingsPage";
```

- [ ] **Step 3: Commit**

```bash
rtk git add src/features/settings/
rtk git commit -m "feat: add SettingsPage placeholder"
```

---

### Task 7: ViewToggle component

**Files:**

- Create: `src/features/projects/components/ViewToggle.tsx`
- Create: `tests/features/projects/ViewToggle.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/features/projects/ViewToggle.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ViewToggle } from "@/features/projects";

test("renders grid and list buttons", () => {
  render(<ViewToggle view="grid" onViewChange={() => {}} />);
  expect(screen.getByRole("button", { name: /grille/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /liste/i })).toBeInTheDocument();
});

test("calls onViewChange when clicking inactive view", async () => {
  const onViewChange = vi.fn();
  render(<ViewToggle view="grid" onViewChange={onViewChange} />);
  await userEvent.click(screen.getByRole("button", { name: /liste/i }));
  expect(onViewChange).toHaveBeenCalledWith("list");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
rtk vitest run tests/features/projects/ViewToggle.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Install @testing-library/user-event**

Run:

```bash
rtk bun add -D @testing-library/user-event
```

- [ ] **Step 4: Implement ViewToggle**

Create `src/features/projects/components/ViewToggle.tsx`:

```tsx
export type ViewMode = "grid" | "list";

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
        ⊞
      </button>
      <button
        className={`join-item btn btn-sm ${view === "list" ? "btn-active" : ""}`}
        onClick={() => onViewChange("list")}
        aria-label="Liste"
      >
        ☰
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Create barrel export**

Create `src/features/projects/index.ts`:

```ts
export { ViewToggle } from "./components/ViewToggle";
export type { ViewMode } from "./components/ViewToggle";
```

- [ ] **Step 6: Run test to verify it passes**

Run:

```bash
rtk vitest run tests/features/projects/ViewToggle.test.tsx
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
rtk git add src/features/projects/ tests/features/projects/ package.json bun.lock
rtk git commit -m "feat: add ViewToggle component with grid/list switch"
```

---

### Task 8: ProjectCard component (grid view)

**Files:**

- Create: `src/features/projects/components/ProjectCard.tsx`
- Create: `tests/features/projects/ProjectCard.test.tsx`
- Modify: `src/features/projects/index.ts`

- [ ] **Step 1: Write failing test**

Create `tests/features/projects/ProjectCard.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/features/projects";

const project = { id: "1", name: "Test App", stack: ["React", "Docker"] };

test("renders project name and stack", () => {
  render(<ProjectCard project={project} />);
  expect(screen.getByText("Test App")).toBeInTheDocument();
  expect(screen.getByText("React · Docker")).toBeInTheDocument();
});

test("shows action buttons on hover", async () => {
  render(<ProjectCard project={project} />);
  const card = screen
    .getByText("Test App")
    .closest('[data-testid="project-card"]')!;
  expect(card.querySelector('[aria-label="Lancer"]')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
rtk vitest run tests/features/projects/ProjectCard.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement ProjectCard**

Create `src/features/projects/components/ProjectCard.tsx`:

```tsx
import type { Project } from "../types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      data-testid="project-card"
      className="group relative bg-base-200 border border-base-300 rounded-xl p-4 hover:bg-base-300 transition-colors"
    >
      <h3 className="font-semibold text-base-content">{project.name}</h3>
      <p className="text-sm text-base-content/50 mt-1">
        {project.stack.join(" · ")}
      </p>
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          aria-label="Lancer"
          className="btn btn-xs btn-success btn-ghost"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: wire to Tauri backend
          }}
        >
          ▶
        </button>
        <button
          aria-label="Configurer"
          className="btn btn-xs btn-ghost"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: open project config
          }}
        >
          ⚙
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update barrel export**

Update `src/features/projects/index.ts`:

```ts
export { ViewToggle } from "./components/ViewToggle";
export { ProjectCard } from "./components/ProjectCard";
export type { ViewMode } from "./components/ViewToggle";
export type { Project } from "./types";
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
rtk vitest run tests/features/projects/ProjectCard.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
rtk git add src/features/projects/ tests/features/projects/
rtk git commit -m "feat: add ProjectCard with hover action buttons"
```

---

### Task 9: ProjectRow component (list view)

**Files:**

- Create: `src/features/projects/components/ProjectRow.tsx`
- Create: `tests/features/projects/ProjectRow.test.tsx`
- Modify: `src/features/projects/index.ts`

- [ ] **Step 1: Write failing test**

Create `tests/features/projects/ProjectRow.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { ProjectRow } from "@/features/projects";

const project = { id: "1", name: "Test App", stack: ["React", "Docker"] };

test("renders project name and stack", () => {
  render(<ProjectRow project={project} />);
  expect(screen.getByText("Test App")).toBeInTheDocument();
  expect(screen.getByText("React · Docker")).toBeInTheDocument();
});

test("shows action buttons on hover", () => {
  render(<ProjectRow project={project} />);
  const row = screen
    .getByText("Test App")
    .closest('[data-testid="project-row"]')!;
  expect(row.querySelector('[aria-label="Lancer"]')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
rtk vitest run tests/features/projects/ProjectRow.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement ProjectRow**

Create `src/features/projects/components/ProjectRow.tsx`:

```tsx
import type { Project } from "../types";

interface ProjectRowProps {
  project: Project;
}

export function ProjectRow({ project }: ProjectRowProps) {
  return (
    <div
      data-testid="project-row"
      className="group flex items-center gap-3 bg-base-200 border border-base-300 rounded-lg px-4 py-3 hover:bg-base-300 transition-colors"
    >
      <div className="flex-1">
        <h3 className="font-semibold text-base-content">{project.name}</h3>
        <p className="text-sm text-base-content/50">
          {project.stack.join(" · ")}
        </p>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          aria-label="Lancer"
          className="btn btn-xs btn-success btn-ghost"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          ▶
        </button>
        <button
          aria-label="Configurer"
          className="btn btn-xs btn-ghost"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          ⚙
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update barrel export**

Update `src/features/projects/index.ts`:

```ts
export { ViewToggle } from "./components/ViewToggle";
export { ProjectCard } from "./components/ProjectCard";
export { ProjectRow } from "./components/ProjectRow";
export type { ViewMode } from "./components/ViewToggle";
export type { Project } from "./types";
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
rtk vitest run tests/features/projects/ProjectRow.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
rtk git add src/features/projects/ tests/features/projects/
rtk git commit -m "feat: add ProjectRow with hover action buttons"
```

---

### Task 10: ProjectGrid and ProjectList containers

**Files:**

- Create: `src/features/projects/components/ProjectGrid.tsx`
- Create: `src/features/projects/components/ProjectList.tsx`
- Modify: `src/features/projects/index.ts`

- [ ] **Step 1: Implement ProjectGrid**

Create `src/features/projects/components/ProjectGrid.tsx`:

```tsx
import type { Project } from "../types";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Implement ProjectList**

Create `src/features/projects/components/ProjectList.tsx`:

```tsx
import type { Project } from "../types";
import { ProjectRow } from "./ProjectRow";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="flex flex-col gap-2">
      {projects.map((project) => (
        <ProjectRow key={project.id} project={project} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Update barrel export**

Update `src/features/projects/index.ts`:

```ts
export { ViewToggle } from "./components/ViewToggle";
export { ProjectCard } from "./components/ProjectCard";
export { ProjectRow } from "./components/ProjectRow";
export { ProjectGrid } from "./components/ProjectGrid";
export { ProjectList } from "./components/ProjectList";
export type { ViewMode } from "./components/ViewToggle";
export type { Project } from "./types";
```

- [ ] **Step 4: Commit**

```bash
rtk git add src/features/projects/
rtk git commit -m "feat: add ProjectGrid and ProjectList containers"
```

---

### Task 11: ProjectsPage

**Files:**

- Create: `src/features/projects/components/ProjectsPage.tsx`
- Modify: `src/features/projects/index.ts`

- [ ] **Step 1: Implement ProjectsPage**

Create `src/features/projects/components/ProjectsPage.tsx`:

```tsx
import { useState } from "react";
import { mockProjects } from "../data";
import { ProjectGrid } from "./ProjectGrid";
import { ProjectList } from "./ProjectList";
import { ViewToggle } from "./ViewToggle";
import type { ViewMode } from "./ViewToggle";

export function ProjectsPage() {
  const [view, setView] = useState<ViewMode>("grid");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Mes Projets</h1>
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      {view === "grid" ? (
        <ProjectGrid projects={mockProjects} />
      ) : (
        <ProjectList projects={mockProjects} />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update barrel export**

Update `src/features/projects/index.ts`:

```ts
export { ViewToggle } from "./components/ViewToggle";
export { ProjectCard } from "./components/ProjectCard";
export { ProjectRow } from "./components/ProjectRow";
export { ProjectGrid } from "./components/ProjectGrid";
export { ProjectList } from "./components/ProjectList";
export { ProjectsPage } from "./components/ProjectsPage";
export type { ViewMode } from "./components/ViewToggle";
export type { Project } from "./types";
```

- [ ] **Step 3: Commit**

```bash
rtk git add src/features/projects/
rtk git commit -m "feat: add ProjectsPage with view toggle"
```

---

### Task 12: Wire up router and App

**Files:**

- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Replace App.tsx with router setup**

Overwrite `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from "react-router";
import { AppLayout } from "@/features/shell";
import { ProjectsPage } from "@/features/projects";
import { SettingsPage } from "@/features/settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<ProjectsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 2: Verify main.tsx is unchanged**

`main.tsx` already renders `<App />` inside `<StrictMode>` — no changes needed.

- [ ] **Step 3: Run all tests**

Run:

```bash
rtk vitest run
```

Expected: all tests PASS.

- [ ] **Step 4: Run the dev server and verify visually**

Run:

```bash
rtk bun run tauri dev
```

Verify:

- Sidebar visible on the left with 2 icons (🏠 and ⚙️)
- Tooltips appear on hover ("Accueil", "Paramètres")
- Click 🏠 → shows "Mes Projets" with grid of cards
- Toggle to list view → shows rows
- Hover a project → ▶ and ⚙ buttons appear top-right
- Click ⚙️ sidebar → shows "Paramètres — bientôt disponible"

- [ ] **Step 5: Commit**

```bash
rtk git add src/App.tsx
rtk git commit -m "feat: wire up router with AppLayout, ProjectsPage and SettingsPage"
```

---

### Task 13: Run full test suite and cleanup

- [ ] **Step 1: Run all tests**

Run:

```bash
rtk vitest run
```

Expected: all tests PASS.

- [ ] **Step 2: Run linter**

Run:

```bash
rtk bun run lint
```

Fix any issues found.

- [ ] **Step 3: Run TypeScript check**

Run:

```bash
rtk bun run build
```

Expected: no TypeScript errors, build succeeds.

- [ ] **Step 4: Delete old assets no longer needed**

Remove `src/assets/react.svg` and `src/assets/vite.svg` (leftover from starter template, no longer referenced).

```bash
rtk git rm src/assets/react.svg src/assets/vite.svg
```

- [ ] **Step 5: Final commit**

```bash
rtk git add -A
rtk git commit -m "chore: cleanup starter template assets"
```
