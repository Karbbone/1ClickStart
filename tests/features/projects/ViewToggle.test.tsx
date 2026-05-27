import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ViewToggle } from "@/features/projects";

test("renders grid and list buttons", () => {
  render(<ViewToggle view="grid" onViewChange={() => {}} />);
  expect(screen.getByRole("button", { name: /grille/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /liste/i })).toBeInTheDocument();
});

test("calls onViewChange when clicking inactive view", async () => {
  const onViewChange = vi.fn();
  render(<ViewToggle view="grid" onViewChange={onViewChange} />);
  await userEvent.click(screen.getByRole("button", { name: /liste/i }));
  expect(onViewChange).toHaveBeenCalledWith("list");
});
