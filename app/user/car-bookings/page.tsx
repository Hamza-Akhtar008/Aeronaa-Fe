"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Eye, Sparkles, Car, Download, Hash, CheckCircle, AlertCircle, X } from "lucide-react"

import { getCarBookings, getCarBookingById, deleteCarBookingById } from "@/lib/api"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"
import { formatPrice } from "@/lib/utils/currency"

export default function CarBookingsPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [carBookings, setCarBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedcurrency, setSelectedCurrency] = useState("USD")
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 })
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const fetchCarBookings = async () => {
    setLoading(true)
    try {
      const bookings = await getCarBookings()
      setCarBookings(bookings || [])
    } catch (err) {
      console.error("Failed to fetch car bookings:", err)
      toast.error("Failed to load your car bookings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCarBookings()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteCarBookingById(id);
      toast.success("Car booking canceled successfully");
      fetchCarBookings(); // Refresh the bookings list
    } catch (error) {
      toast.error("Failed to cancel booking");
      console.error("Error canceling booking:", error);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      setLoading(true);
      const booking = await getCarBookingById(id);
      setSelectedBooking(booking);
      setIsViewModalOpen(true);
    } catch (error) {
      toast.error("Failed to load booking details");
      console.error("Error loading booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCarBookings = (bookings: any[]) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )
    }

    if (bookings.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <Car className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No car bookings found</h3>
          <p className="text-gray-500 max-w-md mb-6">You haven't made any car bookings yet. Start exploring our selection of vehicles!</p>
          <Button onClick={() => window.location.href = "/"}>
            Browse Available Cars
          </Button>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-6">
        {bookings.map((booking) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border border-gray-200 shadow-md bg-white rounded-2xl">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                  {/* Left: Car Image */}
                  <div className="flex-shrink-0">
                    {booking.carRental?.images && booking.carRental.images.length > 0 ? (
                      <img src={booking.carRental.images[0]} alt="Car" className="w-36 h-24 object-cover rounded-xl border" />
                    ) : (
                      <div className="w-36 h-24 bg-gray-100 flex items-center justify-center rounded-xl border text-gray-400">
                        <Car className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  {/* Middle: Main Info */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={booking.isActive ? 'bg-orange-500 text-white font-bold px-3 py-1 rounded-full' : 'bg-gray-200 text-gray-600 px-3 py-1 rounded-full'}>
                          {booking.isActive ? 'RESERVED' : 'INACTIVE'}
                        </Badge>
                        <span className="text-xs text-gray-500">Booking Status</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {booking.carRental?.make} {booking.carRental?.model} {booking.carRental?.year ? `(${booking.carRental.year})` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{booking.carRental?.location}</span>
                      <span className="mx-2 text-gray-400">|</span>
                      <span className="text-xs">Booking ID: <span className="font-semibold">{String(booking.id).slice(0, 8)}</span></span>
                    </div>
                    <div className="flex flex-wrap gap-4 my-4">
                      {/* <div className="bg-green-50 rounded-xl px-4 py-2 flex items-center gap-2 min-w-[160px]">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-xs text-gray-500">PICKUP DATE</div>
                          <div className="font-semibold text-gray-800">{booking.carRental?.pickupDate ? formatDate(booking.carRental.pickupDate) : 'N/A'}</div>
                        </div> */}
                      {/* </div>
                      <div className="bg-purple-50 rounded-xl px-4 py-2 flex items-center gap-2 min-w-[180px]">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="text-xs text-gray-500">RENTAL PERIOD</div>
                          <div className="font-semibold text-gray-800">{booking.carRental?.pickupDate ? formatDate(booking.carRental.pickupDate) : 'N/A'} - {booking.carRental?.dropoffDate ? formatDate(booking.carRental.dropoffDate) : 'N/A'}</div>
                        </div>
                      </div> */}
                      <div className="bg-pink-50 rounded-xl px-4 py-2 flex items-center gap-2 min-w-[120px]">
                        <Car className="w-5 h-5 text-pink-600" />
                        <div>
                          <div className="text-xs text-gray-500">DAILY RATE</div>
                          <div className="font-semibold text-gray-800">${booking.carRental?.dailyRate || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-500">Booking Reference: <span className="font-bold">{booking.id}</span></div>
                      
                      <div className="text-xs text-gray-500">Total Amount</div>
                      <div className="text-3xl font-bold text-purple-600">
                                            {formatPrice(parseInt(booking.amount)  * (exchangeRates[selectedcurrency] || 1), selectedcurrency)}

                      </div>
                    </div>
                  </div>
                  {/* Right: Actions */}
                  <div className="flex flex-col gap-2 ml-0 md:ml-4 mt-4 md:mt-0">
                    {/* <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1 border-blue-500 text-blue-600 hover:bg-blue-50"
                      onClick={() => handleViewDetails(booking.id)}
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Button> */}
                    {/* <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1 border-green-500 text-green-600 hover:bg-green-50"
                      onClick={() => {}}
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button> */}
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleDelete(booking.id)}
                    >
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-6xl">
      <ToastContainer position="bottom-right" autoClose={3000} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Car Bookings</h1>
        <p className="text-gray-500">Manage your car rental bookings and reservations</p>
      </div>

      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="w-full max-w-md mb-4">
          <TabsTrigger value="all" className="flex-1">All Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {renderCarBookings(carBookings)}
        </TabsContent>
      </Tabs>

      {/* Booking Details Modal */}
      {isViewModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-xl text-blue-800 mb-2">{selectedBooking.carRental?.model || "Car Booking"}</h3>
                  <div className="flex items-center gap-1 text-sm text-blue-700">
                    <Hash className="h-3.5 w-3.5" />
                    <span>Booking ID: {selectedBooking.id}</span>
                  </div>
                </div>
                {selectedBooking.carRental && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Make</p>
                      <p className="font-medium">{selectedBooking.carRental.make}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Model</p>
                      <p className="font-medium">{selectedBooking.carRental.model}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium">{selectedBooking.carRental.year}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">License Plate</p>
                      <p className="font-medium">{selectedBooking.carRental.licensePlate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Seats</p>
                      <p className="font-medium">{selectedBooking.carRental.seats}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Daily Rate</p>
                      <p className="font-medium">${selectedBooking.carRental.dailyRate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{selectedBooking.carRental.location}</p>
                    </div>
                    {selectedBooking.carRental.images && selectedBooking.carRental.images.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Image</p>
                        <img src={selectedBooking.carRental.images[0]} alt="Car" className="w-32 h-20 object-cover rounded" />
                      </div>
                    )}
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Status</span>
                    <Badge 
                      className={`px-2.5 py-0.5 ${
                        selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {selectedBooking.status || "Active"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Price</span>
                    <span className="font-bold text-lg">
       
                                            {formatPrice(parseInt(selectedBooking.price)  * (exchangeRates[selectedcurrency] || 1), selectedcurrency)}
                      
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsViewModalOpen(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      handleDelete(selectedBooking.id);
                      setIsViewModalOpen(false);
                    }}
                  >
                    Cancel Booking
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
