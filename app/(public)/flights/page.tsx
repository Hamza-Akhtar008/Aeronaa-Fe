"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Filters from "@/components/home/Filters";
import { convertApiResponseToTickets } from "@/lib/utils/flight-converter";
import type { Ticket } from "@/types/checkout"; // Use type import
import { TicketCheckIcon } from "lucide-react";
import { fetchFlights } from "@/lib/flight_api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrencyByLocation } from "@/lib/utils/location-currency";
import { formatPrice } from "@/lib/utils/currency";
import { isValid, parse } from "date-fns";
import Image from "next/image";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Settings2,
} from "lucide-react";

export default function FlightResults() {
  // Filter states
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedCabin, setSelectedCabin] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [selectedAirports, setSelectedAirports] = useState<string[]>([]);
  const [seatSelection, setSeatSelection] = useState(false);
  const [bagsRecheck, setBagsRecheck] = useState(false);
  const [passportRequired, setPassportRequired] = useState(false);
  const [carryOn, setCarryOn] = useState(0);
  const [checkedBag, setCheckedBag] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [fromNameCity, setFromNameCity] = useState("");
  const [ToNameCity, setToNameCity] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    USD: 1,
  });

  // Data states
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<"cheapest" | "best" | "quickest">(
    "best"
  );

  useEffect(() => {
    let country =
      localStorage.getItem("userCountry") ||
      localStorage.getItem("usercountry") ||
      sessionStorage.getItem("userCountry") ||
      sessionStorage.getItem("usercountry");
    if (country) {
      const currency = getCurrencyByLocation(country);
      setSelectedCurrency(currency);
    } else {
      setSelectedCurrency("USD");
    }
  }, []);

  // Fetch exchange rates for selected currency
  useEffect(() => {
    setLoading(true);
    if (selectedCurrency === "USD") {
      setExchangeRates({ USD: 1 });
      return;
    }
    const fetchRates = async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/USD`
        );
        const data = await response.json();
        setExchangeRates({ ...data.rates, USD: 1 });
      } catch (error) {
        setExchangeRates({ USD: 1 });
      }
    };
    fetchRates();
    setLoading(false);
  }, [selectedCurrency]);
  // Helper to parse baggage string (e.g., "1 piece" -> 1, "No baggage" -> 0)
  const parseBaggageQuantity = (baggageString: string): number => {
    const match = baggageString.match(/(\d+)\s*piece/i);
    if (match && match[1]) {
      return Number.parseInt(match[1], 10);
    }
    return 0; // Default to 0 if no number found or "No baggage"
  };

  const searchParams = useSearchParams();
  let flightSearchParams: any = {};
  if (typeof window !== "undefined") {
    const paramsStr = window.sessionStorage.getItem("flightSearchParams");
    if (paramsStr) {
      try {
        flightSearchParams = JSON.parse(paramsStr);
        // setFromNameCity(flightSearchParams.fromname);
        // setToNameCity(flightSearchParams.fromname);
      } catch (e) {
        console.error(
          "Error parsing flight search params from session storage:",
          e
        );
      }
    }
  }

  // Load and combine flight data from API and session storage
  useEffect(() => {
    const getFlights = async () => {
      setLoading(true);
      setError("");
      let combinedTickets: Ticket[] = [];
      let apiFetchSuccessful = false;

      // 1. Attempt to fetch from API
      try {
        if (
          flightSearchParams.fromname &&
          flightSearchParams.toname &&
          flightSearchParams.departureDate &&
          flightSearchParams.cabinClass
        ) {
          const apiParams = {
            fromname: flightSearchParams.fromname,
            toname: flightSearchParams.toname,
            departureDate: flightSearchParams.departureDate,
            returnDate: flightSearchParams.returnDate || null,
            cabinClass: flightSearchParams.cabinClass,
            tripType: flightSearchParams.tripType,
          };
          const apiResponse = await fetchFlights(apiParams);
          // Assuming apiResponse is already Ticket[]
          if (Array.isArray(apiResponse) && apiResponse.length > 0) {
            combinedTickets = combinedTickets.concat(apiResponse as Ticket[]);
            apiFetchSuccessful = true;
          } else {
            console.warn("API fetch returned no valid data or empty array.");
          }
        } else {
          console.warn("Missing flight search parameters for API call.");
        }
      } catch (err: any) {
        console.warn("API fetch failed:", err.message);
      }

      // 2. Attempt to load from session storage
      const storedResults = sessionStorage.getItem("flightSearchResults");
      if (storedResults) {
        try {
          const parsedResults = JSON.parse(storedResults);
          //  console.log("Flight :  ",parsedResults)
          const sessionTickets = convertApiResponseToTickets(parsedResults);
          console.log("sessionTickets : ", sessionTickets);
          if (sessionTickets.length > 0) {
            combinedTickets = combinedTickets.concat(sessionTickets);
          } else {
            console.warn(
              "Session storage returned no valid data or empty array."
            );
          }
        } catch (err) {
          console.error(
            "Error parsing flight results from session storage:",
            err
          );
        }
      }

      // 3. Fallback to dummy data if both API and session storage yielded no results
      if (combinedTickets.length === 0) {
        try {
          const dummyTickets = convertApiResponseToTickets({}); // Pass empty object or relevant params if convertApiResponseToTickets needs them
          if (dummyTickets.length > 0) {
            combinedTickets = combinedTickets.concat(dummyTickets);
            console.warn(
              "No flight results found from API or session storage, using dummy data."
            );
          } else {
            setError("No flight results found and failed to load dummy data.");
          }
        } catch (err) {
          console.error("Error loading dummy flight results:", err);
          setError("No flight results found and failed to load dummy data.");
        }
      }

      setTickets(combinedTickets);
      setLoading(false);
      if (combinedTickets.length === 0 && !error) {
        setError("No flights found matching your search criteria.");
      }
    };

    getFlights();
  }, [
    flightSearchParams.fromname,
    flightSearchParams.toname,
    flightSearchParams.departureDate,
    flightSearchParams.returnDate,
    flightSearchParams.cabinClass,
    flightSearchParams.tripType,
  ]); // Re-run effect if search params change

  // Calculate filter options and ranges
  const prices = tickets.map((t) => t.totalPrice).filter((p) => p > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 10000;
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  const durations = tickets
    .map((t) =>
      t.segments.reduce((total, seg) => total + seg.flightDuration, 0)
    )
    .filter((d) => d > 0);
  const minDuration = durations.length ? Math.min(...durations) : 0;
  const maxDuration = durations.length ? Math.max(...durations) : 24 * 60;
  const [durationRange, setDurationRange] = useState([
    minDuration,
    maxDuration,
  ]);

  // Update ranges when data changes
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    setDurationRange([minDuration, maxDuration]);
  }, [minDuration, maxDuration]);

  // Generate filter options
  const airlineMap: { [key: string]: number } = {};
  const airportMap: { [key: string]: number } = {};
  const cabinMap: { [key: string]: number } = {};
  const stopMap: { [key: string]: number } = {
    "Non-stop": Number.POSITIVE_INFINITY,
    "1 Stop": Number.POSITIVE_INFINITY,
    "2+ Stops": Number.POSITIVE_INFINITY,
  };
  tickets.forEach((ticket) => {
    const price = ticket.totalPrice;
    // Airlines
    if (!airlineMap[ticket.airline] || price < airlineMap[ticket.airline]) {
      airlineMap[ticket.airline] = price;
    }
    // Airports
    if (
      !airportMap[ticket.departureAirport] ||
      price < airportMap[ticket.departureAirport]
    ) {
      airportMap[ticket.departureAirport] = price;
    }
    if (
      !airportMap[ticket.arrivalAirport] ||
      price < airportMap[ticket.arrivalAirport]
    ) {
      airportMap[ticket.arrivalAirport] = price;
    }
    // Cabin classes
    const cabinName =
      ticket.flightClass.charAt(0).toUpperCase() + ticket.flightClass.slice(1);
    if (!cabinMap[cabinName] || price < cabinMap[cabinName]) {
      cabinMap[cabinName] = price;
    }
    // Stops
    const outboundSegments = ticket.segments.filter(
      (seg) => seg.type === "outbound"
    );
    const stops = outboundSegments.length - 1;
    if (stops === 0 && price < stopMap["Non-stop"]) stopMap["Non-stop"] = price;
    else if (stops === 1 && price < stopMap["1 Stop"])
      stopMap["1 Stop"] = price;
    else if (stops >= 2 && price < stopMap["2+ Stops"])
      stopMap["2+ Stops"] = price;
  });
  const allAirlines = Object.keys(airlineMap);
  const allAirports = Object.keys(airportMap);
  const allCabins = Object.keys(cabinMap);

  // Filter tickets
  let filteredTickets = tickets.filter((ticket) => {
    const totalDuration = ticket.segments.reduce(
      (total, seg) => total + seg.flightDuration,
      0
    );
    const outboundSegments = ticket.segments.filter(
      (seg) => seg.type === "outbound"
    );
    const stops = outboundSegments.length - 1;
    const cabinName =
      ticket.flightClass.charAt(0).toUpperCase() + ticket.flightClass.slice(1);

    // Price filter
    if (ticket.totalPrice < priceRange[0] || ticket.totalPrice > priceRange[1])
      return false;

    // Duration filter
    if (totalDuration < durationRange[0] || totalDuration > durationRange[1])
      return false;

    // Stops filter
    if (selectedStops.length > 0) {
      const hasNonStop = selectedStops.includes("Non-stop") && stops === 0;
      const hasOneStop = selectedStops.includes("1 Stop") && stops === 1;
      const hasTwoPlus = selectedStops.includes("2+ Stops") && stops >= 2;
      if (!hasNonStop && !hasOneStop && !hasTwoPlus) return false;
    }

    // Airlines filter
    if (
      selectedAirlines.length > 0 &&
      !selectedAirlines.includes(ticket.airline)
    )
      return false;

    // Cabin filter
    if (selectedCabin.length > 0 && !selectedCabin.includes(cabinName))
      return false;

    // Airports filter
    if (
      selectedAirports.length > 0 &&
      !selectedAirports.includes(ticket.departureAirport) &&
      !selectedAirports.includes(ticket.arrivalAirport)
    )
      return false;

    // Feature filters
    if (seatSelection && !ticket.seatSelectionAllowed) return false;
    if (passportRequired && !ticket.passportRequired) return false;
    if (bagsRecheck && !ticket.recheckBagsRequired) return false;

    // Baggage filters
    if (carryOn > 0) {
      const cabinBagQuantity = parseBaggageQuantity(ticket.cabbinBaggage);
      if (cabinBagQuantity < carryOn) return false;
    }
    if (checkedBag > 0) {
      const checkedBagQuantity = parseBaggageQuantity(ticket.checkedBaggage);
      if (checkedBagQuantity < checkedBag) return false;
    }
    return true;
  });

  const sortedTickets = useMemo(() => {
    let ticket = [...filteredTickets]; // copy to avoid mutation

    if (sortBy === "cheapest") {
      ticket.sort((a, b) => a.totalPrice - b.totalPrice);
    } else if (sortBy === "quickest") {
      ticket.sort((a, b) => {
        const aDuration = a.segments.reduce(
          (t, seg) => t + seg.flightDuration,
          0
        );
        const bDuration = b.segments.reduce(
          (t, seg) => t + seg.flightDuration,
          0
        );
        return aDuration - bDuration;
      });
    } else if (sortBy === "best") {
      ticket.sort((a, b) => {
        const aDuration = a.segments.reduce(
          (t, seg) => t + seg.flightDuration,
          0
        );
        const bDuration = b.segments.reduce(
          (t, seg) => t + seg.flightDuration,
          0
        );

        // Example scoring system: lower score = better
        const aScore = a.totalPrice * 0.7 + aDuration * 0.3;
        const bScore = b.totalPrice * 0.7 + bDuration * 0.3;
        return aScore - bScore;
      });
    }

    return ticket;
  }, [filteredTickets, sortBy]);
  // Sort tickets

  // Helper functions
  function parseApiDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    // List of formats your API might send
    const formats = [
      "dd/MM/yyyy HH:mm", // e.g. 31/08/2025 14:30
      "dd-MM-yyyy HH:mm", // e.g. 31-08-2025 14:30
      "yyyy-MM-dd HH:mm", // e.g. 2025-08-31 14:30
      "yyyy/MM/dd HH:mm", // e.g. 2025/08/31 14:30
      "MM/dd/yyyy HH:mm", // e.g. 08/31/2025 14:30
    ];

    // Try ISO first (native parser handles this well)
    const isoDate = new Date(dateStr);
    if (isValid(isoDate)) return isoDate;

    // Try custom formats
    for (const fmt of formats) {
      const parsed = parse(dateStr, fmt, new Date());
      if (isValid(parsed)) return parsed;
    }

    return null;
  }

  function formatTime(dateTime: string) {
    const parsed = parseApiDate(dateTime);
    if (!parsed) return "Invalid Date";

    return parsed.toLocaleString([], {
      day: "2-digit",
      month: "short", // e.g. Aug
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };
  const handleFilterChange = (type: string, value: string) => {
    switch (type) {
      case "stops":
        setSelectedStops((prev) =>
          prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value]
        );
        break;
      case "airlines":
        setSelectedAirlines((prev) =>
          prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value]
        );
        break;
      case "cabin":
        setSelectedCabin((prev) =>
          prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value]
        );
        break;
    }
  };

if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 border-4 border-[#0a3a7a] border-t-transparent rounded-full animate-spin"
        ></div>
        
      </div>
    </div>
  );
}


  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 text-xl">
        {error}
      </div>
    );<p className="text-[#0a3a7a] text-lg font-medium">
          Loading flight results...
        </p>
  }

  return (
    <div className="w-full max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4">
      <Filters
        initialValues={{
          ...flightSearchParams,
          adults:
            typeof flightSearchParams.adults === "number"
              ? flightSearchParams.adults
              : 1,
          children:
            typeof flightSearchParams.children === "number"
              ? flightSearchParams.children
              : 0,
          infants:
            typeof flightSearchParams.infants === "number"
              ? flightSearchParams.infants
              : 0,
          cabinClass: flightSearchParams.cabinClass || "Economy",
          stops: selectedStops,
          airlines: selectedAirlines,
          cabin: selectedCabin,
          duration: selectedDuration,
          airports: selectedAirports,
          priceRange,
          durationRange,
          carryOn,
          checkedBag,
          seatSelection,
          bagsRecheck,
          passportRequired,
        }}
        onChange={(updated) => {
          if (updated.stops !== undefined) setSelectedStops(updated.stops);
          if (updated.airlines !== undefined)
            setSelectedAirlines(updated.airlines);
          if (updated.cabin !== undefined) setSelectedCabin(updated.cabin);
          if (updated.duration !== undefined)
            setSelectedDuration(updated.duration);
          if (updated.airports !== undefined)
            setSelectedAirports(updated.airports);
          if (updated.priceRange !== undefined)
            setPriceRange(updated.priceRange);
          if (updated.durationRange !== undefined)
            setDurationRange(updated.durationRange);
          if (updated.carryOn !== undefined) setCarryOn(updated.carryOn);
          if (updated.checkedBag !== undefined)
            setCheckedBag(updated.checkedBag);
          if (updated.seatSelection !== undefined)
            setSeatSelection(updated.seatSelection);
          if (updated.bagsRecheck !== undefined)
            setBagsRecheck(updated.bagsRecheck);
          if (updated.passportRequired !== undefined)
            setPassportRequired(updated.passportRequired);
        }}
        tabValue="flights"
      />
    <div  className=" w-full max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4 ">

        <div className="flex flex-col lg:flex-row gap-2 mt-2">
          {/* ---- MOBILE FILTER BUTTON ---- */}
          <div className="lg:hidden flex justify-center items-center gap-6 mt-4">
            {/* Sort by */}
            

            {/* Filters */}
            <button
              className="flex items-center gap-2 text-black px-3 py-2 rounded-lg"
              onClick={() => setFilterOpen(true)}
            >
              <img
                src="/fIcon2.png"
                alt="Filter Icon"
                className="w-5 h-5 object-contain"
              />
              <span className="font-medium text-[#0a3a7a]">Filters</span>
            </button>
          </div>

          {/* ---- DESKTOP SIDEBAR ---- */}
          <div className="hidden lg:block">
            <aside className="w-full lg:w-80 flex-shrink-0 rounded-xl border border-[#DADADA] p-6 h-fit sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Filter</h2>
              </div>
              <div className="space-y-8">
                {/* Price Range */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Price Range</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-md whitespace-nowrap">
                      {formatPrice(
                        Math.ceil(priceRange[0]) *
                          (exchangeRates[selectedCurrency] || 1),
                        selectedCurrency
                      )}
                    </span>
                    <div
                      className="relative w-full mx-2 flex items-center"
                      style={{ height: "24px" }}
                    >
                      {/* Track background */}
                      <div
                        className="absolute w-full h-[1px] bg-gray-400 rounded"
                        style={{
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 0,
                        }}
                      />
                      {/* Selected range */}
                      <div
                        className="absolute h-[1px] bg-black rounded"
                        style={{
                          left: `${
                            ((priceRange[0] - minPrice) /
                              (maxPrice - minPrice)) *
                            100
                          }%`,
                          width: `${
                            ((priceRange[1] - priceRange[0]) /
                              (maxPrice - minPrice)) *
                            100
                          }%`,
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 1,
                        }}
                      />
                      {/* Min thumb */}
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        value={priceRange[0]}
                        onChange={(e) => {
                          const val = Math.min(
                            Number(e.target.value),
                            priceRange[1] - 1
                          );
                          setPriceRange([val, priceRange[1]]);
                        }}
                        className="
    absolute w-full h-[1px] appearance-none bg-transparent z-20 
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:bg-black
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:border
    [&::-webkit-slider-thumb]:border-gray-400

    [&::-moz-range-thumb]:appearance-none
    [&::-moz-range-thumb]:bg-black
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:h-4
    [&::-moz-range-thumb]:w-4
    [&::-moz-range-thumb]:border
    [&::-moz-range-thumb]:border-gray-400
  "
                      />
                      {/* Max thumb */}
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(e) => {
                          const val = Math.max(
                            Number(e.target.value),
                            priceRange[0] + 1
                          );
                          setPriceRange([priceRange[0], val]);
                        }}
                        className=" absolute w-full h-[1px] appearance-none bg-transparent z-20 
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:bg-black
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:border
    [&::-webkit-slider-thumb]:border-gray-400

    [&::-moz-range-thumb]:appearance-none
    [&::-moz-range-thumb]:bg-black
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:h-4
    [&::-moz-range-thumb]:w-4
    [&::-moz-range-thumb]:border
    [&::-moz-range-thumb]:border-gray-400"
                      />
                    </div>
                    <span className="text-md whitespace-nowrap">
                      {" "}
                      {formatPrice(
                        Math.ceil(priceRange[1]) *
                          (exchangeRates[selectedCurrency] || 1),
                        selectedCurrency
                      )}
                    </span>
                  </div>
                </div>

                {/* Duration Range */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Duration</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-md whitespace-nowrap">
                      {formatDuration(durationRange[0])}
                    </span>
                    <div
                      className="relative w-full mx-2 flex items-center"
                      style={{ height: "32px" }}
                    >
                      <div
                        className="absolute w-full h-2 bg-gray-200 rounded"
                        style={{
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 0,
                        }}
                      />
                      <div
                        className="absolute h-[1px] bg-black rounded"
                        style={{
                          left: `${
                            ((durationRange[0] - minDuration) /
                              (maxDuration - minDuration)) *
                            100
                          }%`,
                          width: `${
                            ((durationRange[1] - durationRange[0]) /
                              (maxDuration - minDuration)) *
                            100
                          }%`,
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 1,
                        }}
                      />
                      <input
                        type="range"
                        min={minDuration}
                        max={maxDuration}
                        value={durationRange[0]}
                        onChange={(e) => {
                          const val = Math.min(
                            Number(e.target.value),
                            durationRange[1] - 1
                          );
                          setDurationRange([val, durationRange[1]]);
                        }}
                        className=" absolute w-full h-[1px] appearance-none bg-transparent z-20 
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:bg-black
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:border
    [&::-webkit-slider-thumb]:border-gray-400

    [&::-moz-range-thumb]:appearance-none
    [&::-moz-range-thumb]:bg-black
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:h-4
    [&::-moz-range-thumb]:w-4
    [&::-moz-range-thumb]:border
    [&::-moz-range-thumb]:border-gray-400"
                      />
                      <input
                        type="range"
                        min={minDuration}
                        max={maxDuration}
                        value={durationRange[1]}
                        onChange={(e) => {
                          const val = Math.max(
                            Number(e.target.value),
                            durationRange[0] + 1
                          );
                          setDurationRange([durationRange[0], val]);
                        }}
                        className=" absolute w-full h-[1px] appearance-none bg-transparent z-20 
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:bg-black
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:border
    [&::-webkit-slider-thumb]:border-gray-400

    [&::-moz-range-thumb]:appearance-none
    [&::-moz-range-thumb]:bg-black
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:h-4
    [&::-moz-range-thumb]:w-4
    [&::-moz-range-thumb]:border
    [&::-moz-range-thumb]:border-gray-400"
                      />
                    </div>
                    <span className="text-md whitespace-nowrap">
                      {formatDuration(durationRange[1])}
                    </span>
                  </div>
                </div>
                {/* Stops */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Stops</h3>
                  <div className="flex flex-col gap-2">
                    {Object.keys(stopMap).map((stop) => (
                      <label
                        key={stop}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStops.includes(stop)}
                          onChange={() => handleFilterChange("stops", stop)}
                          className="accent-[#00b4d8]"
                        />
                        <span className="text-gray-700">{stop}</span>
                        <span className="ml-auto text-xs text-gray-500">
                          {stopMap[stop] !== Number.POSITIVE_INFINITY
                            ? formatPrice(
                                Math.ceil(stopMap[stop]) *
                                  (exchangeRates[selectedCurrency] || 1),
                                selectedCurrency
                              )
                            : "-"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Airlines */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Airlines</h3>
                  <div className="flex flex-col gap-2">
                    {allAirlines.map((airline) => (
                      <label
                        key={airline}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAirlines.includes(airline)}
                          onChange={() =>
                            handleFilterChange("airlines", airline)
                          }
                          className="accent-[#00b4d8]"
                        />
                        <span className="text-gray-700">{airline}</span>
                        <span className="ml-auto text-xs text-gray-500">
                          {formatPrice(
                            Math.ceil(airlineMap[airline]) *
                              (exchangeRates[selectedCurrency] || 1),
                            selectedCurrency
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Airports */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Airports</h3>
                  <div className="flex flex-col gap-2">
                    {allAirports.map((airport) => (
                      <label
                        key={airport}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAirports.includes(airport)}
                          onChange={() =>
                            setSelectedAirports((prev) =>
                              prev.includes(airport)
                                ? prev.filter((a) => a !== airport)
                                : [...prev, airport]
                            )
                          }
                          className="accent-[#00b4d8]"
                        />
                        <span className="text-gray-700">{airport}</span>
                        <span className="ml-auto text-xs text-gray-500">
                          {formatPrice(
                            Math.ceil(airportMap[airport]) *
                              (exchangeRates[selectedCurrency] || 1),
                            selectedCurrency
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Cabin Class */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Cabin Class</h3>
                  <div className="flex flex-col gap-2">
                    {allCabins.map((cabin) => (
                      <label
                        key={cabin}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCabin.includes(cabin)}
                          onChange={() => handleFilterChange("cabin", cabin)}
                          className="accent-[#00b4d8]"
                        />
                        <span className="text-gray-700">{cabin}</span>
                        <span className="ml-auto text-xs text-gray-500">
                          {formatPrice(
                            Math.ceil(cabinMap[cabin]) *
                              (exchangeRates[selectedCurrency] || 1),
                            selectedCurrency
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Baggage */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Baggage</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-700">Carry-on bag</span>
                    <button
                      onClick={() => setCarryOn(Math.max(0, carryOn - 1))}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span className="px-2">{carryOn}</span>
                    <button
                      onClick={() => setCarryOn(carryOn + 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-700">Checked bag</span>
                    <button
                      onClick={() => setCheckedBag(Math.max(0, checkedBag - 1))}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span className="px-2">{checkedBag}</span>
                    <button
                      onClick={() => setCheckedBag(checkedBag + 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Additional Filters */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={seatSelection}
                      onChange={(e) => setSeatSelection(e.target.checked)}
                      className="accent-blue-600"
                      id="seatSelection"
                    />
                    <label htmlFor="seatSelection" className="text-gray-700">
                      Seat Selection Allowed
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={bagsRecheck}
                      onChange={(e) => setBagsRecheck(e.target.checked)}
                      className="accent-blue-600"
                      id="bagsRecheck"
                    />
                    <label htmlFor="bagsRecheck" className="text-gray-700">
                      Bags Recheck Required
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={passportRequired}
                      onChange={(e) => setPassportRequired(e.target.checked)}
                      className="accent-blue-600"
                      id="passportRequired"
                    />
                    <label htmlFor="passportRequired" className="text-gray-700">
                      Passport Required
                    </label>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* ---- MOBILE DRAWER ---- */}
          {filterOpen && (
            <div className="fixed inset-0 z-[9999999] bg-black/40 flex">
              <div className="w-4/5 max-w-xs bg-white p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button onClick={() => setFilterOpen(false)}>✕</button>
                </div>
                {/* Reuse the same sidebar filters */}
                <div className="space-y-8">
                  <aside className="w-full lg:w-80 flex-shrink-0 rounded-xl border border-[#DADADA] p-6 h-fit sticky top-4">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold tracking-tight">
                        Filter
                      </h2>
                    </div>
                    <div className="space-y-8">
                      {/* Price Range */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3">
                          Price Range
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-md whitespace-nowrap">
                            {formatPrice(
                              Math.ceil(priceRange[0]) *
                                (exchangeRates[selectedCurrency] || 1),
                              selectedCurrency
                            )}
                          </span>
                          <div
                            className="relative w-full mx-2 flex items-center"
                            style={{ height: "24px" }}
                          >
                            {/* Track background */}
                            <div
                              className="absolute w-full h-[1px] bg-gray-400 rounded"
                              style={{
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: 0,
                              }}
                            />
                            {/* Selected range */}
                            <div
                              className="absolute h-[1px] bg-black rounded"
                              style={{
                                left: `${
                                  ((priceRange[0] - minPrice) /
                                    (maxPrice - minPrice)) *
                                  100
                                }%`,
                                width: `${
                                  ((priceRange[1] - priceRange[0]) /
                                    (maxPrice - minPrice)) *
                                  100
                                }%`,
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: 1,
                              }}
                            />
                            {/* Min thumb */}
                            <input
                              type="range"
                              min={minPrice}
                              max={maxPrice}
                              value={priceRange[0]}
                              onChange={(e) => {
                                const val = Math.min(
                                  Number(e.target.value),
                                  priceRange[1] - 1
                                );
                                setPriceRange([val, priceRange[1]]);
                              }}
                              className="
    absolute w-full h-[1px] appearance-none bg-transparent z-20 
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:bg-black
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:border
    [&::-webkit-slider-thumb]:border-gray-400

    [&::-moz-range-thumb]:appearance-none
    [&::-moz-range-thumb]:bg-black
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:h-4
    [&::-moz-range-thumb]:w-4
    [&::-moz-range-thumb]:border
    [&::-moz-range-thumb]:border-gray-400
  "
                            />
                            {/* Max thumb */}
                            <input
                              type="range"
                              min={minPrice}
                              max={maxPrice}
                              value={priceRange[1]}
                              onChange={(e) => {
                                const val = Math.max(
                                  Number(e.target.value),
                                  priceRange[0] + 1
                                );
                                setPriceRange([priceRange[0], val]);
                              }}
                              className=" absolute w-full h-[1px] appearance-none bg-transparent z-20 
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:bg-black
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:border
    [&::-webkit-slider-thumb]:border-gray-400

    [&::-moz-range-thumb]:appearance-none
    [&::-moz-range-thumb]:bg-black
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:h-4
    [&::-moz-range-thumb]:w-4
    [&::-moz-range-thumb]:border
    [&::-moz-range-thumb]:border-gray-400"
                            />
                          </div>
                          <span className="text-md whitespace-nowrap">
                            {formatPrice(
                              Math.ceil(priceRange[1]) *
                                (exchangeRates[selectedCurrency] || 1),
                              selectedCurrency
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Duration Range */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Duration
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-md whitespace-nowrap">
                            {formatDuration(durationRange[0])}
                          </span>
                          <div
                            className="relative w-full mx-2 flex items-center"
                            style={{ height: "32px" }}
                          >
                            <div
                              className="absolute w-full h-2 bg-gray-200 rounded"
                              style={{
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: 0,
                              }}
                            />
                            <div
                              className="absolute h-[1px] bg-black rounded"
                              style={{
                                left: `${
                                  ((durationRange[0] - minDuration) /
                                    (maxDuration - minDuration)) *
                                  100
                                }%`,
                                width: `${
                                  ((durationRange[1] - durationRange[0]) /
                                    (maxDuration - minDuration)) *
                                  100
                                }%`,
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: 1,
                              }}
                            />
                            <input
                              type="range"
                              min={minDuration}
                              max={maxDuration}
                              value={durationRange[0]}
                              onChange={(e) => {
                                const val = Math.min(
                                  Number(e.target.value),
                                  durationRange[1] - 1
                                );
                                setDurationRange([val, durationRange[1]]);
                              }}
                              className=" absolute w-full h-[1px] appearance-none bg-transparent z-20 
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:bg-black
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:border
    [&::-webkit-slider-thumb]:border-gray-400

    [&::-moz-range-thumb]:appearance-none
    [&::-moz-range-thumb]:bg-black
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:h-4
    [&::-moz-range-thumb]:w-4
    [&::-moz-range-thumb]:border
    [&::-moz-range-thumb]:border-gray-400"
                            />
                            <input
                              type="range"
                              min={minDuration}
                              max={maxDuration}
                              value={durationRange[1]}
                              onChange={(e) => {
                                const val = Math.max(
                                  Number(e.target.value),
                                  durationRange[0] + 1
                                );
                                setDurationRange([durationRange[0], val]);
                              }}
                              className=" absolute w-full h-[1px] appearance-none bg-transparent z-20 
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:bg-black
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:border
    [&::-webkit-slider-thumb]:border-gray-400

    [&::-moz-range-thumb]:appearance-none
    [&::-moz-range-thumb]:bg-black
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:h-4
    [&::-moz-range-thumb]:w-4
    [&::-moz-range-thumb]:border
    [&::-moz-range-thumb]:border-gray-400"
                            />
                          </div>
                          <span className="text-md whitespace-nowrap">
                            {formatDuration(durationRange[1])}
                          </span>
                        </div>
                      </div>
                      {/* Stops */}
                      <div>
                        <h3 className="font-bold text-gray-800 mb-2">Stops</h3>
                        <div className="flex flex-col gap-2">
                          {Object.keys(stopMap).map((stop) => (
                            <label
                              key={stop}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedStops.includes(stop)}
                                onChange={() =>
                                  handleFilterChange("stops", stop)
                                }
                                className="accent-[#00b4d8]"
                              />
                              <span className="text-gray-700">{stop}</span>
                              <span className="ml-auto text-xs text-gray-500">
                                {stopMap[stop] !== Number.POSITIVE_INFINITY
                                  ? formatPrice(
                                      Math.ceil(stopMap[stop]) *
                                        (exchangeRates[selectedCurrency] || 1),
                                      selectedCurrency
                                    )
                                  : "-"}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {/* Airlines */}
                      <div>
                        <h3 className="font-bold text-gray-800 mb-2">
                          Airlines
                        </h3>
                        <div className="flex flex-col gap-2">
                          {allAirlines.map((airline) => (
                            <label
                              key={airline}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedAirlines.includes(airline)}
                                onChange={() =>
                                  handleFilterChange("airlines", airline)
                                }
                                className="accent-[#00b4d8]"
                              />
                              <span className="text-gray-700">{airline}</span>
                              <span className="ml-auto text-xs text-gray-500">
                                {formatPrice(
                                  Math.ceil(airlineMap[airline]) *
                                    (exchangeRates[selectedCurrency] || 1),
                                  selectedCurrency
                                )}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {/* Airports */}
                      <div>
                        <h3 className="font-bold text-gray-800 mb-2">
                          Airports
                        </h3>
                        <div className="flex flex-col gap-2">
                          {allAirports.map((airport) => (
                            <label
                              key={airport}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedAirports.includes(airport)}
                                onChange={() =>
                                  setSelectedAirports((prev) =>
                                    prev.includes(airport)
                                      ? prev.filter((a) => a !== airport)
                                      : [...prev, airport]
                                  )
                                }
                                className="accent-[#00b4d8]"
                              />
                              <span className="text-gray-700">{airport}</span>
                              <span className="ml-auto text-xs text-gray-500">
                                {formatPrice(
                                  Math.ceil(airportMap[airport]) *
                                    (exchangeRates[selectedCurrency] || 1),
                                  selectedCurrency
                                )}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {/* Cabin Class */}
                      <div>
                        <h3 className="font-bold text-gray-800 mb-2">
                          Cabin Class
                        </h3>
                        <div className="flex flex-col gap-2">
                          {allCabins.map((cabin) => (
                            <label
                              key={cabin}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedCabin.includes(cabin)}
                                onChange={() =>
                                  handleFilterChange("cabin", cabin)
                                }
                                className="accent-[#00b4d8]"
                              />
                              <span className="text-gray-700">{cabin}</span>
                              <span className="ml-auto text-xs text-gray-500">
                                {formatPrice(
                                  Math.ceil(cabinMap[cabin]) *
                                    (exchangeRates[selectedCurrency] || 1),
                                  selectedCurrency
                                )}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {/* Baggage */}
                      <div>
                        <h3 className="font-bold text-gray-800 mb-2">
                          Baggage
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-700">Carry-on bag</span>
                          <button
                            onClick={() => setCarryOn(Math.max(0, carryOn - 1))}
                            className="px-2 py-1 bg-gray-200 rounded"
                          >
                            -
                          </button>
                          <span className="px-2">{carryOn}</span>
                          <button
                            onClick={() => setCarryOn(carryOn + 1)}
                            className="px-2 py-1 bg-gray-200 rounded"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-700">Checked bag</span>
                          <button
                            onClick={() =>
                              setCheckedBag(Math.max(0, checkedBag - 1))
                            }
                            className="px-2 py-1 bg-gray-200 rounded"
                          >
                            -
                          </button>
                          <span className="px-2">{checkedBag}</span>
                          <button
                            onClick={() => setCheckedBag(checkedBag + 1)}
                            className="px-2 py-1 bg-gray-200 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {/* Additional Filters */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={seatSelection}
                            onChange={(e) => setSeatSelection(e.target.checked)}
                            className="accent-blue-600"
                            id="seatSelection"
                          />
                          <label
                            htmlFor="seatSelection"
                            className="text-gray-700"
                          >
                            Seat Selection Allowed
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={bagsRecheck}
                            onChange={(e) => setBagsRecheck(e.target.checked)}
                            className="accent-blue-600"
                            id="bagsRecheck"
                          />
                          <label
                            htmlFor="bagsRecheck"
                            className="text-gray-700"
                          >
                            Bags Recheck Required
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={passportRequired}
                            onChange={(e) =>
                              setPassportRequired(e.target.checked)
                            }
                            className="accent-blue-600"
                            id="passportRequired"
                          />
                          <label
                            htmlFor="passportRequired"
                            className="text-gray-700"
                          >
                            Passport Required
                          </label>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
              <div className="flex-1" onClick={() => setFilterOpen(false)} />
            </div>
          )}

          {/* ---- MAIN CONTENT ---- */}
          <main className="flex-1">
            <div className="max-w-7xl mx-auto space-y-3">
              {/* Header */}
              <div className="w-full max-w-7xl shadow-lg rounded-lg">
                <div className="bg-[#011b3f] text-white p-2 rounded-lg mb-4 hidden sm:block">
                  <div className="flex items-center gap-2 text-lg font-medium">
                    <span>{flightSearchParams.fromname}</span>
                    <span>→</span>
                    <span>{flightSearchParams.toname}</span>
                    <span className="ml-4">Select Flight</span>
                  </div>
                </div>

                {/* Sort Cards */}
                <div className="w-full">
                  {/* Mobile Filter Buttons */}
                  <div className="flex md:hidden items-center justify-center gap-3 px-4 py-3 border-b border-gray-200">
                    <button
                      onClick={() => setSortBy("cheapest")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                        sortBy === "cheapest"
                          ? "border-[#0a3a7a] bg-white text-[#0a3a7a]"
                          : "border-gray-300 bg-white text-gray-600"
                      }`}
                    >
                      <img
                        src="/fIcon1.png"
                        alt="Cheapest"
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">Cheapest</span>
                    </button>

                    <button
                      onClick={() => setSortBy("quickest")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                        sortBy === "quickest"
                          ? "border-[#0a3a7a] bg-white text-[#0a3a7a]"
                          : "border-gray-300 bg-white text-gray-600"
                      }`}
                    >
                      <img
                        src="/fIcon2.png"
                        alt="Quickest"
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">Quickest</span>
                    </button>

                    <button
                      onClick={() => setSortBy("best")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                        sortBy === "best"
                          ? "border-[#0a3a7a] bg-white text-[#0a3a7a]"
                          : "border-gray-300 bg-white text-gray-600"
                      }`}
                    >
                      <img src="/fIcon3.png" alt="Best" className="w-4 h-4" />
                      <span className="text-sm font-medium">Best</span>
                    </button>
                  </div>

                  {/* Desktop Sort Cards - Existing Code */}
                  <div className="hidden md:grid md:grid-cols-3 md:gap-2 p-4">
                    <button
                      onClick={() => setSortBy("cheapest")}
                      className={`p-6 rounded-lg border-2 transition-all duration-200 text-left min-w-[160px] ${
                        sortBy === "cheapest"
                          ? "border-blue-500 bg-[#ddf9ff] shadow-lg"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Image
                          src="/flightIcon.png"
                          alt="Flight Icon"
                          width={18}
                          height={18}
                        />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Cheapest
                        </h3>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 ml-4">
                        {prices.length > 0
                          ? `From ${formatPrice(
                              Math.ceil(minPrice) *
                                (exchangeRates[selectedCurrency] || 1),
                              selectedCurrency
                            )}`
                          : ""}
                      </div>
                    </button>
                    <button
                      onClick={() => setSortBy("quickest")}
                      className={`p-6 rounded-lg border-2 transition-all duration-200 text-left min-w-[160px] ${
                        sortBy === "quickest"
                          ? "border-blue-500 bg-[#ddf9ff] shadow-lg"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Image
                          src="/flightIcon.png"
                          alt="Flight Icon"
                          width={18}
                          height={18}
                        />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Quickest
                        </h3>
                      </div>
                      <div className="text-xs text-gray-500 mt-1  ml-4">
                        {durations.length > 0
                          ? `From ${formatDuration(minDuration)}`
                          : ""}
                      </div>
                    </button>
                    <button
                      onClick={() => setSortBy("best")}
                      className={`p-6 rounded-lg border-2 transition-all duration-200 text-left min-w-[160px] ${
                        sortBy === "best"
                          ? "border-blue-500 bg-[#ddf9ff] shadow-lg"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Image
                          src="/flightIcon.png"
                          alt="Flight Icon"
                          width={18}
                          height={18}
                        />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Best
                        </h3>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 ml-4">
                        {prices.length > 0
                          ? `From ${formatPrice(
                              Math.ceil(minPrice) *
                                (exchangeRates[selectedCurrency] || 1),
                              selectedCurrency
                            )}`
                          : ""}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* ---- TICKETS ---- */}
              {sortedTickets.map((ticket, idx) => {
                // Separate outbound and return segments
                const outboundSegments = ticket.segments.filter(
                  (seg) => seg.type === "outbound"
                );
                const returnSegments = ticket.segments.filter(
                  (seg) => seg.type === "return"
                );

                // Calculate outbound details
                const outboundDuration = outboundSegments.reduce(
                  (total, seg) => total + seg.flightDuration,
                  0
                );
                const outboundStops = outboundSegments.length - 1;
                const outboundStopsText =
                  outboundStops === 0
                    ? "Non Stop"
                    : `${outboundStops} stop${outboundStops > 1 ? "s" : ""}`;

                // Calculate return details (only if round-trip)
                const returnDuration = returnSegments.reduce(
                  (total, seg) => total + seg.flightDuration,
                  0
                );
                const returnStops = returnSegments.length - 1;
                const returnStopsText =
                  returnStops === 0
                    ? "Non Stop"
                    : `${returnStops} stop${returnStops > 1 ? "s" : ""}`;

                return (
                  <Card
                    key={ticket.id || idx}
                    className="p-6 bg-white  hover:bg-[#e6f2ff] transition-colors duration-200"
                  >
                    {/* Desktop Layout (lg and above) */}
                    <div className="hidden lg:flex items-center justify-between gap-4">
                      {/* Left: Airline Logo */}
                      <div className="flex flex-wrap items-center gap-2 min-w-[100px] max-w-[120px]">
                        <span className="font-medium text-gray-700 text-sm break-words">
                          {ticket.airline}
                        </span>
                      </div>

                      {/* Center: Flight Route - Outbound */}
                      {outboundSegments.length > 0 && (
                        <div className="flex items-center gap-4 flex-1">
                          {/* Departure Time */}
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 whitespace-nowrap">
                              {formatTime(outboundSegments[0].departureTime)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {outboundSegments[0].departureAirport}
                            </div>
                          </div>

                          {/* Flight Path Line */}
                          <div className="flex-1 flex flex-col items-center min-w-[60px] max-w-[200px]">
                            <div className="text-xs text-gray-500 mb-1">
                              {formatDuration(outboundDuration)}
                            </div>
                            <div className="w-full relative flex items-center">
                              <div className="absolute left-0 w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                              <div className="w-full h-[1px] bg-gray-300"></div>
                              <div className="absolute right-0 w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {outboundStopsText}
                            </div>
                          </div>

                          {/* Arrival Time */}
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 whitespace-nowrap">
                              {formatTime(
                                outboundSegments[outboundSegments.length - 1]
                                  .arrivalTime
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {
                                outboundSegments[outboundSegments.length - 1]
                                  .arrivalAirport
                              }
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Right: Price and Button */}
                      <div className="flex flex-col items-end gap-2 min-w-[140px]">
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            Starting from
                          </div>
                          <div className="text-2xl font-bold text-gray-900 whitespace-nowrap">
                            {formatPrice(
                              Math.ceil(ticket.totalPrice) *
                                (exchangeRates[selectedCurrency] || 1),
                              selectedCurrency
                            )}
                          </div>
                        </div>
                        <Link href={`/Flight-booking/${ticket.id}`} passHref>
                          <Button
                            className="bg-[#0a3a7a] hover:bg-blue-800 text-white px-6 py-2 text-sm whitespace-nowrap"
                            onClick={() => {
                              if (ticket.token) {
                                localStorage.setItem(
                                  "flight_token",
                                  ticket.token
                                );
                                localStorage.setItem("api", "true");
                              } else {
                                localStorage.removeItem("flight_token");
                                localStorage.removeItem("api");
                              }
                            }}
                          >
                            View Fares
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Return Flight Desktop (if round-trip) */}
                    {ticket.tripType === "round-trip" &&
                      returnSegments.length > 0 && (
                        <div className="hidden lg:flex items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
                          <div className="min-w-[80px]"></div>

                          <div className="flex items-center gap-4 flex-1">
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900 whitespace-nowrap">
                                {formatTime(returnSegments[0].departureTime)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {returnSegments[0].departureAirport}
                              </div>
                            </div>

                            <div className="flex-1 flex flex-col items-center min-w-[60px] max-w-[200px]">
                              <div className="text-xs text-gray-500 mb-1">
                                {formatDuration(returnDuration)}
                              </div>
                              <div className="w-full relative flex items-center">
                                <div className="absolute left-0 w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                <div className="w-full h-[1px] bg-gray-300"></div>
                                <div className="absolute right-0 w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {returnStopsText}
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900 whitespace-nowrap">
                                {formatTime(
                                  returnSegments[returnSegments.length - 1]
                                    .arrivalTime
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {
                                  returnSegments[returnSegments.length - 1]
                                    .arrivalAirport
                                }
                              </div>
                            </div>
                          </div>

                          <div className="min-w-[140px]"></div>
                        </div>
                      )}

                    {/* Mobile Layout (below lg) - Vertical Card Style */}
                    <div className="lg:hidden flex flex-col">
                      {/* Airline Name at Top */}
                      <div className="text-center mb-4">
                        <span className="text-gray-900 text-xl font-medium ml-2">
                          {ticket.airline}
                        </span>
                      </div>

                      {/* Outbound Flight */}
                      {outboundSegments.length > 0 && (
                        <div className="flex flex-col items-center mb-6">
                          {/* Duration */}
                          <div className="text-gray-500 text-base mb-4">
                            {formatDuration(outboundDuration)}
                          </div>

                          {/* Times and Route */}
                          <div className="flex items-center justify-between w-full mb-2">
                            {/* Departure */}
                            <div className="text-left flex-1">
                              <div className="text-xl font-bold text-gray-900">
                                {formatTime(outboundSegments[0].departureTime)}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {new Date(
                                  outboundSegments[0].departureTime
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </div>

                            {/* Flight Line */}
                            <div className="flex-1 flex items-center justify-center px-4">
                              <div className="w-full relative flex items-center">
                                <div className="w-3 h-3 border-2 border-gray-400 rounded-full bg-white"></div>
                                <div className="flex-1 h-[2px] bg-gray-300"></div>
                                <div className="w-3 h-3 border-2 border-gray-400 rounded-full bg-white"></div>
                              </div>
                            </div>

                            {/* Arrival */}
                            <div className="text-right flex-1">
                              <div className="text-xl font-bold text-gray-900">
                                {formatTime(
                                  outboundSegments[outboundSegments.length - 1]
                                    .arrivalTime
                                )}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {new Date(
                                  outboundSegments[
                                    outboundSegments.length - 1
                                  ].arrivalTime
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Airport Codes */}
                          <div className="flex items-center justify-between w-full mb-4">
                            <div className="text-gray-500 text-base flex-1 text-left">
                              {outboundSegments[0].departureAirport}
                            </div>
                            <div className="flex-1"></div>
                            <div className="text-gray-500 text-base flex-1 text-right">
                              {
                                outboundSegments[outboundSegments.length - 1]
                                  .arrivalAirport
                              }
                            </div>
                          </div>

                          {/* Stops Info */}
                          <div className="text-gray-400 text-base mb-6">
                            {outboundStopsText}
                          </div>
                        </div>
                      )}

                      {/* Return Flight (if round-trip) */}
                      {ticket.tripType === "round-trip" &&
                        returnSegments.length > 0 && (
                          <div className="flex flex-col items-center mb-6 pt-6 border-t border-gray-200">
                            <div className="text-gray-500 text-base mb-4">
                              {formatDuration(returnDuration)}
                            </div>

                            <div className="flex items-center justify-between w-full mb-2">
                              <div className="text-left flex-1">
                                <div className="text-4xl font-bold text-gray-900">
                                  {formatTime(returnSegments[0].departureTime)}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {new Date(
                                    returnSegments[0].departureTime
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              </div>

                              <div className="flex-1 flex items-center justify-center px-4">
                                <div className="w-full relative flex items-center">
                                  <div className="w-3 h-3 border-2 border-gray-400 rounded-full bg-white"></div>
                                  <div className="flex-1 h-[2px] bg-gray-300"></div>
                                  <div className="w-3 h-3 border-2 border-gray-400 rounded-full bg-white"></div>
                                </div>
                              </div>

                              <div className="text-right flex-1">
                                <div className="text-4xl font-bold text-gray-900">
                                  {formatTime(
                                    returnSegments[returnSegments.length - 1]
                                      .arrivalTime
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {new Date(
                                    returnSegments[
                                      returnSegments.length - 1
                                    ].arrivalTime
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between w-full mb-4">
                              <div className="text-gray-500 text-base flex-1 text-left">
                                {returnSegments[0].departureAirport}
                              </div>
                              <div className="flex-1"></div>
                              <div className="text-gray-500 text-base flex-1 text-right">
                                {
                                  returnSegments[returnSegments.length - 1]
                                    .arrivalAirport
                                }
                              </div>
                            </div>

                            <div className="text-gray-400 text-base mb-6">
                              {returnStopsText}
                            </div>
                          </div>
                        )}

                      {/* Price Section */}
                      <div className="text-center mb-4">
                        <div className="text-gray-500 text-sm mb-1">
                          Starting from
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-gray-600 text-lg">
                            {selectedCurrency}
                          </span>
                          <span className="text-xl font-bold text-gray-900">
                            {formatPrice(
                              Math.ceil(ticket.totalPrice) *
                                (exchangeRates[selectedCurrency] || 1),
                              selectedCurrency
                            ).replace(/[^0-9,]/g, "")}
                          </span>
                        </div>
                      </div>

                      {/* View Fares Button */}
                      <Link href={`/Flight-booking/${ticket.id}`} passHref>
                        <Button
                          className="w-full bg-[#0a3a7a] hover:bg-blue-800 text-white py-4 text-base"
                          onClick={() => {
                            if (ticket.token) {
                              localStorage.setItem(
                                "flight_token",
                                ticket.token
                              );
                              localStorage.setItem("api", "true");
                            } else {
                              localStorage.removeItem("flight_token");
                              localStorage.removeItem("api");
                            }
                          }}
                        >
                          View Fares
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}

              {/* ---- EMPTY STATE ---- */}
              {sortedTickets.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">
                    No flights match your current filters
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStops([]);
                      setSelectedAirlines([]);
                      setSelectedCabin([]);
                      setSelectedAirports([]);
                      setPriceRange([minPrice, maxPrice]);
                      setDurationRange([minDuration, maxDuration]);
                      setCarryOn(0);
                      setCheckedBag(0);
                      setSeatSelection(false);
                      setBagsRecheck(false);
                      setPassportRequired(false);
                    }}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
