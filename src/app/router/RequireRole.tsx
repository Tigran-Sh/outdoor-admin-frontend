import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/app/providers/useAuth";

import { getHomePathForRole } from "./roleHome";

import type { Role } from "@/types/auth";

interface RequireRoleProps {
  allow: Role[];
}

function RequireRole({ allow }: RequireRoleProps) {
  const { status, user } = useAuth();

  if (status === "loading") {
    return null;
  }

  if (!user || !allow.includes(user.role)) {
    return <Navigate to={user ? getHomePathForRole(user.role) : "/"} replace />;
  }

  return <Outlet />;
}

export default RequireRole;
