// Global type definitions

import { decl } from "postcss"

interface Hotel {
  id: string | number
  name: string
  description: string
  Address?: string
  city: string
  state?: string
  zipCode?: string
  country: string
  starRating: string | number
  checkInTime?: string
  checkOutTime?: string
  availableFrom?: string
  averagePrice: string | number
  availableTo?: string
  amenities?: any[]
  images: string[]
  tags?: string
  isCompleted?: boolean
}

interface Particle {
  width: number
  height: number
  top: number
  left: number
  duration: number
  delay: number
  opacity: number
  shadow: number
}

// Make types globally available
declare global {
  interface Hotel {
    id: string | number
    name: string
    description: string
    Address?: string
    city: string
    state?: string
    zipCode?: string
    country: string
    starRating: string | number
    checkInTime?: string
    checkOutTime?: string
    availableFrom?: string
    averagePrice: string | number
    availableTo?: string
    amenities?: any[]
    images: string[]
    tags?: string
    isCompleted?: boolean
  }
}

// types.ts (or define at top of component file)
interface   Ticket {
  id: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  tripType: "One-way" | "Round-Trip"
  from: string
  to: string
  departureDate: string
  returnDate?: string
  arrivalDate: string
  flightClass: "Economy" | "Business" | "First Class"
  fare: number
  companyName: string
}

export type { Hotel, Particle ,Ticket}
