import { render, screen } from "@testing-library/react";
import { ProjectRow } from "@/features/projects";

const project = { id: "1", name: "Test App", stack: ["React", "Docker"] };

test("renders project name and stack", () => {
  render(<ProjectRow project={project} />);
  expect(screen.getByText("Test App")).toBeInTheDocument();
  expect(screen.getByText("React · Docker")).toBeInTheDocument();
});

test("shows action buttons on hover", () => {
  render(<ProjectRow project={project} />);
  const row = screen
    .getByText("Test App")
    .closest('[data-testid="project-row"]')!;
  expect(row.querySelector('[aria-label="Lancer"]')).toBeInTheDocument();
});
