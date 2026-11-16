import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import type { AuthSession } from "@/lib/auth";

interface ProtectedRouteProps {
  session: AuthSession | null;
  children: ReactNode;
}

export function ProtectedRoute({ session, children }: ProtectedRouteProps) {
  if (!session) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
