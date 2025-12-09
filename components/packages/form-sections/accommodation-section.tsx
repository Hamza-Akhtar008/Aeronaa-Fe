"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { PackageFormData } from "../package-form"

interface AccommodationSectionProps {
  formData: PackageFormData
  updateFormData: (updates: Partial<PackageFormData>) => void
  errors?: Record<string, string>
  onFieldChange?: (fieldName: string) => void
}

const starRatings = [1, 2, 3, 4, 5]
const roomTypes = ["Single","Double", "Triple", "Quad sharing"]
const mealOptions = ["Breakfast", "Half-board", "Full-board", "Suhoor/Iftar"]

export function AccommodationSection({
  formData,
  updateFormData,
  errors = {},
  onFieldChange,
}: AccommodationSectionProps) {
  const handleRoomTypeToggle = (roomType: string, checked: boolean) => {
    const updatedTypes = checked
      ? [...formData.roomTypes, roomType]
      : formData.roomTypes.filter((type) => type !== roomType)
    updateFormData({ roomTypes: updatedTypes })
    onFieldChange?.("roomTypes")
  }

  const handleMealToggle = (meal: string, checked: boolean) => {
    const updatedMeals = checked ? [...formData.mealsIncluded, meal] : formData.mealsIncluded.filter((m) => m !== meal)
    updateFormData({ mealsIncluded: updatedMeals })
    onFieldChange?.("mealsIncluded")
  }

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
    onFieldChange?.(field)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Makkah Accommodation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="makkahHotelName">Hotel Name *</Label>
            <Input
              id="makkahHotelName"
              value={formData.makkahHotelName}
              onChange={(e) => handleInputChange("makkahHotelName", e.target.value)}
              placeholder="e.g., Hilton Suites Makkah"
              className={errors.makkahHotelName ? "border-red-500 focus:border-red-500" : ""}
            />
            {errors.makkahHotelName && <p className="text-sm text-red-500">{errors.makkahHotelName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="makkahHotelRating">Star Rating *</Label>
            <Select
              value={formData.makkahHotelRating.toString()}
              onValueChange={(value) => handleInputChange("makkahHotelRating", Number.parseInt(value))}
            >
              <SelectTrigger className={errors.makkahHotelRating ? "border-red-500 focus:border-red-500" : ""}>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {starRatings.map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating} Star{rating > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.makkahHotelRating && <p className="text-sm text-red-500">{errors.makkahHotelRating}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="makkahHotelDistance">Distance from Haram (meters) *</Label>
          <Input
            id="makkahHotelDistance"
            type="number"
            value={formData.makkahHotelDistance || ""}
            onChange={(e) => handleInputChange("makkahHotelDistance", Number.parseInt(e.target.value) || 0)}
            placeholder="e.g., 500"
            className={errors.makkahHotelDistance ? "border-red-500 focus:border-red-500" : ""}
          />
          {errors.makkahHotelDistance && <p className="text-sm text-red-500">{errors.makkahHotelDistance}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Madinah Accommodation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="madinahHotelName">Hotel Name *</Label>
            <Input
              id="madinahHotelName"
              value={formData.madinahHotelName}
              onChange={(e) => handleInputChange("madinahHotelName", e.target.value)}
              placeholder="e.g., Marriott Madinah"
              className={errors.madinahHotelName ? "border-red-500 focus:border-red-500" : ""}
            />
            {errors.madinahHotelName && <p className="text-sm text-red-500">{errors.madinahHotelName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="madinahHotelRating">Star Rating *</Label>
            <Select
              value={formData.madinahHotelRating.toString()}
              onValueChange={(value) => handleInputChange("madinahHotelRating", Number.parseInt(value))}
            >
              <SelectTrigger className={errors.madinahHotelRating ? "border-red-500 focus:border-red-500" : ""}>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {starRatings.map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating} Star{rating > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.madinahHotelRating && <p className="text-sm text-red-500">{errors.madinahHotelRating}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="madinahHotelDistance">Distance from Masjid Nabawi (meters) *</Label>
          <Input
            id="madinahHotelDistance"
            type="number"
            value={formData.madinahHotelDistance || ""}
            onChange={(e) => handleInputChange("madinahHotelDistance", Number.parseInt(e.target.value) || 0)}
            placeholder="e.g., 300"
            className={errors.madinahHotelDistance ? "border-red-500 focus:border-red-500" : ""}
          />
          {errors.madinahHotelDistance && <p className="text-sm text-red-500">{errors.madinahHotelDistance}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Room & Meal Options</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Room Types *</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {roomTypes.map((roomType) => (
                <div key={roomType} className="flex items-center space-x-2">
                  <Checkbox
                    id={roomType}
                    checked={formData.roomTypes.includes(roomType)}
                    onCheckedChange={(checked) => handleRoomTypeToggle(roomType, checked as boolean)}
                  />
                  <Label htmlFor={roomType} className="text-sm font-normal">
                    {roomType}
                  </Label>
                </div>
              ))}
            </div>
            {errors.roomTypes && <p className="text-sm text-red-500">{errors.roomTypes}</p>}
          </div>

          <div className="space-y-2">
            <Label>Meals Included *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {mealOptions.map((meal) => (
                <div key={meal} className="flex items-center space-x-2">
                  <Checkbox
                    id={meal}
                    checked={formData.mealsIncluded.includes(meal)}
                    onCheckedChange={(checked) => handleMealToggle(meal, checked as boolean)}
                  />
                  <Label htmlFor={meal} className="text-sm font-normal">
                    {meal}
                  </Label>
                </div>
              ))}
            </div>
            {errors.mealsIncluded && <p className="text-sm text-red-500">{errors.mealsIncluded}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
