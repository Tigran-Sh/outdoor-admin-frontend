import { forwardRef, useId } from "react";

import type { TextareaProps } from "./Textarea.types";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { id, label, error, helperText, className, containerClassName, rows = 3, ...rest },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  const controlClassName = ["form-control", error ? "is-invalid" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClassName ?? "mb-3"}>
      {label && (
        <label htmlFor={textareaId} className="form-label">
          {label}
        </label>
      )}

      <textarea {...rest} ref={ref} id={textareaId} rows={rows} className={controlClassName} />

      {error && <div className="invalid-feedback">{error}</div>}
      {helperText && !error && <div className="form-text">{helperText}</div>}
    </div>
  );
});

export default Textarea;
