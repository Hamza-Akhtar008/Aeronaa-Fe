"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, Clock, Users, MapPin, Star, Eye, X, Sparkles, Pencil } from "lucide-react"
import BookingDetailsPage from "./details/page"
import { CancelBooking, GetCancelledBookings, GetPastBookings, GetUpcommingBooking, PostaReview } from "@/lib/api"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ReviewModal } from "@/components/ui/Review-Modal"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"
import { formatPrice } from "@/lib/utils/currency"
import BookingPdfGenerator from "@/lib/hotelpdfgenerator"

// Sample data
const sampleBookings = [
  {
    id: 1,
    hotelName: "Grand Palace Resort",
    location: "Bali, Indonesia",
    rating: 4.8,
    price: "$1,250",
    checkIn: "2024-06-15",
    checkOut: "2024-06-20",
    guests: 2,
    roomType: "Ocean View Suite",
    bookingRef: "GP2024001",
    status: "confirmed",
    image: "/images/image1.jpg",
  },
  {
    id: 2,
    hotelName: "Mountain View Lodge",
    location: "Swiss Alps, Switzerland",
    rating: 4.9,
    price: "$890",
    checkIn: "2024-07-10",
    checkOut: "2024-07-15",
    guests: 4,
    roomType: "Family Cabin",
    bookingRef: "MV2024002",
    status: "confirmed",
    image: "/images/banner.jpg",
  },
]

const pastBookings = [
  {
    id: 3,
    hotelName: "City Center Hotel",
    location: "Tokyo, Japan",
    rating: 4.6,
    price: "$680",
    checkIn: "2024-03-10",
    checkOut: "2024-03-15",
    guests: 2,
    roomType: "Deluxe Room",
    bookingRef: "CC2024003",
    status: "completed",
    image: "/images/image2.jpg",
  },
]

const cancelledBookings = [
  {
    id: 4,
    hotelName: "Beach Resort",
    location: "Maldives",
    rating: 4.7,
    price: "$2,100",
    checkIn: "2024-05-01",
    checkOut: "2024-05-07",
    guests: 2,
    roomType: "Water Villa",
    bookingRef: "BR2024004",
    status: "cancelled",
    image: "/images/image3.jpg",
  },
]

export default function ModernBookingInterface() {
  const [selectedTab, setSelectedTab] = useState("upcoming")
  const [carBookings, setCarBookings] = useState<any[]>([]);
  useEffect(() => {
    // Fetch car bookings from API (mocked for now)
    fetch('/api/car-bookings')
      .then(res => res.json())
      .then(data => setCarBookings(data.bookings || []));
  }, []);
  const [showDetailsPage, setShowDetailsPage] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null)
  const [UpCommingBookings, setUpCommingBookings] = useState<UIBooking[]>([]);
  const [PastBookings, setPastBookings] = useState<UIBooking[]>([]);
  const [CancelledBooking, setCancelledBooking] = useState<UIBooking[]>([]);
  const [isRevieModalOpen, setisRevieModalOpen] = useState(false);
  const [SelectedHotelid, setSelectedHotelId] = useState<string | undefined>(undefined);
const [loading, setLoading] = useState(true);
  const [selectedcurrency,setSelectedCurrency]=useState("USD");
   const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 })


 useEffect(()=>
    {
const data = sessionStorage.getItem("userCountry");
if (data) {
  const detectedCurrency = getCurrencyByLocation(data); // data is already a string
  setSelectedCurrency(detectedCurrency);
}
    },[])


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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
 
const fetchBookings = async () => {
  try {
    const apiResponse = await GetUpcommingBooking();

    const upcoming: UIBooking[] = [];
    const cancelled: UIBooking[] = [];
console.log(apiResponse);

    setUpCommingBookings(apiResponse);
  

  } catch (err) {
    console.error("Failed to fetch bookings:", err);
  } finally {
    setLoading(false);
  }
};

   const fetchPastBookings = async () => {
  try {
    const apiResponse = await GetPastBookings();

    


    setPastBookings(apiResponse);
  

  } catch (err) {
    console.error("Failed to fetch bookings:", err);
  } finally {
    setLoading(false);
  }
};

 const fetchCancelledBookings = async () => {
  try {
    const apiResponse = await GetCancelledBookings();

  setCancelledBooking(apiResponse);

  
  

  } catch (err) {
    console.error("Failed to fetch bookings:", err);
  } finally {
    setLoading(false);
  }
}; 

useEffect(() => {

  fetchBookings();
  fetchPastBookings();
  fetchCancelledBookings();
}, []);
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
      case "upcoming":
        return "from-emerald-500 to-teal-600"
      case "completed":
        return "from-violet-500 to-purple-600"
      case "cancelled":
        return "from-rose-500 to-red-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

 const onViewDetails = (id: number) => {
    setSelectedBooking(id)
    setShowDetailsPage(true)
  }

 const onCancelBooking = async (id: number) => {
  try {
    const response = await CancelBooking(String(id));

    if (response) {
      toast.success("Booking cancelled successfully!");

      
      await  fetchBookings();
     await   fetchPastBookings();
 await fetchCancelledBookings();
        
    } else {
      toast.error("Failed to cancel booking!");
    }
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    toast.error("Booking cancel failed!");
  }

  console.log("Cancel booking:", id);
};

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  }
   const getBookingDetails = (id: number) => {
    const allBookings = [...UpCommingBookings]
    return allBookings.find((booking) => booking.id === id)
  }

  if (showDetailsPage && selectedBooking) {
    return <BookingDetailsPage booking={getBookingDetails(selectedBooking)!} onBack={() => setShowDetailsPage(false)} />
  }

const onPostReview =async (data:any) => {

  try {
    
    const response = await PostaReview(data, SelectedHotelid)
    if(response) {
      toast.success("Review posted successfully!")
    }
  } catch (error) {
    toast.error("Failed to post review!")
    
  }
   
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-grey-100 to-slate-100">
      <div className="w-full min-h-screen">
        <div className="w-full px-4 sm:px-6 md:px-8 py-6 max-w-[1440px] mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8 pb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-lg">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                My Bookings
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600">Manage your hotel reservations and travel plans</p>
          </motion.div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            {/* Fixed Tabs List with Better Spacing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-2 z-30 mb-8 sm:mb-12 pb-6"
            >

       <TabsList className="w-full flex flex-col sm:grid sm:grid-cols-3 md:grid-cols-3  lg:grid-cols-3  gap-3 p-4">
  {[
    { value: "upcoming", label: `Upcoming (${UpCommingBookings.length})` },
    { value: "past", label: `Past (${PastBookings.length})` },
    { value: "cancelled", label: `Cancelled (${CancelledBooking.length})` },

  ].map(({ value, label }) => (
    <TabsTrigger
      key={value}
      value={value}
      className="
        w-full px-6 py-4 text-sm font-semibold 
        rounded-2xl transition-all duration-300 ease-out
        data-[state=active]:bg-gradient-to-r
        data-[state=active]:from-[#023e8a] data-[state=active]:to-[#00b4d8]
        data-[state=active]:text-white data-[state=active]:shadow-lg
        data-[state=active]:transform data-[state=active]:scale-105
        data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900
        data-[state=inactive]:hover:bg-gray-100/70

        data-[state=inactive]:border data-[state=inactive]:border-gray-300
        data-[state=inactive]:outline data-[state=inactive]:outline-1 data-[state=inactive]:outline-gray-300

        data-[state=active]:border-0
        data-[state=active]:outline-none

        min-h-[48px] flex items-center justify-center
      "
    >
      {label}
    </TabsTrigger>
  ))}
</TabsList>
            {/* Car Bookings Tab */}
            <TabsContent value="car" className="mt-0">
              <motion.div
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-8 pt-4"
              >
                {carBookings.length === 0 ? (
                  <div className="text-gray-500">No car bookings found.</div>
                ) : (
                  carBookings.map((booking, idx) => (
                    <motion.div
                      key={booking.id || idx}
                      variants={cardVariants}
                      whileHover="hover"
                      layout
                      className="mx-auto max-w-6xl"
                    >
                      <div className="flex justify-center px-4 sm:px-0">
                        <Card className="group bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl rounded-3xl overflow-hidden border-0 transition-all duration-500 mx-2 sm:mx-0 max-w-xl sm:max-w-3xl w-full">
                          <CardContent className="p-0">
                            <div className="flex flex-col lg:flex-row w-full">
                              {/* Image Section */}
                              <div className="relative w-full lg:w-64 h-48 sm:h-56 lg:h-64 overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
                                <Image
                                  src={booking.carImage || "/images/image1.jpg"}
                                  alt="Car Image"
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: idx * 0.1 + 0.3 }}
                                  className="absolute top-3 left-3"
                                >
                                  <Badge
                                    className={`bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold px-3 py-1 rounded-full text-xs shadow-lg border-0`}
                                  >
                                    {(booking.status || 'Confirmed').toUpperCase()}
                                  </Badge>
                                </motion.div>
                              </div>
                              {/* Content Section */}
                              <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4">
                                <div className="flex flex-col sm:flex-row justify-between gap-3">
                                  <div className="space-y-1.5">
                                    <div className="w-full max-w-xs">
                                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                        {booking.carName}
                                      </h3>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                      <MapPin className="w-4 h-4 text-gray-400" />
                                      <span className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300 truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-[300px]">
                                        {booking.pickupLocation}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right flex flex-col justify-center">
                                    <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                      {/* Optionally show price if available */}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 sm:flex-row sm:justify-between sm:items-center">
                                  <div className="text-xs sm:text-sm text-gray-500 truncate">
                                    Pickup: <span className="font-bold text-gray-600">{booking.pickupDate}</span> | Dropoff: <span className="font-bold text-gray-600">{booking.dropoffDate}</span>
                                  </div>
                                  <div className="text-xs sm:text-sm text-gray-500 truncate">
                                    Booking Ref: <span className="font-bold text-gray-600">AER-{booking.id}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </TabsContent>


            </motion.div>

            {/* Tabs Content with Proper Spacing */}
            <div className="mt-8 sm:mt-12">
              
                <TabsContent value="upcoming" className="mt-0">
                  <motion.div
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-8 pt-4"
                  >
                    {UpCommingBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        variants={cardVariants}
                        whileHover="hover"
                        layout
                        className="mx-auto max-w-6xl"
                      >
         <div className="flex justify-center px-4 sm:px-0">
  <Card className="group bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl rounded-3xl overflow-hidden border-0 transition-all duration-500 mx-2 sm:mx-0 max-w-xl sm:max-w-5xl w-full">
    <CardContent className="p-0">
      <div className="flex flex-col lg:flex-row w-full">
        {/* Image Section */}
        <div className="relative w-full lg:w-64 h-48 sm:h-56 lg:h-64 overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
         
         {booking.hotel.images ?(  <Image
  src={booking.hotel.images[1]}
  alt="Hotel Image"
  fill
  className="object-cover transition-transform duration-700 group-hover:scale-110"
/>):(  <Image
  src="/images/image1.jpg"
  alt="Hotel Image"
  fill
  className="object-cover transition-transform duration-700 group-hover:scale-110"
/>)}
         
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="absolute top-3 left-3"
          >
            <Badge
              className={`bg-gradient-to-r ${getStatusColor("upcoming")} text-white font-semibold px-3 py-1 rounded-full text-xs shadow-lg border-0`}
            >
              {"upcoming".toUpperCase()}
            </Badge>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="space-y-1.5">
        <div className="w-full max-w-xs"> {/* Or max-w-sm/md as needed */}
  <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300 truncate whitespace-nowrap overflow-hidden text-ellipsis">
    {booking.hotel.name}
  </h3>
</div>
             <div className="flex items-center gap-1.5 text-gray-500 text-sm">
  <MapPin className="w-4 h-4 text-gray-400" />
  <span className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300 truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-[300px]">
    {booking.hotel?.Address}
  </span>
</div>
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(parseInt(booking.hotel.starRating))}</div>
                <span className="text-gray-700 font-semibold text-sm">{booking.hotel.starRating}</span>
              </div>
            </div>
            <div className="text-right flex flex-col justify-center">
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              
                {formatPrice(parseInt(booking.amount)  * (exchangeRates[selectedcurrency] || 1), selectedcurrency)}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">Total amount</div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                icon: Calendar,
                label: "Check-in",
                value: formatDate(booking.checkIndate),
                color: "from-emerald-500 to-teal-600",
              },
              {
                icon: Clock,
                label: "Check-out",
                value: formatDate(booking.checkOutDate),
                color: "from-violet-500 to-purple-600",
              },
              
                
            ].map(({ icon: Icon, label, value, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + i * 0.1 + 0.4 }}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className={`p-2 bg-gradient-to-r ${color} rounded-xl shadow-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{label}</div>
                  <div className="text-gray-600 text-xs truncate">{value}</div>
                </div>
              </motion.div>
            ))}
       
          </div>

          {/* Action Section */}
          <div className="flex flex-col gap-4 pt-4 border-t border-gray-100 sm:flex-row sm:justify-between sm:items-center sm:gap-6">
            <div className="text-sm text-gray-600 order-2 sm:order-1 truncate">
              Booking Ref: <span className="font-bold text-gray-900">AER-{booking.id}</span>
            </div>
            <div className="flex flex-col gap-3 order-1 sm:order-2 sm:flex-row">
              <BookingPdfGenerator booking={booking}/>
              <Button
                variant="outline"
                onClick={() => onViewDetails(booking.id)}
                className="group border-2 border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 font-semibold px-5 py-2 rounded-xl transition-all duration-300"
              >
                <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                View Details
              </Button>

           
                  {/* Post Review Button */}
   

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="group border-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-semibold px-5 py-2 rounded-xl transition-all duration-300"
                  >
                    <X className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    Cancel Booking
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl border-0 shadow-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">Cancel Booking</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                      Are you sure you want to cancel this booking? This action cannot be undone and cancellation fees may apply.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Keep Booking</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 rounded-xl"
                      onClick={() => onCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
        
    

            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</div>


                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>

                <TabsContent value="past" className="mt-0">
                  <motion.div
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-8 pt-4"
                  >
                    {PastBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        variants={cardVariants}
                        whileHover="hover"
                        layout
                        className="mx-auto max-w-6xl"
                      >
                       <Card className="group bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl rounded-3xl overflow-hidden border-0 transition-all duration-500 mx-4 sm:mx-auto max-w-lg sm:max-w-4xl">
  <CardContent className="p-0">
    <div className="flex flex-col lg:flex-row w-full">
      {/* Image */}
      <div className="relative w-full lg:w-72 h-48 sm:h-56 lg:h-64 overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
        <Image
          src={"/images/image1.jpg"}
          alt={booking.hotel.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="absolute top-3 left-3"
        >
          <Badge
            className={`bg-gradient-to-r ${getStatusColor("completed")} text-white font-semibold px-3 py-1 rounded-full text-xs sm:text-sm shadow-lg border-0`}
          >
            {"completed".toUpperCase()}
          </Badge>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-2">
             <div className="w-full max-w-xs"> {/* Or max-w-sm/md as needed */}
  <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300 truncate whitespace-nowrap overflow-hidden text-ellipsis">
    {booking.hotel.name}
  </h3>
</div>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
  <MapPin className="w-4 h-4 text-gray-400" />
  <span className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300 truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-[300px]">
    {booking.hotel?.Address}
  </span>
</div>
            <div className="flex items-center gap-1.5">
              <div className="flex">{renderStars(parseInt(booking.hotel.starRating))}</div>
              <span className="text-gray-700 font-semibold text-sm">{booking.hotel.starRating}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          
               {formatPrice(parseInt(booking.amount)  * (exchangeRates[selectedcurrency] || 1), selectedcurrency)}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium">Total amount</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: Calendar,
              label: "Check-in",
              value: formatDate(booking.checkIndate),
              color: "from-emerald-500 to-teal-600",
            },
            {
              icon: Clock,
              label: "Check-out",
              value: formatDate(booking.checkOutDate),
              color: "from-violet-500 to-purple-600",
            },
            {
              icon: Users,
              label: `${booking.room[0]?.maxOccupancy} Guests`,
              value: booking.room[0]?.roomType,
              color: "from-rose-500 to-pink-600",
            },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + i * 0.1 + 0.4 }}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100"
            >
              <div className={`p-2 bg-gradient-to-r ${color} rounded-lg shadow-md`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{label}</div>
                <div className="text-gray-600 text-xs truncate">{value}</div>
              </div>


         
            </motion.div>
            
          ))}
        </div>
            <Button
        variant="outline"
        onClick={() => {setisRevieModalOpen(true)

setSelectedHotelId(booking.hotel.id);

        }}
        className="group flex items-center gap-2 border-2 border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 font-semibold px-4 py-2 rounded-xl transition-all duration-300 overflow-hidden relative"
      >
        <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
        <span className="max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Post Review
        </span>
      </Button>

      <ReviewModal
        open={isRevieModalOpen}
        onOpenChange={setisRevieModalOpen}
        onSubmit={(data) => {
          onPostReview(data);
          setisRevieModalOpen(false);
        }}
      />

        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 sm:flex-row sm:justify-between sm:items-center">
          <div className="text-xs sm:text-sm text-gray-600 truncate">
            Booking Ref: <span className="font-bold text-gray-900">AER-{booking.id}</span>
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>

                <TabsContent value="cancelled" className="mt-0">
                  <motion.div
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-8 pt-4"
                  >
                    {CancelledBooking.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        variants={cardVariants}
                        whileHover="hover"
                        layout
                        className="mx-auto max-w-6xl"
                      >
                     <Card className="group bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl rounded-3xl overflow-hidden border-0 transition-all duration-500 opacity-75 mx-4 sm:mx-auto max-w-lg sm:max-w-3xl">
  <CardContent className="p-0">
    <div className="flex flex-col lg:flex-row w-full">
      {/* Image */}
      <div className="relative w-full lg:w-72 h-48 sm:h-56 lg:h-64 overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
        <Image
           src={ "/images/image2.jpg"}
          alt={ "/images/image2.jpg"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="absolute top-3 left-3"
        >
          <Badge
            className={`bg-gradient-to-r ${getStatusColor("cancelled")}  text-white font-semibold px-3 py-1 rounded-full text-xs sm:text-sm shadow-lg border-0`}
          >
            {"cancelled".toUpperCase()}
          </Badge>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-2">
           <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300 truncate whitespace-nowrap overflow-hidden text-ellipsis">
    {booking.hotel.name}
  </h3>
           <div className="flex items-center gap-1.5 text-gray-500 text-sm">
  <MapPin className="w-4 h-4 text-gray-400" />
  <span className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300 truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-[300px]">
    {booking.hotel?.Address}
  </span>
</div>
            <div className="flex items-center gap-1.5">
              <div className="flex">{renderStars(parseInt(booking.hotel?.starRating))}</div>
              <span className="text-gray-600 font-semibold text-sm">{booking.hotel?.starRating}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-gray-500 line-through">
              
               {formatPrice(parseInt(booking.amount)  * (exchangeRates[selectedcurrency] || 1), selectedcurrency)}
            </div>
            <div className="text-xs sm:text-sm text-gray-400 font-medium">Cancelled</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 sm:flex-row sm:justify-between sm:items-center">
          <div className="text-xs sm:text-sm text-gray-500 truncate">
            Booking Ref: <span className="font-bold text-gray-600">AER-{booking?.id}</span>
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              
            </div>
          </Tabs>
        </div>
      </div>

 

        <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
