import { forwardRef, useId } from "react";

import type { RadioProps } from "./Radio.types";

const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
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
        type="radio"
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

export default Radio;
