"use client"

import { useEffect, useState } from "react"
import { format,parse,isValid } from "date-fns"
import {
  Search,
  PlaneTakeoff,
  Filter,
  MoreHorizontal,
  Calendar,
  Tag,
  Eye,
  Clock,
  Shield,
  X,
  MapPin,
  Users,
  Package,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Plane,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { DeleteFlightTicket, GetTicket } from "@/lib/flight_api"
import type { Ticket } from "@/types/checkout" // Assuming Ticket type is imported from here
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"


export function TicketList() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [tripTypeFilter, setTripTypeFilter] = useState<string>("all")
  const [classFilter, setClassFilter] = useState<string>("all")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        const res = await GetTicket()
           const sorted = res.sort((a, b) => {
          const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
          const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
          return dateB - dateA
        })
        setTickets(sorted)
      } catch (error) {
        console.error("Error fetching tickets:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTickets()
  }, [])

  const filteredTickets = tickets.filter((ticket) => {
    const search = searchTerm.toLowerCase()
    const matchesSearch =
      ticket.id?.toString().includes(search) ||
      ticket.from.toLowerCase().includes(search) ||
      ticket.to.toLowerCase().includes(search) ||
      ticket.airline.toLowerCase().includes(search)
    const matchesTripType = tripTypeFilter === "all" || ticket.tripType.toLowerCase() === tripTypeFilter.toLowerCase()
    const matchesClass = classFilter === "all" || ticket.flightClass.toLowerCase() === classFilter.toLowerCase()
    return matchesSearch && matchesTripType && matchesClass
  })
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTickets = filteredTickets.slice(startIndex, endIndex)



  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-700 border-gray-200"
  }

  const getClassColor = (classType: string) => {
    switch (classType.toLowerCase()) {
      case "economy":
        return "bg-blue-50 text-blue-600 border-blue-200"
      case "business":
        return "bg-purple-50 text-purple-600 border-purple-200"
      case "first":
      case "first class":
        return "bg-amber-50 text-amber-600 border-amber-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTicket(null)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <Card className="p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    )
  }
function parseApiDate(dateStr: string) {
  if (!dateStr) return null

  const customDate = parse(dateStr, "dd/MM/yyyy HH:mm", new Date())
  if (isValid(customDate)) return customDate
  // Try ISO format first
  const isoDate = new Date(dateStr)
  if (isValid(isoDate)) return isoDate

  // Try dd/MM/yyyy HH:mm format

  return null
}
const handleticketdelete = async (id: string) => {
  try {
    const response = await DeleteFlightTicket(id);
    if (response) {
      // ✅ Remove deleted ticket from state
      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== id));
      toast.success("Flight Deleted Successfully");
    }
  } catch (error) {
    toast.error("Flight not Deleted. Try Again");
  }
};
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <PlaneTakeoff className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold">Flight Tickets</h1>
        </div>
        <p className="text-blue-100">Manage and view all posted flight tickets</p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>{tickets.filter((t) => t.isActive).length} Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <span>{tickets.filter((t) => !t.isActive).length} Inactive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            <span>{tickets.length} Total</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID, route, or airline..."
                className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select onValueChange={setTripTypeFilter} defaultValue="all">
                <SelectTrigger className="w-[140px] border-gray-200">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Trip Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trips</SelectItem>
                  <SelectItem value="one-way">One-way</SelectItem>
                  <SelectItem value="round-trip">Round-trip</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setClassFilter} defaultValue="all">
                <SelectTrigger className="w-[140px] border-gray-200">
                  <Tag className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {currentTickets.length > 0 ? (
              currentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-bold text-blue-600 text-lg bg-blue-50 px-3 py-1 rounded-full">
                          #{ticket.id}
                        </span>
                        <Badge variant="outline" className={getStatusColor(ticket.isActive || false)}>
                          {ticket.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {ticket.isRefundable && (
                          <Badge className="bg-green-50 text-green-600 border-green-200" variant="outline">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Refundable
                          </Badge>
                        )}
                        <Badge variant="outline" className={getClassColor(ticket.flightClass)}>
                          {ticket.flightClass}
                        </Badge>
                      </div>
                      {/* Route */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span>{ticket.from}</span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-500">
                            <ArrowRight className="h-5 w-5" />
                            <Plane className="h-4 w-4" />
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-indigo-500" />
                            <span>{ticket.to}</span>
                          </div>
                        </div>
                      </div>
                      {/* Flight Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-gray-400" />
                          <span>
                            <strong>{ticket.airline}</strong> • Flight {ticket.flightNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{format(new Date(ticket.departureDate), "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>
                            {format(new Date(ticket.departureTime), "HH:mm")} -{" "}
                            {format(new Date(ticket.arrivalTime), "HH:mm")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{ticket.passengerType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {ticket.currency} {ticket.totalPrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Base: {ticket.currency} {ticket.basePrice.toLocaleString()} + Tax: {ticket.currency}{" "}
                          {ticket.taxPrice.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleViewTicket(ticket)}
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-gray-200 bg-transparent">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={()=>
                              {
                                router.push(`/support/${ticket.id||""}`)
                              }
                            }>
                              <Eye className="h-4 w-4 mr-2" />
                              Edit ticket
                            </DropdownMenuItem>
                          
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={()=>
                              {
                                handleticketdelete(ticket.id||"")
                              }
                            } className="text-red-600">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlaneTakeoff className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setTripTypeFilter("all")
                    setClassFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
         {filteredTickets.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredTickets.length)} of {filteredTickets.length}{" "}
                        tickets
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

      {/* Ticket Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PlaneTakeoff className="h-6 w-6 text-blue-600" />
              </div>
              Flight Ticket Details
              <Badge
                variant="outline"
                className={selectedTicket ? getStatusColor(selectedTicket.isActive || false) : ""}
              >
                {selectedTicket?.isActive ? "Active" : "Inactive"}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              {/* Header Info */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-blue-900">#{selectedTicket.id}</h3>
                      <p className="text-blue-700">{selectedTicket.tripType} Trip</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {selectedTicket.currency} {selectedTicket.totalPrice.toLocaleString()}
                      </div>
                      <p className="text-blue-700">Total Price</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xl font-semibold">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <span>{selectedTicket.from}</span>
                    </div>
                    <ArrowRight className="h-6 w-6 text-blue-500" />
                    <Plane className="h-5 w-5 text-blue-500" />
                    <ArrowRight className="h-6 w-6 text-blue-500" />
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-indigo-500" />
                      <span>{selectedTicket.to}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Flight Information */}
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <Plane className="h-5 w-5 text-blue-500" />
                      Flight Information
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Airline</p>
                        <p className="font-semibold">{selectedTicket.airline}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Flight Number</p>
                        <p className="font-semibold">{selectedTicket.flightNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Class</p>
                        <Badge className={getClassColor(selectedTicket.flightClass)}>
                          {selectedTicket.flightClass}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-gray-500">Passenger Type</p>
                        <p className="font-semibold">{selectedTicket.passengerType}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule */}
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-500" />
                      Schedule
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500">Departure Date</p>
                        <p className="font-semibold">{format(new Date(selectedTicket.departureDate), "PPP")}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Departure Time</p>
                        <p className="font-semibold">{format(new Date(selectedTicket.departureTime), "p")}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Arrival Time</p>
                        <p className="font-semibold">{format(new Date(selectedTicket.arrivalTime), "p")}</p>
                      </div>
                      {selectedTicket.returnDate && (
                        <div>
                          <p className="text-gray-500">Return Date</p>
                          <p className="font-semibold">{format(new Date(selectedTicket.returnDate), "PPP")}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing Breakdown */}
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-orange-500" />
                      Pricing
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Base Price</span>
                        <span className="font-semibold">
                          {selectedTicket.currency} {selectedTicket.basePrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Taxes & Fees</span>
                        <span className="font-semibold">
                          {selectedTicket.currency} {selectedTicket.taxPrice.toLocaleString()}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Price</span>
                        <span className="text-blue-600">
                          {selectedTicket.currency} {selectedTicket.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Baggage */}
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <Package className="h-5 w-5 text-purple-500" />
                      Baggage
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500">Checked Baggage</p>
                        <p className="font-semibold">{selectedTicket.checkedBaggage}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Cabin Baggage</p>
                        <p className="font-semibold">{selectedTicket.cabbinBaggage}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Flight Segments Section */}
          {selectedTicket.segments && selectedTicket.segments.length > 0 && (
  <Card>
    <CardHeader>
      <h4 className="text-lg font-semibold flex items-center gap-2">
        <PlaneTakeoff className="h-5 w-5 text-blue-500" />
        Flight Segments
      </h4>
    </CardHeader>
    <CardContent className="space-y-6">
      {selectedTicket.segments.map((segment, index) => {
        // parse each segment separately
        const parsedDeparture = parse(segment.departureTime, "dd/MM/yyyy HH:mm", new Date())
        const parsedArrival = parse(segment.arrivalTime, "dd/MM/yyyy HH:mm", new Date())

        return (
          <div key={segment.segmentId} className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                {segment.type === "outbound" ? "Outbound Flight" : "Return Flight"}
              </Badge>
              <span className="font-semibold text-gray-800">
                Flight {segment.flightNumber}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Departure</p>
                <p className="font-semibold">
                  {segment.departureAirport} ({segment.departurelocation})
                </p>
               <p className="text-gray-600">
  {parseApiDate(segment.departureTime)
    ? format(parseApiDate(segment.departureTime)!, "PPP p")
    : "Invalid Date"}
</p>
              </div>
              <div>
                <p className="text-gray-500">Arrival</p>
                <p className="font-semibold">
                  {segment.arrivalAirport} ({segment.arrivallocation})
                </p>
                <p className="text-gray-600">
  {parseApiDate(segment.arrivalTime)
    ? format(parseApiDate(segment.arrivalTime)!, "PPP p")
    : "Invalid Date"}
</p>
              </div>
              <div>
                <p className="text-gray-500">Flight Duration</p>
                <p className="font-semibold">{segment.flightDuration} minutes</p>
              </div>
              <div>
                <p className="text-gray-500">Cabin Class</p>
                <Badge className={getClassColor(segment.cabinClass)}>
                  {segment.cabinClass}
                </Badge>
              </div>
              <div>
                <p className="text-gray-500">Baggage Recheck</p>
                <span
                  className={
                    segment.baggageRecheckRequired
                      ? "text-orange-700"
                      : "text-green-700"
                  }
                >
                  {segment.baggageRecheckRequired
                    ? "Required"
                    : "Not Required"}
                </span>
              </div>
              {segment.aircraftType && (
                <div>
                  <p className="text-gray-500">Aircraft Type</p>
                  <p className="font-semibold">{segment.aircraftType}</p>
                </div>
              )}
              {segment.operatingCarrier && (
                <div>
                  <p className="text-gray-500">Operating Carrier</p>
                  <p className="font-semibold">{segment.operatingCarrier}</p>
                </div>
              )}
              {segment.marketingCarrier && (
                <div>
                  <p className="text-gray-500">Marketing Carrier</p>
                  <p className="font-semibold">{segment.marketingCarrier}</p>
                </div>
              )}
            </div>

            {index < selectedTicket.segments.length - 1 &&
              segment.layoverDuration && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Layover: {segment.layoverDuration} minutes</span>
                  </div>
                </>
              )}
          </div>
        )
      })}
    </CardContent>
  </Card>
)}

              {/* Policies */}
              <Card>
                <CardHeader>
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-teal-500" />
                    Policies & Terms
                  </h4>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {selectedTicket.isRefundable ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                        <span className={selectedTicket.isRefundable ? "text-green-700" : "text-red-700"}>
                          {selectedTicket.isRefundable ? "Refundable" : "Non-refundable"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {selectedTicket.seatSelectionAllowed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                        <span className={selectedTicket.seatSelectionAllowed ? "text-green-700" : "text-red-700"}>
                          Seat Selection {selectedTicket.seatSelectionAllowed ? "Allowed" : "Not Allowed"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {selectedTicket.passportRequired ? (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        <span className={selectedTicket.passportRequired ? "text-orange-700" : "text-green-700"}>
                          Passport {selectedTicket.passportRequired ? "Required" : "Not Required"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500">Cancellation Penalty</p>
                        <p className="font-semibold">
                          {selectedTicket.currency} {selectedTicket.cancellationPenalty.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Cancellation Allowed Until</p>
                        <p className="font-semibold">{selectedTicket.cancellationAllowedUntill}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Voidable Until</p>
                        <p className="font-semibold">{format(new Date(selectedTicket.voidableUntil), "PPP p")}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
