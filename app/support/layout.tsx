import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ProtectedRoute } from "@/components/ProtectedRoute"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Aeronaa Support Dashboard",
  description: "Manage flight tickets and bookings",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <ProtectedRoute allowedRoles={[ 'support']}>
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
    </ProtectedRoute>
  )
}
