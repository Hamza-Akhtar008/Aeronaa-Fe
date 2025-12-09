"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  MoreHorizontal,
  Eye,
  Phone,
  Mail,
  Users,
  ChevronLeft,
  ChevronRight,
  Download,
  MessageSquare,
  CheckCircle,
  XCircle,
  BookOpen,
  Calendar,
  DollarSign,
  User,
  Plane,
  Building,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Getallumrahbookings, GetallumrahbookingVendor } from "@/lib/umrah_api"
import { useAuth } from "@/store/authContext"

interface Booking {
  id: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  packageSelected: {
    price: number
    packageName: string
  }[]
  traveller: {
    gender: string
    lastName: string
    firstName: string
    dateOfBirth: string
    nationality: string
    phoneNumber: string
    emailAddress: string
    passportNumber: string
    specialRequests: string
    passportExpiryDate: string
  }[]
  totalPrice: number
  umrahPurchased: {
    id: number
    isActive: boolean
    createdAt: string
    updatedAt: string
    packageName: string
    packageCode: string
    packageType: string
    duration: number
    startDate: string
    endDate: string
    citiesCovered: string[]
    shortDescription: string
    longDescription: string
    makkahHotelName: string
    makkahStarRating: string
    distanceFromHaram: number
    medinaHotelName: string
    medinaStarRating: string
    distanceFromMasjidNabwi: number
    roomTypes: string
    mealsIncluded: string[]
    flightIncluded: number
    airportTransfersIncluded: number
    interCityTransportType: string
    ziyaratIncluded: number
    tentativeDepartureDate: string
    tentativeReturnDate: string
    airLineName: string
    flightClass: string
    routeType: string
    departureCity: string
    arrivalCity: string
    flightDuration: number
    flightNotes: string
    currency: string
    doubleSharingPrice: number
    trippleSharingPrice: number
    quadSharingPrice: number
    discountPercent: number
    refundPolicy: string
    paymentTerms: string
    specialNotes: string
    vendorNotes: string
    extrasIncluded: string[]
    religiousServicesIncluded: string[]
    hotelImages: string[]
    coverImage: string
  }
}

const mockBookings: Booking[] = [
  {
    id: 1,
    isActive: true,
    createdAt: "2025-08-18T10:33:40.978Z",
    updatedAt: "2025-08-18T10:33:42.459Z",
    packageSelected: [
      {
        price: 1250,
        packageName: "double",
      },
    ],
    traveller: [
      {
        gender: "male",
        lastName: "Akhtar",
        firstName: "Hamza",
        dateOfBirth: "2025-08-04",
        nationality: "Pakistani",
        phoneNumber: "03216032104",
        emailAddress: "hamzaakhtar008@gmail.com",
        passportNumber: "32323daf",
        specialRequests: "",
        passportExpiryDate: "2025-09-03",
      },
    ],
    totalPrice: 1150,
    umrahPurchased: {
      id: 4,
      isActive: true,
      createdAt: "2025-08-18T06:09:18.527Z",
      updatedAt: "2025-08-18T06:09:18.527Z",
      packageName: "Umrah Silver Package",
      packageCode: "UMR-SLV-2025",
      packageType: "Standard",
      duration: 10,
      startDate: "2025-08-24T00:00:00.000Z",
      endDate: "2025-09-04T00:00:00.000Z",
      citiesCovered: ["Makkah", "Madinah"],
      shortDescription: "Affordable 10-day Umrah package with 4-star hotels in Makkah and Medina.",
      longDescription:
        "This Umrah Silver Package includes 4-star hotel stays in both Makkah and Medina, guided ziyarat tours, airport transfers, and intercity luxury bus travel. Suitable for families and groups seeking comfort at a reasonable cost.",
      makkahHotelName: "Swissotel Al Maqam Makkah",
      makkahStarRating: "4",
      distanceFromHaram: 350,
      medinaHotelName: "Anwar Al Madinah Mövenpick Hotel",
      medinaStarRating: "4",
      distanceFromMasjidNabwi: 300,
      roomTypes: "Double, Triple, Quad sharing",
      mealsIncluded: ["Breakfast", "Half-board"],
      flightIncluded: 1,
      airportTransfersIncluded: 1,
      interCityTransportType: "bus",
      ziyaratIncluded: 1,
      tentativeDepartureDate: "2025-08-23T00:00:00.000Z",
      tentativeReturnDate: "2025-09-05T00:00:00.000Z",
      airLineName: "Saudi Airlines",
      flightClass: "economy",
      routeType: "direct",
      departureCity: "Karachi",
      arrivalCity: "Jeddah",
      flightDuration: 4,
      flightNotes: "Direct flight with meals included",
      currency: "USD",
      doubleSharingPrice: 1250,
      trippleSharingPrice: 1150,
      quadSharingPrice: 1050,
      discountPercent: 8,
      refundPolicy:
        "Full refund up to 30 days before departure. 50% refund within 15 days. Non-refundable within 7 days of departure",
      paymentTerms: "50% advance, remaining before departure",
      specialNotes: "Visa processing included. PCR test requirements subject to Saudi government regulations",
      vendorNotes: "Ensure all passports are valid for at least 6 months from departure date",
      extrasIncluded: ["24/7 support hotline", "Travel insurance", "Welcome Kit"],
      religiousServicesIncluded: ["Guided Tour", "Umrah Visa", "Ritual Assistance"],
      hotelImages: ["https://aeronna.s3.amazonaws.com/1755497356007blob"],
      coverImage: "https://aeronna.s3.eu-north-1.amazonaws.com/17554973569968948651.jpg",
    },
  },
]

const ITEMS_PER_PAGE = 10

function BookingDetailsModal({ booking }: { booking: Booking }) {
  const primaryTraveller = booking.traveller[0]
  const packageInfo = booking.umrahPurchased

  return (
    <div className="space-y-6">
      {/* Booking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Primary Traveller</span>
          </div>
          <div className="pl-6 space-y-1">
            <p className="font-medium">
              {primaryTraveller.firstName} {primaryTraveller.lastName}
            </p>
            <p className="text-sm text-gray-600">{primaryTraveller.emailAddress}</p>
            <p className="text-sm text-gray-600">{primaryTraveller.phoneNumber}</p>
            <p className="text-sm text-gray-600">{primaryTraveller.nationality}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Pricing</span>
          </div>
          <div className="pl-6 space-y-1">
            <p className="font-medium text-lg">
              {packageInfo.currency} {booking.totalPrice}
            </p>
            <p className="text-sm text-gray-600">Package: {booking.packageSelected[0].packageName}</p>
            <p className="text-sm text-gray-600">Duration: {packageInfo.duration} days</p>
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Package Information</span>
        </div>
        <div className="pl-6 space-y-2">
          <p className="font-medium">{packageInfo.packageName}</p>
          <p className="text-sm text-gray-600">{packageInfo.shortDescription}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Code: {packageInfo.packageCode}</span>
            <span>Type: {packageInfo.packageType}</span>
          </div>
        </div>
      </div>

      {/* Travel Dates */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Travel Dates</span>
        </div>
        <div className="pl-6 space-y-1">
          <p className="text-sm">Departure: {new Date(packageInfo.startDate).toLocaleDateString()}</p>
          <p className="text-sm">Return: {new Date(packageInfo.endDate).toLocaleDateString()}</p>
          <p className="text-sm text-gray-600">Cities: {packageInfo.citiesCovered.join(", ")}</p>
        </div>
      </div>

      {/* Hotels */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Building className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Accommodation</span>
        </div>
        <div className="pl-6 space-y-2">
          <div>
            <p className="font-medium">{packageInfo.makkahHotelName}</p>
            <p className="text-sm text-gray-600">
              {packageInfo.makkahStarRating} Star • {packageInfo.distanceFromHaram}m from Haram
            </p>
          </div>
          <div>
            <p className="font-medium">{packageInfo.medinaHotelName}</p>
            <p className="text-sm text-gray-600">
              {packageInfo.medinaStarRating} Star • {packageInfo.distanceFromMasjidNabwi}m from Masjid Nabwi
            </p>
          </div>
        </div>
      </div>

      {/* Flight Details */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Plane className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Flight Information</span>
        </div>
        <div className="pl-6 space-y-1">
          <p className="font-medium">{packageInfo.airLineName}</p>
          <p className="text-sm text-gray-600">
            {packageInfo.departureCity} → {packageInfo.arrivalCity}
          </p>
          <p className="text-sm text-gray-600">
            {packageInfo.flightClass} • {packageInfo.routeType} • {packageInfo.flightDuration}h
          </p>
          <p className="text-sm text-gray-600">{packageInfo.flightNotes}</p>
        </div>
      </div>

      {/* Services Included */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Services Included</span>
        </div>
        <div className="pl-6 space-y-2">
          <div>
            <p className="text-sm font-medium">Religious Services:</p>
            <p className="text-sm text-gray-600">{packageInfo.religiousServicesIncluded.join(", ")}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Extras:</p>
            <p className="text-sm text-gray-600">{packageInfo.extrasIncluded.join(", ")}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Meals:</p>
            <p className="text-sm text-gray-600">{packageInfo.mealsIncluded.join(", ")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBookings, setSelectedBookings] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()
const {auth}=useAuth();
  useEffect(()=>
  {
const getallbookings =async()=>
{
  const response = await Getallumrahbookings();
  setBookings(response);
}
const getallbookingsVendor =async()=>
{
  const response = await GetallumrahbookingVendor();
  setBookings(response);
}

if(auth?.role=="admin")
{

  getallbookings();
}
else
{
getallbookingsVendor();
}
  },[])
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const primaryTraveller = booking.traveller[0]
      const matchesSearch =
        primaryTraveller.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        primaryTraveller.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.umrahPurchased.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.umrahPurchased.packageCode.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && booking.isActive) ||
        (statusFilter === "inactive" && !booking.isActive)

      return matchesSearch && matchesStatus
    })
  }, [bookings, searchQuery, statusFilter])

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBookings(paginatedBookings.map((booking) => booking.id))
    } else {
      setSelectedBookings([])
    }
  }

  const handleSelectBooking = (bookingId: number, checked: boolean) => {
    if (checked) {
      setSelectedBookings([...selectedBookings, bookingId])
    } else {
      setSelectedBookings(selectedBookings.filter((id) => id !== bookingId))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Booking Management</CardTitle>
            <CardDescription>View and manage all customer bookings</CardDescription>
          </div>
        
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBookings.length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-sm font-medium">{selectedBookings.length} selected</span>
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Selected
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                
                  <th className="text-left p-4 font-medium">Booking ID</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Package</th>
                  <th className="text-left p-4 font-medium">Travel Dates</th>
                  <th className="text-left p-4 font-medium">Amount</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="w-12 p-4"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((booking) => {
                  const primaryTraveller = booking.traveller[0]
                  return (
                    <tr key={booking.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                    
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">#{booking.id}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {primaryTraveller.firstName} {primaryTraveller.lastName}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Users className="h-3 w-3" />
                            {booking.traveller.length} traveller{booking.traveller.length > 1 ? "s" : ""}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {booking.umrahPurchased.packageName}
                          </div>
                          <div className="text-sm text-gray-500">{booking.umrahPurchased.packageCode}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div>{new Date(booking.umrahPurchased.startDate).toLocaleDateString()}</div>
                          <div className="text-gray-500">
                            to {new Date(booking.umrahPurchased.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">
                            {booking.umrahPurchased.currency} {booking.totalPrice.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">{booking.packageSelected[0].packageName} sharing</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={booking.isActive ? "default" : "secondary"}
                          className="flex items-center gap-1 w-fit"
                        >
                          {booking.isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {booking.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Booking Details</DialogTitle>
                                  <DialogDescription>Complete booking information</DialogDescription>
                                </DialogHeader>
                                <BookingDetailsModal booking={booking} />
                              </DialogContent>
                            </Dialog>
                           
                           
                           
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredBookings.length)} of{" "}
              {filteredBookings.length} bookings
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No bookings found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Bookings will appear here once customers start booking your packages"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
