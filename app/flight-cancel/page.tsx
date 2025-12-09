"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { XCircleIcon, HomeIcon, RefreshCcwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"


export default function FlightCancelPage() {
  const [bookingData, setBookingData] = useState<any | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedData = sessionStorage.getItem("fullBookingData")
    if (storedData) {
      setBookingData(JSON.parse(storedData))
      sessionStorage.removeItem("fullBookingData") // Clear data after retrieval
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <motion.div className="w-full max-w-3xl" variants={containerVariants} initial="hidden" animate="visible">
        <Card className="shadow-lg border-red-200">
          <CardHeader className="text-center bg-red-50 py-6 rounded-t-lg">
            <motion.div variants={itemVariants}>
              <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-bold text-red-700 mt-4">Booking Cancelled / Failed</CardTitle>
            </motion.div>
            <motion.p variants={itemVariants} className="text-gray-600 mt-2">
              Unfortunately, your flight booking could not be completed.
            </motion.p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {bookingData ? (
              <>
                <motion.div variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Attempted Booking Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <strong>Flight:</strong> {bookingData.ticket.from} ({bookingData.ticket.departureAirport}) →{" "}
                        {bookingData.ticket.to} ({bookingData.ticket.arrivalAirport})
                      </p>
                      <p>
                        <strong>Airline:</strong> {bookingData.ticket.airline}
                      </p>
                      <p>
                        <strong>Flight Number:</strong> {bookingData.ticket.flightNumber}
                      </p>
                      <p>
                        <strong>Class:</strong> {bookingData.ticket.flightClass}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Departure:</strong> {format(new Date(bookingData.ticket.departureDate), "MMM d, yyyy")}{" "}
                        at {format(new Date(bookingData.ticket.departureTime), "p")}
                      </p>
                      <p>
                        <strong>Arrival:</strong> {format(new Date(bookingData.ticket.arrivalDate), "MMM d, yyyy")} at{" "}
                        {format(new Date(bookingData.ticket.arrivalTime), "p")}
                      </p>
                      {bookingData.ticket.returnDate && (
                        <p>
                          <strong>Return:</strong> {format(new Date(bookingData.ticket.returnDate), "MMM d, yyyy")}
                        </p>
                      )}
                      <p>
                        <strong>Total Price:</strong> ${bookingData.totalPrice.toFixed(2)}{" "}
                        {bookingData.ticket.currency.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Passenger Information</h3>
                  {bookingData.travelers.map((traveler:any, index:any) => (
                    <div key={index} className="mb-4 pb-4 border-b last:border-b-0 border-gray-200">
                      <h4 className="font-medium text-lg mb-2">
                        Traveler {index + 1}: {traveler.firstName} {traveler.lastName} (
                        {traveler.type.charAt(0).toUpperCase() + traveler.type.slice(1)})
                      </h4>
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Date of Birth:</strong> {traveler.dateOfBirth}
                        </p>
                        <p>
                          <strong>Gender:</strong> {traveler.gender.charAt(0).toUpperCase() + traveler.gender.slice(1)}
                        </p>
                        {traveler.email && (
                          <p>
                            <strong>Email:</strong> {traveler.email}
                          </p>
                        )}
                        {traveler.phone && (
                          <p>
                            <strong>Phone:</strong> {traveler.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </>
            ) : (
              <motion.p variants={itemVariants} className="text-gray-700 text-center text-lg">
                No booking details found for this cancellation.
              </motion.p>
            )}

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700 text-white">
                <HomeIcon className="mr-2 h-4 w-4" /> Go to Home
              </Button>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <RefreshCcwIcon className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
