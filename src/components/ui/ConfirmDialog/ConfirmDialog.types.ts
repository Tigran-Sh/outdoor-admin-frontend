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
}
