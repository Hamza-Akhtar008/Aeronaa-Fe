"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Share2, Plane, Wifi, Monitor, Utensils, Headphones, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"

interface FlightSummaryProps {
  onContinueToCheckout: () => void
}

export default function FlightSummary({ onContinueToCheckout }: FlightSummaryProps) {
  const [isMainFlightExpanded, setIsMainFlightExpanded] = useState(false)
  const [isSidebarFlightExpanded, setIsSidebarFlightExpanded] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Background Image */}
      <div className="relative h-48 w-full">
        <Image src="/images/dubai-skyline.png" alt="Dubai skyline" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Content */}
      <div className="relative -mt-24 px-4 pb-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Trip Details */}
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-lg">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Your trip</h1>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>

                  {/* Trip Summary */}
                  <div className="mb-6 flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Lahore to Dubai, Jul 25</p>
                      <p className="text-sm text-gray-600">One-way, Economy, 1 adult</p>
                    </div>
                    <Badge variant="destructive" className="bg-red-600">
                      Emirates
                    </Badge>
                  </div>

                  {/* Flights Section */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Flights</h2>

                    {/* Flight Route */}
                    <div className="flex items-center gap-3">
                      <Plane className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Lahore - Dubai</p>
                        <p className="text-sm text-gray-600">Fri, Jul 25</p>
                      </div>
                    </div>

                    {/* Departure Info */}
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="font-medium text-gray-900">Departure • Fri, Jul 25</p>
                        <p className="text-sm text-gray-600">3h 15m</p>
                      </div>

                      {/* Emirates Flight Details */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="destructive" className="bg-red-600 text-xs">
                              Emirates 623
                            </Badge>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Economy
                          </Badge>
                        </div>

                        {/* Flight Timeline */}
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900">3:25 am</p>
                            <p className="text-sm text-gray-600">Lahore (LHE)</p>
                          </div>

                          <div className="flex flex-1 items-center gap-2">
                            <div className="h-px flex-1 bg-gray-300"></div>
                            <Plane className="h-4 w-4 text-gray-400" />
                            <div className="h-px flex-1 bg-gray-300"></div>
                          </div>

                          <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900">5:40 am</p>
                            <p className="text-sm text-gray-600">Dubai Intl (DXB)</p>
                          </div>
                        </div>

                        <p className="text-center text-sm text-gray-600">3h 15m</p>

                        {/* Amenities Toggle */}
                        <div className="flex items-center justify-center gap-4 pt-2">
                          <div className="flex items-center gap-1">
                            <div className="h-4 w-4 rounded bg-gray-300"></div>
                          </div>
                          <Wifi className="h-4 w-4 text-gray-400" />
                          <Monitor className="h-4 w-4 text-gray-400" />
                          <Utensils className="h-4 w-4 text-gray-400" />
                          <Headphones className="h-4 w-4 text-gray-400" />
                          <button
                            onClick={() => setIsMainFlightExpanded(!isMainFlightExpanded)}
                            className="flex items-center justify-center p-1 hover:bg-gray-100 rounded"
                          >
                            {isMainFlightExpanded ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>

                        {/* Expanded Amenities Details */}
                        {isMainFlightExpanded && (
                          <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="h-4 w-4 rounded bg-gray-300"></div>
                              <span>32" seat pitch</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Wifi className="h-4 w-4 text-gray-400" />
                              <span>Basic web browsing (fee)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="h-4 w-4 bg-gray-400 rounded-sm"></div>
                              <span>Power & USB outlets</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Monitor className="h-4 w-4 text-gray-400" />
                              <span>Seatback on-demand & live TV</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Utensils className="h-4 w-4 text-gray-400" />
                              <span>Meal provided</span>
                            </div>
                          </div>
                        )}

                        <p className="text-center text-sm text-blue-600">Baggage information: Emirates</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Trip Header */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Lahore to Dubai</h3>
                      <p className="text-sm text-gray-600">One-way, Economy, 1 adult</p>
                    </div>

                    {/* Airline */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Flying with Emirates</p>
                      <Badge variant="destructive" className="bg-red-600 text-xs">
                        Emirates
                      </Badge>
                    </div>

                    {/* Flight Route Summary */}
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">LHE → DXB</p>
                          <p className="text-sm text-gray-600">Fri, Jul 25</p>
                          <p className="text-sm text-gray-600">Nonstop • 3h 15m</p>
                        </div>
                        <button
                          onClick={() => setIsSidebarFlightExpanded(!isSidebarFlightExpanded)}
                          className="flex items-center justify-center p-1 hover:bg-gray-100 rounded"
                        >
                          {isSidebarFlightExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>

                      {/* Expanded Flight Details */}
                      {isSidebarFlightExpanded && (
                        <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                          <div className="text-center">
                            <p className="font-semibold text-gray-900">3:25 am - 5:40 am</p>
                            <p className="text-sm text-gray-600">Lahore (LHE) - Dubai (DXB)</p>
                            <Badge variant="destructive" className="bg-red-600 text-xs mt-1">
                              Emirates 623
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="h-4 w-4 rounded bg-gray-300"></div>
                              <span>32" seat pitch</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Wifi className="h-4 w-4 text-gray-400" />
                              <span>Basic web browsing (fee)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="h-4 w-4 bg-gray-400 rounded-sm"></div>
                              <span>Power & USB outlets</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Monitor className="h-4 w-4 text-gray-400" />
                              <span>Seatback on-demand & live TV</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Utensils className="h-4 w-4 text-gray-400" />
                              <span>Meal provided</span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600">Plane type Boeing 777-300ER</p>
                          <p className="text-sm text-gray-600">Economy</p>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-gray-900">Total</p>
                        <p className="text-lg font-bold text-gray-900">$648.30</p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={onContinueToCheckout}>
                      Continue to checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
