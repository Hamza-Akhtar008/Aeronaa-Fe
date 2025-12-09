"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Plus, Trash2, CheckCircle, List } from "lucide-react"
import AsyncSelect from "react-select/async"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Assuming these types and functions are defined elsewhere in your project
import type { FlightFormData } from "@/types/checkout"
import { PostSegment, UpdateSegments } from "@/lib/flight_api"

// Reuse the same search functions from flight-form
const searchCache = new Map<string, Promise<any[]>>()
const searchCacheCity = new Map<string, Promise<any[]>>()

const debouncedFetchAirports = (() => {
  let timeout: NodeJS.Timeout
  let controller: AbortController | null = null
  return async (query: string) => {
    if (!query || query.length < 2) return []
    const key = query.toLowerCase()
    if (searchCache.has(key)) return searchCache.get(key)!
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
          resolve(
            data.map((airport: any) => ({
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

const debouncedFetchMunicipalities = (() => {
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

const segmentSchema = z.object({
  id: z.string(),
  type: z.enum(["outbound", "return"]),
  flightNumber: z.string().min(2, "Flight number is required"),
  departureAirport: z.string().min(1, "Departure airport is required"),
  arrivalAirport: z.string().min(1, "Arrival airport is required"),
  departurelocation: z.string().min(1, "Departure location is required"),
  arrivallocation: z.string().min(1, "Arrival location is required"),
  departureTime: z.string().min(1, "Departure time is required"),
  arrivalTime: z.string().min(1, "Arrival time is required"),
  flightDuration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  layoverDuration: z.coerce.number().min(0, "Duration must be positive").optional(),
  aircraftType: z.string().optional(),
  operatingCarrier: z.string().optional(),
  marketingCarrier: z.string().optional(),
  baggageRecheckRequired: z.boolean().default(false),
  cabinClass: z.enum(["economy", "business", "first"]),
})

const segmentsFormSchema = z
  .object({
    outboundSegments: z.array(segmentSchema).min(1, "At least one outbound segment is required"),
    returnSegments: z.array(segmentSchema).optional(),
  })
  .superRefine((data, ctx) => {
    // Validate segment connections for outbound
    for (let i = 0; i < data.outboundSegments.length - 1; i++) {
      const currentArrival = data.outboundSegments[i].arrivalAirport
      const nextDeparture = data.outboundSegments[i + 1].departureAirport
      if (currentArrival !== nextDeparture) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Outbound segment ${i + 2} must depart from the arrival airport of segment ${i + 1}`,
          path: [`outboundSegments.${i + 1}.departureAirport`],
        })
      }
    }

    // Validate segment connections for return
    if (data.returnSegments && data.returnSegments.length > 0) {
      for (let i = 0; i < data.returnSegments.length - 1; i++) {
        const currentArrival = data.returnSegments[i].arrivalAirport
        const nextDeparture = data.returnSegments[i + 1].departureAirport
        if (currentArrival !== nextDeparture) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Return segment ${i + 2} must depart from the arrival airport of segment ${i + 1}`,
            path: [`returnSegments.${i + 1}.departureAirport`],
          })
        }
      }
    }
  })

type SegmentsFormData = z.infer<typeof segmentsFormSchema>

interface SegmentsFormProps {
  flightId: string
  flightData: FlightFormData
  onSuccess: () => void
  onBack: () => void
  mode?: "add" | "edit"
  existingSegments?: any[]
}

export function SegmentsForm({
  flightId,
  flightData,
  onSuccess,
  onBack,
  mode = "add",
  existingSegments = [],
}: SegmentsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const convertExistingSegmentsToFormData = (segments: any[]) => {
    const outbound = segments.filter((s) => s.type === "outbound" || s.type === "outbound")
    const returnSegs = segments.filter((s) => s.type === "return" || s.type === "return")

    const formatDateTimeForInput = (dateStr: string) => {
      if (!dateStr) return ""
      try {
        const date = new Date(dateStr)
        return date// YYYY-MM-DDTHH:MM format
      } catch {
        return ""
      }
    }

    return {
      outboundSegments:
        outbound.length > 0
          ? outbound.map((seg, index) => ({
              id: String(seg.id),
              type: "outbound" as const,
              flightNumber: seg.flightNumber || "",
              departureAirport: seg.departureAirport || seg.departure_airport || "",
              arrivalAirport: seg.arrivalAirport || seg.arrival_airport || "",
              departurelocation: seg.departurelocation || seg.departure_location || "",
              arrivallocation: seg.arrivallocation || seg.arrival_location || "",
              departureTime: formatDateTimeForInput(seg.departureTime || seg.departure_time),
              arrivalTime: formatDateTimeForInput(seg.arrivalTime || seg.arrival_time),
              flightDuration: seg.flightDuration || seg.flight_duration || 0,
              layoverDuration: seg.layoverDuration || seg.layover_duration || 0,
              aircraftType: seg.aircraftType || seg.aircraft_type || "",
              operatingCarrier: seg.operatingCarrier || seg.operating_carrier || "",
              marketingCarrier: seg.marketingCarrier || seg.marketing_carrier || "",
              baggageRecheckRequired: seg.baggageRecheckRequired || seg.baggage_recheck_required || false,
              cabinClass: seg.cabinClass || seg.cabin_class || flightData.flightClass || "economy",
            }))
          : [
              // Default outbound segment if none exist
              {
                id: "out-1",
                type: "outbound" as const,
                flightNumber: "",
                departureAirport: flightData.departureAirport || "",
                arrivalAirport: flightData.arrivalAirport || "",
                departurelocation: flightData.from || "",
                arrivallocation: flightData.to || "",
                departureTime: flightData.departureTime
                  ? new Date(flightData.departureTime)
                  : "",
                arrivalTime: flightData.arrivalTime ? new Date(flightData.arrivalTime) : "",
                flightDuration: (() => {
                  if (flightData.departureTime && flightData.arrivalTime) {
                    const dep = new Date(flightData.departureTime)
                    const arr = new Date(flightData.arrivalTime)
                    const durationMs = arr.getTime() - dep.getTime()
                    return Math.max(1, Math.round(durationMs / (1000 * 60)))
                  }
                  return 1
                })(),
                layoverDuration: 0,
                aircraftType: "",
                operatingCarrier: "",
                marketingCarrier: "",
                baggageRecheckRequired: false,
                cabinClass: flightData.flightClass || "economy",
              },
            ],
      returnSegments:
        flightData.tripType === "round-trip"
          ? returnSegs.length > 0
            ? returnSegs.map((seg, index) => ({
                id: String(seg.id) || "out-1",
                type: "return" as const,
                flightNumber: seg.flightNumber || "",
                departureAirport: seg.departureAirport || seg.departure_airport || "",
                arrivalAirport: seg.arrivalAirport || seg.arrival_airport || "",
                departurelocation: seg.departurelocation || seg.departure_location || "",
                arrivallocation: seg.arrivallocation || seg.arrival_location || "",
                departureTime: formatDateTimeForInput(seg.departureTime || seg.departure_time),
                arrivalTime: formatDateTimeForInput(seg.arrivalTime || seg.arrival_time),
                flightDuration: seg.flightDuration || seg.flight_duration || 0,
                layoverDuration: seg.layoverDuration || seg.layover_duration || 0,
                aircraftType: seg.aircraftType || seg.aircraft_type || "",
                operatingCarrier: seg.operatingCarrier || seg.operating_carrier || "",
                marketingCarrier: seg.marketingCarrier || seg.marketing_carrier || "",
                baggageRecheckRequired: seg.baggageRecheckRequired || seg.baggage_recheck_required || false,
                cabinClass: seg.cabinClass || seg.cabin_class || flightData.flightClass || "economy",
              }))
            : [
                // Default return segment if none exist
                {
                  id: "ret-1",
                  type: "return" as const,
                  flightNumber: "",
                  departureAirport: flightData.arrivalAirport || "",
                  arrivalAirport: flightData.departureAirport || "",
                  departurelocation: flightData.to || "",
                  arrivallocation: flightData.from || "",
                  departureTime: flightData.returnDate
                    ? new Date(flightData.returnDate).toISOString().slice(0, 16)
                    : "",
                  arrivalTime: "",
                  flightDuration: 0,
                  layoverDuration: 0,
                  aircraftType: "",
                  operatingCarrier: "",
                  marketingCarrier: "",
                  baggageRecheckRequired: false,
                  cabinClass: flightData.flightClass || "economy",
                },
              ]
          : undefined,
    }
  }

  const form = useForm<SegmentsFormData>({
    resolver: zodResolver(segmentsFormSchema),
    defaultValues: {
      outboundSegments: [
        {
          id: "out-1",
          type: "outbound",
          flightNumber: "",
          departureAirport: flightData.departureAirport || "",
          arrivalAirport: flightData.arrivalAirport || "",
          departurelocation: flightData.from || "",
          arrivallocation: flightData.to || "",
          departureTime: flightData.departureTime ? new Date(flightData.departureTime).toISOString().slice(0, 16) : "",
          arrivalTime: flightData.arrivalTime ? new Date(flightData.arrivalTime).toISOString().slice(0, 16) : "",
          flightDuration: (() => {
            if (flightData.departureTime && flightData.arrivalTime) {
              const dep = new Date(flightData.departureTime)
              const arr = new Date(flightData.arrivalTime)
              const durationMs = arr.getTime() - dep.getTime()
              return Math.max(1, Math.round(durationMs / (1000 * 60)))
            }
            return 1
          })(),
          layoverDuration: 0,
          aircraftType: "",
          operatingCarrier: "",
          marketingCarrier: "",
          baggageRecheckRequired: false,
          cabinClass: flightData.flightClass || "economy",
        },
      ],
      returnSegments:
        flightData.tripType === "round-trip"
          ? [
              {
                id: "ret-1",
                type: "return",
                flightNumber: "",
                departureAirport: flightData.arrivalAirport || "",
                arrivalAirport: flightData.departureAirport || "",
                departurelocation: flightData.to || "",
                arrivallocation: flightData.from || "",
                departureTime: flightData.returnDate ? new Date(flightData.returnDate).toISOString().slice(0, 16) : "",
                arrivalTime: "",
                flightDuration: 0,
                layoverDuration: 0,
                aircraftType: "",
                operatingCarrier: "",
                marketingCarrier: "",
                baggageRecheckRequired: false,
                cabinClass: flightData.flightClass || "economy",
              },
            ]
          : undefined,
    },
  })

  useEffect(() => {
    if (mode === "edit" && existingSegments.length > 0) {
      const formData = convertExistingSegmentsToFormData(existingSegments)
      form.reset(formData)
    }
  }, [existingSegments, mode, form])

  const {
    fields: outboundFields,
    append: appendOutbound,
    remove: removeOutbound,
  } = useFieldArray({
    control: form.control,
    name: "outboundSegments",
  })

  const {
    fields: returnFields,
    append: appendReturn,
    remove: removeReturn,
  } = useFieldArray({
    control: form.control,
    name: "returnSegments",
  })

  // Effect to calculate flight and layover durations automatically
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      // Calculate flight duration for outbound segments
      value.outboundSegments?.forEach((segment, index) => {
        const departureTimeStr = segment?.departureTime
        const arrivalTimeStr = segment?.arrivalTime

        if (departureTimeStr && arrivalTimeStr) {
          const departureDate = new Date(departureTimeStr)
          const arrivalDate = new Date(arrivalTimeStr)
          const durationMs = arrivalDate.getTime() - departureDate.getTime()
          const durationMinutes = Math.round(durationMs / (1000 * 60))
          if (durationMinutes >= 0) {
            const currentFlightDuration = form.getValues(`outboundSegments.${index}.flightDuration`)
            if (currentFlightDuration !== durationMinutes) {
              form.setValue(`outboundSegments.${index}.flightDuration`, durationMinutes, { shouldValidate: true })
            }
          }
        }
      })

      // Calculate layover duration for outbound segments
      for (let i = 0; i < (value.outboundSegments?.length || 0) - 1; i++) {
        const currentSegment = value.outboundSegments![i]
        const nextSegment = value.outboundSegments![i + 1]

        const currentArrivalTimeStr = currentSegment?.arrivalTime
        const nextDepartureTimeStr = nextSegment?.departureTime

        if (currentArrivalTimeStr && nextDepartureTimeStr) {
          const currentArrivalDate = new Date(currentArrivalTimeStr)
          const nextDepartureDate = new Date(nextDepartureTimeStr)
          const layoverMs = nextDepartureDate.getTime() - currentArrivalDate.getTime()
          const layoverMinutes = Math.round(layoverMs / (1000 * 60))
          if (layoverMinutes >= 0) {
            const currentLayoverDuration = form.getValues(`outboundSegments.${i}.layoverDuration`)
            if (currentLayoverDuration !== layoverMinutes) {
              form.setValue(`outboundSegments.${i}.layoverDuration`, layoverMinutes, { shouldValidate: true })
            }
          }
        }
      }

      // Repeat for return segments if applicable
      if (flightData.tripType === "round-trip") {
        value.returnSegments?.forEach((segment, index) => {
          const departureTimeStr = segment?.departureTime
          const arrivalTimeStr = segment?.arrivalTime

          if (departureTimeStr && arrivalTimeStr) {
            const departureDate = new Date(departureTimeStr)
            const arrivalDate = new Date(arrivalTimeStr)
            const durationMs = arrivalDate.getTime() - departureDate.getTime()
            const durationMinutes = Math.round(durationMs / (1000 * 60))
            if (durationMinutes >= 0) {
              const currentFlightDuration = form.getValues(`returnSegments.${index}.flightDuration`)
              if (currentFlightDuration !== durationMinutes) {
                form.setValue(`returnSegments.${index}.flightDuration`, durationMinutes, { shouldValidate: true })
              }
            }
          }
        })

        for (let i = 0; i < (value.returnSegments?.length || 0) - 1; i++) {
          const currentSegment = value.returnSegments![i]
          const nextSegment = value.returnSegments![i + 1]

          const currentArrivalTimeStr = currentSegment?.arrivalTime
          const nextDepartureTimeStr = nextSegment?.departureTime

          if (currentArrivalTimeStr && nextDepartureTimeStr) {
            const currentArrivalDate = new Date(currentArrivalTimeStr)
            const nextDepartureDate = new Date(nextDepartureTimeStr)
            const layoverMs = nextDepartureDate.getTime() - currentArrivalDate.getTime()
            const layoverMinutes = Math.round(layoverMs / (1000 * 60))
            if (layoverMinutes >= 0) {
              const currentLayoverDuration = form.getValues(`returnSegments.${i}.layoverDuration`)
              if (currentLayoverDuration !== layoverMinutes) {
                form.setValue(`returnSegments.${i}.layoverDuration`, layoverMinutes, { shouldValidate: true })
              }
            }
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, flightData.tripType])

  const onSubmit = async (data: SegmentsFormData) => {
    setIsSubmitting(true)
    const loadingToast = toast.loading(mode === "edit" ? "Updating flight segments..." : "Creating flight segments...")
    try {
       const transformSegment = (segment: any, type: "outbound" | "return", mode: "add" | "edit", flightId: string) => {
  if (mode === "edit") {
    // Keep id for DB update
    return {
      ...segment,
      id: segment.id,
      type,
      flight: { id: flightId },
    }
  } else {
    // Remove id before spreading
    const { id, ...rest } = segment
    return {
      ...rest,
      type,
      flight: { id: flightId },
    }
  }
}

const allSegments = [
  ...data.outboundSegments.map((seg) => transformSegment(seg, "outbound", mode, flightId)),
  ...(data.returnSegments || []).map((seg) => transformSegment(seg, "return", mode, flightId)),
]
      console.log("allSegments : ", allSegments)

      if (mode === "edit") {
        for (const segment of allSegments) {
           console.log(segment);
          await UpdateSegments(segment.id, segment);
        }
      } else {
        await PostSegment(allSegments);
      }

      toast.dismiss(loadingToast)
      toast.success(
        mode === "edit" ? "Flight segments updated successfully!" : "Flight segments created successfully!",
        {
          duration: 4000,
          icon: "✈️",
        },
      )
      onSuccess()
    } catch (error: any) {
      toast.dismiss(loadingToast)
      toast.error(
        error.message ||
          (mode === "edit"
            ? "Failed to update segments. Please try again."
            : "Failed to create segments. Please try again."),
        {
          duration: 5000,
          icon: "❌",
        },
      )
      console.error("Error submitting segments:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSegmentFields = (
    fields: any[],
    type: "outbound" | "return",
    append: (segment: any) => void,
    remove: (index: number) => void,
  ) => {
    return (
      <div className="space-y-4">
        {fields.map((field, index) => {
          const isFirstOutboundSegment = type === "outbound" && index === 0
          const isLastOutboundSegment = type === "outbound" && index === fields.length - 1
          const isFirstReturnSegment = type === "return" && index === 0
          const isLastReturnSegment = type === "return" && index === fields.length - 1

          return (
            <div
              key={field.id}
              className={`border rounded-lg p-4 space-y-4 ${type === "outbound" ? "bg-blue-50" : "bg-green-50"}`}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">
                  {type === "outbound" ? "Outbound" : "Return"} Segment {index + 1}
                </h4>
                {fields.length > 1 && (
                  <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                    <Trash2 className="w-4 h-4" /> Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`${type}Segments.${index}.flightNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flight Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. PK263" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`${type}Segments.${index}.aircraftType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aircraft Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Boeing 777" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`${type}Segments.${index}.departureAirport`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Airport</FormLabel>
                      <FormControl>
                        {isFirstOutboundSegment || isFirstReturnSegment ? (
                          <Input
                            {...field}
                            value={
                              isFirstOutboundSegment
                                ? flightData.departureAirport || ""
                                : flightData.arrivalAirport || ""
                            }
                            readOnly
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        ) : (
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={debouncedFetchAirports}
                            value={field.value ? { label: field.value, value: field.value } : null}
                            defaultValue={field.value ? { label: field.value, value: field.value } : null}
                            onChange={(option: any) => field.onChange(option?.value || "")}
                            placeholder="Search departure airport..."
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`${type}Segments.${index}.arrivalAirport`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrival Airport</FormLabel>
                      <FormControl>
                        {isLastOutboundSegment || isLastReturnSegment ? (
                          <Input
                            {...field}
                            value={
                              isLastOutboundSegment
                                ? flightData.arrivalAirport || ""
                                : flightData.departureAirport || ""
                            }
                            readOnly
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        ) : (
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={debouncedFetchAirports}
                            value={field.value ? { label: field.value, value: field.value } : null}
                            defaultValue={field.value ? { label: field.value, value: field.value } : null}
                            onChange={(option: any) => field.onChange(option?.value || "")}
                            placeholder="Search arrival airport..."
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`${type}Segments.${index}.departurelocation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Location</FormLabel>
                      <FormControl>
                        {isFirstOutboundSegment || isFirstReturnSegment ? (
                          <Input
                            {...field}
                            value={isFirstOutboundSegment ? flightData.from || "" : flightData.to || ""}
                            readOnly
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        ) : (
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={debouncedFetchMunicipalities}
                            value={field.value ? { label: field.value, value: field.value } : null}
                            defaultValue={field.value ? { label: field.value, value: field.value } : null}
                            onChange={(option: any) => field.onChange(option?.value || "")}
                            placeholder="Search departure city..."
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`${type}Segments.${index}.arrivallocation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrival Location</FormLabel>
                      <FormControl>
                        {isLastOutboundSegment || isLastReturnSegment ? (
                          <Input
                            {...field}
                            value={isLastOutboundSegment ? flightData.to || "" : flightData.from || ""}
                            readOnly
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        ) : (
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={debouncedFetchMunicipalities}
                            value={field.value ? { label: field.value, value: field.value } : null}
                            defaultValue={field.value ? { label: field.value, value: field.value } : null}
                            onChange={(option: any) => field.onChange(option?.value || "")}
                            placeholder="Search arrival city..."
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`${type}Segments.${index}.departureTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Time</FormLabel>
                      <FormControl>
                        {isFirstOutboundSegment ? (
                          <Input
                            type="datetime-local"
                            {...field}
                            value={
                              flightData.departureTime
                                ? new Date(flightData.departureTime).toISOString().slice(0, 16)
                                : ""
                            }
                            readOnly
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        ) : isFirstReturnSegment ? (
                          <Input
                            type="datetime-local"
                            {...field}
                            min={
                              flightData.returnDate
                                ? new Date(flightData.returnDate).toISOString().slice(0, 10) + "T00:00"
                                : undefined
                            }
                            max={
                              flightData.returnDate
                                ? new Date(flightData.returnDate).toISOString().slice(0, 10) + "T23:59"
                                : undefined
                            }
                          />
                        ) : (
                          <Input type="datetime-local" {...field} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`${type}Segments.${index}.arrivalTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrival Time</FormLabel>
                      <FormControl>
                        {isLastOutboundSegment ? (
                          <Input
                            type="datetime-local"
                            {...field}
                            value={
                              flightData.arrivalTime ? new Date(flightData.arrivalTime).toISOString().slice(0, 16) : ""
                            }
                            readOnly
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        ) : (
                          <Input type="datetime-local" {...field} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name={`${type}Segments.${index}.flightDuration`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flight Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} readOnly className="bg-gray-100 cursor-not-allowed" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {index < fields.length - 1 && (
                  <FormField
                    control={form.control}
                    name={`${type}Segments.${index}.layoverDuration`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Layover Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} readOnly className="bg-gray-100 cursor-not-allowed" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name={`${type}Segments.${index}.cabinClass`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cabin Class</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={flightData.flightClass || "economy"}
                          readOnly
                          className="bg-gray-100 cursor-not-allowed"
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
                  name={`${type}Segments.${index}.operatingCarrier`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operating Carrier</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Operating airline" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`${type}Segments.${index}.marketingCarrier`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marketing Carrier</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Marketing airline" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`${type}Segments.${index}.baggageRecheckRequired`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Baggage Recheck Required</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 bg-transparent"
          onClick={() => {
            const lastSegment = fields.length > 0 ? form.getValues(`${type}Segments.${fields.length - 1}`) : null
            append({
              id: `${type.slice(0, 3)}-${fields.length + 1}`,
              type,
              flightNumber: "",
              departureAirport: lastSegment?.arrivalAirport || "",
              arrivalAirport: "",
              departurelocation: lastSegment?.arrivallocation || "",
              arrivallocation: "",
              departureTime: "",
              arrivalTime: "",
              flightDuration: 0,
              layoverDuration: 0,
              operatingCarrier: "",
              marketingCarrier: "",
              baggageRecheckRequired: false,
              cabinClass: flightData.flightClass || "economy",
            })
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add {type === "outbound" ? "Outbound" : "Return"} Segment
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-4">
          <List className="w-4 h-4" />
          Step 2: {mode === "edit" ? "Edit Flight Segments" : "Flight Segments"}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === "edit" ? "Edit Flight Segments" : "Add Flight Segments"}
        </h2>
        <p className="text-gray-600">
          Flight ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{flightId}</span>
        </p>
        <p className="text-gray-600 mt-2">
          {flightData.from} → {flightData.to} ({flightData.tripType})
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Outbound Segments */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5" /> Outbound Flight Segments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {renderSegmentFields(outboundFields, "outbound", appendOutbound, removeOutbound)}
            </CardContent>
          </Card>

          {/* Return Segments */}
          {flightData.tripType === "round-trip" && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 rotate-180" /> Return Flight Segments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {renderSegmentFields(returnFields || [], "return", appendReturn, removeReturn)}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6">
            <Button type="button" variant="outline" onClick={onBack} className="px-8 py-3 bg-transparent">
              Back to Flight Form
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === "edit" ? "Updating Segments..." : "Creating Segments..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {mode === "edit" ? "Update Flight Segments" : "Complete Flight Creation"}
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
