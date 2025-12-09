"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Star, ArrowLeft, Building, MapPin, ImageIcon, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/utils"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image"
import Link from "next/link"
import { Card } from "../ui/card"
import { GoogleMapsLocationPicker } from "@/components/google-maps-location-picker"

// Define amenities options
const hotelAmenities = [
  { id: "wifi", label: "Free WiFi" },
  { id: "parking", label: "Parking" },
  { id: "breakfast", label: "Breakfast included" },
  { id: "pool", label: "Swimming pool" },
  { id: "fitness", label: "Fitness center" },
  { id: "restaurant", label: "Restaurant" },
  { id: "bar", label: "Bar" },
  { id: "spa", label: "Spa and wellness" },
  { id: "roomService", label: "Room service" },
  { id: "petFriendly", label: "Pet friendly" },
  { id: "airportShuttle", label: "Airport shuttle" },
  { id: "businessCenter", label: "Business center" },
  { id: "conferenceRoom", label: "Conference room" },
  { id: "childrenActivities", label: "Children's activities" },
  { id: "laundry", label: "Laundry service" },
]

// Define form schema
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "Hotel name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  Address: z.string(),
  city: z.string(),
  state: z.string(),
  averagePrice: z.string().min(1, { message: "Average price is required." }),
  zipCode: z.string(),
  country: z.string(),
  starRating: z.string(),
  checkInTime: z.string(),
  checkOutTime: z.string(),
  availableFrom: z.date(),
  availableTo: z.date(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.any()).optional(),
  tags: z.string().optional(),
})


interface LocationData {
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  lat: number
  lng: number
}

interface HotelDetailsFormProps {
  onSaved: (hotel: Hotel,images:File[]) => void
  onSavelater: (hotel: Hotel,images:File[]) => void
  hotel: Hotel
  setHotel: React.Dispatch<React.SetStateAction<Hotel>>
}

export function HotelDetailsForm({ onSaved, hotel, setHotel, onSavelater }: HotelDetailsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [isEditing, setisEditing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const maxSteps = 5

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      Address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      starRating: "",
      averagePrice: "",
      checkInTime: "14:00",
      checkOutTime: "11:00",
      availableFrom: new Date(),
      availableTo: new Date(new Date().setMonth(new Date().getMonth() + 12)),
      amenities: [],
      images: [],
      tags: "",
    },
  })

  const steps = [
    { step: 1, label: "Basic Info", icon: Building },
    { step: 2, label: "Location", icon: MapPin },
    { step: 3, label: "Amenities", icon: Building },
    { step: 4, label: "Images", icon: ImageIcon },
    { step: 5, label: "Tags", icon: Tag },
  ]

  const handleNext = () => {
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setImages((prev) => [...prev, ...newImages])
    }
  }

  // Handle removing an image preview
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle location selection from Google Maps
  const handleLocationSelect = (location: LocationData) => {
    setHotel((prevHotel) => ({
      ...prevHotel,
      Address: location.address,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode||"N/A", // Default to "N/A" if zipCode is empty
      country: location.country,
    }))
  }

  const isHotelEmpty = (hotel: Hotel): boolean => {
    const {
      name,
      description,
      Address,
      city,
      state,
      zipCode,
      country,
      starRating,
      checkInTime,
      checkOutTime,
      availableFrom,
      availableTo,
      amenities,
      tags,
    } = hotel

    const cleanedTags =
      typeof tags === "string"
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : Array.isArray(tags)
          ? tags.filter((tag) => typeof tag === "string" && tag.trim().length > 0)
          : []

    return (
      name !== "" &&
      description !== "" &&
      Address !== "" &&
      city !== "" &&
      state !== "" &&
      zipCode !== "" &&
      country !== "" &&
      starRating !== "" &&
      checkInTime !== "" &&
      checkOutTime !== "" &&
      availableFrom != null &&
      availableTo != null &&
      Array.isArray(amenities) &&
      amenities.length > 0 &&
      cleanedTags.length > 0
    )
  }


 useEffect(() => {
  if (!isHotelEmpty(hotel)) {
    // Reset form data
    form.reset({
      id: hotel.id,
      name: hotel.name || "",
      description: hotel.description || "",
      Address: hotel.Address || "",
      city: hotel.city || "",
      state: hotel.state || "",
      zipCode: hotel.zipCode || "",
      country: hotel.country || "",
      starRating: hotel.starRating?.toString() || "",
      averagePrice: hotel.averagePrice || "",
      checkInTime: hotel.checkInTime || "",
      checkOutTime: hotel.checkOutTime || "",
      availableFrom: hotel.availableFrom ? new Date(hotel.availableFrom) : new Date(),
      availableTo: hotel.availableTo ? new Date(hotel.availableTo) : new Date(),
      amenities: hotel.amenities || [],
      images: Array.isArray(hotel.images) ? hotel.images : [],
      tags: Array.isArray(hotel.tags) ? hotel.tags.join(", ") : hotel.tags || "",
    });
 
   
   
  
  }
}, [hotel]);

const handleRemoveExistingImage = (index: number) => {
const updatedImages = [...(hotel.images ?? [])];
  updatedImages.splice(index, 1);
  setHotel({
    ...hotel,
    images: updatedImages,
  });
};
  // Prepare initial address data for Google Maps
  const initialAddress =
    hotel.Address || hotel.city || hotel.state || hotel.country
      ? {
          address: hotel.Address || "",
          city: hotel.city || "",
          state: hotel.state || "",
          zipCode: hotel.zipCode || "",
          country: hotel.country || "",
        }
      : undefined

  return (
    <>
      {!isEditing && hotel.isCompleted == 1 ? (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-10 text-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">{hotel.name}</h2>
              <p className="text-gray-500">{hotel.description}</p>
              <div className="mt-2 flex items-center gap-1 text-yellow-500">
                {Array.from({ length: Number.parseInt(hotel.starRating || "0") }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="ml-2 text-gray-600 text-sm">({hotel.starRating})</span>
              </div>
              <div className="mt-3">
  <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-md">
    Average Price:{" "}
    <span className="text-green-600 font-semibold">
      ${hotel.averagePrice?.toLocaleString() || "N/A"}
    </span>{" "}
    per night
  </span>
</div>
              
            </div>
          </div>

          {/* Image Gallery */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {hotel.images?.map((img, idx) => (
                <Image
                  key={idx}
                  width={300}
                  height={160}
                  src={`${img}`}
                  alt={`Hotel placeholder ${idx + 1}`}
                  className="rounded-lg object-cover h-40 w-full border"
                />
              ))}
            </div>
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Location</h3>
              <p>{hotel.Address}</p>
              <p>
                {hotel.city}, {hotel.state} - {hotel.zipCode}
              </p>
              <p>{hotel.country}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Availability</h3>
              <p>
                <span className="font-medium">Check-in:</span> {hotel.checkInTime}
              </p>
              <p>
                <span className="font-medium">Check-out:</span> {hotel.checkOutTime}
              </p>
              <p>
                <span className="font-medium">From:</span> {new Date(hotel.availableFrom).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">To:</span> {new Date(hotel.availableTo).toLocaleDateString()}
              </p>

              
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities?.map((item, idx) => (
                <span key={idx} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                  {item}
                </span>
              )) || <p className="text-gray-400">No amenities listed</p>}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(hotel.tags) ? hotel.tags : (hotel.tags || "").split(",")).map((tag, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  {tag.trim()}
                </span>
              )) || <p className="text-gray-400">No tags provided</p>}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <Button
              type="button"
           onClick={async () => {
  try {
    // Step 1: Reset the form with hotel data
    form.reset({
      ...hotel,
      availableFrom: new Date(hotel.availableFrom),
      availableTo: new Date(hotel.availableTo),
      tags: Array.isArray(hotel.tags) ? hotel.tags.join(", ") : (hotel.tags ?? ""),
    } as any);

   

    // Step 3: Enable editing
    setisEditing(true);
  } catch (error) {
    console.error("Error during form edit setup:", error);
    // Optionally: show error to user
  }
}}
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Edit Hotel Details
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#f8fafc] to-[#f1f5f9] py-10">
            <div className="max-w-5xl mx-auto px-4">
              {/* Header */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#023e8a] to-[#00b4d8] shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-pattern-grid"></div>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                          width: `${Math.random() * 6 + 2}px`,
                          height: `${Math.random() * 6 + 2}px`,
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          opacity: Math.random() * 0.5 + 0.5,
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <Link href="/Dashboard" className="text-white hover:text-blue-200 transition-all hover:scale-110">
                      <div className="bg-white/10 rounded-full p-1.5 sm:p-2 backdrop-blur-sm">
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                    </Link>
                    <div>
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
                        {hotel.isCompleted ? "Edit Property" : "Add New Property"}
                      </h1>
                      <p className="text-blue-100 text-xs sm:text-sm mt-0.5 sm:mt-1">
                        {hotel.isCompleted
                          ? "Update your property details"
                          : "Fill out the details to list your property"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hotel and Room Details Sections */}
              <div className="w-full rounded-2xl border border-gray-100 shadow-lg bg-white overflow-hidden mb-6">
                {/* Hotel Details Card */}
                <Card className="rounded-2xl border border-gray-100 shadow-lg bg-white overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full">
                        <Building className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Hotel Details</h2>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                        <input
                          type="text"
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={hotel.name}
                          onChange={(e) => setHotel({ ...hotel, name: e.target.value })}
                          placeholder="Enter hotel name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                          value={hotel.description}
                          onChange={(e) => setHotel({ ...hotel, description: e.target.value })}
                          placeholder="Hotel description"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Star Rating</label>
                        <select
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={hotel.starRating}
                          onChange={(e) => setHotel({ ...hotel, starRating: e.target.value })}
                        >
                          <option value="">Select rating</option>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star.toString()}>
                              {star} Star{star > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
   <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                        <input
                          type="text"
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={hotel.averagePrice}
                          onChange={(e) => setHotel({ ...hotel, averagePrice: e.target.value })}
                          placeholder="Enter hotel name"
                        />
                      </div>
</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Additional Hotel Information */}
              <Card className="w-full rounded-2xl border border-gray-100 shadow-lg bg-white overflow-hidden mb-6">
                <div className="p-6">
                  {/* Steps Progress Bar */}
                  <div className="mb-6 sm:mb-8">
                    <div className="relative">
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] -translate-y-1/2"
                        style={{
                          width: `${(currentStep / maxSteps) * 100}%`,
                        }}
                      ></div>

                      <div className="flex justify-between relative px-2">
                        {steps.map((item) => {
                          const isActive = currentStep === item.step
                          const isCompleted = currentStep > item.step

                          return (
                            <div key={item.step} className="flex flex-col items-center z-10">
                              <div
                                className={cn(
                                  "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full mb-1 sm:mb-2 text-center transition-all cursor-pointer",
                                  isCompleted ? "bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white" : "",
                                  isActive ? "bg-white border-3 sm:border-4 border-blue-800 text-blue-900" : "",
                                  !isActive && !isCompleted ? "bg-gray-200 text-gray-400" : "",
                                  "shadow-md",
                                )}
                                onClick={() => isCompleted && setCurrentStep(item.step)}
                              >
                                <item.icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                              </div>
                              <span
                                className={cn(
                                  "text-[10px] xs:text-xs font-medium transition-colors text-center",
                                  isActive || isCompleted ? "text-blue-900" : "text-gray-500",
                                )}
                              >
                                {item.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="min-h-[300px]">
                    {currentStep === 1 && (
                      <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                          Basic Information
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                              Check-in Time
                            </label>
                            <input
                              type="time"
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={hotel.checkInTime}
                              onChange={(e) => setHotel({ ...hotel, checkInTime: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                              Check-out Time
                            </label>
                            <input
                              type="time"
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={hotel.checkOutTime}
                              onChange={(e) => setHotel({ ...hotel, checkOutTime: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                              Available From
                            </label>
                            <input
                              type="date"
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={hotel.availableFrom?.toISOString().split("T")[0] || ""}
                              onChange={(e) => setHotel({ ...hotel, availableFrom: new Date(e.target.value) })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                              Available To
                            </label>
                            <input
                              type="date"
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={hotel.availableTo?.toISOString().split("T")[0] || ""}
                              onChange={(e) => setHotel({ ...hotel, availableTo: new Date(e.target.value) })}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                          Location Selection
                        </h2>

                        {/* Interactive Map with Initial Address */}
                        <div className="mb-6">
                          <GoogleMapsLocationPicker
                            onLocationSelect={handleLocationSelect}
                            height="450px"
                            initialAddress={initialAddress}
                          />
                        </div>

                        {/* Read-only Address Fields */}
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Auto-filled Address Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Full Address</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 cursor-not-allowed"
                                  value={hotel.Address || ""}
                                  readOnly
                                  placeholder="Select location on map to auto-fill address"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 cursor-not-allowed"
                                  value={hotel.city || ""}
                                  readOnly
                                  placeholder="Auto-filled from map"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">State/Province</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 cursor-not-allowed"
                                  value={hotel.state || ""}
                                  readOnly
                                  placeholder="Auto-filled from map"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">ZIP/Postal Code</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 cursor-not-allowed"
                                  value={hotel.zipCode || ""}
                                  readOnly
                                  placeholder="Auto-filled from map"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 cursor-not-allowed"
                                  value={hotel.country || ""}
                                  readOnly
                                  placeholder="Auto-filled from map"
                                />
                              </div>
                            </div>
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-xs text-blue-700 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                These fields are automatically filled when you select a location on the map above.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Amenities</h2>
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                          {[
                            "wifi",
                            "parking",
                            "breakfast",
                            "pool",
                            "fitness",
                            "restaurant",
                            "bar",
                            "spa",
                            "room-service",
                          ].map((amenity) => (
                            <div key={amenity} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={amenity}
                                checked={hotel.amenities?.includes(amenity)}
                                onChange={(e) => {
                                  const isChecked = e.target.checked
                                  if (isChecked) {
                                    setHotel({
                                      ...hotel,
                                      amenities: [...(hotel.amenities || []), amenity],
                                    })
                                  } else {
                                    setHotel({
                                      ...hotel,
                                      amenities: hotel.amenities?.filter((a) => a !== amenity) || [],
                                    })
                                  }
                                }}
                                className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded"
                              />
                              <label htmlFor={amenity} className="text-xs sm:text-sm text-gray-700">
                                {amenity.charAt(0).toUpperCase() + amenity.slice(1).replace("-", " ")}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Images</h2>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center">
                          <ImageIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-2 sm:mb-3" />
                          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                            Drag & drop images here or click to browse
                          </p>
                          <input
                            type="file"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                          >
                            Select Images
                          </label>
                        </div>
            <div className="mt-3 sm:mt-4 space-y-6">

  {/* 🔹 Previous Images Section */}
  {hotel.images && hotel.images.length > 0 && (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Previous Images</h3>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
        {hotel.images.map((url, index) => (
          <div key={`existing-${index}`} className="relative">
            <img
              src={url}
              alt={`Existing ${index}`}
              className="w-full h-24 sm:h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => handleRemoveExistingImage(index)}
              className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-600 text-white rounded-full p-0.5 sm:p-1 hover:bg-red-700 text-xs sm:text-sm"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* 🔹 New Images Section */}
  {images.length > 0 && (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">New Uploaded Images</h3>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
        {images.map((image, index) => (
          <div key={`new-${index}`} className="relative">
            <img
              src={URL.createObjectURL(image)}
              alt={`New upload ${index}`}
              className="w-full h-24 sm:h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-600 text-white rounded-full p-0.5 sm:p-1 hover:bg-red-700 text-xs sm:text-sm"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  )}

</div>


                      </div>
                    )}

                    {currentStep === 5 && (
                      <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Tags</h2>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Tags</label>
                          <input
                            type="text"
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={(hotel.tags as string) || ""}
                            onChange={(e) => setHotel({ ...hotel, tags: e.target.value })}
                            placeholder="luxury, beachfront, family-friendly"
                          />
                          <p className="text-[10px] xs:text-xs text-gray-500 mt-1">Separate tags with commas</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                    <button
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                      className={`px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-50 transition-all ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Previous
                    </button>

                    {currentStep < maxSteps ? (
                      <button
                        onClick={handleNext}
                        className="px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white rounded-lg hover:shadow-md transition-all"
                      >
                        Next
                      </button>
                    ) : (
                      <div className="flex gap-2 sm:gap-3">
                        <button
                          onClick={() => {
                            onSavelater(hotel,images)
                          }}
                          className="px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm bg-white text-blue-700 border border-blue-500 rounded-lg hover:bg-blue-50 transition-all"
                        >
                          Save Draft
                        </button>
                        <button
                          onClick={() => onSaved(hotel,images)}
                          className="px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white rounded-lg hover:shadow-md transition-all"
                        >
                          Complete Registration
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <ToastContainer position="top-right" autoClose={3000} />
            </div>
          </div>
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}
