import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { ProjectCard } from "@/features/projects";

const project = {
  id: "1",
  name: "Test App",
  path: "/home/user/test-app",
  actions: [],
};

test("renders project name and path", () => {
  render(
    <MemoryRouter>
      <ProjectCard project={project} />
    </MemoryRouter>,
  );
  expect(screen.getByText("Test App")).toBeInTheDocument();
  expect(screen.getByText("/home/user/test-app")).toBeInTheDocument();
});

test("shows action buttons on hover", async () => {
  render(
    <MemoryRouter>
      <ProjectCard project={project} />
    </MemoryRouter>,
  );
  const card = screen
    .getByText("Test App")
    .closest('[data-testid="project-card"]')!;
  expect(card.querySelector('[aria-label="Lancer"]')).toBeInTheDocument();
});
