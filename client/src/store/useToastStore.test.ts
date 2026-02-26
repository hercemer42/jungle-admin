import { describe, it, expect, beforeEach } from "vitest";
import { useToastStore } from "./useToastStore";

beforeEach(() => {
  useToastStore.setState({ toasts: [] });
});

describe("useToastStore", () => {
  it("adds a toast", () => {
    useToastStore.getState().addToast({ message: "Saved", type: "success" });
    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0]).toMatchObject({ message: "Saved", type: "success" });
    expect(toasts[0].id).toBeDefined();
  });

  it("removes a toast by id", () => {
    useToastStore.getState().addToast({ message: "Saved", type: "success" });
    const id = useToastStore.getState().toasts[0].id;
    useToastStore.getState().removeToast(id);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("supports multiple toasts", () => {
    useToastStore.getState().addToast({ message: "A", type: "success" });
    useToastStore.getState().addToast({ message: "B", type: "error" });
    expect(useToastStore.getState().toasts).toHaveLength(2);
  });
});
