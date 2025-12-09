"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HotelDetailsForm } from "@/components/forms/hotel-detailsform"
import { RoomDetailsForm } from "@/components/forms/room-detailsform"
import { ArrowLeft, Building, BedDouble } from "lucide-react"
import Link from "next/link"
import { EditRegisterHotel, GetHotel, RegisterRooms, setHoteltoComplete } from "@/lib/api"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function AddPropertyPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("hotel-details")
  const [hotelId, setHotelId] = useState<string | null>(null)
  const [Loading, setLoading] = useState<boolean>(false)
  const [hotel, setHotel] = useState<Hotel>({
    id: "",
    name: "",
    description: "",
    Address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    status: "",
    starRating: "",
    averagePrice: "",
    checkInTime: "",
    checkOutTime: "",
    availableFrom: new Date(),
    availableTo: new Date(),
    amenities: [],
    images: [],
    tags: "",
    isCompleted: 0,
  })

  const [room, setRoom] = useState<Room>({
    id: "",
    roomType: "standard",
    description: "",
    maxOccupancy: "1",
    bedConfiguration: [],
    roomSize: 0,
    roomSizeUnit: "sqm",
    basePrice: 0,
    discountedPrice: 0,
    amenities: [],
    images: [],
    customRoomType: "",
    quantity: 1,
    smokingAllowed: false,
    // Added missing properties so the initial state matches the Room type
    isActive: false,
    availableRooms: 0,
    hotel: {
      id: "",
    },
  })
  const fetchHotel = async () => {
    try {
      const response = await GetHotel(id) // wait for the actual result
      console.log(response);
      setHotel({
        ...response,
        availableFrom: new Date(response.availableFrom),
        availableTo: new Date(response.availableTo),
      })
    } catch (error) {
      console.error("Failed to fetch hotel:", error)
    }
  }
  const [hotelLoading, setHotelLoading] = useState<boolean>(false)
  const [roomLoading, setRoomLoading] = useState<boolean>(false)
  useEffect(() => {
    fetchHotel()
    setLoading(false)
  }, [id, Loading])

  const HandleSaveforlater = async (hotel: Hotel, images: File[]) => {
    try {
      setHotelLoading(true)
      console.log("CHECK isHotelEmpty(hotel) : ", isHotelEmpty(hotel))
      console.log("CHECK isHotelEmpty(hotel) : ", hotel)
      if (!isHotelEmpty(hotel)) {
        const isCompleted = false
        await EditRegisterHotel(hotel, isCompleted, images)
        toast.success("Hotel Details Save for Later Edit")
         setHotelLoading(false)
        router.push(`/Dashboard`)
      } else {
        toast.error("Please Submit Form is Completely Fill")
      }
    } catch (error: any) {
      toast.error("Hotel Details Creation Failed. Please try again.")
    } finally {
      setHotelLoading(false)
    }
  }
  const handleHotelSaved = async (hotel: Hotel, images: File[]) => {
    try {
      setHotelLoading(true)
      if (isHotelEmpty(hotel)) {
        const response = await EditRegisterHotel(hotel, true, images)
        toast.success("Hotel details created successfully.")
        console.log(response);
       await setHoteltoComplete(hotel.id)||"";
        setHotelLoading(false)
        fetchHotel();
        setTimeout(() => {
          setActiveTab("room-details")
        }, 500)
      } else {
        toast.error("Please fill all required hotel details before saving.")
      }
    } catch (error: any) {
      toast.error("Failed to create hotel details. Please try again.")
    } finally {
      setHotelLoading(false)
    }
  }

  const handleRoomSave = async (room: Room, images: File[]) => {
    try {
      setRoomLoading(true)
      const response = await RegisterRooms(room, hotel.id || "", images)
      console.log("response : ", response)

   
        toast.success("Room details saved successfully!")
         setRoomLoading(false)
         setTimeout(() => {
           router.push("/Dashboard")
       
        }, 500)
      
    } catch (error: any) {
      toast.error("Failed to save room details. Please try again.")
    } finally {
      setRoomLoading(false)
    }
  }

  const isHotelEmpty = (hotel: Hotel): boolean => {
    const {
      name,
      description,
      Address,
      city,
      state,
      zipCode,
      country,
      starRating,
      checkInTime,
      checkOutTime,
      averagePrice,
      availableFrom,
      availableTo,
      amenities,
      tags,
    } = hotel

    const cleanedTags =
      typeof tags === "string"
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : Array.isArray(tags)
          ? tags.filter((tag) => typeof tag === "string" && tag.trim().length > 0)
          : []

    return (
      name !== "" &&
      description !== "" &&
      Address !== "" &&
      city !== "" &&
      state !== "" &&
      zipCode !== "" &&
      country !== "" &&
      starRating !== "" &&
      checkInTime !== "" &&
      checkOutTime !== "" &&
      averagePrice!=""&&
      availableFrom != null &&
      availableTo != null &&
      Array.isArray(amenities) &&
      amenities.length > 0 &&
      cleanedTags.length > 0
    )
  }

  if (!hotel)
    return (
      <div className="flex min-h-screen items-center justify-center ">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce" />
        </div>
      </div>
    )
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/Dashboard" className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Add New Property</h1>
        </div>
      </div>

      {/* Tabs + Forms */}
      <Card className="w-full max-w-4xl mx-auto rounded-xl border  bg-white shadow-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full text-sm bg-gray-100 rounded-t-xl border-b border-gray-300">
            <TabsTrigger
              value="hotel-details"
              className="flex items-center gap-2 justify-center px-6 py-3 font-medium text-gray-600
                   hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300
                   data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900
                   transition-colors duration-200 ease-in-out"
            >
              <Building className="h-5 w-5 text-blue-700" />
              <span>Hotel Details</span>
            </TabsTrigger>

            <TabsTrigger
              value="room-details"
              className="flex items-center gap-2 justify-center px-6 py-3 font-medium text-gray-600
                   hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300
                   data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900
                   transition-colors duration-200 ease-in-out"
            >
              <BedDouble className="h-5 w-5 text-blue-700" />
              <span>Room Details</span>
            </TabsTrigger>
          </TabsList>

          <CardContent className="p-6 bg-white rounded-b-xl min-h-[300px]">
            <TabsContent value="hotel-details" className="mt-0">
              <HotelDetailsForm
                onSavelater={HandleSaveforlater}
                onSaved={handleHotelSaved}
                hotel={hotel}
                setHotel={setHotel}
              
              />
            </TabsContent>

            <TabsContent value="room-details" className="mt-0">
              {hotel.isCompleted == 1 ? (
                <RoomDetailsForm
                  room={room}
                  hotelId={hotel.id || ""}
                  setRoom={setRoom}
                  onSaved={handleRoomSave}
               
                />
              ) : (
                <div className="py-20 text-center text-gray-400 text-base italic">Please save hotel details first.</div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <ToastContainer position="top-right" autoClose={1000} />
      {/* Hotel Loading Overlay */}
      {hotelLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
            <div className="text-center">
              {/* Animated Hotel Icon */}
              <div className="relative mx-auto mb-4">
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                <Building className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>

              {/* Loading Text */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Saving Hotel Details</h3>
              <p className="text-sm text-gray-600 mb-4">Please wait while we update your hotel information...</p>

              {/* Progress Dots */}
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room Loading Overlay */}
      {roomLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
            <div className="text-center">
              {/* Animated Room Icon */}
              <div className="relative mx-auto mb-4">
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                <BedDouble className="w-6 h-6 text-green-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>

              {/* Loading Text */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Saving Room Details</h3>
              <p className="text-sm text-gray-600 mb-4">Please wait while we add your room information...</p>

              {/* Progress Dots */}
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
