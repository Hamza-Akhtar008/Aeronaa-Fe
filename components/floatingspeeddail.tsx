'use client';
import { useState, useEffect } from "react";
import { Plus, X, Hotel, Car, User, Building, Package, Grid, HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/store/authContext";

const FloatingSpeedDial = () => {
  const { auth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  // Add mount state for animations
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update the selected dashboard based on the current path
  useEffect(() => {
    if (pathname?.includes("/user")) {
      setSelectedDashboard("UserManagement");
    } else if (pathname?.includes("/Dashboard") || pathname?.includes("/property")) {
      setSelectedDashboard("HotelManagement");
    } else if (pathname?.includes("/car-rental-dashboard")) {
      setSelectedDashboard("CarRentals");
    } else if (pathname?.includes("/agent")) {
      setSelectedDashboard("AgentHome");
    } else if (pathname?.includes("/umarah-pakage/dashboard")) {
      setSelectedDashboard("UmrahPackages");
    }
  }, [pathname]);

  const handleTabClick = (dashboard: string) => {
    setSelectedDashboard(dashboard);
    setIsOpen(false);
  };

  const getButtonClass = (dashboard: string) => 
    selectedDashboard === dashboard
      ? "w-14 h-14 bg-gradient-to-r from-[#00b4d8] to-[#0096c7] rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-white ring-2 ring-[#00b4d8] scale-110 transition-all duration-300 ease-out"
      : "w-14 h-14 bg-gradient-to-r from-[#00b4d8] to-[#023e8a] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm";

  const menuItems = [
    { href: "/agent", dashboard: "AgentHome", icon: Grid, title: "Agent Home" },
    { href: "/user/bookings", dashboard: "UserManagement", icon: User, title: "User Management" },
    { href: "/Dashboard", dashboard: "HotelManagement", icon: Building, title: "Hotel Management", permission: "hotel" },
    { href: "/car-rental-dashboard", dashboard: "CarRentals", icon: Car, title: "Car Rentals", permission: "car" },
  { href: "/umarah-pakage/dashboard", dashboard: "UmrahPackages", icon: Package, title: "Umrah Packages", permission: "umrah" },
    { href: "/property-dashboard", dashboard: "Property", icon: HomeIcon, title: "Property", permission: "property" },
  ];

   const allowedMenuItems = menuItems.filter(item => {
    if (!item?.permission) return true; // "AgentHome" and "UserManagement" always visible
    return auth?.Permissions?.includes(item.permission);
  });

  // Animation delays for staggered entrance
  const getItemDelay = (index: number) => ({
    animationDelay: `${index * 100}ms`
  });

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Speed Dial Options with Staggered Animation */}
      <div className={`flex flex-col items-center space-y-4 mb-4 transition-all duration-500 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {allowedMenuItems.map((item, index) => (
          <div
            key={item.dashboard}
            className={`transition-all duration-500 transform ${
              isOpen 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-50'
            }`}
            style={getItemDelay(allowedMenuItems.length - 1 - index)}
          >
            {/* Tooltip */}
            <div className="relative group">
              <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                {item.title}
                <div className="absolute top-1/2 right-[-4px] transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
              
              <Link href={item.href}>
                <button
                  onClick={() => handleTabClick(item.dashboard)}
                  className={getButtonClass(item.dashboard)}
                  title={item.title}
                >
                  <item.icon className="w-6 h-6" />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Main Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 bg-gradient-to-r from-[#00b4d8] to-[#023e8a] rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-3xl transition-all duration-300 ${
          isOpen 
            ? 'rotate-45 bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24]' 
            : 'rotate-0 hover:scale-110'
        } backdrop-blur-sm border border-white/20`}
      >
        {isOpen ? (
          <X className="w-7 h-7 transition-transform duration-300" />
        ) : (
          <Plus className="w-7 h-7 transition-transform duration-300" />
        )}
      </button>
    </div>
  );
}

export default FloatingSpeedDial;