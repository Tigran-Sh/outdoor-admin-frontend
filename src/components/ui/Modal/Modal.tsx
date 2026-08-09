import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import type { ModalProps } from "./Modal.types";

function joinClassNames(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function Modal({
  isOpen,
  onClose,
  title,
  size = "md",
  centered = true,
  scrollable = false,
  footer,
  children,
  className,
}: ModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const dialogClassName = joinClassNames(
    "modal-dialog",
    centered && "modal-dialog-centered",
    scrollable && "modal-dialog-scrollable",
    size === "sm" && "modal-sm",
    size === "lg" && "modal-lg",
    size === "xl" && "modal-xl",
  );

  return createPortal(
    <>
      <div className="modal-backdrop show" />
      <div
        className={joinClassNames("modal fade show d-block", className)}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className={dialogClassName}>
          <div className="modal-content">
            {title && (
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label={t("common.close")}
                  onClick={onClose}
                />
              </div>
            )}

            <div className="modal-body">{children}</div>

            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

export default Modal;
