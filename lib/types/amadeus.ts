// Types for Amadeus API responses

// Hotel Types
export interface AmadeusHotelOffer {
  type: string;
  hotel: {
    type: string;
    hotelId: string;
    name: string;
    rating?: string;
    cityCode?: string;
    address?: {
      lines: string[];
      postalCode: string;
      cityName: string;
      countryCode: string;
    };
    contact?: {
      phone: string;
      fax: string;
      email: string;
    };
    description?: {
      text: string;
      lang: string;
    };
    amenities?: string[];
    media?: Array<{
      uri: string;
      category: string;
    }>;
    longitude?: number;
    latitude?: number;
  };
  available: boolean;
  offers: Array<{
    id: string;
    checkInDate: string;
    checkOutDate: string;
    rateCode: string;
    rateFamilyEstimated?: {
      code: string;
      type: string;
    };
    commission?: {
      percentage: string;
    };
    room: {
      type: string;
      typeEstimated: {
        category: string;
        beds: number;
        bedType: string;
      };
      description: {
        text: string;
        lang: string;
      };
    };
    guests: {
      adults: number;
      childAges?: number[];
    };
    price: {
      currency: string;
      total: string;
      base: string;
      taxes?: Array<{
        code: string;
        amount: string;
        currency: string;
        included: boolean;
      }>;
    };
    policies: {
      guarantee?: {
        acceptedPayments: {
          creditCards: string[];
          methods: string[];
        };
      };
      paymentType: string;
      cancellation?: {
        deadline: string;
        amount: string;
      };
    };
    self: string;
  }>;
  self: string;
}

// Flight Types
export interface AmadeusFlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
      operating: {
        carrierCode: string;
      };
      duration: string;
      id: string;
      numberOfStops: number;
      blacklistedInEU: boolean;
    }>;
  }>;
  price: {
    currency: string;
    total: string;
    base: string;
    fees: Array<{
      amount: string;
      type: string;
    }>;
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
      base: string;
    };
    fareDetailsBySegment: Array<{
      segmentId: string;
      cabin: string;
      fareBasis: string;
      class: string;
      includedCheckedBags: {
        quantity: number;
      };
    }>;
  }>;
}

// Point of Interest Types
export interface AmadeusPointOfInterest {
  type: string;
  subType: string;
  id: string;
  self: {
    href: string;
    methods: string[];
  };
  geoCode: {
    latitude: number;
    longitude: number;
  };
  name: string;
  category: string;
  rank: number;
  tags: string[];
  contextualImages?: Array<{
    url: string;
    category: string;
  }>;
}

// City Info
export interface AmadeusCityInfo {
  type: string;
  subType: string;
  name: string;
  detailedName: string;
  id: string;
  self: {
    href: string;
    methods: string[];
  };
  timeZoneOffset: string;
  iataCode: string;
  geoCode: {
    latitude: number;
    longitude: number;
  };
  address: {
    cityName: string;
    cityCode: string;
    countryName: string;
    countryCode: string;
    regionCode: string;
  };
  analytics: {
    travelers: {
      score: number;
    };
  };
}
