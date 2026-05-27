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
