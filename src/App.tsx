import { BrowserRouter, Routes, Route } from "react-router";
import { AppLayout } from "@/features/shell";
import {
  ProjectsPage,
  NewProjectPage,
  EditProjectPage,
} from "@/features/projects";
import { SettingsPage } from "@/features/settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<ProjectsPage />} />
          <Route path="projects/new" element={<NewProjectPage />} />
          <Route path="projects/:id/edit" element={<EditProjectPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
