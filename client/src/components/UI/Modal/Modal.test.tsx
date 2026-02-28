import { render, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders dialog with children and close button", () => {
    render(
      <Modal onClose={() => {}}>
        <div className="child">Test Content</div>
      </Modal>,
    );

    const dialog = document.querySelector(".modal");
    const closeButton = document.querySelector(".modal-close");
    const child = document.querySelector(".child");

    expect(dialog).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(closeButton?.textContent).toBe("X");
    expect(child).toBeInTheDocument();
    expect(child?.textContent).toBe("Test Content");
  });

  it("calls onClose when close button is clicked, but not inner content", () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <div className="inner-content">Test Content</div>
      </Modal>,
    );

    document.querySelector<HTMLElement>(".inner-content")?.click();
    expect(onClose).not.toHaveBeenCalled();

    document.querySelector<HTMLElement>(".modal-close")?.click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <div>Content</div>
      </Modal>,
    );

    document.querySelector<HTMLElement>(".backdrop")?.click();
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
