"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import {
  Search,
  Calendar,
  Users,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User,
  Eye,
  Building,
  FileText,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Booking } from "@/types/checkout"
import { FetchFlightBookings, FlightBookingbyAgent, IssuePNRFlightBookings } from "@/lib/flight_api"

import { Toaster, toast } from "react-hot-toast"

export function BookingInfo({id}: {id?: string}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPnrModalOpen, setIsPnrModalOpen] = useState(false)
  const [pnrNumber, setPnrNumber] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await FlightBookingbyAgent(id)

        const sorted = res.sort((a:any, b:any) => {
          const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
          const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
          return dateB - dateA
        })
        setBookings(sorted)
      } catch (error) {
        console.error("Error fetching tickets:", error)
      } finally {
      }
    }
    fetchTickets()
  }, [])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toString().includes(searchTerm.toLowerCase()) ||
      booking.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.flight.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.flight.to.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.bookingStatus.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBookings = filteredBookings.slice(startIndex, endIndex)

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a")
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "reserved":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-red-100 text-red-700 border-red-200"
    }
  }

  const getClassColor = (classType: string) => {
    switch (classType.toLowerCase()) {
      case "economy":
        return "bg-blue-50 text-blue-600 border-blue-200"
      case "business":
        return "bg-purple-50 text-purple-600 border-purple-200"
      case "first":
        return "bg-amber-50 text-amber-600 border-amber-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  const handleIssuePnr = async () => {
    if (!pnrNumber.trim()) return

    try {
      const response = IssuePNRFlightBookings(String(selectedBooking?.id), pnrNumber, "CONFIRMED")
      if (selectedBooking) {
        const updatedBookings = bookings.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, pnrNumber: pnrNumber, bookingStatus: "CONFIRMED" }
            : booking,
        )
        setBookings(updatedBookings)
        setSelectedBooking({ ...selectedBooking, pnrNumber: pnrNumber, bookingStatus: "CONFIRMED" })
      }

      setIsPnrModalOpen(false)
      setPnrNumber("")
      toast.success("PNR number issued successfully!")
    } catch (error) {
      console.error("Error issuing PNR:", error)
      toast.error("Failed to issue PNR number")
    }
  }

  const getBookingCounts = () => {
    const all = bookings.length
    const reserved = bookings.filter((b) => b.bookingStatus.toLowerCase() === "reserved").length
    const confirmed = bookings.filter((b) => b.bookingStatus.toLowerCase() === "confirmed").length
    return { all, reserved, confirmed }
  }

  const counts = getBookingCounts()
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }
  return (
    <div className="mx-auto p-4">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white px-4 py-2 rounded-full text-sm font-medium mb-3">
          <Building className="w-4 h-4" /> Customer Bookings
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Management</h1>
        <p className="text-gray-600 text-sm">View and manage customer flight bookings</p>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">All Bookings</CardTitle>

          <div className="space-y-4">
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  All Bookings
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {counts.all}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="reserved" className="flex items-center gap-2">
                  Reserved
                  <Badge variant="secondary" className="ml-1 text-xs bg-amber-100 text-amber-700">
                    {counts.reserved}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="confirmed" className="flex items-center gap-2">
                  Confirmed
                  <Badge variant="secondary" className="ml-1 text-xs bg-emerald-100 text-emerald-700">
                    {counts.confirmed}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID, name, flight number, or route..."
                className="pl-10 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Passenger Name</TableHead>
                  <TableHead>Flight Route</TableHead>
                  <TableHead>Departure Date</TableHead>
                  <TableHead>Airline & Flight No.</TableHead>

                  <TableHead>Total Price</TableHead>
                  <TableHead>PNR NO.</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBookings.length > 0 ? (
                  currentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>{`${booking.firstName} ${booking.lastName}`}</TableCell>
                      <TableCell>{`${booking.flight.from} → ${booking.flight.to}`}</TableCell>
                      <TableCell>{format(new Date(booking.flight.departureDate), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{`${booking.flight.airline} ${booking.flight.flightNumber}`}</TableCell>
                      <TableCell className="text-right">
                        {booking.flight.currency} {booking.flight.totalPrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {booking.bookingStatus.toLowerCase() === "confirmed" ? booking.pnrNumber : "No PNR Issused"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={getStatusColor(booking.bookingStatus)}>
                          {booking.bookingStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setIsModalOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {booking.bookingStatus.toLowerCase() === "reserved" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                              onClick={() => {
                                setSelectedBooking(booking)
                                setIsPnrModalOpen(true)
                              }}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                      No bookings found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {filteredBookings.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length}{" "}
                Flight Bookings
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

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Booking Details: {selectedBooking.id}
              </DialogTitle>
              <DialogDescription>
                Details for flight from {selectedBooking.flight.from} to {selectedBooking.flight.to}
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="flight" className="space-y-4 mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="flight">Flight</TabsTrigger>
                <TabsTrigger value="passenger">Passenger</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
              </TabsList>
              <TabsContent value="flight" className="space-y-4">
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-sm text-gray-600">{selectedBooking.flight.airline}</p>
                      <p className="font-semibold">{selectedBooking.flight.flightNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Class</p>
                      <p className="font-semibold capitalize">{selectedBooking.flight.flightClass}</p>
                    </div>
                  </div>
                  {selectedBooking.pnrNumber && (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <p className="text-sm text-emerald-600 font-medium">PNR Number</p>
                      <p className="font-bold text-emerald-800">{selectedBooking.pnrNumber}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#023e8a] text-white flex items-center justify-center">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        Departure • {format(new Date(selectedBooking.flight.departureDate), "EEE, MMM d")}
                      </p>
                      <p className="font-bold text-lg">{formatTime(selectedBooking.flight.departureTime)}</p>
                      <p className="font-medium">
                        {selectedBooking.flight.from} ({selectedBooking.flight.departureAirport})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#00b4d8] text-white flex items-center justify-center">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        Arrival • {format(new Date(selectedBooking.flight.arrivalDate), "EEE, MMM d")}
                      </p>
                      <p className="font-bold text-lg">{formatTime(selectedBooking.flight.arrivalTime)}</p>
                      <p className="font-medium">
                        {selectedBooking.flight.to} ({selectedBooking.flight.arrivalAirport})
                      </p>
                    </div>
                  </div>
                </div>
                {selectedBooking.flight.returnDate && (
                  <>
                    <Separator />
                    <h3 className="font-medium">Return Flight</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="font-medium">{selectedBooking.flight.flightNumber}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(selectedBooking.flight.returnDate), "MMM d, yyyy")} at{" "}
                        {formatTime(selectedBooking.flight.returnDate)}
                      </p>
                    </div>
                  </>
                )}
              </TabsContent>
              <TabsContent value="passenger" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Passenger Name</p>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-gray-400" />
                      <p className="font-medium">{`${selectedBooking.firstName} ${selectedBooking.lastName}`}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Contact Email</p>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-gray-400" />
                      <p className="font-medium">{selectedBooking.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Contact Phone</p>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-gray-400" />
                      <p className="font-medium">{selectedBooking.phoneNumber}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <p className="font-medium">{format(new Date(selectedBooking.dob), "MMM dd, yyyy")}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Gender</p>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-gray-400" />
                      <p className="font-medium capitalize">{selectedBooking.gender}</p>
                    </div>
                  </div>
                  {selectedBooking.passportNumber && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Passport Details</p>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-gray-400" />
                        <p className="font-medium">
                          {selectedBooking.passportNumber} (Expires:{" "}
                          {format(new Date(selectedBooking.passportExpirationDate), "MMM dd, yyyy")})
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedBooking.nationality && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Nationality</p>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                        <p className="font-medium">{selectedBooking.nationality}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="payment" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-gray-400" />
                      <p className="font-medium">
                        <Badge variant="outline" className={getStatusColor(selectedBooking.bookingStatus)}>
                          {selectedBooking.bookingStatus}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment Date</p>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <p className="font-medium">{format(new Date(selectedBooking.createdAt), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Total Amount</p>
                    <p className="font-bold text-lg text-[#023e8a]">
                      {selectedBooking.flight.currency} {selectedBooking.flight.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {selectedBooking && (
        <Dialog open={isPnrModalOpen} onOpenChange={setIsPnrModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" />
                Issue PNR Number
              </DialogTitle>
              <DialogDescription>
                Issue a PNR number for booking #{selectedBooking.id} - {selectedBooking.firstName}{" "}
                {selectedBooking.lastName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-700">
                  <strong>Flight:</strong> {selectedBooking.flight.flightNumber}
                </p>
                <p className="text-sm text-amber-700">
                  <strong>Route:</strong> {selectedBooking.flight.from} → {selectedBooking.flight.to}
                </p>
                <p className="text-sm text-amber-700">
                  <strong>Date:</strong> {format(new Date(selectedBooking.flight.departureDate), "MMM dd, yyyy")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pnr-number">PNR Number</Label>
                <Input
                  id="pnr-number"
                  placeholder="Enter PNR number (e.g., ABC123)"
                  value={pnrNumber}
                  onChange={(e) => setPnrNumber(e.target.value.toUpperCase())}
                  className="font-mono"
                />
                <p className="text-xs text-gray-500">PNR number should be 6 characters (letters and numbers)</p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsPnrModalOpen(false)
                  setPnrNumber("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleIssuePnr}
                disabled={!pnrNumber.trim() || pnrNumber.length < 3}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Issue PNR
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
