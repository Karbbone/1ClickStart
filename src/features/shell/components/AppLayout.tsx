import { Outlet } from "react-router";
import { AppHeader } from "./AppHeader";
import { ToastProvider } from "./ToastContext";
import { ToastContainer } from "./ToastContainer";

export function AppLayout() {
  return (
    <ToastProvider>
      <div className="flex flex-col h-screen bg-base-100">
        <AppHeader />
        <main className="flex-1 overflow-auto px-5 pb-5">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
