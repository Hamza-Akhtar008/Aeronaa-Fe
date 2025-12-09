"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Star, Users, Gauge, CheckCircle, Cog, Info, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { getCarRentalResults } from "@/lib/carRentalApi"
import { getCarRentalById } from "@/lib/api"
import { formatPrice, CURRENCIES } from "@/lib/utils/currency"
import { useAuth } from "@/store/authContext"
import { Modal } from "@/components/ui/Modal"
import CarBookingForm from "@/components/forms/CarBookingForm"
import Link from "next/link"
import Filters from "@/components/home/Filters"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"

interface CarRental {
  id?: string
  name?: string
  title?: string
  model?: string
  type?: string
  price?: number
  rate?: number
  dailyRate?: number
  supplier?: string
  vendor?: string
  rentalCompany?: string
  image?: string
  photo?: string
  thumbnail?: string
  description?: string
  car_type?: string
  currency?: string
  currency_code?: string
  currencySymbol?: string
  seats?: number
  passengerCount?: number
  transmission?: string
  features?: string[]
  amenities?: string[]
  details?: {
    transmission?: string
    seats?: number
    features?: string[]
  }
  vehicle_info?: {
    type?: string
    transmission?: string
    seats?: number
    features?: string[]
    image?: string
  }
  location?: string
  pickup_location?: string
  dropoff_location?: string
  rental_days?: number
  rating?: number
  [key: string]: any
}

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [car, setCar] = useState<CarRental | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { auth, loading: authLoading } = useAuth()
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [pendingBooking, setPendingBooking] = useState<any>(null)
  const [carDetails, setCarDetails] = useState<any>(null)
  const [showMoreInfo, setShowMoreInfo] = useState(false)

  const pickupLocation = searchParams?.get("pickupLocation") || ""
  const dropoffLocation = searchParams?.get("dropoffLocation") || ""
  const pickupDate = searchParams?.get("pickupDate") || ""
  const dropoffDate = searchParams?.get("dropoffDate") || ""
  const driverAge = searchParams?.get("driverAge") || "30"
  const pickupTime = searchParams?.get("pickupTime")
  const dropoffTime = searchParams?.get("dropoffTime")
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 });
  
    // Detect country and currency from localStorage/sessionStorage
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
  

  const carId = params?.id as string

  const rentalDays = (() => {
    if (!pickupDate || !dropoffDate) return 1
    const start = new Date(pickupDate)
    const end = new Date(dropoffDate)
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
  })()

  const formatDate = (date: string) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (time: string) => {
    if (!time) return "10:00 AM"
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  useEffect(() => {
    if (auth && auth.role === "user" && !showBookingForm) {
      const saved = localStorage.getItem("carBookingForm")
      if (saved) {
        try {
          setPendingBooking(JSON.parse(saved))
          setShowBookingForm(true)
          localStorage.removeItem("carBookingForm")
        } catch {}
      }
    }
  }, [auth])

  useEffect(() => {
    const mapVendorCar = (car: any): CarRental => {
      const firstImage = Array.isArray(car.images) && car.images.length > 0 ? car.images[0] : undefined
      return {
        ...car,
        name: car.name || car.model || (car.make ? `${car.make} ${car.model || ""}`.trim() : undefined),
        price: car.price || car.dailyRate || 0,
        type: car.type || car.category || "",
        seats: car.seats || car.passengerCount || 4,
        mileage: car.mileage || "",
        image: car.image || firstImage,
        photo: car.photo || firstImage,
        thumbnail: car.thumbnail || firstImage,
        features: car.features || [],
        description:
          car.description ||
          `${car.make ? car.make + " " : ""}${car.model || ""} - ${car.category || ""} with ${car.seats || 4} seats.`,
        location: car.location || "",
        car_type: car.car_type || car.category || "",
        currency: car.currency || "USD",
        currency_code: car.currency_code || "USD",
        make: car.make,
        model: car.model,
        year: car.year,
        licensePlate: car.licensePlate,
        dailyRate: car.dailyRate,
        category: car.category,
        carStatus: car.carStatus,
        isActive: car.isActive,
        createdAt: car.createdAt,
        updatedAt: car.updatedAt,
      }
    }

    const fetchCarDetails = async () => {
      try {
        setLoading(true)
        const storedSelectedCar = localStorage.getItem("selectedCarDetail")
        if (storedSelectedCar) {
          try {
            const parsedCar = JSON.parse(storedSelectedCar)
            if (parsedCar.id === carId || parsedCar.vehicle_id === carId) {
              const mappedCar = mapVendorCar(parsedCar)
              setCar(mappedCar)
              setCarDetails(extractCarDetails(mappedCar))
              setLoading(false)
              return
            }
          } catch (err) {}
        }
        const cachedCars = getCarRentalResults()
        if (cachedCars) {
          if (Array.isArray(cachedCars)) {
            const foundCar = cachedCars.find((c) => c.id === carId || c.vehicle_id === carId)
            if (foundCar) {
              const mappedCar = mapVendorCar(foundCar)
              setCar(mappedCar)
              setCarDetails(extractCarDetails(mappedCar))
              setLoading(false)
              return
            }
          } else if (typeof cachedCars === "object" && cachedCars !== null) {
            const cars = cachedCars.data || cachedCars.results || []
            if (Array.isArray(cars)) {
              const foundCar = cars.find((c) => c.id === carId || c.vehicle_id === carId)
              if (foundCar) {
                const mappedCar = mapVendorCar(foundCar)
                setCar(mappedCar)
                setCarDetails(extractCarDetails(mappedCar))
                setLoading(false)
                return
              }
            }
          }
        }
        try {
          const apiCar = await getCarRentalById(carId)
          const carObj = Array.isArray(apiCar) ? apiCar[0] : apiCar
          if (carObj) {
            const mappedCar = mapVendorCar(carObj)
            setCar(mappedCar)
            setCarDetails(extractCarDetails(mappedCar))
            setLoading(false)
            return
          }
        } catch (apiErr) {}
        setCar(null)
      } catch (error) {
        setCar(null)
      } finally {
        setLoading(false)
      }
    }
    fetchCarDetails()
  }, [carId])

  const goBack = () => {
    router.back()
  }

  const extractCarDetails = (car: any) => {
    const carType = car.type || car.car_type || car.vehicle_info?.type || car.category || "Vehicle"
    const transmission = car.transmission || car.vehicle_info?.transmission || car.details?.transmission || "Manual"
    const seats = car.seats || car.vehicle_info?.seats || car.details?.seats || car.passengerCount || 4
    const features = car.features || car.badges || car.vehicle_info?.features || car.amenities || []
    const mainImage = car.image || car.vehicle_info?.image || car.photo || car.thumbnail

    let currencyCode = null
    if (car.currency_code && typeof car.currency_code === "string" && car.currency_code.length === 3) {
      currencyCode = car.currency_code.toUpperCase()
    } else if (car.currency && typeof car.currency === "string" && car.currency.length === 3) {
      currencyCode = car.currency.toUpperCase()
    }
    if (currencyCode && !Object.keys(CURRENCIES).includes(currencyCode)) {
      currencyCode = null
    }

    const name = car.name || car.title || car.model || (car.make ? `${car.make} ${car.model || ""}`.trim() : null)
    let price = 0
    if (typeof car.price === "number") {
      price = car.price
    } else if (typeof car.price === "string") {
      price = Number.parseFloat(car.price)
    } else {
      price = car.rate || car.dailyRate || car.pricing_details?.base_price || car.pricing_details?.drive_away_price || 0
    }

    const supplier = car.supplier || car.supplier_name || car.vendor || car.rentalCompany
    const rating = car.rating || car.rating_details?.average
    const supplierImage = car.supplier_image || car.supplier_details?.imageUrl

    let allImages = []
    if (Array.isArray(car.images) && car.images.length > 0) {
      allImages = car.images.filter((img: any) => img && img.trim() !== "")
    } else if (mainImage && mainImage.trim() !== "") {
      allImages = [mainImage]
    }

    const extractedPickupLocation =
      car.pickup_location || car.original?.route_info?.pickup?.name || car.location || pickupLocation || null
    const extractedDropoffLocation =
      car.dropoff_location || car.original?.route_info?.dropoff?.name || dropoffLocation || extractedPickupLocation

    return {
      name,
      carType,
      transmission,
      seats,
      features,
      images: allImages,
      mainImage: allImages[0] || null,
      price,
      currencyCode,
      supplier,
      supplierImage,
      rating,
      description: car.description || "",
      pickupLocation: extractedPickupLocation,
      dropoffLocation: extractedDropoffLocation,
      make: car.make,
      model: car.model,
      year: car.year,
      licensePlate: car.licensePlate,
      mileage: car.mileage,
      fuelType: car.fuelType,
      carStatus: car.carStatus,
      category: car.category,
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-gray-700 font-medium">Loading car details...</p>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!car || !carDetails) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <p className="text-lg font-medium text-gray-700">Car not found</p>
            <button
              onClick={goBack}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Results
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
           <Filters
                      initialValues={[]}
                      onChange={()=>{}}
                      tabValue="cars"
                    />
      <div className=" w-full max-w-[95rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your deal</h1>
          <p className="text-gray-600">Next... Protection options</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Car Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Card */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white">
              <div className="flex gap-6">
                {/* Car Image */}
                <div className="flex-shrink-0 w-48 h-40">
                  {carDetails.images.length > 0 && (
                    <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={carDetails.images[selectedImageIndex] || "/placeholder.svg"}
                        alt={carDetails.name || "Vehicle"}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  )}
                </div>

                {/* Car Info */}
                <div className="flex-1">
                  {/* Top Pick Badge */}
                  <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
                    Top Pick
                  </div>

                  {/* Car Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {carDetails.name} <span className="text-sm font-normal text-gray-500">or similar small car</span>
                  </h2>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{carDetails.seats} seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cog className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{carDetails.transmission}</span>
                    </div>
                   
                   
                  </div>

                  {/* Location */}
                  {carDetails.pickupLocation && (
                    <p className="text-sm text-blue-600 font-medium mb-3">{carDetails.pickupLocation}</p>
                  )}

                  {/* Ratings */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      {carDetails.supplierImage && (
                        <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center text-white font-bold text-sm">
                          A
                        </div>
                      )}
                      <span className="text-xs font-semibold text-gray-700">Alamo</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-100 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-600">7.6</span>
                    </div>
                    <span className="text-xs text-gray-600">Good</span>
                    <span className="text-xs text-gray-600">1000+ reviews</span>
                    <button className="text-blue-600 text-sm font-medium ml-auto flex items-center gap-1">
                      <Info className="w-4 h-4" />
                      Important info
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Great Choice Section */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Great choice!</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {["Customer rating: 7.5/10", "Most popular fuel policy", "Helpful counter staff"].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {["Rental counter in terminal", "Easy to find counter", "Free Cancellation"].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-2">What travelers say about Alamo</h3>
              <p className="text-sm text-gray-600 mb-4">
                Here's what customers mentioned most in genuine reviews for Alamo at Dubai International Airport.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Car Condition", "Car Condition", "Deposit return"].map((tag, idx) => (
                  <button
                    key={idx}
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${
                      idx === 2
                        ? "border-red-300 text-red-600 bg-red-50"
                        : "border-green-300 text-green-600 bg-green-50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-xl p-6 bg-white sticky top-6">
              {/* Pick-up and Drop-off */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">Pick-up and drop-off</h3>
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {/* Pick-up */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-sm font-medium text-gray-900">
                      Thu, Sep 11 · {formatTime(pickupTime || "10:00 AM")}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {carDetails.pickupLocation || "Dubai International Airport"}
                  </p>
                  <button className="text-blue-600 text-sm font-medium mt-1">View pick-up instructions</button>
                </div>

                {/* Drop-off */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <p className="text-sm font-medium text-gray-900">
                      Fri, Sep 12 · {formatTime(dropoffTime || "10:00 AM")}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {carDetails.dropoffLocation || "Dubai International Airport"}
                  </p>
                  <button className="text-blue-600 text-sm font-medium mt-1">View drop-off instructions</button>
                </div>
              </div>

              {/* Car Price Breakdown */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">Car price breakdown</h3>
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Car hire charge</span>
                  <span className="font-medium">
                 

                    {formatPrice((Number.parseInt(carDetails.price)* rentalDays) * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  PKR prices are approx. You'll pay in USD because that's your local currency.
                </p>
                <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
                  <span>Price for 1 day:</span>
                  <span>

                    {formatPrice((Number.parseInt(carDetails.price)) * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}

                  </span>
                </div>
              </div>

              {/* Further Information */}
              <button
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                className="w-full flex items-center justify-between text-gray-900 font-medium mb-6"
              >
                Further information
                <ChevronDown className={`w-5 h-5 transition-transform ${showMoreInfo ? "rotate-180" : ""}`} />
              </button>

              {/* Book Button */}
              <Link
                href={
                  `/car-booking/${carId}?carName=${encodeURIComponent(carDetails.name || "Vehicle")}` +
                  `&pickupLocation=${encodeURIComponent(carDetails.pickupLocation || "")}` +
                  `&dropoffLocation=${encodeURIComponent(carDetails.dropoffLocation || "")}` +
                  `&pickupDate=${encodeURIComponent(pickupDate)}` +
                  `&dropoffDate=${encodeURIComponent(dropoffDate)}` +
                  `&dailyRate=${encodeURIComponent(carDetails.price || 0)}` +
                  `&duration=${encodeURIComponent(rentalDays)}` +
                  `&fees=${encodeURIComponent((carDetails.price * rentalDays * 0.03).toFixed(2))}` +
                  `&totalPrice=${encodeURIComponent((carDetails.price * rentalDays * 1.15).toFixed(2))}` +
                  `&pickUpTime=${encodeURIComponent(pickupTime || "10:00")}` +
                  `&dropoffTime=${encodeURIComponent(dropoffTime || "10:00")}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors mb-4"
              >
                Continue to Book
              </Link>
            </div>
          </div>
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <Modal
            title="Book This Car"
            message="Fill out the form to complete your booking."
            actionLabel="Close"
            onConfirm={() => setShowBookingForm(false)}
            onClose={() => setShowBookingForm(false)}
          >
            <CarBookingForm
                carId={carId}
                carName={car?.name || car?.model || ""}
                pickupLocation={pendingBooking?.pickupLocation || pickupLocation}
                dropoffLocation={pendingBooking?.dropoffLocation || dropoffLocation}
                pickupDate={pendingBooking?.pickupDate || pickupDate}
                dropoffDate={pendingBooking?.dropoffDate || dropoffDate}
                pickUpTime={pickupTime || "10:00"}
                dropoffTime={dropoffTime || "10:00"}
                dailyRate={car?.price || 0}
                duration={rentalDays}
                fees={Math.round(carDetails.price * rentalDays * 0.15)}
                amount={Math.round(carDetails.price * rentalDays * 1.15)}
                user={auth ? { name: (auth as any).name, email: (auth as any).email, phone: (auth as any).phone } : undefined}
                onSuccess={() => setShowBookingForm(false)}
              />
          </Modal>
        )}
      </div>
    </div>
  )
}
