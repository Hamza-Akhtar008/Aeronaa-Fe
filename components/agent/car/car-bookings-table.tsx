"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Search, CarFront, Calendar, MapPin, User, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { FetchallCArBookingsbyAgent } from "@/lib/carRentalApi"

type CarBooking = {
  id: number
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
    make: string
    model: string
    year: number
    category: string
    fuelType: string
    seats: number
    dailyRate: number
    location: string
    images: string[]
    status: string
  }
  user: {
    id: number
    name: string
    email: string
    phone: string
    role: string
    status: string
  }
}

const ITEMS_PER_PAGE = 10

export function CarBookingsTable({ id }: { id?: string }) {
  const [bookings, setBookings] = useState<CarBooking[]>([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selected, setSelected] = useState<CarBooking | null>(null)

  useEffect(() => {
    const fetchcarbookings = async () => {
      const response = await FetchallCArBookingsbyAgent(id || "")
      console.log("Car bookings by agent:", response)
      setBookings(response || [])
    }
    fetchcarbookings()
  }, [id])

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const query = search.toLowerCase()
      return (
        b.name.toLowerCase().includes(query) ||
        b.email.toLowerCase().includes(query) ||
        b.carRental.model.toLowerCase().includes(query) ||
        b.pickUplocation.toLowerCase().includes(query) ||
        b.dropOffLocation.toLowerCase().includes(query)
      )
    })
  }, [bookings, search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const pageItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="space-y-4">
      {/* Filters */}
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
                <th className="w-12 p-4"></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((b) => (
                <tr key={b.id} className="border-t hover:bg-muted/30">
                  <td className="p-4">
                    <div className="font-medium">#{b.id}</div>
                    <div className="text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.email}</div>
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
                    <Button size="sm" variant="outline" onClick={() => setSelected(b)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-muted-foreground" colSpan={7}>
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
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length}{" "}
              bookings
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

      {/* Details Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Car Booking Details</DialogTitle>
            <DialogDescription>Complete booking information</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Customer</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    <div className="font-medium">{selected.name}</div>
                    <div className="text-sm text-muted-foreground">{selected.email}</div>
                    <div className="text-sm text-muted-foreground">{selected.phoneNo}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CarFront className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Car</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    <div className="font-medium">
                      {selected.carRental.make} {selected.carRental.model}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selected.carRental.category} • {selected.carRental.year} • {selected.carRental.fuelType}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-1">Route</div>
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{selected.pickUplocation}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{selected.dropOffLocation}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Schedule</div>
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(selected.pickUpTime).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Calendar className="h-4 w-4" />
                      to {new Date(selected.returnTime).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="text-sm font-medium">Total</div>
                <div className="font-semibold">{selected.amount} USD</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
