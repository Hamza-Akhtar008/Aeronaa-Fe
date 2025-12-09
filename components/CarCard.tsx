"use client"

import React from "react"
import { Car, Users, Gauge, MapPin, Star, Calendar, CheckCircle } from "lucide-react"

interface CarRental {
  [key: string]: any
}

interface CarCardProps {
  car: CarRental
  index: number
  selectedCurrency?: string
  exchangeRate?: number
  onSelect?: (car: CarRental) => void
}

const formatPrice = (price: number, currency = "USD"): string => {
  if (price == null || Number.isNaN(Number(price))) return "-"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(price))
}

const shortDate = (iso?: string) => {
  if (!iso) return "-"
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  } catch {
    return iso
  }
}

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${className}`}>{children}</span>
)

const CarCard: React.FC<CarCardProps> = ({ car, index, selectedCurrency = "USD", exchangeRate = 1, onSelect }) => {
  const image =
    car.images?.[0] ||
    car.image ||
    car.vehicle_info?.image ||
    car.photo ||
    car.thumbnail ||
    "/classic-red-convertible.png"

  const name =
    car.name ||
    car.title ||
    (car.make && car.model ? `${car.make} ${car.model}` : car.make || car.model) ||
    (car.type || car.category) ||
    "Car"

  const year = car.year || car.modelYear || car.model || "-"
  const category = car.category || car.car_type || car.type || "-"
  const seats = car.seats || car.vehicle_info?.seats || car.passengerCount || (car.details?.seats ?? "-")
  const mileage = car.mileage ?? car.miles ?? "-"
  const fuel = car.fuelType || car.fuel || "-"
  const location = car.location || car.pickup_location || car.dropoff_location || "-"
  const dailyRate = (() => {
    if (typeof car.dailyRate === "number") return car.dailyRate
    if (typeof car.price === "number") return car.price
    if (typeof car.price === "string" && !Number.isNaN(Number(car.price))) return Number(car.price)
    if (car.pricing_details?.drive_away_price != null) return car.pricing_details.drive_away_price
    if (car.pricing_details?.base_price != null) return car.pricing_details.base_price
    return car.rate || 0
  })()
  const supplier = car.supplier || car.supplier_name || car.rentalCompany || car.vendor || "-"
  const rating = car.rating ?? car.rating_details?.average
  const createdAt = car.createdAt || car.created_at
  const updatedAt = car.updatedAt || car.updated_at
  const carStatus = car.carStatus || car.status || "-"

  const isAvailable = car.carStatus === "active" || car.status === "approved" || (car.carStatus == null && car.status == null)

  const handleCardClick = () => {
    if (onSelect) onSelect(car)
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onSelect) onSelect(car)
  }

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col lg:flex-row w-full transition-transform hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
        !isAvailable ? "opacity-80" : ""
      }`}
      role="button"
      aria-pressed="false"
    >
      {/* IMAGE */}
      <div className="relative w-full lg:w-64 lg:min-w-[256px] h-52 flex-shrink-0 bg-gray-50">
        <img
          src={image}
          alt={String(name)}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/classic-red-convertible.png"
          }}
        />

        {/* top-left status badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className="bg-white/90 text-gray-800 shadow-sm">
            <Calendar className="h-3 w-3" />
            <span className="ml-0.5">{year}</span>
          </Badge>

          <Badge className={`${
            isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            <CheckCircle className="h-3 w-3" />
            <span className="ml-0.5">{isAvailable ? "Available" : "Unavailable"}</span>
          </Badge>
        </div>

        {/* bottom-left supplier & rating */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 px-3 py-1 rounded text-xs font-semibold text-gray-900">
              {supplier}
            </div>
            {rating != null && !Number.isNaN(Number(rating)) && (
              <div className="bg-blue-700 text-white px-2 py-0.5 rounded text-xs font-bold">
                <Star className="inline-block h-3 w-3 mr-1 align-middle" /> {Number(rating).toFixed(1)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN INFO */}
      <div className="flex-1 p-4 lg:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                {name}
                {category && (
                  <span className="text-sm font-medium text-gray-500 ml-2">• {String(category)}</span>
                )}
              </h3>

              <div className="mt-1 text-sm text-gray-600">
                {car.description || car.title || `${String(category)} • ${String(fuel)}`}
              </div>
            </div>

          
          </div>

          {/* specs row */}
          <div className="mt-3 flex flex-wrap gap-3 items-center text-sm text-gray-700">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded">
              <Users className="h-4 w-4 text-gray-600" />
              <span>{seats ?? "-" } seats</span>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded">
              <Gauge className="h-4 w-4 text-gray-600" />
              <span>{mileage ? `${mileage}${typeof mileage === "number" ? " km" : ""}` : "-"}</span>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span>{location}</span>
            </div>

            {fuel && (
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded">
                <span className="text-xs font-medium">{fuel}</span>
              </div>
            )}

            {car.badges?.length > 0 &&
              car.badges.slice(0, 3).map((b: any, i: number) => (
                <div key={i} className="bg-blue-50 px-2 py-0.5 rounded text-xs text-blue-700 font-medium">
                  {String(b)}
                </div>
              ))}
          </div>

          {/* small metadata line */}
        
        </div>

        {/* price + CTA */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-gray-500">Price / day</div>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(Number(dailyRate) * Number(exchangeRate || 1), selectedCurrency)}</div>
            {car.special_offer_text && <div className="text-xs text-green-600 mt-1">{car.special_offer_text}</div>}
          </div>

          <div className="w-40">
            <button
              onClick={handleButtonClick}
              disabled={!isAvailable}
              className={`w-full px-4 py-2 rounded-md font-medium transition ${
                isAvailable ? "bg-blue-700 text-white hover:bg-blue-800" : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isAvailable ? "View Details" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarCard
