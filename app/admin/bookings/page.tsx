"use client"

import { useEffect, useState } from "react"
import { Filter, Eye, XCircle, RefreshCw, DollarSign, MapPin, Calendar, Users, Bed, ChevronLeft, ChevronRight, Star, Check, Cross, X } from "lucide-react"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"
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
import { Textarea } from "@/components/ui/textarea"
import { GetallBookings,CofirmedbyAdminuserAppeared,CofirmedbyAdmin } from "@/lib/api"



const getStatusColor = (isActive: boolean) => {
  return isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"
}

const getStatusText = (isActive: boolean) => {
  return isActive ? "Active" : "Cancelled"
}

export default function BookingsPage() {
  const [selectedBooking, setSelectedBooking] = useState<UIBooking | null>(null)
  const [refundModal, setRefundModal] = useState<UIBooking | null>(null)
  const [refundReason, setRefundReason] = useState("")
  const [refundAmount, setRefundAmount] = useState("")
  const [bookings, setBookings] = useState<UIBooking[]>([]);
    const [currentPage, setCurrentPage] = useState(1)
      const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    city: "",
    checkInDate: "",
    status: "",
    paymenttype: "",

    userName: "",
  })

  const fetchbookings = async () => {
  
  const response = await GetallBookings();
  const sorted = response.sort((a, b) => { const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0; const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0; return dateB - dateA; });
  setBookings(sorted);
  }
useEffect(()=>
{
fetchbookings();
},[])
 const filteredBookings = bookings.filter((booking) => {
  return (
    (!filters.city || booking.hotel.city.toLowerCase().includes(filters.city.toLowerCase())) &&
    (!filters.checkInDate || booking.checkIndate === filters.checkInDate) &&
    (!filters.status || (filters.status === "active" ? booking.isActive : !booking.isActive)) &&
    (!filters.paymenttype || filters.paymenttype === "all" || booking.paymentType === filters.paymenttype) &&
    (!filters.userName || booking.user.name.toLowerCase().includes(filters.userName.toLowerCase()))
  )
})

   const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBookings = filteredBookings.slice(startIndex, endIndex)
  const handleRefund = () => {
    console.log("Processing refund:", { booking: refundModal, reason: refundReason, amount: refundAmount })
    setRefundModal(null)
    setRefundReason("")
    setRefundAmount("")
  }
const getBookingStatus = (booking: UIBooking|null) => {
  if (booking?.isActive==false) {
    return { status: "Cancelled", color: "bg-red-100 text-red-700 border-red-200 " }
  }
if(booking?.isConfirmed==true){
    return { status: "Not Appeared Confirmed by Admin", color: "bg-yellow-100 text-yellow-700 border-yellow-200" }
  }
  if(booking?.isAppeared==false){
    return { status: "Not Appeared ", color: "bg-yellow-100 text-yellow-700 border-yellow-200" }
  }
  const today = new Date()
  const checkoutDate = new Date(booking?.checkOutDate||"")

  if (checkoutDate < today) {
    return { status: "Completed", color: "bg-green-100 text-green-700 border-green-200" }
  } else {
    return { status: "Up-Comming", color: "bg-blue-100 text-blue-700 border-blue-200" }
  }
}



 const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getStarRatingColor = (rating: string) => {
  const numRating = Number.parseInt(rating)
  if (numRating >= 5) return "text-amber-500"
  if (numRating >= 4) return "text-amber-400"
  return "text-amber-300"
}

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}


      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Hotel Booking Management</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage all hotel reservations and bookings</p>
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
              <Label htmlFor="checkInDate" className="text-sm font-semibold text-gray-700">
                Check-in Date
              </Label>
              <Input
                id="checkInDate"
                type="date"
                value={filters.checkInDate}
                onChange={(e) => setFilters({ ...filters, checkInDate: e.target.value })}
                className="rounded-2xl border-gray-200 focus:border-[#00b3d7]/50 focus:ring-[#00b3d7]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold text-gray-700">
                Status
              </Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="rounded-2xl border-gray-200 focus:border-[#00b3d7]/50 focus:ring-[#00b3d7]/20">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold text-gray-700">
                Payment Type
              </Label>
              <Select value={filters.paymenttype} onValueChange={(value) => setFilters({ ...filters, paymenttype: value })}>
                <SelectTrigger className="rounded-2xl border-gray-200 focus:border-[#00b3d7]/50 focus:ring-[#00b3d7]/20">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>

                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="payathotel">Pay at Hotel</SelectItem>
                </SelectContent>
              </Select>
            </div>


             <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold text-gray-700">
                Status
              </Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="rounded-2xl border-gray-200 focus:border-[#00b3d7]/50 focus:ring-[#00b3d7]/20">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-sm font-semibold text-gray-700">
                Guest Name
              </Label>
              <Input
                id="userName"
                placeholder="Search by guest name..."
                value={filters.userName}
                onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
                className="rounded-2xl border-gray-200 focus:border-[#00b3d7]/50 focus:ring-[#00b3d7]/20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Hotel Bookings ({filteredBookings.length})
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Manage hotel reservations and guest information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="font-semibold text-gray-700">Booking ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Guest</TableHead>
                  <TableHead className="font-semibold text-gray-700">Booking By</TableHead>

                  <TableHead className="font-semibold text-gray-700">Hotel</TableHead>
                  <TableHead className="font-semibold text-gray-700">Check-in/out</TableHead>
                  <TableHead className="font-semibold text-gray-700">Duration</TableHead>
                  <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentBookings.map((booking) => {
                  const bookingStatus = getBookingStatus(booking)
                  return (
                    <TableRow
                      key={booking.id}
                      className="border-gray-100 hover:bg-gradient-to-r hover:from-[#023e8a]/5 hover:to-[#00b3d7]/5 transition-all duration-200"
                    >
                      <TableCell>
                        <div className="font-semibold text-gray-900">
                          #{booking.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          
                          <div>
                            <div className="font-semibold text-gray-900">{booking.user?.name}</div>
                            <div className="text-sm text-gray-500">{booking.user?.email}</div>
                          </div>
                        </div>
                      </TableCell>
                       <TableCell>
                        <div className="flex items-center gap-3">
                          
                         {booking.user.role==="user"?<Badge className="bg-blue-100 text-blue-700 border-blue-200">User</Badge>:<Badge className="bg-green-100 text-green-700 border-green-200">Agent</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1">
                        <Star className={`h-4 w-4 ${getStarRatingColor(booking.hotel.starRating)} fill-current`} />
                        <span className="text-gray-900 font-medium">{booking.hotel.starRating} </span>
                      </div>
                          <div>
                             <div className="font-semibold text-gray-900">{booking.hotel.name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {booking.hotel.city}, {booking.hotel.country}
                            </div>
                          </div>
                        </div>
                      </TableCell>
              <TableCell>
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
      <Calendar className="h-4 w-4 text-[#00b3d7]" />
      {new Date(booking.checkIndate).toLocaleDateString('en-GB', {
        weekday: 'long', // Full weekday (e.g., "Monday")
        year: 'numeric', // Full year (e.g., "2025")
        month: 'long',   // Full month name (e.g., "June")
        day: 'numeric'   // Numeric day (e.g., "17")
      })}
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Calendar className="h-4 w-4 text-[#023e8a]" />
      {new Date(booking.checkOutDate).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </div>
  </div>
</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                         
                          <span className="text-gray-600 text-sm">{booking.numberOfDays} days</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-gray-900">
                          {booking.amount} $
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${bookingStatus.color} border font-medium whitespace-nowrap`}>
                          {bookingStatus.status}
                        </Badge>
                      </TableCell>

              <TableCell>
  {(booking.isAppeared == false && booking.isConfirmed==false ) && (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* ✅ Confirm Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-gray-200 hover:bg-green-50 text-green-600"
              onClick={async () => {
                await CofirmedbyAdmin(String(booking.id))
                fetchbookings()
              }}
            >
              <Check className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>User Not Appeared</TooltipContent>
        </Tooltip>

        {/* ❌ Cancel Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-gray-200 hover:bg-red-50 text-red-600"
              onClick={async () => {
                await CofirmedbyAdminuserAppeared(String(booking.id))
                fetchbookings()
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>User Appeared (Cancelled)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )}
</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-gray-200 hover:bg-gray-50"
                                onClick={() => setSelectedBooking(booking)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto rounded-3xl border-0 shadow-2xl">
                              <DialogHeader className="pb-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-[#023e8a] to-[#00b3d7] bg-clip-text text-transparent">
                                      Booking #{selectedBooking?.id}
                                    </DialogTitle>
                                    <DialogDescription className="text-gray-600 mt-2 text-lg">
                                      Complete booking and hotel information
                                    </DialogDescription>
                                  </div>
                                  <Badge
                                    className={`${getBookingStatus(selectedBooking).color} border font-semibold px-4 py-2 rounded-full text-lg`}
                                  >
                                    {getBookingStatus(selectedBooking).status}
                                  </Badge>
                                </div>
                              </DialogHeader>

                              {selectedBooking && (
                                <div className="space-y-8 py-6">
                                  {/* Hotel Images Gallery */}
                                  <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                      <div className="w-8 h-8 bg-gradient-to-r from-[#023e8a] to-[#00b3d7] rounded-lg flex items-center justify-center text-white font-bold">
                                        {selectedBooking.hotel.starRating}★
                                      </div>
                                      {selectedBooking.hotel.name}
                                    </h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                      {selectedBooking.hotel.images?.map((image, index) => (
                                        <div
                                          key={index}
                                          className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                          <img
                                            src={image || "/placeholder.svg"}
                                            alt={`Hotel view ${index + 1}`}
                                            className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                    {/* Guest Information */}
                                    <div className="space-y-6">
                                      <div className="bg-gradient-to-br from-[#023e8a]/5 to-[#00b3d7]/5 p-6 rounded-3xl border border-[#00b3d7]/20">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                                          <div className="w-10 h-10 bg-gradient-to-r from-[#023e8a] to-[#00b3d7] rounded-full flex items-center justify-center text-white font-semibold">
                                            <Users className="h-5 w-5" />
                                          </div>
                                          Guest Information
                                        </h3>
                                        <div className="space-y-3">
                                          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                                            <span className="font-semibold text-gray-700">Name:</span>
                                            <span className="font-bold text-gray-900">{selectedBooking.user?.name}</span>
                                          </div>
                                          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                                            <span className="font-semibold text-gray-700">Email:</span>
                                            <span className="text-gray-900">{selectedBooking.user?.email}</span>
                                          </div>
                                          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                                            <span className="font-semibold text-gray-700">Guest ID:</span>
                                            <span className="font-mono text-[#023e8a]">#{selectedBooking.user?.id}</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Booking Information */}
                                      <div className="bg-gradient-to-br from-[#00b3d7]/5 to-[#023e8a]/5 p-6 rounded-3xl border border-[#023e8a]/20">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                                          <div className="w-10 h-10 bg-gradient-to-r from-[#00b3d7] to-[#023e8a] rounded-full flex items-center justify-center text-white">
                                            <Calendar className="h-5 w-5" />
                                          </div>
                                          Booking Details
                                        </h3>
                                        <div className="space-y-3">
                                          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                                            <span className="font-semibold text-gray-700">Check-in:</span>
                                            <span className="font-bold text-[#00b3d7]">
                                              {selectedBooking.checkIndate}
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                                            <span className="font-semibold text-gray-700">Check-out:</span>
                                            <span className="font-bold text-[#023e8a]">
                                              {selectedBooking.checkOutDate}
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                                            <span className="font-semibold text-gray-700">Duration:</span>
                                            <span className="font-bold text-[#00b3d7]">
                                              {selectedBooking.numberOfDays} days
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                                            <span className="font-semibold text-gray-700">Total Amount:</span>
                                            <span className="font-bold text-2xl bg-gradient-to-r from-[#023e8a] to-[#00b3d7] bg-clip-text text-transparent">
                                              {selectedBooking.amount}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Hotel Information */}
                                    <div className="xl:col-span-2 space-y-6">
                                      <div className="bg-gradient-to-br from-[#023e8a]/5 to-[#00b3d7]/10 p-6 rounded-3xl border border-[#00b3d7]/20">
                                        <h3 className="font-bold text-gray-900 mb-4 text-lg">Hotel Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-3">
                                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                              <div className="text-sm font-semibold text-gray-700 mb-1">Hotel Name</div>
                                              <div className="font-bold text-gray-900">
                                                {selectedBooking.hotel.name}
                                              </div>
                                            </div>
                                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                              <div className="text-sm font-semibold text-gray-700 mb-1">Rating</div>
                                              <div className="flex items-center gap-2">
                                                <span className="font-bold text-[#023e8a]">
                                                  {selectedBooking.hotel.starRating}
                                                </span>
                                                <div className="flex">
                                                  {[...Array(Number.parseInt(selectedBooking.hotel.starRating))].map(
                                                    (_, i) => (
                                                      <span key={i} className="text-amber-400">
                                                        ⭐
                                                      </span>
                                                    ),
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                              <div className="text-sm font-semibold text-gray-700 mb-1">Location</div>
                                              <div className="text-gray-900">
                                                {selectedBooking.hotel.city}, {selectedBooking.hotel.state}
                                              </div>
                                              <div className="text-gray-600 text-sm">
                                                {selectedBooking.hotel.country}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="space-y-3">
                                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                              <div className="text-sm font-semibold text-gray-700 mb-1">Address</div>
                                              <div className="text-gray-900">{selectedBooking.hotel.Address}</div>
                                            </div>
                                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                              <div className="text-sm font-semibold text-gray-700 mb-1">
                                                Check-in Time
                                              </div>
                                              <div className="font-bold text-[#00b3d7]">
                                                {selectedBooking.hotel.checkInTime}
                                              </div>
                                            </div>
                                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                              <div className="text-sm font-semibold text-gray-700 mb-1">
                                                Check-out Time
                                              </div>
                                              <div className="font-bold text-[#023e8a]">
                                                {selectedBooking.hotel.checkOutTime}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Room Information with Images */}
                                      <div className="space-y-4">
                                        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-3">
                                          <div className="w-10 h-10 bg-gradient-to-r from-[#023e8a] to-[#00b3d7] rounded-full flex items-center justify-center text-white">
                                            <Bed className="h-5 w-5" />
                                          </div>
                                          Room Details
                                        </h3>
                                        {selectedBooking.room.map((room, index) => (
                                          <div
                                            key={room.id || index}
                                            className="bg-gradient-to-br from-[#023e8a]/5 to-[#00b3d7]/5 p-6 rounded-3xl border border-[#00b3d7]/20"
                                          >
                                            <div className="flex items-center justify-between mb-4">
                                              <h4 className="font-bold text-xl text-gray-900">{room.roomType}</h4>
                                              <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500 line-through">
                                                  ${room.basePrice}/night
                                                </span>
                                                <span className="font-bold text-[#00b3d7] text-lg">
                                                  ${room.discountedPrice}/night
                                                </span>
                                              </div>
                                            </div>

                                            {/* Room Images */}
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                                              {room.images.map((image, imgIndex) => (
                                                <div
                                                  key={imgIndex}
                                                  className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                                                >
                                                  <img
                                                    src={image || "/placeholder.svg"}
                                                    alt={`Room view ${imgIndex + 1}`}
                                                    className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                                                  />
                                                </div>
                                              ))}
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                              <div className="p-3 bg-white rounded-xl shadow-sm">
                                                <div className="text-sm font-semibold text-gray-700 mb-1">
                                                  Max Occupancy
                                                </div>
                                                <div className="font-bold text-[#00b3d7]">
                                                  {room.maxOccupancy} guests
                                                </div>
                                              </div>
                                              <div className="p-3 bg-white rounded-xl shadow-sm">
                                                <div className="text-sm font-semibold text-gray-700 mb-1">
                                                  Room Size
                                                </div>
                                                <div className="font-bold text-[#023e8a]">
                                                  {room.roomSize} {room.roomSizeUnit}
                                                </div>
                                              </div>
                                              <div className="p-3 bg-white rounded-xl shadow-sm">
                                                <div className="text-sm font-semibold text-gray-700 mb-1">Smoking</div>
                                                <div
                                                  className={`font-bold ${room.smokingAllowed ? "text-[#023e8a]" : "text-[#00b3d7]"}`}
                                                >
                                                  {room.smokingAllowed ? "Allowed" : "Not Allowed"}
                                                </div>
                                              </div>
                                            </div>

                                            <div className="mt-4 p-3 bg-white rounded-xl shadow-sm">
                                              <div className="text-sm font-semibold text-gray-700 mb-2">
                                                Bed Configuration
                                              </div>
                                              <div className="flex flex-wrap gap-2">
                                                {room.bedConfiguration.map((bed, bedIndex) => (
                                                  <Badge
                                                    key={bedIndex}
                                                    className="bg-[#00b3d7]/10 text-[#023e8a] border-[#00b3d7]/30"
                                                  >
                                                    {bed}
                                                  </Badge>
                                                ))}
                                              </div>
                                            </div>

                                            <div className="mt-4 p-3 bg-white rounded-xl shadow-sm">
                                              <div className="text-sm font-semibold text-gray-700 mb-2">
                                                Room Amenities
                                              </div>
                                              <div className="flex flex-wrap gap-2">
                                                {room.amenities.map((amenity, amenityIndex) => (
                                                  <Badge
                                                    key={amenityIndex}
                                                    className="bg-[#023e8a]/10 text-[#023e8a] border-[#023e8a]/30"
                                                  >
                                                    {amenity}
                                                  </Badge>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Hotel Amenities */}
                                  {selectedBooking.hotel.amenities && (
                                    <div className="bg-gradient-to-br from-[#023e8a]/3 to-[#00b3d7]/3 p-6 rounded-3xl border border-[#00b3d7]/15">
                                      <h3 className="font-bold text-gray-900 mb-4 text-lg">Hotel Amenities</h3>
                                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {selectedBooking.hotel.amenities.map((amenity, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                                          >
                                            <div className="w-8 h-8 bg-gradient-to-r from-[#023e8a] to-[#00b3d7] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                              ✓
                                            </div>
                                            <span className="font-medium text-gray-900">{amenity}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                   
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
          {filteredBookings.length > 0 && (
                          <div className="px-6 py-4 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length}{" "}
                                Bookings
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  disabled={currentPage === 1}
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
                                  disabled={currentPage === totalPages}
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
