import type { ChangeEvent, FocusEvent, ReactNode } from "react";

export type DatePickerSize = "sm" | "md" | "lg";

export interface DatePickerProps {
  /** Label rendered above the field. */
  label?: ReactNode;
  /** Validation error message. Adds the invalid state and renders Bootstrap feedback text. */
  error?: string;
  /** Helper text rendered below the field when there is no error. */
  helperText?: ReactNode;
  /** Maps to Bootstrap's `.form-control-{sm,lg}` sizing. */
  size?: DatePickerSize;
  /** Class name applied to the wrapping `<div>` (defaults to `mb-3`). */
  containerClassName?: string;
  className?: string;
  id?: string;
  name?: string;
  /** Selected date as an ISO `YYYY-MM-DD` string (native `<input type="date">` convention), or "". */
  value?: string;
  /** Minimum selectable date, as an ISO `YYYY-MM-DD` string. */
  min?: string;
  /** Maximum selectable date, as an ISO `YYYY-MM-DD` string. */
  max?: string;
  placeholder?: string;
  disabled?: boolean;
  /**
   * Same signature as a native `<input type="date">`'s onChange (`event.target.name`/
   * `event.target.value`) so existing `onChange={formik.handleChange}` call sites keep working
   * unchanged even though the field is now rendered with react-flatpickr under the hood.
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}
