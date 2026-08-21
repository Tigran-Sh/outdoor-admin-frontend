import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/app/providers/useAuth";

import { getHomePathForRole } from "./roleHome";

function RequireGuest() {
  const { status, user } = useAuth();

  if (status === "loading") {
    return null;
  }

  if (status === "authenticated" && user) {
    return <Navigate to={getHomePathForRole(user.role)} replace />;
  }

  return <Outlet />;
}

export default RequireGuest;
