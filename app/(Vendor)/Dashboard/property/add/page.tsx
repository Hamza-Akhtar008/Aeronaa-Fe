"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Building, ImageIcon, MapPin, Tag } from "lucide-react"
import Link from "next/link"
import { RegisterHotel, setHoteltoComplete } from "@/lib/api"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { cn } from "@/lib/utils/utils"
import { GoogleMapsLocationPicker } from "@/components/google-maps-location-picker"

interface LocationData {
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  lat: number
  lng: number
}

export default function AddPropertyPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("hotel-details")
  const [hotelId, setHotelId] = useState<string | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [Loading, setLoading] = useState<boolean>(false)
  const [hotel, setHotel] = useState<Hotel>({
    id: "",
    name: "",
    description: "",
    Address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    starRating: "",
    checkInTime: "",
    averagePrice:"",
    checkOutTime: "",
    availableFrom: new Date(),
    availableTo: new Date(),
    amenities: [],
    images: [],
    tags: "",
    isCompleted: 0,
  
    
  })

  const HandleSaveforlater = async (hotel: Hotel) => {
    try {
      setLoading(true)
      console.log("CHECK isHotelEmpty(hotel) : ", isHotelEmpty(hotel))
      if (!isHotelEmpty(hotel)) {
        if (hotel.name == "") {
          toast.error("Hotel Name is Required")
          return
        }
        if (hotel.description == "") {
          toast.error("Hotel Description is Required")
          return
        }
        if (hotel.starRating == "") {
          toast.error("Hotel Star Rating is Required")
          return
        }
        if (hotel.checkInTime == "") {
          toast.error("Hotel Check-in Time is Required")
          return
        }
        if (hotel.checkOutTime == "") {
          toast.error("Hotel Check-out Time is Required")
          return
        }
        const isCompleted = false
        await RegisterHotel(hotel, isCompleted, images)
        toast.success("Hotel Details Save for Later Edit")
        setTimeout(() => {
          router.push(`/Dashboard`)
        }, 500)
      } else {
        toast.error("Please Submit Form is Completely Fill")
      }
    } catch (error: any) {
      toast.error("Hotel Details Creation Failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleHotelSaved = async (hotel: Hotel) => {
    try {
      if (isHotelEmpty(hotel)) {
        setLoading(true)
        const response = await RegisterHotel(hotel, true, images)
        toast.success("Hotel details created successfully.")
    await setHoteltoComplete(response.id);
        setLoading(false)
        setTimeout(() => {
          router.push(`/Dashboard`)
        }, 500)
      } else {
        toast.error("Please fill all required hotel details before saving.")
      }
    } catch (error: any) {
      toast.error("Failed to create hotel details. Please try again.")
    } finally {
      setLoading(false)
    }
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
      averagePrice,
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
    console.log("cleanedTags : ", cleanedTags)
    return (
      name !== "" &&
      description !== "" &&
      Address !== "" &&
      city !== "" &&
      state !== "" &&
      zipCode !== "" &&
      averagePrice!=""&&
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

  const [currentStep, setCurrentStep] = useState(1)
  const maxSteps = 5

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setImages((prev) => [...prev, ...newImages])

      // Update hotel state with images
      setHotel((prevHotel) => ({
        ...prevHotel,
        images: [...(prevHotel.images || []), ...newImages],
      }))
    }
  }

  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))

    // Update hotel state by removing the image
    setHotel((prevHotel) => ({
      ...prevHotel,
      images: (prevHotel.images || []).filter((_, i) => i !== index),
    }))
  }

  // Handle location selection from map
  const handleLocationSelect = (location: LocationData) => {
    setHotel((prevHotel) => ({
      ...prevHotel,
      Address: location.address,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode || "N/A", // Default to "N/A" if zipCode is empty
      country: location.country,
    }))
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#f8fafc] to-[#f1f5f9] py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#023e8a] to-[#00b4d8] shadow-xl relative overflow-hidden">
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

            <div className="flex items-center gap-3">
              <Link href="/Dashboard" className="text-white hover:text-blue-200 transition-all hover:scale-110">
                <div className="bg-white/10 rounded-full p-2 backdrop-blur-sm">
                  <ArrowLeft className="h-5 w-5" />
                </div>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Add New Property</h1>
                <p className="text-blue-100 text-sm mt-1">Fill out the details to list your property</p>
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
 <div>
                   <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Average Price $</label>
                  <input
                    type="text"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={hotel.averagePrice}
                    onChange={(e) => setHotel({ ...hotel, averagePrice: e.target.value })}
                    placeholder="Enter Average Price"
                  />
                
                </div>


              </div>
            </div>
          </Card>
        </div>

        {/* Additional Hotel Information */}
        <Card className="w-full rounded-2xl border border-gray-100 shadow-lg bg-white overflow-hidden mb-6">
          <div className="p-6">
            {/* Steps Progress Bar */}
            <div className="mb-8">
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
                            "flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full mb-2 text-center transition-all cursor-pointer",
                            isCompleted ? "bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white" : "",
                            isActive ? "bg-white border-4 border-blue-800 text-blue-900" : "",
                            !isActive && !isCompleted ? "bg-gray-200 text-gray-400" : "",
                            "shadow-md",
                          )}
                          onClick={() => isCompleted && setCurrentStep(item.step)}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span
                          className={cn(
                            "text-xs font-medium transition-colors text-center",
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
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={hotel.checkInTime}
                        onChange={(e) => setHotel({ ...hotel, checkInTime: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={hotel.checkOutTime}
                        onChange={(e) => setHotel({ ...hotel, checkOutTime: e.target.value })}
                      />
                    </div>
                   <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
  <input
    type="date"
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={hotel.availableFrom?.toISOString().split("T")[0] || ""}
    onChange={(e) => {
      const newDate = new Date(e.target.value);
      if (!isNaN(newDate.getTime())) { // Check if it's a valid date
        setHotel({ ...hotel, availableFrom: newDate });
      } else {
        // Handle invalid date (optional: show error message)
        console.error('Invalid date');
      }
    }}
  />
</div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Available To</label>
  <input
    type="date"
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={hotel.availableTo?.toISOString().split("T")[0] || ""}
    onChange={(e) => {
      const newDate = new Date(e.target.value);
      if (!isNaN(newDate.getTime())) { // Check if it's a valid date
        setHotel({ ...hotel, availableTo: newDate });
      } else {
        // Handle invalid date (optional: show error message)
        console.error('Invalid date');
      }
    }}
  />
</div>

                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Location Selection</h2>

                  {/* Interactive Map */}
                  <div className="mb-6">
                    <GoogleMapsLocationPicker onLocationSelect={handleLocationSelect} height="450px" />
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
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label htmlFor={amenity} className="text-sm text-gray-700">
                          {amenity.charAt(0).toUpperCase() + amenity.slice(1).replace("-", " ")}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Images</h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-600 mb-4">Drag & drop images here or click to browse</p>
                    <input type="file" multiple onChange={handleImageUpload} className="hidden" id="image-upload" />
                    <label
                      htmlFor="image-upload"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Select Images
                    </label>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Uploaded ${index}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Tags</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={(hotel.tags as string) || ""}
                      onChange={(e) => setHotel({ ...hotel, tags: e.target.value })}
                      placeholder="luxury, beachfront, family-friendly"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-2 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-50 transition-all ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Previous
              </button>

              {currentStep < maxSteps ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white rounded-lg hover:shadow-md transition-all"
                >
                  Next
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => HandleSaveforlater(hotel)}
                    disabled={Loading}
                    className={`px-6 py-2 bg-white text-blue-700 border border-blue-500 rounded-lg hover:bg-blue-50 transition-all ${Loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {Loading ? "Saving..." : "Save Draft"}
                  </button>
                  <button
                    onClick={() => handleHotelSaved(hotel)}
                    disabled={Loading}
                    className={`px-6 py-2 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white rounded-lg hover:shadow-md transition-all ${Loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {Loading ? "Completing..." : "Complete Registration"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>

        <ToastContainer position="bottom-right" autoClose={3000} />
        {/* Loading Overlay */}
        {Loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
              <div className="text-center">
                {/* Animated Spinner */}
                <div className="relative mx-auto mb-4">
                  <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>

                {/* Loading Text */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Uploading Property Details</h3>
                <p className="text-sm text-gray-600 mb-4">Please wait while we save your hotel information...</p>

                {/* Progress Dots */}
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
