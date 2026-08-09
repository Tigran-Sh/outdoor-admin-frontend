import type { HTMLAttributes } from "react";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "light"
  | "dark";

export type BadgeAppearance = "solid" | "subtle";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Theme color to apply. Maps to Bootstrap's `$theme-colors`. */
  variant?: BadgeVariant;
  /** Visual style of the badge (solid background vs. soft/subtle tint). */
  appearance?: BadgeAppearance;
  /** Renders a fully-rounded, pill-shaped badge. */
  pill?: boolean;
}
