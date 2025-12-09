// Types for search components
export interface Particle {
  width: number;
  height: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
  shadow: number;
}

// Define search form input interfaces
export interface SearchInputs {
  id:string;
  location: string;
  checkIn: string;
  checkOut: string;
  travelers: string;
  rooms?: string;
}

export interface FlightInputs {
  from: string;
  to: string;
  date: string;
  travelers: string;
}

export interface CarRentalSearch {
  pickupLocation: string;
  pickupLatitude: string;
  pickupLongitude: string;
  dropoffLocation: string;
  dropoffLatitude: string;
  dropoffLongitude: string;
  pickupTime: string;
  dropoffTime: string;
  driverAge: string;
  sameLocation: boolean;
}

export interface Location {
  name: string;
  latitude: string;
  longitude: string;
}

export interface CityResult {
  id: string;
  typeName: string;
  name: string;
  label: string;
  region: string;
  country: string;
  dest_type: string;
  city_name: string;
  latitude: number;
  longitude: number;
  image_url: string;
  nr_hotels: number;
}
