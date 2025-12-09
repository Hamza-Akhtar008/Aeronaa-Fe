"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Star,
  Phone,
  Mail,
  Wifi,
  Car,
  Utensils,
  Waves,
  Dumbbell,
  Coffee,
  Shield,
  CreditCard,
  Download,
  Share,
  MessageSquare,
  Users,
  Bed,
  Bath,
  Maximize,
  AirVent,
  Tv,
  Refrigerator,
  Globe,
  Sparkles,
  Building,
  MapIcon,
  ExternalLink,
  HomeIcon,
  User2Icon,
} from "lucide-react"


interface BookingDetailsPageProps {
  booking:UIBooking,
  onBack: () => void
}

export default function BookingDetailsPage({ booking, onBack }: BookingDetailsPageProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
      />
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "from-emerald-500 to-teal-600"
      case "completed":
        return "from-violet-500 to-purple-600"
      case "cancelled":
        return "from-rose-500 to-red-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const nights = Math.ceil(
    (new Date(booking?.checkOutDate).getTime() - new Date(booking?.checkIndate).getTime()) / (1000 * 3600 * 24),
  )

  // Sample hotel images
  const hotelImages = [
    "/images/image1.jpg",
    "/images/image2.jpg",
    "/images/image3.jpg",
    "/images/image4.jpg",
    "/images/image5.jpg",
  ]

  // Hotel amenities
  const hotelAmenities = [
    { icon: Wifi, name: "Free WiFi", description: "High-speed internet throughout the property" },
    { icon: Waves, name: "Swimming Pool", description: "Outdoor infinity pool with ocean view" },
    { icon: Dumbbell, name: "Fitness Center", description: "24/7 fully equipped gym" },
    { icon: Utensils, name: "Restaurant", description: "Fine dining with international cuisine" },
    { icon: Car, name: "Free Parking", description: "Complimentary valet parking" },
    { icon: Coffee, name: "Room Service", description: "24-hour in-room dining" },
    { icon: Shield, name: "Security", description: "24/7 security and concierge" },
    { icon: Globe, name: "Business Center", description: "Meeting rooms and business facilities" },
  ]

  // Room amenities
const getAmenityIcon = (amenity: string) => {
  const amenityLower = amenity.toLowerCase().replace(/[^a-z]/g, "")

  // Hotel amenities
  if (amenityLower.includes("wifi") || amenityLower === "wifi") return <Wifi className="w-4 h-4 text-white" />
  if (amenityLower.includes("parking")) return <Car className="w-4 h-4 text-white" />
  if (amenityLower.includes("breakfast")) return <Coffee className="w-4 h-4 text-white" />
  if (amenityLower.includes("pool")) return <Waves className="w-4 h-4 text-white" />
  if (amenityLower.includes("fitness") || amenityLower.includes("gym")) return <Dumbbell className="w-4 h-4 text-white" />
  if (amenityLower.includes("restaurant")) return <Coffee className="w-4 h-4 text-white" />
  if (amenityLower.includes("bar")) return <Coffee className="w-4 h-4 text-white" />
  if (amenityLower.includes("spa")) return <Waves className="w-4 h-4 text-white" />
  if (amenityLower.includes("roomservice") || amenityLower.includes("room-service")) return <User2Icon className="w-4 h-4 text-white" />

  // Room amenities
  if (amenityLower.includes("tv")) return <Star className="w-4 h-4 text-white" />
  if (amenityLower.includes("ac") || amenityLower.includes("airconditioning")) return <Star className="w-4 h-4 text-white" />
  if (amenityLower.includes("heating")) return <Star className="w-4 h-4 text-white" />
  if (amenityLower.includes("minibar")) return <Coffee className="w-4 h-4 text-white" />
  if (amenityLower.includes("safe")) return <Star className="w-4 h-4 text-white" />
  if (amenityLower.includes("desk") || amenityLower.includes("workdesk")) return <Star className="w-4 h-4 text-white" />
  if (amenityLower.includes("bathtub")) return <Star className="w-4 h-4 text-white" />
  if (amenityLower.includes("shower")) return <Star className="w-4 h-4 text-white" />
  if (amenityLower.includes("hairdryer")) return <Star className="w-4 h-4 text-white" />
  if (amenityLower.includes("toiletries")) return <Star className="w-4 h-4 text-white" />
  if (amenityLower.includes("balcony")) return <HomeIcon className="w-4 h-4 text-white" />
  if (amenityLower.includes("oceanview")) return <Waves className="w-4 h-4 text-white" />
  if (amenityLower.includes("cityview")) return <MapPin className="w-4 h-4 text-white" />
  if (amenityLower.includes("coffeemaker")) return <Coffee className="w-4 h-4 text-white" />

  return <Star className="w-4 h-4 text-white" />
}


  const basePrice = Number.parseInt(booking?.amount)
  const roomRate = Math.round(basePrice * 0.85)
  const taxes = Math.round(basePrice * 0.15)
  
if (!booking || !booking?.hotel) {
 return <>Loading .....</>
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-4 border-2 border-[#023e8a]/20 text-[#023e8a] hover:bg-[#023e8a]/10 hover:border-[#023e8a]/30 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-lg">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Booking Details
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">Complete information about your reservation</p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Hotel Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl border-0 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-5 h-5 text-[#023e8a]" />
                  <CardTitle className="text-2xl font-bold">Hotel Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hotel Images Gallery */}
                <div className="space-y-4">
                  <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden">
<Image
  src={booking?.hotel?.images?.[activeImageIndex] || hotelImages?.[activeImageIndex] || "/placeholder.svg"}
  alt={`${booking?.hotel?.name || "Hotel"} - Image ${activeImageIndex + 1}`}
  fill
  className="object-cover transition-transform duration-500"
/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {/* <div className="absolute top-4 left-4">
                      <Badge
                        className={`bg-gradient-to-r ${getStatusColor(booking?.isActive)} text-white font-semibold px-4 py-2 rounded-full text-sm shadow-lg border-0`}
                      >
                        {booking?.status.toUpperCase()}
                      </Badge>
                    </div> */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-2">{booking?.hotel.name}</h2>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5" />
                        <span className="font-medium">{booking?.hotel.Address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(parseInt(booking?.hotel.starRating))}</div>
                        <span className="font-semibold">{booking?.hotel.starRating}</span>
                      
                      </div>
                    </div>
                  </div>

                  {/* Image Thumbnails */}
                 <div className="flex gap-2 overflow-x-auto pb-2">
  {(booking?.hotel.images && booking?.hotel.images.length > 0
    ? booking?.hotel.images
    : hotelImages
  ).map((image, index) => (
    <button
      key={index}
      onClick={() => setActiveImageIndex(index)}
      className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
        activeImageIndex === index
          ? "border-[#023e8a] scale-105"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <Image
        src={image || "/placeholder.svg"}
        alt={`Thumbnail ${index + 1}`}
        fill
        className="object-cover"
      />
    </button>
  ))}
</div>

                </div>

                {/* Hotel Description */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">About This Hotel</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Experience luxury and comfort at {booking?.hotel.name}, a premier destination in {booking?.hotel.Address}.
                    Our resort offers world-class amenities, exceptional service, and breathtaking views. Whether you're
                    here for business or leisure, we provide an unforgettable experience with attention to every detail.
                  </p>
                </div>

                {/* Hotel Amenities */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">Hotel Amenities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {booking?.hotel.amenities && booking?.hotel.amenities.slice(0,9).map((amenity, index) => {
                  
                      return (
                     <div
        key={index}
        className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div className="p-2 bg-gradient-to-br from-[#023e8a] to-[#00b4d8] rounded-md flex items-center justify-center w-8 h-8">
          {getAmenityIcon(amenity)}
        </div>
        <div>
          <div className="font-medium text-gray-800 text-sm capitalize">{amenity}</div>
        </div>
      </div>

                      )
                    })}
                  </div>
                </div>

                {/* Contact & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="space-y-4">
    <div className="border-b border-gray-200 pb-1">
      <h4 className="text-base font-semibold text-gray-900">📍 Location</h4>
    </div>

    <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-gradient-to-br from-[#023e8a] to-[#00b4d8] rounded-lg w-10 h-10 flex items-center justify-center">
          <MapIcon className="w-5 h-5 text-white" />
        </div>

        <div className="text-sm text-gray-700 leading-relaxed">
          <p className="font-medium">{booking?.hotel.Address}</p>
          <p>{`${booking?.hotel.city}, ${booking?.hotel.state} ${booking?.hotel.zipCode}`}</p>
          <p>{booking?.hotel.country}</p>
        </div>
      </div>

      {/* Optional: Add a "View on Map" button */}
      <div className="mt-4">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            booking?.hotel.Address + ", " + booking?.hotel.city + ", " + booking?.hotel.country
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-medium text-[#00b4d8] hover:text-[#0077b6] transition-colors"
        >
          View on Map →
        </a>
      </div>
    </div>
  </div>
</div>

              </CardContent>
            </Card>
          </motion.div>

          {/* Room Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bed className="w-5 h-5 text-[#023e8a]" />
                  <CardTitle className="text-2xl font-bold">Room Details</CardTitle>
                </div>
              </CardHeader>

            {booking.room.map((room, index) => (
  <CardContent key={index} className="space-y-6">
    {/* Room Overview */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="relative h-64 rounded-2xl overflow-hidden">
        {booking?.hotel.images && booking?.hotel.images.length > 0 ? (
          <Image
            src={booking?.hotel.images[0]}
            alt={room.roomType}
            fill
            className="object-cover"
          />
        ) : (
          <Image
            src="/images/three.jpg"
            alt={room.roomType}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-[#023e8a] mb-2">{room.roomType}</h3>
          <p className="text-gray-600">
            Spacious and elegantly designed room featuring modern amenities and stunning ocean views.
            Perfect for a comfortable and luxurious stay.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-[#023e8a]" />
              <span className="font-semibold text-sm">Occupancy</span>
            </div>
            <span className="text-sm text-gray-600">{room.maxOccupancy} Guests</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Maximize className="w-4 h-4 text-[#023e8a]" />
              <span className="font-semibold text-sm">Size</span>
            </div>
            <span className="text-sm text-gray-600">{room.roomSize} {room.roomSizeUnit}</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Bed className="w-4 h-4 text-[#023e8a]" />
              <span className="font-semibold text-sm">Bed Type</span>
            </div>
            <span className="text-sm text-gray-600">{room.bedConfiguration}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Room Amenities */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">Room Amenities</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {room.amenities?.map((amenity, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-2 bg-gradient-to-br from-[#023e8a] to-[#00b4d8] rounded-md flex items-center justify-center w-8 h-8">
              {getAmenityIcon(amenity)}
            </div>
            <div>
              <div className="font-medium text-gray-800 text-sm capitalize">{amenity}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </CardContent>
))}

           
            </Card>
          </motion.div>

          {/* Stay Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-[#023e8a]" />
                  <CardTitle className="text-2xl font-bold">Stay Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Booking Reference */}
                <div className="p-6 bg-gradient-to-r from-[#023e8a]/5 to-[#00b4d8]/5 rounded-2xl border border-[#023e8a]/10">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Booking Reference</h3>
                    <div className="text-3xl font-bold text-[#023e8a] mb-2">{booking?.id}</div>
                    <p className="text-sm text-gray-600">Keep this reference number for your records</p>
                  </div>
                </div>

                {/* Check-in/Check-out Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                      <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">Check-in</div>
                        <div className="text-lg font-bold text-emerald-700">{formatDate(booking?.checkIndate)}</div>
                        <div className="text-sm text-gray-600">{booking?.hotel.checkInTime}</div>
                      </div>
                    </div>

                   
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-100">
                      <div className="p-4 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">Check-out</div>
                        <div className="text-lg font-bold text-violet-700">{formatDate(booking?.checkOutDate)}</div>
                        <div className="text-sm text-gray-600">{booking?.hotel.checkOutTime}</div>
                      </div>
                    </div>

                    
                  </div>
                </div>

                {/* Stay Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 text-center">
                    <div className="text-2xl font-bold text-[#023e8a] mb-1">{nights}</div>
                    <div className="text-sm text-gray-600">Night{nights > 1 ? "s" : ""}</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 text-center">
                    <div className="text-2xl font-bold text-[#023e8a] mb-1">{booking?.room[0]?.maxOccupancy}</div>
                    <div className="text-sm text-gray-600">Guest{parseInt(booking?.room[0]?.maxOccupancy) > 1 ? "s" : ""}</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 text-center">
                    <div className="text-2xl font-bold text-[#023e8a] mb-1">1</div>
                    <div className="text-sm text-gray-600">Room</div>
                  </div>
                </div>

                {/* Important Policies */}
             
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing Breakdown Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-[#023e8a]" />
                  <CardTitle className="text-2xl font-bold">Pricing Breakdown</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Detailed Pricing */}
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                    <div className="space-y-4">
                     

                      <Separator />

                      <div className="flex justify-between items-center text-xl">
                        <span className="font-bold text-gray-900">Total Amount</span>
                        <span className="font-bold text-[#023e8a]">${booking?.amount}</span>
                      </div>
                     
                    </div>
                  </div>

               
                </div>

                {/* Quick Actions */}
              
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
