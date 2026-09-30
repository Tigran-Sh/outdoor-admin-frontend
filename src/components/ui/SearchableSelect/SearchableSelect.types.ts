import type { ChangeEvent, FocusEvent, ReactNode } from "react";

export type SearchableSelectSize = "sm" | "md" | "lg";

export interface SearchableSelectOption {
  value: string;
  label: ReactNode;
  isDisabled?: boolean;
}

export interface SearchableSelectProps {
  id?: string;
  /** Label rendered above the field. */
  label?: ReactNode;
  options: SearchableSelectOption[];
  /** Currently selected option value, or "" for no selection. */
  value: string;
  /**
   * Same signature as a native `<select>`'s onChange (`event.target.name`/`event.target.value`)
   * so existing `onChange={formik.handleChange}` call sites keep working unchanged even though
   * the field is now rendered as a searchable dropdown (react-select, the "select2" pattern)
   * under the hood.
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /** Shown when nothing is selected yet. */
  placeholder?: string;
  /** Validation error message. Adds the invalid state and renders Bootstrap feedback text. */
  error?: string;
  /** Helper text rendered below the field when there is no error. */
  helperText?: ReactNode;
  /** Maps to Bootstrap's `.form-select-{sm,lg}` sizing. */
  size?: SearchableSelectSize;
  disabled?: boolean;
  /** Shows a clear ("x") button once a value is selected. Defaults to true. */
  isClearable?: boolean;
  /** Class name applied to the wrapping `<div>` (defaults to `mb-3`). */
  containerClassName?: string;
  className?: string;
  name?: string;
}
