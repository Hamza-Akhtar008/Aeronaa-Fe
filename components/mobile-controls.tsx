"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronUp, Search, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface MobileControlsProps {
  onSearchOpen: boolean
  setOnSearchOpen: (open: boolean) => void
  onSortOpen: boolean
  setOnSortOpen: (open: boolean) => void
  onFiltersOpen: boolean
  setOnFiltersOpen: (open: boolean) => void
  searchValue: string
  onSearchChange: (value: string) => void
  sortBy: string
  setSortBy: (value: string) => void
  SearchBarComponent: React.ReactNode
  SortBarComponent: React.ReactNode
  FiltersComponent: React.ReactNode
}

export function MobileControls({
  onSearchOpen,
  setOnSearchOpen,
  onSortOpen,
  setOnSortOpen,
  onFiltersOpen,
  setOnFiltersOpen,
  searchValue,
  onSearchChange,
  sortBy,
  setSortBy,
  SearchBarComponent,
  SortBarComponent,
  FiltersComponent,
}: MobileControlsProps) {
  return (
    <>
      {/* Mobile Control Row */}
      <div className="lg:hidden flex  w-full">
        {/* Search */}

           {/* Sort */}
        <div
          onClick={() => setOnSortOpen(!onSortOpen)}
          className="flex-1 flex  items-center justify-center gap-1 cursor-pointer transition text-[#0A3A7A]"
        >
          <span className="sr-only">Sort Icon</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_891_4675)">
              <path
                d="M9.80876 12.1499L5.92592 16.8359V2.21245C5.92592 2.11515 5.88727 2.02184 5.81847 1.95304C5.74967 1.88424 5.65636 1.84559 5.55906 1.84559C5.46177 1.84559 5.36845 1.88424 5.29965 1.95304C5.23086 2.02184 5.1922 2.11515 5.1922 2.21245V16.8154L1.30937 12.1494C1.27857 12.1124 1.24077 12.0817 1.19813 12.0593C1.15549 12.0368 1.10884 12.023 1.06085 12.0186C1.01286 12.0141 0.964475 12.0192 0.918445 12.0335C0.872416 12.0477 0.829648 12.0709 0.792584 12.1017C0.75552 12.1326 0.724886 12.1703 0.70243 12.213C0.679975 12.2556 0.666138 12.3023 0.661709 12.3503C0.65728 12.3983 0.662347 12.4466 0.67662 12.4927C0.690892 12.5387 0.714091 12.5815 0.744892 12.6185L5.28661 18.0759C5.32103 18.1174 5.36416 18.1508 5.41294 18.1737C5.46172 18.1966 5.51495 18.2085 5.56885 18.2085C5.67793 18.2085 5.78162 18.1596 5.85157 18.0759L10.3742 12.6185C10.4364 12.5435 10.4662 12.447 10.4571 12.35C10.448 12.253 10.4008 12.1636 10.3258 12.1015C10.2508 12.0394 10.1542 12.0096 10.0572 12.0186C9.96028 12.0277 9.8709 12.0749 9.80876 12.1499ZM18.8115 6.9464L14.2703 1.489C14.2359 1.4476 14.1928 1.41426 14.1441 1.39135C14.0955 1.36844 14.0423 1.35653 13.9885 1.35645C13.8794 1.35645 13.7752 1.40536 13.7063 1.489L9.18314 6.9464C9.12193 7.02142 9.09285 7.11759 9.10225 7.21395C9.11165 7.31032 9.15876 7.39906 9.23331 7.46083C9.30787 7.52261 9.40382 7.5524 9.50025 7.54373C9.59668 7.53505 9.68578 7.4886 9.74811 7.41451L13.6309 2.72899V17.3525C13.6309 17.4498 13.6696 17.5431 13.7384 17.6119C13.8072 17.6807 13.9005 17.7193 13.9978 17.7193C14.0951 17.7193 14.1884 17.6807 14.2572 17.6119C14.326 17.5431 14.3647 17.4498 14.3647 17.3525V2.74904L18.2475 7.415C18.2781 7.45227 18.3157 7.4831 18.3583 7.5057C18.4009 7.52831 18.4475 7.54225 18.4955 7.5467C18.5435 7.55116 18.5919 7.54606 18.6379 7.53168C18.6839 7.5173 18.7266 7.49393 18.7635 7.46294C18.8384 7.40079 18.8855 7.31146 18.8945 7.2146C18.9035 7.11773 18.8736 7.02126 18.8115 6.9464Z"
                fill="#0A3A7A"
              />
            </g>
            <defs>
              <clipPath id="clip0_891_4675">
                <rect width="19.5658" height="19.5658" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="text-sm font-medium">Sort</span>
      
        </div>
      {/* Filters */}
        <div
          onClick={() => setOnFiltersOpen(!onFiltersOpen)}
          className="flex-1 flex  items-center justify-center gap-1 cursor-pointer transition text-[#0A3A7A]"
        >
       <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.89508 4.2801C7.6505 3.24066 6.67221 2.4458 5.51049 2.4458C4.34877 2.4458 3.43162 3.24066 3.12591 4.2801H1.23047V5.50296H3.12591C3.37048 6.54239 4.34877 7.33726 5.51049 7.33726C6.67221 7.33726 7.58936 6.54239 7.89508 5.50296H18.3506V4.2801H7.89508ZM5.51049 6.11439C4.83792 6.11439 4.28763 5.5641 4.28763 4.89153C4.28763 4.21895 4.83792 3.66866 5.51049 3.66866C6.18307 3.66866 6.73336 4.21895 6.73336 4.89153C6.73336 5.5641 6.18307 6.11439 5.51049 6.11439ZM14.0705 7.33726C12.9088 7.33726 11.9917 8.13212 11.686 9.17155H1.23047V10.3944H11.686C11.9305 11.4339 12.9088 12.2287 14.0705 12.2287C15.2323 12.2287 16.1494 11.4339 16.4551 10.3944H18.3506V9.17155H16.4551C16.2106 8.13212 15.2323 7.33726 14.0705 7.33726ZM14.0705 11.0058C13.398 11.0058 12.8477 10.4556 12.8477 9.78298C12.8477 9.11041 13.398 8.56012 14.0705 8.56012C14.7431 8.56012 15.2934 9.11041 15.2934 9.78298C15.2934 10.4556 14.7431 11.0058 14.0705 11.0058ZM8.56765 12.2287C7.40593 12.2287 6.48878 13.0236 6.18307 14.063H1.23047V15.2859H6.18307C6.42764 16.3253 7.40593 17.1202 8.56765 17.1202C9.72937 17.1202 10.6465 16.3253 10.9522 15.2859H18.3506V14.063H10.9522C10.7077 13.0236 9.72937 12.2287 8.56765 12.2287ZM8.56765 15.8973C7.89508 15.8973 7.34479 15.347 7.34479 14.6744C7.34479 14.0019 7.89508 13.4516 8.56765 13.4516C9.24023 13.4516 9.79052 14.0019 9.79052 14.6744C9.79052 15.347 9.24023 15.8973 8.56765 15.8973Z" fill="#0A3A7A"/>
</svg>

          <span className="text-sm font-medium">Filters</span>
         
        </div>

        <div
          onClick={() => setOnSearchOpen(!onSearchOpen)}
          className="flex-1 flex  items-center justify-center gap-1 cursor-pointer   transition text-[#0A3A7A]"
        >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.8548 13.8592L17.1158 17.1202M2.44141 8.96774C2.44141 10.6975 3.12854 12.3563 4.35164 13.5795C5.57474 14.8026 7.23362 15.4897 8.96335 15.4897C10.6931 15.4897 12.352 14.8026 13.5751 13.5795C14.7982 12.3563 15.4853 10.6975 15.4853 8.96774C15.4853 7.23802 14.7982 5.57913 13.5751 4.35603C12.352 3.13293 10.6931 2.4458 8.96335 2.4458C7.23362 2.4458 5.57474 3.13293 4.35164 4.35603C3.12854 5.57913 2.44141 7.23802 2.44141 8.96774Z" stroke="#0A3A7A" stroke-width="1.21527" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          <span className="text-sm font-medium">Search</span>
         
        </div>

     

  
      </div>

      {/* Search Sheet */}
      <Sheet open={onSearchOpen} onOpenChange={setOnSearchOpen}>
        <SheetContent side="top" className="lg:hidden">
          <SheetHeader>
            <SheetTitle>Search Hotels</SheetTitle>
          </SheetHeader>
          <div className="mt-4">{SearchBarComponent}</div>
        </SheetContent>
      </Sheet>

      {/* Sort Sheet */}
      <Sheet open={onSortOpen} onOpenChange={setOnSortOpen}>
        <SheetContent side="top" className="lg:hidden">
          <SheetHeader>
            <SheetTitle>Sort Hotels</SheetTitle>
          </SheetHeader>
          <div className="mt-4">{SortBarComponent}</div>
        </SheetContent>
      </Sheet>

      {/* Filters Sheet */}
      <Sheet open={onFiltersOpen} onOpenChange={setOnFiltersOpen}>
        <SheetContent side="top" className="lg:hidden">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4">{FiltersComponent}</div>
        </SheetContent>
      </Sheet>
    </>
  )
}
