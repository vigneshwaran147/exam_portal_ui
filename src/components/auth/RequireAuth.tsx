import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePortal } from "@/hooks/usePortal";

function RequireAuth() {
  const { currentUser } = usePortal();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
