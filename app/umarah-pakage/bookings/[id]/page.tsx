"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  FileText,
  Download,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  User,
  StampIcon as Passport,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock booking data - replace with actual API call
const mockBooking = {
  id: "1",
  bookingReference: "UMR-2024-001",
  customerName: "Ahmed Hassan",
  customerEmail: "ahmed.hassan@email.com",
  customerPhone: "+966501234567",
  customerAddress: "123 King Fahd Road, Riyadh, Saudi Arabia",
  packageName: "14 Days Luxury Umrah Package",
  packageCode: "UMR-LUX-001",
  departureDate: "2024-03-15",
  returnDate: "2024-03-29",
  passengers: 2,
  totalAmount: 5000,
  paidAmount: 2500,
  currency: "USD",
  status: "Confirmed" as const,
  paymentStatus: "Partial" as const,
  bookingDate: "2024-02-15",
  specialRequests:
    "Wheelchair assistance required for elderly passenger. Please arrange ground floor rooms if possible.",
  passengerDetails: [
    { name: "Ahmed Hassan", age: 45, gender: "Male", passportNumber: "A12345678", passportExpiry: "2028-06-15" },
    { name: "Fatima Hassan", age: 42, gender: "Female", passportNumber: "A12345679", passportExpiry: "2027-12-20" },
  ],
  packageDetails: {
    accommodation: "5-star hotel near Haram",
    transport: "Private AC vehicle",
    meals: "Breakfast and Dinner included",
    guide: "English speaking guide",
  },
  paymentHistory: [
    { date: "2024-02-15", amount: 1000, method: "Credit Card", status: "Completed" },
    { date: "2024-02-20", amount: 1500, method: "Bank Transfer", status: "Completed" },
  ],
}

export default function BookingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [booking, setBooking] = useState(mockBooking)

  const handleStatusUpdate = (newStatus: typeof booking.status) => {
    setBooking((prev) => ({ ...prev, status: newStatus }))
    toast({
      title: "Status Updated",
      description: `Booking status has been updated to ${newStatus}.`,
    })
  }

  const handlePaymentStatusUpdate = (newPaymentStatus: typeof booking.paymentStatus) => {
    setBooking((prev) => ({ ...prev, paymentStatus: newPaymentStatus }))
    toast({
      title: "Payment Status Updated",
      description: `Payment status has been updated to ${newPaymentStatus}.`,
    })
  }

  const getStatusBadge = (status: typeof booking.status) => {
    const variants = {
      Pending: {
        variant: "secondary" as const,
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      Confirmed: {
        variant: "default" as const,
        icon: CheckCircle,
        className: "bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white",
      },
      Cancelled: {
        variant: "destructive" as const,
        icon: XCircle,
        className: "bg-red-100 text-red-800 border-red-200",
      },
      Completed: {
        variant: "outline" as const,
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-200",
      },
    }

    const config = variants[status]
    const Icon = config.icon

    return (
      <Badge className={`flex items-center gap-1 ${config.className}`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const getPaymentBadge = (paymentStatus: typeof booking.paymentStatus) => {
    const variants = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Partial: "bg-orange-100 text-orange-800 border-orange-200",
      Paid: "bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white",
      Refunded: "bg-red-100 text-red-800 border-red-200",
    }

    return <Badge className={`capitalize ${variants[paymentStatus]}`}>{paymentStatus}</Badge>
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Details</h1>
          <p className="text-gray-600 dark:text-gray-400">{booking.bookingReference}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </Button>
          <Button className="bg-gradient-to-r from-[#023e8a] to-[#00b4d8] hover:from-[#012a5e] to-[#0096b8] text-white">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#023e8a]" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
                  <p className="text-gray-900 dark:text-white font-medium">{booking.customerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#00b4d8]" />
                    <p className="text-gray-900 dark:text-white">{booking.customerEmail}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#00b4d8]" />
                    <p className="text-gray-900 dark:text-white">{booking.customerPhone}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Address</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#00b4d8]" />
                    <p className="text-gray-900 dark:text-white text-sm">{booking.customerAddress}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#023e8a]" />
                Package Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Package Name</label>
                  <p className="text-gray-900 dark:text-white font-medium">{booking.packageName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Package Code</label>
                  <p className="text-gray-900 dark:text-white">{booking.packageCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Departure Date</label>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(booking.departureDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Return Date</label>
                  <p className="text-gray-900 dark:text-white">{new Date(booking.returnDate).toLocaleDateString()}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Accommodation</label>
                  <p className="text-gray-900 dark:text-white">{booking.packageDetails.accommodation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Transport</label>
                  <p className="text-gray-900 dark:text-white">{booking.packageDetails.transport}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Meals</label>
                  <p className="text-gray-900 dark:text-white">{booking.packageDetails.meals}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Guide</label>
                  <p className="text-gray-900 dark:text-white">{booking.packageDetails.guide}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passenger Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#023e8a]" />
                Passenger Details ({booking.passengers} passengers)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booking.passengerDetails.map((passenger, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
                        <p className="text-gray-900 dark:text-white font-medium">{passenger.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Age</label>
                        <p className="text-gray-900 dark:text-white">{passenger.age} years</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Gender</label>
                        <p className="text-gray-900 dark:text-white">{passenger.gender}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Passport</label>
                        <div className="flex items-center gap-2">
                          <Passport className="h-4 w-4 text-[#00b4d8]" />
                          <div>
                            <p className="text-gray-900 dark:text-white text-sm">{passenger.passportNumber}</p>
                            <p className="text-xs text-gray-500">
                              Exp: {new Date(passenger.passportExpiry).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Special Requests */}
          {booking.specialRequests && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#023e8a]" />
                  Special Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 dark:text-white">{booking.specialRequests}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Current Status
                </label>
                {getStatusBadge(booking.status)}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">Update Status</label>
                <Select value={booking.status} onValueChange={handleStatusUpdate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#023e8a]" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                  <span className="font-medium">
                    {booking.currency} {booking.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Paid Amount:</span>
                  <span className="font-medium text-green-600">
                    {booking.currency} {booking.paidAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                  <span className="font-medium text-red-600">
                    {booking.currency} {(booking.totalAmount - booking.paidAmount).toLocaleString()}
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Payment Status
                </label>
                {getPaymentBadge(booking.paymentStatus)}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Update Payment Status
                </label>
                <Select value={booking.paymentStatus} onValueChange={handlePaymentStatusUpdate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment History */}
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Payment History
                </label>
                <div className="space-y-2">
                  {booking.paymentHistory.map((payment, index) => (
                    <div key={index} className="text-sm border rounded p-2 bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between">
                        <span>{new Date(payment.date).toLocaleDateString()}</span>
                        <span className="font-medium">
                          {booking.currency} {payment.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.method} • {payment.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Phone className="h-4 w-4 mr-2" />
                Call Customer
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send SMS
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Generate Documents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
