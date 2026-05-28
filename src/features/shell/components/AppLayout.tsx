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
