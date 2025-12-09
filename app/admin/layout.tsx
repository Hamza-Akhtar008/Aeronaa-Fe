"use client"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import Link from "next/link"
import {
  Bell,
  Car,
  Home,
  Hotel,
  LineChart,
  Package,
  Plane,
  Search,
  ShoppingCart,
  Users,
  Zap,
  Settings,
  HelpCircle,
  Star,
  Menu,
  X,
  Router,
  DollarSign,
  User2,
  Receipt,
} from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Suspense } from "react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/store/authContext"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { logout } = useAuth();
  const handleLogout = () => {
    logout()
    router.push("/signin")
  }

  return (
      <ProtectedRoute allowedRoles={[ 'admin']}>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
          fixed md:relative inset-y-0 left-0 z-50 md:z-auto
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          transition-transform duration-300 ease-in-out
          w-[280px] lg:w-[320px]
          border-r border-white/20 bg-gradient-to-b from-primary-start via-blue-600 to-primary-end 
          overflow-hidden
          md:block
          col-start-1 md:col-auto
        `}
        >
          {/* Enhanced Glassmorphism overlay */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>

          {/* Enhanced Decorative elements */}
          <div className="absolute top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-40 -left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 -right-10 w-24 h-24 bg-cyan-300/10 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "4s" }}
          ></div>

          <div className="relative flex h-full max-h-screen flex-col gap-2 z-10">
            {/* Enhanced Logo Section */}
            <div className="flex h-16 items-center justify-between px-6 lg:h-[70px] border-b border-white/20">
              <Link href="/" className="flex items-center gap-3 font-bold text-xl group">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <div className="relative bg-white/20 backdrop-blur-sm p-2.5 rounded-xl border border-white/30 group-hover:bg-white/30 transition-all duration-300 animate-glow">
                    <Image
                               src="/images/aeronalogo.png"
                               alt="Aeronaa"
                               width={200}
                               height={100}
                               priority
                               className="brightness-100"
                             />
                  </div>
                </div>
                
              </Link>

              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-white/10 rounded-xl"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Enhanced Navigation */}
            <div className="flex-1 px-4 py-4 overflow-y-auto">
              <nav className="grid items-start gap-2 text-sm font-medium">
                {/* Dashboard Link First */}
                <Link
                  href="/admin"
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] ${
                    pathname === "/admin"
                      ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-white/5"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      pathname === "/admin" ? "bg-white/20 shadow-sm" : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    <Home className="h-4 w-4" />
                  </div>
                  <span className={pathname === "/admin" ? "font-semibold" : "font-medium"}>Dashboard</span>
                  {pathname === "/admin" && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse shadow-sm"></div>
                  )}
                </Link>
 {/* Profile Link Second */}
  <Link
                  href="/admin/payment"
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] ${
                    pathname === "/admin/profile"
                      ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-white/5"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/payment" ? "bg-white/20 shadow-sm" : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <span className={pathname === "/admin/payment" ? "font-semibold" : "font-medium"}>Payment</span>
                  {pathname === "/admin/payment" && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse shadow-sm"></div>
                  )}
                </Link>
                  <Link
                  href="/admin/receipt"
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] ${
                    pathname === "/admin/receipt"
                      ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-white/5"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/receipt" ? "bg-white/20 shadow-sm" : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    <Receipt className="h-4 w-4" />
                  </div>
                  <span className={pathname === "/admin/receipt" ? "font-semibold" : "font-medium"}>Invoice</span>
                  {pathname === "/admin/receipt" && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse shadow-sm"></div>
                  )}
                </Link>
                <Link
                  href="/admin/profile"
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] ${
                    pathname === "/admin/profile"
                      ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-white/5"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/profile" ? "bg-white/20 shadow-sm" : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                  </div>
                  <span className={pathname === "/admin/profile" ? "font-semibold" : "font-medium"}>Profile</span>
                  {pathname === "/admin/profile" && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse shadow-sm"></div>
                  )}
                </Link>


              

               

                <Link
                  href="/admin/umrah"
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] ${
                    pathname === "/admin/umrah"
                      ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-white/5"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/umrah" ? "bg-white/20 shadow-sm" : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    <Plane className="h-4 w-4" />
                  </div>
                  <span className={pathname === "/admin/umrah" ? "font-semibold" : "font-medium"}>Umrah</span>
                </Link>
                  <Link
                  href="/admin/umrah-bookings"
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] ${
                    pathname === "/admin/umrah-bookings"
                      ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-white/5"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/umrah-bookings" ? "bg-white/20 shadow-sm" : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <span className={pathname === "/admin/umrah-bookings" ? "font-semibold" : "font-medium"}>Umrah Bookings</span>
                </Link>

               

                <Link
                  href="/admin/hotels"
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] ${
                    pathname === "/admin/hotels"
                      ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-white/5"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/hotels" ? "bg-white/20 shadow-sm" : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    <Hotel className="h-4 w-4" />
                  </div>
                  <span className={pathname === "/admin/hotels" ? "font-semibold" : "font-medium"}>Hotels</span>
                </Link>
  <Link
                  href="/admin/bookings"
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] ${
                    pathname === "/admin/bookings"
                      ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-white/5"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/bookings" ? "bg-white/20 shadow-sm" : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <span className={pathname === "/admin/bookings" ? "font-semibold" : "font-medium"}>Hotel Bookings</span>
                 
                </Link>
              

               
                {/* <Link
                  href="/admin/properties"
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] ${
                    pathname === "/admin/properties"
                      ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-white/5"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/properties" ? "bg-white/20 shadow-sm" : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    <Home className="h-4 w-4" />
                  </div>
                  <span className={pathname === "/admin/properties" ? "font-semibold" : "font-medium"}>Properties</span>
                </Link> */}

              

              

                <Link
                  href="/admin/users"
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] ${
                    pathname === "/admin/users"
                      ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-white/5"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/users" ? "bg-white/20 shadow-sm" : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                  </div>
                  <span className={pathname === "/admin/users" ? "font-semibold" : "font-medium"}>Users</span>
                </Link>

                <Link
                  href="/admin/vendors"
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] ${
                    pathname === "/admin/vendors"
                      ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-white/5"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/vendors" ? "bg-white/20 shadow-sm" : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    <Package className="h-4 w-4" />
                  </div>
                  <span className={pathname === "/admin/vendors" ? "font-semibold" : "font-medium"}>Vendors</span>
                </Link>

                <Link
                  href="/admin/reviews"
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] ${
                    pathname === "/admin/reviews"
                      ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-white/5"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/reviews" ? "bg-white/20 shadow-sm" : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    <Star className="h-4 w-4" />
                  </div>
                  <span className={pathname === "/admin/reviews" ? "font-semibold" : "font-medium"}>Reviews</span>
                </Link>

                {/* <Link
                  href="/admin/analytics"
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] ${
                    pathname === "/admin/analytics"
                      ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-white/5"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/analytics" ? "bg-white/20 shadow-sm" : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    <LineChart className="h-4 w-4" />
                  </div>
                  <span className={pathname === "/admin/analytics" ? "font-semibold" : "font-medium"}>Analytics</span>
                </Link> */}

                {/* <Link
                  href="/admin/notifications"
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] ${
                    pathname === "/admin/notifications"
                      ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-white/5"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      pathname === "/admin/notifications"
                        ? "bg-white/20 shadow-sm"
                        : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                  </div>
                  <span className={pathname === "/admin/notifications" ? "font-semibold" : "font-medium"}>
                    Notifications
                  </span>
                </Link> */}

                <div className="my-4 h-px bg-white/20"></div>

               
              </nav>
            </div>

            {/* Enhanced Services Card */}
            <div className="mt-auto p-4">
              <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-2xl shadow-black/10 rounded-3xl overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="text-white text-base font-semibold">Quick Services</CardTitle>
                  <CardDescription className="text-white/70 text-sm">Manage platform services</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/40 shadow-lg hover:shadow-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm rounded-xl"
                      asChild
                    >
                      <Link href="/admin/hotels" onClick={() => setSidebarOpen(false)}>
                        <Hotel className="mr-1.5 h-3 w-3" /> Hotels
                      </Link>
                    </Button>
                   
                    <Button
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/40 shadow-lg hover:shadow-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm rounded-xl"
                      asChild
                    >
                      <Link href="/admin/umrah" onClick={() => setSidebarOpen(false)}>
                        <Plane className="mr-1.5 h-3 w-3" /> Umrah
                      </Link>
                    </Button>
                   
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col col-span-full md:col-span-1">
          {/* Enhanced Header */}
          <header className="flex h-16 items-center gap-4 border-b border-white/20 bg-white/80 backdrop-blur-xl px-6 lg:h-[70px] shadow-soft">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200 rounded-2xl"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="w-full flex-1">
              <form>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors duration-200" />
                  <Input
                    type="search"
                    placeholder="Search bookings, users, vendors..."
                    className="w-full max-w-md bg-white/60 backdrop-blur-sm border-gray-200/60 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 pl-10 rounded-2xl shadow-sm hover:shadow-md focus:shadow-lg"
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center gap-3">
             

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full border-2 border-gray-200/60 hover:border-primary/50 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                  >
                    <User2 className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white/95 backdrop-blur-xl border-gray-200/60 text-gray-900 shadow-strong rounded-2xl min-w-[200px]"
                >
                  <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200/60" />
                 <Link href={`/admin/profile`}> <DropdownMenuItem className="hover:bg-gray-100/80 rounded-xl cursor-pointer">
                    Settings
                  </DropdownMenuItem></Link>
               
                  <DropdownMenuSeparator className="bg-gray-200/60" />
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-100/80 rounded-xl cursor-pointer text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Enhanced Main Content Area */}
          <main className="flex-1 p-6 lg:p-8 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 min-h-0 overflow-auto">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }
            >
              <div className="animate-slide-up">{children}</div>
            </Suspense>
          </main>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
