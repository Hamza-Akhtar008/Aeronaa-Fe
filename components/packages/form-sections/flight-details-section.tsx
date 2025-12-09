"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plane, Calendar, MapPin } from "lucide-react"
import AsyncSelect from "react-select/async"
import { debouncedFetchMunicipalities, debouncedFetchAirports } from "@/components/ticket-form"
import type { PackageFormData } from "../package-form"


interface FlightDetailsSectionProps {
  formData: PackageFormData
  updateFormData: (updates: Partial<PackageFormData>) => void
  errors?: Record<string, string>
  onFieldChange?: (fieldName: string) => void
}

export function FlightDetailsSection({
  formData,
  updateFormData,
  errors = {},
  onFieldChange,
}: FlightDetailsSectionProps) {
  // Watch city values to control airport selection
  const [departureCity, setDepartureCity] = useState(formData.departureCity);
  const [arrivalCity, setArrivalCity] = useState(formData.arrivalCity);

  // Update local state when form data changes
  useEffect(() => {
    setDepartureCity(formData.departureCity);
  }, [formData.departureCity]);

  useEffect(() => {
    setArrivalCity(formData.arrivalCity);
  }, [formData.arrivalCity]);

  // Reset airport fields when cities change
  useEffect(() => {
    if (departureCity) {
      updateFormData({ fromAirport: "" });
    }
  }, [departureCity]);

  useEffect(() => {
    if (arrivalCity) {
      updateFormData({ toAirport: "" });
    }
  }, [arrivalCity]);

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
    onFieldChange?.(field)
  }

  // Only show this section if flights are included
  if (!formData.flightIncluded) {
    return (
      <div className="text-center py-8">
        <Plane className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Flight Details</h3>
        <p className="text-gray-500">Enable "Flight Included" in the Transport section to configure flight details.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Plane className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Flight Details</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="flightTentativeDate">
            <Calendar className="inline h-4 w-4 mr-1" />
            Tentative Departure Date *
          </Label>
          <Input
            id="flightTentativeDate"
            type="date"
            value={formData.flightTentativeDate}
            onChange={(e) => handleInputChange("flightTentativeDate", e.target.value)}
            className={`w-full ${errors.flightTentativeDate ? "border-red-500 focus:border-red-500" : ""}`}
          />
          {errors.flightTentativeDate && <p className="text-sm text-red-500">{errors.flightTentativeDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="returnFlightDate">
            <Calendar className="inline h-4 w-4 mr-1" />
            Tentative Return Date *
          </Label>
          <Input
            id="returnFlightDate"
            type="date"
            value={formData.returnFlightDate}
            onChange={(e) => handleInputChange("returnFlightDate", e.target.value)}
            className={`w-full ${errors.returnFlightDate ? "border-red-500 focus:border-red-500" : ""}`}
          />
          {errors.returnFlightDate && <p className="text-sm text-red-500">{errors.returnFlightDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="airlineName">
            <Plane className="inline h-4 w-4 mr-1" />
            Airline Name *
          </Label>
          <Input
            id="airlineName"
            type="text"
            placeholder="e.g., Emirates, Saudi Airlines, Qatar Airways"
            value={formData.airlineName}
            onChange={(e) => handleInputChange("airlineName", e.target.value)}
            className={`w-full ${errors.airlineName ? "border-red-500 focus:border-red-500" : ""}`}
          />
          {errors.airlineName && <p className="text-sm text-red-500">{errors.airlineName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="flightClass">Flight Class *</Label>
          <Select value={formData.flightClass} onValueChange={(value) => handleInputChange("flightClass", value)}>
            <SelectTrigger className={errors.flightClass ? "border-red-500 focus:border-red-500" : ""}>
              <SelectValue placeholder="Select flight class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="premium-economy">Premium Economy</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="first">First Class</SelectItem>
            </SelectContent>
          </Select>
          {errors.flightClass && <p className="text-sm text-red-500">{errors.flightClass}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="routeType">
            <MapPin className="inline h-4 w-4 mr-1" />
            Route Type *
          </Label>
          <Select value={formData.routeType} onValueChange={(value) => handleInputChange("routeType", value)}>
            <SelectTrigger className={errors.routeType ? "border-red-500 focus:border-red-500" : ""}>
              <SelectValue placeholder="Select route type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">Direct Flight</SelectItem>
              <SelectItem value="via">Via Connection</SelectItem>
              {/* <SelectItem value="multiple">Multiple Stops</SelectItem> */}
            </SelectContent>
          </Select>
          {errors.routeType && <p className="text-sm text-red-500">{errors.routeType}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="departureCity">Departure City (Search) *</Label>
          <AsyncSelect
            id="departureCity"
            cacheOptions
            defaultOptions
            loadOptions={debouncedFetchMunicipalities}
            value={formData.departureCity ? { label: formData.departureCity, value: formData.departureCity } : null}
            onChange={(option: any) => handleInputChange("departureCity", option?.value || "")}
            placeholder="Search departure city..."
            className="react-select-container"
            classNamePrefix="react-select"
            isClearable
          />
          {errors.departureCity && <p className="text-sm text-red-500">{errors.departureCity}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fromAirport">Departure Airport *</Label>
          <AsyncSelect
            id="fromAirport"
            cacheOptions
            defaultOptions={false}
            loadOptions={(query) => debouncedFetchAirports(query, departureCity)}
            value={formData.fromAirport ? { label: formData.fromAirport, value: formData.fromAirport } : null}
            onChange={(option: any) => handleInputChange("fromAirport", option?.value || "")}
            placeholder={departureCity ? "Search departure airport..." : "Select departure city first"}
            className="react-select-container"
            classNamePrefix="react-select"
            isClearable
            isDisabled={!departureCity}
            noOptionsMessage={() =>
              departureCity ? "No airports found" : "Please select departure city first"
            }
          />
          {errors.fromAirport && <p className="text-sm text-red-500">{errors.fromAirport}</p>}
          {departureCity && <p className="text-xs text-gray-500 mt-1">Showing airports in {departureCity}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="arrivalCity">Arrival City (Search) *</Label>
          <AsyncSelect
            id="arrivalCity"
            cacheOptions
            defaultOptions
            loadOptions={debouncedFetchMunicipalities}
            value={formData.arrivalCity ? { label: formData.arrivalCity, value: formData.arrivalCity } : null}
            onChange={(option: any) => handleInputChange("arrivalCity", option?.value || "")}
            placeholder="Search arrival city..."
            className="react-select-container"
            classNamePrefix="react-select"
            isClearable
          />
          {errors.arrivalCity && <p className="text-sm text-red-500">{errors.arrivalCity}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="toAirport">Arrival Airport *</Label>
          <AsyncSelect
            id="toAirport"
            cacheOptions
            defaultOptions={false}
            loadOptions={(query) => debouncedFetchAirports(query, arrivalCity)}
            value={formData.toAirport ? { label: formData.toAirport, value: formData.toAirport } : null}
            onChange={(option: any) => handleInputChange("toAirport", option?.value || "")}
            placeholder={arrivalCity ? "Search arrival airport..." : "Select arrival city first"}
            className="react-select-container"
            classNamePrefix="react-select"
            isClearable
            isDisabled={!arrivalCity}
            noOptionsMessage={() =>
              arrivalCity ? "No airports found" : "Please select arrival city first"
            }
          />
          {errors.toAirport && <p className="text-sm text-red-500">{errors.toAirport}</p>}
          {arrivalCity && <p className="text-xs text-gray-500 mt-1">Showing airports in {arrivalCity}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="flightDuration">Estimated Flight Duration *</Label>
          <Input
            id="flightDuration"
            type="text"
            placeholder="e.g., 8 hours, 12h 30m"
            value={formData.flightDuration}
            onChange={(e) => handleInputChange("flightDuration", e.target.value)}
            className={`w-full ${errors.flightDuration ? "border-red-500 focus:border-red-500" : ""}`}
          />
          {errors.flightDuration && <p className="text-sm text-red-500">{errors.flightDuration}</p>}
        </div>

        {formData.routeType === "via" && (
          <div className="space-y-2">
            <Label htmlFor="viaCity">Via City (Connection) *</Label>
            <Input
              id="viaCity"
              type="text"
              placeholder="e.g., Dubai, Doha, Istanbul"
              value={formData.viaCity}
              onChange={(e) => handleInputChange("viaCity", e.target.value)}
              className={`w-full ${errors.viaCity ? "border-red-500 focus:border-red-500" : ""}`}
            />
            {errors.viaCity && <p className="text-sm text-red-500">{errors.viaCity}</p>}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="flightNotes">Flight Notes *</Label>
        <Textarea
          id="flightNotes"
          placeholder="Additional flight information, baggage allowance, special requirements, etc."
          value={formData.flightNotes}
          onChange={(e) => handleInputChange("flightNotes", e.target.value)}
          className={`w-full min-h-[80px] ${errors.flightNotes ? "border-red-500 focus:border-red-500" : ""}`}
        />
        {errors.flightNotes && <p className="text-sm text-red-500">{errors.flightNotes}</p>}
      </div>
    </div>
  )
}
