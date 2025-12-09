"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Mail, Calendar, Users, CreditCard, FileText, Plane } from "lucide-react"

interface Booking {
  id: string
  bookingReference: string
  customerName: string
  customerEmail: string
  customerPhone: string
  packageName: string
  packageCode: string
  departureDate: string
  returnDate: string
  passengers: number
  totalAmount: number
  paidAmount: number
  currency: string
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed"
  paymentStatus: "Pending" | "Partial" | "Paid" | "Refunded"
  bookingDate: string
  specialRequests: string
  passengerDetails: {
    name: string
    age: number
    gender: string
    passportNumber: string
  }[]
}

interface BookingDetailsProps {
  booking: Booking
  onStatusUpdate: (bookingId: string, newStatus: Booking["status"]) => void
  onPaymentStatusUpdate: (bookingId: string, newPaymentStatus: Booking["paymentStatus"]) => void
}

export function BookingDetails({ booking, onStatusUpdate, onPaymentStatusUpdate }: BookingDetailsProps) {
  const remainingAmount = booking.totalAmount - booking.paidAmount
  const paymentProgress = (booking.paidAmount / booking.totalAmount) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{booking.bookingReference}</h3>
          <p className="text-sm text-gray-600">Booked on {new Date(booking.bookingDate).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <Select
            value={booking.status}
            onValueChange={(value) => onStatusUpdate(booking.id, value as Booking["status"])}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={booking.paymentStatus}
            onValueChange={(value) => onPaymentStatusUpdate(booking.id, value as Booking["paymentStatus"])}
          >
            <SelectTrigger className="w-32">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{booking.customerName}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Mail className="h-4 w-4" />
                {booking.customerEmail}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Phone className="h-4 w-4" />
                {booking.customerPhone}
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Special Requests</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {booking.specialRequests || "No special requests"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Package Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Package Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{booking.packageName}</p>
              <p className="text-sm text-gray-600">{booking.packageCode}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Departure
                </div>
                <p className="font-medium">{new Date(booking.departureDate).toLocaleDateString()}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Return
                </div>
                <p className="font-medium">{new Date(booking.returnDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                Passengers
              </div>
              <p className="font-medium">{booking.passengers} passengers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {booking.currency} {booking.totalAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Paid Amount</p>
              <p className="text-2xl font-bold text-green-600">
                {booking.currency} {booking.paidAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-orange-600">
                {booking.currency} {remainingAmount.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Payment Progress</span>
              <span>{Math.round(paymentProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${paymentProgress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Passenger Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Passenger Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {booking.passengerDetails.map((passenger, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{passenger.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-medium">{passenger.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium">{passenger.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Passport</p>
                    <p className="font-medium">{passenger.passportNumber}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline">
          <Phone className="mr-2 h-4 w-4" />
          Call Customer
        </Button>
        <Button variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </Button>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Generate Invoice
        </Button>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Download Voucher
        </Button>
      </div>
    </div>
  )
}
