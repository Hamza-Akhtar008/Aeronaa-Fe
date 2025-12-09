"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface SortBarProps {
  sortBy: string
  setSortBy: (value: string) => void
}

export default function SortBar({ sortBy, setSortBy }: SortBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Rating" },
    { value: "name", label: "Name: A to Z" },
  ]

  const currentLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || "Recommended"

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:border-[#00afd5] focus:ring-1 focus:ring-[#00afd5]"
      >
        <span className="text-sm font-medium text-gray-700">{currentLabel}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSortBy(option.value)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-all ${
                sortBy === option.value ? "bg-[#024891] text-white font-medium" : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
