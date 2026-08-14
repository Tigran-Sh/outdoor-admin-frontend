import type { InputHTMLAttributes, ReactNode } from "react";

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label rendered next to the radio input. */
  label?: ReactNode;
  /** Class name applied to the wrapping `<div>` (defaults to `form-check`). */
  containerClassName?: string;
}
