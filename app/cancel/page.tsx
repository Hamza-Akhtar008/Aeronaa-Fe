"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, AlertTriangle, RefreshCw, ArrowLeft, Home, CreditCard, Phone, Mail, Clock } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface FailureDetails {
  errorCode: string
  errorMessage: string
  bookingAttemptId: string
  hotel: {
    name: string
    address: string
  }
  dates: {
    checkIn: string
    checkOut: string
    nights: number
  }
  totalAmount: number
}

export default function BookingFailurePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [failureDetails, setFailureDetails] = useState<FailureDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Simulate fetching failure details from URL params
    const mockFailureDetails: FailureDetails = {
      errorCode: searchParams.get("error") || "payment_failed",
      errorMessage: searchParams.get("message") || "Your payment could not be processed. Please try again.",
      bookingAttemptId: searchParams.get("attemptId") || `BA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      hotel: {
        name: searchParams.get("hotel") || "Grand Palace Resort",
        address: searchParams.get("address") || "Jl. Raya Ubud, Bali, Indonesia",
      },
      dates: {
        checkIn: searchParams.get("checkIn") || "2024-03-15",
        checkOut: searchParams.get("checkOut") || "2024-03-18",
        nights: Number.parseInt(searchParams.get("nights") || "3"),
      },
      totalAmount: Number.parseInt(searchParams.get("total") || "605"),
    }

    setTimeout(() => {
      setFailureDetails(mockFailureDetails)
      setIsLoading(false)
    }, 1000)
  }, [searchParams])

  const getErrorDetails = (errorCode: string) => {
    switch (errorCode) {
      case "card_declined":
        return {
          title: "Card Declined",
          description:
            "Your card was declined by your bank. Please try a different payment method or contact your bank.",
          icon: <CreditCard className="w-6 h-6 text-red-600" />,
          suggestions: [
            "Try a different credit or debit card",
            "Contact your bank to authorize the transaction",
            "Check if your card has sufficient funds",
            "Verify your card details are correct",
          ],
        }
      case "insufficient_funds":
        return {
          title: "Insufficient Funds",
          description: "Your card doesn't have enough funds to complete this transaction.",
          icon: <CreditCard className="w-6 h-6 text-red-600" />,
          suggestions: [
            "Use a different payment method",
            "Add funds to your account",
            "Try a different card",
            "Contact your bank for assistance",
          ],
        }
      case "expired_card":
        return {
          title: "Expired Card",
          description: "The card you're trying to use has expired.",
          icon: <Clock className="w-6 h-6 text-red-600" />,
          suggestions: [
            "Use a different, valid card",
            "Contact your bank for a replacement card",
            "Try a different payment method",
          ],
        }
      case "network_error":
        return {
          title: "Network Error",
          description: "There was a problem connecting to our payment processor. Please try again.",
          icon: <RefreshCw className="w-6 h-6 text-red-600" />,
          suggestions: [
            "Check your internet connection",
            "Try again in a few minutes",
            "Refresh the page and retry",
            "Contact support if the problem persists",
          ],
        }
      default:
        return {
          title: "Payment Failed",
          description: "We couldn't process your payment. Please try again or use a different payment method.",
          icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
          suggestions: [
            "Try again with the same payment method",
            "Use a different credit or debit card",
            "Contact your bank if the problem persists",
            "Reach out to our customer support",
          ],
        }
    }
  }

  const handleRetryPayment = () => {
    setRetryCount((prev) => prev + 1)
    toast.info("Redirecting to payment...")

    // Simulate redirect back to payment with booking details preserved
    setTimeout(() => {
      const params = new URLSearchParams({
        hotel: failureDetails?.hotel.name || "",
        checkIn: failureDetails?.dates.checkIn || "",
        checkOut: failureDetails?.dates.checkOut || "",
        total: failureDetails?.totalAmount.toString() || "",
        retry: "true",
      })
      router.push(`/hotel/1/booking?step=5&${params.toString()}`)
    }, 1500)
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleStartOver = () => {
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading error details...</p>
        </div>
      </div>
    )
  }

  if (!failureDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center py-8">
            <p className="text-gray-600 mb-4">Error details not found.</p>
            <Button onClick={() => router.push("/")} className="bg-[#023e8a] hover:bg-[#023e8a]/90">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const errorDetails = getErrorDetails(failureDetails.errorCode)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Failure Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Payment Failed</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We couldn't complete your booking. Don't worry, no charges were made to your account.
          </p>
        </div>

        {/* Error Details */}
        <Card className="mb-8 border-red-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-red-800">
              {errorDetails.icon}
              {errorDetails.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-200 bg-red-50 mb-4">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{errorDetails.description}</AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="font-medium text-gray-900">What you can try:</p>
              <ul className="space-y-1">
                {errorDetails.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-[#023e8a] mt-1">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

         
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
      

          {/* Support Information */}
      
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
         

          <Button
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center justify-center gap-2 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>

          <Button
            onClick={handleStartOver}
            variant="outline"
            className="flex items-center justify-center gap-2 bg-transparent"
          >
            <Home className="w-4 h-4" />
            Start Over
          </Button>
        </div>

        {/* Retry Limit Warning */}
        {retryCount >= 2 && retryCount < 3 && (
          <Alert className="mt-6 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              You have {3 - retryCount} attempt{3 - retryCount !== 1 ? "s" : ""} remaining. Please ensure your payment
              details are correct before trying again.
            </AlertDescription>
          </Alert>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
