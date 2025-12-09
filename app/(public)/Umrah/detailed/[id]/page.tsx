"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Utensils, Plane, Bus, Star, Shield, Gift } from "lucide-react"
import React, { useEffect, useState } from "react"
import { GetUmrahPakage } from "@/lib/umrah_api"
import type { UmrahPackage } from "@/types/Umrah"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"
import { formatPrice } from "@/lib/utils/currency"

// Mock data - in real app this would come from API/database
const mockPackage = {
  id: 3,
  isActive: true,
  createdAt: "2025-08-15T10:12:43.065Z",
  updatedAt: "2025-08-15T10:12:43.065Z",
  packageName: "Premium Umrah Experience",
  packageCode: "UMR001",
  packageType: "Standard",
  duration: 14,
  startDate: "2025-08-16T00:00:00.000Z",
  endDate: "2025-08-30T00:00:00.000Z",
  citiesCovered: ["Makkah", "Madinah", "Taif"],
  shortDescription: "A comprehensive 14-day Umrah package with premium accommodations",
  longDescription:
    "Experience the spiritual journey of Umrah with our premium package that includes luxury accommodations near the holy sites, guided tours, and complete travel arrangements. This package is designed to provide comfort and convenience while you focus on your spiritual journey.",
  makkahHotelName: "Hilton Suites Makkah",
  makkahStarRating: "5",
  distanceFromHaram: 200,
  medinaHotelName: "Madinah Hilton",
  medinaStarRating: "5",
  distanceFromMasjidNabwi: 97,
  roomTypes: "Double, Triple, Quad",
  mealsIncluded: ["Breakfast", "Half-board"],
  flightIncluded: 1,
  airportTransfersIncluded: 1,
  interCityTransportType: "bus",
  ziyaratIncluded: 1,
  tentativeDepartureDate: "2025-08-16T00:00:00.000Z",
  tentativeReturnDate: "2025-08-30T00:00:00.000Z",
  airLineName: "Saudi Airlines",
  flightClass: "Economy",
  routeType: "direct",
  departureCity: "New York",
  arrivalCity: "Jeddah",
  flightDuration: 12,
  flightNotes: "Direct flight with complimentary meals",
  currency: "USD",
  doubleSharingPrice: 2800,
  trippleSharingPrice: 2400,
  quadSharingPrice: 2100,
  discountPercent: 10,
  refundPolicy: "Full refund up to 30 days before departure, 50% refund up to 15 days",
  paymentTerms: "50% deposit required, balance due 30 days before departure",
  specialNotes: "Includes guided Ziyarat tours and religious guidance",
  vendorNotes: "Premium service with 24/7 support",
  extrasIncluded: ["Ihram clothing", "Travel insurance", "Zam Zam water", "Prayer mat"],
  religiousServicesIncluded: ["Guided prayers", "Religious lectures", "Ziyarat tours"],
  hotelImages: [
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
  ],
  coverImage: "/placeholder.svg?height=400&width=800",
}

export default function UmrahDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [pkg, setPackage] = useState<UmrahPackage | null>(null)

    const [selectedCurrency, setSelectedCurrency] = useState("USD");
          const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 });
        
          // Detect country and currency from localStorage/sessionStorage
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
  

  // In real app, fetch package by ID

  useEffect(() => {
    const fetchpakage = async () => {
      const response = await GetUmrahPakage(id)
      setPackage(response)
    }
    fetchpakage()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Cover Image Section - Clearly Separated */}
      <div className="relative">
       <div className="w-full h-80 md:h-96 overflow-hidden">
  <img
    src={
      pkg?.coverImage ||
      "/placeholder.svg?height=400&width=1200&query=beautiful umrah pilgrimage scene with kaaba"
    }
    alt={pkg?.packageName}
    className="w-full h-full object-cover"
  />
</div>


        {/* Floating Info Card Over Image */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="container mx-auto px-4 pb-8 pt-16">
            <div className="max-w-4xl">
              <Badge variant="secondary" className="mb-4 text-sm px-3 py-1 bg-white/90 text-gray-800">
                {pkg?.packageType} Package • {pkg?.duration} Days
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">{pkg?.packageName}</h1>
           
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Package Overview */}
            <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Package Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{pkg?.longDescription}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      <strong>Duration:</strong> {pkg?.duration} days
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      <strong>Cities:</strong> {pkg?.citiesCovered.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      <strong>Departure:</strong> {formatDate(pkg?.startDate || "")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      <strong>Return:</strong> {formatDate(pkg?.endDate || "")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accommodation */}
            <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  Accommodation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Makkah Hotel</h4>
                    <div className="space-y-2">
                      <p className="font-medium">{pkg?.makkahHotelName}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(Number.parseInt(pkg?.makkahStarRating || "0"))].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{pkg?.distanceFromHaram}m from Haram</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Madinah Hotel</h4>
                    <div className="space-y-2">
                      <p className="font-medium">{pkg?.medinaHotelName}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(Number.parseInt(pkg?.medinaStarRating || "0"))].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{pkg?.distanceFromMasjidNabwi}m from Masjid Nabwi</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pkg?.hotelImages.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`Hotel ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-white/30"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services Included */}
            <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-blue-600" />
                  Services Included
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Flight Details</span>
                    </div>
                    {pkg?.flightIncluded ? (
                      <div className="ml-6 space-y-1 text-sm text-gray-600">
                        <p>
                          {pkg?.airLineName} - {pkg?.flightClass}
                        </p>
                        <p>
                          {pkg?.departureCity} → {pkg?.arrivalCity}
                        </p>
                        <p>
                          {pkg?.routeType} flight ({pkg?.flightDuration} hours)
                        </p>
                      </div>
                    ) : (
                      <p className="ml-6 text-sm text-gray-500">Flight not included</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Meals</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {pkg?.mealsIncluded.map((meal, index) => (
                        <Badge key={index} variant="outline" className="mr-2 bg-white/50 border-blue-200">
                          {meal}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Bus className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Transportation</span>
                    </div>
                    <div className="ml-6 text-sm text-gray-600">
                      <p>Airport transfers included</p>
                      <p>Inter-city transport: {pkg?.interCityTransportType}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Extras</span>
                    </div>
                  <div className="ml-6 space-y-1">
  {(pkg?.extrasIncluded || []).map((extra, index) => (
    <Badge
      key={index}
      variant="outline"
      className="mr-2 mb-1 bg-white/50 border-blue-200"
    >
      {extra}
    </Badge>
  ))}
</div>

                  </div>
                </div>

                {pkg?.ziyaratIncluded && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg backdrop-blur-sm border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Ziyarat Tours Included</h4>
                    <p className="text-sm text-blue-700">
                      Guided tours to historical and religious sites in Makkah and Madinah
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terms & Policies */}
            <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle>Terms & Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Payment Terms</h4>
                  <p className="text-sm text-gray-600">{pkg?.paymentTerms}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Refund Policy</h4>
                  <p className="text-sm text-gray-600">{pkg?.refundPolicy}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Special Notes</h4>
                  <p className="text-sm text-gray-600">{pkg?.specialNotes}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Pricing & Booking */}
          <div className="space-y-6">
            <Card className="sticky top-4 backdrop-blur-md bg-white/80 border-white/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-center">Package Pricing</CardTitle>
                <CardDescription className="text-center">Choose your preferred room sharing option</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pricing Options */}
                <div className="space-y-3">

                   <div className="flex justify-between items-center p-3 border rounded-lg backdrop-blur-sm bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border-blue-200/50">
                    <div>
                      <p className="font-medium">Single Sharing</p>
                      <p className="text-sm text-gray-500">1 persons per room</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    


                         {formatPrice(
                                                        ((pkg?.singlePricing||0)) * (exchangeRates[selectedCurrency] || 1),
                                                        selectedCurrency,
                                                      )}
                      </p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg backdrop-blur-sm bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border-blue-200/50">
                    <div>
                      <p className="font-medium">Double Sharing</p>
                      <p className="text-sm text-gray-500">2 persons per room</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  
                          {formatPrice(
                                                        ((pkg?.doubleSharingPrice||0)) * (exchangeRates[selectedCurrency] || 1),
                                                        selectedCurrency,
                                                      )}
                      </p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-lg backdrop-blur-sm bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border-blue-200/50">
                    <div>
                      <p className="font-medium">Triple Sharing</p>
                      <p className="text-sm text-gray-500">3 persons per room</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                     
                         {formatPrice(
                                                        ((pkg?.trippleSharingPrice||0)) * (exchangeRates[selectedCurrency] || 1),
                                                        selectedCurrency,
                                                      )}
                      </p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-lg backdrop-blur-sm bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border-blue-200/50">
                    <div>
                      <p className="font-medium">Quad Sharing</p>
                      <p className="text-sm text-gray-500">4 persons per room</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                     

                         {formatPrice(
                                                        ((pkg?.quadSharingPrice||0)) * (exchangeRates[selectedCurrency] || 1),
                                                        selectedCurrency,
                                                      )}
                      </p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  </div>
                </div>

                {(pkg?.discountPercent||0)  >0 && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-lg text-center backdrop-blur-sm border border-red-200/50">
                      <Badge variant="destructive" className="mb-2">
                        {pkg?.discountPercent}% OFF
                      </Badge>
                      <p className="text-sm text-red-700">Limited time offer!</p>
                    </div>
                  )}

                <Link href={`/Umrah/detailed/${pkg?.id}/booking`}>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                    size="lg"
                  >
                    Book This Package
                  </Button>
                </Link>

                <div className="text-center text-sm text-gray-500">
                  <p>Secure booking • Instant confirmation</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
          </div>
        </div>
      </div>
    </div>
  )
}
