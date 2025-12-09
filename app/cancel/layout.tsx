import type { ReactNode } from "react"
import "../globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Suspense } from 'react'
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Booking Failed -Aeronna",
  description: "Aeronna Auth",
  icons: {
  icon: "/images/logo.ico",
  apple: "/images/logo.ico",
},
}

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
      <Suspense>
    <div className={inter.className}>
        {children}
    </div>
      </Suspense>
  )
}
