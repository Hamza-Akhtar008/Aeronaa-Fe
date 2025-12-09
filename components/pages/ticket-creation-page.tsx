"use client"
import { z } from "zod"
import { TicketForm } from "../ticket-form"


const formSchema = z.object({
  tripType: z.enum(["one-way", "round-trip", "multi-city"], {
    required_error: "Please select a trip type.",
  }),
  departureAirport: z.string().min(3, {
    message: "Departure airport must be at least 3 characters.",
  }),
  arrivalAirport: z.string().min(3, {
    message: "Arrival airport must be at least 3 characters.",
  }),
  departureDate: z.date({
    required_error: "Departure date is required.",
  }),
  returnDate: z.date().optional(),
  adults: z.number().min(1, {
    message: "At least 1 adult passenger is required.",
  }),
  children: z.number().min(0),
  infants: z.number().min(0),
  classType: z.enum(["economy", "business", "first"], {
    required_error: "Please select a class type.",
  }),
  airline: z.string().optional(),
  flightNumber: z.string().optional(),
  baggage: z.string().optional(),
})

const airports = [
  { code: "JFK", name: "John F. Kennedy International Airport", city: "New York" },
  { code: "LHR", name: "London Heathrow Airport", city: "London" },
  { code: "LAX", name: "Los Angeles International Airport", city: "Los Angeles" },
  { code: "DXB", name: "Dubai International Airport", city: "Dubai" },
  { code: "SFO", name: "San Francisco International Airport", city: "San Francisco" },
  { code: "NRT", name: "Narita International Airport", city: "Tokyo" },
  { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris" },
  { code: "LHE", name: "Allama Iqbal International Airport", city: "Lahore" },
  { code: "ORD", name: "O'Hare International Airport", city: "Chicago" },
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt" },
]

export function TicketCreationPage() {
  return <TicketForm />
}
