"use client"
import { useState, useEffect } from "react" // Import useEffect
import type { BookingFormData, Ticket } from "@/types/checkout"
import BookingSidebar from "./checkout/booking-sidebar"
import StepContent from "./checkout/step-content"
import ProgressIndicator from "./checkout/progress-indicator"

interface CheckoutProcessProps {
  onBack: () => void
  formdata: BookingFormData // This prop will now be used as the initial state
  ticket: Ticket
}

export default function CheckoutProcess({ onBack, formdata, ticket }: CheckoutProcessProps) {
  const [currentStep, setCurrentStep] = useState(1)
  // Initialize formData with the prop, which might already contain session data from parent
  const [formData, setFormData] = useState<BookingFormData>(formdata)
   
    // Map API response to Ticke

  // Effect to load data from session storage and set currentStep
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBookingFormData = sessionStorage.getItem("bookingFormData");
      const storedTicketData = sessionStorage.getItem("ticketData");

      if (storedBookingFormData) {
        try {
          const parsedFormData: BookingFormData = JSON.parse(storedBookingFormData)
          setFormData(parsedFormData) // Set formData from session storage
          setCurrentStep(2) // Set current step to 2 as requested

          // Clear session storage items after loading to prevent re-use
          sessionStorage.removeItem("bookingFormData")
          sessionStorage.removeItem("ticketData")
        
        } catch (e) {
          console.error("Failed to parse session storage data in CheckoutProcess:", e)
        }
      }
    }
  }, []) // Empty dependency array means this effect runs once on mount

  const handleTravelerInputChange = (travelerIndex: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      travelers: prev.travelers.map((traveler, index) =>
        index === travelerIndex ? { ...traveler, [field]: value } : traveler
      )
    }))
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1) // Use functional update for prevStep
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-lg text-gray-600">{ticket.from} to {ticket.to} • Just a few steps to confirm your flight!</p>
        </div>
        {/* Progress Steps */}
        <ProgressIndicator currentStep={currentStep} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <StepContent
              currentStep={currentStep}
              formData={formData}
              onTravelerInputChange={handleTravelerInputChange}
              onNext={nextStep}
              onPrev={prevStep}
              onBack={onBack}
              ticket={ticket}
            />
          </div>
          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <BookingSidebar formData={formData} ticket={ticket} />
          </div>
        </div>
      </div>
    </div>
  )
}
