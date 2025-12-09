"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import {
  Search,
  Calendar,
  Users,
  CreditCard,
  Plane,
  MapPin,
  Phone,
  Mail,
  User,
  Download,
  Printer,
  Clock,
  Navigation,
  Luggage,
  Wifi,
  Coffee,
  Monitor,
  Eye,
  X,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  XCircle,
  Building,
} from "lucide-react"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils/utils"

// Enhanced sample booking data for Aeronaa support staff
const bookings = [
  {
    id: "B-5678",
    ticketId: "T-1234",
    bookingReference: "AERONAA-001",
    passengerName: "John Smith",
    totalPassengers: 3,
    contactInfo: {
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
    },
    flight: {
      airline: "British Airways",
      flightNumber: "BA-117",
      departureAirport: "JFK",
      departureCity: "New York",
      departureCountry: "United States",
      arrivalAirport: "LHR",
      arrivalCity: "London",
      arrivalCountry: "United Kingdom",
      departureDate: new Date(2025, 7, 15, 10, 30),
      arrivalDate: new Date(2025, 7, 15, 22, 45),
      duration: "7h 15m",
      aircraft: "Boeing 777-300ER",
      gate: "A12",
      terminal: "Terminal 5",
      returnFlight: {
        flightNumber: "BA-118",
        departureDate: new Date(2025, 7, 22, 14, 15),
        arrivalDate: new Date(2025, 7, 22, 17, 30),
        duration: "8h 15m",
        gate: "B7",
        terminal: "Terminal 1",
      },
    },
    passengers: {
      adults: 2,
      children: 1,
      infants: 0,
    },
    passengerDetails: [
      { name: "John Smith", type: "Adult", seat: "12A", meal: "Regular" },
      { name: "Jane Smith", type: "Adult", seat: "12B", meal: "Vegetarian" },
      { name: "Tommy Smith", type: "Child", seat: "12C", meal: "Child Meal" },
    ],
    classType: "Economy",
    status: "Confirmed",
    bookingDate: new Date(2025, 6, 1),
    paymentInfo: {
      amount: 1250.0,
      currency: "USD",
      method: "Credit Card",
      date: new Date(2025, 7, 1),
      cardLast4: "4532",
      transactionId: "TXN-123456789",
    },
    amenities: ["Wifi", "Entertainment", "Meals", "Beverages"],
    baggage: {
      carryOn: "1 x 8kg",
      checked: "2 x 23kg",
    },
    seatNumbers: ["12A", "12B", "12C"],
    specialRequests: ["Window seat", "Vegetarian meal"],
    tripType: "Round-trip",
  },
  {
    id: "B-5679",
    ticketId: "T-1235",
    bookingReference: "AERONAA-002",
    passengerName: "Sarah Johnson",
    totalPassengers: 1,
    contactInfo: {
      email: "sarah.j@example.com",
      phone: "+1 (555) 987-6543",
    },
    flight: {
      airline: "Emirates",
      flightNumber: "EK-215",
      departureAirport: "LAX",
      departureCity: "Los Angeles",
      departureCountry: "United States",
      arrivalAirport: "DXB",
      arrivalCity: "Dubai",
      arrivalCountry: "United Arab Emirates",
      departureDate: new Date(2025, 7, 18, 23, 15),
      arrivalDate: new Date(2025, 7, 19, 19, 45),
      duration: "16h 30m",
      aircraft: "Airbus A380-800",
      gate: "C24",
      terminal: "Terminal B",
    },
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    passengerDetails: [{ name: "Sarah Johnson", type: "Adult", seat: "2A", meal: "Kosher" }],
    classType: "Business",
    status: "Pending",
    bookingDate: new Date(2025, 6, 5),
    paymentInfo: {
      amount: 3200.0,
      currency: "USD",
      method: "Bank Transfer",
      date: new Date(2025, 7, 5),
      transactionId: "TXN-987654321",
    },
    amenities: ["Wifi", "Entertainment", "Premium Meals", "Lounge Access", "Priority Boarding"],
    baggage: {
      carryOn: "2 x 12kg",
      checked: "2 x 32kg",
    },
    seatNumbers: ["2A"],
    specialRequests: ["Kosher meal", "Aisle seat"],
    tripType: "One-way",
  },
  {
    id: "B-5680",
    ticketId: "T-1236",
    bookingReference: "AERONAA-003",
    passengerName: "Michael Chen",
    totalPassengers: 3,
    contactInfo: {
      email: "m.chen@example.com",
      phone: "+1 (555) 456-7890",
    },
    flight: {
      airline: "Japan Airlines",
      flightNumber: "JL-002",
      departureAirport: "SFO",
      departureCity: "San Francisco",
      departureCountry: "United States",
      arrivalAirport: "NRT",
      arrivalCity: "Tokyo",
      arrivalCountry: "Japan",
      departureDate: new Date(2025, 7, 20, 11, 45),
      arrivalDate: new Date(2025, 7, 21, 15, 20),
      duration: "11h 20m",
      aircraft: "Boeing 787-9",
      gate: "G15",
      terminal: "Terminal 3",
      returnFlight: {
        flightNumber: "JL-003",
        departureDate: new Date(2025, 7, 30, 16, 20),
        arrivalDate: new Date(2025, 7, 30, 11, 45),
        duration: "10h 25m",
        gate: "F12",
        terminal: "Terminal 2",
      },
    },
    passengers: {
      adults: 2,
      children: 0,
      infants: 1,
    },
    passengerDetails: [
      { name: "Michael Chen", type: "Adult", seat: "1A", meal: "Regular" },
      { name: "Lisa Chen", type: "Adult", seat: "1B", meal: "Regular" },
      { name: "Baby Chen", type: "Infant", seat: "1A", meal: "None" },
    ],
    classType: "First Class",
    status: "Completed",
    bookingDate: new Date(2025, 6, 10),
    paymentInfo: {
      amount: 5800.0,
      currency: "USD",
      method: "Credit Card",
      date: new Date(2025, 6, 10),
      cardLast4: "8901",
      transactionId: "TXN-456789123",
    },
    amenities: ["Wifi", "Entertainment", "Premium Meals", "Lounge Access", "Priority Boarding", "Flat Bed"],
    baggage: {
      carryOn: "2 x 15kg",
      checked: "3 x 32kg",
    },
    seatNumbers: ["1A", "1B"],
    specialRequests: ["Infant bassinet", "Extra legroom"],
    tripType: "Round-trip",
  },
  {
    id: "B-5681",
    ticketId: "T-1237",
    bookingReference: "AERONAA-004",
    passengerName: "Emma Wilson",
    totalPassengers: 1,
    contactInfo: {
      email: "emma.w@example.com",
      phone: "+1 (555) 234-5678",
    },
    flight: {
      airline: "Air France",
      flightNumber: "AF-136",
      departureAirport: "ORD",
      departureCity: "Chicago",
      departureCountry: "United States",
      arrivalAirport: "CDG",
      arrivalCity: "Paris",
      arrivalCountry: "France",
      departureDate: new Date(2025, 7, 22, 19, 10),
      arrivalDate: new Date(2025, 7, 23, 12, 55),
      duration: "8h 45m",
      aircraft: "Airbus A350-900",
      gate: "F8",
      terminal: "Terminal 1",
    },
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    passengerDetails: [{ name: "Emma Wilson", type: "Adult", seat: "24F", meal: "Vegan" }],
    classType: "Economy",
    status: "Confirmed",
    bookingDate: new Date(2025, 6, 15),
    paymentInfo: {
      amount: 890.0,
      currency: "USD",
      method: "Debit Card",
      date: new Date(2025, 6, 15),
      cardLast4: "2345",
      transactionId: "TXN-789123456",
    },
    amenities: ["Wifi", "Entertainment", "Meals"],
    baggage: {
      carryOn: "1 x 8kg",
      checked: "1 x 23kg",
    },
    seatNumbers: ["24F"],
    specialRequests: ["Vegan meal", "Window seat"],
    tripType: "One-way",
  },
  {
    id: "B-5682",
    ticketId: "T-1238",
    bookingReference: "AERONAA-005",
    passengerName: "Ahmed Khan",
    totalPassengers: 6,
    contactInfo: {
      email: "ahmed.khan@example.com",
      phone: "+92 300 123 4567",
    },
    flight: {
      airline: "Emirates",
      flightNumber: "EK-623",
      departureAirport: "LHE",
      departureCity: "Lahore",
      departureCountry: "Pakistan",
      arrivalAirport: "DXB",
      arrivalCity: "Dubai",
      arrivalCountry: "United Arab Emirates",
      departureDate: new Date(2025, 7, 25, 2, 30),
      arrivalDate: new Date(2025, 7, 25, 6, 15),
      duration: "3h 45m",
      aircraft: "Boeing 777-300",
      gate: "B12",
      terminal: "Terminal 3",
      returnFlight: {
        flightNumber: "EK-624",
        departureDate: new Date(2025, 8, 5, 4, 15),
        arrivalDate: new Date(2025, 8, 5, 8, 30),
        duration: "4h 15m",
        gate: "A8",
        terminal: "Terminal 3",
      },
    },
    passengers: {
      adults: 3,
      children: 2,
      infants: 1,
    },
    passengerDetails: [
      { name: "Ahmed Khan", type: "Adult", seat: "15A", meal: "Halal" },
      { name: "Fatima Khan", type: "Adult", seat: "15B", meal: "Halal" },
      { name: "Ali Khan", type: "Adult", seat: "15C", meal: "Halal" },
      { name: "Zara Khan", type: "Child", seat: "16A", meal: "Child Meal" },
      { name: "Omar Khan", type: "Child", seat: "16B", meal: "Child Meal" },
      { name: "Baby Khan", type: "Infant", seat: "15A", meal: "None" },
    ],
    classType: "Economy",
    status: "Pending",
    bookingDate: new Date(2025, 6, 20),
    paymentInfo: {
      amount: 2100.0,
      currency: "USD",
      method: "Credit Card",
      date: new Date(2025, 6, 20),
      cardLast4: "6789",
      transactionId: "TXN-321654987",
    },
    amenities: ["Wifi", "Entertainment", "Meals", "Beverages"],
    baggage: {
      carryOn: "3 x 8kg",
      checked: "4 x 23kg",
    },
    seatNumbers: ["15A", "15B", "15C", "16A", "16B"],
    specialRequests: ["Halal meals", "Infant bassinet", "Adjacent seats"],
    tripType: "Round-trip",
  },
]

export function BookingInfoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterClass, setFilterClass] = useState("all")
  const [filterAirline, setFilterAirline] = useState("all")
  const [sortBy, setSortBy] = useState("bookingDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBooking, setSelectedBooking] = useState<(typeof bookings)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 8

  const airlines = Array.from(new Set(bookings.map((booking) => booking.flight.airline)))

  const filteredAndSortedBookings = useMemo(() => {
    const filtered = bookings.filter((booking) => {
      const matchesSearch =
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.flight.airline.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === "all" || booking.status.toLowerCase() === filterStatus
      const matchesClass = filterClass === "all" || booking.classType.toLowerCase() === filterClass
      const matchesAirline = filterAirline === "all" || booking.flight.airline === filterAirline

      return matchesSearch && matchesStatus && matchesClass && matchesAirline
    })

    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "bookingDate":
          comparison = a.bookingDate.getTime() - b.bookingDate.getTime()
          break
        case "departureDate":
          comparison = a.flight.departureDate.getTime() - b.flight.departureDate.getTime()
          break
        case "amount":
          comparison = a.paymentInfo.amount - b.paymentInfo.amount
          break
        case "passenger":
          comparison = a.passengerName.localeCompare(b.passengerName)
          break
        case "airline":
          comparison = a.flight.airline.localeCompare(b.flight.airline)
          break
        default:
          comparison = 0
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [searchTerm, filterStatus, filterClass, filterAirline, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredAndSortedBookings.length / itemsPerPage)
  const paginatedBookings = filteredAndSortedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "Completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="w-3 h-3" />
      case "Pending":
        return <AlertCircle className="w-3 h-3" />
      case "Completed":
        return <CheckCircle className="w-3 h-3" />
      case "Cancelled":
        return <XCircle className="w-3 h-3" />
      default:
        return <AlertCircle className="w-3 h-3" />
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

  const handleViewDetails = (booking: (typeof bookings)[0]) => {
    setSelectedBooking(booking)
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
          <Building className="w-5 h-5" />
          <span className="font-semibold">Aeronaa Support Dashboard</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Customer Bookings Management</h1>
        <p className="text-gray-600 text-lg">View and manage customer bookings for posted flight tickets</p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Booking Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by booking ID, reference, passenger name, email, or flight number..."
                className="pl-10 h-12 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="relative">
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="relative">
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                >
                  <option value="all">All Classes</option>
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first class">First Class</option>
                </select>
              </div>

              <div className="relative">
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={filterAirline}
                  onChange={(e) => setFilterAirline(e.target.value)}
                >
                  <option value="all">All Airlines</option>
                  {airlines.map((airline) => (
                    <option key={airline} value={airline}>
                      {airline}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="bookingDate">Booking Date</option>
                  <option value="departureDate">Departure Date</option>
                  <option value="amount">Amount</option>
                  <option value="passenger">Passenger</option>
                  <option value="airline">Airline</option>
                </select>
              </div>

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
                  setSortBy("bookingDate")
                  setSortOrder("desc")
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
                Showing {paginatedBookings.length} of {filteredAndSortedBookings.length} bookings
              </span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bookings Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-[#023e8a]/5 to-[#00b4d8]/5">
                    <TableHead className="font-semibold">Booking Details</TableHead>
                    <TableHead className="font-semibold">Passenger Info</TableHead>
                    <TableHead className="font-semibold">Flight Details</TableHead>
                    <TableHead className="font-semibold">Route & Schedule</TableHead>
                    <TableHead className="font-semibold">Class & Status</TableHead>
                    <TableHead className="font-semibold">Payment</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {paginatedBookings.map((booking, index) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-semibold text-[#023e8a]">{booking.id}</p>
                            <p className="text-sm text-gray-600">{booking.bookingReference}</p>
                            <p className="text-xs text-gray-500">
                              Booked: {format(booking.bookingDate, "MMM d, yyyy")}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{booking.passengerName}</p>
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-600">{booking.totalPassengers} passengers</span>
                            </div>
                            <p className="text-xs text-gray-500">{booking.contactInfo.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <motion.div
                                className="w-6 h-6 bg-gradient-to-br from-[#023e8a] to-[#00b4d8] rounded-md flex items-center justify-center text-white text-xs font-bold"
                                whileHover={{ scale: 1.1 }}
                              >
                                {booking.flight.airline
                                  .split(" ")
                                  .map((word) => word[0])
                                  .join("")}
                              </motion.div>
                              <div>
                                <p className="font-medium text-sm">{booking.flight.flightNumber}</p>
                                <p className="text-xs text-gray-500">{booking.flight.airline}</p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">{booking.flight.aircraft}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="text-center">
                                <p className="font-semibold text-sm">{booking.flight.departureAirport}</p>
                                <p className="text-xs text-gray-500">{booking.flight.departureCity}</p>
                              </div>
                              <motion.div
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                              >
                                <Plane className="w-3 h-3 text-[#023e8a]" />
                              </motion.div>
                              <div className="text-center">
                                <p className="font-semibold text-sm">{booking.flight.arrivalAirport}</p>
                                <p className="text-xs text-gray-500">{booking.flight.arrivalCity}</p>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600">
                                  {format(booking.flight.departureDate, "MMM d, yyyy")}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600">
                                  {formatTime(booking.flight.departureDate)} • {booking.flight.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Badge variant="outline" className={getClassColor(booking.classType)}>
                              {booking.classType}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(booking.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(booking.status)}
                                <span>{booking.status}</span>
                              </div>
                            </Badge>
                            <p className="text-xs text-gray-500">{booking.tripType}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-bold text-[#023e8a]">
                              {booking.paymentInfo.currency} {booking.paymentInfo.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">{booking.paymentInfo.method}</p>
                            {booking.paymentInfo.cardLast4 && (
                              <p className="text-xs text-gray-400">•••• {booking.paymentInfo.cardLast4}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                onClick={() => handleViewDetails(booking)}
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
                                <DropdownMenuLabel>Support Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Contact Passenger
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Modify Booking
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Printer className="w-4 h-4 mr-2" />
                                  Print Itinerary
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Cancel Booking</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>

              {paginatedBookings.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Navigation className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
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
                  {Math.min(currentPage * itemsPerPage, filteredAndSortedBookings.length)} of{" "}
                  {filteredAndSortedBookings.length} bookings
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

      {/* Detailed Booking Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="w-6 h-6 text-[#023e8a]" />
                <span className="text-2xl font-bold">Aeronaa Booking Details</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-[#023e8a]/5 to-[#00b4d8]/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedBooking.flight.departureCity} to {selectedBooking.flight.arrivalCity}
                    </h3>
                    <p className="text-gray-600">
                      {selectedBooking.id} • {selectedBooking.bookingReference}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getStatusColor(selectedBooking.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(selectedBooking.status)}
                        <span>{selectedBooking.status}</span>
                      </div>
                    </Badge>
                    <Badge variant="outline" className={getClassColor(selectedBooking.classType)}>
                      {selectedBooking.classType}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Airline</p>
                    <p className="font-semibold">{selectedBooking.flight.airline}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Flight</p>
                    <p className="font-semibold">{selectedBooking.flight.flightNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Aircraft</p>
                    <p className="font-semibold">{selectedBooking.flight.aircraft}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Passengers</p>
                    <p className="font-semibold">{selectedBooking.totalPassengers}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Amount</p>
                    <p className="font-bold text-[#023e8a] text-lg">
                      {selectedBooking.paymentInfo.currency} {selectedBooking.paymentInfo.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="flight" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="flight">Flight Details</TabsTrigger>
                  <TabsTrigger value="passengers">Passengers</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
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
                              Departure • {format(selectedBooking.flight.departureDate, "EEE, MMM d")}
                            </p>
                            <p className="font-bold text-2xl text-gray-900">
                              {formatTime(selectedBooking.flight.departureDate)}
                            </p>
                            <p className="font-semibold text-lg text-gray-700">
                              {selectedBooking.flight.departureCity} ({selectedBooking.flight.departureAirport})
                            </p>
                            <p className="text-sm text-gray-500">{selectedBooking.flight.departureCountry}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Gate</p>
                            <p className="font-semibold text-lg">{selectedBooking.flight.gate}</p>
                            <p className="text-sm text-gray-500">Terminal</p>
                            <p className="font-semibold">{selectedBooking.flight.terminal}</p>
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
                              Arrival • {format(selectedBooking.flight.arrivalDate, "EEE, MMM d")}
                            </p>
                            <p className="font-bold text-2xl text-gray-900">
                              {formatTime(selectedBooking.flight.arrivalDate)}
                            </p>
                            <p className="font-semibold text-lg text-gray-700">
                              {selectedBooking.flight.arrivalCity} ({selectedBooking.flight.arrivalAirport})
                            </p>
                            <p className="text-sm text-gray-500">{selectedBooking.flight.arrivalCountry}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-semibold text-lg">{selectedBooking.flight.duration}</p>
                            <p className="text-sm text-gray-500">Trip Type</p>
                            <p className="font-semibold">{selectedBooking.tripType}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Return Flight */}
                  {selectedBooking.flight.returnFlight && (
                    <>
                      <Separator />
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold mb-4 flex items-center">
                          <Plane className="w-5 h-5 mr-2" />
                          Return Flight Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Flight Number</p>
                            <p className="font-semibold">{selectedBooking.flight.returnFlight.flightNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Departure</p>
                            <p className="font-semibold">
                              {format(selectedBooking.flight.returnFlight.departureDate, "MMM d, yyyy")} at{" "}
                              {formatTime(selectedBooking.flight.returnFlight.departureDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-semibold">{selectedBooking.flight.returnFlight.duration}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="passengers" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Passenger Details
                      </h4>
                      <div className="space-y-3">
                        {selectedBooking.passengerDetails.map((passenger, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{passenger.name}</h5>
                              <Badge variant="outline" className="text-xs">
                                {passenger.type}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                              <div>
                                <span className="text-gray-500">Seat:</span> {passenger.seat}
                              </div>
                              <div>
                                <span className="text-gray-500">Meal:</span> {passenger.meal}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">Contact & Special Requests</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium mb-2">Contact Information</h5>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-sm">{selectedBooking.contactInfo.email}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-sm">{selectedBooking.contactInfo.phone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium mb-2">Special Requests</h5>
                          <div className="space-y-1">
                            {selectedBooking.specialRequests.map((request, index) => (
                              <div key={index} className="flex items-center text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                <span>{request}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payment Information
                      </h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Payment Method</p>
                              <p className="font-semibold">{selectedBooking.paymentInfo.method}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Transaction ID</p>
                              <p className="font-semibold text-xs">{selectedBooking.paymentInfo.transactionId}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Payment Date</p>
                              <p className="font-semibold">{format(selectedBooking.paymentInfo.date, "MMM d, yyyy")}</p>
                            </div>
                            {selectedBooking.paymentInfo.cardLast4 && (
                              <div>
                                <p className="text-sm text-gray-500">Card</p>
                                <p className="font-semibold">•••• {selectedBooking.paymentInfo.cardLast4}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">Billing Summary</h4>
                      <div className="bg-gradient-to-br from-[#023e8a]/5 to-[#00b4d8]/5 rounded-lg p-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Base Fare</span>
                            <span>
                              {selectedBooking.paymentInfo.currency}{" "}
                              {(selectedBooking.paymentInfo.amount * 0.75).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxes & Fees</span>
                            <span>
                              {selectedBooking.paymentInfo.currency}{" "}
                              {(selectedBooking.paymentInfo.amount * 0.2).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Service Charges</span>
                            <span>
                              {selectedBooking.paymentInfo.currency}{" "}
                              {(selectedBooking.paymentInfo.amount * 0.05).toFixed(2)}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total Amount</span>
                            <span className="text-[#023e8a]">
                              {selectedBooking.paymentInfo.currency}{" "}
                              {selectedBooking.paymentInfo.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="services" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center">
                        <Coffee className="w-5 h-5 mr-2" />
                        Included Amenities
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedBooking.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            {amenity === "Wifi" && <Wifi className="w-4 h-4 text-blue-500 mr-2" />}
                            {amenity === "Entertainment" && <Monitor className="w-4 h-4 text-purple-500 mr-2" />}
                            {(amenity.includes("Meals") || amenity.includes("Beverages")) && (
                              <Coffee className="w-4 h-4 text-orange-500 mr-2" />
                            )}
                            {amenity.includes("Lounge") && <MapPin className="w-4 h-4 text-green-500 mr-2" />}
                            {amenity.includes("Boarding") && <Plane className="w-4 h-4 text-red-500 mr-2" />}
                            {amenity.includes("Bed") && <User className="w-4 h-4 text-indigo-500 mr-2" />}
                            <span className="text-sm font-medium">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center">
                        <Luggage className="w-5 h-5 mr-2" />
                        Baggage & Seats
                      </h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium mb-2">Baggage Allowance</h5>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Carry-on</span>
                              <span className="font-semibold">{selectedBooking.baggage.carryOn}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Checked</span>
                              <span className="font-semibold">{selectedBooking.baggage.checked}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium mb-2">Seat Assignments</h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedBooking.seatNumbers.map((seat, index) => (
                              <Badge key={index} variant="outline" className="bg-white">
                                {seat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="support" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">Support Actions</h4>
                      <div className="space-y-3">
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email to Passenger
                        </Button>
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Passenger
                        </Button>
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Modify Booking
                        </Button>
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Printer className="w-4 h-4 mr-2" />
                          Print Itinerary
                        </Button>
                        <Button className="w-full justify-start bg-transparent" variant="outline" disabled>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refund Request
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">Booking History</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                          <p className="text-sm font-medium">Booking Confirmed</p>
                          <p className="text-xs text-gray-600">
                            {format(selectedBooking.bookingDate, "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                          <p className="text-sm font-medium">Payment Processed</p>
                          <p className="text-xs text-gray-600">
                            {format(selectedBooking.paymentInfo.date, "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 border-l-4 border-gray-300 rounded">
                          <p className="text-sm font-medium">Tickets Issued</p>
                          <p className="text-xs text-gray-600">
                            {format(selectedBooking.paymentInfo.date, "MMM d, yyyy 'at' h:mm a")}
                          </p>
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
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Passenger
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Modify Booking
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#023e8a] to-[#00b4d8] hover:from-[#01579b] hover:to-[#0288d1]"
                  >
                    Assist Check-in
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
