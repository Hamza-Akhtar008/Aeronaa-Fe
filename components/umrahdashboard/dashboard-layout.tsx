"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, Plus, BookOpen, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/utils"
import { useAuth } from "@/store/authContext"
import Image from "next/image"


interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/umarah-pakage/dashboard", icon: LayoutDashboard },
  { name: "Add Package", href: "/umarah-pakage/add-package", icon: Plus },
  { name: "My Packages", href: "/umarah-pakage/packages", icon: Package },
  { name: "Bookings", href: "/umarah-pakage/bookings", icon: BookOpen },

]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { auth, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-[#023e8a15] bg-white/50">
           <Link href="/" className="flex items-center gap-3 font-bold text-xl group">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <div className="relative bg-white/20 backdrop-blur-sm p-2.5 rounded-xl border border-white/30 group-hover:bg-white/30 transition-all duration-300 animate-glow">
                    <Image
                               src="/images/Aeronaa-Logo.png"
                               alt="Aeronaa"
                               width={200}
                               height={100}
                               priority
                               className="brightness-100"
                             />
                  </div>
                </div>
                
              </Link>
        </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? /* Updated active state to use blue gradient theme */ "bg-gradient-to-r from-[#023e8a]/10 to-[#00b4d8]/10 text-[#023e8a] border border-[#00b4d8]/20 dark:from-[#023e8a]/20 dark:to-[#00b4d8]/20 dark:text-[#00b4d8]"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
           
            <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-6">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex-1" />
            </div>
          </div>

          {/* Page content */}
          <main className="p-6">{children}</main>
        </div>
      </div>

  )
}
