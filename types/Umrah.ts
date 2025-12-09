export interface UmrahPackage {
  id: number;
  isActive: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp

  packageName: string;
  packageCode: string;
  packageType: string;
  duration: number;
  startDate: string;
  endDate: string;
  citiesCovered: string[];
  shortDescription: string;
  longDescription: string;

  makkahHotelName: string;
  makkahStarRating: string;
  distanceFromHaram: number;

  medinaHotelName: string;
  medinaStarRating: string;
  distanceFromMasjidNabwi: number;

  roomTypes: string;
  mealsIncluded: string[];

  flightIncluded: number; // 1 = included, 0 = not included
  airportTransfersIncluded: number;
  interCityTransportType: string;
  ziyaratIncluded: number;

  tentativeDepartureDate: string;
  tentativeReturnDate: string;

  airLineName: string;
  flightClass: string;
  routeType: string;
  departureCity: string;
  arrivalCity: string;
  flightDuration: number;
  flightNotes: string;

  currency: string;
  singlePricing: number;
  doubleSharingPrice: number;
  trippleSharingPrice: number;
  quadSharingPrice: number;
  discountPercent: number;

  refundPolicy: string;
  paymentTerms: string;
  specialNotes: string;
  vendorNotes: string;

  extrasIncluded: string[];
  religiousServicesIncluded: string[];

  hotelImages: string[];
  coverImage: string;
}
