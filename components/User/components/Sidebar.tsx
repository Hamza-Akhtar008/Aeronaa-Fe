'use client'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { 
  UserCircle, Calendar, Clock, Car, Heart, 
  Bell, HelpCircle, LogOut, StarIcon, 
  Star, TicketCheck,
  Package,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/components/User/contexts/SidebarContext';
import { useAuth } from '@/store/authContext'




const Sidebar = () => {
  const { logout } = useAuth();
  const { isOpen, toggle } = useSidebar();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuItems = [
  { icon: <Calendar size={20} />, title: 'My Hotel Bookings', path: '/user/bookings' },

  { icon: <Package size={20} />, title: 'My Umrah Booking', path: '/user/umrah-package' },


  { icon: <UserCircle size={20} />, title: 'Profile', path: '/user/profile' },
  { icon: <Star size={20} />, title: 'My Reviews', path: '/user/reviews' },

 // { icon: <Bell size={20} />, title: 'Notifications', path: '/user/notifications' },
  { icon: <LogOut size={20} />, title: 'Logout',path: '/signin', onClick: () => {logout() 
    
  } }, // placeholder for now
];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target as Node)) {
        toggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, toggle]);

  const handleSidebarClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      toggle();
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 md:hidden z-[98]"
          onClick={toggle}
        />
      )}
      
      <div
        ref={sidebarRef}
        onClick={handleSidebarClick}
        className={`w-64 h-screen fixed bg-gradient-to-br from-white via-white to-white shadow-xl
                   transition-transform duration-300 ease-in-out transform
                   md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                   z-[99]`}
      >
        {/* Logo Section */}
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

        {/* Menu Items */}
        <nav className="p-3 space-y-1">
         {menuItems.map((item, index) => {
  const isActive = pathname === item.path;

  const handleClick = () => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      if (window.innerWidth < 640) {
        toggle();
      }
    }
  };
  return (
    <div key={index}>
      {item.path ? (
        <Link 
          href={item.path}
          onClick={handleClick}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all
          ${isActive 
            ? 'bg-gradient-to-r from-primary-start via-blue-600 to-primary-end text-white' 
            : 'hover:bg-[#023e8a15] text-gray-600 hover:text-[#023e8a]'
          }
          group cursor-pointer relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-[400ms]" />
          <span className={`${isActive ? 'text-white' : 'text-[#023e8a70] group-hover:text-[#023e8a]'} transition-colors z-10`}>
            {item.icon}
          </span>
          <span className={`font-medium text-sm z-10 ${isActive ? 'text-white' : ''}`}>
            {item.title}
          </span>
        </Link>
      ) : (
        <button
          onClick={handleClick}
          className="flex items-center gap-3 px-4 py-3.5 w-full text-left rounded-xl transition-all hover:bg-[#023e8a15] text-gray-600 hover:text-[#023e8a] group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-[400ms]" />
          <span className="text-[#023e8a70] group-hover:text-[#023e8a] transition-colors z-10">
            {item.icon}
          </span>
          <span className="font-medium text-sm z-10">{item.title}</span>
        </button>
      )}
    </div>
  );
})}

        </nav>

        {/* Divider */}
        <div className="px-6 py-6">
          <div className="h-[1px] bg-gradient-to-r from-[#023e8a10] via-[#023e8a30] to-[#023e8a10]" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
