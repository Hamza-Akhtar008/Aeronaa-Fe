"use client"

import { useState, useEffect } from "react"
import { Toaster } from "react-hot-toast"
import toast from "react-hot-toast"

import { SegmentsForm } from "@/components/segments-form"
import { FlightForm } from "./ticket-form"


type Step = "flight" | "segments" | "complete"

interface FlightTicketManagerProps {
  mode?: "add" | "edit"
  existingFlightId?: string
  existingFlightData?: any
  existingSegments?: any[]
}

export function FlightTicketManager({
  mode = "add",
  existingFlightId,
  existingFlightData,
  existingSegments,
}: FlightTicketManagerProps) {
  const [currentStep, setCurrentStep] = useState<Step>("flight")
  const [flightId, setFlightId] = useState<string>(existingFlightId || "")
  const [flightData, setFlightData] = useState<any | null>(existingFlightData || null)

  useEffect(() => {
    if (mode === "edit" && existingFlightId && existingFlightData) {
      setFlightId(existingFlightId)
      setFlightData(existingFlightData)
    }
  }, [mode, existingFlightId, existingFlightData])

  const handleFlightSuccess = (id: string, data: any) => {
    setFlightId(id)
    setFlightData(data)
    setCurrentStep("segments")
  }

  const handleSegmentsSuccess = () => {
    setCurrentStep("complete")
    toast.success(
      mode === "edit" ? "Flight ticket updated successfully! 🎉" : "Flight ticket created successfully! 🎉",
      {
        duration: 6000,
        icon: "✈️",
      },
    )
  }

  const handleBackToFlight = () => {
    setCurrentStep("flight")
  }

  const handleStartOver = () => {
    setCurrentStep("flight")
    setFlightId("")
    setFlightData(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-4">
            ✈️ Admin Panel
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === "edit" ? "Edit Flight Ticket" : "Flight Ticket Management"}
          </h1>
          <p className="text-gray-600">
            {mode === "edit" ? "Update flight ticket data" : "Create and manage flight ticket data"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center ${currentStep === "flight" ? "text-blue-600" : currentStep === "segments" || currentStep === "complete" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "flight" ? "bg-blue-600 text-white" : currentStep === "segments" || currentStep === "complete" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                1
              </div>
              <span className="ml-2 font-medium">{mode === "edit" ? "Edit Flight" : "Flight Info"}</span>
            </div>
            <div
              className={`w-8 h-0.5 ${currentStep === "segments" || currentStep === "complete" ? "bg-green-600" : "bg-gray-200"}`}
            />
            <div
              className={`flex items-center ${currentStep === "segments" ? "text-blue-600" : currentStep === "complete" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "segments" ? "bg-blue-600 text-white" : currentStep === "complete" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                2
              </div>
              <span className="ml-2 font-medium">{mode === "edit" ? "Edit Segments" : "Segments"}</span>
            </div>
            <div className={`w-8 h-0.5 ${currentStep === "complete" ? "bg-green-600" : "bg-gray-200"}`} />
            <div className={`flex items-center ${currentStep === "complete" ? "text-green-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "complete" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                ✓
              </div>
              <span className="ml-2 font-medium">Complete</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        {currentStep === "flight" && (
          <FlightForm
            onSuccess={handleFlightSuccess}
            mode={mode}
            initialData={existingFlightData}
            flightId={existingFlightId}
          />
        )}

        {currentStep === "segments" && flightData && (
          <SegmentsForm
            flightId={flightId}
            flightData={flightData}
            onSuccess={handleSegmentsSuccess}
            onBack={handleBackToFlight}
            mode={mode}
            existingSegments={existingSegments}
          />
        )}

        {currentStep === "complete" && (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <div className="text-green-600 text-3xl">✈️</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "edit" ? "Flight Ticket Updated Successfully!" : "Flight Ticket Created Successfully!"}
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Your flight ticket has been {mode === "edit" ? "updated" : "created"} with ID:
              <span className="font-mono bg-gray-100 px-2 py-1 rounded ml-2">{flightId}</span>
            </p>
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-4">Flight Summary</h3>
              {flightData && (
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span className="font-medium">
                      {flightData.from} → {flightData.to}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trip Type:</span>
                    <span className="font-medium capitalize">{flightData.tripType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Airline:</span>
                    <span className="font-medium">{flightData.airline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flight Number:</span>
                    <span className="font-medium">{flightData.flightNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Class:</span>
                    <span className="font-medium capitalize">{flightData.flightClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Price:</span>
                    <span className="font-medium">
                      {flightData.currency} {flightData.totalPrice}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleStartOver}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              {mode === "edit" ? "Edit Another Flight" : "Create Another Flight"}
            </button>
          </div>
        )}
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
    </div>
  )
}
