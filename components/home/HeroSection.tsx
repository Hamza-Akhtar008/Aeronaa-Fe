"use client";

import type React from "react";

import {
  Home,
  Hotel,
  Plane,
  Car,
  Building2,
  Bed,
  BedDouble,
  House,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect, useRef } from "react";

import Image from "next/image";
import HotelSearchFilter from "./search/HotelSearchFilter";
import { CarRentalSearch, FlightSearch } from "./search";
import { useHeroTab } from "./HeroTabContext";
import PropertySearchFilter from "./search/propertySearch";
import UmrahSearch from "./search/UmrahSearch";
import { useIsMobile } from "@/hooks/use-mobile";

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { activeTab, setActiveTab, heroRef } = useHeroTab();
  const isMobile = useIsMobile()

  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  // Search form states
  const [searchData, setSearchData] = useState({
    from: "Lahore",
    to: "Karachi",
    tripType: "Return",
    departDate: "07 Nov 22",
    returnDate: "13 Nov 22",
    passengers: "1 Passenger",
    class: "Economy",
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", searchData);
  };

  return (
   
      <div ref={heroRef} className="relative  sm:min-h-[30rem]   z-10    ">
      {/* Background Image: hidden on mobile, unchanged on desktop */}
      <Image
        src={
activeTab=="hotels"?"/images/HotelBackground.png":
activeTab=="flights"?"/images/FlightBackground.png":
activeTab=="cars"?"/images/CarBackground.png":

activeTab=="umrah"?"/images/Umrah.jpg":"/images/propertybackground.png"
      
        }
        alt="Tropical beach with palm trees and turquoise water"
        fill


        priority
        className="object-cover object-top hidden sm:block md:block absolute inset-x-10 top-10 h-full overflow-hidden rounded-2xl "
      />


        <div className="absolute left-[45%]  top-[40%]  text-white font-semibold  text-[42px] leading-[51px] text-center font-[Montserrat]">
      {activeTab.toLocaleUpperCase()}
    </div>
      <div className="relative w-full max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4 sm:absolute md:absolute md:transform md:-translate-x-[50%] md:translate-y-[15%] md:left-1/2 lg:left-1/2 m sm:transform sm:-translate-x-1/2 bottom-0 sm:translate-y-1/2   sm:w-[calc(100%-10rem)]  bg-white shadow-[0px_4px_16px_rgba(141,211,187,0.15)] rounded-xl  py-4 sm:py-6 sm:pt-2">


        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full flex flex-col">


          {/* Tabs Navigation: stacked vertically on mobile, centered horizontally */}
    <div
  className={`w-full overflow-x-auto scrollbar-none ${
    isMobile ? "bg-white p-2" : "bg-white"
  }`}
>
  <TabsList
    className={`flex flex-row gap-2 justify-start ${
      isMobile ? "w-max mx-auto" : "w-max sm:w-auto"
    } bg-transparent`}
  >
    {/* Hotels */}
    <TabsTrigger
      value="hotels"
      className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-8 py-2 sm:py-2.5 font-semibold text-xs sm:text-[14px]
        ${
          isMobile
            ? "rounded-[13.08px] border border-gray-300 bg-white"
            : "rounded-none border border-gray-300"
        }
        text-gray-600 data-[state=active]:bg-[#0a3a7a] data-[state=active]:text-white`}
    >
      <img
        src={`/images/${
          activeTab === "hotels" ? "HotelWhiteLogo" : "HotelLogoBlack"
        }.svg`}
        alt="Hotel Icon"
        className="h-3 w-3 sm:h-4 sm:w-4"
      />
      Hotels
    </TabsTrigger>



    {/* Umrah */}
    <TabsTrigger
      value="umrah"
      className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-8 py-2 sm:py-2.5 font-semibold text-xs sm:text-[14px]
        ${
          isMobile
            ? "rounded-[13.08px] border border-gray-300 bg-white"
            : "rounded-none border border-gray-300"
        }
        text-gray-600 data-[state=active]:bg-[#0a3a7a] data-[state=active]:text-white`}
    >
      <img
        src={`/images/${
          activeTab === "umrah" ? "whiteumrah" : "umrahicon"
        }.png`}
        alt="Umrah Icon"
        className="h-3 w-3 sm:h-4 sm:w-4"
      />
      Umrah
    </TabsTrigger>
  </TabsList>
</div>

          {/* Tab Content: Center the content */}
          <div className="w-full mt-4 z-100">
            <TabsContent value="hotels" className="m-0 p-0 w-full text-center">
              <HotelSearchFilter />
            </TabsContent>
            <TabsContent value="cars" className="m-0 p-0 w-full text-center">
              <CarRentalSearch />
            </TabsContent>
            <TabsContent value="flights" className="m-0 p-0 w-full text-center">
              <FlightSearch />
            </TabsContent>
            <TabsContent value="property" className="m-0 p-0 w-full text-center">
              <PropertySearchFilter />
            </TabsContent>
            <TabsContent value="umrah" className="m-0 p-0 w-full text-center">
              <UmrahSearch />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Card: Center the card in mobile view */}

    </div>









  );
}
