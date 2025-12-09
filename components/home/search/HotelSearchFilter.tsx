"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"

interface SearchInputs {
  id: string
  location: string
  checkIn: string
  checkOut: string
  travelers: string
  rooms: string
}

const cityCache = new Map<string, { data: CityResult[]; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000

import { CustomCalendar } from "./CustomCalendar"
import type { CityResult } from "./types"
import { Send } from "lucide-react"

type HotelSearchFilterProps = {
  initialValues?: Partial<SearchInputs>
  onChange?: (values: SearchInputs) => void
  selectcity?: CityResult
}

export default function HotelSearchFilter({ initialValues, onChange, selectcity }: HotelSearchFilterProps) {
  const [hotelSearch, setHotelSearch] = useState<SearchInputs>({
    id: initialValues?.id || "",
    location: initialValues?.location || "",
    checkIn: initialValues?.checkIn || "",
    checkOut: initialValues?.checkOut || "",
    travelers: initialValues?.travelers || "2 adults · 0 children",
    rooms: initialValues?.rooms || "1",
  })

  const [citySuggestions, setCitySuggestions] = useState<CityResult[]>([])
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(null)

  const calendarRef = useRef<HTMLDivElement | null>(null)
  const suggestionsRef = useRef(null)
  useEffect(() => {
    if (initialValues) {
      if (selectcity) {
        setSelectedCity(selectcity)
      }
      setHotelSearch((prev) => {
        // Prepare next state
        const next = {
          id: initialValues.id ?? "",
          location: initialValues.location ?? "",
          checkIn: initialValues.checkIn ?? "",
          checkOut: initialValues.checkOut ?? "",
          travelers: initialValues.travelers ?? "2 adults · 0 children",
          rooms: initialValues.rooms ?? "1",
        }
        // Update state only if anything actually changed
        if (JSON.stringify(prev) !== JSON.stringify(next)) {
          return next
        }
        return prev
      })
    }
  }, [])

  // Call onChange when hotelSearch changes
  useEffect(() => {
    if (onChange) onChange(hotelSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelSearch])

  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastQueryRef = useRef<string>("")
  const [hotelSearchError, setHotelSearchError] = useState<string | null>(null)
  const [hotelLoading, setHotelLoading] = useState(false)

  const guestsRef = useRef<HTMLDivElement | null>(null)

  //outside screen click handle
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !(suggestionsRef.current as HTMLElement)?.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("input") // allow clicking inside input without closing suggestions
      ) {
        setShowSuggestions(false)
      }

      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
      }

      if (guestsRef.current && !guestsRef.current.contains(event.target as Node)) {
        setShowGuests(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // City suggestions fetch with caching
  const fetchCitySuggestions = useCallback(async (query: string) => {
    try {
      if (!query || query.length < 2) {
        setCitySuggestions([])
        return
      }

      const cached = cityCache.get(query.toLowerCase())
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setCitySuggestions(cached.data)
        return
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()
      setIsLoading(true)

      const response = await axios.get("https://agoda-com.p.rapidapi.com/hotels/auto-complete", {
        params: { query },
        headers: {
          "x-rapidapi-key": "7f66331876msh5a86fb2ce181b4dp1b2f48jsn8db63f8e12d9",
          "x-rapidapi-host": "agoda-com.p.rapidapi.com",
        },
        signal: abortControllerRef.current.signal,
      })

      console.log("Auto-complete response : ", response.data)
      const suggestions = response.data || []

      if (query.toLowerCase() == "madina") {
        const predefinedSuggestion: CityResult = {
          id: "3_135486",
          typeName: "Landmark",
          name: "Al Masjid an Nabawi",
          label: "Al Masjid an Nabawi",
          region: "Al Madinah Region",
          country: "Saudi Arabia",
          dest_type: "Landmark",
          city_name: "Medina",
          latitude: 24.467197,
          longitude: 39.611154,
          image_url: "", // Assuming no image for this suggestion
          nr_hotels: 1396,
        }
        // Add predefined suggestion in second place
        suggestions.splice(1, 0, predefinedSuggestion)
      }
      if (query.toLowerCase() == "mecca") {
        const predefinedSuggestion: CityResult = {
          id: "3_128886",
          typeName: "Landmark",
          name: "Al-Masjid al-Haram Mosque",
          label: "Al-Masjid al-Haram Mosque",
          region: "Makkah Region",
          country: "Saudi Arabia",
          dest_type: "Landmark",
          city_name: "Mecca",
          latitude: 21.422871,
          longitude: 39.825734,
          image_url: "", // Assuming no image for this suggestion
          nr_hotels: 1396,
        }
        // Add predefined suggestion in second place
        suggestions.splice(1, 0, predefinedSuggestion)
      }

      console.log(" response.data.data : ", response.data)
      cityCache.set(query.toLowerCase(), {
        data: suggestions,
        timestamp: Date.now(),
      })
      setCitySuggestions(suggestions.places)
    } catch (err: any) {
      if (err.name !== "AbortError" && err.name !== "CanceledError") {
        setCitySuggestions([])
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const query = hotelSearch.location.trim()
    if (query === lastQueryRef.current) return
    lastQueryRef.current = query

    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)

    debounceTimeoutRef.current = setTimeout(() => {
      fetchCitySuggestions(query)
    }, 300)

    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
    }
  }, [hotelSearch.location, fetchCitySuggestions])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort()
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
    }
  }, [])

  const handleLocationSelect = useCallback((city: CityResult) => {
    setSelectedCity(city)
    sessionStorage.setItem("selectedCity", JSON.stringify(city))
    setHotelSearch((prev) => ({ ...prev, location: city.name }))
    setShowSuggestions(false)
    setTimeout(() => setShowCalendar(true), 300)
  }, [])

  const handleDateSelect = useCallback((checkIn: string, checkOut: string) => {
    setHotelSearch((prev) => ({ ...prev, checkIn, checkOut }))
  }, [])

  const handleLocationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHotelSearch((prev) => ({ ...prev, location: e.target.value }))
    setSelectedCity(null)
    setShowSuggestions(true)
  }, [])

  // Guests/Rooms dropdown state
  const [showGuests, setShowGuests] = useState(false)
  const [adults, setAdults] = useState(() => {
    const travelersStr = hotelSearch.travelers ? String(hotelSearch.travelers) : ""
    const match = travelersStr.match(/(\d+) adults/)
    return match ? Number.parseInt(match[1], 10) : 2
  })
  const [children, setChildren] = useState(() => {
    const travelersStr = hotelSearch.travelers ? String(hotelSearch.travelers) : ""
    const match = travelersStr.match(/(\d+) children/)
    return match ? Number.parseInt(match[1], 10) : 0
  })
  const [rooms, setRooms] = useState(() => Number.parseInt(hotelSearch.rooms, 10) || 1)

  // Sync local adults, children, rooms state with hotelSearch when hotelSearch changes
  useEffect(() => {
    const travelersStr = hotelSearch.travelers ? String(hotelSearch.travelers) : ""
    const adultsMatch = travelersStr.match(/(\d+) adults/)
    const childrenMatch = travelersStr.match(/(\d+) children/)
    setAdults(adultsMatch ? Number.parseInt(adultsMatch[1], 10) : 2)
    setChildren(childrenMatch ? Number.parseInt(childrenMatch[1], 10) : 0)
    setRooms(hotelSearch.rooms ? Number.parseInt(hotelSearch.rooms, 10) : 1)
  }, [hotelSearch.travelers, hotelSearch.rooms])

  const handleGuestsDone = () => {
    setHotelSearch((prev) => ({
      ...prev,
      travelers: `${adults} adults · ${children} children`,
      rooms: rooms.toString(),
    }))
    setShowGuests(false)
  }

  const handleSearch = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setHotelSearchError(null)
      setHotelLoading(true)

      try {
        const locationQuery = hotelSearch.location.trim()

        let id: string | undefined, typeName: string | undefined

        // Try using selectedCity first
        if (selectedCity && selectedCity.name.toLowerCase() === locationQuery.toLowerCase()) {
          id = selectedCity.id
          typeName = selectedCity.typeName
        }

        // If selectedCity is null or doesn't match, try cache
        if (!id || !typeName) {
          const cached = cityCache.get(locationQuery.toLowerCase())
          if (cached && cached.data.length > 0) {
            id = cached.data[0].id
            typeName = cached.data[0].typeName
          }
        }

        // If still not found, fetch from API
        if (!id || !typeName) {
          const destinationRes = await axios.get("https://agoda-com.p.rapidapi.com/hotels/auto-complete", {
            params: { query: locationQuery },
            headers: {
              "x-rapidapi-key": "7f66331876msh5a86fb2ce181b4dp1b2f48jsn8db63f8e12d9",
              "x-rapidapi-host": "agoda-com.p.rapidapi.com",
            },
          })

          const destination = destinationRes.data.place[0]
          if (!destination || !destination.id) {
            setHotelSearchError("City not found. Please enter a valid city name.")
            setHotelLoading(false)
            return
          }

          id = destination.id
          typeName = destination.typeName
        }

        const checkInDate = hotelSearch.checkIn || new Date().toISOString().split("T")[0]
        const checkOutDate = hotelSearch.checkOut || new Date(Date.now() + 86400000).toISOString().split("T")[0]

        // Parse adults and children from hotelSearch.travelers string
        let adults = 2,
          children = 0
        if (hotelSearch.travelers) {
          const adultsMatch = String(hotelSearch.travelers).match(/(\d+) adults/)
          const childrenMatch = String(hotelSearch.travelers).match(/(\d+) children/)
          adults = adultsMatch ? Number.parseInt(adultsMatch[1], 10) : 2
          children = childrenMatch ? Number.parseInt(childrenMatch[1], 10) : 0
        }

        const roomQty = hotelSearch.rooms || "1"

        // Validate inputs
        if (!locationQuery) {
          setHotelSearchError("Please Select a Destination")
          setHotelLoading(false)
          return
        }
        if (!checkInDate) {
          setHotelSearchError("Please Select a Checkin Date")
          setHotelLoading(false)
          return
        }
        if (!checkOutDate) {
          setHotelSearchError("Please Select a Checkout Date")
          setHotelLoading(false)
          return
        }
        if (adults <= 0) {
          setHotelSearchError("No of Guest Cannot be Zero or less")
          setHotelLoading(false)
          return
        }
        if (Number.parseInt(roomQty) <= 0) {
          setHotelSearchError("Room Quantity Cannot be Zero or less")
          setHotelLoading(false)
          return
        }
        if (checkOutDate <= checkInDate) {
          setHotelSearchError("Checkin and Checkout cannot be same, Select At least one day trip")
          setHotelLoading(false)
          return
        }
console.log("Searching hotels with: ",  {
            typeName,
            id: id,
            checkinDate: checkInDate,
            checkoutDate: checkOutDate,
            limit: 100,
            adult: adults,
            room_qty: roomQty,
            language: "en-us",
            currency: "USD",
          },)
        // Perform search
        const searchRes = await axios.get("https://agoda-com.p.rapidapi.com/hotels/search-overnight", {
          params: {
            typeName,
            id: "1_"+id,
            checkinDate: checkInDate,
            checkoutDate: checkOutDate,
            limit: 100,
            adult: adults,
            room_qty: roomQty,
            language: "en-us",
            currency: "USD",
          },
          headers: {
            "x-rapidapi-key": "7f66331876msh5a86fb2ce181b4dp1b2f48jsn8db63f8e12d9",
            "x-rapidapi-host": "agoda-com.p.rapidapi.com",
          },
        })

        console.log("searchRes : ", searchRes)
        const hotels = searchRes.data.data.properties || []
       

        // Save in sessionStorage
      
          // Extract children from travelers string
           children = 0
          if (hotelSearch.travelers) {
            const childrenMatch = String(hotelSearch.travelers).match(/(\d+) children/)
            children = childrenMatch ? Number.parseInt(childrenMatch[1], 10) : 0
          }
          console.log("selectedCity: ", selectedCity);
          sessionStorage.removeItem("searchResults");
localStorage.removeItem("searchResults");
          sessionStorage.setItem(
            "searchResults",
            JSON.stringify({
              hotels,
              filters: searchRes.data.data.filters,
              search: {
                location: locationQuery,
                id,
                typeName,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                travelers: `${adults} adults · ${children} children`,
                rooms: String(roomQty),
              },
              selectedCity,
            }),
          )
console.log(`/hotels?city=${encodeURIComponent(locationQuery)}&checkIn=${checkInDate}&checkOut=${checkOutDate}&adults=${adults}&children=${children}&rooms=${roomQty}`)
        window.location.href = `/hotels?city=${encodeURIComponent(locationQuery)}&checkIn=${checkInDate}&checkOut=${checkOutDate}&adults=${adults}&children=${children}&rooms=${roomQty}`
        
      } catch (error: any) {  
        if (error.message === "No hotels found for city") {
          setHotelSearchError("No hotels found for this city. Please try another destination.")
        } else if (error.code === "ECONNABORTED") {
          setHotelSearchError("Request timed out. Please try again.")
        } else {
          setHotelSearchError("An error occurred while searching for hotels. Please try again.")
        }
      } finally {
        setHotelLoading(false)
      }
    },
    [hotelSearch, selectedCity],
  )

  return (
    <div className="w-full flex">
      <div className="w-full  text-black px-0">
        {/* Error Message */}
        {hotelSearchError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {hotelSearchError}
          </div>
        )}

        {/* Search Form */}
        <div className="w-full">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-3">
            {/* Location */}
            <div className="flex-1 min-w-0 relative">
              {/* Floating Label */}
              <label
                htmlFor="location"
                className="absolute left-2 top-2 z-10 origin-[0] transform -translate-y-4 scale-75 cursor-text select-none bg-white px-2 text-md text-gray-500 duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500"
              >
                Where to Stay
              </label>

              <div className="relative">
                <input
                  id="location"
                  type="text"
                  placeholder="Dubai"  // This is the visible placeholder
                  className="peer w-full h-14 pl-3 pr-10 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-md"
                  value={hotelSearch.location}
                  onChange={handleLocationChange}
                  onFocus={() => setShowSuggestions(true)}
                  autoComplete="off"
                />

                {hotelSearch.location && (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    onClick={() => {
                      setHotelSearch((prev) => ({ ...prev, location: "" }));
                      setSelectedCity(null);
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && citySuggestions?.length > 0 && (
                <div
                  className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md mt-0.5 shadow-lg max-h-36 overflow-y-auto z-50"
                  ref={suggestionsRef}
                >
                  {citySuggestions.map((city) => (
                    <div
                      key={city.id}
                      className="px-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-800 border-b border-gray-100 last:border-b-0 text-base"
                      onMouseDown={() => handleLocationSelect(city)}
                    >
                      <div className="font-medium text-base">{city.name}</div>
                      <div className="text-sm text-gray-500">{city.typeName}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>



            {/* Date Picker */}
            <div className="flex-1 min-w-0 relative">

              {/* Label for Depart - Return */}
              <label
                htmlFor="calendar"
                className="absolute left-2 top-2 z-10 origin-[0] transform -translate-y-4 scale-75 cursor-text select-none bg-white px-2 text-md text-gray-500 duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500"
              >
                Departure - Return
              </label>

              {/* Button for selecting dates */}
              <input
                type="button"
                value={
                  hotelSearch.checkIn && hotelSearch.checkOut
                    ? `${new Date(hotelSearch.checkIn).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })} - ${new Date(hotelSearch.checkOut).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}`
                    : "Thu, Aug 14 - Wed, Sep 17"
                }
                className="peer text-left z-10  w-full h-14 pl-3 pr-10 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-md"
                onClick={() => setShowCalendar((v) => !v)}
              />







              {showCalendar && (
                <div
                  className={`fixed z-[2000] w-full flex justify-center ${isMobile
                    ? "inset-0 m-0"
                    : "top-0 left-1/2 -translate-x-1/2 max-w-md mt-0"
                    }`}
                  ref={calendarRef}
                >
                  <CustomCalendar
                    checkIn={hotelSearch.checkIn}
                    checkOut={hotelSearch.checkOut}
                    onDateSelect={(checkIn: string, checkOut: string) => {
                      handleDateSelect(checkIn, checkOut)
                      setShowCalendar(false)
                    }}
                    onClose={() => setShowCalendar(false)}
                  />
                </div>
              )}
            </div>

            {/* Guests & Rooms */}
            <div className="flex-1 min-w-0 relative" ref={guestsRef}>
              <label
                htmlFor="passenger"
                className="absolute left-2 top-2 z-10 origin-[0] transform -translate-y-4 scale-75 cursor-text select-none bg-white px-2 text-md text-gray-500 duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500"
              >
                Passenger - Class
              </label>

              <input
                id="passenger"
                value={`${adults} adults · ${children} children · ${rooms} room${rooms > 1 ? 's' : ''}`}
                className="peer w-full h-14 pl-3 pr-10 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                onClick={() => setShowGuests((v) => !v)}
                readOnly
              />





              {showGuests && (
                <div
                  className={`absolute z-[1000] bg-white rounded-md shadow-xl p-3 border border-gray-200 ${isMobile
                    ? "left-1/2 transform -translate-x-1/2 top-full w-[90vw] max-w-[220px]"
                    : "left-0 top-[110%] min-w-[220px] max-w-full"
                    }`}
                >
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-xs">Adults</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="w-6 h-6 rounded border border-gray-300 text-base hover:bg-gray-50 transition-colors"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs">{adults}</span>
                        <button
                          type="button"
                          className="w-6 h-6 rounded border border-gray-300 text-base hover:bg-gray-50 transition-colors"
                          onClick={() => setAdults(adults + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-xs">Children</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="w-6 h-6 rounded border border-gray-300 text-base hover:bg-gray-50 transition-colors"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs">{children}</span>
                        <button
                          type="button"
                          className="w-6 h-6 rounded border border-gray-300 text-base hover:bg-gray-50 transition-colors"
                          onClick={() => setChildren(children + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-xs">Rooms</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="w-6 h-6 rounded border border-gray-300 text-base hover:bg-gray-50 transition-colors"
                          onClick={() => setRooms(Math.max(1, rooms - 1))}
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs">{rooms}</span>
                        <button
                          type="button"
                          className="w-6 h-6 rounded border border-gray-300 text-base hover:bg-gray-50 transition-colors"
                          onClick={() => setRooms(rooms + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <input type="checkbox" id="pets" className="accent-blue-600 w-3 h-3" />
                    <label htmlFor="pets" className="text-gray-700 text-[10px]">
                      Travelling with pets?
                    </label>
                  </div>

                  <div className="text-[10px] text-gray-500 mb-2">
                    Assistance animals aren't considered pets.
                    <br />
                    <a href="#" className="text-blue-600 underline">
                      Read more about travelling with assistance animals
                    </a>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-xs"
                      onClick={handleGuestsDone}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end mt-3 pt-3 gap-2">
            <Button type="button" variant="ghost" className="text-gray-600 hover:text-gray-800 font-medium px-2 text-xs order-2 sm:order-1">
              + Add Promo Code
            </Button>
            <Button
              type="button"
              className="bg-[#0a3a7a] hover:bg-blue-700 text-white px-4 py-2 font-medium text-xs w-full sm:w-auto order-1 sm:order-2"
              disabled={hotelLoading}
              onMouseDown={handleSearch}
            >
              {hotelLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin mr-2" />
              ) : null}
              <Send className="w-3 h-3 mr-2" />
              Show Hotels
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}