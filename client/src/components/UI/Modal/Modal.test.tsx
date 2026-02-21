import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders portal structure with children and close button", () => {
    render(
      <Modal onClose={() => {}}>
        <div className="child">Test Content</div>
      </Modal>,
    );

    const portal = document.querySelector(".portal");
    const portalInner = document.querySelector(".portal-inner");
    const closeButton = document.querySelector(".close");
    const child = document.querySelector(".child");

    expect(portal).toBeInTheDocument();
    expect(portalInner).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(closeButton?.textContent).toBe("X");
    expect(child).toBeInTheDocument();
    expect(child?.textContent).toBe("Test Content");
  });

  it("calls onClose when backdrop or close button is clicked, but not inner content", () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose}>
        <div className="inner-content">Test Content</div>
      </Modal>,
    );

    document.querySelector<HTMLElement>(".inner-content")?.click();
    expect(onClose).not.toHaveBeenCalled();

    document.querySelector<HTMLElement>(".portal-inner")?.click();
    expect(onClose).not.toHaveBeenCalled();

    document.querySelector<HTMLElement>(".close")?.click();
    expect(onClose).toHaveBeenCalledTimes(1);

    onClose.mockClear();
    document.querySelector<HTMLElement>(".portal")?.click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("handles multiple modals independently", () => {
    const onClose1 = vi.fn();
    const onClose2 = vi.fn();

    render(
      <>
        <Modal onClose={onClose1}>
          <div>First Modal</div>
        </Modal>
        <Modal onClose={onClose2}>
          <div>Second Modal</div>
        </Modal>
      </>,
    );

    const portals = document.querySelectorAll<HTMLElement>(".portal");
    expect(portals).toHaveLength(2);

    portals[0]?.click();
    expect(onClose1).toHaveBeenCalled();
    expect(onClose2).not.toHaveBeenCalled();

    portals[1]?.click();
    expect(onClose2).toHaveBeenCalled();
  });
});
