import { forwardRef } from "react";

import type { ButtonProps } from "./Button.types.ts";

function getButtonClassName({
  variant,
  appearance,
  size,
  iconOnly,
  animated,
  loading,
  className,
}: Required<Pick<ButtonProps, "variant" | "appearance" | "size">> &
  Pick<ButtonProps, "iconOnly" | "animated" | "loading" | "className">) {
  const classes = ["btn"];

  classes.push(
    appearance === "solid" ? `btn-${variant}` : `btn-${appearance}-${variant}`,
  );

  if (size === "sm") classes.push("btn-sm");
  if (size === "lg") classes.push("btn-lg");
  if (iconOnly) classes.push("btn-icon");
  if (animated) classes.push("btn-animation");
  if (loading) classes.push("btn-load");
  if (className) classes.push(className);

  return classes.join(" ");
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    appearance = "solid",
    size = "md",
    iconOnly = false,
    animated = false,
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    className,
    children,
    type = "button",
    ...rest
  },
  ref,
) {
  const isAnimatedText = animated && !iconOnly;

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={getButtonClassName({
        variant,
        appearance,
        size,
        iconOnly,
        animated,
        loading,
        className,
      })}
      disabled={disabled || loading}
      data-text={
        isAnimatedText && typeof children === "string" ? children : undefined
      }
    >
      {loading && (
        <span
          className={`spinner-border spinner-border-sm${!iconOnly && children ? " me-2" : ""}`}
          role="status"
          aria-hidden="true"
        />
      )}

      {!loading && leftIcon}

      {loading ? (
        !iconOnly && children
      ) : isAnimatedText ? (
        <span>{children}</span>
      ) : (
        children
      )}

      {!loading && rightIcon}
    </button>
  );
});

export default Button;
