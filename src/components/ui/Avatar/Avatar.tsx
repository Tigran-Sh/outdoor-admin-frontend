import type { AvatarProps } from "./Avatar.types";

function joinClassNames(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function getInitials(name?: string) {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function Avatar({ src, name, size = "md", rounded = true, className }: AvatarProps) {
  const wrapperClassName = joinClassNames(
    `avatar-${size}`,
    "flex-shrink-0",
    rounded && "rounded-circle",
    className,
  );

  if (src) {
    return (
      <div className={joinClassNames(wrapperClassName, "overflow-hidden")}>
        <img
          src={src}
          alt={name ?? ""}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <span className={joinClassNames("avatar-title", rounded && "rounded-circle")}>
        {getInitials(name)}
      </span>
    </div>
  );
}

export default Avatar;
