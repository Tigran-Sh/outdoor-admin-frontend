import Button from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal/Modal";

import type { ConfirmDialogProps } from "./ConfirmDialog.types";

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirmVariant = "danger",
  icon = "ri-error-warning-line",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="text-center">
        <i className={`${icon} display-5 text-${confirmVariant}`} aria-hidden="true" />

        <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
          <h4>{title}</h4>
          {message && <p className="text-muted mx-4 mb-0">{message}</p>}
        </div>
      </div>

      <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
        <Button appearance="outline" variant="secondary" className="w-sm" onClick={onClose}>
          {cancelLabel}
        </Button>

        <Button variant={confirmVariant} className="w-sm" loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
