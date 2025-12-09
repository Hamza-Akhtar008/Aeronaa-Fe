export interface Ticket {
  id?: string;
  tripType: "one-way" | "round-trip";
  from: string;
  to: string;
  departureDate: string;
  arrivalDate: string;
  returnDate?: string;
  flightClass: "economy" | "business" | "first";
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
  basePrice: number;
  taxPrice: number;
  totalPrice: number;
  currency: string;
  cancellationAllowedUntill: string;
  isRefundable: boolean;
  cancellationPenalty: number;
  voidableUntil: string;
  passengerType?: string;
  passportRequired: boolean;
  seatSelectionAllowed: boolean;
  recheckBagsRequired?: boolean;
  checkedBaggage: string;
  cabbinBaggage: string;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
  // New field for segments
  segments: FlightSegment[];  // Multiple flight segments for the flight
    isActive?:boolean
}

export interface FlightSegment {
  id?: string;
  flightId: string;               // Reference to the parent flight's id
  type: "outbound" | "return";  // Type of the segment (outbound or return)
  segmentId: string;             // Unique ID for the segment
  flightNumber: string;          // Flight number for the segment
  departureAirport: string;      // Departure airport for this segment
  arrivalAirport: string;        // Arrival airport for this segment
  departurelocation: string;    // Departure location (could be specific gate or area)
  arrivallocation: string;      // Arrival location (could be specific gate or area)
  departureTime: string;        // Departure time in ISO 8601 format
  arrivalTime: string;          // Arrival time in ISO 8601 format
  flightDuration: number;       // Flight duration in minutes
  layoverDuration?: number;     // Layover duration between segments (optional)
  aircraftType?: string;        // Aircraft type (optional)
  operatingCarrier?: string;    // Operating carrier (optional)
  marketingCarrier?: string;    // Marketing carrier (optional)
  baggageRecheckRequired: boolean;  // Indicates whether baggage recheck is required for this segment
  cabinClass: "economy" | "business" | "first";  // Cabin class for this segment
}


export interface FlightFormData {
  tripType: "one-way" | "round-trip"
  from: string
  to: string
  departureDate: string
  returnDate?: string
  arrivalDate: string
  flightClass: "economy" | "business" | "first"
  flightNumber: string
  departureAirport: string
  arrivalAirport: string
  departureTime: string
  arrivalTime: string
  airline: string
  basePrice: number
  taxPrice: number
  totalPrice: number
  currency: string
  cancellationAllowedUntil: string
  isRefundable: boolean
  cancellationPenalty: number
  voidableUntil: string
  passengerType?: string
  passportRequired: boolean
  seatSelectionAllowed: boolean
  recheckBagsRequired?: boolean
  checkedBaggage: string
  cabinBaggage: string

}

export interface BookingFormData {
  travelers: {
    type: "adult" | "student" | "senior" | "youth" | "child" | "toddler" | "infant"
    firstName: string
    middleName?: string
    lastName: string
    dateOfBirth: string
    gender: "male" | "female" | "other"
    email?: string // optional for infants/toddlers
    phone?: string
    passportNumber?: string
    passportExpiry?: string
    issuingCountry?: string
    nationality?: string
    rewardsProgram?: string
   
  }[]
  
}
export interface Booking {
  id: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  firstName: string
  middleName: string
  lastName: string
  dob: string
  gender: string
  email: string
  phoneNumber: string
  passportNumber: string
  passportExpirationDate: string
  pnrNumber?:string
  bookingStatus:string
  country: string
  nationality: string
  flight: Ticket
}

