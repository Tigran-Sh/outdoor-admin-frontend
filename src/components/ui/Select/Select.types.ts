import type { ChangeEvent, FocusEvent, ReactNode, SelectHTMLAttributes } from "react";

export type SelectSize = "sm" | "md" | "lg";

/** Internal shape react-select is fed once `<option>` children are flattened. */
export interface SelectOptionShape {
  value: string;
  label: ReactNode;
  isDisabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "onChange" | "onBlur"> {
  /** Label rendered above the field. */
  label?: ReactNode;
  /** Validation error message. Adds the invalid state and renders Bootstrap feedback text. */
  error?: string;
  /** Helper text rendered below the field when there is no error. */
  helperText?: ReactNode;
  /** Maps to Bootstrap's `.form-select-{sm,lg}` sizing. */
  size?: SelectSize;
  /** Class name applied to the wrapping `<div>` (defaults to `mb-3`). */
  containerClassName?: string;
  /**
   * Same signature as a native `<select>`'s onChange (`event.target.name`/`event.target.value`)
   * so existing `onChange={formik.handleChange}` call sites keep working unchanged even though
   * the field is now rendered with react-select under the hood.
   */
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: FocusEvent<HTMLSelectElement>) => void;
}
