# Toast Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a toast notification system so users get visual feedback on project CRUD and launch operations.

**Architecture:** React Context (`ToastContext`) provides a `useToast()` hook. `ToastContainer` renders a fixed bottom-right stack of toasts with auto-dismiss and slide-right animation. All colors use DaisyUI theme tokens.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, DaisyUI 5, Vitest, Testing Library

---

## File Structure

| Action | Path                                                   | Responsibility                                                   |
| ------ | ------------------------------------------------------ | ---------------------------------------------------------------- |
| Create | `src/features/shell/components/ToastContext.tsx`       | Context, provider, `useToast()` hook, toast state management     |
| Create | `src/features/shell/components/ToastContainer.tsx`     | Renders toast stack, individual toast items, animations, dismiss |
| Modify | `src/features/shell/components/AppLayout.tsx`          | Wrap content with `<ToastProvider>`                              |
| Modify | `src/features/shell/index.ts`                          | Export `ToastProvider` and `useToast`                            |
| Modify | `src/features/projects/components/ProjectsPage.tsx`    | Toast on delete/launch success/error                             |
| Modify | `src/features/projects/components/NewProjectPage.tsx`  | Toast on create success/error                                    |
| Modify | `src/features/projects/components/EditProjectPage.tsx` | Toast on update success/error                                    |
| Create | `tests/features/shell/ToastContext.test.tsx`           | Tests for toast context logic                                    |
| Create | `tests/features/shell/ToastContainer.test.tsx`         | Tests for toast rendering and dismiss                            |

---

### Task 1: Toast Context

**Files:**

- Create: `src/features/shell/components/ToastContext.tsx`
- Create: `tests/features/shell/ToastContext.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// tests/features/shell/ToastContext.test.tsx
import { render, screen, act } from "@testing-library/react";
import {
  ToastProvider,
  useToast,
} from "@/features/shell/components/ToastContext";

function TestConsumer() {
  const { toasts, toast } = useToast();
  return (
    <div>
      <button onClick={() => toast.success("ok")}>add</button>
      <span data-testid="count">{toasts.length}</span>
      {toasts.map((t) => (
        <span key={t.id} data-testid={`toast-${t.type}`}>
          {t.message}
        </span>
      ))}
    </div>
  );
}

test("useToast throws outside provider", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  expect(() => render(<TestConsumer />)).toThrow();
  spy.mockRestore();
});

test("toast.success adds a toast", () => {
  render(
    <ToastProvider>
      <TestConsumer />
    </ToastProvider>,
  );
  act(() => screen.getByText("add").click());
  expect(screen.getByTestId("toast-success")).toHaveTextContent("ok");
  expect(screen.getByTestId("count")).toHaveTextContent("1");
});

test("toast types: error, warning, info", () => {
  function Multi() {
    const { toasts, toast } = useToast();
    return (
      <div>
        <button onClick={() => toast.error("e")}>err</button>
        <button onClick={() => toast.warning("w")}>warn</button>
        <button onClick={() => toast.info("i")}>info</button>
        <span data-testid="count">{toasts.length}</span>
      </div>
    );
  }
  render(
    <ToastProvider>
      <Multi />
    </ToastProvider>,
  );
  act(() => screen.getByText("err").click());
  act(() => screen.getByText("warn").click());
  act(() => screen.getByText("info").click());
  expect(screen.getByTestId("count")).toHaveTextContent("3");
});

test("dismiss removes a toast", () => {
  function Dismisser() {
    const { toasts, toast, dismiss } = useToast();
    return (
      <div>
        <button onClick={() => toast.success("x")}>add</button>
        {toasts.map((t) => (
          <button
            key={t.id}
            onClick={() => dismiss(t.id)}
            data-testid="dismiss"
          >
            remove
          </button>
        ))}
        <span data-testid="count">{toasts.length}</span>
      </div>
    );
  }
  render(
    <ToastProvider>
      <Dismisser />
    </ToastProvider>,
  );
  act(() => screen.getByText("add").click());
  expect(screen.getByTestId("count")).toHaveTextContent("1");
  act(() => screen.getByTestId("dismiss").click());
  expect(screen.getByTestId("count")).toHaveTextContent("0");
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `rtk vitest run tests/features/shell/ToastContext.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement ToastContext**

```tsx
// src/features/shell/components/ToastContext.tsx
import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
  };
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_TOASTS = 5;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => {
      const next = [...prev, { id, type, message }];
      return next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next;
    });
  }, []);

  const toast = {
    success: (message: string) => addToast("success", message),
    error: (message: string) => addToast("error", message),
    warning: (message: string) => addToast("warning", message),
    info: (message: string) => addToast("info", message),
  };

  return (
    <ToastContext value={{ toasts, toast, dismiss }}>{children}</ToastContext>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `rtk vitest run tests/features/shell/ToastContext.test.tsx`
Expected: all 4 tests PASS

- [ ] **Step 5: Commit**

```bash
rtk git add src/features/shell/components/ToastContext.tsx tests/features/shell/ToastContext.test.tsx
rtk git commit -m "feat: add ToastContext with useToast hook"
```

---

### Task 2: Toast Container

**Files:**

- Create: `src/features/shell/components/ToastContainer.tsx`
- Create: `tests/features/shell/ToastContainer.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// tests/features/shell/ToastContainer.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ToastProvider,
  useToast,
} from "@/features/shell/components/ToastContext";
import { ToastContainer } from "@/features/shell/components/ToastContainer";
import { act } from "@testing-library/react";

function Harness() {
  const { toast } = useToast();
  return (
    <div>
      <button onClick={() => toast.success("Created")}>trigger-success</button>
      <button onClick={() => toast.error("Failed")}>trigger-error</button>
      <ToastContainer />
    </div>
  );
}

function renderWithProvider() {
  return render(
    <ToastProvider>
      <Harness />
    </ToastProvider>,
  );
}

test("renders toast with correct message", async () => {
  renderWithProvider();
  await userEvent.click(screen.getByText("trigger-success"));
  expect(screen.getByRole("alert")).toHaveTextContent("Created");
});

test("renders success toast with success styling", async () => {
  renderWithProvider();
  await userEvent.click(screen.getByText("trigger-success"));
  const alert = screen.getByRole("alert");
  expect(alert.className).toContain("border-success");
});

test("renders error toast with error styling", async () => {
  renderWithProvider();
  await userEvent.click(screen.getByText("trigger-error"));
  const alert = screen.getByRole("alert");
  expect(alert.className).toContain("border-error");
});

test("dismiss button removes the toast", async () => {
  renderWithProvider();
  await userEvent.click(screen.getByText("trigger-success"));
  expect(screen.getByRole("alert")).toBeInTheDocument();
  await userEvent.click(screen.getByLabelText("Fermer la notification"));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("auto-dismiss after timeout", async () => {
  vi.useFakeTimers();
  renderWithProvider();
  await act(async () => screen.getByText("trigger-success").click());
  expect(screen.getByRole("alert")).toBeInTheDocument();
  await act(async () => vi.advanceTimersByTime(4500));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  vi.useRealTimers();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `rtk vitest run tests/features/shell/ToastContainer.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement ToastContainer**

```tsx
// src/features/shell/components/ToastContainer.tsx
import { useEffect, useState } from "react";
import { X, CheckCircle, XCircle, Warning, Info } from "@phosphor-icons/react";
import { useToast, type Toast } from "./ToastContext";

const AUTO_DISMISS_MS = 4000;

const config = {
  success: {
    icon: CheckCircle,
    classes: "bg-success/10 border-success text-success",
  },
  error: {
    icon: XCircle,
    classes: "bg-error/10 border-error text-error",
  },
  warning: {
    icon: Warning,
    classes: "bg-warning/10 border-warning text-warning",
  },
  info: {
    icon: Info,
    classes: "bg-info/10 border-info text-info",
  },
} as const;

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const [exiting, setExiting] = useState(false);
  const { icon: Icon, classes } = config[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), AUTO_DISMISS_MS - 200);
    const removeTimer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onDismiss]);

  return (
    <div
      role="alert"
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${classes} ${
        exiting ? "animate-toast-out" : "animate-toast-in"
      }`}
    >
      <Icon size={18} weight="bold" className="shrink-0" />
      <span className="text-sm flex-1">{toast.message}</span>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(onDismiss, 200);
        }}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Fermer la notification"
      >
        <X size={14} weight="bold" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-80"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Add animation keyframes to index.css**

Add at the end of `src/index.css`:

```css
@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes toast-out {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

@utility animate-toast-in {
  animation: toast-in 0.3s ease-out forwards;
}

@utility animate-toast-out {
  animation: toast-out 0.2s ease-in forwards;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `rtk vitest run tests/features/shell/ToastContainer.test.tsx`
Expected: all 5 tests PASS

- [ ] **Step 6: Commit**

```bash
rtk git add src/features/shell/components/ToastContainer.tsx tests/features/shell/ToastContainer.test.tsx src/index.css
rtk git commit -m "feat: add ToastContainer with animations and auto-dismiss"
```

---

### Task 3: Wire Provider into AppLayout

**Files:**

- Modify: `src/features/shell/components/AppLayout.tsx`
- Modify: `src/features/shell/index.ts`
- Modify: `tests/features/shell/AppLayout.test.tsx`

- [ ] **Step 1: Update the AppLayout test**

Replace `tests/features/shell/AppLayout.test.tsx` with:

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
  expect(screen.getByRole("complementary")).toBeInTheDocument();
  expect(screen.getByTestId("outlet")).toBeInTheDocument();
});

test("renders toast container", () => {
  render(
    <MemoryRouter>
      <AppLayout />
    </MemoryRouter>,
  );
  expect(document.querySelector("[aria-live]")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify new test fails**

Run: `rtk vitest run tests/features/shell/AppLayout.test.tsx`
Expected: "renders toast container" FAILS

- [ ] **Step 3: Update AppLayout**

Replace `src/features/shell/components/AppLayout.tsx` with:

```tsx
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { ToastProvider } from "./ToastContext";
import { ToastContainer } from "./ToastContainer";

export function AppLayout() {
  return (
    <ToastProvider>
      <div className="flex h-screen bg-base-100">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
```

- [ ] **Step 4: Update barrel export**

Add to `src/features/shell/index.ts`:

```ts
export { ToastProvider, useToast } from "./components/ToastContext";
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `rtk vitest run tests/features/shell/`
Expected: all tests PASS

- [ ] **Step 6: Commit**

```bash
rtk git add src/features/shell/components/AppLayout.tsx src/features/shell/index.ts tests/features/shell/AppLayout.test.tsx
rtk git commit -m "feat: wire ToastProvider and ToastContainer into AppLayout"
```

---

### Task 4: Integrate toasts in ProjectsPage

**Files:**

- Modify: `src/features/projects/components/ProjectsPage.tsx`

- [ ] **Step 1: Update ProjectsPage with toast calls**

Replace `src/features/projects/components/ProjectsPage.tsx` with:

```tsx
import { useState, useEffect, useCallback } from "react";
import { ProjectGrid } from "./ProjectGrid";
import { ProjectList } from "./ProjectList";
import { ViewToggle } from "./ViewToggle";
import { listProjects, deleteProject, launchProject } from "../api";
import { useToast } from "@/features/shell";
import type { ViewMode } from "../types";
import type { Project } from "../types";

export function ProjectsPage() {
  const [view, setView] = useState<ViewMode>("list");
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  const loadProjects = useCallback(() => {
    listProjects()
      .then(setProjects)
      .catch(() => toast.error("Échec du chargement des projets"));
  }, [toast]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function handleDelete(id: string) {
    try {
      await deleteProject(id);
      toast.success("Projet supprimé avec succès");
      loadProjects();
    } catch {
      toast.error("Échec de la suppression du projet");
    }
  }

  async function handleLaunch(id: string) {
    try {
      await launchProject(id);
      toast.success("Projet lancé avec succès");
    } catch (err) {
      toast.error(
        `Échec du lancement : ${err instanceof Error ? err.message : "erreur inconnue"}`,
      );
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Mes Projets</h1>
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      {view === "grid" ? (
        <ProjectGrid
          projects={projects}
          onDelete={handleDelete}
          onLaunch={handleLaunch}
        />
      ) : (
        <ProjectList
          projects={projects}
          onDelete={handleDelete}
          onLaunch={handleLaunch}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Smoke test manually**

Run: `rtk bun run tauri dev`
Test: delete a project → green toast appears bottom-right. Launch a project → green toast or red toast on error.

- [ ] **Step 3: Commit**

```bash
rtk git add src/features/projects/components/ProjectsPage.tsx
rtk git commit -m "feat: add toast notifications to ProjectsPage"
```

---

### Task 5: Integrate toasts in NewProjectPage

**Files:**

- Modify: `src/features/projects/components/NewProjectPage.tsx`

- [ ] **Step 1: Update NewProjectPage with toast calls**

Replace `src/features/projects/components/NewProjectPage.tsx` with:

```tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "@phosphor-icons/react";
import { createProject } from "../api";
import { useToast } from "@/features/shell";
import { ProjectForm } from "./ProjectForm";
import type { ProjectAction } from "../types";

export function NewProjectPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(
    name: string,
    path: string,
    actions: ProjectAction[],
  ) {
    setLoading(true);
    try {
      await createProject(name, path, actions);
      toast.success("Projet créé avec succès");
      navigate("/");
    } catch {
      toast.error("Échec de la création du projet");
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
      <ProjectForm
        submitLabel="Créer"
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
rtk git add src/features/projects/components/NewProjectPage.tsx
rtk git commit -m "feat: add toast notifications to NewProjectPage"
```

---

### Task 6: Integrate toasts in EditProjectPage

**Files:**

- Modify: `src/features/projects/components/EditProjectPage.tsx`

- [ ] **Step 1: Update EditProjectPage with toast calls**

Replace `src/features/projects/components/EditProjectPage.tsx` with:

```tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "@phosphor-icons/react";
import { listProjects, updateProject } from "../api";
import { useToast } from "@/features/shell";
import { ProjectForm } from "./ProjectForm";
import type { Project, ProjectAction } from "../types";

export function EditProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    listProjects()
      .then((projects) => {
        const found = projects.find((p) => p.id === id);
        if (found) {
          setProject(found);
        } else {
          toast.error("Projet introuvable");
          navigate("/");
        }
      })
      .catch(() => {
        toast.error("Échec du chargement du projet");
        navigate("/");
      });
  }, [id, navigate, toast]);

  async function handleSubmit(
    name: string,
    path: string,
    actions: ProjectAction[],
  ) {
    if (!id) return;
    setLoading(true);
    try {
      await updateProject(id, name, path, actions);
      toast.success("Projet mis à jour avec succès");
      navigate("/");
    } catch {
      toast.error("Échec de la mise à jour du projet");
    } finally {
      setLoading(false);
    }
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
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
        <h1 className="text-xl font-bold">Modifier le projet</h1>
      </div>
      <ProjectForm
        initialName={project.name}
        initialPath={project.path}
        initialActions={project.actions}
        submitLabel="Enregistrer"
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
rtk git add src/features/projects/components/EditProjectPage.tsx
rtk git commit -m "feat: add toast notifications to EditProjectPage"
```

---

### Task 7: Final verification

- [ ] **Step 1: Run all tests**

Run: `rtk vitest run`
Expected: all tests PASS

- [ ] **Step 2: Run dev server and manually test**

Run: `rtk bun run tauri dev`

Checklist:

- Create a project → green toast "Projet créé avec succès"
- Edit a project → green toast "Projet mis à jour avec succès"
- Delete a project → green toast "Projet supprimé avec succès"
- Launch a project → green toast on success, red toast with message on error
- Toast auto-dismisses after ~4 seconds
- Click ✕ → toast dismissed immediately
- Toast slides in from right, slides out to right
- Multiple toasts stack vertically

- [ ] **Step 3: Final commit if any adjustments**

```bash
rtk git add -A
rtk git commit -m "feat: toast notification system complete"
```
