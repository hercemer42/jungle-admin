import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useToastStore } from "../../../store/useToastStore";
import styles from "./Toast.module.css";

const AUTO_DISMISS_MS = 3000;

function ToastItem({
  id,
  message,
  type,
  onDismiss,
}: {
  id: string;
  message: string;
  type: "success" | "error";
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="status">
      <span>{message}</span>
      <button className={styles.close} onClick={() => onDismiss(id)}>
        ×
      </button>
    </div>
  );
}

function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return createPortal(
    <div className={styles.toaster}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={removeToast}
        />
      ))}
    </div>,
    document.body,
  );
}

export { Toaster };
