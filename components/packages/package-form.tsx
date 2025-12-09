"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Eye, Loader2, AlertCircle } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { BasicDetailsSection } from "./form-sections/basic-details-section"
import { AccommodationSection } from "./form-sections/accommodation-section"
import { ReligiousServicesSection } from "./form-sections/religious-services-section"
import { PricingSection } from "./form-sections/pricing-section"
import { AdditionalInfoSection } from "./form-sections/additional-info-section"
import { UploadsSection } from "./form-sections/uploads-section"
import { TransportSection } from "./form-sections/transport-section"
import { FlightDetailsSection } from "./form-sections/flight-details-section"
import { EditUmrahPackage, GetUmrahPakage, PostUmrahPakage } from "@/lib/umrah_api"


export interface PackageFormData {
  // Basic Details
  packageName: string
  packageCode: string
  packageType: string
  duration: number
  season: string
  startDate: string
  endDate: string
  citiesCovered: string[]
  shortDescription: string
  fullDescription: string

  // Accommodation
  makkahHotelName: string
  makkahHotelRating: number
  makkahHotelDistance: number
  madinahHotelName: string
  madinahHotelRating: number
  madinahHotelDistance: number
  roomTypes: string[]
  mealsIncluded: string[]

  // Transport
  flightIncluded: boolean
  airportTransfers: boolean
  intercityTransport: string
  ziyaratTours: boolean
  ziyaratLocations: string[]

  // Religious Services
  guidedTour: boolean
  umrahVisa: boolean
  ritualAssistance: boolean

  // Pricing
  singlePricing:number
  doubleSharingPrice: number
  tripleSharingPrice: number
  quadSharingPrice: number
  currency: string
  discountAvailable: boolean
  discountPercentage: number
  paymentTerms: string
  cancellationPolicy: string

  // Additional Info
  includedExtras: string[]
  specialNeedsSupport: string
  vendorNotes: string

  // Flight Details (only relevant when flightIncluded is true)
  flightTentativeDate: string
  returnFlightDate: string
  airlineName: string
  flightClass: string
  routeType: string
  departureCity: string
  arrivalCity: string
  fromAirport: string
  toAirport: string
  viaCity: string
  flightDuration: string
  flightNotes: string

  // Uploads
  coverImage: File | null
  hotelImages: File[]
}

const initialFormData: PackageFormData = {
  packageName: "",
  packageCode: "",
  packageType: "",
  duration: 0,
  season: "",
  startDate: "",
  endDate: "",
  citiesCovered: [],
  shortDescription: "",
  fullDescription: "",
  makkahHotelName: "",
  makkahHotelRating: 0,
  makkahHotelDistance: 0,
  madinahHotelName: "",
  madinahHotelRating: 0,
  madinahHotelDistance: 0,
  roomTypes: [],
  mealsIncluded: [],
  flightIncluded: false,
  airportTransfers: false,
  intercityTransport: "",
  ziyaratTours: false,
  ziyaratLocations: [],
  guidedTour: false,
  umrahVisa: false,
  ritualAssistance: false,
  singlePricing: 0,
  doubleSharingPrice: 0,
  tripleSharingPrice: 0,
  quadSharingPrice: 0,
  currency: "USD",
  discountAvailable: false,
  discountPercentage: 0,
  paymentTerms: "",
  cancellationPolicy: "",
  includedExtras: [],
  specialNeedsSupport: "",
  vendorNotes: "",
  flightTentativeDate: "",
  returnFlightDate: "",
  airlineName: "",
  flightClass: "",
  routeType: "direct",
  departureCity: "",
  arrivalCity: "",
  fromAirport: "",
  toAirport: "",
  viaCity: "",
  flightDuration: "",
  flightNotes: "",
  coverImage: null,
  hotelImages: [],
}

interface ValidationErrors {
  [key: string]: string
}
interface PackageFormProps {
  packageId?: string  // optional, if provided → edit mode
}
interface PackageState {
  coverImage: string
  hotelImages: string[]
}
export function PackageForm({ packageId }: PackageFormProps) {
  const [formData, setFormData] = useState<PackageFormData>(initialFormData)
  const [activeTab, setActiveTab] = useState("basic")
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
const [isFetching, setIsFetching] = useState(false)
const [pakage,setPackage]=useState<PackageState>({
  coverImage:"",
  hotelImages:[],

});

const formatDateForInput = (dateString?: string) => {
  if (!dateString) return ""
  const d = new Date(dateString)
  return d.toISOString().split("T")[0]  // "2025-08-26"
}
  useEffect(() => {
  if (!packageId) return

  const fetchPackage = async () => {
    try {
     setIsFetching(true)
      const response = await GetUmrahPakage(packageId) // API call
      const packageData = response  // adjust based on API response structure
setPackage(response);
      // Transform API response -> PackageFormData shape
      const formatted: PackageFormData = {
        packageName: packageData.packageName || "",
        packageCode: packageData.packageCode || "",
        packageType: packageData.packageType || "",
        duration: packageData.duration || 0,
        season: packageData.season || "",
        startDate: formatDateForInput(packageData.startDate) || "",
        endDate: formatDateForInput(packageData.endDate) || "",
        citiesCovered: packageData.citiesCovered || [],
        shortDescription: packageData.shortDescription || "",
        fullDescription: packageData.longDescription || "",
        makkahHotelName: packageData.makkahHotelName || "",
        makkahHotelRating: packageData.makkahStarRating || 0,
        makkahHotelDistance: packageData.distanceFromHaram || 0,
        madinahHotelName: packageData.medinaHotelName || "",
        madinahHotelRating: packageData.medinaStarRating || 0,
        madinahHotelDistance: packageData.distanceFromMasjidNabwi || 0,
        roomTypes: packageData.roomTypes ? packageData.roomTypes.split(",") : [],
        mealsIncluded: packageData.mealsIncluded || [],
        flightIncluded: packageData.flightIncluded === 1,
        airportTransfers: packageData.airportTransfersIncluded === 1,
        intercityTransport: packageData.interCityTransportType || "",
        ziyaratTours: packageData.ziyaratIncluded === 1,
        ziyaratLocations: packageData.ziyaratLocations || [],
        guidedTour: packageData.religiousServicesIncluded?.includes("Guided Tour") || false,
        umrahVisa: packageData.religiousServicesIncluded?.includes("Umrah Visa") || false,
        ritualAssistance: packageData.religiousServicesIncluded?.includes("Ritual Assistance") || false,
        singlePricing:packageData.singlePricing || 0,
        doubleSharingPrice: packageData.doubleSharingPrice || 0,
        tripleSharingPrice: packageData.trippleSharingPrice || 0,
        quadSharingPrice: packageData.quadSharingPrice || 0,
        currency: packageData.currency || "USD",
        discountAvailable: packageData.discountPercent > 0,
        discountPercentage: packageData.discountPercent || 0,
        paymentTerms: packageData.paymentTerms || "",
        cancellationPolicy: packageData.refundPolicy || "",
        includedExtras: packageData.extrasIncluded || [],
        specialNeedsSupport: packageData.specialNotes || "",
        vendorNotes: packageData.vendorNotes || "",
        flightTentativeDate: formatDateForInput(packageData.tentativeDepartureDate) || "",
        returnFlightDate: formatDateForInput(packageData.tentativeReturnDate) || "",
        airlineName: packageData.airLineName || "",
        flightClass: packageData.flightClass || "",
        routeType: packageData.routeType || "direct",
        departureCity: packageData.departureCity || "",
        arrivalCity: packageData.arrivalCity || "",
        fromAirport: packageData.fromAirport || "",
        toAirport: packageData.toAirport || "",
        viaCity: packageData.viaCity || "",
        flightDuration: String(packageData.flightDuration || ""),
        flightNotes: packageData.flightNotes || "",
        coverImage: null,  // ⚠️ API likely returns URL, not File
        hotelImages: [],   // ⚠️ Same here – you may handle separately
      }

      setFormData(formatted)
    } catch (err) {
      toast.error("Failed to fetch package details")
      console.log(err);
    } finally {
       setIsFetching(false)
    }
  }

  fetchPackage()
}, [packageId])
  const updateFormData = (updates: Partial<PackageFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
    if (Object.keys(validationErrors).length > 0) {
      const newErrors = { ...validationErrors }
      Object.keys(updates).forEach((key) => {
        delete newErrors[key]
      })
      setValidationErrors(newErrors)
    }
  }

  const transformFormDataToAPI = (data: PackageFormData) => {
    const formData = new FormData()

    formData.append("packageName", data.packageName)
    formData.append("packageCode", data.packageCode)
    formData.append("packageType", data.packageType)
    formData.append("duration", String(data.duration))
    formData.append("startDate", data.startDate ? new Date(data.startDate).toISOString() : new Date().toISOString())
    formData.append("endDate", data.endDate ? new Date(data.endDate).toISOString() : new Date().toISOString())

    if (data.citiesCovered && data.citiesCovered.length > 0) {
      data.citiesCovered.forEach((city) => {
        formData.append("citiesCovered[]", city)
      })
    }
    formData.append("shortDescription", data.shortDescription)
    formData.append("longDescription", data.fullDescription)
    formData.append("makkahHotelName", data.makkahHotelName)
    formData.append("makkahStarRating", data.makkahHotelRating.toString())
    formData.append("distanceFromHaram", String(data.makkahHotelDistance))
    formData.append("medinaHotelName", data.madinahHotelName)
    formData.append("medinaStarRating", data.madinahHotelRating.toString())
    formData.append("distanceFromMasjidNabwi", String(data.madinahHotelDistance))

    formData.append("roomTypes", data.roomTypes.join(", "))

    if (data.mealsIncluded && data.mealsIncluded.length > 0) {
      data.mealsIncluded.forEach((meal) => {
        formData.append("mealsIncluded[]", meal)
      })
    }
    formData.append("flightIncluded", data.flightIncluded ? "1" : "0")

    formData.append("airportTransfersIncluded", data.airportTransfers ? "1" : "0")
    formData.append("interCityTransportType", data.intercityTransport)
    formData.append("ziyaratIncluded", data.ziyaratTours ? "1" : "0")

    formData.append(
      "tentativeDepartureDate",
      data.flightTentativeDate ? new Date(data.flightTentativeDate).toISOString() : new Date().toISOString(),
    )
    formData.append(
      "tentativeReturnDate",
      data.returnFlightDate ? new Date(data.returnFlightDate).toISOString() : new Date().toISOString(),
    )

    formData.append("airLineName", data.airlineName)
    formData.append("flightClass", data.flightClass)
    formData.append("routeType", data.routeType)
    formData.append("departureCity", data.departureCity)
    formData.append("arrivalCity", data.arrivalCity)
    formData.append("fromAirport", data.fromAirport)
    formData.append("toAirport", data.toAirport)
    formData.append("flightDuration", String(Number.parseInt(data.flightDuration) || 0))
    formData.append("flightNotes", data.flightNotes)

    formData.append("currency", data.currency)
    formData.append("singlePricing", String(data.singlePricing ))
    formData.append("doubleSharingPrice", String(data.doubleSharingPrice))
    formData.append("trippleSharingPrice", String(data.tripleSharingPrice))
    formData.append("quadSharingPrice", String(data.quadSharingPrice))
    formData.append("discountPercent", String(data.discountPercentage))
    formData.append("refundPolicy", data.cancellationPolicy)
    formData.append("paymentTerms", data.paymentTerms)
    formData.append("specialNotes", data.specialNeedsSupport)
    formData.append("vendorNotes", data.vendorNotes)

    if (data.includedExtras && data.includedExtras.length > 0) {
      data.includedExtras.forEach((meal) => {
        formData.append("extrasIncluded[]", meal)
      })
    }
    ;[
      ...(data.guidedTour ? ["Guided Tour"] : []),
      ...(data.umrahVisa ? ["Umrah Visa"] : []),
      ...(data.ritualAssistance ? ["Ritual Assistance"] : []),
    ].forEach((service) => {
      formData.append("religiousServicesIncluded[]", service)
    })

    if (data.coverImage) {
      console.log("Appending cover image:", data.coverImage)
      formData.append("coverImage", data.coverImage)
    }else if(packageId)
    {
      
      formData.append("coverImage", pakage.coverImage)
    }

    if (data.hotelImages && data.hotelImages.length > 0) {
      console.log("Appending hotel image:", data.hotelImages)

     data.hotelImages.forEach((img: File) => {
  formData.append("hotelImages", img)
})
      
    }
  if(packageId && pakage?.hotelImages?.length>0)
{
   pakage.hotelImages.forEach((img:any) => {
        formData.append("hotelImages[]", img)
      })
     


}  

    return formData
  }

  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {}

    if (!formData.packageName.trim()) errors.packageName = "Package name is required"
    if (!formData.packageCode.trim()) errors.packageCode = "Package code is required"
    if (!formData.packageType.trim()) errors.packageType = "Package type is required"
    if (!formData.duration || formData.duration <= 0) errors.duration = "Duration must be greater than 0"
 
    if (!formData.startDate) errors.startDate = "Start date is required"
    if (!formData.endDate) errors.endDate = "End date is required"
    if (!formData.citiesCovered.length) errors.citiesCovered = "At least one city must be covered"
    if (!formData.shortDescription.trim()) errors.shortDescription = "Short description is required"
    if (!formData.fullDescription.trim()) errors.fullDescription = "Full description is required"

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      if (endDate <= startDate) {
        errors.endDate = "End date must be after start date"
      }
    }

    if (!formData.makkahHotelName.trim()) errors.makkahHotelName = "Makkah hotel name is required"
    if (!formData.makkahHotelRating || formData.makkahHotelRating <= 0)
      errors.makkahHotelRating = "Makkah hotel rating is required"
    if (formData.makkahHotelDistance < 0) errors.makkahHotelDistance = "Distance cannot be negative"
    if (!formData.madinahHotelName.trim()) errors.madinahHotelName = "Madinah hotel name is required"
    if (!formData.madinahHotelRating || formData.madinahHotelRating <= 0)
      errors.madinahHotelRating = "Madinah hotel rating is required"
    if (formData.madinahHotelDistance < 0) errors.madinahHotelDistance = "Distance cannot be negative"
    if (!formData.roomTypes.length) errors.roomTypes = "At least one room type is required"
    if (!formData.mealsIncluded.length) errors.mealsIncluded = "Meal information is required"

    if (!formData.intercityTransport.trim()) errors.intercityTransport = "Intercity transport type is required"

    if (formData.flightIncluded) {
      if (!formData.flightTentativeDate)
        errors.flightTentativeDate = "Flight tentative date is required when flight is included"
      if (!formData.returnFlightDate) errors.returnFlightDate = "Return flight date is required when flight is included"
      if (!formData.airlineName.trim()) errors.airlineName = "Airline name is required when flight is included"
      if (!formData.flightClass.trim()) errors.flightClass = "Flight class is required when flight is included"
      if (!formData.routeType.trim()) errors.routeType = "Route type is required when flight is included"
      if (!formData.departureCity.trim()) errors.departureCity = "Departure city is required when flight is included"
      if (!formData.arrivalCity.trim()) errors.arrivalCity = "Arrival city is required when flight is included"
      if (!formData.flightDuration.trim()) errors.flightDuration = "Flight duration is required when flight is included"

      if (formData.flightTentativeDate && formData.returnFlightDate) {
        const flightDate = new Date(formData.flightTentativeDate)
        const returnDate = new Date(formData.returnFlightDate)
        if (returnDate <= flightDate) {
          errors.returnFlightDate = "Return flight date must be after departure date"
        }
      }

      if (formData.routeType === "connecting" && !formData.viaCity.trim()) {
        errors.viaCity = "Via city is required for connecting flights"
      }
    }
    if  (!formData.singlePricing || formData.singlePricing <= 0)
      errors.singlePricing = "Single sharing price is required"

    if (!formData.doubleSharingPrice || formData.doubleSharingPrice <= 0)
      errors.doubleSharingPrice = "Double sharing price is required"
    if (!formData.tripleSharingPrice || formData.tripleSharingPrice <= 0)
      errors.tripleSharingPrice = "Triple sharing price is required"
    if (!formData.quadSharingPrice || formData.quadSharingPrice <= 0)
      errors.quadSharingPrice = "Quad sharing price is required"
    if (!formData.currency.trim()) errors.currency = "Currency is required"
    if (!formData.paymentTerms.trim()) errors.paymentTerms = "Payment terms are required"
    if (!formData.cancellationPolicy.trim()) errors.cancellationPolicy = "Cancellation policy is required"

    if (formData.discountAvailable && (!formData.discountPercentage || formData.discountPercentage <= 0)) {
      errors.discountPercentage = "Discount percentage is required when discount is available"
    }

    if (!formData.coverImage) errors.coverImage = "Cover image is required";
    if (formData.hotelImages.length<1) errors.hotelImages = "Hotel images is required";


    return errors
  }
 const validateFormEdit = (): ValidationErrors => {
    const errors: ValidationErrors = {}

    if (!formData.packageName.trim()) errors.packageName = "Package name is required"
    if (!formData.packageCode.trim()) errors.packageCode = "Package code is required"
    if (!formData.packageType.trim()) errors.packageType = "Package type is required"
    if (!formData.duration || formData.duration <= 0) errors.duration = "Duration must be greater than 0"

    if (!formData.startDate) errors.startDate = "Start date is required"
    if (!formData.endDate) errors.endDate = "End date is required"
    if (!formData.citiesCovered.length) errors.citiesCovered = "At least one city must be covered"
    if (!formData.shortDescription.trim()) errors.shortDescription = "Short description is required"
    if (!formData.fullDescription.trim()) errors.fullDescription = "Full description is required"

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      if (endDate <= startDate) {
        errors.endDate = "End date must be after start date"
      }
    }

    if (!formData.makkahHotelName.trim()) errors.makkahHotelName = "Makkah hotel name is required"
    if (!formData.makkahHotelRating || formData.makkahHotelRating <= 0)
      errors.makkahHotelRating = "Makkah hotel rating is required"
    if (formData.makkahHotelDistance < 0) errors.makkahHotelDistance = "Distance cannot be negative"
    if (!formData.madinahHotelName.trim()) errors.madinahHotelName = "Madinah hotel name is required"
    if (!formData.madinahHotelRating || formData.madinahHotelRating <= 0)
      errors.madinahHotelRating = "Madinah hotel rating is required"
    if (formData.madinahHotelDistance < 0) errors.madinahHotelDistance = "Distance cannot be negative"
    if (!formData.roomTypes.length) errors.roomTypes = "At least one room type is required"
    if (!formData.mealsIncluded.length) errors.mealsIncluded = "Meal information is required"

    if (!formData.intercityTransport.trim()) errors.intercityTransport = "Intercity transport type is required"

    if (formData.flightIncluded) {
      if (!formData.flightTentativeDate)
        errors.flightTentativeDate = "Flight tentative date is required when flight is included"
      if (!formData.returnFlightDate) errors.returnFlightDate = "Return flight date is required when flight is included"
      if (!formData.airlineName.trim()) errors.airlineName = "Airline name is required when flight is included"
      if (!formData.flightClass.trim()) errors.flightClass = "Flight class is required when flight is included"
      if (!formData.routeType.trim()) errors.routeType = "Route type is required when flight is included"
      if (!formData.departureCity.trim()) errors.departureCity = "Departure city is required when flight is included"
      if (!formData.arrivalCity.trim()) errors.arrivalCity = "Arrival city is required when flight is included"
      if (!formData.flightDuration.trim()) errors.flightDuration = "Flight duration is required when flight is included"

      if (formData.flightTentativeDate && formData.returnFlightDate) {
        const flightDate = new Date(formData.flightTentativeDate)
        const returnDate = new Date(formData.returnFlightDate)
        if (returnDate <= flightDate) {
          errors.returnFlightDate = "Return flight date must be after departure date"
        }
      }

      if (formData.routeType === "connecting" && !formData.viaCity.trim()) {
        errors.viaCity = "Via city is required for connecting flights"
      }
    }

        if (!formData.singlePricing || formData.singlePricing <= 0)
      errors.singlePricing = "Single sharing price is required"
    if (!formData.doubleSharingPrice || formData.doubleSharingPrice <= 0)
      errors.doubleSharingPrice = "Double sharing price is required"
    if (!formData.tripleSharingPrice || formData.tripleSharingPrice <= 0)
      errors.tripleSharingPrice = "Triple sharing price is required"
    if (!formData.quadSharingPrice || formData.quadSharingPrice <= 0)
      errors.quadSharingPrice = "Quad sharing price is required"
    if (!formData.currency.trim()) errors.currency = "Currency is required"
    if (!formData.paymentTerms.trim()) errors.paymentTerms = "Payment terms are required"
    if (!formData.cancellationPolicy.trim()) errors.cancellationPolicy = "Cancellation policy is required"

    if (formData.discountAvailable && (!formData.discountPercentage || formData.discountPercentage <= 0)) {
      errors.discountPercentage = "Discount percentage is required when discount is available"
    }
    if (!formData.coverImage &&!pakage.coverImage) errors.coverImage = "Cover image is required";
    if (formData.hotelImages.length<1 && pakage.hotelImages.length<1) errors.hotelImages = "Hotel images is required";

 


    return errors
  }
  const getTabWithErrors = (errors: ValidationErrors): string => {
    const tabFieldMap = {
      basic: [
        "packageName",
        "packageCode",
        "packageType",
        "duration",
        "season",
        "startDate",
        "endDate",
        "citiesCovered",
        "shortDescription",
        "fullDescription",
      ],
      accommodation: [
        "makkahHotelName",
        "makkahHotelRating",
        "makkahHotelDistance",
        "madinahHotelName",
        "madinahHotelRating",
        "madinahHotelDistance",
        "roomTypes",
        "mealsIncluded",
      ],
      transport: ["intercityTransport"],
      flight: [
        "flightTentativeDate",
        "returnFlightDate",
        "airlineName",
        "flightClass",
        "routeType",
        "departureCity",
        "arrivalCity",
        "viaCity",
        "flightDuration",
        "flightNotes",
      ],
      pricing: [
        "singlePricing",

        "doubleSharingPrice",
        "tripleSharingPrice",
        "quadSharingPrice",
        "currency",
        "paymentTerms",
        "cancellationPolicy",
        "discountPercentage",
      ],
      uploads: ["coverImage"],
    }

    for (const [tab, fields] of Object.entries(tabFieldMap)) {
      if (fields.some((field) => errors[field])) {
        return tab
      }
    }
    return "basic"
  }

  const handleSaveDraft = async () => {
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      const firstErrorTab = getTabWithErrors(errors)
      setActiveTab(firstErrorTab)
      toast.error("Please fill in all required fields before saving")
      return
    }

    setIsLoading(true)
    try {
      const formattedData = transformFormDataToAPI(formData)
      const response = await PostUmrahPakage(formattedData)
      toast.success("Draft saved successfully!")
    } catch (error) {
      toast.error("Failed to save draft. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async () => {
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      const firstErrorTab = getTabWithErrors(errors)
      setActiveTab(firstErrorTab)
      toast.error("Please fix all validation errors before publishing")
      return
    }



    setIsLoading(true)
    const loadingToast = toast.loading("Creating Umrah Package...")
    try {
      const formattedData = transformFormDataToAPI(formData)
      console.log([...formattedData.entries()].map(([k, v]) => `${k}: ${v}`).join("\n"))
      const response = await PostUmrahPakage(formattedData)
      toast.dismiss(loadingToast)
      toast.success("Umrah Package created successfully!", {
        duration: 4000,
        icon: "✈️",
      })
      setFormData(initialFormData);
      setValidationErrors({})
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Failed to publish package. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }



   const handleEdit = async () => {
    const errors = validateFormEdit()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      const firstErrorTab = getTabWithErrors(errors)
      setActiveTab(firstErrorTab)
      toast.error("Please fix all validation errors before publishing")
      return
    }

    

    setIsLoading(true)
    const loadingToast = toast.loading("Edditing Umrah Package...")
    try {
      const formattedData = transformFormDataToAPI(formData)
      console.log([...formattedData.entries()].map(([k, v]) => `${k}: ${v}`).join("\n"))
      const response = await EditUmrahPackage(formattedData,packageId||"");
      toast.dismiss(loadingToast)
      toast.success("Umrah Package Edited successfully!", {
        duration: 4000,
        icon: "✈️",
      })
      setFormData(initialFormData);
      setValidationErrors({})
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Failed to publish package. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  const tabs = [
    { id: "basic", label: "Basic Details", component: BasicDetailsSection },
    { id: "accommodation", label: "Accommodation", component: AccommodationSection },
    { id: "transport", label: "Transport", component: TransportSection },
    { id: "flight", label: "Flight Details", component: FlightDetailsSection },
    { id: "religious", label: "Religious Services", component: ReligiousServicesSection },
    { id: "pricing", label: "Pricing", component: PricingSection },
    { id: "additional", label: "Additional Info", component: AdditionalInfoSection },
    { id: "uploads", label: "Uploads", component: UploadsSection },
  ]
if (isFetching) {
  return (
    <div className="flex items-center justify-center p-10">
      <Loader2 className="h-6 w-6 animate-spin mr-2" />
      Loading package details...
    </div>
  )
}
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Package Information</CardTitle>
        <CardDescription>Fill in all the details for your Umrah package</CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(validationErrors).length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fix the following errors: {Object.keys(validationErrors).length} field(s) require attention.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
            {tabs.map((tab) => {
              const hasErrors = Object.keys(validationErrors).some((errorField) => {
                const tabFieldMap = {
                  basic: [
                    "packageName",
                    "packageCode",
                    "packageType",
                    "duration",
                    "season",
                    "startDate",
                    "endDate",
                    "citiesCovered",
                    "shortDescription",
                    "fullDescription",
                  ],
                  accommodation: [
                    "makkahHotelName",
                    "makkahHotelRating",
                    "makkahHotelDistance",
                    "madinahHotelName",
                    "madinahHotelRating",
                    "madinahHotelDistance",
                    "roomTypes",
                    "mealsIncluded",
                  ],
                  transport: ["intercityTransport"],
                  flight: [
                    "flightTentativeDate",
                    "returnFlightDate",
                    "airlineName",
                    "flightClass",
                    "routeType",
                    "departureCity",
                    "arrivalCity",
                    "viaCity",
                    "flightDuration",
                  ],
                  pricing: [
                       "singlePricing",
                    "doubleSharingPrice",
                    "tripleSharingPrice",
                    "quadSharingPrice",
                    "currency",
                    "paymentTerms",
                    "cancellationPolicy",
                    "discountPercentage",
                  ],
                  uploads: ["coverImage"],
                }
                return tabFieldMap[tab.id as keyof typeof tabFieldMap]?.includes(errorField)
              })

              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`text-xs ${hasErrors ? "text-red-600 border-red-200" : ""}`}
                >
                  {tab.label}
                  {hasErrors && <span className="ml-1 text-red-500">•</span>}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              <tab.component formData={formData} updateFormData={updateFormData} errors={validationErrors} Package={pakage} setPackage={setPackage} />
            </TabsContent>
          ))}

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
           
            <Button onClick={packageId?handleEdit:handlePublish} disabled={isLoading} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
              {packageId?"Edit Package":"Publish Package"}
            </Button>
          </div>
        </Tabs>
      </CardContent>
        <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </Card>
  )
}
