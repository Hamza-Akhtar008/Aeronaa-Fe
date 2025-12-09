
"use client"
import HotelFiltersSidebar from "@/components/hotels/HotelFiltersSidebar";
import { useEffect, useMemo, useState, useCallback, HtmlHTMLAttributes } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Filter, ChevronDown, ChevronUp,  Loader2 } from "lucide-react"
import HotelsLoading from "@/components/hotels/HotelsLoading";
import HotelsError from "@/components/hotels/HotelsError";
import HotelsSearchBar from "@/components/hotels/HotelsSearchBar";
import { motion } from "framer-motion"
import {  formatPrice } from "@/lib/utils/currency"
import HotelsNoResults from "@/components/hotels/HotelsNoResults";
import HotelsLoadMore from "@/components/hotels/HotelsLoadMore";


import Filters from "@/components/home/Filters"
// import { SigninSiteHeader } from "@/components/signin-header"
import type { CityResult, SearchInputs } from "@/components/home/search/types"
import type { FilterItem, ApiFilterState, FilterState, LoadingState } from "@/types/hotels";
import { GetHotels } from "@/lib/api"
import axios from "axios"
import mapHotelToAPI from "@/components/hotels/mapHotelToAPI"
import { getReviewRatingRange, getDistanceFromCityCenter, formatDate, convertPrice } from "@/lib/utils/hotelUtils";
import { getCurrencyByLocation } from "@/lib/utils/location-currency";
import { useHotelFilters } from "@/hooks/useHotelFilters";
import { useHotelSort } from "@/hooks/useHotelSort";
import HotelCard from "@/components/hotels/HotelCard";
import type { HotelAPI } from "@/types/hotels";
import { SortBar } from "@/components/hotels/SortBar"
import { MobileControls } from "@/components/mobile-controls";
import EmbeddedMap from "@/components/embeddedmap";

// Types


export default function OptimizedHotelResults() {
  // ...existing code...
  
  // List/Grid toggle state
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showMobileSort, setShowMobileSort] = useState(false)
  // Force grid view on mobile devices
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // sm breakpoint
        setViewMode('grid');
      }
    };
    
    // Set initial view mode based on screen size
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const searchParams = useSearchParams()
  const city = searchParams?.get("city") || "Mumbai";
  const checkIn = searchParams?.get("checkIn") || new Date().toISOString().split("T")[0];
  const checkOut = searchParams?.get("checkOut") || new Date(Date.now() + 86400000).toISOString().split("T")[0];

  // State declarations (single source of truth)
  const [hotels, setHotels] = useState<any[]>([]);
  const [hotelOffers, setHotelOffers] = useState<HotelAPI[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ initial: true, filtering: false, loadingMore: false });
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);  
  // Currency conversion state
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 });

  // Detect country and currency from localStorage/sessionStorage
  useEffect(() => {
    let country = localStorage.getItem("userCountry") || localStorage.getItem("usercountry") || sessionStorage.getItem("userCountry") || sessionStorage.getItem("usercountry");
    if (country) {
      const currency = getCurrencyByLocation(country);
      setSelectedCurrency(currency);
    } else {
      setSelectedCurrency("USD");
    }
  }, []);

  // Fetch exchange rates for selected currency
  useEffect(() => {
    if (selectedCurrency === "USD") {
      setExchangeRates({ USD: 1 });
      return;
    }
    const fetchRates = async () => {
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        const data = await response.json();
        setExchangeRates({ ...data.rates, USD: 1 });
      } catch (error) {
        setExchangeRates({ USD: 1 });
      }
    };
    fetchRates();
  }, [selectedCurrency]);


  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(null);
  const [search, setSearch] = useState<SearchInputs>();
  const [searchValue, setSearchValue] = useState("");
  const [basePriceRange, setBasePriceRange] = useState<[number, number]>([0, 100000]);
  const [apiFilters, setApiFilters] = useState<ApiFilterState>({
    propertyType: [],
    facilities: [],
    neighborhoods: [],
    roomOffers: [],
    roomAmenities: [],
    somethingSpecial: [],
    neighborhoodId: "",
    propertyTypeIds: [],
    facilityIds: [],
    roomOfferIds: [],
    roomAmenityIds: [],
    somethingSpecialIds: [],
  });
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100000],
    selectedReviewRatings: [],
    reviewScoreRange: [0, 10],
    propertyTypes: [],
    hasDeals: false,
    distanceFromCenter: 50,
    reviewCountMin: 0,
  });
  const [cityCoords, setCityCoords] = useState({ lat: 51.50739, lng: -0.12763432 });

  // Fetch exchange rates
  // Currency conversion logic removed

  // Load initial data using imported handler (must be at top level)
  useEffect(() => {
    import("@/lib/utils/hotelHandlers").then(({ loadInitialData }) => {
      loadInitialData(
        setLoading,
        setError,
        setSearch,
        setSelectedCity,
        setCityCoords,
        setHotelOffers,
        setApiFilters,
        setHotels,
        setBasePriceRange,
        setFilters,
        city,
        checkIn,
        checkOut,
        selectedCurrency
      );
    });
  }, [city]);


  // formatDate and convertPrice are now imported from hotelUtils

  // Currency conversion logic removed

  // Distance calculation is now imported from hotelUtils


  // (Removed duplicate initial data loading logic)

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      if (selectedCurrency === "USD") return

      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
        const data = await response.json()
        setExchangeRates({ ...data.rates, USD: 1 })
      } catch (error) {
        console.error("Error fetching exchange rates:", error)
        setExchangeRates({ USD: 1 })
      }
    }

    fetchRates()
  }, [selectedCurrency])

  // Update price range when currency changes
  // Currency conversion logic removed

  // Filtering and sorting logic moved to custom hooks
  const filteredHotels = useHotelFilters({
    hotelOffers,
    filters,
    searchValue,
    exchangeRates,
    selectedCurrency,
    cityCoords,
  });
  const sortedHotels = useHotelSort({ hotels: filteredHotels, sortBy, cityCoords });

  // Filter update functions
  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleApiFilterSelect = useCallback(
    (key: keyof ApiFilterState, value: any) => {
      setApiFilters((prev) => ({ ...prev, [key]: value }))
      fetchFilteredData({ ...apiFilters, [key]: value })
    },
    [apiFilters],
  )

  const handleApiFilterCheckbox = useCallback((key: keyof ApiFilterState, value: string | number) => {
    setApiFilters((prev) => {
      const currentValues = Array.isArray(prev[key]) ? (prev[key] as (string | number)[]) : []
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]

      const updatedFilter = { ...prev, [key]: updatedValues }
      fetchFilteredData(updatedFilter)
      return updatedFilter
    })
  }, [])

  // Fetch filtered data
  const fetchFilteredData = useCallback(
    async (filterData: ApiFilterState) => {
      setLoading((prev) => ({ ...prev, filtering: true }))

      try {
        const searchResults = sessionStorage.getItem("searchResults")
        if (!searchResults) return

        const parsed = JSON.parse(searchResults)

        // Parse adults from travelers string
        let adults = 2;
        if (parsed.search.travelers) {
          const adultsMatch = String(parsed.search.travelers).match(/(\d+) adults/);
          adults = adultsMatch ? parseInt(adultsMatch[1], 10) : 2;
        }
        const response = await axios.get("https://agoda-com.p.rapidapi.com/hotels/search-overnight", {
          params: {
            id: parsed.search.id,
            checkinDate: parsed.search.checkIn,
            checkoutDate: parsed.search.checkOut,
            limit: 100,
            adult: adults,
            room: parsed.search.rooms,
            neighborhoods: filterData.neighborhoodId,
            propertyType: Array.isArray(filterData.propertyTypeIds) ? filterData.propertyTypeIds.join(",") : "",
            facilities: Array.isArray(filterData.facilityIds) ? filterData.facilityIds.join(",") : "",
            roomOffers: Array.isArray(filterData.roomOfferIds) ? filterData.roomOfferIds.join(",") : "",
            roomAmenities: Array.isArray(filterData.roomAmenityIds) ? filterData.roomAmenityIds.join(",") : "",
            somethingSpecial: Array.isArray(filterData.somethingSpecialIds)
              ? filterData.somethingSpecialIds.join(",")
              : "",
            page: 1,
            language: "en-us",
            currency: "USD",
          },
          headers: {
            "x-rapidapi-key": "7f66331876msh5a86fb2ce181b4dp1b2f48jsn8db63f8e12d9",
            "x-rapidapi-host": "agoda-com.p.rapidapi.com",
          },
        })

        const mappedHotels = response.data.data.properties
          .map(mapHotelToAPI)
          .filter((hotel: HotelAPI | undefined) => hotel !== undefined)

        setHotelOffers(mappedHotels)
        setPage(1) // Reset page
        setHasMore(true)
      } catch (error) {
        console.error("Error fetching filtered data:", error)
      } finally {
        setLoading((prev) => ({ ...prev, filtering: false }))
      }
    },
    [mapHotelToAPI],
  )

  // Load more hotels
  const loadMoreHotels = useCallback(async () => {
    if (loading.loadingMore || !hasMore) return

    setLoading((prev) => ({ ...prev, loadingMore: true }))

    try {
      const searchResults = sessionStorage.getItem("searchResults")
      if (!searchResults) {
        console.error("No search results found in sessionStorage");
        setHasMore(false);
        return;
      }

      const parsed = JSON.parse(searchResults)
      
      if (!parsed.search || !parsed.search.id || !parsed.search.typeName) {
        console.error("Missing required search parameters:", parsed.search);
        setHasMore(false);
        return;
      }

      // Parse adults from travelers string
      let adults = 2;
      if (parsed.search.travelers) {
        const adultsMatch = String(parsed.search.travelers).match(/(\d+) adults/);
        adults = adultsMatch ? parseInt(adultsMatch[1], 10) : 2;
      }
      
      console.log("Fetching more hotels with params:", {
        typeName: parsed.search.typeName, 
        id: parsed.search.id,
        page: page + 1
      });
      
      const response = await axios.get("https://agoda-com.p.rapidapi.com/hotels/search-overnight", {
        params: {
          typeName: parsed.search.typeName,
          id: parsed.search.id,
          checkinDate: parsed.search.checkIn,
          checkoutDate: parsed.search.checkOut,
          limit: 30,
          adult: adults,
          room_qty: parsed.search.rooms,
          neighborhoods: apiFilters.neighborhoodId,
          propertyType: Array.isArray(apiFilters.propertyTypeIds) ? apiFilters.propertyTypeIds.join(",") : "",
          facilities: Array.isArray(apiFilters.facilityIds) ? apiFilters.facilityIds.join(",") : "",
          roomOffers: Array.isArray(apiFilters.roomOfferIds) ? apiFilters.roomOfferIds.join(",") : "",
          roomAmenities: Array.isArray(apiFilters.roomAmenityIds) ? apiFilters.roomAmenityIds.join(",") : "",
          somethingSpecial: Array.isArray(apiFilters.somethingSpecialIds)
            ? apiFilters.somethingSpecialIds.join(",")
            : "",
          page: page + 1,
          language: "en-us",
          currency: "USD",
        },
        headers: {
          "x-rapidapi-key": "7f66331876msh5a86fb2ce181b4dp1b2f48jsn8db63f8e12d9",
          "x-rapidapi-host": "agoda-com.p.rapidapi.com",
        },
      })

      // Calculate number of days for price calculation
      const checkInDate = new Date(parsed.search?.checkIn);
      const checkOutDate = new Date(parsed.search?.checkOut);
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const numberOfDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      
      console.log(`Received ${response.data.data.properties?.length || 0} properties from API, page ${page + 1}`);
      
      // Map hotels using the numberOfDays for accurate pricing
      const newHotels = (response.data.data.properties || [])
        .map((hotel: any) => mapHotelToAPI(hotel, numberOfDays))
        .filter((hotel: HotelAPI | undefined) => hotel !== undefined);
      
      console.log(`Mapped ${newHotels.length} valid hotels`);

      if (newHotels.length === 0) {
        console.warn("No more hotels available");
        setHasMore(false);
      } else {
        // Add the new hotels to our state
        setHotelOffers((prev) => [...prev, ...newHotels]);
        setPage((prev) => prev + 1);
        
        // Update the search results in sessionStorage with the new hotels
        try {
          const updatedResults = JSON.parse(searchResults);
          updatedResults.hotels = [...updatedResults.hotels, ...response.data.data.properties];
          sessionStorage.setItem("searchResults", JSON.stringify(updatedResults));
        } catch (e) {
          console.error("Error updating search results:", e);
        }
      }
    } catch (error) {
      console.error("Error loading more hotels:", error)
      setHasMore(false)
    } finally {
      setLoading((prev) => ({ ...prev, loadingMore: false }))
    }
  }, [loading.loadingMore, hasMore, page, apiFilters, mapHotelToAPI])

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      priceRange: basePriceRange,
      selectedReviewRatings: [],
      reviewScoreRange: [0, 10],
      propertyTypes: [],
      hasDeals: false,
      distanceFromCenter: 50,
      reviewCountMin: 0,
    })

    setApiFilters((prev) => ({
      ...prev,
      neighborhoodId: "",
      propertyTypeIds: [],
      facilityIds: [],
      roomOfferIds: [],
      roomAmenityIds: [],
      somethingSpecialIds: [],
    }))

    // Trigger a fresh search with cleared filters
    fetchFilteredData({
      ...apiFilters,
      neighborhoodId: "",
      propertyTypeIds: [],
      facilityIds: [],
      roomOfferIds: [],
      roomAmenityIds: [],
      somethingSpecialIds: [],
    })
  }, [basePriceRange, apiFilters, fetchFilteredData])

  // Get available property types
  const availablePropertyTypes = useMemo(() => {
    const types = hotelOffers.map((h) => h.property.propertyClass || 0).filter((t) => t > 0)
    return [...new Set(types)].sort((a, b) => b - a)
  }, [hotelOffers])

  // Calculate converted price range for filters sidebar
  const convertedPriceRange = useMemo<[number, number]>(() => {
    const min = basePriceRange[0]
    const max = basePriceRange[1]

   
    const rate = exchangeRates[selectedCurrency] || 1;
    return [Math.round(min ), Math.round(max)];
  }, [basePriceRange, exchangeRates, selectedCurrency]);

  // Review rating labels
  const reviewRatingLabels = {
    5: "Excellent (9.0+)",
    4: "Very Good (8.0-8.9)",
    3: "Good (7.0-7.9)",
    2: "Fair (6.0-6.9)",
    1: "Poor (Below 6.0)",
  }
  // ...existing code...

  const handleInputChange = (event:any) => {
    setSearchValue(event.target.value);
  };

  if (loading.initial) {
    return <HotelsLoading />;
  }

  const GoldStar = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#FFD700"
  >
    <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.402 8.174L12 18.896l-7.336 3.861 
             1.402-8.174L.132 9.211l8.2-1.193L12 .587z"/>
  </svg>
);

  return (

    <div className="min-h-screen   bg-[#fafbfc]">
      {/* <SigninSiteHeader /> */}
      
        <div className="z-50 ">
          <Filters
            initialValues={search ?? {}}
            selectedCity={selectedCity ?? undefined}
           
            onTabChange={undefined}
            tabsRef={undefined}
          />
        </div>
    <div className="w-full max-w-[101rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4">
      {/* Sticky Filters at the top of the hotels page */}

      {/* Property count and view toggle */}

      <div className="flex flex-col  rounded-lg  w-full lg:gap-4 mb-3">
        <div className="hidden lg:flex flex-col lg:flex-row items-start lg:items-center  w-full">
          <HotelsSearchBar value={searchValue} onChange={handleInputChange} />
          <div className="flex-1" />
          <SortBar sortBy={sortBy} setSortBy={setSortBy} />

            <div className="hidden sm:flex items-center w-full sm:w-auto">
            <div className="flex bg-gray-200 rounded-full p-1 transition-all w-full sm:w-auto">
           
            <button
                className={`flex-1 sm:flex-none px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none ${viewMode === 'grid' ? 'bg-white shadow text-gray-800' : 'bg-transparent text-gray-500'}`}
                onClick={() => setViewMode('grid')}
                type="button"
              >
                Grid
              </button>
              <button
                className={`flex-1 sm:flex-none px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none ${viewMode === 'list' ? 'bg-white shadow text-gray-800' : 'bg-transparent text-gray-500'}`}
                onClick={() => setViewMode('list')}
                type="button"
              >
                List
              </button>
             
            </div>
          </div>

          
        </div>

        <MobileControls
          onSearchOpen={showMobileSearch}
          setOnSearchOpen={setShowMobileSearch}
          onSortOpen={showMobileSort}
          setOnSortOpen={setShowMobileSort}
          searchValue={searchValue}
          onSearchChange={handleInputChange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          SearchBarComponent={<HotelsSearchBar value={searchValue} onChange={handleInputChange} />}
          SortBarComponent={<SortBar sortBy={sortBy} setSortBy={setSortBy} />}
          FiltersComponent={  <HotelFiltersSidebar
              showFilters={showFilters}
              convertedPriceRange={convertedPriceRange}
              filters={filters}
              updateFilter={updateFilter}
              selectedCurrency={selectedCurrency}
              availablePropertyTypes={availablePropertyTypes}
              apiFilters={apiFilters}
              handleApiFilterSelect={handleApiFilterSelect}
              handleApiFilterCheckbox={handleApiFilterCheckbox}
              clearFilters={clearFilters}
              exchangeRates={exchangeRates}
            />}
          setOnFiltersOpen={setShowFilters}
          onFiltersOpen={showFilters}



        />
    
      </div>

      {error ? (
        <HotelsError error={error} onRetry={() => window.location.reload()} />
      ) : (
        <div className="flex flex-col lg:flex-row w-full">
          {/* Mobile Filter Toggle */}
         

          {/* Filter Panel */}
          <div className="w-full lg:w-3/12  lg:pr-6 mb-6 lg:mb-0">
            <HotelFiltersSidebar
              showFilters={showFilters}
              convertedPriceRange={convertedPriceRange}
              filters={filters}
              updateFilter={updateFilter}
              selectedCurrency={selectedCurrency}
              availablePropertyTypes={availablePropertyTypes}
              apiFilters={apiFilters}
              handleApiFilterSelect={handleApiFilterSelect}
              handleApiFilterCheckbox={handleApiFilterCheckbox}
              clearFilters={clearFilters}
              exchangeRates={exchangeRates}
            />
          </div>

          {/* Hotels List */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1 "
          >
            {/* Loading State for Filtering */}
            {loading.filtering && (
              <div className="text-center py-10">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#00afd5]" />
                <p className="mt-2 text-[#024891] font-medium">Applying filters...</p>
              </div>
            )}

            {/* Our Hotels */}
            {hotels.length > 0 && (

              viewMode === 'list' ? (
                 <div className="flex flex-col gap-4 lg:gap-6">
                  {hotels.map((hotel, index) => {
  const {
    id,
    name,
    starRating,
    images,
    averagePrice,
    checkInTime,
    checkOutTime,
    city,
    Address,
    amenities = [],
    description,
    country,
    state,
    zipCode,
  } = hotel;

  let _nights = null;
  if (_nights == null) {
    const from = checkIn;
    const to = checkOut;
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      _nights = Math.max(1, Math.round((toDate - fromDate) / (1000 * 60 * 60 * 24)));
    } else {
      _nights = 1;
    }
  }

  const reviewScore = parseInt(starRating) + 5 || 0;
  const reviewCount = hotel.reviews ?? 0;
  const photo = images?.length ? images[0] : null;
  const address = Address ?? "Not available";
  const price = Number(averagePrice) * _nights;

  const convertPrice = (val: number) => val * (exchangeRates[selectedCurrency] || 1);

  const getReviewLabel = (score: number) => {
    if (score >= 9) return "Excellent";
    if (score >= 8) return "Very Good";
    if (score >= 7) return "Good";
    if (score >= 6) return "Fair";
    return "Poor";
  };

  const getReviewRatingRange = (score: number) => {
    if (score >= 9) return "9+";
    if (score >= 8) return "8–9";
    if (score >= 7) return "7–8";
    return "<7";
  };

  return (
<motion.div
  key={id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: index * 0.05 }}
  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col lg:flex-row w-full hover:shadow-xl transition-all duration-200"
>
  <Link
    href={{
      pathname: `/detailed/${id}`,
      query: { checkin: checkInTime, checkout: checkOutTime },
    }}
    target="_blank"
    className="flex w-full"
   onClick={async() => { 
   await sessionStorage.setItem('firstroomprice',"0");

    const channel = new BroadcastChannel("session-sync");

    // Serialize sessionStorage to plain object
    const sessionData: Record<string, string> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) sessionData[key] = sessionStorage.getItem(key) as string;
    }

    // Send to other tabs
    channel.postMessage({ type: "SYNC_SESSION", data: sessionData });

    // Receive from other tabs
    channel.onmessage = (e) => {
      if (e.data.type === "SYNC_SESSION") {
        for (const key in e.data.data) {
          sessionStorage.setItem(key, e.data.data[key]);
        }
      }
    };

    // Mirror some important keys to localStorage
    ["searchResults", "selectedCity", "userCountry", "usercountry"].forEach((key) => {
      const val = sessionStorage.getItem(key);
      if (val) localStorage.setItem(key, val);
    });
  }}
  >
    {/* IMAGE */}
    <div className="relative w-full lg:w-56 lg:min-w-[220px] h-48 lg:h-full overflow-hidden flex-shrink-0 rounded-t-2xl lg:rounded-l-2xl">
      {photo ? (
        <Image src={photo} alt={name} fill className="object-cover h-full w-full" />
      ) : (
        <div className="bg-gray-200 h-full w-full flex items-center justify-center text-gray-500">
          <p>No image</p>
        </div>
      )}

      {/* Mobile Price Badge */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 lg:hidden">
        <div className="text-sm font-bold text-[#024891]">
          {formatPrice(convertPrice(price), selectedCurrency)}
        </div>
        <div className="text-xs text-gray-500">per night</div>
      </div>
    </div>

    {/* INFO */}
    <div className="flex flex-1 flex-col justify-between p-4 gap-3">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#024891] font-semibold text-base lg:text-lg line-clamp-1">{name}</span>
            <span className="ml-2 px-2 py-0.5 text-xs rounded border border-gray-200 bg-gray-50 font-medium text-gray-700">Featured</span>
          </div>
       {address && (
        
       < EmbeddedMap name={name}  address={address}/>
          
        )}

          {/* Stars */}
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: starRating || 0 }, (_, i) => (
              <GoldStar key={i} size={14} />
            ))}
          </div>

          {/* Minimal tags/amenities */}
          <div className="flex flex-wrap gap-2 mt-2">
            {_nights && <span className="px-2 py-1 text-xs bg-gray-100 rounded-full border border-gray-200">{_nights} nights</span>}
            {search?.travelers && <span className="px-2 py-1 text-xs bg-gray-100 rounded-full border border-gray-200">{search.travelers}</span>}
          </div>
        </div>

        {/* Rating Section */}
        <div className="flex flex-col items-start lg:items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">{getReviewLabel(reviewScore || 0)}</span>
            <span className="bg-[#024891] text-white px-2 py-1 rounded-lg font-bold text-sm">{reviewScore}</span>
          </div>
          <span className="text-xs text-gray-500">{reviewCount} reviews</span>
          <span className="text-sm text-gray-700">Comfort {getReviewRatingRange(reviewScore ?? 0)}</span>
        </div>
      </div>

      {/* Pricing + CTA */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mt-2">
        <div className="flex flex-col justify-end items-start lg:items-end flex-1">
          <div className="text-xl lg:text-2xl font-bold text-[#024891]">{formatPrice(convertPrice(price), selectedCurrency)}</div>
          <div className="text-xs text-gray-500">+ taxes and fees</div>
          <button className="mt-2 px-3 py-1 bg-[#024891] text-white rounded-lg font-medium shadow hover:bg-[#023e8a] transition-all w-full lg:w-auto">
            See availability
          </button>
        </div>
      </div>
    </div>
  </Link>
</motion.div>

  );
})}

                  </div>
              ):(

    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-2 mb-2 lg:gap-4">
  {hotels.map((hotel, index) => {
  const {
    id,
    name,
    starRating,
    images,
    averagePrice,
    checkInTime,
    checkOutTime,
    city,
    Address,
    amenities = [],
    description,
    country,
    state,
    zipCode,
  } = hotel;

  // ✅ Calculate nights
  let nights = 1;
  if (checkIn && checkOut) {
    const fromDate = new Date(checkIn);
    const toDate = new Date(checkOut);
    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
      nights = Math.max(1, Math.round((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)));
    }
  }

  // ✅ Derived values
  const reviewScore = parseInt(starRating) + 5 || 0;
  const reviewCount = hotel.reviews ?? 0;
  const photo = images?.length ? images[0] : null;
  const address = Address ?? "Not available";
  const price = Number(averagePrice) * nights;

  const convertPrice = (val: number) =>
    val * (exchangeRates[selectedCurrency] || 1);

  const getReviewLabel = (score: number) => {
  if (score >= 9) return "Excellent";
  if (score >= 8) return "Very Good";
  if (score >= 7) return "Good";
  if (score >= 6) return "Fair";
  return "Poor";
  };

  const getReviewRatingRange = (score: number) => {
    if (score >= 9) return "9+";
    if (score >= 8) return "8–9";
    if (score >= 7) return "7–8";
    return "<7";
  };

  const distance = Math.random() * 5; // optional mock value

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col w-full max-w-md mx-auto hover:bg-blue-200"
    >
      {/* 🏨 Image Section */}
      <div className="relative w-full h-40 sm:h-48 md:h-44 lg:h-48">
        {photo ? (
          <Image
            src={photo || "/placeholder.svg?height=224&width=300&query=hotel exterior"}
            alt={name}
            fill
            className="object-cover rounded-t-2xl"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-full w-full flex items-center justify-center text-gray-500 rounded-t-2xl">
            <p className="text-xs sm:text-sm md:text-xs">No image available</p>
          </div>
        )}

        {/* 💰 Price badge overlay */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1">
          <div className="text-xs sm:text-sm font-bold text-[#024891]">
            {formatPrice(convertPrice(price), selectedCurrency)}
          </div>
        </div>
      </div>

      {/* 📋 Details Section */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 lg:p-5">
        {/* Name + Tag */}
        <div className="flex items-center gap-1 sm:gap-2 mb-1">
          <span className="text-[#024891] font-semibold text-sm sm:text-base lg:text-lg line-clamp-1">
            {name}
          </span>
          <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded border border-gray-200 bg-gray-50 font-medium text-gray-700">
            Featured
          </span>
        </div>

        {/* Address */}
        {address && (
        
       < EmbeddedMap name={name}  address={address}/>
          
        )}

        {/* ⭐ Stars */}
        <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
          {Array.from({ length: starRating || 0 }, (_, i) => (
            <GoldStar key={i} size={12} className="sm:w-4 sm:h-4" />
          ))}
        </div>

        {/* Reviews */}
        <div className="flex items-center flex-wrap gap-1 sm:gap-2 text-[11px] sm:text-sm text-[#024891] mb-1 sm:mb-2">
          <span>{getReviewLabel(reviewScore)}</span>
          <span className="bg-[#024891] text-white px-1.5 sm:px-2 py-0.5 rounded-lg font-bold text-[11px] sm:text-sm">
            {reviewScore}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500">
            {reviewCount} reviews
          </span>
          <span className="text-[11px] sm:text-sm text-gray-700">
            Comfort {getReviewRatingRange(reviewScore)}
          </span>
        </div>

        {/* 🏷️ Amenities */}
        {/* {amenities.length > 0 && (
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
            {amenities.slice(0, 5).map((a, idx) => (
              <div key={idx} className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600">
                <span>{a}</span>
              </div>
            ))}
          </div>
        )} */}

        <div className="text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-2">
          Guest review summary
        </div>

        {/* Distance */}
      
        {/* Footer */}
        <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex flex-col items-start">
            <div className="text-[10px] sm:text-xs text-gray-500 mb-1">
              {nights} nights, {search?.travelers}
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#024891]">
              {formatPrice(convertPrice(price), selectedCurrency)}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500">+taxes and fees</div>
          </div>

          {/* 🔗 CTA */}
          <Link
            href={{
              pathname: `/detailed/${id}`,
              query: { checkin: checkIn, checkout: checkOut },
            }}
            target="_blank"
         onClick={async () => {
      await sessionStorage.setItem('firstroomprice',"0");


    const channel = new BroadcastChannel("session-sync");

  
    // Serialize sessionStorage to plain object
    const sessionData: Record<string, string> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) sessionData[key] = sessionStorage.getItem(key) as string;
    }

    // Send to other tabs
    channel.postMessage({ type: "SYNC_SESSION", data: sessionData });

    // Receive from other tabs
    channel.onmessage = (e) => {
      if (e.data.type === "SYNC_SESSION") {
        for (const key in e.data.data) {
          sessionStorage.setItem(key, e.data.data[key]);
        }
      }
    };

    // Mirror some important keys to localStorage
    ["searchResults", "selectedCity", "userCountry", "usercountry"].forEach((key) => {
      const val = sessionStorage.getItem(key);
      if (val) localStorage.setItem(key, val);
    });
  }}
            className="w-full sm:w-auto"
          >
            <button className="mt-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#024891] text-white rounded-lg font-medium shadow hover:bg-[#023e8a] transition-all w-full lg:w-auto text-[12px] sm:text-sm">
              See availability
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
})}


              </div>
              )

             
            )}

            {/* Debug logs for hotel data */}
            {(() => {
              console.log("sortedHotels:", sortedHotels?.length || 0)
              console.log("hotelOffers:", hotelOffers?.length || 0)
              console.log("hotels:", hotels?.length || 0)
              return null
            })()}
            {!sortedHotels || sortedHotels.length === 0 ? (
              <HotelsNoResults onClearFilters={clearFilters} />
            ) : (
                viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-2 lg:gap-4">
  {sortedHotels.filter((hotel) => hotel.property.priceBreakdown?.grossPrice?.value > 0).map((hotel, index) => (
    
    <HotelCard
      key={hotel.property.id}
      hotel={hotel}
      index={index}
      checkIn={checkIn}
      checkOut={checkOut}
      getDistanceFromCityCenter={(hotel) => getDistanceFromCityCenter(hotel, cityCoords)}
      getReviewRatingRange={getReviewRatingRange}
      convertPrice={(price, fromCurrency, toCurrency) =>
        convertPrice(price, exchangeRates, selectedCurrency, fromCurrency, toCurrency)
      }
      selectedCurrency={selectedCurrency}
        travelers={search?.travelers}
      formatPrice={formatPrice}
      grid={true}
    />
  ))}
</div>):(

   <div className="flex flex-col gap-4 lg:gap-6">
                    {sortedHotels.filter((hotel) => hotel.property.priceBreakdown?.grossPrice?.value > 0).map((hotel, index) => (
                      <HotelCard
                        key={hotel.property.id}
                        hotel={hotel}
                        index={index}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        getDistanceFromCityCenter={(hotel) => getDistanceFromCityCenter(hotel, cityCoords)}
                        getReviewRatingRange={getReviewRatingRange}
                        convertPrice={(price, fromCurrency, toCurrency) => convertPrice(price, exchangeRates, selectedCurrency, fromCurrency, toCurrency)}
                        selectedCurrency={selectedCurrency}
                        formatPrice={formatPrice}
                        travelers={search?.travelers}
                        grid={false}
                      />
                    ))}
                  </div>
)

            )}

            {/* Load More Button */}
            {hasMore && sortedHotels.length > 0 && (
              <HotelsLoadMore onClick={loadMoreHotels} loading={loading.loadingMore} />
            )}
          </motion.section>
        </div>
      )}
    </div>
    </div>
  )
}
function setExchangeRates(arg0: any) {
  throw new Error("Function not implemented.");
}

