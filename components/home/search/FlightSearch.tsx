"use client"
import { type FormEvent, useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import TravelersDropdown from "./TravelersDropdown"
import type { FlightInputs } from "./types"
import axios from "axios"
import { Plane, CalendarIcon, Users, ArrowLeftRight, Send } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

interface FlightSearchProps {
  initialValues?: FlightInputs
}

export default function FlightSearch({ initialValues }: FlightSearchProps) {
  // Minimal state for demo UI only
  const [flightLoading, setFlightLoading] = useState(false)
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([])
  const [toSuggestions, setToSuggestions] = useState<any[]>([])
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const fromInputRef = useRef<HTMLInputElement>(null)
  const toInputRef = useRef<HTMLInputElement>(null)

  const [tripType, setTripType] = useState("Round-trip")
  const [showTripType, setShowTripType] = useState(false)
  const [departure, setDeparture] = useState<Date | undefined>(undefined)
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined)
  const [showDeparture, setShowDeparture] = useState(false)
  const [showReturn, setShowReturn] = useState(false)
  const [travelerCounts, setTravelerCounts] = useState({ adults: 1, children: 0, infants: 0 })
  const [cabinClass, setCabinClass] = useState("Economy")

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close calendars when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      // Only close if a calendar is open
      if (showDeparture || showReturn) {
        // Check if the click is inside any calendar popover
        const calendarPopovers = document.querySelectorAll(".calendar-popover")
        let insidePopover = false
        calendarPopovers.forEach((pop) => {
          if (pop.contains(e.target as Node)) insidePopover = true
        })
        if (!insidePopover) {
          if (showDeparture) setShowDeparture(false)
          if (showReturn) setShowReturn(false)
        }
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showDeparture, showReturn])

  useEffect(() => {
    const storedResults = sessionStorage.getItem("flightSearchParams")
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults)

      setFrom(parsedResults.fromname)
      setTripType(parsedResults.tripType)
      setTo(parsedResults.toname) // ← Fixed: this was incorrectly `setFrom` again
      setDeparture(new Date(parsedResults.departureDate))
      setReturnDate(new Date(parsedResults.returnDate))
      setCabinClass(parsedResults.cabinClass)
      setToSuggestions(parsedResults.toSuggestions)
      setFromSuggestions(parsedResults.fromSuggestions)

      setTravelerCounts((prev) => ({
        ...prev,
        adults: parsedResults.adults,
        children: parsedResults?.children || 0,
        infants: parsedResults?.infants || 0,
      }))
    }
  }, [])

  // Fetch airport/city suggestions from Agoda API
  const fetchSuggestions = async (query: string, setter: (s: any[]) => void) => {
    if (!query || query.length < 2) {
      setter([])
      return
    }
    try {
      const options = {
        method: "GET",
        url: "https://agoda-com.p.rapidapi.com/flights/auto-complete",
        params: { query },
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          "x-rapidapi-host": "agoda-com.p.rapidapi.com",
        },
      }
      const response = await axios.request(options)
      
      console.log("fromSuggestions : ", response.data.suggestions)
      if (response.data && Array.isArray(response.data.suggestions)) {
        setter(response.data.suggestions)
      } else {
        setter([])
      }
    } catch (error) {
      setter([])
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFlightLoading(true)
    try {
      // Extract IATA codes from selected suggestions or input (assume input is code if length=3)
      const getIataCode = (val: string, suggestions: any[]) => {
        const found = suggestions.find((s) => (s.name || s.cityName || s.displayName) == val)
        console.log("found : ", found)
        return found?.tripLocations[0].code || val
      }

      const originCode = getIataCode(from, fromSuggestions)
      const destCode = getIataCode(to, toSuggestions)
      // Format date as YYYY-MM-DD using local time, not UTC
      const formatLocalDate = (d: Date | undefined) =>
        d
          ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
          : ""
      const departDate = formatLocalDate(departure)
      const retDate = formatLocalDate(returnDate)

      // Prevent searching with a departure date before tomorrow
      const today = new Date()
      const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // tomorrow
      const departDateObj = departure
        ? new Date(departure.getFullYear(), departure.getMonth(), departure.getDate())
        : null

      if (!departDateObj || departDateObj < minDate) {
        toast.error("Please select a valid departure date (must be at least tomorrow).")
        setFlightLoading(false)
        return
      }

      let apiUrl = ""
      let params: any = {}

      if (tripType === "One-way") {
        apiUrl = "https://agoda-com.p.rapidapi.com/flights/search-one-way"
        params = {
          origin: originCode,
          destination: destCode,
          departureDate: departDate,
          adults: travelerCounts.adults || 1,
          children: travelerCounts.children || 0,
          infants: travelerCounts.infants || 0,
          cabinType: cabinClass,
          currency:"USD"
        }
      } else {
        apiUrl = "https://agoda-com.p.rapidapi.com/flights/search-roundtrip"
        params = {
          origin: originCode,
          destination: destCode,
          departureDate: departDate,
          returnDate: retDate,
          adults: travelerCounts.adults || 1,
          children: travelerCounts.children || 0,
          infants: travelerCounts.infants || 0,
          cabinType: cabinClass,
           currency:"USD"

        }
      }

      // Log the date values and params for diagnosis
      console.log("[Agoda API] Sending params:", params)

      const options = {
        method: "GET",
        url: apiUrl,
        params,
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          "x-rapidapi-host": "agoda-com.p.rapidapi.com",
        },
      }

      const response = await axios.request(options)

      // Log the full Agoda API response
      console.log("[Agoda API] FULL response:", response.data.trips)

      // Only save to sessionStorage if response contains valid data
      let isValid = false
      const agodaData = response.data.trips[0]

      if (Array.isArray(response.data.trips)) {
        isValid = true
      } else if (agodaData?.bundles && Array.isArray(agodaData.bundles) && agodaData.bundles.length > 0) {
        isValid = true
      }
console.log(agodaData?.bundles)
      if (isValid) {
        sessionStorage.setItem("flightSearchResults", JSON.stringify(agodaData))
        console.log("[Agoda API] Saved to sessionStorage.")
      } else {
        sessionStorage.setItem(
          "flightSearchResults",
          JSON.stringify({ error: "Invalid Agoda API response", agodaResponse: response.data }),
        )
        console.warn("[Agoda API] Invalid response, not saving real data:", response.data)
      }

      // Also store search params for display
      sessionStorage.setItem(
        "flightSearchParams",
        JSON.stringify({
          from: originCode,
          toname: to,
          fromname: from,
          to: destCode,
          toSuggestions: toSuggestions,
          fromSuggestions: fromSuggestions,
          departureDate: departDate,
          returnDate: retDate,
          adults: travelerCounts.adults || 1,
          children: travelerCounts.children || 0,
          infants: travelerCounts.infants || 0,
          cabinClass: cabinClass,
          tripType: tripType,
        }),
      )

      // Redirect to results page
     window.location.href = `/flights?from=${originCode}&to=${destCode}&date=${departDate}${tripType === "Round-trip" ? `&returnDate=${retDate}` : ""}&adults=${travelerCounts.adults || 1}`
    } catch (err) {
      // alert("Error searching flights. Please try again.")
    } finally {
      setFlightLoading(false)
    }
  }

  const swapLocations = () => {
    const tempFrom = from
    const tempFromSuggestions = fromSuggestions
    setFrom(to)
    setFromSuggestions(toSuggestions)
    setTo(tempFrom)
    setToSuggestions(tempFromSuggestions)
  }

  return (
    <div className="w-full mx-auto text-black">
      {/* Search Form */}
      <div className="w-full bg-white">
        {/* Trip Type Selector */}

        <div className="relative">
          <button
            type="button"
            className="flex justify-start gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm hover:bg-gray-50"
            onClick={() => setShowTripType((v) => !v)}
          >
            <Plane className="h-3 w-3 sm:h-4 sm:w-4" />
            {tripType}
            <span className="text-xs ml-1">▼</span>
          </button>

          {showTripType && (
            <>
              {isMobile && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-25"
                  onClick={() => setShowTripType(false)}
                />
              )}
              <div
                className={`absolute z-50 bg-white rounded-xl shadow-lg border border-gray-200 min-w-[140px] sm:min-w-[160px] ${isMobile ? "top-full mt-2 left-0" : "top-full mt-1 left-0"
                  }`}
              >
                <div
                  className={`px-3 sm:px-4 py-2 sm:py-3 cursor-pointer z-[99999] hover:bg-blue-50 rounded-t-xl transition-colors text-xs sm:text-sm ${tripType === "Round-trip" ? "font-semibold bg-blue-50" : ""
                    }`}
                  onClick={() => {
                    setTripType("Round-trip");
                    setShowTripType(false);
                  }}
                >
                  Round-trip
                </div>
                <div
                  className={`px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-blue-50 rounded-b-xl transition-colors text-xs sm:text-sm ${tripType === "One-way" ? "font-semibold bg-blue-50" : ""
                    }`}
                  onClick={() => {
                    setTripType("One-way");
                    setShowTripType(false);
                    setReturnDate(undefined); // Clear return date if One-way is selected
                  }}
                >
                  One-way
                </div>
              </div>
            </>
          )}
        </div>



        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 sm:gap-3 lg:flex-row lg:items-center lg:gap-2 min-h-0">
            {/* From Location */}
            <div className="flex items-center flex-1 min-w-0 relative">
              <div className="w-full h-10 sm:h-12 pl-3 sm:pl-4 pr-3 border border-gray-300  text-gray-900 placeholder-gray-400 focus-within:ring-1 focus-within:ring-blue-500 flex items-center gap-2">
                <Plane className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                <input
                  ref={fromInputRef}
                  type="text"
                  placeholder="From where?"
                  className="bg-transparent border-none shadow-none text-xs sm:text-sm font-medium placeholder-gray-400 flex-1 min-w-0 h-full focus:outline-none focus:ring-0 focus:border-transparent"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value)
                    fetchSuggestions(e.target.value, setFromSuggestions)
                    setShowFromSuggestions(true)
                  }}
                  onFocus={() => setShowFromSuggestions(true)}
                  autoComplete="off"
                />
              </div>
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200  mt-1 shadow-lg max-h-48 sm:max-h-56 overflow-y-auto z-10">
                  {fromSuggestions.map((s: any, idx: number) => (
                    <div
                      key={s.id || idx}
                      className="px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-blue-50 text-gray-800 border-b border-gray-100 last:border-b-0"
                      onMouseDown={() => {
                        setFrom(s.name || s.cityName || s.displayName || "")
                        setShowFromSuggestions(false)
                      }}
                    >
                      <div className="font-medium text-xs sm:text-sm">{s.name || s.cityName || s.displayName}</div>
                      {s.countryName && <div className="text-xs text-gray-500">{s.countryName}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center lg:justify-start order-3 lg:order-2">
              <button
                type="button"
                onClick={swapLocations}
                className="bg-blue-100 hover:bg-blue-200  w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 transition-colors border-2"
                aria-label="Swap locations"
              >
                <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* To Location */}
            <div className="flex items-center flex-1 min-w-0 relative order-2 lg:order-3">
              <div className="w-full h-10 sm:h-12 pl-3 sm:pl-4 pr-3 border border-gray-300  text-gray-900 placeholder-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 flex items-center gap-2">
                <Plane className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0 rotate-90" />
                <input
                  ref={toInputRef}
                  type="text"
                  placeholder="To where?"
                  className="bg-transparent border-none shadow-none text-xs sm:text-sm font-medium placeholder-gray-400 flex-1 min-w-0 h-full focus:outline-none focus:ring-0 focus:border-transparent"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value)
                    fetchSuggestions(e.target.value, setToSuggestions)
                    setShowToSuggestions(true)
                  }}
                  onFocus={() => setShowToSuggestions(true)}
                  autoComplete="off"
                />
              </div>
              {showToSuggestions && toSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200  mt-1 shadow-lg max-h-48 sm:max-h-56 overflow-y-auto z-50">
                  {toSuggestions.map((s: any, idx: number) => (
                    <div
                      key={s.id || idx}
                      className="px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-blue-50 text-gray-800 border-b border-gray-100 last:border-b-0"
                      onMouseDown={() => {
                        setTo(s.name || s.cityName || s.displayName || "")
                        setShowToSuggestions(false)
                      }}
                    >
                      <div className="font-medium text-xs sm:text-sm">{s.name || s.cityName || s.displayName}</div>
                      {s.countryName && <div className="text-xs text-gray-500">{s.countryName}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Departure Date */}
            <div className="flex items-center flex-1 min-w-0 border relative order-4">
              <Button
                type="button"
                variant="ghost"
                className="w-full h-10 sm:h-12 justify-start text-left bg-transparent text-gray-900 font-normal px-3 sm:px-4"
                style={{ boxShadow: "none", border: "none" }}
                onClick={() => setShowDeparture((v) => !v)}
              >
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 mr-2 flex-shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  {departure ? (
                    <span className="truncate block text-xs sm:text-sm">
                      {departure.toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs sm:text-sm">Departure</span>
                  )}
                </div>
              </Button>
              {showDeparture && (
                <div
                  className={`calendar-popover absolute z-[999999] border ${isMobile ? "fixed inset-0 flex items-center justify-center" : "left-0 top-[0%]"
                    }`}
                >
                  <Calendar
                    mode="single"
                    selected={departure}
                    onSelect={(d) => {
                      setDeparture(d)
                      setShowDeparture(false)
                    }}
                    disabled={(date) => date <= new Date()}
                    initialFocus
                    className="bg-white"
                  />
                </div>
              )}
            </div>


            {/* Return Date - Only for Round-trip */}
            {tripType === "Round-trip" && (
              <div className="flex items-center flex-1 min-w-0 relative order-5 border">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-10 sm:h-12 justify-start text-left bg-transparent text-gray-900 font-normal px-3 sm:px-4"
                  style={{ boxShadow: "none", border: "none" }}
                  onClick={() => setShowReturn((v) => !v)}
                >
                  <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 mr-2 flex-shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    {returnDate ? (
                      <span className="truncate block text-xs sm:text-sm">
                        {returnDate.toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs sm:text-sm">Return</span>
                    )}
                  </div>
                </Button>
                {showReturn && (
                  <div
                    className={`calendar-popover absolute z-[1000] border ${isMobile ? "fixed inset-0 flex items-center justify-center" : "left-0 top-[5%]"
                      }`}
                  >
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      disabled={(date) => {
                        return departure ? date <= departure : date <= new Date()
                      }}
                      onSelect={(d) => {
                        setReturnDate(d)
                        setShowReturn(false)
                      }}
                      initialFocus
                      className="bg-white"
                    />
                  </div>
                )}
              </div>
            )}


            {/* Travelers */}
            <div className="flex items-center flex-1 min-w-0 order-6">

              <div className="flex items-center border p-2 w-full h-10 sm:h-12 bg-transparent text-gray-900 font-normal gap-2 min-w-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <TravelersDropdown
                    value={travelerCounts}
                    onChange={setTravelerCounts}
                    cabinClass={cabinClass}
                    onCabinClassChange={setCabinClass}
                    isMobile={isMobile}
                    className="w-full"
                  />
                </div>
              </div>


            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center sm:justify-end sm:pt-2">
            <Button
              type="submit"
              className="bg-[#0a3a7a] hover:bg-blue-700 text-white px-6 sm:px-4 py-2 sm:py-3 font-medium text-sm w-full sm:w-auto"
              disabled={flightLoading}
              aria-label="Search Flights"
            >
              {flightLoading ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white rounded-full border-t-transparent animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              )}
              Show Flights
            </Button>
          </div>
        </form>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  )
}
