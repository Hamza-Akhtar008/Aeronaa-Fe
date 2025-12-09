"use client"

import { Search } from "lucide-react"

interface HotelsSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function HotelsSearchBar({ value, onChange }: HotelsSearchBarProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search hotels by name, city..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00afd5] focus:ring-1 focus:ring-[#00afd5] transition-all"
        />
      </div>
    </div>
  )
}
