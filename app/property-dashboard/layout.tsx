import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

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

export default function PropertyLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
            <ProtectedRoute allowedRoles={[ 'property','agent']}>
              <div className={inter.className}>
              
              
                 
             
                
                        {children}
                
               
               
              </div>
            </ProtectedRoute>
  )
}
