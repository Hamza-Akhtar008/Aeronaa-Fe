"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Shield, CreditCard, Check, ChevronLeft, ChevronRight, User, Lock, Download } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { FetchUser, GetHotel, RegisterRoombyApi } from "@/lib/api"
import { useAuth } from "@/store/authContext"
import { loadStripe } from "@stripe/stripe-js"
import { baseURL } from "@/lib/utils/utils"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"
import { formatPrice } from "@/lib/utils/currency"
import type { BookingRoom, Hotel } from "@/types" // Import types

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51RNDLyLaGWi6LnLvMVsEZb6pDSMfpZH6kM6hrjclFqADw0sBjt3myZCdegHLQ63wc1e80uq0SW96qIP8VPokvbQi00T84mZpMY",
)

// Sample hotel data
const hotelData = {
  name: "Grand Palace Resort",
  location: "Bali, Indonesia",
  rating: 4.8,
  image: "/images/image5.jpg",
  amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Parking"],
}

export default function RestructuredHotelBooking() {
  const { auth, loading } = useAuth()
  const router = useRouter()

  const saveBookingState = () => {
    const bookingState = {
      currentStep,
      bookingData,
      hotel,
      selectedRoomsData,
      totalPrice,
      nights,
    }
    sessionStorage.setItem("temporaryBooking", JSON.stringify(bookingState))
  }

  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    rooms: [] as BookingRoom[],
    guestDetails: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      nicNumber:"",
      specialRequests: "",
    },
    paymentMethod: "",
    createAccount: false,
  })
const [userEmail,setUserEmail]=useState("");
  const [user, setUser] = useState<User | null>(null)
  const [hotel, setHotel] = useState<Hotel>({} as Hotel)
  const [selectedRoomsData, setSelectedRoomsData] = useState<any[]>([])
  const [roomBookingSummary, setRoomBookingSummary] = useState<any>(null)
  const [loadingroom, setloading] = useState(false)
  const params = useParams()
  const [totalPrice, setTotalPrice] = useState(0)
  const [nights, setNights] = useState(0)
  const [currentStep, setCurrentStep] = useState(1) // Start with step 1 (Guest Info)
  const [selectedcurrency, setSelectedCurrency] = useState("USD")
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 })

  useEffect(() => {
    const data = sessionStorage.getItem("userCountry")
    if (data) {
      const detectedCurrency = getCurrencyByLocation(data)
      setSelectedCurrency(detectedCurrency)
    }
  }, [])

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
        const data = await response.json()
        setExchangeRates({ ...data.rates, USD: 1 })
      } catch (error) {
        console.error("Error fetching exchange rates:", error)
        setExchangeRates({ USD: 1 })
      }
    }
    if (selectedcurrency !== "USD") {
      fetchRates()
    }
  }, [selectedcurrency])

  // Load room booking data from sessionStorage
  useEffect(() => {
    const roomBookingDataString = sessionStorage.getItem("roomBookingData")
    if (roomBookingDataString) {
      try {
        const roomBookingData = JSON.parse(roomBookingDataString)
        console.log("Loaded room booking data:", roomBookingData)

        // Expand rooms based on quantity - create separate entries for each room instance
        const expandedRooms: any[] = []
        roomBookingData.selectedRooms?.forEach((room: any) => {
          // Create separate room entries based on quantity
          for (let i = 0; i < room.quantity; i++) {
            expandedRooms.push({
              ...room,
              quantity: 1, // Each expanded room has quantity 1
              instanceId: `${room.id}_${i + 1}`, // Unique identifier for each instance
              originalQuantity: room.quantity, // Keep track of original quantity
            })
          }
        })

        console.log("Expanded rooms:", expandedRooms)
        setSelectedRoomsData(expandedRooms)
        setRoomBookingSummary(roomBookingData.summary || null)

        // Calculate total price from expanded rooms
        const totalPriceFromRooms = expandedRooms.reduce((sum, room) => sum + room.effectivePrice, 0)
        setTotalPrice(totalPriceFromRooms)

        // Transform expanded rooms to booking rooms format - each room instance becomes a separate booking room
        const transformedRooms = expandedRooms.map((room: any, index: number) => ({
          adults: Math.min(room.maxOccupancy || 2, 2), // Default to 2 adults
          children: Math.max((room.maxOccupancy || 2) - 2, 0), // Remaining as children
          roomType: room.id,
          instanceId: room.instanceId, // Track which instance this is
          roomIndex: index + 1, // Room number for display
        }))

        setBookingData((prev) => ({
          ...prev,
          rooms: transformedRooms,
        }))

        // Set currency from booking data
        if (roomBookingData.summary?.selectedDisplayCurrency) {
          setSelectedCurrency(roomBookingData.summary.selectedDisplayCurrency)
        }
        if (roomBookingData.summary?.exchangeRate) {
          setExchangeRates((prev) => ({
            ...prev,
            [roomBookingData.summary.selectedDisplayCurrency]: roomBookingData.summary.exchangeRate,
          }))
        }
      } catch (error) {
        console.error("Error parsing room booking data:", error)
        toast.error("Error loading room selection. Please select rooms again.")
        router.back()
      }
    } else {
      toast.error("No room selection found. Please select rooms first.")
      router.back()
    }
  }, [router])

  // Restore saved booking state if exists
  useEffect(() => {
    const savedBooking = sessionStorage.getItem("temporaryBooking")
    if (savedBooking && auth) {
      try {
        const parsedBooking = JSON.parse(savedBooking)
        setBookingData(parsedBooking.bookingData)
       
       
        setSelectedRoomsData(parsedBooking.selectedRoomsData)
        setTotalPrice(parsedBooking.totalPrice)
        setNights(parsedBooking.nights)
        setCurrentStep(parsedBooking.currentStep)
        // Clear the temporary booking after restoring
        sessionStorage.removeItem("temporaryBooking")
      } catch (error) {
        console.error("Error restoring booking state:", error)
      }
    }
  }, [auth])

  useEffect(() => {
    const data = localStorage.getItem("searchResults")
    if (!data) {
      return
    }
    const parsed = JSON.parse(data)
    const checkIn = parsed.search.checkIn
    const checkOut = parsed.search.checkOut
    console.log("checkIn : ", parsed.search.checkIn, " checkOut: ", parsed.search.checkOut)

    if (checkIn && checkOut) {
      setBookingData((prev) => ({
        ...prev,
        checkIn: checkIn,
        checkOut: checkOut,
      }))

      // Calculate nights
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      const nightCount = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24))
      setNights(nightCount)
    }
  }, [])

  useEffect(() => {
    if (!loading && auth) {
      const fetchUserData = async () => {
        try {
          const response = await FetchUser(auth.id.toString())
          setUser(response)
        } catch (error) {
          console.error("Failed to fetch user:", error)
        }
      }
      fetchUserData()
    }
  }, [loading, auth])

  useEffect(() => {
    if (user) {
      const [firstName, ...rest] = user.name.split(" ")
      const lastName = rest.join(" ")
      setUserEmail(user.email);
      setBookingData((prev) => ({
        ...prev,
        guestDetails: {
          ...prev.guestDetails,
          firstName,
          lastName,
          email: user.email,
          phone: user.phone,
        },
      }))
    }
  }, [user])

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await GetHotel(params?.id as string)
        console.log("HOTEL DATA FETCH : ",data);
        setHotel(data)
      } catch (err) {
        console.error("Failed to fetch hotel:", err)
      }
    }

    if (params?.id) {
      fetchHotel()
    }
  }, [params?.id])

  const steps = [
    { id: 1, title: "Guest Info", icon: User },
    { id: 2, title: "Payment", icon: CreditCard },
  ]

  const nextStep = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  const registerRoomsForHotel = async (rooms: any[], hotelId?: string) => {
    try {
      const updatedBookingRooms = [...bookingData.rooms]
      const updatedRegisteredRooms: any[] = []

      // Process each room instance separately
      for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i]
        const originalRoomId = room.id?.toString()

        if (!originalRoomId) continue

        // Register each room instance separately with the backend
        const response = await RegisterRoombyApi(room, hotelId || (params?.id as string), hotel)

        // Update the corresponding booking room entry
        if (updatedBookingRooms[i]) {
          updatedBookingRooms[i].roomType = response.id
        }

        updatedRegisteredRooms.push({
          ...room,
          id: response.id,
          originalId: originalRoomId, // Keep track of original room type ID
        })
      }

      setBookingData((prev) => ({
        ...prev,
        rooms: updatedBookingRooms,
      }))

      console.log("Updated Booking Rooms: ", updatedRegisteredRooms)
      setSelectedRoomsData(updatedRegisteredRooms)
      return updatedRegisteredRooms
    } catch (error) {
      console.error("Room registration failed for some rooms", error)
      return []
    }
  }

  const handleBooking = async () => {
    try {
      if (hotel.apiId) {
        const Room = await registerRoomsForHotel(selectedRoomsData, hotel?.id)
        console.log("REGISTERED ROOMS : ", Room)
        sessionStorage.setItem("rooms", JSON.stringify(Room))
      } else {
        sessionStorage.setItem("rooms", JSON.stringify(selectedRoomsData))
      }

      sessionStorage.setItem("bookingData", JSON.stringify(bookingData))
      sessionStorage.setItem("hotel", JSON.stringify(hotel))
      sessionStorage.setItem("paymentType", JSON.stringify(bookingData.paymentMethod=="hotel"?"payathotel":"online"))


      const successUrl = `${window.location.origin}/success`
      const cancelUrl = `${window.location.origin}/cancel`
      console.log("successUrl : ", successUrl)
      console.log("cancelUrl : ", cancelUrl)

      if (bookingData.paymentMethod === "hotel") {
        router.push(successUrl)
        return
      }

      const stripe = await stripePromise
      console.log("Stripe initialized:", stripe)

      const randomBookingId = Math.floor(Math.random() * 1000000)
      const amount = Math.ceil(totalPrice)

      const requestBody = {
        amount: Math.ceil(amount * 100),
        currency: "usd",
        successUrl,
        cancelUrl,
        customerEmail: bookingData.guestDetails.email,
        bookingId: randomBookingId,
      }

      console.log("Request body:", requestBody)

      const res = await fetch(baseURL + "bookings/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await res.json()
      console.log("Backend response:", data)

      if (!data.url) {
        throw new Error("Stripe session URL not found")
      }

      window.location.href = data.url
    } catch (error) {
      console.error("Stripe Checkout Error:", error)
      toast.error("Payment initialization failed. Please try again.")
    }
  }

  function getRandomImage(images: any) {
    const randomIndex = Math.floor(Math.random() * images.length)
    return images[randomIndex]
  }

  // Show confirmation step in full width
  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            key="confirmation"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
                  <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                    Your reservation has been successfully confirmed. We've sent the details to your email.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-xl mx-auto">
                    <div className="space-y-2 text-sm sm:text-base text-gray-600">
                      <p>{hotel.name}</p>
                      <p>{hotel.Address}</p>
                      <p>
                        {bookingData.checkIn} to {bookingData.checkOut} • {nights} nights
                      </p>
                      <p>
                        {bookingData.guestDetails.firstName} {bookingData.guestDetails.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2 w-full sm:w-auto bg-transparent"
                    >
                      <Download className="w-4 h-4" />
                      Download Confirmation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
         onClick={() =>
   router.push(`/detailed/${hotel.apiId?hotel.apiId:hotel.id}?checkin=${bookingData.checkIn}&checkout=${bookingData.checkOut}`)

}
          className="ml-2 text-gray-600 hover:text-[#023e8a] transition-colors duration-300 flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 hover:border-[#023e8a] bg-white mb-6"
          aria-label="Go back to the previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-y-6 sm:gap-x-6 max-w-4xl">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                return (
                  <div key={step.id} className="flex items-center sm:flex-row flex-col text-center sm:text-left">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                        ${
                          isActive
                            ? "bg-[#023e8a] border-[#023e8a] text-white"
                            : isCompleted
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-white border-gray-300 text-gray-400"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium mt-2 sm:mt-0
                        ${isActive ? "text-[#023e8a]" : isCompleted ? "text-emerald-600" : "text-gray-400"}
                      `}
                    >
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-px sm:w-10 sm:h-0.5 h-6 mx-auto sm:mx-4 ${
                          isCompleted ? "bg-emerald-500" : "bg-gray-300"
                        } transition-colors duration-300`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Two Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Summary (Always Visible) */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hotel Info */}
                <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">

                    {
                      hotel.images&&
                       <Image
                      src={hotel?.images[0] || "/images/image1.jpg"}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                    />
                      
                    }
                   
                  </div>
                  <div className="text-sm">
                    <h4 className="font-semibold">{hotel.name}</h4>
                    <p className="text-gray-600">{hotel.Address}</p>
                    <p>
                      {new Date(bookingData.checkIn).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      to{" "}
                      {new Date(bookingData.checkOut).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      • {nights} nights
                    </p>
                  </div>
                </div>

                {/* Room Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Selected Rooms</h4>
                  {selectedRoomsData.map((room, index) => (
                    <div key={room.instanceId || index} className="border rounded-lg p-3">
                      <div className="flex flex-col justify-between gap-2">
                        <div>
                          <h5 className="font-semibold text-sm">
                            Room {index + 1}: {room.roomType}
                            {room.originalQuantity > 1 && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({(index % room.originalQuantity) + 1} of {room.originalQuantity})
                              </span>
                            )}
                          </h5>
                          <p className="text-xs text-gray-600">
                            Max {room.maxOccupancy} guests • {room.roomSize} {room.roomSizeUnit}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            
                            {nights} nights
                          </div>
                          <div className="text-lg font-bold text-[#023e8a]">
                            {formatPrice(
                             room.effectivePrice  * (exchangeRates[selectedcurrency] || 1),
                              selectedcurrency,
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                 
                  <div className="flex justify-between">
                   
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#023e8a]">
                      {formatPrice(
                       totalPrice   *
                          (exchangeRates[selectedcurrency] || 1),
                        selectedcurrency,
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Steps */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Guest Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">Guest Information</CardTitle>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {auth ? "Your details from your account" : "Please sign in to continue booking"}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {auth ? (
                        <div className="p-4 bg-[#023e8a]/5 border border-[#023e8a]/20 rounded-lg">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#023e8a]">Logged in as</h4>
                              <p className="text-sm text-gray-600 break-all">{userEmail}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg space-y-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-full flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold text-gray-900">Sign in Required</h3>
                            <p className="text-gray-600">Please sign in or register to continue with your booking</p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Button
                              onClick={() => {
                                saveBookingState()
                                router.push(`/signin?redirect=${encodeURIComponent(window.location.pathname)}`)
                              }}
                              className="w-full sm:w-auto bg-gradient-to-r from-[#023e8a] to-[#00b4d8] hover:from-[#023e8a] hover:to-[#0077b6]"
                            >
                              Sign In
                            </Button>
                            <Button
                              onClick={() => {
                                saveBookingState()
                                router.push(`/user/register?redirect=${encodeURIComponent(window.location.pathname)}`)
                              }}
                              variant="outline"
                              className="w-full sm:w-auto"
                            >
                              Register
                            </Button>
                          </div>
                        </div>
                      )}

                      {auth && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              value={bookingData.guestDetails.firstName}
                              onChange={(e) =>
                                setBookingData({
                                  ...bookingData,
                                  guestDetails: { ...bookingData.guestDetails, firstName: e.target.value },
                                })
                              }
                              className="mt-1 bg-gray-50"
                              readOnly={auth.role !== "agent"}
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              value={bookingData.guestDetails.lastName}
                              onChange={(e) =>
                                setBookingData({
                                  ...bookingData,
                                  guestDetails: { ...bookingData.guestDetails, lastName: e.target.value },
                                })
                              }
                              className="mt-1 bg-gray-50"
                              readOnly={auth.role !== "agent"}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={bookingData.guestDetails.email}
                              onChange={(e) =>
                                setBookingData({
                                  ...bookingData,
                                  guestDetails: { ...bookingData.guestDetails, email: e.target.value },
                                })
                              }
                              className="mt-1 bg-gray-50"
                              readOnly={auth.role !== "agent"}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number *</Label>
                           <Input
  id="phone"
  type="tel"
  value={bookingData.guestDetails.phone}
  onChange={(e) =>
    setBookingData({
      ...bookingData,
      guestDetails: { ...bookingData.guestDetails, phone: e.target.value },
    })
  }
  className="mt-1 bg-gray-50"
  readOnly={auth.role !== "agent"}
/>

                          </div>


  <div>
                            <Label htmlFor="phone">Passport/Identity# *</Label>
                           <Input
  id="phone"
  type="tel"
  value={bookingData.guestDetails.nicNumber}
  onChange={(e) =>
    setBookingData({
      ...bookingData,
      guestDetails: { ...bookingData.guestDetails, nicNumber: e.target.value },
    })
  }
  className="mt-1 bg-gray-50"
  required
/>

                          </div>


                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          variant="outline"
                          onClick={() => router.back()}
                          className="w-full sm:w-1/2 bg-transparent"
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Back to Rooms
                        </Button>
                        <Button
                          onClick={nextStep}
                          className="w-full sm:w-1/2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] hover:from-[#023e8a] hover:to-[#0077b6]"
                          disabled={!auth}
                        >
                          {auth ? (
                            <>
                              Continue to Payment
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </>
                          ) : (
                            <>
                              Sign in Required
                              <Lock className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">Payment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4 p-4 border rounded-2xl bg-gray-50 shadow-sm">
                        <div>
                          <Label className="block text-lg font-semibold text-gray-700 mb-3">
                            Select Payment Method
                          </Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label
                              className={`cursor-pointer flex items-center gap-3 p-4 border rounded-xl transition-all duration-200 ${
                                bookingData.paymentMethod === "card"
                                  ? "border-blue-600 bg-blue-50"
                                  : "border-gray-300 hover:border-blue-400"
                              }`}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                checked={bookingData.paymentMethod === "card"}
                                onChange={() => setBookingData({ ...bookingData, paymentMethod: "card" })}
                                className="form-radio h-5 w-5 text-blue-600"
                              />
                              <div>
                                <p className="font-medium text-gray-800">Pay Now</p>
                                <p className="text-sm text-gray-500">Pay securely with your card</p>
                              </div>
                            </label>
                            <label
                              className={`cursor-pointer flex items-center gap-3 p-4 border rounded-xl transition-all duration-200 ${
                                bookingData.paymentMethod === "hotel"
                                  ? "border-green-600 bg-green-50"
                                  : "border-gray-300 hover:border-green-400"
                              }`}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="hotel"
                                checked={bookingData.paymentMethod === "hotel"}
                                onChange={() => setBookingData({ ...bookingData, paymentMethod: "hotel" })}
                                className="form-radio h-5 w-5 text-green-600"
                              />
                              <div>
                                <p className="font-medium text-gray-800">Pay at Hotel</p>
                                <p className="text-sm text-gray-500">No upfront payment</p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 bg-green-50 rounded-lg text-center sm:text-left">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-800">
                          Your payment is secured with 256-bit SSL encryption
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button variant="outline" onClick={prevStep} className="flex-1 bg-transparent">
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                        <Button
                          onClick={handleBooking}
                          className="flex-1 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] hover:from-[#023e8a] hover:to-[#0077b6]"
                          disabled={!bookingData.paymentMethod}
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Complete Booking
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
