import { createPortal } from "react-dom";
import "./Modal.css";
import type { ReactNode } from "react";

export function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <>
      {createPortal(
        <div className="portal" onClick={onClose}>
          <div className="portal-inner" onClick={(e) => e.stopPropagation()}>
            <div className="close" onClick={onClose}>
              X
            </div>
            {children}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
