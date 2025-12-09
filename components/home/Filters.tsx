"use client"

import { Menu } from "lucide-react"
import type React from "react"
import { useState } from "react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

import HotelSearchFilter from "./search/HotelSearchFilter"
import FlightSearch from "./search/FlightSearch"
import CarRentalSearch from "./search/CarRentalSearch"
import PropertySearchFilter from "./search/propertySearch"
import UmrahSearch from "./search/UmrahSearch"
import type { CityResult } from "./search/types"
import { format, differenceInDays, parseISO } from "date-fns"

type FiltersProps = {
  initialValues: Record<string, any>
  onChange: (values: Record<string, any>) => void
  tabValue?: string
  onTabChange?: (value: string) => void
  tabsRef?: React.RefObject<HTMLDivElement>
  selectedCity?: CityResult
}

const Filters = ({
  initialValues,
  onChange,
  tabValue = "hotels",
  onTabChange,
  tabsRef,
  selectedCity,
}: FiltersProps) => {
  const [internalTab, setInternalTab] = useState(tabValue)
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  const activeTab = onTabChange ? tabValue : internalTab
  const handleTabChange = (val: string) => {
    if (onTabChange) onTabChange(val)
    else setInternalTab(val)
  }

  // Tabs list — shared across mobile and desktop
  const TabNavigation = () => (
    <div
      className={`w-full overflow-x-auto scrollbar-none ${
        isMobile ? "bg-white p-2" : " bg-white"
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
            ${isMobile ? "rounded-[13.08px]  border border-gray-300 bg-white" : "rounded-none border border-gray-300"}
            text-gray-600 data-[state=active]:bg-[#0a3a7a] data-[state=active]:text-white`}
        >
          <img
            src={`/images/${activeTab === "hotels" ? "HotelWhiteLogo" : "HotelLogoBlack"}.svg`}
            alt="Hotel Icon"
            className="h-3 w-3 sm:h-4 sm:w-4"
          />
          Hotels
        </TabsTrigger>

    

        {/* Umrah */}
        <TabsTrigger
          value="umrah"
          className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-8 py-2 sm:py-2.5 font-semibold text-xs sm:text-[14px]
            ${isMobile ? "rounded-[13.08px] border border-gray-300 bg-white" : "rounded-none border border-gray-300"}
            text-gray-600 data-[state=active]:bg-[#0a3a7a] data-[state=active]:text-white`}
        >
          <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          Umrah
        </TabsTrigger>
      </TabsList>
    </div>
  )

  // MOBILE: Tabs always visible, rounded, content inside drawer
  if (isMobile) {
    return (
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="sticky top-0  bg-transparent shadow-sm mt-2">
          <TabNavigation />
        </div>

        <div className="relative px-3 py-3 ">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
           <SheetTrigger asChild>
<Button
  variant="outline"
  size="sm"
  className="w-full border border-[#444444] flex justify-start items-center gap-2 font-semibold text-gray-700 hover:bg-gray-50 bg-transparent px-4 py-2 rounded-full"
>
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#444444]"
  >
    <path
      d="M13.9201 13.9196L17.1953 17.1948M2.45703 9.00688C2.45703 10.7441 3.14715 12.4102 4.37558 13.6387C5.60401 14.8671 7.27011 15.5572 9.00737 15.5572C10.7446 15.5572 12.4107 14.8671 13.6392 13.6387C14.8676 12.4102 15.5577 10.7441 15.5577 9.00688C15.5577 7.26962 14.8676 5.60352 13.6392 4.37509C12.4107 3.14667 10.7446 2.45654 9.00737 2.45654C7.27011 2.45654 5.60401 3.14667 4.37558 4.37509C3.14715 5.60352 2.45703 7.26962 2.45703 9.00688Z"
      stroke="#444444"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
Search
  {(() => {
    const checkIn = initialValues.checkIn ? parseISO(initialValues.checkIn) : null
    const checkOut = initialValues.checkOut ? parseISO(initialValues.checkOut) : null
    const travelers = initialValues.travelers || 1

    let dateText = "Search"
    if (checkIn && checkOut) {
      const nights = differenceInDays(checkOut, checkIn)
      const formattedIn = format(checkIn, "MMM d")
      const formattedOut = format(checkOut, "MMM d")
      dateText = `${formattedIn} - ${formattedOut} (${nights} night${nights > 1 ? "s" : ""}) - ${travelers} adult${travelers > 1 ? "s" : ""}`
    }

    return (
     
      <span className="text-[9.76px] text-gray-600 font-normal"> {dateText}</span>
    )
  })()}
</Button>
</SheetTrigger>


            <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
              <div className="pt-4">
                {activeTab === "hotels" && (
                  <HotelSearchFilter initialValues={initialValues} selectcity={selectedCity} />
                )}
               
                {activeTab === "umrah" && <UmrahSearch />}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Tabs>
    )
  }

  // DESKTOP: Regular inline version
  return (
 <div className="top-0 z-[1100] w-full max-w-[101rem] mx-auto bg-transparent px-2 sm:px-4 lg:px-6 pt-4">
  <div
    className="relative w-full max-w-[101rem] mx-auto bg-white rounded-xl px-2 sm:px-4 py-4 sm:py-6 sm:pt-2 shadow-sm sm:shadow-[0px_4px_16px_rgba(141,211,187,0.15)] border border-[#e5e7eb]"
  >
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex flex-col">
      <TabNavigation />

      <div className="w-full mt-2 sm:mt-4 text-sm sm:text-base">
        <TabsContent value="hotels" className="m-0 p-0 w-full text-center">
          <HotelSearchFilter initialValues={initialValues} selectcity={selectedCity} />
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
</div>



  )
}

export default Filters
