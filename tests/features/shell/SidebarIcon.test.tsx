import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { SidebarIcon } from "@/features/shell";

test("renders icon with tooltip", () => {
  render(
    <MemoryRouter>
      <SidebarIcon to="/" icon="🏠" tooltip="Accueil" />
    </MemoryRouter>,
  );
  expect(screen.getByRole("link")).toBeInTheDocument();
  expect(screen.getByRole("link")).toHaveAttribute("href", "/");
});

test("has active style when route matches", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <SidebarIcon to="/" icon="🏠" tooltip="Accueil" />
    </MemoryRouter>,
  );
  expect(screen.getByRole("link")).toHaveClass("bg-base-300");
});
