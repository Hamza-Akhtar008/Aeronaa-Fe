"use client"

import { useState } from "react"
import { Filter, Eye, CheckCircle, XCircle, Edit, MapPin, DollarSign, ImageIcon } from "lucide-react"

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

// Mock data
const properties = [
  {
    id: 1,
    title: "Luxury Villa in Palm Jumeirah",
    vendor: "Elite Properties",
    city: "Dubai",
    category: "House",
    price: "$2,500,000",
    status: "approved",
    location: "Palm Jumeirah, Dubai",
    bedrooms: 5,
    bathrooms: 6,
    area: "4,500 sq ft",
    yearBuilt: "2022",
    description: "Stunning waterfront villa with private beach access and panoramic views of Dubai skyline.",
    features: ["Private Beach", "Swimming Pool", "Garden", "Garage", "Security", "Maid's Room"],
   images: [
      "/images/image2.jpg",
      "/images/bgimage.jpg",
      "/images/image5.jpg",
      "/images/image3.jpg",
      "/images/image1.jpg",
      
    ],
    contact: {
      phone: "+971-4-123-4567",
      email: "info@eliteproperties.com",
      agent: "Sarah Johnson",
    },
  },
  {
    id: 2,
    title: "Modern Apartment in Downtown",
    vendor: "Urban Living",
    city: "Abu Dhabi",
    category: "Apartment",
    price: "$850,000",
    status: "pending",
    location: "Downtown Abu Dhabi",
    bedrooms: 3,
    bathrooms: 3,
    area: "2,200 sq ft",
    yearBuilt: "2021",
    description: "Contemporary apartment with city views and premium finishes in the heart of Abu Dhabi.",
    features: ["City View", "Balcony", "Gym Access", "Parking", "Concierge", "Pool"],
     images: [
      "/images/image2.jpg",
      "/images/bgimage.jpg",
      "/images/image5.jpg",
    ],
    contact: {
      phone: "+971-2-987-6543",
      email: "contact@urbanliving.com",
      agent: "Ahmed Al-Rashid",
    },
  },
  {
    id: 3,
    title: "Commercial Plot in Business Bay",
    vendor: "Investment Properties",
    city: "Dubai",
    category: "Plot",
    price: "$5,200,000",
    status: "rejected",
    location: "Business Bay, Dubai",
    bedrooms: null,
    bathrooms: null,
    area: "8,000 sq ft",
    yearBuilt: null,
    description: "Prime commercial plot in Business Bay with excellent connectivity and development potential.",
    features: ["Prime Location", "High ROI Potential", "Development Ready", "Metro Access"],
    images: [
      "/images/image2.jpg",
      "/images/bgimage.jpg",
      "/images/image5.jpg",
    ],
    contact: {
      phone: "+971-4-555-0123",
      email: "sales@investmentprops.com",
      agent: "Michael Chen",
    },
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "rejected":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "house":
      return "bg-violet-100 text-violet-700 border-violet-200"
    case "apartment":
      return "bg-electric-100 text-electric-700 border-electric-200"
    case "plot":
      return "bg-amber-100 text-amber-700 border-amber-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

export default function PropertiesPage() {
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    priceRange: "",
    status: "",
  })

  const filteredProperties = properties.filter((property) => {
    return (
      (!filters.location || property.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.category || property.category.toLowerCase() === filters.category.toLowerCase()) &&
      (!filters.status || property.status === filters.status)
    )
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Property Listings</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage and review property listings on your platform</p>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
                Location
              </Label>
              <Input
                id="location"
                placeholder="Search by location..."
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                Category
              </Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="plot">Plot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceRange" className="text-sm font-semibold text-gray-700">
                Price Range
              </Label>
              <Select
                value={filters.priceRange}
                onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
              >
                <SelectTrigger className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Under $500K</SelectItem>
                  <SelectItem value="mid">$500K - $2M</SelectItem>
                  <SelectItem value="luxury">$2M - $5M</SelectItem>
                  <SelectItem value="premium">Above $5M</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold text-gray-700">
                Status
              </Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Properties ({filteredProperties.length})
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">Manage property listings and approvals</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="font-semibold text-gray-700">Title</TableHead>
                  <TableHead className="font-semibold text-gray-700">Vendor</TableHead>
                  <TableHead className="font-semibold text-gray-700">City</TableHead>
                  <TableHead className="font-semibold text-gray-700">Category</TableHead>
                  <TableHead className="font-semibold text-gray-700">Price</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Images</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id} className="border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-semibold text-gray-900">{property.title}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {property.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{property.vendor}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-900">{property.city}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getCategoryColor(property.category)} border font-medium`}>
                        {property.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                        <span className="font-semibold text-gray-900">{property.price}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(property.status)} border font-medium capitalize`}>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-xl border-gray-200 hover:bg-gray-50">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            {property.images.length}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-900">Property Images</DialogTitle>
                            <DialogDescription className="text-gray-600">{property.title}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {property.images.map((image: string, index: number) => (
                              <div
                                key={index}
                                className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
                                onClick={() => setImagePreview(image)}
                              >
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`Property image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-gray-200 hover:bg-gray-50"
                              onClick={() => setSelectedProperty(property)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-gray-900">
                                {selectedProperty?.title}
                              </DialogTitle>
                              <DialogDescription className="text-gray-600">
                                Detailed property information
                              </DialogDescription>
                            </DialogHeader>
                            {selectedProperty && (
                              <div className="space-y-6">
                                {/* Main Image */}
                                <div className="relative aspect-video rounded-2xl overflow-hidden">
                                  <Image
                                    src={selectedProperty.images[0] || "/placeholder.svg"}
                                    alt="Property main image"
                                    fill
                                    className="object-cover"
                                  />
                                </div>

                                {/* Property Details */}
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold text-gray-900 mb-2">Property Details</h3>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="font-medium">Category:</span>
                                          <span>{selectedProperty.category}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Area:</span>
                                          <span>{selectedProperty.area}</span>
                                        </div>
                                        {selectedProperty.bedrooms && (
                                          <div className="flex justify-between">
                                            <span className="font-medium">Bedrooms:</span>
                                            <span>{selectedProperty.bedrooms}</span>
                                          </div>
                                        )}
                                        {selectedProperty.bathrooms && (
                                          <div className="flex justify-between">
                                            <span className="font-medium">Bathrooms:</span>
                                            <span>{selectedProperty.bathrooms}</span>
                                          </div>
                                        )}
                                        {selectedProperty.yearBuilt && (
                                          <div className="flex justify-between">
                                            <span className="font-medium">Year Built:</span>
                                            <span>{selectedProperty.yearBuilt}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                      <p className="text-sm text-gray-600">{selectedProperty.description}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="font-medium">Agent:</span>
                                          <span>{selectedProperty.contact.agent}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Phone:</span>
                                          <span>{selectedProperty.contact.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Email:</span>
                                          <span>{selectedProperty.contact.email}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedProperty.features.map((feature: string) => (
                                          <Badge
                                            key={feature}
                                            variant="outline"
                                            className="rounded-full border-gray-200"
                                          >
                                            {feature}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-900 mb-2">Price</h3>
                                      <div className="text-2xl font-bold text-primary-start">
                                        {selectedProperty.price}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl border-gray-200 hover:bg-gray-50">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      {imagePreview && (
        <Dialog open={!!imagePreview} onOpenChange={() => setImagePreview(null)}>
          <DialogContent className="max-w-4xl rounded-3xl">
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src={imagePreview || "/placeholder.svg"}
                alt="Property image preview"
                fill
                className="object-cover"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
