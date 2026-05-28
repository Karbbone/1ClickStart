import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ToastProvider,
  useToast,
} from "@/features/shell/components/ToastContext";
import { ToastContainer } from "@/features/shell/components/ToastContainer";
import { act } from "@testing-library/react";

function Harness() {
  const { toast } = useToast();
  return (
    <div>
      <button onClick={() => toast.success("Created")}>trigger-success</button>
      <button onClick={() => toast.error("Failed")}>trigger-error</button>
      <ToastContainer />
    </div>
  );
}

function renderWithProvider() {
  return render(
    <ToastProvider>
      <Harness />
    </ToastProvider>,
  );
}

test("renders toast with correct message", async () => {
  renderWithProvider();
  await userEvent.click(screen.getByText("trigger-success"));
  expect(screen.getByRole("alert")).toHaveTextContent("Created");
});

test("renders success toast with success styling", async () => {
  renderWithProvider();
  await userEvent.click(screen.getByText("trigger-success"));
  const alert = screen.getByRole("alert");
  expect(alert.className).toContain("border-success");
});

test("renders error toast with error styling", async () => {
  renderWithProvider();
  await userEvent.click(screen.getByText("trigger-error"));
  const alert = screen.getByRole("alert");
  expect(alert.className).toContain("border-error");
});

test("dismiss button removes the toast", async () => {
  renderWithProvider();
  await userEvent.click(screen.getByText("trigger-success"));
  expect(screen.getByRole("alert")).toBeInTheDocument();
  await userEvent.click(screen.getByLabelText("Fermer la notification"));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("auto-dismiss after timeout", async () => {
  vi.useFakeTimers();
  renderWithProvider();
  await act(async () => screen.getByText("trigger-success").click());
  expect(screen.getByRole("alert")).toBeInTheDocument();
  await act(async () => vi.advanceTimersByTime(4500));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  vi.useRealTimers();
});
