import { render, screen } from "@testing-library/react";
import { ProjectRow } from "@/features/projects";

const project = { id: "1", name: "Test App", path: "/home/user/test-app" };

test("renders project name and path", () => {
  render(<ProjectRow project={project} />);
  expect(screen.getByText("Test App")).toBeInTheDocument();
  expect(screen.getByText("/home/user/test-app")).toBeInTheDocument();
});

test("shows action buttons on hover", () => {
  render(<ProjectRow project={project} />);
  const row = screen
    .getByText("Test App")
    .closest('[data-testid="project-row"]')!;
  expect(row.querySelector('[aria-label="Lancer"]')).toBeInTheDocument();
});
