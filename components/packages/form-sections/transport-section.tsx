"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PackageFormData } from "../package-form"

interface TransportSectionProps {
  formData: PackageFormData
  updateFormData: (updates: Partial<PackageFormData>) => void
  errors?: Record<string, string>
  onFieldChange?: (fieldName: string) => void
}

export function TransportSection({ formData, updateFormData, errors = {}, onFieldChange }: TransportSectionProps) {
  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
    onFieldChange?.(field)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Transport Details</h3>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="flightIncluded"
          checked={formData.flightIncluded}
          onCheckedChange={(checked) => handleInputChange("flightIncluded", !!checked)}
        />
        <Label htmlFor="flightIncluded">Flight Included</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="airportTransfers"
          checked={formData.airportTransfers}
          onCheckedChange={(checked) => handleInputChange("airportTransfers", !!checked)}
        />
        <Label htmlFor="airportTransfers">Airport Transfers Included</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="intercityTransport">Intercity Transport</Label>
        <Select
          value={formData.intercityTransport}
          onValueChange={(value) => handleInputChange("intercityTransport", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select transport type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bus">Bus</SelectItem>
            <SelectItem value="private-car">Private Car</SelectItem>
            <SelectItem value="shared-taxi">Shared Taxi</SelectItem>
            <SelectItem value="train">Train</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="ziyaratTours"
          checked={formData.ziyaratTours}
          onCheckedChange={(checked) => handleInputChange("ziyaratTours", !!checked)}
        />
        <Label htmlFor="ziyaratTours">Ziyarat Tours Included</Label>
      </div>

      {formData.ziyaratTours && (
        <div className="space-y-2">
          <Label htmlFor="ziyaratLocations">Ziyarat Locations</Label>
          <Input
            id="ziyaratLocations"
            value={formData.ziyaratLocations.join(", ")}
            onChange={(e) => handleInputChange("ziyaratLocations", e.target.value.split(", ").filter(Boolean))}
            placeholder="e.g., Jabal Uhud, Quba Mosque, Mount Hira"
          />
        </div>
      )}
    </div>
  )
}
