"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { PackageFormData } from "../package-form"

interface AdditionalInfoSectionProps {
  formData: PackageFormData
  updateFormData: (updates: Partial<PackageFormData>) => void
  errors?: Record<string, string>
  onFieldChange?: (fieldName: string) => void
}

const extraOptions = [
  "SIM card",
  "Zamzam water",
  "Welcome Kit",
  "Prayer mat",
  "Ihram clothing",
  "Travel insurance",
  "24/7 support hotline",
  "Group coordinator",
]

export function AdditionalInfoSection({
  formData,
  updateFormData,
  errors = {},
  onFieldChange,
}: AdditionalInfoSectionProps) {
  const handleExtraToggle = (extra: string, checked: boolean) => {
    const updatedExtras = checked
      ? [...formData.includedExtras, extra]
      : formData.includedExtras.filter((e) => e !== extra)
    updateFormData({ includedExtras: updatedExtras })
    onFieldChange?.("includedExtras")
  }

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
    onFieldChange?.(field)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Included Extras</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {extraOptions.map((extra) => (
            <div key={extra} className="flex items-center space-x-2">
              <Checkbox
                id={extra}
                checked={formData.includedExtras.includes(extra)}
                onCheckedChange={(checked) => handleExtraToggle(extra, checked as boolean)}
              />
              <Label htmlFor={extra} className="text-sm font-normal">
                {extra}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="specialNeedsSupport">Special Needs Support</Label>
            <Textarea
              id="specialNeedsSupport"
              value={formData.specialNeedsSupport}
              onChange={(e) => handleInputChange("specialNeedsSupport", e.target.value)}
              placeholder="Describe any special accommodations available (wheelchair access, dietary requirements, medical assistance, etc.)"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendorNotes">Vendor Notes</Label>
            <Textarea
              id="vendorNotes"
              value={formData.vendorNotes}
              onChange={(e) => handleInputChange("vendorNotes", e.target.value)}
              placeholder="Internal notes or additional information for your reference"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
