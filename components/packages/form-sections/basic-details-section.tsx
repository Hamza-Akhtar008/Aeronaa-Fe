"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { PackageFormData } from "../package-form"

interface BasicDetailsSectionProps {
  formData: PackageFormData
  updateFormData: (updates: Partial<PackageFormData>) => void
  errors?: Record<string, string>
  onFieldChange?: (fieldName: string) => void
}

const packageTypes = ["Economy", "Standard", "Luxury", "VIP"]
const seasons = ["Regular", "Ramadan", "Off-Peak"]
const cities = ["Makkah", "Madinah", "Jeddah", "Taif", "Riyadh"]

export function BasicDetailsSection({
  formData,
  updateFormData,
  errors = {},
  onFieldChange,
}: BasicDetailsSectionProps) {
  const handleCityToggle = (city: string, checked: boolean) => {
    const updatedCities = checked ? [...formData.citiesCovered, city] : formData.citiesCovered.filter((c) => c !== city)
    updateFormData({ citiesCovered: updatedCities })
    onFieldChange?.("citiesCovered")
  }

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
    onFieldChange?.(field)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="packageName">Package Name *</Label>
          <Input
            id="packageName"
            value={formData.packageName}
            onChange={(e) => handleInputChange("packageName", e.target.value)}
            placeholder="e.g., 14 Days Luxury Umrah Package"
            className={errors.packageName ? "border-red-500 focus:border-red-500" : ""}
          />
          {errors.packageName && <p className="text-sm text-red-500">{errors.packageName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="packageCode">Package Code / ID</Label>
          <Input
            id="packageCode"
            value={formData.packageCode}
            onChange={(e) => handleInputChange("packageCode", e.target.value)}
            placeholder="e.g., UMR-LUX-001"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="packageType">Package Type *</Label>
          <Select value={formData.packageType} onValueChange={(value) => handleInputChange("packageType", value)}>
            <SelectTrigger className={errors.packageType ? "border-red-500 focus:border-red-500" : ""}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {packageTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.packageType && <p className="text-sm text-red-500">{errors.packageType}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (Days/Nights) *</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration || ""}
            onChange={(e) => handleInputChange("duration", Number.parseInt(e.target.value) || 0)}
            placeholder="14"
            className={errors.duration ? "border-red-500 focus:border-red-500" : ""}
          />
          {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
        </div>
        {/* <div className="space-y-2">
          <Label htmlFor="season">Season *</Label>
          <Select value={formData.season} onValueChange={(value) => handleInputChange("season", value)}>
            <SelectTrigger className={errors.season ? "border-red-500 focus:border-red-500" : ""}>
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season} value={season}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.season && <p className="text-sm text-red-500">{errors.season}</p>}
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className={errors.startDate ? "border-red-500 focus:border-red-500" : ""}
          />
          {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            className={errors.endDate ? "border-red-500 focus:border-red-500" : ""}
          />
          {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Cities Covered *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cities.map((city) => (
            <div key={city} className="flex items-center space-x-2">
              <Checkbox
                id={city}
                checked={formData.citiesCovered.includes(city)}
                onCheckedChange={(checked) => handleCityToggle(city, checked as boolean)}
              />
              <Label htmlFor={city} className="text-sm font-normal">
                {city}
              </Label>
            </div>
          ))}
        </div>
        {errors.citiesCovered && <p className="text-sm text-red-500">{errors.citiesCovered}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description *</Label>
        <Textarea
          id="shortDescription"
          value={formData.shortDescription}
          onChange={(e) => handleInputChange("shortDescription", e.target.value)}
          placeholder="Brief description of the package (max 200 characters)"
          maxLength={200}
          rows={3}
          className={errors.shortDescription ? "border-red-500 focus:border-red-500" : ""}
        />
        <p className="text-xs text-gray-500">{formData.shortDescription.length}/200 characters</p>
        {errors.shortDescription && <p className="text-sm text-red-500">{errors.shortDescription}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullDescription">Full Description *</Label>
        <Textarea
          id="fullDescription"
          value={formData.fullDescription}
          onChange={(e) => handleInputChange("fullDescription", e.target.value)}
          placeholder="Detailed description of the package, including highlights and what's included"
          rows={6}
          className={errors.fullDescription ? "border-red-500 focus:border-red-500" : ""}
        />
        {errors.fullDescription && <p className="text-sm text-red-500">{errors.fullDescription}</p>}
      </div>
    </div>
  )
}
