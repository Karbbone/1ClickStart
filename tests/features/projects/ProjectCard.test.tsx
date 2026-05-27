import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/features/projects";

const project = { id: "1", name: "Test App", stack: ["React", "Docker"] };

test("renders project name and stack", () => {
  render(<ProjectCard project={project} />);
  expect(screen.getByText("Test App")).toBeInTheDocument();
  expect(screen.getByText("React · Docker")).toBeInTheDocument();
});

test("shows action buttons on hover", async () => {
  render(<ProjectCard project={project} />);
  const card = screen
    .getByText("Test App")
    .closest('[data-testid="project-card"]')!;
  expect(card.querySelector('[aria-label="Lancer"]')).toBeInTheDocument();
});
