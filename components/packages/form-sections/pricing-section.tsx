"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { PackageFormData } from "../package-form"

interface PricingSectionProps {
  formData: PackageFormData
  updateFormData: (updates: Partial<PackageFormData>) => void
  errors?: Record<string, string>
  onFieldChange?: (fieldName: string) => void
}

const currencies = ["USD", "SAR", "PKR", "EUR", "GBP", "AED"]

export function PricingSection({ formData, updateFormData, errors = {}, onFieldChange }: PricingSectionProps) {
  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
    onFieldChange?.(field)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Package Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency *</Label>
            <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
              <SelectTrigger className={errors.currency ? "border-red-500 focus:border-red-500" : ""}>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.currency && <p className="text-sm text-red-500">{errors.currency}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
            <Label htmlFor="doubleSharingPrice">Single Sharing Price *</Label>
            <Input
              id="singlePricing"
              type="number"
              value={formData.singlePricing || ""}
              onChange={(e) => handleInputChange("singlePricing", Number.parseFloat(e.target.value) || 0)}
              placeholder="2500"
              className={errors.singlePricing ? "border-red-500 focus:border-red-500" : ""}
            />
            {errors.singlePricing && <p className="text-sm text-red-500">{errors.singlePricing}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="doubleSharingPrice">Double Sharing Price *</Label>
            <Input
              id="doubleSharingPrice"
              type="number"
              value={formData.doubleSharingPrice || ""}
              onChange={(e) => handleInputChange("doubleSharingPrice", Number.parseFloat(e.target.value) || 0)}
              placeholder="2500"
              className={errors.doubleSharingPrice ? "border-red-500 focus:border-red-500" : ""}
            />
            {errors.doubleSharingPrice && <p className="text-sm text-red-500">{errors.doubleSharingPrice}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tripleSharingPrice">Triple Sharing Price</Label>
            <Input
              id="tripleSharingPrice"
              type="number"
              value={formData.tripleSharingPrice || ""}
              onChange={(e) => handleInputChange("tripleSharingPrice", Number.parseFloat(e.target.value) || 0)}
              placeholder="2200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quadSharingPrice">Quad Sharing Price</Label>
            <Input
              id="quadSharingPrice"
              type="number"
              value={formData.quadSharingPrice || ""}
              onChange={(e) => handleInputChange("quadSharingPrice", Number.parseFloat(e.target.value) || 0)}
              placeholder="2000"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Discount & Offers</h3>
        <div className="flex items-center space-x-2">
          <Switch
            id="discountAvailable"
            checked={formData.discountAvailable}
            onCheckedChange={(checked) => handleInputChange("discountAvailable", checked)}
          />
          <Label htmlFor="discountAvailable">Discount Available</Label>
        </div>

        {formData.discountAvailable && (
          <div className="pl-6 border-l-2 border-emerald-200">
            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Discount Percentage</Label>
              <Input
                id="discountPercentage"
                type="number"
                max="100"
                min="0"
                value={formData.discountPercentage || ""}
                onChange={(e) => handleInputChange("discountPercentage", Number.parseFloat(e.target.value) || 0)}
                placeholder="10"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Terms & Policies</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms *</Label>
            <Textarea
              id="paymentTerms"
              value={formData.paymentTerms}
              onChange={(e) => handleInputChange("paymentTerms", e.target.value)}
              placeholder="e.g., 50% advance payment required, balance due 30 days before departure"
              rows={3}
              className={errors.paymentTerms ? "border-red-500 focus:border-red-500" : ""}
            />
            {errors.paymentTerms && <p className="text-sm text-red-500">{errors.paymentTerms}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancellationPolicy">Refund/Cancellation Policy *</Label>
            <Textarea
              id="cancellationPolicy"
              value={formData.cancellationPolicy}
              onChange={(e) => handleInputChange("cancellationPolicy", e.target.value)}
              placeholder="e.g., 90% refund if cancelled 60+ days before departure, 50% refund if cancelled 30-59 days before"
              rows={4}
              className={errors.cancellationPolicy ? "border-red-500 focus:border-red-500" : ""}
            />
            {errors.cancellationPolicy && <p className="text-sm text-red-500">{errors.cancellationPolicy}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
