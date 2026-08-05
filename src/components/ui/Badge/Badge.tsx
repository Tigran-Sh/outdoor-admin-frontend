import { forwardRef } from "react";

import type { BadgeProps } from "./Badge.types";

function getBadgeClassName({
  variant,
  appearance,
  pill,
  className,
}: Required<Pick<BadgeProps, "variant" | "appearance">> &
  Pick<BadgeProps, "pill" | "className">) {
  const classes = ["badge"];

  classes.push(appearance === "subtle" ? `bg-${variant}-subtle text-${variant}` : `bg-${variant}`);

  if (pill) classes.push("rounded-pill");
  if (className) classes.push(className);

  return classes.join(" ");
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "primary", appearance = "solid", pill = false, className, children, ...rest },
  ref,
) {
  return (
    <span
      {...rest}
      ref={ref}
      className={getBadgeClassName({ variant, appearance, pill, className })}
    >
      {children}
    </span>
  );
});

export default Badge;
