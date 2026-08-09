export type AvatarSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  /** Image URL to render. Falls back to initials derived from `name` when omitted. */
  src?: string;
  /** Used to derive the fallback initials and as the image's alt text. */
  name?: string;
  size?: AvatarSize;
  /** Renders a circular avatar. Defaults to `true`. */
  rounded?: boolean;
  className?: string;
}
