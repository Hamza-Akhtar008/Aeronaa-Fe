"use client"

import { useEffect, useState } from "react"
import {
  Filter,
  Eye,
  CheckCircle,
  Star,
  MapPin,
  Calendar,
  Clock,
  Wifi,
  Car,
  Coffee,
  Waves,
  Dumbbell,
  User2Icon,
  HomeIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import type { Hotel, Room } from "@/types/hotel" // Declare Hotel and Room types

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Ban, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { GetHotels, GetRoomsbyHotel, UpdateHotelApprove } from "@/lib/api"

const getCompletionColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "blocked":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

const getStarRatingColor = (rating: string) => {
  const numRating = Number.parseInt(rating)
  if (numRating >= 5) return "text-amber-500"
  if (numRating >= 4) return "text-amber-400"
  return "text-amber-300"
}

export default function HotelsPage() {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [filters, setFilters] = useState({
    status: "all", // Updated default value to "all"
    city: "",
    starRating: "all", // Updated default value to "all"
    country: "",
    isCompleted: "1",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [rooms, setrooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)

  const FetchHotels = async () => {
    try {
      setLoading(true)
      const response = await GetHotels(
        currentPage,
        itemsPerPage,
        filters, // Pass filters to backend for server-side filtering
      )

      // Backend already handles pagination and filtering
      setHotels(response.data)
      setTotalPages(response.totalPages)
      setTotalItems(response.total)
    } catch (error) {
      console.error("Failed to fetch hotels:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  useEffect(() => {
    FetchHotels()
  }, [currentPage, itemsPerPage, filters])

  const FetchRooms = async () => {
    const response = await GetRoomsbyHotel(selectedHotel?.id || "")
    setrooms(response)
  }

  useEffect(() => {
    if (selectedHotel) {
      FetchRooms()
    }
  }, [selectedHotel])

  const formatDate = (date: Date | string | number) => {
    const dateObject = new Date(date)
    return dateObject.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTags = (tags?: string | string[]) => {
    if (!tags) return []
    return Array.isArray(tags) ? tags : [tags]
  }

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase().replace(/[^a-z]/g, "")

    if (amenityLower.includes("wifi") || amenityLower === "wifi") return <Wifi className="w-4 h-4 text-white" />
    if (amenityLower.includes("parking")) return <Car className="w-4 h-4 text-white" />
    if (amenityLower.includes("breakfast")) return <Coffee className="w-4 h-4 text-white" />
    if (amenityLower.includes("pool")) return <Waves className="w-4 h-4 text-white" />
    if (amenityLower.includes("fitness") || amenityLower.includes("gym"))
      return <Dumbbell className="w-4 h-4 text-white" />
    if (amenityLower.includes("restaurant")) return <Coffee className="w-4 h-4 text-white" />
    if (amenityLower.includes("bar")) return <Coffee className="w-4 h-4 text-white" />
    if (amenityLower.includes("spa")) return <Waves className="w-4 h-4 text-white" />
    if (amenityLower.includes("roomservice") || amenityLower.includes("room-service"))
      return <User2Icon className="w-4 h-4 text-white" />

    if (amenityLower.includes("tv")) return <Star className="w-4 h-4 text-white" />
    if (amenityLower.includes("ac") || amenityLower.includes("airconditioning"))
      return <Star className="w-4 h-4 text-white" />
    if (amenityLower.includes("heating")) return <Star className="w-4 h-4 text-white" />
    if (amenityLower.includes("minibar")) return <Coffee className="w-4 h-4 text-white" />
    if (amenityLower.includes("safe")) return <Star className="w-4 h-4 text-white" />
    if (amenityLower.includes("desk") || amenityLower.includes("workdesk"))
      return <Star className="w-4 h-4 text-white" />
    if (amenityLower.includes("bathtub")) return <Star className="w-4 h-4 text-white" />
    if (amenityLower.includes("shower")) return <Star className="w-4 h-4 text-white" />
    if (amenityLower.includes("hairdryer")) return <Star className="w-4 h-4 text-white" />
    if (amenityLower.includes("toiletries")) return <Star className="w-4 h-4 text-white" />
    if (amenityLower.includes("balcony")) return <HomeIcon className="w-4 h-4 text-white" />
    if (amenityLower.includes("oceanview")) return <Waves className="w-4 h-4 text-white" />
    if (amenityLower.includes("cityview")) return <MapPin className="w-4 h-4 text-white" />
    if (amenityLower.includes("coffeemaker")) return <Coffee className="w-4 h-4 text-white" />

    return <Star className="w-4 h-4 text-white" />
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await UpdateHotelApprove(id, newStatus)
      setHotels((prev) => prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v)))
    } catch (err) {
      console.error("Failed to update status", err)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Hotel Listings</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage and review hotel listings on your platform</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
                City
              </Label>
              <Input
                id="city"
                placeholder="Search by city..."
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="rounded-2xl border-gray-200 focus:border-[#00b3d7]/50 focus:ring-[#00b3d7]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="starRating" className="text-sm font-semibold text-gray-700">
                Star Rating
              </Label>
              <Select
                value={filters.starRating}
                onValueChange={(value) => setFilters({ ...filters, starRating: value })}
              >
                <SelectTrigger className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-semibold text-gray-700">
                Country
              </Label>
              <Input
                id="country"
                placeholder="Search by country..."
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20"
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotels Table */}
      <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Hotels ({hotels.length})</CardTitle>
              <CardDescription className="text-gray-600 mt-1">Manage hotel listings and details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="font-semibold text-gray-700">Hotel Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Location</TableHead>
                  <TableHead className="font-semibold text-gray-700">Star Rating</TableHead>
                  <TableHead className="font-semibold text-gray-700">Availability</TableHead>
                  <TableHead className="font-semibold text-gray-700">Average Price</TableHead>

                  <TableHead className="font-semibold text-gray-700">Status</TableHead>

                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotels.map((hotel) => (
                  <TableRow key={hotel.id} className="border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="font-semibold text-gray-900">{hotel.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">{hotel.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-900">
                          {hotel.city}, {hotel.country}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">{hotel.state}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className={`h-4 w-4 ${getStarRatingColor(hotel.starRating)} fill-current`} />
                        <span className="text-gray-900 font-medium">{hotel.starRating} Star</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(hotel.availableFrom)}</span>
                        </div>
                        <div className="text-gray-500">to {formatDate(hotel.availableTo)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-900 font-medium">{hotel.averagePrice} $</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getCompletionColor(hotel.status)} border font-medium`}>
                        {hotel.status.toLocaleUpperCase()}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
                              onClick={() => setSelectedHotel(hotel)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 bg-white">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-gray-900">
                                {selectedHotel?.name}
                              </DialogTitle>
                              <DialogDescription className="text-gray-600">
                                Detailed information about this hotel listing
                              </DialogDescription>
                            </DialogHeader>

                            {selectedHotel && (
                              <div className="space-y-8">
                                {/* Hotel Images */}
                                {selectedHotel.images && selectedHotel.images.length > 0 ? (
                                  <div className="grid grid-cols-3 gap-4">
                                    {selectedHotel.images.map((image: string, index: number) => (
                                      <div key={index} className="relative aspect-video rounded-2xl overflow-hidden">
                                        <Image
                                          src={image || "/placeholder.svg"}
                                          alt={`${selectedHotel.name} image ${index + 1}`}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-3 gap-4">
                                    {["/images/image2.jpg", "/images/bgimage.jpg", "/images/image5.jpg"].map(
                                      (image: string, index: number) => (
                                        <div key={index} className="relative aspect-video rounded-2xl overflow-hidden">
                                          <Image
                                            src={image || "/placeholder.svg"}
                                            alt={`${selectedHotel.name} image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                      ),
                                    )}
                                  </div>
                                )}

                                {/* Location Details */}
                                <div className="space-y-6">
                                  <div>
                                    <h3 className="font-semibold text-gray-900 mb-4">Location Details</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span>{selectedHotel.Address}</span>
                                      </div>
                                      <div className="text-gray-600">
                                        {selectedHotel.city}, {selectedHotel.state} {selectedHotel.zipCode}
                                      </div>
                                      <div className="text-gray-600">{selectedHotel.country}</div>
                                    </div>

                                    {/* Google Map */}
                                    <div className="mt-6 rounded-xl overflow-hidden shadow-md">
                                      <iframe
                                        width="100%"
                                        height="400"
                                        className="border-0"
                                        src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
                                          selectedHotel?.Address || "",
                                        )}&key=AIzaSyBCit9qsp_C6ePD126N1h6avxnQ7EH9xGU`}
                                        allowFullScreen
                                        loading="lazy"
                                      />
                                    </div>
                                  </div>

                                  {/* Description */}
                                  <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                    <p className="text-sm text-gray-600">{selectedHotel.description}</p>
                                  </div>

                                  {/* Check-in/Check-out */}
                                  <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Check-in/Check-out</h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <span>Check-in: {selectedHotel.checkInTime}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <span>Check-out: {selectedHotel.checkOutTime}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Hotel Details */}
                                  <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Hotel Details</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                      <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-yellow-400" />
                                        <span>{selectedHotel.starRating} Star Rating</span>
                                      </div>
                                      <div>
                                        <span className="font-medium">Status: </span>
                                        <Badge className="bg-green-500 text-white font-medium ml-1">
                                          {selectedHotel.isCompleted == 1 ? "Completed" : "Incomplete"}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Availability Period */}
                                  <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Availability Period</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span>From: {formatDate(selectedHotel.availableFrom)}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span>To: {formatDate(selectedHotel.availableTo)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Amenities */}
                                  {selectedHotel.amenities && selectedHotel.amenities.length > 0 && (
                                    <div>
                                      <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
                                      <div className="flex flex-wrap gap-4">
                                        {selectedHotel.amenities.map((amenity: string, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                                          >
                                            <div className="p-2 bg-gradient-to-br from-[#023e8a] to-[#00b4d8] rounded-md flex items-center justify-center w-8 h-8">
                                              {getAmenityIcon(amenity)}
                                            </div>
                                            <div>
                                              <div className="font-medium text-gray-800 text-sm capitalize">
                                                {amenity}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Rooms Section */}
                                {rooms.length > 0 && (
                                  <div className="border-t pt-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                      Available Rooms ({rooms.length})
                                    </h3>
                                    <div className="grid gap-4">
                                      {rooms.map((room) => (
                                        <Card
                                          key={room.id}
                                          className="border border-gray-200 rounded-2xl overflow-hidden"
                                        >
                                          <CardContent className="p-0">
                                            <div className="grid md:grid-cols-3 gap-0">
                                              {/* Room Images */}
                                              <div className="relative aspect-video md:aspect-square">
                                                <Image
                                                  src={room.images[0] || "/images/three.jpg"}
                                                  alt={room.roomType}
                                                  fill
                                                  className="object-cover"
                                                />
                                                {room.quantity <= 5 && (
                                                  <div className="absolute top-3 left-3">
                                                    <Badge className="bg-red-500 text-white">
                                                      Only {room.quantity} left
                                                    </Badge>
                                                  </div>
                                                )}
                                              </div>

                                              {/* Room Details */}
                                              <div className="md:col-span-2 p-6">
                                                <h4 className="text-lg font-semibold text-gray-900">{room.roomType}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{room.description}</p>
                                                <div className="mt-4 flex justify-between items-center">
                                                  <div className="text-xl font-bold text-primary-start">
                                                    ${room.basePrice}
                                                  </div>
                                                  <div className="text-sm text-gray-500">per night</div>
                                                </div>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <TooltipProvider>
                          {hotel.status === "pending" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(hotel.id || "", "approved")}
                                >
                                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Approve Hotel</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {hotel.status === "approved" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleStatusChange(hotel.id || "", "blocked")}
                                >
                                  <Ban className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ban Hotel</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {hotel.status === "blocked" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(hotel.id || "", "approved")}
                                >
                                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Re-Approve Hotel</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {hotels.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing page {currentPage} of {totalPages} — Total {totalItems} Hotels
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                        className="h-8 w-8 p-0"
                        disabled={loading}
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
