import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "light"
  | "dark";

export type ButtonAppearance = "solid" | "outline" | "soft" | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Theme color to apply. Maps to Bootstrap's `$theme-colors`. */
  variant?: ButtonVariant;
  /** Visual style of the button (solid / outline / soft / ghost). */
  appearance?: ButtonAppearance;
  /** Button size. `md` renders the default Bootstrap `.btn` size. */
  size?: ButtonSize;
  /** Renders a square, icon-only button (`.btn-icon`). */
  iconOnly?: boolean;
  /** Enables the hover text-swap animation (`.btn-animation`). */
  animated?: boolean;
  /** Shows a spinner and disables the button while an action is pending. */
  loading?: boolean;
  /** Icon rendered before the label. Hidden while `loading` is true. */
  leftIcon?: ReactNode;
  /** Icon rendered after the label. Hidden while `loading` is true. */
  rightIcon?: ReactNode;
}
