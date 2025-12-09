import type { ReactNode } from "react"
import "../../globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SigninSiteHeader } from "@/components/signin-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { ProtectedRoute } from "@/components/ProtectedRoute";
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Aeronna",
  description: "Dashboard - Aeronaa",
 icons: {
  icon: "/images/logo.ico",
  apple: "/images/logo.ico",
},
}

export default function VendorLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
            <ProtectedRoute allowedRoles={[ 'vendor','agent']}>
              <div className={inter.className}>
                <SigninSiteHeader />
                <div className="min-h-screen bg-gray-50">
                  <DashboardNav />
                  <div className="container py-8">
                    <div className="mx-auto max-w-5xl">
                        {children}
                    </div>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
  )
}
