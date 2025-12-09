import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HotelsSearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const HotelsSearchBar: React.FC<HotelsSearchBarProps> = ({ value, onChange }) => (
  <div className="relative flex items-center w-full lg:w-64 flex-shrink-0">
    <Search className="absolute left-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
    <Input
      type="text"
      placeholder="Search Hotel by Name"
      className="pl-9 sm:pl-10 pr-4 py-2 sm:py-2 rounded-full bg-blue-50 border-none focus:ring-2 focus:ring-[#00afd5] focus:outline-none w-full text-sm sm:text-base"
      aria-label="Search hotels"
      value={value}
      onChange={onChange}
    />
  </div>
);

export default HotelsSearchBar;
