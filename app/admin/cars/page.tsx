"use client"

import { useEffect, useState } from "react"
import { Filter, Eye, CheckCircle, XCircle, Upload, MapPin, User, ChevronLeft, ChevronRight, Ban, ShieldCheck } from "lucide-react"

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
import Image from "next/image"
import { GetallCars } from "@/lib/api"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import { updatecar } from "@/lib/carRentalApi"

interface Car {
  id: string
  isActive: boolean
  createdAt: string
  updatedAt: string
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
  status:string
}

const getStatusColor = (carStatus: string) => {
  switch (carStatus.toLowerCase()) {
    case "active":
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    case "rented":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "maintenance":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

const getCarTypeColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "suv":
      return "bg-violet-100 text-violet-700 border-violet-200"
    case "sedan":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "luxury":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "electric":
      return "bg-green-100 text-green-700 border-green-200"
    case "economy":
      return "bg-gray-100 text-gray-700 border-gray-200"
    case "sport":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

export default function CarsPage() {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [Cars, setCars] = useState<Car[]>([])
  const [filters, setFilters] = useState({
    city: "",
    carType: "",
    price: "",
  })
   const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
  useEffect(() => {
    const fetchallcars = async () => {
      const response = await GetallCars()
      console.log(response)
      setCars(response)
    }
    fetchallcars()
  }, [])

  if (!Cars || Cars.length === 0) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Car Rentals</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage and review car rental listings on your platform</p>
        </div>
      </div>
    )
  }

  const filteredCars = Cars.filter((car) => {
    const matchesCity = !filters.city || car.location.toLowerCase().includes(filters.city.toLowerCase())
    const matchesCarType = !filters.carType || car.category.toLowerCase() === filters.carType.toLowerCase()
    const matchesPrice =
      !filters.price ||
      (filters.price === "budget" && car.dailyRate >= 50 && car.dailyRate <= 100) ||
      (filters.price === "mid" && car.dailyRate > 100 && car.dailyRate <= 200) ||
      (filters.price === "luxury" && car.dailyRate > 200)

    return matchesCity && matchesCarType && matchesPrice
  })
 const totalPages = Math.ceil(filteredCars.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCars = filteredCars.slice(startIndex, endIndex)

   const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }


   const handleStatusChange = async (id: string, newStatus: string) => {
      try {
        const response =await updatecar(id,newStatus);
      setCars((prev) =>
        prev.map((v) => (v.id == id ? { ...v, status: newStatus } : v))
      )
      } catch (err) {
        console.error("Failed to update status", err)
      }
    }
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Car Rentals</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage and review car rental listings on your platform</p>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
                City
              </Label>
              <Input
                id="city"
                placeholder="Search by city..."
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carType" className="text-sm font-semibold text-gray-700">
                Car Type
              </Label>
              <Select value={filters.carType} onValueChange={(value) => setFilters({ ...filters, carType: value })}>
                <SelectTrigger className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20">
                  <SelectValue placeholder="Select car type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-semibold text-gray-700">
                Price Range
              </Label>
              <Select value={filters.price} onValueChange={(value) => setFilters({ ...filters, price: value })}>
                <SelectTrigger className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget ($50-100)</SelectItem>
                  <SelectItem value="mid">Mid-range ($100-200)</SelectItem>
                  <SelectItem value="luxury">Luxury ($200+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cars Table */}
      <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Cars ({filteredCars.length})</CardTitle>
              <CardDescription className="text-gray-600 mt-1">Manage car rental listings and approvals</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="font-semibold text-gray-700">Car Details</TableHead>
                  <TableHead className="font-semibold text-gray-700">Make & Year</TableHead>
                  <TableHead className="font-semibold text-gray-700">Location</TableHead>
                  <TableHead className="font-semibold text-gray-700">Category</TableHead>
                  <TableHead className="font-semibold text-gray-700">Seats</TableHead>
                  <TableHead className="font-semibold text-gray-700">Car Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCars.map((car) => (
                  <TableRow key={car.id} className="border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-gray-100">
                         <Image
  src={car?.images[0] || "/placeholder.svg"}
  alt={car.model}
  fill
  className="object-cover"
/>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{car.model}</div>
                          <div className="text-sm text-gray-500">${car.dailyRate}/day</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{car.make}</div>
                      <div className="text-sm text-gray-500">{car.year}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-900">{car.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getCarTypeColor(car.category)} border font-medium`}>{car.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-900">{car.seats}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(car.carStatus)} border font-medium capitalize`}>
                        {car.carStatus}
                      </Badge>
                    </TableCell>
                       <TableCell>
                      <Badge className={`${getStatusColor(car.status)} border font-medium capitalize`}>
                        {car.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
                              onClick={() => setSelectedCar(car)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-gray-900">
                                {selectedCar?.model}
                              </DialogTitle>
                              <DialogDescription className="text-gray-600">
                                Detailed information about this car rental listing
                              </DialogDescription>
                            </DialogHeader>
                            {selectedCar && (
                              <div className="space-y-6">
                                {/* Images */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  {selectedCar.images.map((image: string, index: number) => (
                                    <div key={index} className="relative aspect-video rounded-2xl overflow-hidden">
                                      <Image
                                        src={image || "/placeholder.svg"}
                                        alt={`Car image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold text-gray-900 mb-2">Basic Information</h3>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="font-medium">Make:</span>
                                          <span>{selectedCar.make}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Model:</span>
                                          <span>{selectedCar.model}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Year:</span>
                                          <span>{selectedCar.year}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Category:</span>
                                          <span className="capitalize">{selectedCar.category}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Location:</span>
                                          <span>{selectedCar.location}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="font-medium">Seats:</span>
                                          <span>{selectedCar.seats}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Mileage:</span>
                                          <span>{selectedCar.mileage}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">License Plate:</span>
                                          <span>{selectedCar.licensePlate}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Status:</span>
                                          <span className="capitalize">{selectedCar.carStatus}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                                      <div className="p-3 bg-gray-50 rounded-xl">
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Daily Rate</span>
                                          <span className="font-semibold text-primary-start">
                                            ${selectedCar.dailyRate}/day
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                         <TooltipProvider>
                              {car.status === "pending" && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleStatusChange(car.id||"", "approved")}
                                    >
                                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Approve Hotel</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                        
                              {car.status === "approved" && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleStatusChange(car.id||"", "blocked")}
                                    >
                                      <Ban className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Ban Hotel</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                        
                              {car.status === "blocked" && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleStatusChange(car.id||"", "approved")}
                                    >
                                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Re-Approve Hotel</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </TooltipProvider>
                        {/* <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                        >
                          <XCircle className="h-3 w-3" />
                        </Button><Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-violet-200 text-violet-600 hover:bg-violet-50 bg-transparent"
                        >
                          <Upload className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-violet-200 text-violet-600 hover:bg-violet-50 bg-transparent"
                        >
                          <Upload className="h-3 w-3" />
                        </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
 {filteredCars.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredCars.length)} of {filteredCars.length}{" "}
                        Cars
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
