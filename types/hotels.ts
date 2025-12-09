export type FilterItem = {
  id: string | number;
  name: string;
};

export type ApiFilterState = {
  propertyType: FilterItem[];
  facilities: FilterItem[];
  neighborhoods: FilterItem[];
  roomOffers: FilterItem[];
  roomAmenities: FilterItem[];
  somethingSpecial: FilterItem[];
  neighborhoodId: string;
  propertyTypeIds: (string | number)[];
  facilityIds: (string | number)[];
  roomOfferIds: (string | number)[];
  roomAmenityIds: (string | number)[];
  somethingSpecialIds: (string | number)[];
};

export type FilterState = {
  priceRange: [number, number];
  selectedReviewRatings: number[];
  reviewScoreRange: [number, number];
  propertyTypes: number[];
  hasDeals: boolean;
  distanceFromCenter: number;
  reviewCountMin: number;
};

export type LoadingState = {
  initial: boolean;
  filtering: boolean;
  loadingMore: boolean;
};
export type HotelAPI = {
  property: {
    id: number
    name: string
    reviewScore?: number
    reviewCount?: number
    reviewScoreWord?: string
    propertyClass?: number
    photoUrls?: string[]
    priceBreakdown?: {
      grossPrice?: {
        currency: string
        value: number
      }
      strikethroughPrice?: {
        currency: string
        value: number
      }
      benefitBadges?: Array<{
        identifier: string
        text: string
        explanation: string
        variant: string
      }>
    }
    checkinDate?: string
    checkoutDate?: string
    checkin?: {
      fromTime: string
      untilTime: string
    }
    checkout?: {
      fromTime: string
      untilTime: string
    }
    latitude?: number
    longitude?: number
    accessibilityLabel?: string
    countryCode?: string
    ufi?: number
    address:string
  }
}
