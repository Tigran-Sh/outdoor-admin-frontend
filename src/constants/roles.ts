import type { BadgeVariant } from "@/components/ui/Badge/Badge.types";
import type { Role } from "@/types/auth";

export const ROLE_BADGE_VARIANT: Record<Role, BadgeVariant> = {
  platform_admin: "danger",
  internal_admin: "warning",
  club_owner: "primary",
  guide: "info",
  participant: "secondary",
};
