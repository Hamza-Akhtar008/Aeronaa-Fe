"use client"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import axios from "axios"
import CheckoutProcess from "@/components/checkout-process"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Share2, Plane, ArrowRight, Clock, MapPin, Users, Package, Shield, CheckCircle, X, ChevronDown, ChevronUp } from 'lucide-react'
import { BookingFormData, FlightSegment, Ticket } from "@/types/checkout"
import Filters from "@/components/home/Filters"
import { useParams, useSearchParams } from "next/navigation"
import { FetchTicketDetails } from "@/lib/flight_api"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"
import { formatPrice } from "@/lib/utils/currency"

export default function FlightBookingPage() {
  const [showCheckout, setShowCheckout] = useState(false)
 const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAllSegments, setShowAllSegments] = useState(false)
  const [formData, setFormData] = useState<BookingFormData>({
    travelers: [
      {
        type: "adult", // default type
        firstName: "",
        middleName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "male", // or "female" / "other"
        email: "",
        phone: "",
        passportNumber: "",
        passportExpiry: "",
        issuingCountry: "United States",
        nationality: "United States",
      }
    ],
  });
  const [rapiddata, setRapid] = useState(false);

  // Filter states
  const [seatSelection, setSeatSelection] = useState(false);
  const [seatMap, setSeatMap] = useState(false);
  const [bagsRecheck, setBagsRecheck] = useState(false);
  const [passportRequired, setPassportRequired] = useState(false);
  const [minSeats, setMinSeats] = useState(1);
  const [maxSeats, setMaxSeats] = useState(99);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedCabin, setSelectedCabin] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [selectedAirports, setSelectedAirports] = useState<string[]>([]);
  const [carryOn, setCarryOn] = useState(0);
  const [checkedBag, setCheckedBag] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [durationRange, setDurationRange] = useState([0, 24 * 60]);

  const params = useParams();
  const searchParams = useSearchParams();
  const itineraryId = params?.id || "";
  const [token, setToken] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
     const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 });
  useEffect(() => {
      let country = localStorage.getItem("userCountry") || localStorage.getItem("usercountry") || sessionStorage.getItem("userCountry") || sessionStorage.getItem("usercountry");
      if (country) {
        const currency = getCurrencyByLocation(country);
        setSelectedCurrency(currency);
      } else {
        setSelectedCurrency("USD");
      }
    }, []);
  
    // Fetch exchange rates for selected currency
    useEffect(() => {

      if (selectedCurrency === "USD") {
        setExchangeRates({ USD: 1 });
        return;
      }
      const fetchRates = async () => {
        try {
          const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
          const data = await response.json();
          setExchangeRates({ ...data.rates, USD: 1 });
        } catch (error) {
          setExchangeRates({ USD: 1 });
        }
      };
      fetchRates();
      

    }, [selectedCurrency]);
  // Map API response to Ticket interface
  const mapApiToTicket = (apiData: any): Ticket|null => {
    const itinerary = apiData.itinerary;
    if(!itinerary)
    {
      return  null;
    }
    console.log("itinerary :  ",itinerary);
    const slices = itinerary.slices;

    const mapCabinName = (cabinName: string): "economy" | "business" | "first" => {
      const name = cabinName.toLowerCase();
      if (name.includes("business")) return "business";
      if (name.includes("first")) return "first";
      return "economy";
    };

    const mapSegments = (segments: any[], segmentType: "outbound" | "return", flightId: string) => {
      return segments.map((seg: any, index: number) => {
        const nextSeg = segments[index + 1];
        // Calculate layover if this isn't the last segment
        let layoverDuration: number | undefined;
        if (nextSeg) {
          const arrival = new Date(seg.arrivalTime).getTime();
          const nextDeparture = new Date(nextSeg.departureTime).getTime();
          layoverDuration = Math.floor((nextDeparture - arrival) / (1000 * 60)); // in minutes
        }

        // Map cabin
        const cabinName = seg.cabinName?.toLowerCase() || "";
        const cabinClass =
          cabinName.includes("first") ? "first" :
          cabinName.includes("business") ? "business" : "economy";

        return {
          id: String(seg.id),
          flightId,
          type: segmentType,
          segmentId: String(seg.id),
          flightNumber: String(seg.flightNumber),
          departureAirport: String(seg.origin.code),
          arrivalAirport: String(seg.destination.code),
          departurelocation: seg.origin.cityInfo?.name || '', // Ensure this field is mapped correctly in camelCase
          arrivallocation: seg.destination.cityInfo?.name || '', // Ensure this field is mapped correctly in camelCase
          departureTime: String(seg.departureTime),
          arrivalTime: String(seg.arrivalTime),
          flightDuration: Number(seg.duration),
          layoverDuration,
          aircraftType: seg.aircraft?.name || '',
          operatingCarrier: seg.operationAirline?.name || seg.airline?.name || '',
          marketingCarrier: seg.airline?.name || '',
          baggageRecheckRequired: Boolean(seg.bagsRecheckRequired),
          cabinClass: cabinClass as "economy" | "business" | "first",
        };
      });
    };

    const tripType = slices?.length === 2 ? "round-trip" : "one-way";
    const outboundSegments: FlightSegment[] = mapSegments(slices[0].segments, "outbound", itinerary.id);
    let returnSegments: FlightSegment[] = []; // Initialize as an empty array, just in case
    if (slices?.length === 2) {
      returnSegments = mapSegments(slices[1].segments, "return", itinerary.id);
    }

    const firstOutbound = slices[0].segments[0];
    const lastOutbound = slices[0].segments[slices[0].segments.length - 1];
    const returnFirst = returnSegments?.[0];
    const returnLast = returnSegments?.[returnSegments.length - 1];
console.log(itinerary.pricing);
    return {
      id: itinerary.id,
      tripType, // Keep camelCase
      from: firstOutbound.origin.cityInfo.name,
      to: lastOutbound.destination.cityInfo.name,
      departureDate: firstOutbound.departureTime,
      arrivalDate: lastOutbound.arrivalTime,
      returnDate: returnFirst?.departureTime,
      flightClass: mapCabinName(firstOutbound.cabinName),
      flightNumber: firstOutbound.flightNumber,
      departureAirport: firstOutbound.origin.code,
      arrivalAirport: lastOutbound.destination.code,
      departureTime: firstOutbound.departureTime,
      arrivalTime: lastOutbound.arrivalTime,
      airline: itinerary.ticketingAirline?.name,
      basePrice: itinerary.pricing.baseFare.value,
      taxPrice: itinerary.pricing.totalTaxes.value,
      totalPrice: itinerary.pricing.totalFare.value,
      currency: itinerary.pricing.baseFare.currency.code.toUpperCase(),
      cancellationAllowedUntill: itinerary.voidWindowClose, // Updated field name
      isRefundable: slices?.some((slice: { cancellationPolicies: { allowed: boolean }[] }) =>
        slice.cancellationPolicies.some((p: { allowed: boolean }) => p.allowed)
      ),
      cancellationPenalty: slices[0].cancellationPolicies?.[0]?.penalty?.value || 0,
      voidableUntil: itinerary.voidWindowClose, // Keep camelCase
      passengerType: "Adult", // Placeholder, can enhance later using apiData.passengers
      passportRequired: itinerary.passportRequired,
      seatSelectionAllowed: slices[0].segments[0].seatMapAvailable,
      recheckBagsRequired: slices?.flatMap((s: { segments: { bagsRecheckRequired: boolean }[] }) =>
        s.segments
      ).some((seg: { bagsRecheckRequired: boolean }) => seg.bagsRecheckRequired),
      checkedBaggage: "Included", // Placeholder, can enhance if needed
      cabbinBaggage: "Included", // Placeholder, can enhance if needed
      segments: [...outboundSegments, ...(returnSegments || [])],
      token: itinerary.token,
    };
  };

  // useEffect for handling session storage data on initial load and fetching ticket data
useEffect(() => {
  setLoading(true);
  let dataLoadedFromSession = false;

  const storedBookingFormData = sessionStorage.getItem("bookingFormData");
  const storedTicketData = sessionStorage.getItem("ticketData");

  if (storedBookingFormData && storedTicketData) {
    try {
      const parsedFormData: BookingFormData = JSON.parse(storedBookingFormData);
      const parsedTicket: Ticket = JSON.parse(storedTicketData);

      setFormData(parsedFormData);
      setTicket(parsedTicket);
      setShowCheckout(true);
      dataLoadedFromSession = true;
    } catch (e) {
      console.error("Failed to parse session storage data:", e);
    }
  }

  if (!dataLoadedFromSession) {
    const fetchTicket = async (token: string) => {
      try {
        setLoading(true);
        const decodedItineraryId =
          typeof itineraryId === "string" ? decodeURIComponent(itineraryId) : "";
        const response = await axios.get("https://agoda-com.p.rapidapi.com/flights/details", {
          params: { itineraryId: decodedItineraryId, token },
          headers: {
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
            "x-rapidapi-host": "agoda-com.p.rapidapi.com",
          },
        });
        if (response && response.data) {
          const mappedTicket = mapApiToTicket(response.data);
          setTicket(mappedTicket);
        } else {
          setError("Failed to fetch flight details");
        }
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError("Error loading flight information");
      } finally {
        setLoading(false);
      }
    };

    const fetchTicketfromdb = async () => {
      try {
        setLoading(true);
        const response = await FetchTicketDetails({ id: itineraryId });
        setTicket(response);
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError("Error loading flight information");
      } finally {
        setLoading(false);
      }
    };

    const storedToken = localStorage.getItem("flight_token");
    const isApi = localStorage.getItem("api") === "true";
    if (storedToken && isApi) {
      setToken(storedToken);
      fetchTicket(storedToken);
      setRapid(true);
    } else {
      fetchTicketfromdb();
    }
  }
}, [itineraryId]);
 // Dependency on itineraryId

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getClassColor = (classType: string) => {
    switch (classType.toLowerCase()) {
      case "economy": return "bg-[#0a3a7a] text-white border-blue-200"
      case "business": return "bg-purple-50 text-purple-600 border-purple-200"
      case "first": return "bg-amber-50 text-amber-600 border-amber-200"
      default: return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  const calculateDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure)
    const arr = new Date(arrival)
    const diff = arr.getTime() - dep.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const formatMinutes = (minutes: number | undefined) => {
    if (!minutes || minutes <= 0) return "No layover";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}m` : ''}`;
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(value);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flight details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <Plane className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Flight</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

 

  if (!ticket 
    
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Flight Not Found</h2>
          <p className="text-gray-600">The requested flight ticket could not be found.</p>
        </div>
      </div>
    )
  }

  // If showCheckout is true (either from initial load or button click), render CheckoutProcess
  if (showCheckout) {
    return <CheckoutProcess onBack={() => setShowCheckout(false)} formdata={formData} ticket={ticket} />
  }

  // Get flight search params from session storage
  let flightSearchParams = {};
  if (typeof window !== "undefined") {
    const paramsStr = window.sessionStorage.getItem("flightSearchParams");
    if (paramsStr) {
      try {
        flightSearchParams = JSON.parse(paramsStr);
      } catch {}
    }
  }

  return (
    <div className="w-full max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4  bg-[#fafbfc]">
      <div className="w-full">
        <div className="mb-3">
     
          <Filters
            initialValues={{
              ...flightSearchParams,
              stops: selectedStops,
              airlines: selectedAirlines,
              cabin: selectedCabin,
              duration: selectedDuration,
              airports: selectedAirports,
              priceRange,
              durationRange,
              carryOn,
              checkedBag,
              seatSelection,
              seatMap,
              bagsRecheck,
              passportRequired,
              minSeats,
              maxSeats
            }}
            onChange={(updated) => {
              if (updated.location !== undefined) {/* handle location change if needed */}
              if (updated.dates !== undefined) {/* handle dates change if needed */}
              if (updated.guests !== undefined) {/* handle guests change if needed */}
              if (updated.stops !== undefined) setSelectedStops(updated.stops);
              if (updated.airlines !== undefined) setSelectedAirlines(updated.airlines);
              if (updated.cabin !== undefined) setSelectedCabin(updated.cabin);
              if (updated.duration !== undefined) setSelectedDuration(updated.duration);
              if (updated.airports !== undefined) setSelectedAirports(updated.airports);
              if (updated.priceRange !== undefined) setPriceRange(updated.priceRange);
              if (updated.durationRange !== undefined) setDurationRange(updated.durationRange);
              if (updated.carryOn !== undefined) setCarryOn(updated.carryOn);
              if (updated.checkedBag !== undefined) setCheckedBag(updated.checkedBag);
              if (updated.seatSelection !== undefined) setSeatSelection(updated.seatSelection);
              if (updated.seatMap !== undefined) setSeatMap(updated.seatMap);
              if (updated.bagsRecheck !== undefined) setBagsRecheck(updated.bagsRecheck);
              if (updated.passportRequired !== undefined) setPassportRequired(updated.passportRequired);
              if (updated.minSeats !== undefined) setMinSeats(updated.minSeats);
              if (updated.maxSeats !== undefined) setMaxSeats(updated.maxSeats);
            }}
            tabValue="flights"
          />
        </div>
        {/* Header */}
        {/* <div className="bg-[#0a3a7a] text-white py-6 mt-6">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Flight Booking</h1>
                <p className="text-blue-100">{ticket.from} to {ticket.to} • {format(new Date(ticket.departureDate), "MMM dd, yyyy")}</p>
              </div>
              <div className="flex gap-3">
               
                <Button
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-1.5 px-4 shadow-md hover:from-blue-600 hover:to-indigo-600"
                  onClick={() => setShowCheckout(true)}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div> */}
        {/* Main Content */}
        <div className="w-full max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4  py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Flight Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trip Summary */}
              <Card className="shadow-lg border-none rounded-sm bg-white backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <div>
                      <Button className=" bg-[#0a3a7a] text-white hover:bg-[#0a3a7a]/80">{ticket.tripType.toLocaleUpperCase()}</Button>
                      {/* <p className="text-gray-600">{ticket.flightClass} • {ticket.passengerType}</p> */}
                    </div>
                    <Badge variant="outline" className={`${getClassColor(ticket.flightClass)}  text-sm md:text-base rounded-none`}>
                      {ticket.flightClass.toLocaleUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6">
                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-[#0a3a7a]" />
                        <span className="text-xl sm:text-2xl font-bold text-gray-900">{ticket.from}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">{ticket.departureAirport}</p>
                    </div>
                    <div className="flex items-center gap-2 text-blue-500">
                      <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-[#0a3a7a]" />
                      <Plane className="h-4 w-4 sm:h-5 sm:w-5 text-[#0a3a7a]" />
                      <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-[#0a3a7a]" />
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-[#0a3a7a]" />
                        <span className="text-xl sm:text-2xl font-bold text-gray-900">{ticket.to}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">{ticket.arrivalAirport}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="text-center p-3 ">
                      <Clock className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-gray-600">Duration</p>
                      <p className="font-semibold">{calculateDuration(ticket.departureTime, ticket.arrivalTime)}</p>
                    </div>
                    <div className="text-center p-3 ">
                      <Users className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-gray-600">Passenger</p>
                      <p className="font-semibold">{ticket.passengerType}</p>
                    </div>
                    <div className="text-center p-3 ">
                      <Plane className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-gray-600">Flight</p>
                      <p className="font-semibold">{ticket.flightNumber}</p>
                    </div>
                    <div className="text-center p-3">
                      <Package className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-gray-600">Baggage</p>
                      <p className="font-semibold">{ticket.checkedBaggage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Flight Details */}
              <Card className="shadow-lg border-0  backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Flight Details</h3>
                    <div className="text-sm text-gray-500">
                      {ticket.segments.filter(segment => segment.type === "outbound").length} outbound segment
                      {ticket.segments.filter(segment => segment.type === "outbound").length > 1 ? 's' : ''}
                    </div>
                  </div>
                  {ticket.segments.filter(segment => segment.type === "outbound").slice(0, showAllSegments ? undefined : 1).map((segment, index) => (
                    <div key={segment.segmentId} className="border-none  p-4 mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1">
                            <div className="bg-gray-100 p-1 rounded">
                              <img src={`https://img.agoda.net/images/mvc/default/airlines/${segment.marketingCarrier?.slice(0, 2).toUpperCase() || 'UA'}.png`} alt={segment.marketingCarrier} className="h-6 w-6 object-contain" />
                            </div>
                            <span className="font-medium">{segment.marketingCarrier}</span>
                          </div>
                          <Badge variant="outline" className="bg-blue-50  border-blue-200 rounded-none">
                            {segment.marketingCarrier} {segment.flightNumber}
                          </Badge>
                         
                            <Badge variant="outline" className={`${getClassColor(segment.cabinClass)}  text-sm md:text-base rounded-none`}>
                      {segment.cabinClass.toLocaleUpperCase()}
                    </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{format(new Date(segment.departureTime), "EEE, MMM dd")}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div className="text-center mb-4 sm:mb-0 sm:text-left">
                          <p className="text-xl  text-gray-900">{format(new Date(segment.departureTime), "HH:mm")}</p>
                          <p className="text-sm font-medium text-gray-900">{segment.departureAirport}</p>
                          <p className="text-xs text-gray-500">{segment.departurelocation}</p>
                        </div>
                        <div className="flex-1 mx-0 sm:mx-4 my-2 sm:my-0 w-full sm:w-auto">
                         <div className="flex items-center justify-center gap-2 mb-1">
  {/* Left line with circle */}
  <div className="relative flex-1 h-1 bg-[#0a3a7a]">
    <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#0a3a7a] bg-white"></span>
  </div>

  {/* Plane icon */}
  <Plane className="h-4 w-4 text-[#0a3a7a]" />

  {/* Right line with circle */}
  <div className="relative flex-1 h-1 bg-[#0a3a7a]">
    <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#0a3a7a] bg-white"></span>
  </div>
</div>
                          <div className="text-center text-sm text-gray-600">
                            {calculateDuration(segment.departureTime, segment.arrivalTime)}
                            {segment.aircraftType && (
                              <div className="mt-1 text-xs text-gray-500">{segment.aircraftType}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-center sm:text-right">
                          <p className="text-xl  text-gray-900">{format(new Date(segment.arrivalTime), "HH:mm")}</p>
                          <p className="text-sm font-medium text-gray-900">{segment.arrivalAirport}</p>
                          <p className="text-xs text-gray-500">{segment.arrivallocation}</p>
                        </div>
                      </div>
                      {index < ticket.segments.filter(segment => segment.type === "outbound").length - 1 && segment.layoverDuration !== undefined && (
                        <div className="mt-4 pt-3  text-center text-sm text-gray-500">
                          Layover at {segment.arrivalAirport}: {formatMinutes(segment.layoverDuration)}
                        </div>
                      )}
                    </div>
                  ))}
                  {ticket.segments.filter(segment => segment.type === "outbound").length > 1 && (
                    <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2"
                      onClick={() => setShowAllSegments(!showAllSegments)}>
                      {showAllSegments ? (
                        <><ChevronUp className="h-4 w-4" /> Show fewer segments</>
                      ) : (
                        <><ChevronDown className="h-4 w-4" /> Show all outbound segments</>
                      )}
                    </Button>
                  )}
                </CardContent>
                {ticket.segments.filter(segment => segment.type === "return").length > 0 && (
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Return Flight Details</h3>
                      <div className="text-sm text-gray-500">
                        {ticket.segments.filter(segment => segment.type === "return").length} return segment
                        {ticket.segments.filter(segment => segment.type === "return").length > 1 ? 's' : ''}
                      </div>
                    </div>
                    {ticket.segments.filter(segment => segment.type === "return").slice(0, showAllSegments ? undefined : 1).map((segment, index) => (
                      <div key={segment.segmentId} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1">
                              <div className="bg-gray-100 p-1 rounded">
                                <img src={`https://img.agoda.net/images/mvc/default/airlines/${segment.marketingCarrier?.slice(0, 2).toUpperCase() || 'UA'}.png`} alt={segment.marketingCarrier} className="h-6 w-6 object-contain" />
                              </div>
                              <span className="font-medium">{segment.marketingCarrier}</span>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                              {segment.marketingCarrier} {segment.flightNumber}
                            </Badge>
                            <Badge variant="outline" className={getClassColor(segment.cabinClass)}>
                              {segment.cabinClass}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{format(new Date(segment.departureTime), "EEE, MMM dd")}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-between">
                          <div className="text-center mb-4 sm:mb-0 sm:text-left">
                            <p className="text-xl font-bold text-gray-900">{format(new Date(segment.departureTime), "HH:mm")}</p>
                            <p className="text-sm font-medium text-gray-900">{segment.departureAirport}</p>
                            <p className="text-xs text-gray-500">{segment.arrivallocation}</p>
                          </div>
                          <div className="flex-1 mx-0 sm:mx-4 my-2 sm:my-0 w-full sm:w-auto">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <div className="h-px flex-1 bg-gray-300"></div>
                              <Plane className="h-4 w-4 text-gray-400" />
                              <div className="h-px flex-1 bg-gray-300"></div>
                            </div>
                            <div className="text-center text-sm text-gray-600">
                              {calculateDuration(segment.departureTime, segment.arrivalTime)}
                              {segment.aircraftType && (
                                <div className="mt-1 text-xs text-gray-500">{segment.aircraftType}</div>
                              )}
                            </div>
                          </div>
                          <div className="text-center sm:text-right">
                            <p className="text-xl font-bold text-gray-900">{format(new Date(segment.arrivalTime), "HH:mm")}</p>
                            <p className="text-sm font-medium text-gray-900">{segment.arrivalAirport}</p>
                            <p className="text-xs text-gray-500">{segment.arrivallocation}</p>
                          </div>
                        </div>
                        {index < ticket.segments.filter(segment => segment.type === "return").length - 1 && segment.layoverDuration !== undefined && (
                          <div className="mt-4 pt-3 border-t border-gray-100 text-center text-sm text-gray-500">
                            Layover at {segment.arrivalAirport}: {formatMinutes(segment.layoverDuration)}
                          </div>
                        )}
                      </div>
                    ))}
                    {ticket.segments.filter(segment => segment.type === "return").length > 1 && (
                      <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2"
                        onClick={() => setShowAllSegments(!showAllSegments)}>
                        {showAllSegments ? (
                          <><ChevronUp className="h-4 w-4" /> Show fewer segments</>
                        ) : (
                          <><ChevronDown className="h-4 w-4" /> Show all return segments</>
                        )}
                      </Button>
                    )}
                  </CardContent>
                )}
              </Card>
              {/* Baggage & Policies */}
              <Card className="shadow-lg border-none">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Baggage & Policies</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4 text-[#0a3a7a]" />
                        Baggage Allowance
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2  ">
                          <span className="text-gray-600">Checked Baggage:</span>
                          <span className="font-medium">{ticket.checkedBaggage}</span>
                        </div>
                        <div className="flex justify-between p-2 ">
                          <span className="text-gray-600">Cabin Baggage:</span>
                          <span className="font-medium">{ticket.cabbinBaggage}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-teal-500" />
                        Travel Policies
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 p-2 ">
                          {ticket.isRefundable ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span className={ticket.isRefundable ? "text-green-700" : "text-red-700"}>
                            {ticket.isRefundable ? "Refundable" : "Non-refundable"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 p-2 ">
                          {ticket.seatSelectionAllowed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span className={ticket.seatSelectionAllowed ? "text-green-700" : "text-red-700"}>
                            Seat Selection {ticket.seatSelectionAllowed ? "Available" : "Not Available"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 p-2 ">
                          {ticket.passportRequired ? (
                            <CheckCircle className="h-4 w-4 text-orange-500" />
                          ) : (
                            <X className="h-4 w-4 text-green-500" />
                          )}
                          <span className={ticket.passportRequired ? "text-orange-700" : "text-green-700"}>
                            Passport {ticket.passportRequired ? "Required" : "Not Required"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Right Column - Booking Summary */}
           <div className="lg:col-span-1">
  <Card className="sticky top-4 border-none shadow-lg rounded-xl">
    <CardContent className="p-6">
      <div className="space-y-6">
        {/* Price Breakdown */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Fare</span>
                     
              
              <span className="font-medium">{formatPrice(Math.ceil(ticket.basePrice) * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes & Fees</span>
              <span className="font-medium">
                {formatPrice(Math.ceil(ticket.taxPrice) * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className=" text-gray-900">Total</span>
                <span className=" font-bold text-[#0a3a7a]">
                {formatPrice(Math.ceil(ticket.totalPrice) * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}

                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Flight Summary */}
        <div className="  pt-6">
          <h4 className="font-medium text-gray-900 mb-3">Flight Summary</h4>
          <div className="bg-white p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Route:</span>
              <span className="font-medium">{ticket.from} → {ticket.to}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{format(new Date(ticket.departureDate), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{format(new Date(ticket.departureTime), "HH:mm")} -{" "}{format(new Date(ticket.arrivalTime), "HH:mm")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Airline:</span>
              <span className="font-medium">{ticket.airline}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Class:</span>
              <span className="font-medium capitalize">{ticket.flightClass}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Flight #:</span>
              <span className="font-medium">{ticket.flightNumber}</span>
            </div>
          </div>
        </div>
        {/* Cancellation Policy */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-medium text-gray-900 mb-3">Cancellation Policy</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Cancellation allowed until:</span>
              <span className="font-medium">{format(new Date(ticket.cancellationAllowedUntill), "MMM dd, yyyy HH:mm")}</span>
            </div>
            <div className="flex justify-between">
              <span>Cancellation penalty:</span>
              <span className="font-medium">
                {ticket.cancellationPenalty > 0
                  ? formatCurrency(ticket.cancellationPenalty, ticket.currency)
                  : "None"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Voidable until:</span>
              <span className="font-medium">{format(new Date(ticket.voidableUntil), "MMM dd, yyyy HH:mm")}</span>
            </div>
          </div>
        </div>
        {/* Checkout Button */}
        <Button
          className="w-full bg-[#0a3a7a] hover:bg-[#0a3a7a]/95 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => {
            setShowCheckout(true);
            sessionStorage.setItem("rapiddata", String(rapiddata));
          }}>
          Continue to Checkout
        </Button>
      </div>
    </CardContent>
  </Card>
</div>

          </div>
        </div>
      </div>
    </div>
  )
}
