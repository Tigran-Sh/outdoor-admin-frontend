import { forwardRef, useId, useState } from "react";
import { useTranslation } from "react-i18next";

import type { InputProps } from "./Input.types";

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    labelAddon,
    error,
    helperText,
    size = "md",
    type = "text",
    className,
    containerClassName,
    ...rest
  },
  ref,
) {
  const { t } = useTranslation();
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;

  const controlClassName = [
    "form-control",
    size === "sm" ? "form-control-sm" : "",
    size === "lg" ? "form-control-lg" : "",
    isPassword ? "pe-5" : "",
    error ? "is-invalid" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const field = (
    <input {...rest} ref={ref} id={inputId} type={resolvedType} className={controlClassName} />
  );

  return (
    <div className={containerClassName ?? "mb-3"}>
      {label && (
        <>
          {labelAddon && <div className="float-end">{labelAddon}</div>}
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        </>
      )}

      {isPassword ? (
        <div className="position-relative auth-pass-inputgroup">
          {field}
          <button
            type="button"
            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? t("common.hidePassword") : t("common.showPassword")}
          >
            <i className="ri-eye-fill align-middle" />
          </button>
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      ) : (
        <>
          {field}
          {error && <div className="invalid-feedback">{error}</div>}
        </>
      )}

      {helperText && !error && <div className="form-text">{helperText}</div>}
    </div>
  );
});

export default Input;
