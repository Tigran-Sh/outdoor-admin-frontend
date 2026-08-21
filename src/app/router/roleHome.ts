import type { Role } from "@/types/auth";

export function getHomePathForRole(role: Role): string {
  switch (role) {
    case "platform_admin":
    case "internal_admin":
      return "/admin/dashboard";
    default:
      return "/club/dashboard";
  }
}
