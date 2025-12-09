"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Eye, Sparkles, Plane, Download, Hash, CheckCircle, AlertCircle } from "lucide-react"

import { GetUpcomingFlightBookings, GetPastFlightBookings } from "@/lib/flight_api"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"
import { formatPrice } from "@/lib/utils/currency"
import type { Booking } from "@/types/checkout"
import { generateFlightInvoicePDF } from "@/lib/invoiceGenerator"


export default function ModernBookingInterface() {
  const [selectedTab, setSelectedTab] = useState("upcoming")
  const [UpcomingFlightBookings, setUpcomingFlightBookings] = useState<Booking[]>([])
  const [PastFlightBookings, setPastFlightBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const fetchUpcomingFlights = async () => {
    setLoading(true)
    try {
      const flightBookings: Booking[] = await GetUpcomingFlightBookings()
      flightBookings.sort(
        (a, b) => new Date(a.flight.departureDate).getTime() - new Date(b.flight.departureDate).getTime(),
      )
      setUpcomingFlightBookings(flightBookings)
    } catch (err) {
      console.error("Failed to fetch upcoming flight bookings:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPastFlights = async () => {
    setLoading(true)
    try {
      const flightBookings: Booking[] = await GetPastFlightBookings()
      flightBookings.sort(
        (a, b) => new Date(b.flight.departureDate).getTime() - new Date(a.flight.departureDate).getTime(),
      )
      setPastFlightBookings(flightBookings)
    } catch (err) {
      console.error("Failed to fetch past flight bookings:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUpcomingFlights()
    fetchPastFlights()
  }, [])

  const getBookingStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "from-emerald-500 to-teal-600"
      case "RESERVED":
        return "from-amber-500 to-orange-600"
      case "CANCELLED":
        return "from-rose-500 to-red-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getBookingStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return CheckCircle
      case "RESERVED":
        return AlertCircle
      case "CANCELLED":
        return AlertCircle
      default:
        return AlertCircle
    }
  }

  const handleViewTicket = (booking: Booking) => {
    const travelersData = [
      {
        type: "adult" as const,
        firstName: booking.firstName,
        middleName: booking.middleName,
        lastName: booking.lastName,
        dateOfBirth: booking.dob,
        gender: booking.gender,
        passportNumber: booking.passportNumber,
        passportExpiry: booking.passportExpirationDate,
        nationality: booking.nationality,
      },
    ]

    generateFlightInvoicePDF(booking.flight, { travelers: travelersData }, booking)
  }

  const handleDownloadTicket = (booking: Booking) => {
    try {
      const travelersData = [
        {
          type: "adult" as const,
          firstName: booking.firstName,
          middleName: booking.middleName,
          lastName: booking.lastName,
          dateOfBirth: booking.dob,
          gender: booking.gender,
          passportNumber: booking.passportNumber,
          passportExpiry: booking.passportExpirationDate,
          nationality: booking.nationality,
        },
      ]

      generateFlightInvoicePDF(booking.flight, { travelers: travelersData }, booking)
      toast.success("Ticket download initiated!")
    } catch (error) {
      console.error("Failed to download ticket:", error)
      toast.error("Failed to download ticket!")
    }
  }

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
                My Flight Bookings
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600">Manage your flight reservations and travel plans</p>
          </motion.div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-2 z-30 mb-8 sm:mb-12 pb-6"
            >
              <TabsList className="w-full flex flex-col sm:grid sm:grid-cols-2 gap-3 p-4">
                {[
                  { value: "upcoming", label: `Upcoming (${UpcomingFlightBookings.length})` },
                  { value: "past", label: `Past (${PastFlightBookings.length})` },
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
            </motion.div>

            <div className="mt-8 sm:mt-12">
              <TabsContent value="upcoming" className="mt-0">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-6 pt-4"
                >
                  {UpcomingFlightBookings.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No upcoming flight bookings found.</div>
                  ) : (
                    UpcomingFlightBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        variants={cardVariants}
                        whileHover="hover"
                        layout
                        className="mx-auto max-w-4xl"
                      >
                        <Card className="group bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300">
                          <CardContent className="p-6">
                            {/* Header with Status and PNR */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                              <div className="flex items-center gap-3">
                                {(() => {
                                  const StatusIcon = getBookingStatusIcon(booking.bookingStatus)
                                  return (
                                    <div
                                      className={`p-2 bg-gradient-to-r ${getBookingStatusColor(booking.bookingStatus)} rounded-lg shadow-md`}
                                    >
                                      <StatusIcon className="w-5 h-5 text-white" />
                                    </div>
                                  )
                                })()}
                                <div>
                                  <Badge
                                    className={`bg-gradient-to-r ${getBookingStatusColor(booking.bookingStatus)} text-white font-semibold px-3 py-1 rounded-full text-sm shadow-md border-0`}
                                  >
                                    {booking.bookingStatus?.toUpperCase() || "PENDING"}
                                  </Badge>
                                  <div className="text-xs text-gray-500 mt-1">Booking Status</div>
                                </div>
                              </div>

                              {/* PNR Number Display */}
                              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-xl border border-blue-100">
                                <Hash className="w-4 h-4 text-blue-600" />
                                <div>
                                  <div className="text-sm font-semibold text-blue-900">
                                    {booking.pnrNumber || "No PNR issued yet"}
                                  </div>
                                  <div className="text-xs text-blue-600">PNR Number</div>
                                </div>
                              </div>
                            </div>

                            {/* Flight Route and Price */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                              <div className="space-y-2">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                  {`${booking.flight.from} → ${booking.flight.to}`}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">
                                    {`${booking.flight.departureAirport} - ${booking.flight.arrivalAirport}`}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                  {formatPrice(
                                    booking.flight.totalPrice * (exchangeRates[selectedcurrency] || 1),
                                    selectedcurrency,
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">Total Amount</div>
                              </div>
                            </div>

                            {/* Flight Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              {[
                                {
                                  icon: Calendar,
                                  label: "Departure Date",
                                  value: formatDate(booking.flight.departureDate),
                                  color: "from-emerald-500 to-teal-600",
                                },
                                {
                                  icon: Clock,
                                  label: "Flight Time",
                                  value: `${formatDate(booking.flight.departureTime)} - ${formatDate(booking.flight.arrivalTime)}`,
                                  color: "from-violet-500 to-purple-600",
                                },
                                {
                                  icon: Plane,
                                  label: "Airline",
                                  value: booking.flight.airline,
                                  color: "from-rose-500 to-pink-600",
                                },
                              ].map(({ icon: Icon, label, value, color }, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 + i * 0.1 + 0.2 }}
                                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
                                >
                                  <div className={`p-2 bg-gradient-to-r ${color} rounded-lg shadow-sm`}>
                                    <Icon className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
                                    <div className="font-semibold text-gray-900 text-sm truncate">{value}</div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {/* Actions and Booking Reference */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                              <div className="text-sm text-gray-600">
                                Booking Reference: <span className="font-bold text-gray-900">{booking.id}</span>
                              </div>
                              <div className="flex gap-3">
                                <Button
                                  variant="outline"
                                  onClick={() => handleViewTicket(booking)}
                                  className="group border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-semibold px-4 py-2 rounded-xl transition-all duration-300"
                                >
                                  <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                  View Ticket
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleDownloadTicket(booking)}
                                  className="group border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 font-semibold px-4 py-2 rounded-xl transition-all duration-300"
                                >
                                  <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="past" className="mt-0">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-6 pt-4"
                >
                  {PastFlightBookings.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No past flight bookings found.</div>
                  ) : (
                    PastFlightBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        variants={cardVariants}
                        whileHover="hover"
                        layout
                        className="mx-auto max-w-4xl"
                      >
                        <Card className="group bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300 opacity-90">
                          <CardContent className="p-6">
                            {/* Header with Status and PNR */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                              <div className="flex items-center gap-3">
                                {(() => {
                                  const StatusIcon = getBookingStatusIcon(booking.bookingStatus)
                                  return (
                                    <div
                                      className={`p-2 bg-gradient-to-r ${getBookingStatusColor(booking.bookingStatus)} rounded-lg shadow-md`}
                                    >
                                      <StatusIcon className="w-5 h-5 text-white" />
                                    </div>
                                  )
                                })()}
                                <div>
                                  <Badge
                                    className={`bg-gradient-to-r ${getBookingStatusColor(booking.bookingStatus)} text-white font-semibold px-3 py-1 rounded-full text-sm shadow-md border-0`}
                                  >
                                    {booking.bookingStatus?.toUpperCase() || "COMPLETED"}
                                  </Badge>
                                  <div className="text-xs text-gray-500 mt-1">Booking Status</div>
                                </div>
                              </div>

                              {/* PNR Number Display */}
                              <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-slate-50 px-4 py-3 rounded-xl border border-gray-200">
                                <Hash className="w-4 h-4 text-gray-600" />
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    {booking.pnrNumber || "No PNR issued yet"}
                                  </div>
                                  <div className="text-xs text-gray-600">PNR Number</div>
                                </div>
                              </div>
                            </div>

                            {/* Flight Route and Price */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                              <div className="space-y-2">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                  {`${booking.flight.from} → ${booking.flight.to}`}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">
                                    {`${booking.flight.departureAirport} - ${booking.flight.arrivalAirport}`}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                                  {formatPrice(
                                    booking.flight.totalPrice * (exchangeRates[selectedcurrency] || 1),
                                    selectedcurrency,
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">Total Amount</div>
                              </div>
                            </div>

                            {/* Flight Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              {[
                                {
                                  icon: Calendar,
                                  label: "Departure Date",
                                  value: formatDate(booking.flight.departureDate),
                                  color: "from-gray-500 to-gray-600",
                                },
                                {
                                  icon: Clock,
                                  label: "Flight Time",
                                  value: `${formatDate(booking.flight.departureTime)} - ${formatDate(booking.flight.arrivalTime)}`,
                                  color: "from-gray-500 to-gray-600",
                                },
                                {
                                  icon: Plane,
                                  label: "Airline",
                                  value: booking.flight.airline,
                                  color: "from-gray-500 to-gray-600",
                                },
                              ].map(({ icon: Icon, label, value, color }, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 + i * 0.1 + 0.2 }}
                                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100"
                                >
                                  <div className={`p-2 bg-gradient-to-r ${color} rounded-lg shadow-sm`}>
                                    <Icon className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
                                    <div className="font-semibold text-gray-900 text-sm truncate">{value}</div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {/* Actions and Booking Reference */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                              <div className="text-sm text-gray-600">
                                Booking Reference: <span className="font-bold text-gray-900">{booking.id}</span>
                              </div>
                              <div className="flex gap-3">
                                <Button
                                  variant="outline"
                                  onClick={() => handleViewTicket(booking)}
                                  className="group border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 font-semibold px-4 py-2 rounded-xl transition-all duration-300"
                                >
                                  <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                  View Ticket
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleDownloadTicket(booking)}
                                  className="group border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 font-semibold px-4 py-2 rounded-xl transition-all duration-300"
                                >
                                  <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
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
