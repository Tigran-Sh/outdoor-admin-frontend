import type { InputHTMLAttributes, ReactNode } from "react";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label rendered next to the checkbox. */
  label?: ReactNode;
  /** Class name applied to the wrapping `<div>` (defaults to `form-check`). */
  containerClassName?: string;
}
