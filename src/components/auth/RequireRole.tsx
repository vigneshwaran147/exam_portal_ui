import { Navigate, Outlet } from "react-router-dom";
import type { UserRole } from "@/types/auth";
import { usePortal } from "@/hooks/usePortal";

type RequireRoleProps = {
  allowed: UserRole[];
};

function RequireRole({ allowed }: RequireRoleProps) {
  const { currentUser } = usePortal();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RequireRole;
