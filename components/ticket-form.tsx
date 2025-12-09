"use client"

import { useState, useMemo, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plane, DollarSign, Shield, Package, CheckCircle } from "lucide-react"
import AsyncSelect from "react-select/async"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { FlightFormData } from "@/types/checkout"
import { PostFlight, UpdateFlight } from "@/lib/flight_api"

// Async search logic
export const searchCache = new Map<string, Promise<any[]>>()
export const searchCacheCity = new Map<string, Promise<any[]>>()

export const debouncedFetchMunicipalities = (() => {
  let timeout: NodeJS.Timeout
  let controller: AbortController | null = null

  return async (query: string) => {
    if (!query || query.length < 2) return []

    const key = query.toLowerCase()
    if (searchCacheCity.has(key)) return searchCacheCity.get(key)!

    if (timeout) clearTimeout(timeout)
    if (controller) controller.abort()
    controller = new AbortController()

    const searchPromise = new Promise<any[]>((resolve) => {
      timeout = setTimeout(async () => {
        try {
          const res = await fetch(`/api/airports?query=${encodeURIComponent(query)}`, {
            signal: controller!.signal,
          })
          const data = await res.json()
          const uniqueMunicipalities = Array.from(new Set(data.map((airport: any) => airport.municipality))).map(
            (municipality) => ({
              label: municipality,
              value: municipality,
            }),
          )
          resolve(uniqueMunicipalities)
        } catch (err) {
          if ((err as Error).name !== "AbortError") console.error(err)
          resolve([])
        }
      }, 300)
    })

    searchCacheCity.set(key, searchPromise)
    setTimeout(() => searchCacheCity.delete(key), 5 * 60 * 1000)
    return searchPromise
  }
})()

export const debouncedFetchAirports = (() => {
  let timeout: NodeJS.Timeout
  let controller: AbortController | null = null

  return async (query: string, city?: string) => {
    if (!query || query.length < 2) return []
    if (!city) return []

    const key = `${query.toLowerCase()}-${city.toLowerCase()}`
    if (searchCache.has(key)) return searchCache.get(key)!

    if (timeout) clearTimeout(timeout)
    if (controller) controller.abort()
    controller = new AbortController()

    const searchPromise = new Promise<any[]>((resolve) => {
      timeout = setTimeout(async () => {
        try {
          const res = await fetch(`/api/airports?query=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`, {
            signal: controller!.signal,
          })
          const data = await res.json()
          const filteredAirports = data.filter(
            (airport: any) => airport.municipality && airport.municipality.toLowerCase() === city.toLowerCase(),
          )
          resolve(
            filteredAirports.map((airport: any) => ({
              label: `${airport.name || airport.ident} (${airport.iata_code || airport.local_code})`,
              value: airport.name,
            })),
          )
        } catch (err) {
          if ((err as Error).name !== "AbortError") console.error(err)
          resolve([])
        }
      }, 300)
    })

    searchCache.set(key, searchPromise)
    setTimeout(() => searchCache.delete(key), 5 * 60 * 1000)
    return searchPromise
  }
})()

const flightFormSchema = z
  .object({
    tripType: z.enum(["one-way", "round-trip"], {
      required_error: "Please select trip type",
    }),
    from: z.string().min(1, "Departure city is required"),
    to: z.string().min(1, "Arrival city is required"),
    departureDate: z.string().min(1, "Departure date is required"),
    returnDate: z.string().optional(),
    arrivalDate: z.string().min(1, "Arrival date is required"),
    flightClass: z.enum(["economy", "business", "first"], {
      required_error: "Please select flight class",
    }),
    flightNumber: z.string().min(2, "Flight number is required"),
    departureAirport: z.string().min(1, "Departure airport is required"),
    arrivalAirport: z.string().min(1, "Arrival airport is required"),
    departureTime: z.string().min(1, "Departure time is required"),
    arrivalTime: z.string().min(1, "Arrival time is required"),
    airline: z.string().min(2, "Airline name is required"),
    basePrice: z.coerce.number().min(0.01, "Base price must be at least $0.01"),
    taxPrice: z.coerce.number().min(0, "Taxes must be positive"),
    currency: z.enum(["USD"], {
      required_error: "Please select a currency",
    }),
    cancellationAllowedUntil: z.string().min(1, "Cancellation deadline is required"),
    isRefundable: z.boolean().default(false),
    cancellationPenalty: z.coerce.number().min(0, "Cancellation penalty must be positive"),
    voidableUntil: z.string().min(1, "Voidable until date is required"),
    passengerType: z.enum(["adult", "child", "infant"], {
      required_error: "Please select passenger type",
    }),
    passportRequired: z.boolean().default(false),
    seatSelectionAllowed: z.boolean().default(false),
    recheckBagsRequired: z.boolean().default(false),
    checkedBaggage: z.string().min(1, "Checked baggage info is required"),
    cabinBaggage: z.string().min(1, "Cabin baggage info is required"),
  })
  .superRefine((data, ctx) => {
    if (data.tripType === "round-trip" && !data.returnDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Return date is required for round trips",
        path: ["returnDate"],
      })
    }

    if (data.from && data.to && data.from === data.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Departure and arrival cities must be different",
        path: ["to"],
      })
    }

    if (data.departureAirport && data.arrivalAirport && data.departureAirport === data.arrivalAirport) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Departure and arrival airports must be different",
        path: ["arrivalAirport"],
      })
    }

    if (data.departureDate && data.arrivalDate) {
      const depDate = new Date(data.departureDate)
      const arrDate = new Date(data.arrivalDate)
      if (arrDate < depDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Arrival date cannot be before departure date",
          path: ["arrivalDate"],
        })
      }
    }

    if (data.departureDate && data.arrivalDate && data.departureTime && data.arrivalTime) {
      const depDateTime = new Date(`${data.departureDate}T${data.departureTime}`)
      const arrDateTime = new Date(`${data.arrivalDate}T${data.arrivalTime}`)
      if (arrDateTime <= depDateTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Arrival time must be after departure time",
          path: ["arrivalTime"],
        })
      }
    }

    const total = data.basePrice + data.taxPrice
    if (total <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total price must be positive",
        path: ["basePrice"],
      })
    }
  })

interface FlightFormProps {
  onSuccess: (flightId: string, flightData: FlightFormData) => void
  mode?: "add" | "edit"
  initialData?: Partial<FlightFormData>
  flightId?: string
}

export function FlightForm({ onSuccess, mode = "add", initialData, flightId }: FlightFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatDateForForm = (dateString: string | null | undefined, includeTime = false) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (includeTime) {
      // For datetime-local inputs (YYYY-MM-DDTHH:MM)
      return date.toISOString().slice(0, 16)
    } else {
      // For date inputs (YYYY-MM-DD)
      return date.toISOString().slice(0, 10)
    }
  }

  const mapApiDataToFormData = (apiData: any) => {
    if (!apiData) return {}

    return {
      tripType: apiData.tripType || "one-way",
      flightClass: apiData.flightClass || "economy",
      from: apiData.from || "",
      to: apiData.to || "",
      airline: apiData.airline || "",
      basePrice: apiData.basePrice || 0,
      taxPrice: apiData.taxPrice || 0,
      currency: apiData.currency || "USD",
      isRefundable: apiData.isRefundable || false,
      cancellationPenalty: apiData.cancellationPenalty || 0,
      cancellationAllowedUntil: formatDateForForm(
        apiData.cancellationAllowedUntill || apiData.cancellationAllowedUntil,
        true,
      ),
      passportRequired: apiData.passportRequired || false,
      seatSelectionAllowed: apiData.seatSelectionAllowed || false,
      recheckBagsRequired: apiData.recheckBagsRequired || false,
      voidableUntil: formatDateForForm(apiData.voidableUntil, true),
      checkedBaggage: apiData.checkedBaggage || "",
      cabinBaggage: apiData.cabbinBaggage || apiData.cabinBaggage || "",
      flightNumber: apiData.flightNumber || "",
      departureAirport: apiData.departureAirport || "",
      arrivalAirport: apiData.arrivalAirport || "",
      departureTime: formatDateForForm(apiData.departureTime, true),
      arrivalTime: formatDateForForm(apiData.arrivalTime, true),
      departureDate: formatDateForForm(apiData.departureDate),
      arrivalDate: formatDateForForm(apiData.arrivalDate),
      returnDate: formatDateForForm(apiData.returnDate),
      passengerType: apiData.passengerType || "adult",
    }
  }

  const form = useForm<FlightFormData>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      tripType: "one-way",
      flightClass: "economy",
      from: "",
      to: "",
      airline: "",
      basePrice: 0,
      taxPrice: 0,
      currency: "USD",
      isRefundable: false,
      cancellationPenalty: 0,
      cancellationAllowedUntil: "",
      passportRequired: false,
      seatSelectionAllowed: false,
      recheckBagsRequired: false,
      voidableUntil: "",
      checkedBaggage: "",
      cabinBaggage: "",
      flightNumber: "",
      departureAirport: "",
      arrivalAirport: "",
      departureTime: "",
      arrivalTime: "",
      departureDate: "",
      arrivalDate: "",
      returnDate: "",
      passengerType: "adult",
    },
  })

  useEffect(() => {
    if (initialData && mode === "edit") {
      const formData = mapApiDataToFormData(initialData)
      console.log("[v0] Mapped form data:", formData)

      // Reset form with the mapped data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.setValue(key as keyof FlightFormData, value)
        }
      })
    }
  }, [initialData, mode, form])

  const tripType = form.watch("tripType")
  const basePrice = form.watch("basePrice")
  const taxPrice = form.watch("taxPrice")
  const isRefundable = form.watch("isRefundable")
  const departureDate = form.watch("departureDate")
  const arrivalDate = form.watch("arrivalDate")
  const fromCity = form.watch("from")
  const toCity = form.watch("to")

  const totalPrice = useMemo(() => {
    const base = Number(basePrice) || 0
    const tax = Number(taxPrice) || 0
    return Number((base + tax).toFixed(2))
  }, [basePrice, taxPrice])

  useEffect(() => {
    if (isRefundable) {
      form.setValue("cancellationPenalty", 0)
    }
  }, [isRefundable, form])

  useEffect(() => {
    if (fromCity) {
      form.setValue("departureAirport", "")
    }
  }, [fromCity, form])

  useEffect(() => {
    if (toCity) {
      form.setValue("arrivalAirport", "")
    }
  }, [toCity, form])

  const formatToString = (date: string | undefined) => {
  return date || null
}

  const onSubmit = async (data: FlightFormData) => {
    setIsSubmitting(true)
    const loadingToast = toast.loading(mode === "edit" ? "Updating flight..." : "Creating flight...")

    try {
const transformedData = {
  tripType: data.tripType,
  from: data.from,
  to: data.to,
  departureDate: formatToString(data.departureDate),
  arrivalDate: formatToString(data.arrivalDate),
  returnDate: data.returnDate ? formatToString(data.returnDate) : undefined,
  flightClass: data.flightClass,
  flightNumber: data.flightNumber,
  departureAirport: data.departureAirport,
  arrivalAirport: data.arrivalAirport,
  departureTime: formatToString(data.departureTime),
  arrivalTime: formatToString(data.arrivalTime),
  airline: data.airline,
  basePrice: Math.ceil(data.basePrice),
  taxPrice: Math.ceil(data.taxPrice),
  totalPrice: Math.ceil(totalPrice),
  currency: data.currency,
  cancellationAllowedUntill: formatToString(data.cancellationAllowedUntil),
  isRefundable: data.isRefundable,
  cancellationPenalty: Math.ceil(data.cancellationPenalty),
  voidableUntil: formatToString(data.voidableUntil),
  passengerType: data.passengerType,
  passportRequired: data.passportRequired,
  seatSelectionAllowed: data.seatSelectionAllowed,
  recheckBagsRequired: data.recheckBagsRequired,
  checkedBaggage: data.checkedBaggage,
  cabbinBaggage: data.cabinBaggage || "1 piece 7 kg",
}

      console.log("Transformed flight data:", transformedData)

      let result
      if (mode === "edit" && flightId) {
        // TODO: Implement UpdateFlight API call
        // result = await UpdateFlight(flightId, transformedData)
       
        result = await UpdateFlight(flightId,transformedData);
      } else {
        result = await PostFlight(transformedData)
      }

      toast.dismiss(loadingToast)
      toast.success(
        mode === "edit"
          ? "Flight updated successfully! Now update segments."
          : "Flight created successfully! Now add segments.",
        {
          duration: 4000,
          icon: "✈️",
        },
      )
if(mode=="add")
{
      onSuccess(result.id||"", data)

}
else
{
  onSuccess(flightId||"", data)

}
      if (mode === "add") {
        form.reset()
      }
    } catch (error: any) {
      toast.dismiss(loadingToast)
      toast.error(
        error.message ||
          (mode === "edit"
            ? "Failed to update flight. Please try again."
            : "Failed to create flight. Please try again."),
        {
          duration: 5000,
          icon: "❌",
        },
      )
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-4">
          <Plane className="w-4 h-4" />
          Step 1: {mode === "edit" ? "Edit Flight Information" : "Flight Information"}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{mode === "edit" ? "Edit Flight" : "Create Flight"}</h2>
        <p className="text-gray-600">
          {mode === "edit" ? "Update flight information" : "Enter basic flight information"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="tripType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Trip Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue placeholder="Select trip type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="one-way">One-way</SelectItem>
                        <SelectItem value="round-trip">Round Trip</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Flight Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="airline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Airline Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Pakistan International Airlines" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="flightNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flight Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. PK263" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From (City)</FormLabel>
                      <FormControl>
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          loadOptions={debouncedFetchMunicipalities}
                          value={field.value ? { label: field.value, value: field.value } : null}
                          onChange={(option: any) => field.onChange(option?.value || "")}
                          placeholder="Search departure city..."
                          className="react-select-container"
                          classNamePrefix="react-select"
                          isClearable
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To (City)</FormLabel>
                      <FormControl>
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          loadOptions={debouncedFetchMunicipalities}
                          value={field.value ? { label: field.value, value: field.value } : null}
                          onChange={(option: any) => field.onChange(option?.value || "")}
                          placeholder="Search arrival city..."
                          className="react-select-container"
                          classNamePrefix="react-select"
                          isClearable
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="departureAirport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Airport</FormLabel>
                      <FormControl>
                        <AsyncSelect
                          cacheOptions
                          defaultOptions={false}
                          loadOptions={(query) => debouncedFetchAirports(fromCity, fromCity)}
                          value={field.value ? { label: field.value, value: field.value } : null}
                          onChange={(option: any) => field.onChange(option?.value || "")}
                          placeholder={fromCity ? "Search departure airport..." : "Select departure city first"}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          isClearable
                          isDisabled={!fromCity}
                          noOptionsMessage={() =>
                            fromCity ? "No airports found" : "Please select departure city first"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                      {fromCity && <p className="text-xs text-gray-500 mt-1">Showing airports in {fromCity}</p>}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arrivalAirport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrival Airport</FormLabel>
                      <FormControl>
                        <AsyncSelect
                          cacheOptions
                          defaultOptions={false}
                          loadOptions={(query) => debouncedFetchAirports(toCity, toCity)}
                          value={field.value ? { label: field.value, value: field.value } : null}
                          onChange={(option: any) => field.onChange(option?.value || "")}
                          placeholder={toCity ? "Search arrival airport..." : "Select arrival city first"}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          isClearable
                          isDisabled={!toCity}
                          noOptionsMessage={() => (toCity ? "No airports found" : "Please select arrival city first")}
                        />
                      </FormControl>
                      <FormMessage />
                      {toCity && <p className="text-xs text-gray-500 mt-1">Showing airports in {toCity}</p>}
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="departureDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Date</FormLabel>
                      <FormControl>
                        <input
                          type="date"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arrivalDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrival Date</FormLabel>
                      <FormControl>
                        <input
                          type="date"
                          min={departureDate ? `${departureDate}T23:59` : undefined}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {tripType === "round-trip" && (
                <FormField
                  control={form.control}
                  name="returnDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Return Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="departureTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Time</FormLabel>
                      <FormControl>
                        <input
                          type="datetime-local"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          min={departureDate ? `${departureDate}T00:00` : undefined}
                          max={departureDate ? `${departureDate}T23:59` : undefined}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      {departureDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Time must be on {new Date(departureDate).toLocaleDateString()}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arrivalTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrival Time</FormLabel>
                      <FormControl>
                        <input
                          type="datetime-local"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          min={arrivalDate ? `${arrivalDate}T00:00` : undefined}
                          max={arrivalDate ? `${arrivalDate}T23:59` : undefined}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      {arrivalDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Time must be on {new Date(arrivalDate).toLocaleDateString()}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="flightClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flight Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="economy">Economy</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="first">First Class</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passengerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passenger Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select passenger type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="adult">Adult</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="infant">Infant</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Fare</FormLabel>
                      <FormControl>
                        <Input type="number" min="0.01" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxes & Fees</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Total Price</FormLabel>
                  <div className="flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm font-semibold">
                    {form.getValues("currency")} {totalPrice.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Calculated automatically</p>
                </FormItem>
              </div>
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="max-w-xs">
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cancellationPenalty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cancellation Fee</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} disabled={isRefundable} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cancellationAllowedUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Free Cancellation Until</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="isRefundable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Refundable</FormLabel>
                        <p className="text-xs text-gray-500">No cancellation fee</p>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passportRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Passport Required</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seatSelectionAllowed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Seat Selection</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recheckBagsRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Recheck Bags</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="voidableUntil"
                render={({ field }) => (
                  <FormItem className="max-w-xs">
                    <FormLabel>Voidable Until</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Baggage Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="checkedBaggage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Checked Baggage Allowance</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2 pieces (23kg each)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cabinBaggage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cabin Baggage Allowance</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 1 piece (7kg)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === "edit" ? "Updating Flight..." : "Creating Flight..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {mode === "edit" ? "Update Flight & Continue" : "Create Flight & Continue"}
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
