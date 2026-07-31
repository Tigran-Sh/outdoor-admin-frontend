import type { InputHTMLAttributes, ReactNode } from "react";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label rendered above the field. */
  label?: ReactNode;
  /** Content (e.g. a "Forgot password?" link) floated to the end of the label row. */
  labelAddon?: ReactNode;
  /** Validation error message. Adds `.is-invalid` and renders Bootstrap feedback text. */
  error?: string;
  /** Helper text rendered below the field when there is no error. */
  helperText?: ReactNode;
  /** Maps to Bootstrap's `.form-control-{sm,lg}` sizing. */
  size?: InputSize;
  /** Class name applied to the wrapping `<div>` (defaults to `mb-3`). */
  containerClassName?: string;
}
