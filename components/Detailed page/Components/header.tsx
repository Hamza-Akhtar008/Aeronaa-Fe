"use client";
import { Search, Globe, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownClick = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const dropdownMenus = {
    discover: [
      { label: "Travelers' Choice", href: "#" },
      { label: "Travel Stories", href: "#" },
    ],
    trips: [
      { label: "View my trips", href: "#" },
      { label: "Start a new trip", href: "#" },
      { label: "Create trip with AI", href: "#" },
    ],
    review: [
      { label: "Write a review", href: "#" },
      { label: "Post photos", href: "#" },
      { label: "Add a place", href: "#" },
    ],
  };

  return (
    <header className="fixed w-full  h-[110px] flex flex-wrap items-center justify-between px-4 sm:px-6 py-4 bg-white z-40">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <Link href="/">
          <Image
            src="/images/Aeronaa-Logo.png"
            alt="Aeronaa Logo"
            width={150}
            height={40}
            className="cursor-pointer"
          />
        </Link>
      </div>

      <div className="w-full order-3 md:order-2 md:w-auto md:flex-1 max-w-2xl mx-0 md:mx-6 mt-4 md:mt-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 pl-10 border border-gray-500 rounded-full focus:outline-none focus:border-gray-950"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="order-2 md:order-3 flex items-center gap-4 md:gap-6">
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <nav className="hidden md:flex items-center gap-4">
          {Object.entries(dropdownMenus).map(([key, items]) => (
            <div key={key} className="relative">
              <button
                onClick={() => handleDropdownClick(key)}
                className="px-4 py-2 font-semibold rounded-full hover:bg-gray-100 transition-colors capitalize"
              >
                {key}
              </button>
              {activeDropdown === key && (
                <div className="absolute top-full right-0 mt-2 py-3 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                  {items.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="block px-6 py-3 text-base text-gray-700 hover:bg-gray-50 hover:text-[#023e8a] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button className="px-4 py-2 flex items-center font-semibold gap-2 rounded-full hover:bg-gray-100 transition-colors">
            <Globe className="h-5 w-5" />
            <span>USD</span>
          </button>
          <button className="px-6 py-2 font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-colors">
            Sign in
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="w-full order-4 md:hidden bg-white mt-4">
          <div className="flex flex-col gap-4">
            {Object.entries(dropdownMenus).map(([key, items]) => (
              <div key={key} className="flex flex-col gap-2">
                <button
                  onClick={() => handleDropdownClick(key)}
                  className="px-4 py-2 font-medium text-left rounded-full hover:bg-gray-100 capitalize"
                >
                  {key}
                </button>
                {activeDropdown === key && (
                  <div className="pl-4 flex flex-col gap-1">
                    {items.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="px-4 py-2 text-base text-gray-700 hover:bg-gray-50 hover:text-[#023e8a] rounded-md"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 flex items-center gap-2 rounded-full hover:bg-gray-100">
                <Globe className="h-5 w-5" />
                <span>USD</span>
              </button>
              <button className="px-6 py-2 font-medium text-white bg-black rounded-full">
                Sign in
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
