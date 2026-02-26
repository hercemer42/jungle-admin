import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useToastStore } from "../../../store/useToastStore";
import { Toaster } from "./Toast";

beforeEach(() => {
  useToastStore.setState({ toasts: [] });
});

describe("Toaster", () => {
  it("renders nothing when there are no toasts", () => {
    render(<Toaster />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders a success toast", () => {
    useToastStore.getState().addToast({ message: "Row saved", type: "success" });
    render(<Toaster />);
    expect(screen.getByRole("status")).toHaveTextContent("Row saved");
    expect(screen.getByRole("status")).toHaveClass("toast-success");
  });

  it("renders an error toast", () => {
    useToastStore.getState().addToast({ message: "Save failed", type: "error" });
    render(<Toaster />);
    expect(screen.getByRole("status")).toHaveTextContent("Save failed");
    expect(screen.getByRole("status")).toHaveClass("toast-error");
  });

  describe("auto-dismiss", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("auto-dismisses after 3 seconds", () => {
      useToastStore
        .getState()
        .addToast({ message: "Row saved", type: "success" });
      render(<Toaster />);
      expect(screen.getByRole("status")).toBeInTheDocument();

      act(() => vi.advanceTimersByTime(3000));

      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  it("dismisses on close button click", async () => {
    useToastStore.getState().addToast({ message: "Row saved", type: "success" });
    render(<Toaster />);

    await userEvent.click(screen.getByRole("button"));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
