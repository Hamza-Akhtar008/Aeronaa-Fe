// app/umrah-package/layout.tsx
import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/umrahdashboard/dashboard-layout";
import { Toaster } from "react-hot-toast";

export default function UmrahPackageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["umrah"]}>
      <DashboardLayout>
        <main>{children}</main>
      </DashboardLayout>
      
    </ProtectedRoute>
  );
}
