"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Filter, Eye, ChevronLeft, ChevronRight, Building, Mail, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, Ban, ShieldCheck } from "lucide-react"
import { FetchallUser, GetallHotelbyid, UpdateUserStatus } from "@/lib/api"

interface Hotel {
  id?: string
  name: string
  description: string
  Address: string
  city: string
  state: string
  zipCode: string
  country: string
  starRating: string
  checkInTime: string
  checkOutTime: string
  availableFrom: Date
  availableTo: Date
  amenities?: string[]
  images?: any[]
  tags?: string | string[]
  isCompleted: boolean
  value?: string
  vendorId?: number
}

interface VendorUser {
  id: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  name: string
  password: string
  email: string
  phone: string
  role: string
  status :string
}

const getStatusColor = (status: string) => {
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

const getHotelStatusColor = (isCompleted: boolean) =>
  isCompleted ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200"

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

export default function VendorsPage() {
  const [selectedVendor, setSelectedVendor] = useState<VendorUser | null>(null)
  const [filters, setFilters] = useState({status:"", isActive: "", createdAt: "", name: "" })
  const [vendors, setVendors] = useState<VendorUser[]>([])
  const [vendorHotels, setVendorHotels] = useState<Map<number, Hotel[]>>(new Map())
  const [loadingHotels, setLoadingHotels] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState<"hotel" | "car" | "property" | "umrah">("hotel")

  const roleMap: Record<typeof activeTab, string> = {
    hotel: "vendor",
    car: "carrental",
    property: "property",
    umrah: "umrah",
  }


 

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    const response = await FetchallUser()
    
    setVendors(response.filter((user: VendorUser) => user.role !== "user"))
  }

  const filteredByRole = vendors.filter((v) => v.role === roleMap[activeTab])

const filteredVendors = filteredByRole.filter((vendor) => {
  return (
    (!filters.isActive ||
      (filters.isActive === "active" ? vendor.isActive : !vendor.isActive)) &&
    (!filters.createdAt ||
      new Date(vendor.createdAt) >= new Date(filters.createdAt)) &&
    (!filters.name ||
      vendor.name.toLowerCase().includes(filters.name.toLowerCase())) &&
    (!filters.status || filters.status === "all" || vendor.status === filters.status)
  )
})

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentVendors = filteredVendors.slice(startIndex, endIndex)

  const getVendorHotels = useCallback(
    async (vendorId: number) => {
      if (vendorHotels.has(vendorId)) return vendorHotels.get(vendorId) || []
      if (loadingHotels.has(vendorId)) return []

      setLoadingHotels((prev) => new Set(prev).add(vendorId))
      try {
        const hotels = await GetallHotelbyid(String(vendorId))
        setVendorHotels((prev) => new Map(prev).set(vendorId, hotels))
        return hotels
      } catch (err) {
        console.error("Error fetching hotels", err)
        return []
      } finally {
        setLoadingHotels((prev) => {
          const newSet = new Set(prev)
          newSet.delete(vendorId)
          return newSet
        })
      }
    },
    [vendorHotels, loadingHotels],
  )

  const calculateVendorStats = useCallback(
    (vendorId: number) => {
      const hotels = vendorHotels.get(vendorId) || []
      const totalProperties = hotels.length
      const completedProperties = hotels.filter((hotel) => hotel.isCompleted).length
      const completionRate = totalProperties > 0 ? (completedProperties / totalProperties) * 100 : 0
      return { totalProperties, completedProperties, completionRate }
    },
    [vendorHotels],
  )

  const vendorStatsMap = useMemo(() => {
    const statsMap = new Map()
    filteredVendors.forEach((vendor) => {
      statsMap.set(vendor.id, calculateVendorStats(vendor.id))
    })
    return statsMap
  }, [filteredVendors, calculateVendorStats])

  const handleViewVendor = async (vendor: VendorUser) => {
    setSelectedVendor(vendor)
    await getVendorHotels(vendor.id)
  }

  const selectedVendorHotels = useMemo(
    () => (selectedVendor ? vendorHotels.get(selectedVendor.id) || [] : []),
    [selectedVendor, vendorHotels],
  )

  const selectedVendorStats = useMemo(
    () => (selectedVendor ? calculateVendorStats(selectedVendor.id) : { totalProperties: 0, completedProperties: 0, completionRate: 0 }),
    [selectedVendor, calculateVendorStats],
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
const handleStatusChange = async (vendorId: number, newStatus: string) => {
  try {
  await UpdateUserStatus(String(vendorId),newStatus);
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, status: newStatus } : v))
    )
  } catch (err) {
    console.error("Failed to update status", err)
  }
}
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Vendor Management</h1>
        <p className="text-gray-600 mt-2 text-lg">Manage vendor accounts and their property listings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        {[
          { key: "hotel", label: "Hotel Vendors" },
          { key: "car", label: "Car Agents" },
          { key: "property", label: "Property Agents" },
          { key: "umrah", label: "Umrah Agents" },
        ].map((tab) => (
          <Button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as any)
              setCurrentPage(1)
            }}
            className={`rounded-full px-6 ${
              activeTab === tab.key ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Filter className="h-5 w-5" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
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
            <div>
              <Label>Registration Date</Label>
              <Input type="date" value={filters.createdAt} onChange={(e) => setFilters({ ...filters, createdAt: e.target.value })} />
            </div>
            <div>
              <Label>Vendor Name</Label>
              <Input
                placeholder="Search by vendor name..."
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            {activeTab === "hotel" && "Hotel Vendors"}
            {activeTab === "car" && "Car Agents"}
            {activeTab === "property" && "Property Agents"}
            {activeTab === "umrah" && "Umrah Agents"} ({filteredVendors.length})
          </CardTitle>
          <CardDescription className="text-gray-600">Manage vendor accounts and their properties</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentVendors.map((vendor) => {
                  const stats = vendorStatsMap.get(vendor.id) || { totalProperties: 0, completedProperties: 0, completionRate: 0 }
                  return (
                    <TableRow key={vendor.id}>
                      <TableCell>#{vendor.id}</TableCell>
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>{vendor.email}</TableCell>
                      <TableCell>{vendor.phone}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(vendor.status)} border font-medium`}>
                          {vendor.status.toLocaleUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(vendor.createdAt)}</TableCell>
                   <TableCell>
  <div className="flex flex-wrap items-center gap-2">
    {/* View button */}
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" onClick={() => handleViewVendor(vendor)}>
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle>Vendor Profile - {selectedVendor?.name}</DialogTitle>
          <DialogDescription>
            Complete vendor information and property listings
          </DialogDescription>
        </DialogHeader>
        {/* Vendor Info */}
        {selectedVendor && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold">Vendor Information</h3>
                <p>ID: #{selectedVendor.id}</p>
                <p>Email: {selectedVendor.email}</p>
                <p>Phone: {selectedVendor.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold">Stats</h3>
                <p>Total: {selectedVendorStats.totalProperties}</p>
                <p>Completed: {selectedVendorStats.completedProperties}</p>
                <p>Rate: {Math.round(selectedVendorStats.completionRate)}%</p>
              </div>
            </div>

            {/* Hotels */}
            {activeTab === "hotel" && (
              <div>
                <h3 className="font-semibold">
                  Properties ({selectedVendorHotels.length})
                </h3>
                {selectedVendorHotels.map((hotel) => (
                  <div key={hotel.id} className="border p-3 rounded-lg mb-2">
                    <div className="flex justify-between">
                      <span>{hotel.name}</span>
                      <Badge className={getHotelStatusColor(hotel.isCompleted)}>
                        {hotel.isCompleted ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                    <p>
                      {hotel.Address}, {hotel.city}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* Status action buttons */}
    <TooltipProvider>
      {vendor.status === "pending" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange(vendor.id, "approved")}
            >
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Approve Vendor</p>
          </TooltipContent>
        </Tooltip>
      )}

      {vendor.status === "approved" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleStatusChange(vendor.id, "blocked")}
            >
              <Ban className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Block Vendor</p>
          </TooltipContent>
        </Tooltip>
      )}

      {vendor.status === "blocked" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange(vendor.id, "approved")}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Re-Approve Vendor</p>
          </TooltipContent>
        </Tooltip>
      )}
    </TooltipProvider>
  </div>
</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Pagination */}
        {filteredVendors.length > 0 && (
          <div className="px-6 py-4 border-t">
            <div className="flex justify-between">
              <span>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredVendors.length)} of {filteredVendors.length}
              </span>
              <div className="flex gap-2">
                <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
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
