"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  Plus,
  Eye,
  MessageSquare,
  Edit,
  Trash2,
  Search,
  MapPin,
  MoreHorizontal,
  ArrowUpDown,
  Grid,
  List,
  Home,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"

import { PropertySidebar } from "@/components/property/sidebar"
import { PropertyHeader } from "@/components/property/header"
import { DeletePropertybyid, GetPropertybyuser } from "@/lib/property_api"
import { Property } from "@/types/property"
import toast, { Toaster } from "react-hot-toast"



function PropertyDetailsModal({ property }: { property: any }) {
  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
        <DialogDescription className="flex items-center text-slate-600">
          <MapPin className="h-4 w-4 mr-1" />
          {property.address}, {property.city}, {property.province}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Property Images */}
        <div className="relative">
          {property.images && property.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.images.map((imageUrl: string, index: number) => (
                <img
                  key={index}
                  src={imageUrl || "/placeholder.svg"}
                  alt={`${property.title} - Image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          ) : (
            <img
              src={property.images?.[0] || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          <Badge className={`absolute top-3 left-3 ${getStatusColor(property.status)}`}>{property.status}</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">USD {property.price.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Price</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">{property.bedrooms}</div>
            <div className="text-sm text-slate-600">Bedrooms</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">{property.bathrooms}</div>
            <div className="text-sm text-slate-600">Bathrooms</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">{property.builtUpArea.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Built-up Area (sq ft)</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{property.plotArea?.toLocaleString() || "N/A"}</div>
            <div className="text-sm text-slate-600">Plot Area (sq ft)</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{property.yearBuilt || "N/A"}</div>
            <div className="text-sm text-slate-600">Year Built</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{property.numberOfFloors || "N/A"}</div>
            <div className="text-sm text-slate-600">Floors</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{property.furnishingStatus || "N/A"}</div>
            <div className="text-sm text-slate-600">Furnishing</div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-slate-600">{property.description}</p>
        </div>

        {property.nearByLands && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Nearby Landmarks</h3>
            <p className="text-slate-600">{property.nearByLands}</p>
          </div>
        )}

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Additional Features */}
        {property.additionalfeatures && property.additionalfeatures.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Additional Features</h3>
            <div className="flex flex-wrap gap-2">
              {property.additionalfeatures.map((feature: string, index: number) => (
                <Badge key={index} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <p>
              <strong>Contact Person:</strong> {property.contactName}
            </p>
            <p>
              <strong>Phone:</strong> {property.contactNumber}
            </p>
            <p>
              <strong>Email:</strong> {property.contactEmail}
            </p>
          </div>
        </div>

      {property.videoUrl && (
  <div>
    <h3 className="text-lg font-semibold mb-2">Property Video</h3>
    <div className="bg-slate-50 p-4 rounded-lg">
      <iframe
        src={property.videoUrl}
        className="w-full h-64 rounded-lg"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Property Video"
      ></iframe>
    </div>
  </div>
)}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Link href={`/property-dashboard/properties/edit/${property.id}`} className="flex-1">
            <Button className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Edit Property
            </Button>
          </Link>
          <Button variant="outline" className="flex-1 bg-transparent">
            <MessageSquare className="h-4 w-4 mr-2" />
            View Inquiries
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("dateAdded")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(()=>
  {
const fetchproperties= async()=>
{
  const response = await GetPropertybyuser();
  setProperties(response);
}
fetchproperties();
  },[])

  if(!properties)
  {
    return <></>
  }
  // Filter and sort properties
  const filteredProperties = properties
    .filter((property) => {
      const matchesSearch =
        property?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property?.address.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || property.status.toLowerCase() === statusFilter
      const matchesType = typeFilter === "all" || property.propertyType.toLowerCase() === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
   

  const handleDeleteProperty =async (propertyId: number) => {
    try {
      const response = await DeletePropertybyid(String(propertyId));
      setProperties(properties.filter((p) => p.id !== propertyId))
      toast.success("Property deleted successfully")
    } catch (error) {
      toast.error("Failed to Delete Property")
      
    }
  }

 return (
    <div className="min-h-screen bg-slate-50 flex">
      <PropertySidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 lg:ml-0">
        <PropertyHeader setSidebarOpen={setSidebarOpen} />

        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">My Properties</h2>
              <p className="text-slate-600 mt-1">Manage and track your property listings</p>
            </div>
            <Link href="/property-dashboard/properties/add">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </Link>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6 bg-white border-slate-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search properties by title or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32 border-slate-200">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32 border-slate-200">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 border-slate-200">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Date Added</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border border-slate-200 rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Properties Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={property.images?.[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className={`absolute top-3 left-3 ${getStatusColor(property.status)}`}>
                      {property.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="absolute top-3 right-3 bg-white/80 hover:bg-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <PropertyDetailsModal property={property} />
                        </Dialog>
                        <DropdownMenuItem asChild>
                          <Link href={`/property-dashboard/properties/edit/${property.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Property
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Property
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Property</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{property.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProperty(property.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1">{property.title}</h3>
                    <div className="flex items-center text-slate-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {property.address}, {property.city}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-slate-900">USD {property.price.toLocaleString()}</span>
                      <span className="text-sm text-slate-600">{property.propertyType}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                      <span>
                        {property.bedrooms} bed • {property.bathrooms} bath
                      </span>
                      <span>{property.builtUpArea.toLocaleString()} sq ft</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">
                          {property.listingType === "sale" ? "For Sale" : "For Rent"}
                        </span>
                      </div>
                      <span className="text-slate-500">{new Date(property.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white border-slate-200">
              <CardContent className="p-0">
                <div className="divide-y divide-slate-200">
                  {filteredProperties.map((property) => (
                    <div key={property.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <img
                          src={property.images?.[0] || "/placeholder.svg"}
                          alt={property.title}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-slate-900 mb-1">{property.title}</h3>
                              <div className="flex items-center text-slate-600 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">
                                  {property.address}, {property.city}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <span>
                                  {property.bedrooms} bed • {property.bathrooms} bath
                                </span>
                                <span>{property.builtUpArea.toLocaleString()} sq ft</span>
                                <span>{property.propertyType}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-slate-900 mb-1">
                                  USD {property.price.toLocaleString()}
                                </div>
                                <Badge className={getStatusColor(property.status)}>{property.status}</Badge>
                              </div>

                              <div className="flex items-center gap-3 text-sm text-slate-600">
                                <span>{property.listingType === "sale" ? "For Sale" : "For Rent"}</span>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                      </DropdownMenuItem>
                                    </DialogTrigger>
                                    <PropertyDetailsModal property={property} />
                                  </Dialog>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/properties/edit/${property.id}`}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Property
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Property
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Property</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{property.title}"? This action cannot be
                                          undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteProperty(property.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {filteredProperties.length === 0 && (
            <Card className="bg-white border-slate-200">
              <CardContent className="p-12 text-center">
                <Home className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No properties found</h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your search criteria or filters."
                    : "Get started by adding your first property listing."}
                </p>
                <Link href="/property-dashboard/properties/add">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
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

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-50 text-green-700 border-green-200"
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "draft":
      return "bg-gray-50 text-gray-700 border-gray-200"
    case "sold":
      return "bg-blue-50 text-blue-700 border-blue-200"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200"
  }
}
