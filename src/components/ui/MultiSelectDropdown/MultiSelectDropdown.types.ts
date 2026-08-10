import type { ReactNode } from "react";

export interface MultiSelectDropdownOption {
  value: string;
  label: string;
}

export interface MultiSelectDropdownProps {
  id?: string;
  /** Label rendered above the field. */
  label?: ReactNode;
  options: MultiSelectDropdownOption[];
  /** Currently selected option values. */
  value: string[];
  onChange: (value: string[]) => void;
  /** Shown on the toggle button when nothing is selected. */
  placeholder?: string;
  /** Validation error message. Adds `.is-invalid` and renders Bootstrap feedback text. */
  error?: string;
  /** Helper text rendered below the field when there is no error. */
  helperText?: ReactNode;
  disabled?: boolean;
  /** Class name applied to the wrapping `<div>` (defaults to `mb-3`). */
  containerClassName?: string;
  /** Class name applied to the toggle button (styled like `.form-select`). */
  toggleClassName?: string;
}
