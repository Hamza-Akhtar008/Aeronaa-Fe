"use client"

import type React from "react"
import { useState } from "react"
import {
  LayoutDashboard,
  PlaneTakeoff,
  Ticket,
  CalendarRange,
  Settings,
  HelpCircle,
  Menu,
  X,
  Bell,
  Search,
  
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils/utils"
import Image from "next/image"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { useAuth } from "@/store/authContext"

interface DashboardLayoutProps {
  children: React.ReactNode
  currentPage: string
  onPageChange: (page: string) => void
}

export function DashboardLayout({ children, currentPage, onPageChange }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const menuItems = [
    { id: "create", icon: PlaneTakeoff, label: "Post Ticket", badge: null },
    { id: "tickets", icon: Ticket, label: "Posted Tickets", badge: "12" },
    { id: "bookings", icon: CalendarRange, label: "Bookings", badge: "3" },
   
  ]
const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/30 flex">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/80 backdrop-blur-sm shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50">
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

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onPageChange(item.id)
                      setIsSidebarOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium",
                      currentPage === item.id
                        ? "bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Settings */}
         

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200/50">
            <div className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-gray-50">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-[#023e8a] text-white text-sm">SA</AvatarFallback>
              </Avatar>
             
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
   <header className="sticky top-0 z-50 flex items-center justify-between px-6 h-16 lg:h-[70px] bg-white/90 border-b border-gray-200 shadow-sm backdrop-blur-md">
  {/* Mobile Menu */}
  <Button
    variant="ghost"
    size="icon"
    className="md:hidden text-gray-600 hover:bg-gray-100 rounded-2xl"
    onClick={() => setSidebarOpen(true)}
  >
    <Menu className="w-5 h-5" />
  </Button>

  {/* Search */}
  <div className="flex-1 max-w-md">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="search"
        placeholder="Search bookings, users, vendors..."
        className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 shadow-sm text-sm focus:ring-primary/20 focus:border-primary/50 transition"
      />
    </div>
  </div>

  {/* Right Controls */}
  <div className="flex items-center gap-4 ml-4">
    {/* Notifications */}
    <Button
      variant="ghost"
      size="icon"
      className="relative h-10 w-10 rounded-2xl text-gray-600 hover:bg-gray-100"
    >
      <Bell className="w-4 h-4" />
      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
    </Button>

    {/* Profile Dropdown */}
  <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      variant="ghost"
      className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-300 hover:border-primary/60 transition"
    >
      <Image
        src="/placeholder.svg?height=32&width=32"
        width={32}
        height={32}
        alt="Avatar"
        className="rounded-full object-cover"
      />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    sideOffset={8}
    className="w-64 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-2"
  >
    {/* Profile info */}
    <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition">
      <Image
        src="/placeholder.svg?height=40&width=40"
        width={40}
        height={40}
        alt="User"
        className="rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">Hamza Akhtar</span>
        <span className="text-xs text-gray-500">Support Engineer</span>
      </div>
    </div>

    <DropdownMenuSeparator className="my-2 bg-gray-100" />

    {/* Optional links */}
  

    <DropdownMenuSeparator className="my-2 bg-gray-100" />

    {/* Logout */}
    <DropdownMenuItem
      onClick={logout}
      className="px-3 py-2 text-sm text-red-600 rounded-xl hover:bg-red-50 cursor-pointer font-medium"
    >
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

  </div>
</header>


        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}
