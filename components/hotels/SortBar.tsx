import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { CURRENCIES } from "@/lib/utils/currency";
import React from "react";

interface SortBarProps {
  sortBy: string;
  setSortBy: (v: string) => void;
  // Currency selection logic removed
}

const getSortButtonClass = (sortBy: string, value: string, isFirst: boolean, isLast: boolean) => {
  const baseClasses = "px-3 sm:px-4 py-2 text-sm border-r border-gray-300";
  const activeClasses = "bg-[#1a73e8] text-white border-[#1a73e8]";
  const inactiveClasses = "bg-white text-[#1a73e8] hover:bg-gray-50";
  let classes = `${baseClasses}`;
  if (isFirst) classes += " rounded-l-full";
  if (isLast) classes += " rounded-r-full border-r-0";
  if (sortBy === value) {
    classes += ` ${activeClasses}`;
  } else if (value === "top-reviewed-dropdown" && (sortBy === "rating" || sortBy === "reviews" || sortBy === "price-high")) {
    classes += ` ${activeClasses}`;
  } else if (value === "distance-dropdown" && (sortBy === "distance-closest" || sortBy === "distance-farthest")) {
    classes += ` ${activeClasses}`;
  } else {
    classes += ` ${inactiveClasses}`;
  }
  return classes;
};

export const SortBar: React.FC<SortBarProps> = ({ sortBy, setSortBy }) => (
  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 w-full lg:w-auto flex-grow">
    <span className="text-gray-600 text-sm whitespace-nowrap flex-shrink-0 mt-2 lg:mt-0 font-bold">Sort by:</span>
    <div className="flex w-full lg:w-auto flex-wrap lg:flex-nowrap mt-2 lg:mt-0 gap-1 lg:gap-0">
      <Button
        variant="outline"
        onClick={() => setSortBy("best-match")}
        className={getSortButtonClass(sortBy, "best-match", true, false)}
      >
        <span className="hidden sm:inline">Best match</span>
        <span className="sm:hidden">Best</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`${getSortButtonClass(sortBy, "top-reviewed-dropdown", false, false)} flex items-center gap-1`}
          >
            <span className="hidden sm:inline">Top reviewed</span>
            <span className="sm:hidden">Reviews</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSortBy("rating")}>Rating</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy("reviews")}>Most Reviews</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy("price-high")}>Price: High to Low</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        onClick={() => setSortBy("price-low")}
        className={getSortButtonClass(sortBy, "price-low", false, false)}
      >
        <span className="hidden sm:inline">Lowest price first</span>
        <span className="sm:hidden">Price</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`${getSortButtonClass(sortBy, "distance-dropdown", false, true)} flex items-center gap-1`}
          >
            <span className="hidden sm:inline">Distance</span>
            <span className="sm:hidden">Dist</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSortBy("distance-closest")}>Closest</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  {/* Currency selection logic removed */}
  </div>
);
