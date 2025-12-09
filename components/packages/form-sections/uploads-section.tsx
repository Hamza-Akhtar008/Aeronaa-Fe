"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, X, FileImage } from "lucide-react"

import Image from "next/image"
import { PackageFormData } from "../package-form"
interface PackageState {
  coverImage: string
  hotelImages: string[]
}
interface UploadsSectionProps {
  formData: PackageFormData
  updateFormData: (updates: Partial<PackageFormData>) => void
  errors?: Record<string, string>
  onFieldChange?: (fieldName: string) => void
  Package?: {
    coverImage?: string
    hotelImages?: string[]
  }
  setPackage: React.Dispatch<React.SetStateAction<PackageState>>
}

export function UploadsSection({ formData, updateFormData, errors = {}, onFieldChange, Package,setPackage }: UploadsSectionProps) {
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    updateFormData({ coverImage: file })
    onFieldChange?.("coverImage")
  }

  const handleHotelImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    updateFormData({ hotelImages: [...formData.hotelImages, ...files] })
    onFieldChange?.("hotelImages")
  }

  const removeCoverImage = () => {
    updateFormData({ coverImage: null })
    onFieldChange?.("coverImage")
  }

  const removeHotelImage = (index: number) => {
    const updatedImages = formData.hotelImages.filter((_, i) => i !== index)
    updateFormData({ hotelImages: updatedImages })
    onFieldChange?.("hotelImages")
  }
const removeExistingHotelImage = (imageUrl: string) => {
  setPackage((prev) => ({
    ...prev,
    hotelImages: prev.hotelImages.filter((img) => img !== imageUrl),
  }));
};

  const removeExistingCoverImage = () => {
    
    setPackage({
      hotelImages:Package?.hotelImages||[],
      coverImage:""

    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Package Images</h3>

        <div className="space-y-4">
          {/* Cover Image Section */}
          <div className="space-y-2">
            <Label htmlFor="coverImage">Package Cover Image *</Label>

            {Package?.coverImage && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Cover Image:</p>
                <div className="relative inline-block">
                  <Image
                    src={Package.coverImage || "/placeholder.svg"}
                    alt="Current cover image"
                    width={200}
                    height={150}
                    className="rounded-lg object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeExistingCoverImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-lg p-6 ${
                errors.coverImage ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            >
              {formData.coverImage ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileImage className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">{formData.coverImage.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeCoverImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="coverImage" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Upload cover image
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">PNG, JPG up to 10MB</span>
                    </Label>
                    <Input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>
            {errors.coverImage && <p className="text-sm text-red-500">{errors.coverImage}</p>}
          </div>

          {/* Hotel Images Section */}
          <div className="space-y-2">
            <Label htmlFor="hotelImages">Hotel Images</Label>

            {Package?.hotelImages && Package.hotelImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Hotel Images:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Package.hotelImages.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={`Hotel image ${index + 1}`}
                        width={150}
                        height={100}
                        className="rounded-lg object-cover w-full h-24"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeExistingHotelImage(imageUrl)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-lg p-6 ${
                errors.hotelImages ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="hotelImages" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Upload hotel images
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      Multiple images allowed, PNG, JPG up to 10MB each
                    </span>
                  </Label>
                  <Input
                    id="hotelImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleHotelImagesChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
            {errors.hotelImages && <p className="text-sm text-red-500">{errors.hotelImages}</p>}

            {formData.hotelImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">New Images to Upload:</p>
                <div className="space-y-2">
                  {formData.hotelImages.map((file:any, index:any) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <FileImage className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeHotelImage(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
