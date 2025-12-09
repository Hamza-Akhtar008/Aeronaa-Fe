"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircleIcon, HomeIcon, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import toast, { Toaster } from "react-hot-toast" // Import toast for success page
import { PostFlight, PostSegment } from "@/lib/flight_api"
import { baseURL } from "@/lib/utils/utils"
import { generateFlightInvoicePDF } from "@/lib/invoiceGenerator"
import { generatepdfflight } from "@/lib/flightpdfgenerator"
export const dynamic = "force-dynamic";

export default function FlightSuccessPage() {
  const [bookingData, setBookingData] = useState<any | null>(null)
  const [isProcessingBooking, setIsProcessingBooking] = useState(true)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const router = useRouter()

useEffect(() => {
    if (typeof window === "undefined") return;
  const storedData = sessionStorage.getItem("fullBookingData");

  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      setBookingData(parsedData);

      const postBookingDetails = async () => {
        setIsProcessingBooking(true);
        setBookingError(null);
      const rapiddata = sessionStorage.getItem("rapiddata") === "true";
 let flightId: string
 let flightpayload;
       if (rapiddata) {
     flightpayload = {
      tripType: parsedData.ticket.tripType,
      from: parsedData.ticket.from,
      to: parsedData.ticket.to,
      departureDate: new Date(parsedData.ticket.departureDate).toISOString(),
      returnDate: parsedData.ticket.returnDate ? new Date(parsedData.ticket.returnDate).toISOString() : undefined, // Handle optional returnDate
      arrivalDate: new Date(parsedData.ticket.arrivalDate).toISOString(),
      flightClass: parsedData.ticket.flightClass,
      flightNumber: parsedData.ticket.flightNumber,
      departureAirport: parsedData.ticket.departureAirport,
      arrivalAirport: parsedData.ticket.arrivalAirport,
      departureTime: new Date(parsedData.ticket.departureTime).toISOString(),
      arrivalTime: new Date(parsedData.ticket.arrivalTime).toISOString(),
      airline: parsedData.ticket.airline,
      basePrice: Math.ceil(parsedData.ticket.basePrice) || 0,
      taxPrice: Math.ceil(parsedData.ticket.taxPrice) || 0,
      totalPrice: Math.ceil(parsedData.ticket.totalPrice) || 0,
      currency: parsedData.ticket.currency,
      cancellationAllowedUntill: parsedData.ticket.cancellationAllowedUntill,
      isRefundable: parsedData.ticket.isRefundable,
      cancellationPenalty: Math.ceil(parsedData.ticket.cancellationPenalty) || 0,
      voidableUntil: new Date(parsedData.ticket.voidableUntil).toISOString(),
      passengerType: parsedData.ticket.passengerType || "Adult",
      passportRequired: parsedData.ticket.passportRequired || false,
      seatSelectionAllowed: parsedData.ticket.seatSelectionAllowed || false,
      recheckBagsRequired: parsedData.ticket.recheckBagsRequired || false,
      checkedBaggage: parsedData.ticket.checkedBaggage || "Included",
      cabbinBaggage: parsedData.ticket.cabbinBaggage || "Included",
    }
    console.log("Posting flight data (RapidAPI flow):", flightpayload)
    const flightRes = await PostFlight(flightpayload)
    flightId = flightRes.id // Assign to the declared flightId
    console.log("Flight posted successfully. Flight ID:", flightId)

    if (parsedData.ticket.segments && parsedData.ticket.segments.length > 0) {
      const segmentsToPost = parsedData.ticket.segments.map((segment: any) => ({
        ...segment,
        flight: { id: flightId }, // Correct structure for PostSegment
      }))
      console.log("Posting segment data:", segmentsToPost)
      await PostSegment(segmentsToPost) // Call PostSegment once with the array
      console.log(`All segments posted successfully for flight ID: ${flightId}`)
    }
  } else {
    // If not rapiddata, use the existing ticket ID directly
    flightId = parsedData.ticket.id
    console.log("Using existing flight ID (non-RapidAPI flow):", flightId)
    // No need to post flight or segments again, as they are assumed to exist
  }
const amount = Math.ceil(rapiddata
    ? parsedData.ticket.totalPrice
    : parsedData.ticket.totalPrice * parsedData.travelers.length)
   const firstTraveler = parsedData.travelers[0];
          if (!firstTraveler) {
            throw new Error("No traveler information available for booking.");
          }

        const bookingPayload = {
  firstName: firstTraveler.firstName,
  middleName: firstTraveler.middleName || "",
  lastName: firstTraveler.lastName,
  dob: firstTraveler.dateOfBirth,
  gender: firstTraveler.gender,
  email: firstTraveler.email || "",
  phoneNumber: firstTraveler.phone || "",
  passportNumber: firstTraveler.passportNumber || "",
  passportExpirationDate: firstTraveler.passportExpiry || "",
  country: firstTraveler.issuingCountry || "",
  nationality: firstTraveler.nationality || "",
  flight: { id: flightId },
  amount: amount,
};
  console.log("Booking payload:", bookingPayload)
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

  const bookingRes = await fetch(baseURL+"flightbooking", {
    method: "POST",
    headers: {
        Authorization: `Bearer ${token?.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingPayload),
  })

  if (bookingRes.ok) {
  
    const bookingData = await bookingRes.json()
    console.log("BookingDAta : ",bookingData);
   
    const pdfBlob = await   generatepdfflight(flightpayload, parsedData, undefined,bookingData.id);

   const formData = new FormData();
formData.append("ticket", pdfBlob, `Aeronaa_Flight_Booking_${bookingData.id}.pdf`);



const response = await fetch(`${baseURL}flightbooking/ticket/file/${bookingData.id}`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token?.access_token}`,
  
  },
  body: formData,
});

// Wait for the response body to parse
console.log("Booking successful:", response);
const result = await response.json();
  } else {
    console.error("Booking failed:", bookingRes.statusText)
  }
   setIsProcessingBooking(false);
}

      postBookingDetails();
    } catch (e) {
      console.error("FlightSuccessPage: Error parsing stored data:", e);
      setBookingError("Error loading booking details from session storage.");
      setIsProcessingBooking(false);
    }
  } else {
    console.log("FlightSuccessPage: No data found in sessionStorage.");
    setBookingError("No booking data found. Please try booking again.");
    setIsProcessingBooking(false);
  }
}, []);



  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        duration: 1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  }

  if (!bookingData || isProcessingBooking || bookingError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-semibold text-gray-700"
        >
          {isProcessingBooking
            ? "Finalizing your booking..."
            : bookingError || "Loading booking details or no data found..."}
        </motion.div>
        {bookingError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-2 text-red-500"
          >
            {bookingError}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4"
        >
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
     
        <Card className="shadow-lg border-green-200">
          <CardHeader className="text-center bg-green-50 py-6 rounded-t-lg">
            <motion.div variants={itemVariants}>
              <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-bold text-green-700 mt-4">Booking Confirmed!</CardTitle>
            </motion.div>
            <motion.p variants={itemVariants} className="text-gray-600 mt-2">
              Your flight booking has been successfully processed.
            </motion.p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {bookingData.ticket && (
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Booking Details</h2>
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
                      <strong>Departure:</strong>{" "}
                      {bookingData.ticket.departureDate &&
                        format(new Date(bookingData.ticket.departureDate), "MMM d, yyyy")}{" "}
                      at {bookingData.ticket.departureTime && format(new Date(bookingData.ticket.departureTime), "p")}
                    </p>
                    <p>
                      <strong>Arrival:</strong>{" "}
                      {bookingData.ticket.arrivalDate &&
                        format(new Date(bookingData.ticket.arrivalDate), "MMM d, yyyy")}{" "}
                      at {bookingData.ticket.arrivalTime && format(new Date(bookingData.ticket.arrivalTime), "p")}
                    </p>
                    {bookingData.ticket.returnDate && (
                      <p>
                        <strong>Return:</strong> {format(new Date(bookingData.ticket.returnDate), "MMM d, yyyy")}
                      </p>
                    )}
                    <p>
                      <strong>Total Price:</strong> ${bookingData.totalPrice?.toFixed(2)}{" "}
                      {bookingData.ticket.currency?.toUpperCase()}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {bookingData.travelers && bookingData.travelers.length > 0 && (
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Passenger Information</h3>
                {bookingData.travelers.map((traveler:any, index:any) => (
                  <div key={index} className="mb-4 pb-4 border-b last:border-b-0 border-gray-200">
                    <h4 className="font-medium text-lg mb-2">
                      Traveler {index + 1}: {traveler.firstName} {traveler.lastName} (
                      {traveler.type?.charAt(0).toUpperCase() + traveler.type?.slice(1)})
                    </h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Date of Birth:</strong> {traveler.dateOfBirth}
                      </p>
                      <p>
                        <strong>Gender:</strong> {traveler.gender?.charAt(0).toUpperCase() + traveler.gender?.slice(1)}
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
                      {traveler.passportNumber && (
                        <p>
                          <strong>Passport:</strong> {traveler.passportNumber}
                          {traveler.passportExpiry && ` (Expires: ${traveler.passportExpiry})`}
                          {traveler.issuingCountry && ` from ${traveler.issuingCountry}`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <Button 
                onClick={() => {
                  // Get booking ID from session storage or generate a new one
                  const bookingId = sessionStorage.getItem("flightBookingId") || 
                    `FLT-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
                  
                  // Generate and download the booking confirmation
                  if (bookingData) {
                    generateFlightInvoicePDF(bookingData.ticket, bookingData, undefined,bookingId);
                  }
                }} 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" /> Download Booking Confirmation
              </Button>
              
              <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700 text-white">
                <HomeIcon className="mr-2 h-4 w-4" /> Go to Home
              </Button>
            </motion.div>
          </CardContent>
        </Card>
     

        <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  )
}
