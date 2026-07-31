import { forwardRef, useId } from "react";

import type { CheckboxProps } from "./Checkbox.types";

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { id, label, className, containerClassName, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={containerClassName ?? "form-check"}>
      <input
        {...rest}
        ref={ref}
        id={inputId}
        type="checkbox"
        className={["form-check-input", className].filter(Boolean).join(" ")}
      />

      {label && (
        <label className="form-check-label" htmlFor={inputId}>
          {label}
        </label>
      )}
    </div>
  );
});

export default Checkbox;
