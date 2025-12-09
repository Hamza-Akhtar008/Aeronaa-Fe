import { Ticket } from "@/types/checkout"

// Helper function to map cabin class
const mapCabinClass = (cabinClass: string): "economy" | "business" | "first" => {
  const lower = cabinClass.toLowerCase()
  if (lower.includes("business") || lower.includes("premium")) return "business"
  if (lower.includes("first")) return "first"
  return "economy"
}

// Helper function to format baggage info
const formatBaggageInfo = (freeBags: any[]): { checked: string; cabin: string } => {
  let checkedInfo = "Not included"
  let cabinInfo = "Not included"

  freeBags?.forEach((bag) => {
    if (bag.baggageType === "CHECKED") {
      if (bag.quantity > 0) {
        const weight = bag.restrictions?.find((r: any) => r.restrictionType === "WEIGHT")?.value
        checkedInfo = weight ? `${bag.quantity} x ${weight}kg` : `${bag.quantity} bag(s)`
      } else if (bag.quantity === -1) {
        checkedInfo = "1 bag included"
      } else if (bag.quantity === -3) {
        checkedInfo = "Not included"
      }
    } else if (bag.baggageType === "CARRY_ON") {
      if (bag.quantity > 0) {
        const weight = bag.restrictions?.find((r: any) => r.restrictionType === "WEIGHT")?.value
        const dimension = bag.restrictions?.find((r: any) => r.restrictionType === "DIMENSION")?.value
        cabinInfo = weight ? `${bag.quantity} x ${weight}kg` : `${bag.quantity} bag(s)`
        if (dimension) cabinInfo += ` (${dimension}cm)`
      }
    }
  })

  return { checked: checkedInfo, cabin: cabinInfo }
}

// Convert API response to Ticket interface
export const convertApiResponseToTickets = (apiResponse: any): Ticket[] => {
  const tickets: Ticket[] = []

  // Handle both round-trip and one-way responses
  const bundles = apiResponse.bundles || [apiResponse]

  bundles.forEach((bundle: any) => {
    const itinerary = bundle.itineraries?.[0]
    if (!itinerary) return

    const outboundSlice = bundle.outboundSlice
    const inboundSlice = bundle.inboundSlice || itinerary.inboundSlice
    const pricing = bundle.bundlePrice?.[0]?.price?.usd

    if (!outboundSlice || !pricing) return

    // Determine trip type
    const tripType = inboundSlice ? "round-trip" : "one-way"

    // Get main segment info
    const firstOutboundSegment = outboundSlice.segments[0]
    const lastOutboundSegment = outboundSlice.segments[outboundSlice.segments.length - 1]

    // Calculate pricing
    const fareCharge = pricing.charges?.find((c: any) => c.type === "Fare")
    const taxCharge = pricing.charges?.find((c: any) => c.type === "TaxAndFee")

    const basePrice = pricing.display?.perPax?.[0]?.exclusive || 0
    const taxPrice = pricing.display?.perPax?.[0]?.allInclusive - pricing.display?.perPax?.[0]?.exclusive || 0
    const totalPrice = pricing.display?.perPax?.[0]?.allInclusive || 0

    // Get baggage info
    const baggageInfo = formatBaggageInfo(outboundSlice.freeBags || [])

    // Get cancellation info
    const cancellationPolicy = outboundSlice.cancellationPolicies?.[0]
    const isRefundable = cancellationPolicy?.allowed || false
    const cancellationPenalty = cancellationPolicy?.penalty || 0

    // Convert outbound segments
    const outboundSegments = outboundSlice.segments.map((segment: any, index: number) => ({
      segmentId: segment.id?.toString() || `${index}`,
      flightNumber: segment.flightNumber || "",
      departureAirport: segment.originAirport || "",
      arrivalAirport: segment.destinationAirport || "",
      departureTime: segment.departDateTime || "",
      arrivalTime: segment.arrivalDateTime || "",
      flightDuration: segment.duration || 0,
      layoverDuration: segment.layoverAfter?.duration,
      aircraftType: segment.aircraftContent?.aircraftName,
      operatingCarrier: segment.operatingCarrierContent?.carrierName,
      marketingCarrier: segment.carrierContent?.carrierName,
      baggageRecheckRequired: segment.bagsRecheckRequired || false,
      cabinClass: mapCabinClass(segment.cabinClassContent?.cabinName || "Economy"),
      type: "outbound", // Marking this segment as outbound
    }))

    // Convert return segments if exists
    const returnSegments = inboundSlice?.segments?.map((segment: any, index: number) => ({
      segmentId: segment.id?.toString() || `return-${index}`,
      flightNumber: segment.flightNumber || "",
      departureAirport: segment.originAirport || "",
      arrivalAirport: segment.destinationAirport || "",
      departureTime: segment.departDateTime || "",
      arrivalTime: segment.arrivalDateTime || "",
      flightDuration: segment.duration || 0,
      layoverDuration: segment.layoverAfter?.duration,
      aircraftType: segment.aircraftContent?.aircraftName,
      operatingCarrier: segment.operatingCarrierContent?.carrierName,
      marketingCarrier: segment.carrierContent?.carrierName,
      baggageRecheckRequired: segment.bagsRecheckRequired || false,
      cabinClass: mapCabinClass(segment.cabinClassContent?.cabinName || "Economy"),
      type: "return", // Marking this segment as return
    }))

    // Create baggage policy
    const baggagePolicy =
      outboundSlice.freeBags?.map((bag: any) => ({
        passengerType: bag.passengerType as "ADT" | "CHD" | "INF",
        cabinBaggage: {
          included: bag.baggageType === "CARRY_ON" && bag.quantity > 0,
          quantity: bag.baggageType === "CARRY_ON" ? Math.max(0, bag.quantity) : undefined,
          weight: bag.restrictions?.find((r: any) => r.restrictionType === "WEIGHT")?.value,
        },
        checkedBaggage: {
          included: bag.baggageType === "CHECKED" && (bag.quantity > 0 || bag.quantity === -1),
          quantity: bag.baggageType === "CHECKED" ? (bag.quantity === -1 ? 1 : Math.max(0, bag.quantity)) : undefined,
          weight: bag.restrictions?.find((r: any) => r.restrictionType === "WEIGHT")?.value,
        },
      })) || []

    const ticket: Ticket = {
      id: itinerary.itineraryInfo?.id || bundle.key,
      tripType,
      from: firstOutboundSegment.airportContent?.departureCityName || firstOutboundSegment.originAirport,
      to: lastOutboundSegment.airportContent?.arrivalCityName || lastOutboundSegment.destinationAirport,
      departureDate: firstOutboundSegment.departDateTime?.split("T")[0] || "",
      arrivalDate: lastOutboundSegment.arrivalDateTime?.split("T")[0] || "",
      returnDate: returnSegments?.[returnSegments.length - 1]?.arrivalTime?.split("T")[0],
      flightClass: mapCabinClass(firstOutboundSegment.cabinClassContent?.cabinName || "Economy"),
      flightNumber: firstOutboundSegment.flightNumber || "",
      departureAirport: firstOutboundSegment.originAirport || "",
      arrivalAirport: lastOutboundSegment.destinationAirport || "",
      departureTime: firstOutboundSegment.departDateTime || "",
      arrivalTime: lastOutboundSegment.arrivalDateTime || "",
      airline: firstOutboundSegment.operatingCarrierContent?.carrierName || "",
      basePrice,
      taxPrice,
      totalPrice,
      currency: "USD",
      cancellationAllowedUntill: outboundSlice.voidWindowClose || "",
      isRefundable,
      cancellationPenalty,
      voidableUntil: outboundSlice.voidWindowClose || "",
      passengerType: "ADT",
      passportRequired: itinerary.itineraryInfo?.passportRequired || false,
      seatSelectionAllowed: firstOutboundSegment.seatSelectionAllowed || false,
      recheckBagsRequired: outboundSegments.some((s:any) => s.baggageRecheckRequired),
      checkedBaggage: baggageInfo.checked,
      cabbinBaggage: baggageInfo.cabin,
      segments: [...outboundSegments, ...(returnSegments || [])], // Combined segments
     
    
      token: itinerary.itineraryInfo?.token,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    tickets.push(ticket)
  })

  return tickets
}
