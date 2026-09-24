import type { ReactNode } from "react";

export type MultiSelectSize = "sm" | "md" | "lg";

export interface MultiSelectOption {
  value: string;
  label: ReactNode;
  isDisabled?: boolean;
}

export interface MultiSelectProps {
  id?: string;
  /** Label rendered above the field. */
  label?: ReactNode;
  options: MultiSelectOption[];
  /** Currently selected option values. */
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  /** Shown when nothing is selected yet. */
  placeholder?: string;
  /** Validation error message. Adds the invalid state and renders Bootstrap feedback text. */
  error?: string;
  /** Helper text rendered below the field when there is no error. */
  helperText?: ReactNode;
  /** Maps to Bootstrap's `.form-select-{sm,lg}` sizing. */
  size?: MultiSelectSize;
  disabled?: boolean;
  /** Class name applied to the wrapping `<div>` (defaults to `mb-3`). */
  containerClassName?: string;
  className?: string;
  name?: string;
}
