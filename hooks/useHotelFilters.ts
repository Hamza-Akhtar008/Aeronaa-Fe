import { useMemo } from "react";
import { getReviewRatingRange, getDistanceFromCityCenter, convertPrice } from "@/lib/utils/hotelUtils";
import type { HotelAPI, FilterState } from "@/types/hotels";

interface UseHotelFiltersProps {
  hotelOffers: HotelAPI[];
  filters: FilterState;
  searchValue: string;
  exchangeRates: Record<string, number>;
  selectedCurrency: string;
  cityCoords: { lat: number; lng: number };
}

export function useHotelFilters({
  hotelOffers,
  filters,
  searchValue,
  exchangeRates,
  selectedCurrency,
  cityCoords,
}: UseHotelFiltersProps) {
  return useMemo(() => {
    console.log("filters.priceRange : ",filters.priceRange)
    return hotelOffers.filter((hotel) => {
      const price = hotel.property.priceBreakdown?.grossPrice?.value || 0;
      const reviewScore = hotel.property.reviewScore || 0;
      const reviewRatingRange = getReviewRatingRange(reviewScore);
      const reviewCount = hotel.property.reviewCount || 0;
      const propertyClass = hotel.property.propertyClass || 0;
      const hasDeals = hotel.property.priceBreakdown?.benefitBadges && hotel.property.priceBreakdown.benefitBadges.length > 0;
      const distance = getDistanceFromCityCenter(hotel, cityCoords);
      if (price === 0) return true;
      const converted = convertPrice(price, exchangeRates, selectedCurrency, "USD");
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
      if (filters.selectedReviewRatings.length > 0 && reviewScore >= 0 && !filters.selectedReviewRatings.includes(reviewRatingRange)) return false;
      if (reviewScore >= 1 && (reviewScore < filters.reviewScoreRange[0] || reviewScore > filters.reviewScoreRange[1])) return false;
      if (filters.propertyTypes.length > 0 && propertyClass > 0 && !filters.propertyTypes.includes(propertyClass)) return false;
      if (filters.hasDeals && !hasDeals) return false;
      if (distance > 0 && distance > filters.distanceFromCenter) return false;
      if (reviewCount > 0 && reviewCount < filters.reviewCountMin) return false;
      const hotelName = hotel.property.name.toLowerCase();
      const lowerSearchValue = searchValue.toLowerCase();
      if (searchValue && !hotelName.includes(lowerSearchValue)) return false;
      return true;
    });
  }, [hotelOffers, filters, searchValue, exchangeRates, selectedCurrency, cityCoords]);
}
