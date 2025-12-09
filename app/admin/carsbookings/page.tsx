"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import {
  Search,
  CarFront,
  Calendar,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react"
import Image from "next/image"
import { FetchallCAr } from "@/lib/carRentalApi"

type CarBooking = {
  id: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  name: string
  email: string
  phoneNo: string
  pickUplocation: string
  dropOffLocation: string
  pickUpTime: string
  returnTime: string
  amount: number
  carRental: {
    id: number
    isActive: boolean
    make: string
    model: string
    year: number
    licensePlate: string
    category: string
    seats: number
    mileage: string
    dailyRate: number
    location: string
    images: string[]
    carStatus: string
    fuelType: string
    status: string
  }
  user: {
    id: number
    isActive: boolean
    name: string
    email: string
    phone: string
    role: string
    status: string
  }
}

const ITEMS_PER_PAGE = 10

export default function CarBookingsTable() {
  const [bookings, setBookings] = useState<CarBooking[]>([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selected, setSelected] = useState<CarBooking | null>(null)

  useEffect(() => {
    const fetchcarbookings = async () => {
      const response = await FetchallCAr()
      console.log("Car bookings:", response)
      setBookings(response || [])
    }
    fetchcarbookings()
  }, [])

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    return bookings.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.email.toLowerCase().includes(query) ||
        b.carRental.model.toLowerCase().includes(query) ||
        b.pickUplocation.toLowerCase().includes(query) ||
        b.dropOffLocation.toLowerCase().includes(query)
    )
  }, [bookings, search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const pageItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Car Booking Management</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage all car reservations and bookings</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, car, or location..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Booking ID</th>
                <th className="text-left p-4 font-medium">Customer</th>
                <th className="text-left p-4 font-medium">Car</th>
                <th className="text-left p-4 font-medium">Route</th>
                <th className="text-left p-4 font-medium">Schedule</th>
                <th className="text-left p-4 font-medium">Amount</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="w-12 p-4"></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((b) => (
                <tr key={b.id} className="border-t hover:bg-muted/30">
                  <td className="p-4">
                    <div className="font-medium">#{b.id}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-medium">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.email}</div>
                    <Badge variant="outline" className="mt-1">
                      {b.user.role === "agent" ? "Booked by Agent" : "Booked by User"}
                    </Badge>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <CarFront className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {b.carRental.make} {b.carRental.model}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {b.carRental.category} • {b.carRental.year}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{b.pickUplocation}</span>
                      </div>
                      <div className="text-muted-foreground text-xs">to</div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{b.dropOffLocation}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(b.pickUpTime).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Calendar className="h-4 w-4" />
                        to {new Date(b.returnTime).toLocaleString()}
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-medium">{b.amount} USD</div>
                  </td>

                  <td className="p-4">
                    <Badge className={b.isActive ? "bg-green-500" : "bg-red-500"}>
                      {b.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>

                  <td className="p-4">
                    <Button size="sm" variant="outline" onClick={() => setSelected(b)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-muted-foreground" colSpan={8}>
                    No car bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length} bookings
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {Math.max(1, totalPages)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Full Booking View Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Complete overview of the car reservation</DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-6">
              {/* Car Image */}
              {selected.carRental.images?.[0] && (
                <div className="relative h-56 w-full rounded-lg overflow-hidden">
                  <Image
                    src={selected.carRental.images[0]}
                    alt={`${selected.carRental.make} ${selected.carRental.model}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Booking & Car Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Customer Info</h3>
                  <p className="font-medium">{selected.name}</p>
                  <p className="text-sm text-muted-foreground">{selected.email}</p>
                  <p className="text-sm text-muted-foreground">{selected.phoneNo}</p>
                  <Badge variant="outline">
                    {selected.user.role === "agent" ? "Booked by Agent" : "Booked by User"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Car Info</h3>
                  <p className="font-medium">
                    {selected.carRental.make} {selected.carRental.model} ({selected.carRental.year})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selected.carRental.category} • {selected.carRental.fuelType}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Seats: {selected.carRental.seats} • Mileage: {selected.carRental.mileage} km/l
                  </p>
                  <p className="text-sm text-muted-foreground">License: {selected.carRental.licensePlate}</p>
                  <Badge
                    className={
                      selected.carRental.status === "approved"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }
                  >
                    {selected.carRental.status}
                  </Badge>
                </div>
              </div>

              {/* Route & Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-3">
                <div>
                  <h3 className="font-semibold mb-2">Route</h3>
                  <p className="text-sm">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    {selected.pickUplocation} → {selected.dropOffLocation}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Schedule</h3>
                  <p className="text-sm">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    {new Date(selected.pickUpTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    to {new Date(selected.returnTime).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-3 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Total Amount</h3>
                </div>
                <div className="text-xl font-bold text-green-600">{selected.amount} USD</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
