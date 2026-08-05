import type { ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Rendered in the modal header next to the close button. Omit to render a header-less modal. */
  title?: ReactNode;
  /** Maps to Bootstrap's `.modal-{sm,lg,xl}` sizing. */
  size?: ModalSize;
  /** Vertically centers the dialog in the viewport. Defaults to `true`. */
  centered?: boolean;
  /** Makes the modal body scroll internally instead of the whole page. */
  scrollable?: boolean;
  /** Rendered in the modal footer, e.g. action buttons. */
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}
