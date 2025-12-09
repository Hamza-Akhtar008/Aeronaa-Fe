"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Check, Calendar, MapPin, User, Phone, Mail, Home, RefreshCw } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { BookRoom } from "@/lib/api"
import { json } from "stream/consumers"
import { any } from "zod"

interface BookingRoom {
  adults: number
  children: number
  roomType: string
}
interface BookingData {
  checkIn: string
  checkOut: string
  rooms: BookingRoom[]
  guestDetails: {
    firstName: string
    lastName: string
    email: string
    phone: string
    nicNumber:string
    specialRequests: string
  }
  paymentMethod: string
  createAccount: boolean
  bookingReference?: string
  paymentIntent?: string
}
interface BookingDetails {
  bookingReference: string
  hotel: {
    name: string
    address: string
    image: string
    starRating: string
  }
  dates: {
    checkIn: string
    checkOut: string
    nights: number
  }
  guest: {
    firstName: string
    lastName: string
    email: string
    phone: string
    nicNumber:string
  }
  rooms: Array<{
    roomType: string
    adults: number
    children: number
    price: number
  }>
  payment: {
    subtotal: number
    taxes: number
    total: number
    paymentIntentId: string
  }
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bookingid,setbookingid]=useState("");


   const loadBookingData = async () => {
      try {
        const bookingDataStr = sessionStorage.getItem("bookingData");
        const hotelStr = sessionStorage.getItem("hotel");
        const roomsStr = sessionStorage.getItem("rooms");
        const paymenttype =  sessionStorage.getItem("paymentType");

        // If missing, do not continue
        if (!bookingDataStr || !hotelStr || !roomsStr || !paymenttype) {
          setIsLoading(false);
          return;
        }

        // Always use bookingRef from query (if provided), otherwise from session
        let bookingRef = searchParams?.get("ref");
        let paymentIntent = searchParams?.get("paymentIntent");
const paymentType = JSON.parse(paymenttype);
        // Parse data for deterministic reference
        const bookingData: BookingData = JSON.parse(bookingDataStr);
        if (!bookingRef) {
          bookingRef =
            bookingData.bookingReference ||
            bookingData.paymentIntent ||
            paymentIntent ||
            `HTL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        }
        if (!paymentIntent) {
          paymentIntent =
            bookingData.paymentIntent ||
            `pi_${Math.random().toString(36).substr(2, 9)}`;
        }
        // Use localStorage for extra persistence across tabs/sessions
        const bookingKey = `booking_posted_${bookingRef}`;

        // If already posted, load display info only (no POST)
        if (localStorage.getItem(bookingKey)) {
          // Try to load what can be loaded (display confirmation)
          const hotel: any = JSON.parse(hotelStr);
          const rooms: any[] = JSON.parse(roomsStr);

          const checkInDate = new Date(bookingData.checkIn);
          const checkOutDate = new Date(bookingData.checkOut);
          const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

          const matchedRooms = bookingData.rooms.map((bookingRoom) => {
            const matchedRoom = rooms.find((room) => room.id === bookingRoom.roomType);
            const price = (matchedRoom?.discountedPrice || matchedRoom?.basePrice || 0) * nights;
            return {
              roomType: matchedRoom?.roomType || "Unknown",
              adults: bookingRoom.adults,
              children: bookingRoom.children,
              price,
            };
          });

          const subtotal = matchedRooms.reduce((sum, room) => sum + room.price, 0);
          const taxes = Math.ceil(subtotal * 0.2);
          const total = Math.ceil(subtotal + taxes);

          const fullAddress = `${hotel.Address}, ${hotel.city}, ${hotel.state} ${hotel.zipCode}, ${hotel.country}`;

          const transformedBookingDetails: BookingDetails = {
            bookingReference: bookingRef,
            hotel: {
              name: hotel.name,
              address: fullAddress,
              image: hotel.images && hotel.images.length > 0 ? hotel.images[0] : "/placeholder.svg",
              starRating: hotel.starRating,
            },
            dates: {
              checkIn: bookingData.checkIn,
              checkOut: bookingData.checkOut,
              nights,
            },
            guest: {
              firstName: bookingData.guestDetails.firstName,
              lastName: bookingData.guestDetails.lastName,
              email: bookingData.guestDetails.email,
              phone: bookingData.guestDetails.phone,
              nicNumber:bookingData.guestDetails.nicNumber
            },
            rooms: matchedRooms,
            payment: {
              subtotal,
              taxes,
              total,
              paymentIntentId: paymentIntent,
            },
          };

          setBookingDetails(transformedBookingDetails);
          setIsLoading(false);
          return;
        }

        // Continue as normal: POST if not already posted
        const hotel: any = JSON.parse(hotelStr);
        const rooms: any[] = JSON.parse(roomsStr);

        const checkInDate = new Date(bookingData.checkIn);
        const checkOutDate = new Date(bookingData.checkOut);
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

        const matchedRooms = bookingData.rooms.map((bookingRoom) => {
          const matchedRoom = rooms.find((room) => room.id === bookingRoom.roomType);
          const price = (matchedRoom?.discountedPrice || matchedRoom?.basePrice || 0) * nights;
          return {
            roomType: matchedRoom?.roomType || "Unknown",
            adults: bookingRoom.adults,
            children: bookingRoom.children,
            price,
          };
        });

        const subtotal = matchedRooms.reduce((sum, room) => sum + room.price, 0);
        const taxes = Math.round(subtotal * 0.2);
        const total = Math.ceil(subtotal );

        const fullAddress = `${hotel.Address}, ${hotel.city}, ${hotel.state} ${hotel.zipCode}, ${hotel.country}`;

        const transformedBookingDetails: BookingDetails = {
          bookingReference: bookingRef,
          hotel: {
            name: hotel.name,
            address: fullAddress,
            image: hotel.images && hotel.images.length > 0 ? hotel.images[0] : "/placeholder.svg",
            starRating: hotel.starRating,
          },
          dates: {
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            nights,
          },
          guest: {
            firstName: bookingData.guestDetails.firstName,
            lastName: bookingData.guestDetails.lastName,
            email: bookingData.guestDetails.email,
            phone: bookingData.guestDetails.phone,
            nicNumber:bookingData.guestDetails.nicNumber
          },
          rooms: matchedRooms,
          payment: {
            subtotal,
            taxes,
            total,
            paymentIntentId: paymentIntent,
          },
        };

        setBookingDetails(transformedBookingDetails);

        // --- POST only if not already posted for this ref ---
        if (!localStorage.getItem(bookingKey)) {
      const response =    await BookRoom(checkInDate, checkOutDate, total.toString(), nights.toString(), bookingData.rooms, hotel,paymentType,transformedBookingDetails.guest.firstName||""+transformedBookingDetails?.guest.lastName||"",transformedBookingDetails?.guest.email||"",transformedBookingDetails?.guest.nicNumber||"");
   console.log("This is Respones : ",response);
      setbookingid(response.id);  
      localStorage.setItem(bookingKey, "true");

          // Clean up session data (after POST and after marking as posted)
          sessionStorage.removeItem("bookingData");
          sessionStorage.removeItem("hotel");
          sessionStorage.removeItem("rooms");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Booking confirmation error:", error);
        toast.error("Failed to confirm booking. Please contact support.");
        setIsLoading(false);
      }
    };
   useEffect(() => {
  loadBookingData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
      const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#023e8a] mx-auto mb-4" />
          <p className="text-gray-600">Loading your booking confirmation...</p>
        </div>
      </div>
    )
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center py-8">
            <p className="text-gray-600 mb-4">Booking details not found. Please complete your booking first.</p>
            <Button onClick={() => router.push("/")} className="bg-[#023e8a] hover:bg-[#023e8a]/90">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your reservation has been successfully confirmed. We've sent the confirmation details to your email address.
          </p>
        </div>

        {/* Booking Reference */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Reference</h2>
              <div className="text-3xl font-bold text-[#023e8a] bg-[#023e8a]/10 rounded-lg py-4 px-6 inline-block">
                AER-{bookingid}
              </div>
              <p className="text-sm text-gray-600 mt-2">Please save this reference number for your records</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hotel Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hotel Details</h3>
              <div className="space-y-4">
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={bookingDetails.hotel.image || "/placeholder.svg"}
                    alt={bookingDetails.hotel.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{bookingDetails.hotel.name}</h4>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{bookingDetails.hotel.address}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${i < Math.floor(Number.parseFloat(bookingDetails.hotel.starRating))
                            ? "text-amber-400"
                            : "text-gray-300"
                            }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-semibold">{bookingDetails.hotel.starRating}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h3>
              <div className="space-y-4">
                {/* Dates */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#023e8a] mt-0.5" />
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p className="text-sm text-gray-600">{formatDate(bookingDetails.dates.checkIn)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#023e8a] mt-0.5" />
                  <div>
                    <p className="font-medium">Check-out</p>
                    <p className="text-sm text-gray-600">{formatDate(bookingDetails.dates.checkOut)}</p>
                  </div>
                </div>
                <div className="bg-[#023e8a]/10 rounded-lg p-3">
                  <p className="text-[#023e8a] font-semibold">
                    {bookingDetails.dates.nights} night{bookingDetails.dates.nights > 1 ? "s" : ""} stay
                  </p>
                </div>

                {/* Guest Info */}
                <Separator />

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#023e8a] mt-0.5" />
                  <div>
                    <p className="font-medium">Primary Guest</p>
                    <p className="text-sm text-gray-600">
                      {bookingDetails.guest.firstName} {bookingDetails.guest.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#023e8a] mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">{bookingDetails.guest.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#023e8a] mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{bookingDetails.guest.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] hover:from-[#023e8a] hover:to-[#0077b6]"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
