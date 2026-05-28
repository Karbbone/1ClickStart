import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AppLayout } from "@/features/shell";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">page content</div>,
  };
});

test("renders sidebar and outlet", () => {
  render(
    <MemoryRouter>
      <AppLayout />
    </MemoryRouter>,
  );
  expect(screen.getByRole("complementary")).toBeInTheDocument();
  expect(screen.getByTestId("outlet")).toBeInTheDocument();
});

test("renders toast container", () => {
  render(
    <MemoryRouter>
      <AppLayout />
    </MemoryRouter>,
  );
  expect(document.querySelector("[aria-live]")).toBeInTheDocument();
});
