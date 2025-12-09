"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Car,
  Calendar,
  Users,
  CreditCard,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Inter } from "next/font/google";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

interface SidebarItemProps {
  icon: React.ElementType;
  title: string;
  href: string;
  active: boolean;
}

const SidebarItem = ({ icon: Icon, title, href, active }: SidebarItemProps) => (
  <Link href={href}>
    <Button
      variant={active ? "default" : "ghost"}
      className={`w-full justify-start gap-2 ${
        active
          ? "bg-[#023e8a] hover:bg-[#00b4d8] text-white"
          : "hover:bg-[#023e8a]/10 hover:text-[#023e8a]"
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? "text-white" : "text-gray-500"}`} />
      <span>{title}</span>
    </Button>
  </Link>
);

export default function CarRentalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigation = [
    {
      icon: Car,
      title: "Dashboard",
      href: "/car-rental-dashboard",
    },
    // {
    //   icon: Calendar,
    //   title: "Bookings",
    //   href: "/car-rental-dashboard/bookings",
    // },
    {
      icon: Car,
      title: "Fleet",
      href: "/car-rental-dashboard/fleet",
    },
    // {
    //   icon: Users,
    //   title: "Partners",
    //   href: "/car-rental-dashboard/partners",
    // },
    // {
    //   icon: Users,
    //   title: "Customers",
    //   href: "/car-rental-dashboard/customers",
    // },
    // {
    //   icon: CreditCard,
    //   title: "Finance",
    //   href: "/car-rental-dashboard/finance",
    // },
    // {
    //   icon: BarChart,
    //   title: "Reports",
    //   href: "/car-rental-dashboard/reports",
    // },
    {
      icon: Settings,
      title: "Settings",
      href: "/car-rental-dashboard/settings",
    },
  ];
  
  return (
  <ProtectedRoute allowedRoles={["vendor", "carrental","agent"]}>
      <div className={inter.className}>
        <div className="flex h-screen overflow-hidden bg-gray-50">
          {/* Mobile sidebar toggle */}
          <div className="fixed top-4 left-4 z-50 block lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex h-full flex-col overflow-y-auto">
              <div className="flex h-20 items-center border-b px-6">
                  <div className="flex h-16 items-center justify-between px-6 lg:h-[70px] border-b border-white/20">
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
              </div>
              <div className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => (
                  <SidebarItem
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    href={item.href}
                    active={pathname === item.href}
                  />
                ))}
              </div>
              <div className="border-t p-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/signin"; 
                }}>
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          {/* Main content */}
          <div className="flex flex-1 flex-col lg:pl-64">
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}
