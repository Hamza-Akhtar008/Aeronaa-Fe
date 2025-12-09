import React from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Trophy,
  Diamond,
  Users,
  Dog,
  Infinity,
  Home,
  Hotel,
  Sparkles,
  Crown
} from "lucide-react";

const FixedHeader = () => {
  const countries = [
    { value: "world", label: "World" },
    { value: "united-states", label: "United States" },
    { value: "africa", label: "Africa" },
    { value: "asia", label: "Asia" },
    { value: "australia", label: "Australia" },
    { value: "austria", label: "Austria" },
    { value: "brazil", label: "Brazil" },
    { value: "canada", label: "Canada" },
    { value: "caribbean", label: "Caribbean" },
    { value: "central-america", label: "Central America" },
    { value: "china", label: "China" },
    { value: "costa-rica", label: "Costa Rica" },
    { value: "france", label: "France" },
    { value: "germany", label: "Germany" },
    { value: "greece", label: "Greece" },
    { value: "india", label: "India" },
    { value: "indonesia", label: "Indonesia" },
    { value: "ireland", label: "Ireland" },
    { value: "italy", label: "Italy" },
    { value: "japan", label: "Japan" },
    { value: "malaysia", label: "Malaysia" },
    { value: "mexico", label: "Mexico" },
    { value: "middle-east", label: "Middle East" },
    { value: "netherlands", label: "Netherlands" },
    { value: "new-zealand", label: "New Zealand" },
    { value: "philippines", label: "Philippines" },
    { value: "portugal", label: "Portugal" },
    { value: "russia", label: "Russia" },
    { value: "singapore", label: "Singapore" },
    { value: "south-africa", label: "South Africa" },
    { value: "south-america", label: "South America" },
    { value: "south-korea", label: "South Korea" },
    { value: "spain", label: "Spain" },
    { value: "sweden", label: "Sweden" },
    { value: "switzerland", label: "Switzerland" },
    { value: "thailand", label: "Thailand" },
    { value: "turkey", label: "Turkey" },
    { value: "uk", label: "United Kingdom" },
    { value: "vietnam", label: "Vietnam" },
  ];

  const categories = [
    {
      name: "Top",
      icon: <Trophy className="w-5 h-5 mr-2" />,
      href: "/#",
    },
    {
      name: "Luxury",
      icon: <Diamond className="w-5 h-5 mr-2" />,
      href: "/luxury",
    },
    {
      name: "Family and Friends",
      icon: <Users className="w-5 h-5 mr-2" />,
      href: "/luxury",
    },
    {
      name: "Pet-Friendly",
      icon: <Dog className="w-5 h-5 mr-2" />,
      href: "/pet-friendly",
    },
    {
      name: "All Inclusive",
      icon: <Infinity className="w-5 h-5 mr-2" />,
      href: "/things-to-do",
    },
    {
      name: "B&Bs and Inns",
      icon: <Home className="w-5 h-5 mr-2" />,
      href: "/bnb",
    },
    {
      name: "Small and Botique",
      icon: <Hotel className="w-5 h-5 mr-2" />,
      href: "/restaurants",
    },
    {
      name: "Treat yourself",
      icon: <Sparkles className="w-5 h-5 mr-2" />,
      href: "/unique",
    },
    {
      name: "One of a kind",
      icon: <Crown className="w-5 h-5 mr-2" />,
      href: "/flights",
    },
  ];

  return (
    <div className="min-h-[80px] lg:h-[120px] w-full px-4 sm:px-6 lg:px-10 flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0 bg-white border-b shadow-[0_2px_4px_-1px_rgba(0,0,0,0.1)] py-4 lg:py-0">
      <div className="sticky top-0 z-50 bg-white w-full md:w-auto">
        <Select>
          <SelectTrigger
            className="
              w-full md:w-[300px] lg:w-[220px] h-[44px]
              border-2 border-[#023e8a]
              hover:bg-[#023e8a] hover:text-white
              focus:ring-0 focus:outline-none
              transition-colors rounded-full
              text-center font-semibold text-xl
            "
          >
            <SelectValue placeholder="World" />
          </SelectTrigger>
          <SelectContent className="text-xl font-medium">
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mr-10">
        <Carousel className="w-[800px] h-[44px]">
          <CarouselContent className="-ml-4 h-[44px]">
            {categories.map((category, index) => (
              <CarouselItem key={index} className="pl-4 basis-1/4 h-[44px]">
                <Link href={category.href} className="w-full">
                  <div className="rounded-full border-2 border-[#023e8a] h-[44px] flex items-center justify-center text-lg font-semibold hover:bg-[#023e8a] hover:text-white transition-colors cursor-pointer px-3 whitespace-nowrap overflow-hidden">
                    {category.icon}
                    <span className="truncate">{category.name}</span>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="h-[44px] w-[44px] border-2 border-[#023e8a] hover:bg-[#023e8a] hover:text-white transition-colors rounded-full absolute left-[-60px]" />
          <CarouselNext className="h-[44px] w-[44px] border-2 border-[#023e8a] hover:bg-[#023e8a] hover:text-white transition-colors rounded-full absolute right-[-60px]" />
        </Carousel>
      </div>
    </div>
  );
};

export default FixedHeader;
