"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import {
  Search,
  PlaneTakeoff,
  MoreHorizontal,
  Calendar,
  Tag,
  Users,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  MapPin,
  Clock,
  Eye,
  X,
  Plane,
  CreditCard,
  Phone,
  Mail,
  User,
  Download,
  Printer,
  Filter,
  RefreshCw,
} from "lucide-react"
import { Ticket } from "lucide-react"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils/utils"

// Enhanced sample data with more comprehensive booking information
const tickets = [
  {
    id: "T-1234",
    bookingId: "B-5678",
    departureAirport: "JFK",
    departureCity: "New York",
    departureCountry: "United States",
    arrivalAirport: "LHR",
    arrivalCity: "London",
    arrivalCountry: "United Kingdom",
    departureDate: new Date(2025, 7, 15, 10, 30),
    arrivalDate: new Date(2025, 7, 15, 22, 45),
    returnDate: new Date(2025, 7, 22, 14, 15),
    tripType: "Round-trip",
    passengers: { adults: 2, children: 1, infants: 0 },
    passengerNames: ["John Smith", "Jane Smith", "Tommy Smith"],
    classType: "Economy",
    status: "Active",
    airline: "British Airways",
    flightNumber: "BA-117",
    price: 1250,
    duration: "7h 15m",
    aircraft: "Boeing 777-300ER",
    gate: "A12",
    terminal: "Terminal 5",
    seatNumbers: ["12A", "12B", "12C"],
    contactInfo: {
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
    },
    paymentInfo: {
      method: "Credit Card",
      cardLast4: "4532",
      amount: 1250,
      currency: "USD",
      date: new Date(2025, 6, 1),
    },
    amenities: ["Wifi", "Entertainment", "Meals", "Beverages"],
    baggage: {
      carryOn: "1 x 8kg",
      checked: "2 x 23kg",
    },
  },
  {
    id: "T-1235",
    bookingId: "B-5679",
    departureAirport: "LAX",
    departureCity: "Los Angeles",
    departureCountry: "United States",
    arrivalAirport: "DXB",
    arrivalCity: "Dubai",
    arrivalCountry: "United Arab Emirates",
    departureDate: new Date(2025, 7, 18, 23, 15),
    arrivalDate: new Date(2025, 7, 19, 19, 45),
    tripType: "One-way",
    passengers: { adults: 1, children: 0, infants: 0 },
    passengerNames: ["Sarah Johnson"],
    classType: "Business",
    status: "Pending",
    airline: "Emirates",
    flightNumber: "EK-215",
    price: 3200,
    duration: "16h 30m",
    aircraft: "Airbus A380-800",
    gate: "C24",
    terminal: "Terminal B",
    seatNumbers: ["2A"],
    contactInfo: {
      email: "sarah.j@example.com",
      phone: "+1 (555) 987-6543",
    },
    paymentInfo: {
      method: "Bank Transfer",
      amount: 3200,
      currency: "USD",
      date: new Date(2025, 6, 5),
    },
    amenities: ["Wifi", "Entertainment", "Premium Meals", "Lounge Access", "Priority Boarding"],
    baggage: {
      carryOn: "2 x 12kg",
      checked: "2 x 32kg",
    },
  },
  {
    id: "T-1236",
    bookingId: "B-5680",
    departureAirport: "SFO",
    departureCity: "San Francisco",
    departureCountry: "United States",
    arrivalAirport: "NRT",
    arrivalCity: "Tokyo",
    arrivalCountry: "Japan",
    departureDate: new Date(2025, 7, 20, 11, 45),
    arrivalDate: new Date(2025, 7, 21, 15, 20),
    returnDate: new Date(2025, 7, 30, 16, 20),
    tripType: "Round-trip",
    passengers: { adults: 2, children: 0, infants: 1 },
    passengerNames: ["Michael Chen", "Lisa Chen", "Baby Chen"],
    classType: "First Class",
    status: "Completed",
    airline: "Japan Airlines",
    flightNumber: "JL-002",
    price: 5800,
    duration: "11h 20m",
    aircraft: "Boeing 787-9",
    gate: "G15",
    terminal: "Terminal 3",
    seatNumbers: ["1A", "1B"],
    contactInfo: {
      email: "m.chen@example.com",
      phone: "+1 (555) 456-7890",
    },
    paymentInfo: {
      method: "Credit Card",
      cardLast4: "8901",
      amount: 5800,
      currency: "USD",
      date: new Date(2025, 6, 10),
    },
    amenities: ["Wifi", "Entertainment", "Premium Meals", "Lounge Access", "Priority Boarding", "Flat Bed"],
    baggage: {
      carryOn: "2 x 15kg",
      checked: "3 x 32kg",
    },
  },
  {
    id: "T-1237",
    bookingId: "B-5681",
    departureAirport: "ORD",
    departureCity: "Chicago",
    departureCountry: "United States",
    arrivalAirport: "CDG",
    arrivalCity: "Paris",
    arrivalCountry: "France",
    departureDate: new Date(2025, 7, 22, 19, 10),
    arrivalDate: new Date(2025, 7, 23, 12, 55),
    tripType: "One-way",
    passengers: { adults: 1, children: 0, infants: 0 },
    passengerNames: ["Emma Wilson"],
    classType: "Economy",
    status: "Active",
    airline: "Air France",
    flightNumber: "AF-136",
    price: 890,
    duration: "8h 45m",
    aircraft: "Airbus A350-900",
    gate: "F8",
    terminal: "Terminal 1",
    seatNumbers: ["24F"],
    contactInfo: {
      email: "emma.w@example.com",
      phone: "+1 (555) 234-5678",
    },
    paymentInfo: {
      method: "Debit Card",
      cardLast4: "2345",
      amount: 890,
      currency: "USD",
      date: new Date(2025, 6, 15),
    },
    amenities: ["Wifi", "Entertainment", "Meals"],
    baggage: {
      carryOn: "1 x 8kg",
      checked: "1 x 23kg",
    },
  },
  {
    id: "T-1238",
    bookingId: "B-5682",
    departureAirport: "LHE",
    departureCity: "Lahore",
    departureCountry: "Pakistan",
    arrivalAirport: "DXB",
    arrivalCity: "Dubai",
    arrivalCountry: "United Arab Emirates",
    departureDate: new Date(2025, 7, 25, 2, 30),
    arrivalDate: new Date(2025, 7, 25, 6, 15),
    returnDate: new Date(2025, 8, 5, 4, 15),
    tripType: "Round-trip",
    passengers: { adults: 3, children: 2, infants: 1 },
    passengerNames: ["Ahmed Khan", "Fatima Khan", "Ali Khan", "Zara Khan", "Omar Khan", "Baby Khan"],
    classType: "Economy",
    status: "Pending",
    airline: "Emirates",
    flightNumber: "EK-623",
    price: 2100,
    duration: "3h 45m",
    aircraft: "Boeing 777-300",
    gate: "B12",
    terminal: "Terminal 3",
    seatNumbers: ["15A", "15B", "15C", "16A", "16B"],
    contactInfo: {
      email: "ahmed.khan@example.com",
      phone: "+92 300 123 4567",
    },
    paymentInfo: {
      method: "Credit Card",
      cardLast4: "6789",
      amount: 2100,
      currency: "USD",
      date: new Date(2025, 6, 20),
    },
    amenities: ["Wifi", "Entertainment", "Meals", "Beverages"],
    baggage: {
      carryOn: "3 x 8kg",
      checked: "4 x 23kg",
    },
  },
  {
    id: "T-1239",
    bookingId: "B-5683",
    departureAirport: "FRA",
    departureCity: "Frankfurt",
    departureCountry: "Germany",
    arrivalAirport: "JFK",
    arrivalCity: "New York",
    arrivalCountry: "United States",
    departureDate: new Date(2025, 7, 28, 14, 20),
    arrivalDate: new Date(2025, 7, 28, 17, 50),
    tripType: "One-way",
    passengers: { adults: 2, children: 1, infants: 0 },
    passengerNames: ["Hans Mueller", "Anna Mueller", "Max Mueller"],
    classType: "Business",
    status: "Active",
    airline: "Lufthansa",
    flightNumber: "LH-441",
    price: 4200,
    duration: "8h 30m",
    aircraft: "Airbus A340-600",
    gate: "A25",
    terminal: "Terminal 1",
    seatNumbers: ["3A", "3B", "3C"],
    contactInfo: {
      email: "h.mueller@example.com",
      phone: "+49 30 123 4567",
    },
    paymentInfo: {
      method: "Credit Card",
      cardLast4: "3456",
      amount: 4200,
      currency: "EUR",
      date: new Date(2025, 6, 25),
    },
    amenities: ["Wifi", "Entertainment", "Premium Meals", "Lounge Access", "Priority Boarding"],
    baggage: {
      carryOn: "2 x 12kg",
      checked: "3 x 32kg",
    },
  },
]

export function TicketListingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterClass, setFilterClass] = useState("all")
  const [filterAirline, setFilterAirline] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTicket, setSelectedTicket] = useState<(typeof tickets)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 6

  const airlines = Array.from(new Set(tickets.map((ticket) => ticket.airline)))

  const filteredAndSortedTickets = useMemo(() => {
    const filtered = tickets.filter((ticket) => {
      const matchesSearch =
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.departureAirport.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.arrivalAirport.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.departureCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.arrivalCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.passengerNames.some((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = filterStatus === "all" || ticket.status.toLowerCase() === filterStatus
      const matchesClass = filterClass === "all" || ticket.classType.toLowerCase() === filterClass
      const matchesAirline = filterAirline === "all" || ticket.airline === filterAirline

      return matchesSearch && matchesStatus && matchesClass && matchesAirline
    })

    // Sort tickets
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "date":
          comparison = a.departureDate.getTime() - b.departureDate.getTime()
          break
        case "price":
          comparison = a.price - b.price
          break
        case "duration":
          comparison = a.duration.localeCompare(b.duration)
          break
        case "airline":
          comparison = a.airline.localeCompare(b.airline)
          break
        case "passenger":
          comparison = a.passengerNames[0].localeCompare(b.passengerNames[0])
          break
        default:
          comparison = 0
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [searchTerm, filterStatus, filterClass, filterAirline, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredAndSortedTickets.length / itemsPerPage)
  const paginatedTickets = filteredAndSortedTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "Completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getClassColor = (classType: string) => {
    switch (classType) {
      case "Economy":
        return "bg-blue-100 text-blue-800"
      case "Business":
        return "bg-purple-100 text-purple-800"
      case "First Class":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewDetails = (ticket: (typeof tickets)[0]) => {
    setSelectedTicket(ticket)
    setIsModalOpen(true)
  }

  const formatTime = (date: Date) => {
    return format(date, "h:mm a")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <motion.div
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white px-6 py-3 rounded-full mb-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Ticket className="w-5 h-5" />
          <span className="font-semibold">Posted Flight Tickets</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Posted Tickets</h1>
        <p className="text-gray-600 text-lg">
          View, filter, and manage all posted flight tickets available for customer booking
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Ticket Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by ticket ID, airports, airlines, or flight details..."
                className="pl-10 h-12 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first class">First Class</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterAirline} onValueChange={setFilterAirline}>
                <SelectTrigger>
                  <SelectValue placeholder="Airline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Airlines</SelectItem>
                  {airlines.map((airline) => (
                    <SelectItem key={airline} value={airline}>
                      {airline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="airline">Airline</SelectItem>
                  <SelectItem value="passenger">Passenger</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center space-x-2"
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                <span>{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("all")
                  setFilterClass("all")
                  setFilterAirline("all")
                  setSortBy("date")
                  setSortOrder("asc")
                  setCurrentPage(1)
                }}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset</span>
              </Button>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
              <span>
                Showing {paginatedTickets.length} of {filteredAndSortedTickets.length} tickets
              </span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tickets Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-[#023e8a]/5 to-[#00b4d8]/5">
                    <TableHead className="font-semibold">Ticket ID</TableHead>
                    <TableHead className="font-semibold">Flight</TableHead>
                    <TableHead className="font-semibold">Route</TableHead>
                    <TableHead className="font-semibold">Date & Time</TableHead>
                    <TableHead className="font-semibold">Passenger(s)</TableHead>
                    <TableHead className="font-semibold">Class</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Price</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {paginatedTickets.map((ticket, index) => (
                      <motion.tr
                        key={ticket.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold text-[#023e8a]">{ticket.id}</p>
                            <p className="text-xs text-gray-500">{ticket.bookingId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <motion.div
                              className="w-8 h-8 bg-gradient-to-br from-[#023e8a] to-[#00b4d8] rounded-lg flex items-center justify-center text-white text-xs font-bold"
                              whileHover={{ scale: 1.1 }}
                            >
                              {ticket.airline
                                .split(" ")
                                .map((word) => word[0])
                                .join("")}
                            </motion.div>
                            <div>
                              <p className="font-medium">{ticket.flightNumber}</p>
                              <p className="text-xs text-gray-500">{ticket.airline}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="text-center">
                              <p className="font-semibold">{ticket.departureAirport}</p>
                              <p className="text-xs text-gray-500">{ticket.departureCity}</p>
                            </div>
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                            >
                              <PlaneTakeoff className="w-4 h-4 text-[#023e8a]" />
                            </motion.div>
                            <div className="text-center">
                              <p className="font-semibold">{ticket.arrivalAirport}</p>
                              <p className="text-xs text-gray-500">{ticket.arrivalCity}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="flex items-center space-x-1 mb-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-sm font-medium">{format(ticket.departureDate, "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{formatTime(ticket.departureDate)}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-600">{ticket.duration}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{ticket.passengerNames[0]}</p>
                            {ticket.passengerNames.length > 1 && (
                              <p className="text-xs text-gray-500">+{ticket.passengerNames.length - 1} more</p>
                            )}
                            <div className="flex items-center space-x-1 mt-1">
                              <Users className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">
                                {ticket.passengers.adults + ticket.passengers.children + ticket.passengers.infants}{" "}
                                total
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getClassColor(ticket.classType)}>
                            {ticket.classType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-bold text-[#023e8a]">${ticket.price.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{ticket.tripType}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                onClick={() => handleViewDetails(ticket)}
                                className="bg-gradient-to-r from-[#023e8a] to-[#00b4d8] hover:from-[#01579b] hover:to-[#0288d1] text-white"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </motion.div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button variant="outline" size="sm">
                                    <MoreHorizontal className="w-3 h-3" />
                                  </Button>
                                </motion.div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ticket Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <MapPin className="w-4 h-4 mr-2" />
                                  View Route Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Modify Schedule
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Tag className="w-4 h-4 mr-2" />
                                  Edit Ticket Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Remove Ticket</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>

              {paginatedTickets.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ticket className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No posted tickets found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria or post new flight tickets</p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredAndSortedTickets.length)} of{" "}
                  {filteredAndSortedTickets.length} tickets
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page
                      if (totalPages <= 5) {
                        page = i + 1
                      } else if (currentPage <= 3) {
                        page = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i
                      } else {
                        page = currentPage - 2 + i
                      }

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "w-8 h-8 p-0",
                            currentPage === page && "bg-gradient-to-r from-[#023e8a] to-[#00b4d8]",
                          )}
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Detailed Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="text-2xl font-bold">Booking Details</span>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-[#023e8a]/5 to-[#00b4d8]/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedTicket.departureCity} to {selectedTicket.arrivalCity}
                    </h3>
                    <p className="text-gray-600">
                      {selectedTicket.id} • {selectedTicket.bookingId}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getStatusColor(selectedTicket.status)}>
                      {selectedTicket.status}
                    </Badge>
                    <Badge variant="outline" className={getClassColor(selectedTicket.classType)}>
                      {selectedTicket.classType}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Airline</p>
                    <p className="font-semibold">{selectedTicket.airline}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Flight</p>
                    <p className="font-semibold">{selectedTicket.flightNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Aircraft</p>
                    <p className="font-semibold">{selectedTicket.aircraft}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Price</p>
                    <p className="font-bold text-[#023e8a] text-lg">${selectedTicket.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="flight" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="flight">Flight Details</TabsTrigger>
                  <TabsTrigger value="passengers">Passengers</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                </TabsList>

                <TabsContent value="flight" className="space-y-6">
                  {/* Flight Route */}
                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#023e8a] to-[#00b4d8] z-0"></div>

                    <div className="relative z-10 flex mb-8">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#023e8a] to-[#0353a4] text-white shadow-lg">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div className="ml-6 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">
                              Departure • {format(selectedTicket.departureDate, "EEE, MMM d")}
                            </p>
                            <p className="font-bold text-2xl text-gray-900">
                              {formatTime(selectedTicket.departureDate)}
                            </p>
                            <p className="font-semibold text-lg text-gray-700">
                              {selectedTicket.departureCity} ({selectedTicket.departureAirport})
                            </p>
                            <p className="text-sm text-gray-500">{selectedTicket.departureCountry}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Gate</p>
                            <p className="font-semibold text-lg">{selectedTicket.gate}</p>
                            <p className="text-sm text-gray-500">Terminal</p>
                            <p className="font-semibold">{selectedTicket.terminal}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 flex">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00b4d8] to-[#0288d1] text-white shadow-lg">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div className="ml-6 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">
                              Arrival • {format(selectedTicket.arrivalDate, "EEE, MMM d")}
                            </p>
                            <p className="font-bold text-2xl text-gray-900">{formatTime(selectedTicket.arrivalDate)}</p>
                            <p className="font-semibold text-lg text-gray-700">
                              {selectedTicket.arrivalCity} ({selectedTicket.arrivalAirport})
                            </p>
                            <p className="text-sm text-gray-500">{selectedTicket.arrivalCountry}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-semibold text-lg">{selectedTicket.duration}</p>
                            <p className="text-sm text-gray-500">Seats</p>
                            <p className="font-semibold">{selectedTicket.seatNumbers.join(", ")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Return Flight */}
                  {selectedTicket.returnDate && (
                    <>
                      <Separator />
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold mb-3 flex items-center">
                          <Plane className="w-4 h-4 mr-2" />
                          Return Flight
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Departure</p>
                            <p className="font-semibold">
                              {format(selectedTicket.returnDate, "MMM d, yyyy")} at{" "}
                              {formatTime(selectedTicket.returnDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Trip Type</p>
                            <p className="font-semibold">{selectedTicket.tripType}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="passengers" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Passenger List
                      </h4>
                      <div className="space-y-3">
                        {selectedTicket.passengerNames.map((name, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">{name}</span>
                            <span className="text-sm text-gray-500">
                              {index < selectedTicket.passengers.adults
                                ? "Adult"
                                : index < selectedTicket.passengers.adults + selectedTicket.passengers.children
                                  ? "Child"
                                  : "Infant"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Contact Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-4 h-4 mr-3 text-gray-400" />
                          <span>{selectedTicket.contactInfo.email}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Phone className="w-4 h-4 mr-3 text-gray-400" />
                          <span>{selectedTicket.contactInfo.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Payment Details
                      </h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">Payment Method</p>
                          <p className="font-semibold">{selectedTicket.paymentInfo.method}</p>
                          {selectedTicket.paymentInfo.cardLast4 && (
                            <p className="text-sm text-gray-600">•••• {selectedTicket.paymentInfo.cardLast4}</p>
                          )}
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">Payment Date</p>
                          <p className="font-semibold">{format(selectedTicket.paymentInfo.date, "MMM d, yyyy")}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Billing Summary</h4>
                      <div className="bg-gradient-to-br from-[#023e8a]/5 to-[#00b4d8]/5 rounded-lg p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Base Fare</span>
                            <span>${(selectedTicket.price * 0.8).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxes & Fees</span>
                            <span>${(selectedTicket.price * 0.2).toFixed(2)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-[#023e8a]">${selectedTicket.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="services" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Included Amenities</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTicket.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Baggage Allowance</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">Carry-on</span>
                          <span className="font-semibold">{selectedTicket.baggage.carryOn}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">Checked</span>
                          <span className="font-semibold">{selectedTicket.baggage.checked}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#023e8a] to-[#00b4d8] hover:from-[#01579b] hover:to-[#0288d1]"
                >
                  Check-in Online
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
