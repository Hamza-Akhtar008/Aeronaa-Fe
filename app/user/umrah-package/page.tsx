"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Eye, Sparkles, Hash, X, Users, Hotel, Utensils } from "lucide-react"


import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"

import { GetallUmrahBookingsbyAgent } from "@/lib/umrah_api"
import { useAuth } from "@/store/authContext"
import { formatPrice } from "@/lib/utils/currency"

export default function UmrahBookingsPage() {
    const {auth}=useAuth();
    
  const [selectedTab, setSelectedTab] = useState("all")
  const [umrahBookings, setUmrahBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
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
    if (selectedCurrency !== "USD") {
      fetchRates()
    }
  }, [selectedCurrency])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const fetchUmrahBookings = async () => {
    setLoading(true)
    try {
      const bookings = await GetallUmrahBookingsbyAgent(String(auth?.id))
      setUmrahBookings(bookings || [])
    } catch (err) {
      console.error("Failed to fetch umrah bookings:", err)
      toast.error("Failed to load your umrah bookings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUmrahBookings()
  }, [])

 

  
  const renderUmrahBookings = (bookings: any[]) => {
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
            <Sparkles className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No umrah bookings found</h3>
          <p className="text-gray-500 max-w-md mb-6">
            You haven't made any umrah bookings yet. Start exploring our umrah packages!
          </p>
          <Button onClick={() => (window.location.href = "/")}>Browse Umrah Packages</Button>
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
                  {/* Left: Package Image */}
                  <div className="flex-shrink-0">
                    {booking.umrahPurchased?.coverImage ? (
                      <img
                        src={booking.umrahPurchased.coverImage || "/placeholder.svg"}
                        alt="Package"
                        className="w-36 h-24 object-cover rounded-xl border"
                      />
                    ) : (
                      <div className="w-36 h-24 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center rounded-xl border text-blue-400">
                        <Sparkles className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  {/* Middle: Main Info */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            booking.isActive
                              ? "bg-green-500 text-white font-bold px-3 py-1 rounded-full"
                              : "bg-gray-200 text-gray-600 px-3 py-1 rounded-full"
                          }
                        >
                          {booking.isActive ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                        <span className="text-xs text-gray-500">Booking Status</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {booking.umrahPurchased?.packageName} - {booking.umrahPurchased?.packageType}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{booking.umrahPurchased?.citiesCovered?.join(", ") || "N/A"}</span>
                      <span className="mx-2 text-gray-400">|</span>
                      <span className="text-xs">
                        Booking ID: <span className="font-semibold">{String(booking.id).slice(0, 8)}</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 my-4">
                      <div className="bg-blue-50 rounded-xl px-4 py-2 flex items-center gap-2 min-w-[160px]">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-500">DURATION</div>
                          <div className="font-semibold text-gray-800">{booking.umrahPurchased?.duration} Days</div>
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-xl px-4 py-2 flex items-center gap-2 min-w-[180px]">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="text-xs text-gray-500">DATES</div>
                          <div className="font-semibold text-gray-800">
                            {booking.umrahPurchased?.startDate ? formatDate(booking.umrahPurchased.startDate) : "N/A"} -{" "}
                            {booking.umrahPurchased?.endDate ? formatDate(booking.umrahPurchased.endDate) : "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="bg-pink-50 rounded-xl px-4 py-2 flex items-center gap-2 min-w-[120px]">
                        <Users className="w-5 h-5 text-pink-600" />
                        <div>
                          <div className="text-xs text-gray-500">TRAVELERS</div>
                          <div className="font-semibold text-gray-800">{booking.traveller?.length || 0}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-500">
                        Booking Reference: <span className="font-bold">AER-{booking.id}</span>
                      </div>

                      <div className="text-xs text-gray-500">Total Amount</div>
                      <div className="text-3xl font-bold text-purple-600">
                      {formatPrice(parseInt(booking.totalPrice)  * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}


                      </div>
                    </div>
                  </div>
                  {/* Right: Actions */}
                  
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Umrah Bookings</h1>
        <p className="text-gray-500">Manage your umrah package bookings and reservations</p>
      </div>

      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="w-full max-w-md mb-4">
          <TabsTrigger value="all" className="flex-1">
            All Bookings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {renderUmrahBookings(umrahBookings)}
        </TabsContent>
      </Tabs>

      {/* Booking Details Modal */}
      {isViewModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <button onClick={() => setIsViewModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Package Header */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-xl text-blue-800 mb-2">
                    {selectedBooking.umrahPurchased?.packageName} Package -{" "}
                    {selectedBooking.umrahPurchased?.packageType}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-blue-700">
                    <Hash className="h-3.5 w-3.5" />
                    <span>Booking ID: {selectedBooking.id}</span>
                  </div>
                </div>

                {/* Package Details */}
                {selectedBooking.umrahPurchased && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{selectedBooking.umrahPurchased.duration} Days</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="font-medium">
                          {selectedBooking.umrahPurchased.startDate
                            ? formatDate(selectedBooking.umrahPurchased.startDate)
                            : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">End Date</p>
                        <p className="font-medium">
                          {selectedBooking.umrahPurchased.endDate
                            ? formatDate(selectedBooking.umrahPurchased.endDate)
                            : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Cities Covered</p>
                        <p className="font-medium">
                          {selectedBooking.umrahPurchased.citiesCovered?.join(", ") || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Hotels Section */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Hotel className="w-4 h-4" />
                        Hotel Information
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Makkah Hotel</p>
                          <p className="font-medium">{selectedBooking.umrahPurchased.makkahHotelName || "N/A"}</p>
                          <p className="text-xs text-gray-500">
                            ⭐ {selectedBooking.umrahPurchased.makkahStarRating} Stars
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedBooking.umrahPurchased.distanceFromHaram}m from Haram
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Madinah Hotel</p>
                          <p className="font-medium">{selectedBooking.umrahPurchased.medinaHotelName || "N/A"}</p>
                          <p className="text-xs text-gray-500">
                            ⭐ {selectedBooking.umrahPurchased.medinaStarRating} Stars
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedBooking.umrahPurchased.distanceFromMasjidNabwi}m from Masjid Nabwi
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Meals & Services */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Utensils className="w-4 h-4" />
                        Meals & Services
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Meals Included</p>
                          <p className="font-medium">
                            {selectedBooking.umrahPurchased.mealsIncluded?.join(", ") || "None"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Room Types</p>
                          <p className="font-medium">{selectedBooking.umrahPurchased.roomTypes || "N/A"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Flight Included</p>
                          <p className="font-medium">{selectedBooking.umrahPurchased.flightIncluded ? "Yes" : "No"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Airport Transfers</p>
                          <p className="font-medium">
                            {selectedBooking.umrahPurchased.airportTransfersIncluded ? "Yes" : "No"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Ziyarat Included</p>
                          <p className="font-medium">{selectedBooking.umrahPurchased.ziyaratIncluded ? "Yes" : "No"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Inter-City Transport</p>
                          <p className="font-medium">
                            {selectedBooking.umrahPurchased.interCityTransportType || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Pricing</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Single Pricing</p>
                          <p className="font-medium">${selectedBooking.umrahPurchased.singlePricing}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Double Sharing</p>
                          <p className="font-medium">${selectedBooking.umrahPurchased.doubleSharingPrice}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Triple Sharing</p>
                          <p className="font-medium">${selectedBooking.umrahPurchased.trippleSharingPrice}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Quad Sharing</p>
                          <p className="font-medium">${selectedBooking.umrahPurchased.quadSharingPrice}</p>
                        </div>
                      </div>
                    </div>

                    {/* Policies */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Policies</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Refund Policy</p>
                          <p className="font-medium">{selectedBooking.umrahPurchased.refundPolicy || "N/A"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Payment Terms</p>
                          <p className="font-medium">{selectedBooking.umrahPurchased.paymentTerms || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Traveller Information */}
                {selectedBooking.traveller && selectedBooking.traveller.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Traveller Information
                    </h4>
                    <div className="space-y-4">
                      {selectedBooking.traveller.map((traveller: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <p className="font-semibold text-gray-900 mb-2">
                            {traveller.firstName} {traveller.lastName}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <p>
                              <span className="text-gray-500">Gender:</span> {traveller.gender}
                            </p>
                            <p>
                              <span className="text-gray-500">Nationality:</span> {traveller.nationality}
                            </p>
                            <p>
                              <span className="text-gray-500">DOB:</span> {formatDate(traveller.dateOfBirth)}
                            </p>
                            <p>
                              <span className="text-gray-500">Passport:</span> {traveller.passportNumber}
                            </p>
                            <p>
                              <span className="text-gray-500">Email:</span> {traveller.emailAddress}
                            </p>
                            <p>
                              <span className="text-gray-500">Phone:</span> {traveller.phoneNumber}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total Price */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">Total Price</span>
                    <span className="font-bold text-2xl text-purple-600">
                      {formatPrice(parseInt(selectedBooking.totalPrice)  * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                    Close
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
