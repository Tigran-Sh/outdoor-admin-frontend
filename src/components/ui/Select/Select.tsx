import { forwardRef, useId } from "react";

import type { SelectProps } from "./Select.types";

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { id, label, error, helperText, size = "md", className, containerClassName, children, ...rest },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  const controlClassName = [
    "form-select",
    size === "sm" ? "form-select-sm" : "",
    size === "lg" ? "form-select-lg" : "",
    error ? "is-invalid" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClassName ?? "mb-3"}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
        </label>
      )}

      <select {...rest} ref={ref} id={selectId} className={controlClassName}>
        {children}
      </select>

      {error && <div className="invalid-feedback">{error}</div>}
      {helperText && !error && <div className="form-text">{helperText}</div>}
    </div>
  );
});

export default Select;
