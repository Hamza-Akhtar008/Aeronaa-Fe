"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BookingFormData, Ticket } from "@/types/checkout"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { Toaster } from "react-hot-toast"
import { loadStripe } from "@stripe/stripe-js"
import { baseURL } from "@/lib/utils/utils"
import { Download } from 'lucide-react'
import { generateFlightInvoicePDF } from "@/lib/invoiceGenerator"
import { useAuth } from "@/store/authContext"
import { AuthPromptModal } from "./auth-prompt-modal"
import { getCountryByCurrency } from "@/lib/utils/getcountry"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"
import { formatPrice } from "@/lib/utils/currency"

interface ReviewStepProps {
  formData: BookingFormData
  ticket: Ticket
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_live_51RNDLyLaGWi6LnLvHm4QpTVVre3bPTAmyIHFG6v6fDRsGzicvlKTkgOR5KxuqDpstIU08FicT115Ym9RVBmiOiXR00DqkkZGcf",
)

export default function ReviewStep({ formData, ticket }: ReviewStepProps) {
  const { auth, loading } = useAuth()
  const [showAuthPromptModal, setShowAuthPromptModal] = useState(false) // State to control modal visibility
   const [selectedCurrency, setSelectedCurrency] = useState("USD");
         const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 });
      useEffect(() => {
          let country = localStorage.getItem("userCountry") || localStorage.getItem("usercountry") || sessionStorage.getItem("userCountry") || sessionStorage.getItem("usercountry");
          if (country) {
            const currency = getCurrencyByLocation(country);
            setSelectedCurrency(currency);
          } else {
            setSelectedCurrency("USD");
          }
        }, []);
      
        // Fetch exchange rates for selected currency
        useEffect(() => {
    
          if (selectedCurrency === "USD") {
            setExchangeRates({ USD: 1 });
            return;
          }
          const fetchRates = async () => {
            try {
              const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
              const data = await response.json();
              setExchangeRates({ ...data.rates, USD: 1 });
            } catch (error) {
              setExchangeRates({ USD: 1 });
            }
          };
          fetchRates();
          
    
        }, [selectedCurrency]);
  const basePrice = ticket.basePrice || 0
  const taxPrice = ticket.taxPrice || 0
  const total = (basePrice + taxPrice).toFixed(2)

  const handleConfirmBooking = async () => {
    if (!auth) {
      setShowAuthPromptModal(true) // Show the authentication prompt modal
      return // Stop further execution
    }

    const loadingToast = toast.loading("Booking ticket...")
    const fullBookingData = {
      ...formData,
      ticket,
      totalPrice: Number.parseFloat(total),
    }

    try {
      // Log the full booking data to make sure it's correct
      console.log("Booking data to save:", fullBookingData)

      // Saving data to session storage (already done if not authenticated, but keep for consistency)
      sessionStorage.setItem("fullBookingData", JSON.stringify(fullBookingData))

      // Check if data is stored successfully
      const storedData = sessionStorage.getItem("fullBookingData")
      console.log("Stored booking data from sessionStorage:", storedData)

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe.js failed to load. Check your publishable key.")
      }
      console.log("Stripe initialized:", stripe)

      const randomBookingId = Math.floor(Math.random() * 1000000)
      const totalPriceNumeric = Number.parseFloat(total)
      const successUrl = `${window.location.origin}/flight-success?bookingId=${randomBookingId}`
      const cancelUrl = `${window.location.origin}/flight-cancel`

      const requestBody = {
        amount: Math.ceil(totalPriceNumeric * 100),
        currency: "usd",
        successUrl,
        cancelUrl,
        customerEmail: formData.travelers[0]?.email || "guest@example.com",
        bookingId: randomBookingId,
      }
      console.log("Request body for checkout:", requestBody)

      const res = await fetch(baseURL + "bookings/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to create Stripe session.")
      }

      const data = await res.json()
      console.log("Backend response for checkout:", data)

      if (!data.url) {
        throw new Error("Stripe session URL not found in response.")
      }

      toast.dismiss(loadingToast)

      // Generate PDF before redirecting to payment
      const bookingId = `FLT-${randomBookingId.toString().padStart(6, "0")}`
      // Store the booking ID for future reference
      sessionStorage.setItem("flightBookingId", bookingId)

      // // Generate the PDF (in a real app, you might want to do this after payment success)
      // generateFlightInvoicePDF(ticket, formData, undefined,bookingId)

      // Give user some time to save the PDF before redirecting
      setTimeout(() => {
        // Redirect to Stripe checkout page
        window.location.href = data.url
      }, 1500)
    } catch (error) {
      console.error("Booking and Stripe checkout error:", error)
      toast.dismiss(loadingToast)
      toast.error(`Booking failed: ${(error as Error).message || "An unexpected error occurred."}`, {
        duration: 5000,
        icon: "❌",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-6">Review your booking</h3>
      </div>
      <div className="space-y-6">
        {/* Flight Summary */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-3">Flight Details</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">
              {ticket.from} ({ticket.departureAirport}) → {ticket.to} ({ticket.arrivalAirport})
            </span>
            <Badge variant="destructive" className="bg-red-600">
              {ticket.airline}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">
            {format(new Date(ticket.departureDate), "EEEE, MMMM d")} •{" "}
            {format(new Date(ticket.departureTime), "p")} -{" "}
            {format(new Date(ticket.arrivalTime), "p")}
          </p>
          <p className="text-sm text-gray-600 capitalize">
            {ticket.flightClass} Class • Flight #{ticket.flightNumber}
          </p>
        </div>
        {/* Passenger Details */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-3">Passenger Information</h4>
          {formData.travelers.map((traveler, index) => (
            <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
              <h5 className="font-medium mb-2">
                Traveler {index + 1} - {traveler.type.charAt(0).toUpperCase() + traveler.type.slice(1)}
              </h5>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Name:</strong> {traveler.firstName} {traveler.middleName} {traveler.lastName}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {traveler.dateOfBirth}
                </p>
                <p>
                  <strong>Gender:</strong> {traveler.gender.charAt(0).toUpperCase() + traveler.gender.slice(1)}
                </p>
                {traveler.type !== "infant" && traveler.type !== "toddler" && (
                  <>
                    <p>
                      <strong>Email:</strong> {traveler.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {traveler.phone}
                    </p>
                  </>
                )}
                {traveler.passportNumber && (
                  <p>
                    <strong>Passport:</strong> {traveler.passportNumber}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Billing Information */}
        {/* Trip Protection */}
        {/* Booking Summary */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-semibold mb-3">Booking Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>
                Flight ({formData.travelers.length} traveler{formData.travelers.length > 1 ? "s" : ""})
              </span>
              <span>
                    {formatPrice(Math.ceil(basePrice) * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}

              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxes and fees</span>
              <span>
                    {formatPrice(Math.ceil(taxPrice) * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}
              </span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                    {formatPrice(Math.ceil(parseInt(total)) * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}
                <span></span>
              </div>
            </div>
          </div>
        </div>
        {/* Terms and Conditions */}
        <div className="text-sm text-gray-600">
          <p>
            By clicking "Confirm booking", you agree to the airline's fare rules and Booking.com's Terms and Conditions
            and Privacy Policy. Aeronaa's Terms and Conditions and Privacy Policy also apply.
          </p>
          <p className="mt-1 text-xs text-blue-600">
            <Download className="h-3 w-3 inline-block mr-1" />A booking confirmation will be automatically generated for
            download.
          </p>
        </div>
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 flex items-center justify-center gap-2"
          onClick={handleConfirmBooking}
        >
          Confirm booking
        </Button>
      </div>
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
      {/* Render the AuthPromptModal */}
      <AuthPromptModal
        isOpen={showAuthPromptModal}
        onClose={() => setShowAuthPromptModal(false)}
        formData={formData}
        ticket={ticket}
      />
    </div>
  )
}
