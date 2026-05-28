import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { ProjectRow } from "@/features/projects";

const project = {
  id: "1",
  name: "Test App",
  path: "/home/user/test-app",
  actions: [],
};

test("renders project name and path", () => {
  render(
    <MemoryRouter>
      <ProjectRow project={project} />
    </MemoryRouter>,
  );
  expect(screen.getByText("Test App")).toBeInTheDocument();
  expect(screen.getByText("/home/user/test-app")).toBeInTheDocument();
});

test("shows action buttons on hover", () => {
  render(
    <MemoryRouter>
      <ProjectRow project={project} />
    </MemoryRouter>,
  );
  const row = screen
    .getByText("Test App")
    .closest('[data-testid="project-row"]')!;
  expect(row.querySelector('[aria-label="Lancer"]')).toBeInTheDocument();
});
