"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Settings, LayoutDashboard, LogOut } from "lucide-react";
import { useSidebar } from "@/components/User/contexts/SidebarContext";
import Link from "next/link";
import { useAuth } from "@/store/authContext";
import { FetchUser } from "@/lib/api";

const Header = () => {
  const { toggle } = useSidebar();
  const pathname = usePathname() || "";
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
const { auth, loading } = useAuth();
const [user, setUser] = useState<User>({}as User);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = (path: string): string => {
    const segment = path.split("/").filter(Boolean).pop();
    if (!segment) return "Dashboard";

    const titles: { [key: string]: string } = {
      profile: "My Profile",
      bookings: "My Bookings",
      upcoming: "Upcoming Trips",
      history: "Booking History",
      saved: "Saved Hotels",
      notifications: "Notifications",
      support: "Support / Help",
      dashboard: "Dashboard",
    };

    return (
      titles[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    );
  };
useEffect(() => {
  if (!loading && auth) {
    const fetchUserData = async () => {
      try {
        const response = await FetchUser(auth.id.toString());
        setUser(response);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUserData();
  }
}, [loading, auth]);
  return (
    <header className="sticky top-0 right-0 left-0 h-24 bg-gradient-to-r from-primary-start via-blue-600 to-primary-end text-white backdrop-blur-sm z-50
                     border-b border-white/10 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="text-white/90 md:hidden block hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl lg:text-2xl font-semibold text-white/90 truncate">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-2 lg:gap-5">
        <div className="text-right hidden lg:block">
          <p className="text-sm font-medium text-white/75">Welcome back,</p>
          <p className="text-white font-semibold text-base">{user?.name}</p>
        </div>
        <div ref={settingsRef} className="relative">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Settings size={20} className="text-white/90" />
          </button>
          {isSettingsOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white py-1 ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <Link
                  href="/user/bookings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LayoutDashboard size={16} className="mr-2" />
                  Dashboard
                </Link>
                <Link
                  href="/user/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
