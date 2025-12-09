"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Home,
  ArrowLeft,
  Eye,
  Upload,
  X,
  Plus,
  DollarSign,
  Square,
  Calendar,
  Building2,
  User,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import { PostProperty } from "@/lib/property_api"
import { PropertySidebar } from "@/components/property/sidebar"
import { PropertyHeader } from "@/components/property/header"
import { GoogleMapsLocationPicker } from "@/components/google-maps-location-picker"

interface PropertyFormData {
  // Basic Information
  title: string
  description: string
  propertyType: string
  listingType: string
  status: string

  // Location
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  lat?: number
  lng?: number
  nearbyLandmarks: string

  // Property Details
  builtUpArea: string
  plotArea: string
  bedrooms: string
  bathrooms: string
  kitchens: string
  livingRooms: string
  balconies: string
  floorNumber: string
  totalFloors: string
  yearBuilt: string
  furnishingStatus: string
  condition: string

  // Pricing - For Rent
  monthlyRent: string
  securityDeposit: string
  advancePayment: string
  rentNegotiable: boolean
  maintenanceIncluded: boolean
  utilitiesIncluded: boolean

  // Pricing - For Sale
  askingPrice: string
  priceNegotiable: boolean

  // Contact
  contactName: string
  contactPhone: string
  contactEmail: string

  // Media
  images: File[]
  featuredImageIndex: number
  video: string

  // Features
  amenities: string[]
  features: string[]
}

const amenitiesList = [
  "Air Conditioning",
  "Heating",
  "Internet/WiFi",
  "Parking",
  "Maid Room",
  "Garden",
  "Balcony",
  "Swimming Pool",
  "Terrace",
  "CCTV Security",
  "Security Guard",
  "Fire Alarm",
  "Gym/Fitness Center",
  "Mosque/Prayer Room",
  "Kids Play Area",
  "Near Shopping Mall",
  "Public Transport Access",
]

const featuresList = [
  "Furnished",
  "Semi-furnished",
  "Unfurnished",
  "Pet Friendly",
  "Wheelchair Accessible",
  "Recently Renovated",
  "High Ceilings",
  "Hardwood Floors",
  "Granite Countertops",
  "Stainless Steel Appliances",
  "In-unit Washer/Dryer",
  "Dishwasher",
  "Microwave",
  "Refrigerator",
]

const sidebarItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Properties", href: "/properties", icon: Building2 },
  { name: "Add Property", href: "/properties/add", icon: Plus },
  { name: "Profile & Settings", href: "/profile", icon: User },
]

export default function AddPropertyPage() {
  const router = useRouter()
  const pathname = usePathname()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState<PropertyFormData>({
    // Basic Information
    title: "",
    description: "",
    propertyType: "",
    listingType: "",
    status: "draft",

    // Location
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    lat: undefined,
    lng: undefined,
    nearbyLandmarks: "",

    // Property Details
    builtUpArea: "",
    plotArea: "",
    bedrooms: "",
    bathrooms: "",
    kitchens: "1",
    livingRooms: "1",
    balconies: "0",
    floorNumber: "",
    totalFloors: "",
    yearBuilt: "",
    furnishingStatus: "",
    condition: "",

    // Pricing - For Rent
    monthlyRent: "",
    securityDeposit: "1",
    advancePayment: "0",
    rentNegotiable: false,
    maintenanceIncluded: false,
    utilitiesIncluded: false,

    // Pricing - For Sale
    askingPrice: "",
    priceNegotiable: false,

    // Contact
    contactName: "John Doe",
    contactPhone: "+1 (555) 123-4567",
    contactEmail: "john@propertypro.com",

    // Media
    images: [],
    featuredImageIndex: 0,
    video: "",

    // Features
    amenities: [],
    features: [],
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 6 // Increased steps to accommodate all fields

  const handleInputChange = (field: keyof PropertyFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: "amenities" | "features", value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter((item) => item !== value),
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      featuredImageIndex:
        prev.featuredImageIndex >= index && prev.featuredImageIndex > 0
          ? prev.featuredImageIndex - 1
          : prev.featuredImageIndex,
    }))
  }

  const setFeaturedImage = (index: number) => {
    setFormData((prev) => ({ ...prev, featuredImageIndex: index }))
    toast.success("This image will be used as the main property photo.")
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.title || !formData.propertyType || !formData.listingType || !formData.description) {
          toast.error("Please fill in all required fields before proceeding.")
          return false
        }
        break
      case 2:
        if (!formData.address || !formData.city || !formData.state  || !formData.country) {
          toast.error("Please fill in all required location details.")
          return false
        }
        break
      case 3:
        if (
          !formData.builtUpArea ||
          !formData.bedrooms ||
          !formData.bathrooms ||
          !formData.furnishingStatus ||
          !formData.condition
        ) {
          toast.error("Please fill in all required property details.")
          return false
        }
        break
      case 4:
        if (formData.listingType === "rent") {
          if (!formData.monthlyRent || !formData.securityDeposit) {
            toast.error("Please fill in all required rental pricing details.")
            return false
          }
        } else {
          if (!formData.askingPrice) {
            toast.error("Please fill in all required sale pricing details.")
            return false
          }
        }
        break
      case 5:
        if (!formData.contactName || !formData.contactPhone || !formData.contactEmail) {
          toast.error("Please fill in all required contact information.")
          return false
        }
        break
    }
    return true
  }

  const handleLocationSelect = (locationData: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    lat: number
    lng: number
  }) => {
    setFormData((prev) => ({
      ...prev,
      address: locationData.address,
      city: locationData.city,
      state: locationData.state,
      zipCode: locationData.zipCode,
      country: locationData.country,
      lat: locationData.lat,
      lng: locationData.lng,
    }))
  }

  const handleSubmit = async (status: "draft" | "active") => {
    if (!validateCurrentStep()) return

    const finalData = {
      ...formData,
      status,
      id: Date.now(),
      dateAdded: new Date().toISOString().split("T")[0],
      views: 0,
      inquiries: 0,
      favorites: 0,
    }

    // Create FormData object
    const fd = new FormData()

    // Basic fields
    fd.append("title", finalData.title)
    fd.append("listingType", finalData.listingType)
    fd.append("propertyType", finalData.propertyType)
    fd.append("description", finalData.description)
    fd.append("status", finalData.status)

    // Location
    fd.append("address", finalData.address)
    fd.append("city", finalData.city)
    fd.append("province", finalData.state) // map state → province
    fd.append("postalCode", finalData.zipCode) // map zipCode → postalCode
    fd.append("country", finalData.country)
    fd.append("nearByLands", finalData.nearbyLandmarks)

    // Property details (convert numbers)
    fd.append("builtUpArea", String(finalData.builtUpArea || 0))
    fd.append("plotArea", String(finalData.plotArea || 0))
    fd.append("bedrooms", String(finalData.bedrooms || 0))
    fd.append("bathrooms", String(finalData.bathrooms || 0))
    fd.append("kitchen", String(finalData.kitchens || 0))
    fd.append("livingRooms", String(finalData.livingRooms || 0))
    fd.append("balconies", String(finalData.balconies || 0))
    fd.append("yearBuilt", String(finalData.yearBuilt || 0))
    fd.append("numberOfFloors", String(finalData.totalFloors || 0))
    fd.append("floorNumber", String(finalData.floorNumber || 0))
    fd.append("furnishingStatus", finalData.furnishingStatus)
    fd.append("condition", finalData.condition)

    // Pricing
    const price = finalData.listingType === "rent" ? finalData.monthlyRent : finalData.askingPrice
    fd.append("price", String(price || 0))
    fd.append("priceNegotiable", String(finalData.rentNegotiable || finalData.priceNegotiable))

    // Contact
    fd.append("contactNumber", finalData.contactPhone)
    fd.append("contactEmail", finalData.contactEmail)
    fd.append("contactName", finalData.contactName)

    // Media (images + video)
    if (finalData.images && finalData.images.length > 0) {
      finalData.images.forEach((img: File) => {
        fd.append("images", img) // multiple files
      })
    }

    if (finalData.video) {
      fd.append("videoUrl", finalData.video)
    }

    // Arrays
    if (finalData.amenities && finalData.amenities.length > 0) {
      finalData.amenities.forEach((a: string) => fd.append("amenities", a))
    }

    if (finalData.features && finalData.features.length > 0) {
      finalData.features.forEach((f: string) => fd.append("additionalfeatures", f))
    }
    console.log([...fd.entries()].map(([k, v]) => `${k}: ${v}`).join("\n"))
    try {
      const response = await PostProperty(fd)

      toast.success(`${finalData.title} has been ${status === "draft" ? "saved" : "published"}`)
      router.push("/property-dashboard/properties")
    } catch (error) {
      toast.error("Something went wrong while saving the property")
    }
  }

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Basic Information"
      case 2:
        return "Location Details"
      case 3:
        return "Property Details"
      case 4:
        return "Pricing Information"
      case 5:
        return "Contact Information"
      case 6:
        return "Media & Features"
      default:
        return "Property Information"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <PropertySidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 lg:ml-0">
        <PropertyHeader setSidebarOpen={setSidebarOpen} />
        {/* ... existing header code ... */}

        <div className="p-6">
          {/* ... existing page header and progress steps ... */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/properties">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Properties
              </Button>
            </Link>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Add New Property</h2>
              <p className="text-slate-600 mt-1">Create a new property listing</p>
            </div>
          </div>

          <Card className="mb-6 bg-white border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        step <= currentStep ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {step}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${step <= currentStep ? "text-slate-900" : "text-slate-500"}`}>
                        {getStepTitle(step)}
                      </p>
                    </div>
                    {step < totalSteps && (
                      <div className={`w-12 h-0.5 mx-4 ${step < currentStep ? "bg-blue-600" : "bg-slate-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Step {currentStep}: {getStepTitle(currentStep)}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Enter the basic information about your property"}
                {currentStep === 2 && "Provide detailed location information"}
                {currentStep === 3 && "Add property specifications and details"}
                {currentStep === 4 && "Set pricing information"}
                {currentStep === 5 && "Add contact information"}
                {currentStep === 6 && "Upload media and select features"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="title" className="text-sm font-medium text-slate-700">
                        Property Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g., Luxury 2-Bed Apartment in DHA Phase 6"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="mt-1 border-slate-200"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="listingType" className="text-sm font-medium text-slate-700">
                        Listing Type *
                      </Label>
                      <Select
                        value={formData.listingType}
                        onValueChange={(value) => handleInputChange("listingType", value)}
                        required
                      >
                        <SelectTrigger className="mt-1 border-slate-200">
                          <SelectValue placeholder="Select listing type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">For Sale</SelectItem>
                          <SelectItem value="rent">For Rent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="propertyType" className="text-sm font-medium text-slate-700">
                        Property Type *
                      </Label>
                      <Select
                        value={formData.propertyType}
                        onValueChange={(value) => handleInputChange("propertyType", value)}
                        required
                      >
                        <SelectTrigger className="mt-1 border-slate-200">
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="shop">Shop</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="plot">Plot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status" className="text-sm font-medium text-slate-700">
                        Property Status *
                      </Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleInputChange("status", value)}
                        required
                      >
                        <SelectTrigger className="mt-1 border-slate-200">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="rented">Rented</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                      Property Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your property in detail..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="mt-1 border-slate-200 min-h-32"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Location Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-3 block">Property Location *</Label>
                    <GoogleMapsLocationPicker
                      onLocationSelect={handleLocationSelect}
                      initialLocation={
                        formData.lat && formData.lng ? { lat: formData.lat, lng: formData.lng } : undefined
                      }
                      initialAddress={
                        formData.address
                          ? {
                              address: formData.address,
                              city: formData.city,
                              state: formData.state,
                              zipCode: formData.zipCode,
                              country: formData.country,
                            }
                          : undefined
                      }
                      height="400px"
                    />
                  </div>

                  {formData.address && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div>
                        <Label className="text-xs font-medium text-slate-600">Address</Label>
                        <p className="text-sm text-slate-900 mt-1">{formData.address}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-slate-600">City</Label>
                        <p className="text-sm text-slate-900 mt-1">{formData.city || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-slate-600">State/Province</Label>
                        <p className="text-sm text-slate-900 mt-1">{formData.state || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-slate-600">ZIP Code</Label>
                        <p className="text-sm text-slate-900 mt-1">{formData.zipCode || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-slate-600">Country</Label>
                        <p className="text-sm text-slate-900 mt-1">{formData.country || "N/A"}</p>
                      </div>
                      {formData.lat && formData.lng && (
                        <div>
                          <Label className="text-xs font-medium text-slate-600">Coordinates</Label>
                          <p className="text-sm text-slate-900 mt-1">
                            {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="nearbyLandmarks" className="text-sm font-medium text-slate-700">
                      Nearby Landmarks
                    </Label>
                    <Textarea
                      id="nearbyLandmarks"
                      placeholder="Schools, hospitals, malls, etc."
                      value={formData.nearbyLandmarks}
                      onChange={(e) => handleInputChange("nearbyLandmarks", e.target.value)}
                      className="mt-1 border-slate-200"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Property Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <Label htmlFor="builtUpArea" className="text-sm font-medium text-slate-700">
                        Built-up Area (sq ft) *
                      </Label>
                      <div className="relative mt-1">
                        <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="builtUpArea"
                          placeholder="1200"
                          value={formData.builtUpArea}
                          onChange={(e) => handleInputChange("builtUpArea", e.target.value)}
                          className="pl-10 border-slate-200"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="plotArea" className="text-sm font-medium text-slate-700">
                        Plot Area (sq ft)
                      </Label>
                      <div className="relative mt-1">
                        <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="plotArea"
                          placeholder="1500"
                          value={formData.plotArea}
                          onChange={(e) => handleInputChange("plotArea", e.target.value)}
                          className="pl-10 border-slate-200"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bedrooms" className="text-sm font-medium text-slate-700">
                        Bedrooms *
                      </Label>
                      <Select
                        value={formData.bedrooms}
                        onValueChange={(value) => handleInputChange("bedrooms", value)}
                        required
                      >
                        <SelectTrigger className="mt-1 border-slate-200">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bathrooms" className="text-sm font-medium text-slate-700">
                        Bathrooms *
                      </Label>
                      <Select
                        value={formData.bathrooms}
                        onValueChange={(value) => handleInputChange("bathrooms", value)}
                        required
                      >
                        <SelectTrigger className="mt-1 border-slate-200">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="1.5">1.5</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="2.5">2.5</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="3.5">3.5</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <Label htmlFor="kitchens" className="text-sm font-medium text-slate-700">
                        Kitchens
                      </Label>
                      <Input
                        id="kitchens"
                        placeholder="1"
                        value={formData.kitchens}
                        onChange={(e) => handleInputChange("kitchens", e.target.value)}
                        className="mt-1 border-slate-200"
                      />
                    </div>

                    <div>
                      <Label htmlFor="livingRooms" className="text-sm font-medium text-slate-700">
                        Living Rooms/Lounges
                      </Label>
                      <Input
                        id="livingRooms"
                        placeholder="1"
                        value={formData.livingRooms}
                        onChange={(e) => handleInputChange("livingRooms", e.target.value)}
                        className="mt-1 border-slate-200"
                      />
                    </div>

                    <div>
                      <Label htmlFor="balconies" className="text-sm font-medium text-slate-700">
                        Balconies/Terraces
                      </Label>
                      <Input
                        id="balconies"
                        placeholder="0"
                        value={formData.balconies}
                        onChange={(e) => handleInputChange("balconies", e.target.value)}
                        className="mt-1 border-slate-200"
                      />
                    </div>

                    <div>
                      <Label htmlFor="yearBuilt" className="text-sm font-medium text-slate-700">
                        Year Built
                      </Label>
                      <div className="relative mt-1">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="yearBuilt"
                          placeholder="2020"
                          value={formData.yearBuilt}
                          onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                          className="pl-10 border-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <Label htmlFor="floorNumber" className="text-sm font-medium text-slate-700">
                        Floor Number
                      </Label>
                      <Input
                        id="floorNumber"
                        placeholder="2"
                        value={formData.floorNumber}
                        onChange={(e) => handleInputChange("floorNumber", e.target.value)}
                        className="mt-1 border-slate-200"
                      />
                    </div>

                    <div>
                      <Label htmlFor="totalFloors" className="text-sm font-medium text-slate-700">
                        Total Floors in Building
                      </Label>
                      <Input
                        id="totalFloors"
                        placeholder="10"
                        value={formData.totalFloors}
                        onChange={(e) => handleInputChange("totalFloors", e.target.value)}
                        className="mt-1 border-slate-200"
                      />
                    </div>

                    <div>
                      <Label htmlFor="furnishingStatus" className="text-sm font-medium text-slate-700">
                        Furnishing Status *
                      </Label>
                      <Select
                        value={formData.furnishingStatus}
                        onValueChange={(value) => handleInputChange("furnishingStatus", value)}
                        required
                      >
                        <SelectTrigger className="mt-1 border-slate-200">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="furnished">Furnished</SelectItem>
                          <SelectItem value="semi-furnished">Semi-furnished</SelectItem>
                          <SelectItem value="unfurnished">Unfurnished</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="condition" className="text-sm font-medium text-slate-700">
                        Condition *
                      </Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) => handleInputChange("condition", value)}
                        required
                      >
                        <SelectTrigger className="mt-1 border-slate-200">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                          <SelectItem value="under-construction">Under Construction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Pricing Information */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  {formData.listingType === "rent" ? (
                    <>
                      <h3 className="text-lg font-semibold text-slate-900">Rental Pricing</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <Label htmlFor="monthlyRent" className="text-sm font-medium text-slate-700">
                            Monthly Rent Amount *
                          </Label>
                          <div className="relative mt-1">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              id="monthlyRent"
                              placeholder="2500"
                              value={formData.monthlyRent}
                              onChange={(e) => handleInputChange("monthlyRent", e.target.value)}
                              className="pl-10 border-slate-200"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="securityDeposit" className="text-sm font-medium text-slate-700">
                            Security Deposit (months) *
                          </Label>
                          <Input
                            id="securityDeposit"
                            placeholder="1"
                            value={formData.securityDeposit}
                            onChange={(e) => handleInputChange("securityDeposit", e.target.value)}
                            className="mt-1 border-slate-200"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="advancePayment" className="text-sm font-medium text-slate-700">
                            Advance Payment (months, optional)
                          </Label>
                          <Input
                            id="advancePayment"
                            placeholder="0"
                            value={formData.advancePayment}
                            onChange={(e) => handleInputChange("advancePayment", e.target.value)}
                            className="mt-1 border-slate-200"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="rentNegotiable"
                            checked={formData.rentNegotiable}
                            onCheckedChange={(checked) => handleInputChange("rentNegotiable", checked as boolean)}
                          />
                          <Label htmlFor="rentNegotiable" className="text-sm text-slate-700">
                            Rent Negotiable: Yes/No
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="maintenanceIncluded"
                            checked={formData.maintenanceIncluded}
                            onCheckedChange={(checked) => handleInputChange("maintenanceIncluded", checked as boolean)}
                          />
                          <Label htmlFor="maintenanceIncluded" className="text-sm text-slate-700">
                            Maintenance Included? Yes/No
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="utilitiesIncluded"
                            checked={formData.utilitiesIncluded}
                            onCheckedChange={(checked) => handleInputChange("utilitiesIncluded", checked as boolean)}
                          />
                          <Label htmlFor="utilitiesIncluded" className="text-sm text-slate-700">
                            Utilities Included? Yes/No
                          </Label>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-slate-900">Sale Pricing</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="askingPrice" className="text-sm font-medium text-slate-700">
                            Asking Price *
                          </Label>
                          <div className="relative mt-1">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              id="askingPrice"
                              placeholder="450000"
                              value={formData.askingPrice}
                              onChange={(e) => handleInputChange("askingPrice", e.target.value)}
                              className="pl-10 border-slate-200"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="priceNegotiable"
                          checked={formData.priceNegotiable}
                          onCheckedChange={(checked) => handleInputChange("priceNegotiable", checked as boolean)}
                        />
                        <Label htmlFor="priceNegotiable" className="text-sm text-slate-700">
                          Price Negotiable: Yes/No
                        </Label>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 5: Contact Information */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="contactName" className="text-sm font-medium text-slate-700">
                        Contact Name *
                      </Label>
                      <Input
                        id="contactName"
                        placeholder="John Doe"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange("contactName", e.target.value)}
                        className="mt-1 border-slate-200"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPhone" className="text-sm font-medium text-slate-700">
                        Phone Number *
                      </Label>
                      <Input
                        id="contactPhone"
                        placeholder="+1 (555) 123-4567"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                        className="mt-1 border-slate-200"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactEmail" className="text-sm font-medium text-slate-700">
                        Email Address *
                      </Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                        className="mt-1 border-slate-200"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Media & Features */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Property Images</h3>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 mb-4">Upload property images</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("image-upload")?.click()}
                        className="border-slate-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Choose Images
                      </Button>
                    </div>

                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image) || "/placeholder.svg"}
                              alt={`Property ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant={formData.featuredImageIndex === index ? "default" : "outline"}
                              size="sm"
                              onClick={() => setFeaturedImage(index)}
                              className="absolute bottom-1 left-1 h-6 px-2 text-xs"
                            >
                              <Star className="h-3 w-3 mr-1" />
                              {formData.featuredImageIndex === index ? "Featured" : "Set Featured"}
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="video" className="text-sm font-medium text-slate-700">
                        Video URL
                      </Label>
                      <Input
                        id="video"
                        placeholder="https://youtube.com/watch?v=..."
                        value={formData.video}
                        onChange={(e) => handleInputChange("video", e.target.value)}
                        className="mt-1 border-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Amenities & Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {amenitiesList.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={`amenity-${amenity}`}
                            checked={formData.amenities.includes(amenity)}
                            onCheckedChange={(checked) => handleArrayChange("amenities", amenity, checked as boolean)}
                          />
                          <Label htmlFor={`amenity-${amenity}`} className="text-sm text-slate-700 cursor-pointer">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Additional Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {featuresList.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox
                            id={`feature-${feature}`}
                            checked={formData.features.includes(feature)}
                            onCheckedChange={(checked) => handleArrayChange("features", feature, checked as boolean)}
                          />
                          <Label htmlFor={`feature-${feature}`} className="text-sm text-slate-700 cursor-pointer">
                            {feature}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ... existing navigation buttons ... */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <div>
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={prevStep} className="border-slate-200 bg-transparent">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {currentStep === totalSteps ? (
                    <>
                      <Button
                        onClick={() => handleSubmit("active")}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Publish Property
                      </Button>
                    </>
                  ) : (
                    <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Next Step
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
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
