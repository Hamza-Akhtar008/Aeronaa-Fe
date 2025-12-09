"use client";

import { useAuth } from "@/store/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Role } from "@/store/authContext"; // import your Role type

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: Role[]; // <-- optional list of allowed roles
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { auth, loading } = useAuth();
  const router = useRouter();

  // TEMPORARY DEV BYPASS - Remove in production
  // This will bypass authentication checks for all routes including the car rental dashboard
  const bypassAuth = false; // Set to false to enable normal authentication

  useEffect(() => {
    if (!loading && !bypassAuth) {
      if (!auth) {
        router.replace("/signin");
      } else if (allowedRoles && !allowedRoles.includes(auth.role)) {
        router.replace("/unauthorized");
      }
    }
  }, [auth, allowedRoles, loading]);

  if (bypassAuth) {
    return <>{children}</>; 
  }

  if (loading || !auth || (allowedRoles && !allowedRoles.includes(auth.role))) {
    return null;
  }

  return <>{children}</>;
}