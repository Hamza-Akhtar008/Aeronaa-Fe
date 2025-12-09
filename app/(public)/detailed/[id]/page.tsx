"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { fetchHotelFromAPI, GetHotel, GetReviewbyHotel, GetRoomsbyHotel, RegisterHotelbyapi } from "@/lib/api"
import { useAuth } from "@/store/authContext"
import { Modal } from "@/components/ui/Modal"
import type { Review } from "@/app/(Vendor)/Dashboard/Reviews/types"
import { hasApiStructure, transformApiReviewToReview, transformNewApiDataToHotel } from "@/lib/utils/hotel-tranform"
import axios from "axios"
import RoomTable from "../room-grid"
import HotelHeader from "@/components/hotel-detail/HotelHeader"
import CustomImageGallery from "@/components/hotel-detail/CustomImageGallery"
import NavigationTabs from "@/components/hotel-detail/NavigationTabs"
import Facilities from "@/components/hotel-detail/Facilities"
import HotelInfo from "@/components/hotel-detail/HotelInfo"
import Reviews from "@/components/hotel-detail/Reviews"
import { ArrowLeft, AlertCircle } from "lucide-react"
import type { Hotel } from "@/types/hotel" 
import Filters from "@/components/home/Filters"
import { CityResult, SearchInputs } from "@/components/home/search/types"
import EmbeddedMap from "@/components/embeddedmap"
import DetailEmbeddedMap from "@/components/detail_embeddedmap"


// Types
interface LoadingState {
  hotel: boolean
  rooms: boolean
  reviews: boolean
  booking: boolean
}

interface ErrorState {
  hotel: string | null
  rooms: string | null
  reviews: string | null
  booking: string | null
}

interface DataState {
  hotel: Hotel | null
  rooms: any
  reviews: Review[]
  isApiData: boolean
}

const OptimizedHotelDetail = () => {
  // Consolidated state
  const [data, setData] = useState<DataState>({
    hotel: null,
    rooms: null,
    reviews: [],
    isApiData: false,
  })

  const [loading, setLoading] = useState<LoadingState>({
    hotel: true,
    rooms: true,
    reviews: true,
    booking: false,
  })

  const [errors, setErrors] = useState<ErrorState>({
    hotel: null,
    rooms: null,
    reviews: null,
    booking: null,
  })
const [roomFetchSource, setRoomFetchSource] = useState<"local" | "api" | "">("");
  const [activeTab, setActiveTab] = useState("overview")
  const [modal, setModal] = useState<{
    title: string
    message: string
    actionLabel: string
    onConfirm: () => void
  } | null>(null)

  // Hooks
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { auth } = useAuth()
    const [showMap, setShowMap] = useState(false);

  let roomfetchbyapi=false;

  // Memoized values
  const hotelId = params?.id as string
  const checkin = searchParams?.get("checkin")
  const checkout = searchParams?.get("checkout")
  const pathname = usePathname()
  const currentUrl = pathname + (searchParams?.toString() ? `?${searchParams}` : "")
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(null)
  const defaultImages = ["/images/one.png", "/images/two.jpg", "/images/three.jpg", "/images/four.jpg"]

  useEffect(()=>
  {
 const searchResults = localStorage.getItem("searchResults");
    if (!searchResults)  return;
    const parsed = JSON.parse(searchResults);
    
    setSelectedCity(parsed.selectedCity);
  },[])
  const displayImages = useMemo(() => {
    if (data.hotel?.images && data.hotel.images.length > 0) {
      return data.hotel.images.map((img:any) => (typeof img === "string" ? img : img?.url))
    }
    return defaultImages
  }, [data.hotel?.images])

  // Utility functions
  const updateLoading = useCallback((key: keyof LoadingState, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }))
  }, [])

  const updateError = useCallback((key: keyof ErrorState, value: string | null) => {
    setErrors((prev) => ({ ...prev, [key]: value }))
  }, [])

  const closeModal = useCallback(() => setModal(null), [])

  // API configuration
  const rapidApiConfig = {
    headers: {
      "x-rapidapi-key": "7f66331876msh5a86fb2ce181b4dp1b2f48jsn8db63f8e12d9",
      "x-rapidapi-host": "agoda-com.p.rapidapi.com",
    },
  }

  // Data fetching functions
  const fetchHotelData = useCallback(async () => {
    if (!hotelId) return

    
    updateError("hotel", null)

    try {
      // Try local database first
      let hotelData = await GetHotel(hotelId)
      let isFromApi = false

      // If no local data, fetch from API
      if (!hotelData) {
       
        hotelData = await fetchHotelFromAPI(hotelId)
        isFromApi = true
      }

      if (!hotelData) {
        throw new Error("Hotel not found")
      }

      // Transform API data if needed
      if (isFromApi) {
        const transformedHotel = transformNewApiDataToHotel(hotelData)
        setData((prev) => ({
          ...prev,
          hotel: transformedHotel,
          isApiData: isFromApi,
        }))
      } else {
        setData((prev) => ({
          ...prev,
          hotel: hotelData,
          isApiData: isFromApi,
        }))
      }
    } catch (error) {
      console.error("Failed to fetch hotel:", error)
      updateError("hotel", error instanceof Error ? error.message : "Failed to load hotel data")
    } finally {
     
    }
  }, [hotelId])


  function formatDateMMDDYYYY(date:string) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

 const transformApiDataToRooms = (data: any,rate:string): Room[] => {
    if (!data?.data?.roomGroups) return []
    const roomMap = new Map<string, Room>()
const checkInDate = new Date(checkin||"");
const checkOutDate = new Date(checkout||"");

// Difference in time (ms)
const diffTime = checkOutDate.getTime() - checkInDate.getTime();

// Difference in days
const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    data.data.roomGroups.forEach((roomGroup: any) => {
      roomGroup.rooms.forEach((room: any) => {
       
        const id = room.uid?.toString()
        const roomType = roomGroup.masterRoomTypeName || "Standard Room"
        if (!id) return // skip if id is not present

        const discountedPrice = 0
        const smokingAllowed = !room.benefits?.some((b: any) => b.displayText.includes("Non-smoking"))

        // Use composite key for uniqueness by roomType + price + smokingAllowed
        const compositeKey = `${roomType}-${smokingAllowed}`

        const transformedRoom: Room = {
          id,
          roomType,
          description: roomType || "",
          maxOccupancy: room.maxRoomOccupancy ?? 2,
          bedConfiguration: [roomGroup.bedType || "1 bed"],
          roomSize: roomGroup.roomSize || 20,
          roomSizeUnit: roomGroup.sizeInfo?.unit || "sqm",
          basePrice: room.pricingDisplaySummary?.perNight.chargeTotal.allInclusive*parseFloat(rate)*numberOfDays || discountedPrice,
          discountedPrice,
          amenities: room.benefits?.map((b: any) => b.displayText) || [],
          images: roomGroup.images?.map((img: any) => img.url) || ["/placeholder.svg?height=200&width=300"],
          quantity: room.remainRoom || 1,
          smokingAllowed,
          hotel: {
            id: data.data.searchInfo?.hotelId || "1",
          },
        }

        // Only add if this combination hasn't been seen
        if (!roomMap.has(compositeKey)) {
 console.log("ROOMS : ",roomGroup);
 console.log(    id)
          console.log(transformedRoom);
          roomMap.set(compositeKey, transformedRoom)
        }
      })
    })

    return Array.from(roomMap.values())
  }
  const fetchRoomsData = useCallback(async () => {
    if (!hotelId) return

    updateLoading("rooms", true)
    updateError("rooms", null)

    try {
      // Try local database first
      const roomsData = await GetRoomsbyHotel(hotelId,search.checkIn||"")
      let shouldFetchFromApi = false
  
      // Determine if we need API data
      if (!roomsData ||roomsData.length==0) {
        shouldFetchFromApi = true
         setRoomFetchSource("api");

           try {
          const response = await axios.get("https://agoda-com.p.rapidapi.com/hotels/room-prices", {
            params: {
              propertyId: hotelId,
              checkinDate: checkin,
              checkoutDate: checkout,
               currency: 'EUR',              
    language: 'en-us',
            },
          headers: {
      "x-rapidapi-key": "7f66331876msh5a86fb2ce181b4dp1b2f48jsn8db63f8e12d9",
      "x-rapidapi-host": "agoda-com.p.rapidapi.com",
    }
          })

const res = await fetch(`https://api.exchangerate-api.com/v4/latest/EUR`)
         const data = await res.json()
          let rate=  data.rates["USD"]
          console.log(response.data);
     const rooms = transformApiDataToRooms(response, rate)


const firstPriceStr = localStorage.getItem('firstroomprice') || "0"
const firstPrice = parseFloat(firstPriceStr)

if (!isNaN(firstPrice) && firstPrice !== 0 && rooms.length > 0) {
  rooms[0].basePrice = firstPrice
  rooms[0].discountedPrice = firstPrice
}
            setData((prev) => ({
              ...prev,
              rooms: rooms,
              isApiData: true,
            }))
            roomfetchbyapi=true;
            return
        
        } catch (apiError) {
          console.error("Agoda API error:", apiError)
          // Fall through to use local data
        }
      }
      else
      {

    setRoomFetchSource("local");

       setData((prev) => ({
        ...prev,
        rooms: roomsData || [],
        isApiData: false,
      }))
      
      }

      // If we have checkin/checkout dates and need fresh pricing, use API
    

      // Use local data as fallback
     
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
      updateError("rooms", error instanceof Error ? error.message : "Failed to load rooms data")
      setData((prev) => ({ ...prev, rooms: [] }))
    } finally {
      updateLoading("rooms", false)
    }
  }, [hotelId, checkin, checkout])

  const fetchReviewsData = useCallback(async () => {
    if (!hotelId) return

    updateLoading("reviews", true)
    updateError("reviews", null)

    try {
      // Try local database first
      const localReviews = await GetReviewbyHotel(hotelId)

      if (localReviews && localReviews.length > 0) {
      
        setData((prev) => ({ ...prev, reviews: localReviews }))
        return
      }

      // Fetch from API if no local reviews
    

      try {
        const response = await axios.get("https://agoda-com.p.rapidapi.com/hotels/reviews", {
          params: {
            propertyId: hotelId,
            limit: 50,
            language: "en-us",
          },
          ...rapidApiConfig,
        })

        const transformedReviews = transformApiReviewToReview(response, hotelId)
        console.log("Transformed Reviews:", transformedReviews)
        setData((prev) => ({
          ...prev,
          reviews: transformedReviews,
          isApiData: true,
        }))
      } catch (apiError) {
        console.error("Reviews API error:", apiError)
        // Use empty array as fallback
        setData((prev) => ({ ...prev, reviews: [] }))
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
      updateError("reviews", error instanceof Error ? error.message : "Failed to load reviews")
      setData((prev) => ({ ...prev, reviews: [] }))
    } finally {
      updateLoading("reviews", false)
    }
  }, [hotelId])

  // Consolidated data fetching
  const fetchAllData = useCallback(async () => {
    if (!hotelId) return

  updateLoading("hotel", true)
    // Fetch all data concurrently for better performance
    await Promise.allSettled([fetchHotelData(), fetchRoomsData(), fetchReviewsData()])

    updateLoading("hotel", false)
  }, [])

  // Booking handler
  const handleBooking = useCallback(async () => {
    if (!data.hotel) return

    updateLoading("booking", true)
    updateError("booking", null)

    try {
      const token = auth?.access_token && typeof auth.access_token === "string" ? auth.access_token : null

      if (data.hotel.dataByApi) {
        const response = await RegisterHotelbyapi(data.hotel, token||"")

        if (response?.id) {
          router.push(`/hotel/booking/${response.id}`)
        } else {
          throw new Error(response?.message || "Failed to book hotel")
        }
      } else {
        router.push(`/hotel/booking/${hotelId}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to book hotel. Please try again."

      setModal({
        title: "Booking Error",
        message: errorMessage,
        actionLabel: "OK",
        onConfirm: closeModal,
      })

      updateError("booking", errorMessage)
    } finally {
      updateLoading("booking", false)
    }
  }, [data.hotel, data.isApiData, auth?.access_token, router, hotelId, closeModal])


  const getReviewLabel = (score: number): string => {
  if (score >= 9) return "Excellent";
  if (score >= 8) return "Very Good";
  if (score >= 7) return "Good";
  if (score >= 6) return "Fair";
  return "Poor";
};
  // Effects
  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // Loading state
  const isInitialLoading = loading.hotel || (!data.hotel && !errors.hotel)

  // Error component
  const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <p className="text-red-700 text-center mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  )
    // Populate search state from URL or sessionStorage (like hotels page)
    const [search, setSearch] = useState<SearchInputs>(() => {
      // Try to get from URL
      const city = searchParams?.get("city") || "";
      const checkIn = searchParams?.get("checkIn") || "";
      const checkOut = searchParams?.get("checkOut") || "";
      const adults = searchParams?.get("adults") || "2";
      const children = searchParams?.get("children") || "0";
      const rooms = searchParams?.get("rooms") || "1";
      // Try to get from sessionStorage if available (client-side only)
      if (typeof window !== "undefined") {
        const searchResults = localStorage.getItem("searchResults");
        if (searchResults) {
          try {
            const parsed = JSON.parse(searchResults);
            if (parsed && parsed.search) {
              return parsed.search;
            }
          } catch {}
        }
      }
      // Fallback to URL params or defaults
      return {
        id: "",
        location: city,
        checkIn,
        checkOut,
        travelers: `${adults} adults · ${children} children`,
        rooms,
      };
    });

    useEffect(()=>
    {
    const channel = new BroadcastChannel("session-sync");
     channel.onmessage = (e) => {
      if (e.data.type === "SYNC_SESSION") {
        for (const key in e.data.data) {
          sessionStorage.setItem(key, e.data.data[key]);
        }
      }
    };

 const searchResults = sessionStorage.getItem("searchResults");
    if (!searchResults) return ;
    
    const parsed = JSON.parse(searchResults);
    
    // Debug the parsed search results
    console.log("Parsed search results:", parsed.search);
    
    // Set search and city info
    setSearch(parsed.search);
    },[])
  // Loading component
  if (isInitialLoading) {
    return (
      <div className="flex min-h-screen  items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce" />
          </div>
          <p className="text-gray-600 font-medium">Loading hotel details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (errors.hotel && !data.hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorMessage message={errors.hotel} onRetry={fetchHotelData} />
      </div>
    )
  }

  // Main render
  return (
    <div className="min-h-screen  w-full max-w-[98rem] mx-auto bg-gray-50">
      {/* Filters Section - Improved mobile spacing */}
      <div className="mb-4 sm:mb-8">
        <Filters
          initialValues={search ?? {}}
          onChange={(values) => setSearch((prev) => ({ ...(prev ?? {}), ...values }))}
          onTabChange={undefined}
          tabsRef={undefined}
          selectedCity={selectedCity||undefined}
        />
      </div>

      {/* --- Custom Top Section --- */}
      {data.hotel && (
        <div className="max-w-[103rem] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
          {/* Mobile-first responsive grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Info & Images - Full width on mobile, 3 columns on xl */}
            <div className="xl:col-span-3 flex flex-col gap-4 sm:gap-6">
              {/* Title & Actions - Improved mobile layout */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                      {data.hotel.name}
                    </h1>
                    <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full self-start sm:self-auto">
                      Airport Shuttled
                    </span>
                  </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-blue-700 text-sm mb-1">
  <div className="flex items-center gap-1">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-blue-600 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  
       < EmbeddedMap name={data.hotel.name}  address={data.hotel.Address}/>
  </div>

 

  

        
          
        


</div>

                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v.01M8 12v.01M12 12v.01M16 12v.01M20 12v.01" />
                    </svg>
                  </button>

                </div>
              </div>

              {/* Custom Image Gallery with Navigation */}
              <CustomImageGallery images={displayImages} hotelName={data.hotel?.name || "Hotel"} />
              
              {/* Hotel Info moved here, directly below image gallery */}
              {data.hotel && <HotelInfo hotel={data.hotel} reviews={data.reviews} />}

              {data.hotel?.amenities && <Facilities amenities={data.hotel.amenities} />}
            </div>

            {/* Sidebar Cards - Stacked on mobile, side-by-side on larger screens */}
            <div className="space-y-4 sm:space-y-6 order-first xl:order-last">
              {/* Rating/Review/Map Card */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 w-full">
                {/* Rating Section */}
                <div className="flex items-center gap-3 sm:gap-4 mb-2">
                  <div>
                    <div className="text-sm text-gray-600">{getReviewLabel(parseFloat(data.hotel.starRating)+5)}</div>
                    <div className="flex items-end gap-1">
                      <span className="text-xl sm:text-2xl font-bold text-blue-900">{data.hotel.starRating}</span>
                      <span className="text-xs text-gray-500">{data.reviews.length} reviews</span>
                    </div>
                    <div className="text-xs font-semibold text-gray-800">Comfort {parseFloat(data.hotel.starRating)+5}</div>
                  </div>
                </div>
                {/* Guest Loved Section */}
                {
                  data.reviews.length>1&&
                  <>
                  
                    <hr className="my-2" />
                  <div className="text-xs text-gray-700 mb-2">
                  <div className="font-semibold mb-1">Guests who stayed here loved</div>
                  <div className="italic text-gray-600 mb-2">{data.reviews[0]?.description}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-900 text-sm sm:text-base">{data.reviews[0].user.name[0]}</span>
                    <span className="text-xs font-medium">{data.reviews[0].user.name}</span>
                   
                  </div>
                </div>
                  </>
                }
                
                <hr className="my-2" />
                {/* Great Location Section */}
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-700 font-semibold">Great location!</div>
                  <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded-full">8.3</span>
                </div>
                {/* Google Map Integration */}
              
               <DetailEmbeddedMap name={data.hotel.name} address={data.hotel.Address}/>
              </div>

              {/* Property Highlights Card */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full border border-gray-100">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Property highlights</h4>
               
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Breakfast Info</h4>
                  <div className="text-xs sm:text-sm text-gray-700">Vegetarian, Vegan, Halal, Asian, American, Buffet, Breakfast to go</div>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Options with:</h4>
                  <ul className="text-xs sm:text-sm text-gray-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      Terrace
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h16a1 1 0 001-1V7M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Free Private Parking Available On Site
                    </li>
                  </ul>
                </div>
               
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rooms Section - Improved mobile spacing */}
      <div className="max-w-[103rem] mx-auto  px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading.rooms ? (
          <div className="mb-8 sm:mb-12 flex min-h-[200px]">
            <span className="animate-spin mr-2 h-5 w-5 border-4 border-blue-600 border-t-transparent rounded-full inline-block"></span>
            <span className="text-gray-500">Loading rooms...</span>
          </div>
        ) : errors.rooms ? (
          <div className="mb-8 sm:mb-12">
            <ErrorMessage message={errors.rooms} onRetry={fetchRoomsData} />
          </div>
        ) : (
          <div className="mb-8 sm:mb-12">
            <RoomTable
              apiData={undefined}
              Rooms={data.rooms}
              isapidata={data.isApiData}
              loadingrooms={loading.rooms}
              onBookNow={handleBooking}
              roomFetchSource={roomFetchSource}
            />
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <>
        {loading.reviews ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="animate-spin mr-2 h-5 w-5 border-4 border-blue-600 border-t-transparent rounded-full inline-block"></span>
            <span className="text-gray-500">Loading reviews...</span>
          </div>
        ) : errors.reviews ? (
          <div className="max-w-[103rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <ErrorMessage message={errors.reviews} onRetry={fetchReviewsData} />
          </div>
        ) : (
          <Reviews reviews={data.reviews} />
        )}
      </>

      {/* Modal */}
      {modal && (
        <Modal
          title={modal.title}
          message={modal.message}
          actionLabel={modal.actionLabel}
          onConfirm={modal.onConfirm}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default OptimizedHotelDetail