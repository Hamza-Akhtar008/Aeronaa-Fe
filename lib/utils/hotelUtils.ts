// Format a date string to a readable format
export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

// Convert price between currencies using exchange rates
export const convertPrice = (
  price: number,
  exchangeRates: Record<string, number>,
  selectedCurrency: string,
  fromCurrency = "USD",
  toCurrency?: string
) => {
  const fromRate = exchangeRates[fromCurrency] || 1;
  const toRate = exchangeRates[toCurrency || selectedCurrency] || 1;
  return (price / fromRate) * toRate;
};
// Haversine formula to calculate distance between two lat/lng points in km
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get distance from city center for a hotel
import type { HotelAPI } from "@/types/hotels";
export const getDistanceFromCityCenter = (
  hotel: HotelAPI,
  cityCoords: { lat: number; lng: number }
) => {
  const hotelLatitude = hotel.property.latitude;
  const hotelLongitude = hotel.property.longitude;
  if (hotelLatitude && hotelLongitude) {
    return calculateDistance(hotelLatitude, hotelLongitude, cityCoords.lat, cityCoords.lng);
  }
  return 0;
};
// Utility: Map review score to a rating range (e.g., 1-5)
export const getReviewRatingRange = (score: number) => {
  if (score >= 9) return 5;
  if (score >= 8) return 4;
  if (score >= 7) return 3;
  if (score >= 6) return 2;
  if (score > 0) return 1;
  return 0;
};
