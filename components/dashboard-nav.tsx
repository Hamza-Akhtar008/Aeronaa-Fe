"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/utils"
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart2,
  Building2,
  Bookmark,
  FileText,
  GraduationCap,
  User,
  Package,
  ShoppingBag,
  Receipt,
  FileEdit,
  Briefcase,
  Map,
  FolderArchive,
  Menu,
  X,
  ChevronDown,
  
} from "lucide-react"
import { Button } from "@/components/ui/button"

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
  dropdown?: boolean
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: "/Dashboard/profile",
    icon: User,
  },
  {
    label: "Reviews",
    href: "/Dashboard/Reviews",
    icon: ShoppingCart,
  },
  {
    label: "Bookings",
    href: "/Dashboard/Bookings",
    icon: Bookmark,
  },
  {
    label: "Finance",
    href: "/Dashboard/Finance",
    icon: BarChart2,
  },
  
  
 
]

export function DashboardNav() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={cn(" top-0  w-full border-b bg-white transition-all", scrolled ? "shadow-sm" : "")}>
      {/* Mobile menu button */}
       <div className="flex h-14 items-center justify-between px-5 md:hidden">
        <div className="text-lg font-semibold text-[#023e8a]">Aeronaa</div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          className="text-[#023e8a] hover:bg-[#023e8a]/10 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile menu */}
    {isMobileMenuOpen && (
  <div className="max-h-[calc(100vh-3.5rem)] overflow-y-auto border-t border-[#023e8a] bg-[#023e8a] pb-4 md:hidden">
    <div className="grid gap-1 p-3">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors duration-200",
            pathname === item.href
              ? "bg-white text-[#023e8a] shadow-md"
              : "text-white hover:bg-white/20 hover:text-white"
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <item.icon
            className={cn(
              "h-5 w-5",
              pathname === item.href ? "text-[#023e8a]" : "text-white"
            )}
          />
          <span>{item.label}</span>
          {item.dropdown && <ChevronDown className="ml-auto h-4 w-4 text-white" />}
        </Link>
      ))}
    </div>
  </div>
)}


      {/* Desktop menu */}
      <div className="hidden h-16 items-center justify-center border-b border-gray-200 bg-[#023e8a] md:flex">
  <div className="flex space-x-6 px-6">
    {navItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex flex-col items-center justify-center border-b-2 px-5 py-3 text-sm font-semibold transition-colors duration-300",
          pathname === item.href
            ? "border-white text-white"
            : "border-transparent text-[#a3c7ff] hover:border-white hover:text-white"
        )}
        aria-current={pathname === item.href ? "page" : undefined}
      >
        <div className="flex items-center gap-1">
          <item.icon
            className={cn(
              "h-5 w-5",
              pathname === item.href ? "text-white" : "text-[#a3c7ff]"
            )}
          />
          {item.dropdown && (
            <ChevronDown
              className={cn(
                "h-3 w-3",
                pathname === item.href ? "text-white" : "text-[#a3c7ff]"
              )}
            />
          )}
        </div>
        <span className="mt-1">{item.label}</span>
      </Link>
    ))}
  </div>
</div>

    </nav>
  )
}
