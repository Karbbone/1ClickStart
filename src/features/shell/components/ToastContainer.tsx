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
          onDismiss();
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
