import type { ChangeEvent, FocusEvent, ReactNode } from "react";

export type TimePickerSize = "sm" | "md" | "lg";

export interface TimePickerProps {
  /** Label rendered above the field. */
  label?: ReactNode;
  /** Validation error message. Adds the invalid state and renders Bootstrap feedback text. */
  error?: string;
  /** Helper text rendered below the field when there is no error. */
  helperText?: ReactNode;
  /** Maps to Bootstrap's `.form-control-{sm,lg}` sizing. */
  size?: TimePickerSize;
  /** Class name applied to the wrapping `<div>` (defaults to `mb-3`). */
  containerClassName?: string;
  className?: string;
  id?: string;
  name?: string;
  /** Selected time as a 24h `HH:mm` string (native `<input type="time">` convention), or "". */
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  /**
   * Interval, in minutes, between the selectable time-of-day options offered in the dropdown
   * (e.g. `30` -> 00:00, 00:30, 01:00, ...). Defaults to 30.
   */
  stepMinutes?: number;
  /**
   * Same signature as a native `<input type="time">`'s onChange (`event.target.name`/
   * `event.target.value`) so existing `onChange={formik.handleChange}` call sites keep working
   * unchanged even though the field is now rendered as a searchable dropdown of time-of-day
   * options (react-select) under the hood.
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}
