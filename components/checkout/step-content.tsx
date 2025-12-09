"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Plane, Shield, Smartphone, CreditCard, Check } from "lucide-react"
import TravelerDetailsStep from "@/components/checkout/steps/traveler-details-step"

import ReviewStep from "@/components/checkout/steps/review-step"
import type { BookingFormData, Ticket } from "@/types/checkout"

interface StepContentProps {
  currentStep: number
  formData: BookingFormData
  onTravelerInputChange: (travelerIndex: number, field: string, value: string) => void

  onNext: () => void
  onPrev: () => void
  onBack?: () => void
  ticket: Ticket
}

const steps = [
  { number: 1, title: "Traveler details", icon: <MapPin className="h-4 w-4" /> },
 
  { number: 2, title: "Review itinerary", icon: <Check className="h-4 w-4" /> },
]

export default function StepContent({
  currentStep,
  formData,
  onTravelerInputChange,

  onNext,
  onPrev,
  onBack,
  ticket,
}: StepContentProps) {
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <TravelerDetailsStep formData={formData} onInputChange={onTravelerInputChange} ticket={ticket} />
     
      case 2:
        return <ReviewStep formData={formData} ticket={ticket} />
      default:
        return null
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Please provide traveler information for your booking"
      case 2:
        return "Enter your payment details to complete the booking"
      case 3:
        return "Review your booking details before confirming"
      default:
        return ""
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.travelers.every(traveler => {
          const basicInfoValid = traveler.firstName && traveler.lastName && traveler.dateOfBirth && traveler.gender
          const contactInfoValid = traveler.type === "infant" || traveler.type === "toddler" || (traveler.email && traveler.phone)
          return basicInfoValid && contactInfoValid
        })
    
      
      case 2:
        return true
      default:
        return false
    }
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-6">
        {/* Step Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              {steps[currentStep - 1].icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{getStepDescription()}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={currentStep === 1 && onBack ? onBack : onPrev}
            disabled={currentStep === 1 && !onBack}
            className="flex items-center gap-2 bg-transparent border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 1 && onBack ? "Back to Flight" : "Previous"}
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </span>
            <Button
              onClick={onNext}
              disabled={currentStep === 2 || !isStepValid()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6"
            >
              {currentStep === 2 ? "Complete Booking" : "Continue"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}