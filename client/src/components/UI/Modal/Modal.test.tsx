import { render, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders dialog with children and close button", () => {
    render(
      <Modal onClose={() => {}}>
        <div>Test Content</div>
      </Modal>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Close dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Close dialog").textContent).toBe("X");
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked, but not inner content", () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <div>Test Content</div>
      </Modal>,
    );

    screen.getByText("Test Content").click();
    expect(onClose).not.toHaveBeenCalled();

    screen.getByLabelText("Close dialog").click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal onClose={onClose}>
        <div>Content</div>
      </Modal>,
    );

    (container.firstElementChild as HTMLElement).click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <div>Content</div>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
