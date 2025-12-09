export interface Property {
  id: number;
  isActive: boolean;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
  title: string;
  listingType: "sale" | "rent" | string; // restrict or keep open
  propertyType: "house" | "apartment" | "plot" | string;
  description: string;
  status: "active" | "inactive" | string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  nearByLands: string;
  builtUpArea: number;
  plotArea: number;
  bedrooms: number;
  bathrooms: number;
  kitchen: number;
  livingRooms: number;
  balconies: number;
  yearBuilt: number;
  numberOfFloors: number;
  floorNumber: number;
  furnishingStatus: "furnished" | "semi-furnished" | "unfurnished" | string;
  condition: "new" | "used" | string;
  price: number;
  priceNegotiable: boolean;
  contactNumber: string;
  contactEmail: string;
  contactName: string;
  images: string[];
  videoUrl?: string;  // optional, since not all properties may have one
  amenities: string[];
  additionalfeatures: string[];
}
