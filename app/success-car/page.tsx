"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "@/store/authContext"
import {  createCarBooking } from "@/lib/api" // ⬅️ assume you have an API function like BookRoom

interface CarBooking {
  name: string
  email: string
  phoneNo: string
  pickUplocation: string
  dropOffLocation: string
  pickUpTime: string
  returnTime: string
  carRental: {
    id: string
  }
  amount: number
}

export default function CarBookingSuccess() {
  const { auth } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [carBooking, setCarBooking] = useState<CarBooking | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadCarBooking = async () => {
    try {
      const carBookingStr = sessionStorage.getItem("CarBooking")

      if (!carBookingStr) {
        setIsLoading(false)
        return
      }

      const bookingData: CarBooking = JSON.parse(carBookingStr)

      // Generate booking reference (could be from query or fallback)
     
     let   bookingRef = `CAR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      

      const bookingKey = `car_booking_posted_${bookingRef}`

      // Prevent duplicate posting
      if (!localStorage.getItem(bookingKey)) {
        await createCarBooking(bookingData) // ⬅️ call your backend API
        localStorage.setItem(bookingKey, "true")

        // Clear sessionStorage after successful post
        sessionStorage.removeItem("CarBooking")
      }

      setCarBooking(bookingData)
      setIsLoading(false)
    } catch (error) {
      console.error("Car booking confirmation error:", error)
      toast.error("Failed to confirm car booking. Please contact support.")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCarBooking()
     setTimeout(() => {
          window.location.href = '/user/car-bookings';
        }, 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-6 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Car Booking Successful!</h2>
      <p className="text-gray-600 mb-4">
        {auth ? "Redirecting to your car bookings..." : "Thank you for booking with us."}
      </p>
      {!isLoading && carBooking && (
        <div className="mt-4 text-left mx-auto max-w-md p-4 border rounded-lg shadow">
          <p>
            <strong>Name:</strong> {carBooking.name}
          </p>
          <p>
            <strong>Email:</strong> {carBooking.email}
          </p>
          <p>
            <strong>Phone:</strong> {carBooking.phoneNo}
          </p>
          <p>
            <strong>Pickup:</strong> {carBooking.pickUplocation}
          </p>
          <p>
            <strong>Dropoff:</strong> {carBooking.dropOffLocation}
          </p>
          <p>
            <strong>Pickup Time:</strong> {carBooking.pickUpTime}
          </p>
          <p>
            <strong>Return Time:</strong> {carBooking.returnTime}
          </p>
          <p>
            <strong>Amount Paid:</strong> {carBooking.amount} USD
          </p>
        </div>
      )}
    </div>
  )
}
