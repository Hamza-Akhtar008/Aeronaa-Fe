'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const Header2 = () => {
  const navItems = [
    { name: 'Hotels', href: '#' },
    { name: 'Things to Do', href: '/#' },
    { name: 'Restaurants', href: '/#' },
    { name: 'Flights', href: '/#' },
    { name: 'Vacation Rentals', href: '/#' },
    { name: 'Cruises', href: '/cruises' },
    { name: 'Rental Cars', href: '/#' },
    { name: 'Forums', href: '/#' },
  ]

  return (
    <div className="flex flex-col w-full ">
      {/* Main Navigation */}
      <div className="border-b">
        <nav className="px-6 overflow-x-auto hide-scrollbar">
          <div className="flex items-center h-14 space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex-shrink-0 h-full flex items-center border-b-2 border-transparent hover:border-black text-[15px] font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/#" className="hover:underline">
            Travelers&apos; Choice
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/#" className="hover:underline">
            Hotels
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/#" className="hover:underline">
            Luxury
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/#" className="hover:underline">
            World
          </Link>
        </div>
        <div className="hidden md:block text-sm">
          Best of the Best Luxury Hotels in the World
        </div>
      </div>
    </div>
  )
}

export default Header2
