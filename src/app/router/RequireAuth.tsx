import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/app/providers/useAuth";

function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
