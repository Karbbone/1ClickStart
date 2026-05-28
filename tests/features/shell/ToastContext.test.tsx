import { render, screen, act } from "@testing-library/react";
import {
  ToastProvider,
  useToast,
} from "@/features/shell/components/ToastContext";

function TestConsumer() {
  const { toasts, toast } = useToast();
  return (
    <div>
      <button onClick={() => toast.success("ok")}>add</button>
      <span data-testid="count">{toasts.length}</span>
      {toasts.map((t) => (
        <span key={t.id} data-testid={`toast-${t.type}`}>
          {t.message}
        </span>
      ))}
    </div>
  );
}

test("useToast throws outside provider", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  expect(() => render(<TestConsumer />)).toThrow();
  spy.mockRestore();
});

test("toast.success adds a toast", () => {
  render(
    <ToastProvider>
      <TestConsumer />
    </ToastProvider>,
  );
  act(() => screen.getByText("add").click());
  expect(screen.getByTestId("toast-success")).toHaveTextContent("ok");
  expect(screen.getByTestId("count")).toHaveTextContent("1");
});

test("toast types: error, warning, info", () => {
  function Multi() {
    const { toasts, toast } = useToast();
    return (
      <div>
        <button onClick={() => toast.error("e")}>err</button>
        <button onClick={() => toast.warning("w")}>warn</button>
        <button onClick={() => toast.info("i")}>info</button>
        <span data-testid="count">{toasts.length}</span>
      </div>
    );
  }
  render(
    <ToastProvider>
      <Multi />
    </ToastProvider>,
  );
  act(() => screen.getByText("err").click());
  act(() => screen.getByText("warn").click());
  act(() => screen.getByText("info").click());
  expect(screen.getByTestId("count")).toHaveTextContent("3");
});

test("dismiss removes a toast", () => {
  function Dismisser() {
    const { toasts, toast, dismiss } = useToast();
    return (
      <div>
        <button onClick={() => toast.success("x")}>add</button>
        {toasts.map((t) => (
          <button
            key={t.id}
            onClick={() => dismiss(t.id)}
            data-testid="dismiss"
          >
            remove
          </button>
        ))}
        <span data-testid="count">{toasts.length}</span>
      </div>
    );
  }
  render(
    <ToastProvider>
      <Dismisser />
    </ToastProvider>,
  );
  act(() => screen.getByText("add").click());
  expect(screen.getByTestId("count")).toHaveTextContent("1");
  act(() => screen.getByTestId("dismiss").click());
  expect(screen.getByTestId("count")).toHaveTextContent("0");
});
