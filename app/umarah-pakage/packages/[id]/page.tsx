"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit,
  Copy,
  Share2,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Star,
  Clock,
  Hotel,
  Car,
  Shield,
  ImageIcon,
  TrendingUp,
  FileText,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock package data - replace with actual API call
const mockPackage = {
  id: "1",
  packageName: "14 Days Luxury Umrah Package",
  packageCode: "UMR-LUX-001",
  type: "Luxury",
  duration: 14,
  season: "Regular",
  startDate: "2024-03-15",
  endDate: "2024-03-29",
  lowestPrice: 2500,
  highestPrice: 3500,
  currency: "USD",
  status: "Published" as const,
  bookings: 12,
  createdAt: "2024-01-15",
  description:
    "Experience the ultimate luxury Umrah journey with premium accommodations, private transportation, and personalized services. This comprehensive package includes everything you need for a spiritually fulfilling and comfortable pilgrimage.",

  // Basic Details
  basicDetails: {
    packageType: "Luxury",
    groupSize: "2-20 people",
    language: "English, Arabic",
    difficulty: "Easy",
    ageRestriction: "All ages welcome",
  },

  // Accommodation
  accommodation: {
    makkahHotel: "Fairmont Makkah Clock Royal Tower",
    makkahRating: 5,
    makkahNights: 8,
    makkahDistance: "50m from Haram",
    madinahHotel: "Pullman Zamzam Madina",
    madinahRating: 5,
    madinahNights: 6,
    madinahDistance: "100m from Prophet's Mosque",
    roomType: "Deluxe Room with Haram View",
    amenities: ["Free WiFi", "24/7 Room Service", "Air Conditioning", "Mini Bar", "Safe", "Laundry Service"],
  },

  // Transportation
  transportation: {
    flightType: "Direct flights with premium airlines",
    airportTransfer: "Private luxury vehicle",
    intercityTransport: "Private AC coach",
    localTransport: "Private vehicles for Ziyarat",
    additionalServices: ["Meet & Greet at airport", "Luggage handling", "24/7 transport support"],
  },

  // Religious Services
  religiousServices: {
    guidedTours: ["Haram Sharif", "Prophet's Mosque", "Historical sites in Makkah", "Historical sites in Madinah"],
    religiousGuidance: "Qualified Islamic scholar available",
    prayerFacilities: "Dedicated prayer areas in transport",
    islamicLectures: "Daily Islamic lectures and guidance",
    zusServices: ["Zam Zam water", "Prayer mats", "Islamic books", "Tasbih"],
  },

  // Pricing
  pricing: {
    basePrice: 2500,
    singleSupplement: 800,
    childDiscount: 25, // percentage
    groupDiscount: 10, // percentage for 10+ people
    inclusions: [
      "Return flights",
      "Visa processing",
      "Accommodation",
      "All transfers",
      "Breakfast & Dinner",
      "Guided tours",
      "24/7 support",
    ],
    exclusions: ["Personal expenses", "Lunch meals", "Optional tours", "Travel insurance", "Excess baggage"],
  },

  // Additional Information
  additionalInfo: {
    cancellationPolicy:
      "Free cancellation up to 30 days before departure. 50% refund 15-30 days before. No refund within 15 days.",
    healthRequirements: "Valid vaccination certificate required. Medical fitness certificate for elderly passengers.",
    packingGuidelines: "Modest clothing required. Comfortable walking shoes recommended. Prayer mats provided.",
    weatherInfo: "Temperature ranges from 20-35°C. Comfortable weather throughout the year.",
    culturalGuidelines: "Respect local customs and traditions. Modest dress code strictly enforced.",
  },

  // Performance Metrics
  metrics: {
    totalBookings: 45,
    revenue: 112500,
    averageRating: 4.8,
    repeatCustomers: 15,
    conversionRate: 12.5,
    viewsLastMonth: 1250,
  },

  // Recent Bookings
  recentBookings: [
    { id: "1", customerName: "Ahmed Hassan", bookingDate: "2024-02-15", amount: 5000, status: "Confirmed" },
    { id: "2", customerName: "Omar Khan", bookingDate: "2024-02-20", amount: 2500, status: "Confirmed" },
    { id: "3", customerName: "Aisha Ali", bookingDate: "2024-02-25", amount: 7500, status: "Pending" },
  ],

  // Gallery
  gallery: [
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
  ],
}

export default function PackageDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [packageData, setPackageData] = useState(mockPackage)

  const getStatusBadge = (status: typeof packageData.status) => {
    const variants = {
      Published: "bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white",
      Draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Archived: "bg-gray-100 text-gray-800 border-gray-200",
    }

    return <Badge className={variants[status]}>{status}</Badge>
  }

  const handleDuplicate = () => {
    toast({
      title: "Package Duplicated",
      description: "Package has been duplicated successfully.",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied",
      description: "Package link has been copied to clipboard.",
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{packageData.packageName}</h1>
            {getStatusBadge(packageData.status)}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {packageData.packageCode} • {packageData.duration} days • {packageData.type}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDuplicate}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          <Button className="bg-gradient-to-r from-[#023e8a] to-[#00b4d8] hover:from-[#012a5e] to-[#0096b8] text-white">
            <Edit className="h-4 w-4 mr-2" />
            Edit Package
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{packageData.metrics.totalBookings}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${packageData.metrics.revenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-lg">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{packageData.metrics.averageRating}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {packageData.metrics.conversionRate}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="accommodation">Hotels</TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Package Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">{packageData.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#00b4d8]" />
                        <span className="text-sm">
                          <strong>Duration:</strong> {packageData.duration} days
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#00b4d8]" />
                        <span className="text-sm">
                          <strong>Group Size:</strong> {packageData.basicDetails.groupSize}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#00b4d8]" />
                        <span className="text-sm">
                          <strong>Season:</strong> {packageData.season}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#00b4d8]" />
                        <span className="text-sm">
                          <strong>Language:</strong> {packageData.basicDetails.language}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#00b4d8]" />
                        <span className="text-sm">
                          <strong>Difficulty:</strong> {packageData.basicDetails.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#00b4d8]" />
                        <span className="text-sm">
                          <strong>Age:</strong> {packageData.basicDetails.ageRestriction}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accommodation" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hotel className="h-5 w-5 text-[#023e8a]" />
                      Makkah Accommodation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {packageData.accommodation.makkahHotel}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(packageData.accommodation.makkahRating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Nights:</strong> {packageData.accommodation.makkahNights}
                      </p>
                      <p>
                        <strong>Distance:</strong> {packageData.accommodation.makkahDistance}
                      </p>
                      <p>
                        <strong>Room Type:</strong> {packageData.accommodation.roomType}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hotel className="h-5 w-5 text-[#023e8a]" />
                      Madinah Accommodation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {packageData.accommodation.madinahHotel}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(packageData.accommodation.madinahRating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Nights:</strong> {packageData.accommodation.madinahNights}
                      </p>
                      <p>
                        <strong>Distance:</strong> {packageData.accommodation.madinahDistance}
                      </p>
                      <p>
                        <strong>Room Type:</strong> {packageData.accommodation.roomType}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Hotel Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {packageData.accommodation.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-full"></div>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transport" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-[#023e8a]" />
                    Transportation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Flight Type</label>
                      <p className="text-gray-900 dark:text-white">{packageData.transportation.flightType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Airport Transfer</label>
                      <p className="text-gray-900 dark:text-white">{packageData.transportation.airportTransfer}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Intercity Transport
                      </label>
                      <p className="text-gray-900 dark:text-white">{packageData.transportation.intercityTransport}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Local Transport</label>
                      <p className="text-gray-900 dark:text-white">{packageData.transportation.localTransport}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      Additional Services
                    </label>
                    <div className="space-y-2">
                      {packageData.transportation.additionalServices.map((service, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-full"></div>
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#023e8a]" />
                    Religious Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      Guided Tours
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {packageData.religiousServices.guidedTours.map((tour, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-[#00b4d8]" />
                          {tour}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Religious Guidance</label>
                      <p className="text-gray-900 dark:text-white text-sm">
                        {packageData.religiousServices.religiousGuidance}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Prayer Facilities</label>
                      <p className="text-gray-900 dark:text-white text-sm">
                        {packageData.religiousServices.prayerFacilities}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Islamic Lectures</label>
                    <p className="text-gray-900 dark:text-white text-sm">
                      {packageData.religiousServices.islamicLectures}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                      Additional Services
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {packageData.religiousServices.zusServices.map((service, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-full"></div>
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-[#023e8a]" />
                      Pricing Structure
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Base Price:</span>
                        <span className="font-medium">${packageData.pricing.basePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Single Supplement:</span>
                        <span className="font-medium">+${packageData.pricing.singleSupplement.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Child Discount:</span>
                        <span className="font-medium text-green-600">-{packageData.pricing.childDiscount}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Group Discount (10+):</span>
                        <span className="font-medium text-green-600">-{packageData.pricing.groupDiscount}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Price Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${packageData.lowestPrice.toLocaleString()} - ${packageData.highestPrice.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">per person</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Inclusions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {packageData.pricing.inclusions.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Exclusions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {packageData.pricing.exclusions.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-[#023e8a]" />
                    Package Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packageData.gallery.map((image, index) => (
                      <div key={index} className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Package image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>{packageData.bookings} total bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {packageData.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{booking.customerName}</p>
                      <p className="text-xs text-gray-500">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">${booking.amount.toLocaleString()}</p>
                      <Badge variant={booking.status === "Confirmed" ? "default" : "secondary"} className="text-xs">
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Package Information */}
          <Card>
            <CardHeader>
              <CardTitle>Package Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <span>{new Date(packageData.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Travel Dates:</span>
                <span>{new Date(packageData.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                <span>{packageData.duration} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <Badge variant="outline">{packageData.type}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Season:</span>
                <span>{packageData.season}</span>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Policies & Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  Cancellation Policy
                </label>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {packageData.additionalInfo.cancellationPolicy}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  Health Requirements
                </label>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {packageData.additionalInfo.healthRequirements}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  Cultural Guidelines
                </label>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {packageData.additionalInfo.culturalGuidelines}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
