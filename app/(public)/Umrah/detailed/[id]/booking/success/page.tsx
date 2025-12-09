"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Mail, Calendar, Users, CreditCard, ArrowRight, Loader2 } from "lucide-react"
import { baseURL } from "@/lib/utils/utils"

interface BookingData {
  packageSelected: Array<{
    packageName: string
    price: number
  }>
  traveller: Array<{
    firstName: string
    lastName: string
    emailAddress: string
    phoneNumber: string
    gender: string
    dateOfBirth: string
    nationality: string
    passportNumber: string
    passportExpiryDate: string
    specialRequests: string
  }>
  totalPrice: number
  umrahPurchased: number
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const [postSuccess, setPostSuccess] = useState(false)
  const [bookingRef, setBookingRef] = useState("")

  useEffect(() => {
    const loadBookingData = () => {
      try {
        const storedData = localStorage.getItem("umrahBooking")
        if (storedData) {
          const parsedData: BookingData = JSON.parse(storedData)
          setBookingData(parsedData)

          // Generate booking reference
          const ref = `UMR-${Date.now()}`
          setBookingRef(ref)

          // Post to backend
          postBookingData(parsedData, ref)
        }
      } catch (error) {
        console.error("Error loading booking data:", error)
      }
    }

    const postBookingData = async (data: BookingData, ref: string) => {
      setIsPosting(true)
      try {
         const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
        // Replace with your actual backend endpoint
        const response = await fetch(baseURL+"umrahbookings", {
          method: "POST",
          
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      
          body: JSON.stringify({
            ...data,
            bookingReference: ref,
            paymentStatus: "completed",
            createdAt: new Date().toISOString(),
          }),
        })

        if (response.ok) {
          setPostSuccess(true)
          // Clear localStorage after successful submission
          localStorage.removeItem("bookingData")
        } else {
          console.error("Failed to post booking data")
        }
      } catch (error) {
        console.error("Error posting booking data:", error)
      } finally {
        setIsPosting(false)
      }
    }

    loadBookingData()
  }, [])

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/80 p-8 rounded-3xl border border-emerald-200/50 shadow-2xl">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-emerald-800 text-center font-medium">Loading booking details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="backdrop-blur-xl bg-white/90 p-10 rounded-3xl border border-emerald-200/50 shadow-2xl">
              <CheckCircle className="h-24 w-24 text-emerald-500 mx-auto mb-6 drop-shadow-lg" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                Payment Successful!
              </h1>
              <p className="text-xl text-slate-600 mb-6 font-medium">
                Your Umrah package has been booked and payment confirmed
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 text-lg px-6 py-2 font-semibold">
                  Booking Confirmed
                </Badge>
                {isPosting && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-sm px-4 py-2">
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    Processing...
                  </Badge>
                )}
                {postSuccess && (
                  <Badge className="bg-green-100 text-green-700 border-green-300 text-sm px-4 py-2">✓ Saved</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <Card className="backdrop-blur-xl bg-white/90 border-emerald-200/50 shadow-2xl mb-8 rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-800 text-xl">
                <CreditCard className="h-6 w-6 text-emerald-600" />
                Booking Details
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Booking Reference:{" "}
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-300 font-mono text-sm"
                >
                  {bookingRef}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">{bookingData.packageSelected[0]?.packageName.toLocaleUpperCase()} SHARING</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">
                    {bookingData.traveller.length} Traveler{bookingData.traveller.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-2xl text-white shadow-lg">
                <p className="text-white font-bold text-2xl">Total Paid: ${bookingData.totalPrice} USD</p>
                <p className="text-emerald-100 font-medium">Payment processed securely via Stripe</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 text-lg">Traveler Information:</h4>
                {bookingData.traveller.map((traveler, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-slate-50 to-emerald-50 p-5 rounded-2xl border border-emerald-100"
                  >
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <p className="text-slate-700">
                        <span className="text-slate-900 font-semibold">Name:</span> {traveler.firstName}{" "}
                        {traveler.lastName}
                      </p>
                      <p className="text-slate-700">
                        <span className="text-slate-900 font-semibold">Email:</span> {traveler.emailAddress}
                      </p>
                      <p className="text-slate-700">
                        <span className="text-slate-900 font-semibold">Phone:</span> {traveler.phoneNumber}
                      </p>
                      <p className="text-slate-700">
                        <span className="text-slate-900 font-semibold">Nationality:</span> {traveler.nationality}
                      </p>
                      <p className="text-slate-700">
                        <span className="text-slate-900 font-semibold">Passport:</span> {traveler.passportNumber}
                      </p>
                      <p className="text-slate-700">
                        <span className="text-slate-900 font-semibold">DOB:</span>{" "}
                        {new Date(traveler.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                    {traveler.specialRequests && (
                      <p className="text-slate-700 mt-3 text-sm">
                        <span className="text-slate-900 font-semibold">Special Requests:</span>{" "}
                        {traveler.specialRequests}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
        

          {/* Action Buttons */}
          <div className="space-y-6">
         

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              <Link href="/">
                <Button variant="ghost" className="text-slate-600 hover:text-emerald-700 hover:bg-emerald-50">
                  Return to Homepage
                </Button>
              </Link>
            </div>
          </div>

          {/* Support Information */}
       
        </div>
      </div>
    </div>
  )
}
