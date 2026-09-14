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

  // Matches the template's Default Badges example, which pairs the light variant with
  // `text-dark` (white badge text is unreadable on the near-white `bg-light`).
  if (appearance === "solid" && variant === "light") classes.push("text-dark");

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
