import { useMemo } from "react";
import type { HotelAPI } from "@/types/hotels";
import { getDistanceFromCityCenter } from "@/lib/utils/hotelUtils";

interface UseHotelSortProps {
  hotels: HotelAPI[];
  sortBy: string;
  cityCoords: { lat: number; lng: number };
}

export function useHotelSort({ hotels, sortBy, cityCoords }: UseHotelSortProps) {
  return useMemo(() => {
    const sorted = [...hotels];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => (a.property.priceBreakdown?.grossPrice?.value || 0) - (b.property.priceBreakdown?.grossPrice?.value || 0));
      case "price-high":
        return sorted.sort((a, b) => (b.property.priceBreakdown?.grossPrice?.value || 0) - (a.property.priceBreakdown?.grossPrice?.value || 0));
      case "rating":
        return sorted.sort((a, b) => (b.property.reviewScore || 0) - (a.property.reviewScore || 0));
      case "reviews":
        return sorted.sort((a, b) => (b.property.reviewCount || 0) - (a.property.reviewCount || 0));
      case "distance":
        return sorted.sort((a, b) => getDistanceFromCityCenter(a, cityCoords) - getDistanceFromCityCenter(b, cityCoords));
      default:
        return sorted;
    }
  }, [hotels, sortBy, cityCoords]);
}
