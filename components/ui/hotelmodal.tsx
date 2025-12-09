"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Star,
  User,
  HotelIcon,
  Bed,
  Users,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  X,
  CheckCircle,
  AlertCircle,
  Mail,
  Home,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



// Mock data for demonstration


const getAmenityIcon = (amenity: string) => {
  const amenityLower = amenity.toLowerCase().replace(/[^a-z]/g, "")

  // Hotel amenities
  if (amenityLower.includes("wifi") || amenityLower === "wifi") return <Wifi className="w-4 h-4" />
  if (amenityLower.includes("parking")) return <Car className="w-4 h-4" />
  if (amenityLower.includes("breakfast")) return <Coffee className="w-4 h-4" />
  if (amenityLower.includes("pool")) return <Waves className="w-4 h-4" />
  if (amenityLower.includes("fitness") || amenityLower.includes("gym")) return <Dumbbell className="w-4 h-4" />
  if (amenityLower.includes("restaurant")) return <Coffee className="w-4 h-4" />
  if (amenityLower.includes("bar")) return <Coffee className="w-4 h-4" />
  if (amenityLower.includes("spa")) return <Waves className="w-4 h-4" />
  if (amenityLower.includes("roomservice") || amenityLower.includes("room-service")) return <User className="w-4 h-4" />

  // Room amenities
  if (amenityLower.includes("tv")) return <Star className="w-4 h-4" />
  if (amenityLower.includes("ac") || amenityLower.includes("airconditioning")) return <Star className="w-4 h-4" />
  if (amenityLower.includes("heating")) return <Star className="w-4 h-4" />
  if (amenityLower.includes("minibar")) return <Coffee className="w-4 h-4" />
  if (amenityLower.includes("safe")) return <Star className="w-4 h-4" />
  if (amenityLower.includes("desk") || amenityLower.includes("workdesk")) return <Star className="w-4 h-4" />
  if (amenityLower.includes("bathtub")) return <Star className="w-4 h-4" />
  if (amenityLower.includes("shower")) return <Star className="w-4 h-4" />
  if (amenityLower.includes("hairdryer")) return <Star className="w-4 h-4" />
  if (amenityLower.includes("toiletries")) return <Star className="w-4 h-4" />
  if (amenityLower.includes("balcony")) return <Home className="w-4 h-4" />
  if (amenityLower.includes("oceanview")) return <Waves className="w-4 h-4" />
  if (amenityLower.includes("cityview")) return <MapPin className="w-4 h-4" />
  if (amenityLower.includes("coffeemaker")) return <Coffee className="w-4 h-4" />

  return <Star className="w-4 h-4" />
}

interface UIBooking {
  id: string | number
  isActive: boolean
  isAppeared: boolean // <-- Add this property
  user: {
    id: string | number
    name: string
    email: string
    role: string
  }
  paymentType?: string
  checkIndate: string
  checkOutDate: string
  numberOfDays: number
  amount: string | number
  hotel: {
    name: string
    description?: string
    images?: string[]
    starRating?: string
    Address?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
    amenities?: string[]
    checkInTime?: string
    checkOutTime?: string
  }
  room?: Array<{
    id: string | number
    roomType: string
    description?: string
    images: string[]
    maxOccupancy: number
    roomSize: string | number
    roomSizeUnit: string
    bedConfiguration: string[]
    amenities: string[]
  }>
}

interface BookingModalProps {
  booking: UIBooking
  isOpen: boolean
  onClose: () => void
  onBookingUpdated?: () => void
}

export default function BookingModal({ booking, isOpen, onClose, onBookingUpdated }: BookingModalProps) {
  // ...existing code...
  // State for cancellation status
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  
  // Helper to check if user has permission to cancel (vendor, agent, or admin)

  // Helper to check pay at hotel
  const isPayAtHotel = booking?.paymentType?.toLowerCase().replace(/\s+/g, '') === "payathotel";

  // Cancel booking handler
  const handleCancelBooking = async () => {
    try {
      setIsCanceling(true);
      
      // Update the local booking object immediately to reflect the cancellation
      // This ensures the UI shows the change even before the API call completes
      if (booking) {
        booking.isActive = false;
        // Directly modify the object as any to set isAppeared property
        (booking as any).isAppeared = false;
      }
      
      // Dynamically import to avoid SSR issues
      const { CancelbyVendorBooking } = await import("@/lib/api");
      await CancelbyVendorBooking(String(booking.id));
      
      // Mark success
      setCancelSuccess(true);
      
      // Notify parent component about the update so it can refresh data
      if (onBookingUpdated) {
        onBookingUpdated();
      }
      
      // Close modal after showing success message for 2 seconds
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setIsCanceling(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="relative p-6 text-white bg-gradient-to-r from-[#023e8a] to-[#00b4d8]">
              <Button
                variant="ghost"
                size="icon"
                className="absolute text-white top-4 right-4 hover:bg-white/20"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <HotelIcon className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Booking #{booking.id}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    {booking.isActive ? (
                      <Badge className="bg-green-500/20 text-green-100 border-green-400/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-100 border-red-400/30">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Cancel Booking Button for Vendor/Agent/Admin & Pay at Hotel */}
            { isPayAtHotel && booking.isAppeared==true && !cancelSuccess && (
              <div className="flex justify-end px-6 pt-4">
                <Button 
                  variant="destructive" 
                  onClick={handleCancelBooking} 
                  disabled={isCanceling}
                >
                  {isCanceling ? "Canceling..." : "Cancel Booking"}
                </Button>
              </div>
            )}
            
            {/* Success Message */}
            {cancelSuccess && (
              <div className="flex justify-center items-center px-6 py-4 bg-green-50">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Booking successfully cancelled</span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* User Information */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-full">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">Guest Information</h3>
                        </div>
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 border-2 border-blue-200">
                            <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback className="bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white">
                            {booking?.user?.name
                              ? booking.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "NA"}
                          </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-800">{booking?.user?.name}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              {booking?.user?.email}
                            </div>
                            <p className="text-xs text-gray-500">Guest ID: {booking?.user?.id}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Booking Details */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-full">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">Booking Details</h3>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="p-4 rounded-lg bg-gray-50">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-600">Check-in</span>
                            </div>
                            <p className="font-semibold text-gray-800">
                              {new Date(booking.checkIndate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">{booking?.hotel?.checkInTime}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-gray-50">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-600">Check-out</span>
                            </div>
                            <p className="font-semibold text-gray-800">
                              {new Date(booking.checkOutDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">{booking?.hotel?.checkOutTime}</p>
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-600">Duration</span>
                          </div>
                          <span className="font-semibold">{booking.numberOfDays} nights</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-600">Total Amount</span>
                          </div>
                          <span className="text-xl font-bold text-green-600">{booking.amount}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Hotel Information */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-full">
                            <HotelIcon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">Hotel Information</h3>
                        </div>

                        <div className="mb-4">
                          <img
                            src={booking?.hotel?.images?.[0] || "/images/image4.jpg"}
                            alt={booking?.hotel?.name}
                            className="object-cover w-full h-48 rounded-lg"
                          />
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-xl font-bold text-gray-800">{booking?.hotel?.name}</h4>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Number.parseInt(booking?.hotel?.starRating || "0") }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>

                        <p className="mb-4 text-sm text-gray-600">{booking?.hotel?.description}</p>

                        <div className="flex items-start gap-2 mb-4">
                          <MapPin className="w-4 h-4 mt-1 text-blue-600" />
                          <div className="text-sm text-gray-600">
                            <p>{booking?.hotel?.Address}</p>
                            <p>
                              {booking?.hotel?.city}, {booking?.hotel?.state} {booking?.hotel?.zipCode}
                            </p>
                            <p>{booking?.hotel?.country}</p>
                          </div>
                        </div>

                        {booking?.hotel?.amenities && (
                          <div>
                            <h5 className="mb-2 font-semibold text-gray-800">Hotel Amenities</h5>
                            <div className="flex flex-wrap gap-2">
                              {booking.hotel.amenities.map((amenity, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                  {getAmenityIcon(amenity)}
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Room Information */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-full">
                            <Bed className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">Room Details</h3>
                        </div>

                        {booking?.room?.map((room, index) => (
                          <div key={room.id} className={index > 0 ? "mt-6 pt-6 border-t" : ""}>
                            <div className="mb-4">
                              <img
                                src={room.images[0] || "/images/three.jpg"}
                                alt={room.roomType}
                                className="object-cover w-full h-32 rounded-lg"
                              />
                            </div>

                            <h4 className="mb-2 text-lg font-semibold text-gray-800">{room.roomType}</h4>
                            <p className="mb-3 text-sm text-gray-600">{room.description}</p>

                            <div className="grid gap-3 mb-4 sm:grid-cols-2">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="text-sm">Max {room.maxOccupancy} guests</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Home className="w-4 h-4 text-blue-600" />
                                <span className="text-sm">
                                  {room.roomSize} {room.roomSizeUnit}
                                </span>
                              </div>
                            </div>

                            <div className="mb-4">
                              <h5 className="mb-2 text-sm font-semibold text-gray-700">Bed Configuration</h5>
                              <div className="flex flex-wrap gap-1">
                                {room.bedConfiguration.map((bed, bedIndex) => (
                                  <Badge key={bedIndex} variant="outline" className="text-xs">
                                    {bed}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="mb-4">
                              <h5 className="mb-2 text-sm font-semibold text-gray-700">Room Amenities</h5>
                              <div className="flex flex-wrap gap-2">
                                {room.amenities.map((amenity, amenityIndex) => (
                                  <Badge
                                    key={amenityIndex}
                                    variant="secondary"
                                    className="flex items-center gap-1 text-xs"
                                  >
                                    {getAmenityIcon(amenity)}
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                           
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Demo component to show the modal

