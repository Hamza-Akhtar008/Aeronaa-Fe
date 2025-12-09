
"use client";
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Plane } from "lucide-react"
import type { BookingFormData, Ticket } from "@/types/checkout"
import { formatPrice } from "@/lib/utils/currency"
import { useEffect, useState } from "react"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"

interface BookingSidebarProps {
  formData: BookingFormData
  ticket: Ticket
}
function safeFormatDate(dateString: string | undefined, formatStr: string): string {
  const date = new Date(dateString || "")
  return isNaN(date.getTime()) ? "Invalid Date" : format(date, formatStr)
}

export default function BookingSidebar({ formData, ticket }: BookingSidebarProps) {
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
  const getClassColor = (classType: string) => {
    switch (classType.toLowerCase()) {
      case "economy":
        return "bg-blue-100 text-blue-700 border border-blue-300"
      case "business":
        return "bg-purple-100 text-purple-700 border border-purple-300"
      case "first":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300"
    }
  }

  const calculateDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure)
    const arr = new Date(arrival)
    const diff = arr.getTime() - dep.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const calculateTotal = () => {
    let total = ticket.totalPrice
   
    return total
  }

  return (
    <Card className="bg-white shadow-xl sticky top-8 border border-gray-200">
      <CardContent className="p-6 space-y-6">
        {/* Trip Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            {ticket.from} to {ticket.to}
          </h3>
          <p className="text-sm text-gray-600 mt-1 capitalize">
            {ticket.tripType} • {ticket.flightClass} • {ticket.passengerType}
          </p>
        </div>

        {/* Airline Info */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Flying with {ticket.airline}</span>
          <Badge className={getClassColor(ticket.flightClass)}>{ticket.airline}</Badge>
        </div>

        {/* Flight Card */}
        <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-900">
                {ticket.from} → {ticket.to}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">{ticket.flightNumber}</Badge>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{safeFormatDate(ticket.departureDate, "EEE, MMM dd")}</span>
            </div>
            <p>
              {safeFormatDate(ticket.departureTime, "hh:mm a")} - {safeFormatDate(ticket.arrivalTime, "hh:mm a")}
            </p>
            <p className="text-xs">Nonstop • {calculateDuration(ticket.departureTime, ticket.arrivalTime)}</p>
            <p className="text-xs text-gray-500 mt-1 capitalize">
              {ticket.flightClass} • {ticket.passengerType}
            </p>
          </div>
        </div>

        {/* Baggage Info */}
        <div className="text-sm space-y-1">
          <h4 className="font-medium text-gray-900">Included</h4>
          <p>✓ Checked baggage: {ticket.checkedBaggage}</p>
          <p>✓ Cabin baggage: {ticket.cabinnBaggage}</p>
          {ticket.seatSelectionAllowed && <p>✓ Seat selection available</p>}
          {ticket.isRefundable && <p>✓ Refundable ticket</p>}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3">
          <Separator />
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Base fare</span>
              <span className="font-medium">
              
              {formatPrice(Math.ceil(ticket.basePrice) * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}

              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Fees</span>
              <span className="font-medium">
              
              {formatPrice(Math.ceil(ticket.taxPrice) * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}

              </span>
            </div>
         
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg text-gray-900">Total</span>
            <span className="font-bold text-xl text-blue-600">
           
              {formatPrice(Math.ceil(parseInt(calculateTotal().toFixed(2))) * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}
            </span>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900 space-y-1">
          <h4 className="font-semibold text-sm">Cancellation Policy</h4>
          <p>Free cancellation until: {safeFormatDate(ticket.cancellationAllowedUntill, "MMM dd, yyyy")}</p>
          <p>
            Penalty: {ticket.currency} {ticket.cancellationPenalty.toFixed(2)}
          </p>
          <p className={ticket.isRefundable ? "text-green-700" : "text-red-700"}>
            {ticket.isRefundable ? "✓ Fully refundable" : "✗ Non-refundable"}
          </p>
        </div>

        {/* Footer Terms */}
        <div className="text-xs text-gray-500 mt-2 space-y-1">
          <p>
            By clicking "Confirm booking", you agree to the airline’s fare rules, terms & conditions and privacy policy.
          </p>
          <p>Your booking is securely processed through our platform.</p>
        </div>
      </CardContent>
    </Card>
  )
}
