# Toast Notifications System

## Summary

Implement a reusable toast notification system to provide visual feedback on user actions (create, edit, delete, launch project). Currently all errors are logged to console only — users get no feedback.

## Architecture

### Approach

100% custom implementation using React Context + Tailwind/DaisyUI. No external dependency.

### New Files

- `src/features/shell/components/ToastContext.tsx` — React context, provider, and `useToast()` hook
- `src/features/shell/components/ToastContainer.tsx` — Renders the toast stack

### Modified Files

- `src/features/shell/components/AppLayout.tsx` — Wrap `<Outlet />` with `<ToastProvider>`
- `src/features/projects/components/ProjectsPage.tsx` — Toast on delete success/error, launch success/error
- `src/features/projects/components/NewProjectPage.tsx` — Toast on create success/error
- `src/features/projects/components/EditProjectPage.tsx` — Toast on update success/error

## Toast Context API

```tsx
type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
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
```

Usage in components:

```tsx
const { toast } = useToast();
toast.success("Projet créé avec succès");
toast.error("Échec du lancement : terminal introuvable");
```

## Visual Design

### Position

Fixed bottom-right of the viewport. Toasts stack vertically with a gap between them.

### Style — Colored Subtle

Each toast type uses DaisyUI theme colors — no hardcoded color values:

| Type    | Background      | Border           | Text/Icon      |
| ------- | --------------- | ---------------- | -------------- |
| success | `bg-success/10` | `border-success` | `text-success` |
| error   | `bg-error/10`   | `border-error`   | `text-error`   |
| warning | `bg-warning/10` | `border-warning` | `text-warning` |
| info    | `bg-info/10`    | `border-info`    | `text-info`    |

Each toast contains:

- Icon (SVG, colored by type)
- Message text
- Dismiss button (✕)

### Animation

- **Entry**: slide from right + fade in (300ms, ease-out)
- **Exit**: slide to right + fade out (200ms, ease-in)
- CSS `@keyframes` with Tailwind arbitrary animation classes

### Behavior

- **Auto-dismiss**: 4 seconds
- **Manual dismiss**: click ✕ button
- **Max visible**: 5 toasts (oldest dismissed first if exceeded)
- **Stacking**: newest toast appears at the bottom of the stack

## Accessibility

- Container: `aria-live="polite"` for success/warning/info, `aria-live="assertive"` for error
- Each toast: `role="alert"`
- Dismiss button: `aria-label="Fermer la notification"`

## Integration Points

### ProjectsPage.tsx

```tsx
// Delete
try {
  await deleteProject(id);
  toast.success("Projet supprimé avec succès");
} catch (err) {
  toast.error("Échec de la suppression du projet");
}

// Launch
try {
  await launchProject(id);
  toast.success("Projet lancé avec succès");
} catch (err) {
  toast.error(`Échec du lancement : ${err.message}`);
}
```

### NewProjectPage.tsx

```tsx
try {
  await createProject(data);
  toast.success("Projet créé avec succès");
  navigate("/");
} catch (err) {
  toast.error("Échec de la création du projet");
}
```

### EditProjectPage.tsx

```tsx
try {
  await updateProject(data);
  toast.success("Projet mis à jour avec succès");
  navigate("/");
} catch (err) {
  toast.error("Échec de la mise à jour du projet");
}
```

## Out of Scope

- Toast persistence across page navigation (toasts are ephemeral)
- Toast action buttons (e.g., "Undo")
- Toast grouping/deduplication
- Sound/vibration feedback
