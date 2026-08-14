import type { ReactNode } from "react";

import type { ButtonVariant } from "@/components/ui/Button/Button.types";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  message?: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  /** Theme color applied to the icon and confirm button. Defaults to `danger`. */
  confirmVariant?: ButtonVariant;
  /** Remix Icon class rendered above the title. Defaults to `ri-error-warning-line`. */
  icon?: string;
  loading?: boolean;
  /** Disables the confirm button, e.g. while a required field in `children` is unanswered. */
  confirmDisabled?: boolean;
  /** Extra content rendered between the message and the action buttons. */
  children?: ReactNode;
}
