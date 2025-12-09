import { Review } from "@/app/(Vendor)/Dashboard/Reviews/types";

export interface ApiHotelResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    propertyId: number;

    // Main detail object for all property info
    contentDetail: {
      propertyId: number;
      hostProfile: any | null; // no detail in example
      contentImages: {
        hotelImages: Array<{
          id: number;
          caption: string;
          groupId: string;
          urls: Array<{
            key: string; // usually "full"
            value: string;
          }>;
          typeId: number;
          uploadedDate: string;
          snippet: string | null;
        }>;
        matterports: any[]; // not used
        categories: Array<{
          category: string;
          count: number;
        }>;
      };

      contentReviewScore: {
        combinedReviewScore: {
          cumulative: {
            score: number;
            reviewCount: number;
          }
        },
        providerReviewScore: Array<any>; // can expand if needed
      };

      contentReviewSummaries: {
        snippets: Array<{
          snippet: string;
          reviewRating: number;
          reviewer: string;
          date: string;
          countryId: number;
          countryName: string;
        }>;
        recommendationScores: any | null;
        positiveMentions: {
          bcomReviewScores: Array<any>;
        }
      };

      contentEngagement: {
        lastBooked: string | null;
        noOfPeopleLooking: number;
      };

      contentHighlights: {
        locationHighlights: any[];
        favoriteFeatures: Array<{
          id: number;
          name: string;
          symbol: string;
        }>;
      };

      contentFeatures: {
        featureGroups: Array<{
          id: number;
          name: string;
          order: number;
          features: Array<{
            id: number;
            featureName: string;
            symbol: string;
            available: boolean;
            order: number;
            images: Array<any>;
          }>;
        }>;
        hotelFacilities: Array<{
          id: number;
        }>;
        summary: {
          chineseFriendly: boolean;
          hygienePlusFacilities: any;
        }
      };

      contentInformation: {
        policies: {
          children: any;
          hotelAgePolicy: {
            infantAges: { min: number; max: number; };
            childAges: { min: number; max: number; };
            isChildStayFree: boolean;
            minGuestAge: number;
          };
          extraBed: string[];
          additional: string[];
          adult: any[];
          minAge: any[];
        };
        isAgodaVerified: boolean;
        messaging: {
          hostName: string | null;
          isAllowedPreBooking: boolean;
          isAllowedPostBooking: boolean;
          isAllowedWithBooking: boolean;
          isAllowedInHouseFeedback: boolean;
          isAllowedInHouseRequest: boolean;
        };
        blockedNationalities: any[];
        checkInInformation: {
          checkInFrom: { hh: number; mm: number };
          checkOutUntil: { hh: number; mm: number };
        };
        usefulInfoGroups: Array<{
          id: number;
          name: string;
          usefulInfo: Array<{
            id: number;
            name: string;
            description: string;
            symbol: string;
          }>;
        }>;
        notes: {
          importantNotes: any[];
          publicNotes: any[];
        };
        description: {
          short: string;
          long: string;
        };
        nhaInformation: any;
        restaurantOnSite: any[];
        certificate: any;
        staffVaccinationInfo: any;
      };

      contentSummary: {
        accommodation: {
          accommodationType: number;
          accommodationName: string;
        };
        agodaGuaranteeProgram: boolean;
        hasHostExperience: boolean;
        localeName: string;
        defaultName: string;
        propertyType: string;
        propertyLinks: {
          propertyPage: string;
        };
        geoInfo: {
          latitude: number;
          longitude: number;
          obfuscatedLat: number;
          obfuscatedLong: number;
        };
        address: {
          address1: string;
          address2: string;
          postalCode: string;
          country: { id: number; name: string };
          city: { id: number; name: string };
          area: { name: string };
        };
        spokenLanguages: Array<{ id: number }>;
        nhaSummary: {
          isRareFind: boolean | null;
          supportedLongStay: boolean | null;
        };
        rating: number;
      };

      contentLocalInformation: {
        nearbyPlaces: Array<{
          name: string;
          distanceInKm: number;
          geoInfo: { latitude: number; longitude: number };
          typeId: number;
          typeName: string;
        }>;
        topPlaces: any[];
        nearbyProperties: any[];
        walkablePlaces: any;
        nearbyShops: Array<{
          name: string;
          typeId: number;
          distanceInKm: number;
          geoInfo: { latitude: number; longitude: number };
        }>;
      };

      contentExperiences: {
        experience: Array<{
          symbol: string;
          landmarks: Array<{
            name: string;
            geoInfo: { latitude: number; longitude: number };
            scores: any;
            distanceInKm: number;
          }>;
        }>;
      };
    };

    metaLab: {
      propertyAttributes: Array<{
        attributeId: number;
        value: string;
      }>;
    };
  };
}


// Simple function to check if data has API structure
export function hasApiStructure(data: any): data is ApiHotelResponse {
  return (
    !!data &&
    typeof data === "object" &&
  
  
    
    "propertyDetailsSearch" in data 
  
  );
}

// Simple function to check if data has DB structure
export function isDbResponses(data: any): data is Hotel {
  return data && typeof data === "object" && "name" in data && "description" in data
}

export function transformNewApiDataToHotel(apiResponse: any): Hotel {
  const data = apiResponse.data?.propertyDetailsSearch.propertyDetails[0].contentDetail
  console.log(" transformNewApiDataToHotel data : ", data)
  const summary = data?.contentSummary
  const info = data?.contentInformation

  // 1. Get images (hotelImages -> urls[].value, prepend "https:" if needed)
  const images: any[] = []
  data?.contentImages?.hotelImages?.forEach((img: any) => {
    img.urls?.forEach((u: any) => {
      images.push({
        id: img.id,
        url: u.value.startsWith('http') ? u.value : 'https:' + u.value,
        alt: img.caption || summary?.defaultName || "",
        group: img.groupId,
        typeId: img.typeId,
      })
    })
  })

  // 2. Amenities from favoriteFeatures + featureGroups.features.featureName (dedupe)
  const amenitiesSet = new Set<string>()
  data?.contentHighlights?.favoriteFeatures?.forEach((item: any) => amenitiesSet.add(item.name))
  data?.contentFeatures?.featureGroups?.forEach((group: any) => {
    group.features?.forEach((f: any) => {
      if (f.available) amenitiesSet.add(f.featureName)
    })
  })
  const amenities = Array.from(amenitiesSet)

  // 3. Check-in/out times
  let checkInTime = "14:00", checkOutTime = "12:00"
  if (info?.checkInInformation) {
    const { checkInFrom, checkOutUntil } = info.checkInInformation
    checkInTime = checkInFrom ? `${checkInFrom.hh.toString().padStart(2, "0")}:${checkInFrom.mm.toString().padStart(2, "0")}` : "14:00"
    checkOutTime = checkOutUntil ? `${checkOutUntil.hh.toString().padStart(2, "0")}:${checkOutUntil.mm.toString().padStart(2, "0")}` : "12:00"
  }

  // 4. Description (short preferred, fallback to long, or blank)
  let description =  info?.description?.long 

  // 5. Price (not present, so fallback to "0" or parse from description if needed)
  let averagePrice = "0"
  const priceRegex = /\$\d+/g
  const matches = description.match(priceRegex)
  if (matches) {
    // Take the first number without the $
    averagePrice = matches[0].replace("$", "")
  }

  // 6. Tags (same as amenities for now)
  const tags = amenities

  // 7. Fallbacks for missing fields
  const city = summary?.address?.city?.name || ""
  const state = summary?.address?.area?.name || city
  const zipCode = summary?.address?.postalCode || ""
  const country = summary?.address?.country?.name || ""
  const address = summary?.address?.address1
    ? `${summary.address.address1}, ${summary.address.address2 || ""}`.trim()
    : summary?.address?.address2 || ""
  const starRating = summary?.rating?.toString() || ""
  const id = data?.propertyId?.toString() || apiResponse.data?.propertyId?.toString() || ""
  const apiId = id

  // 8. Room availability
  const availableFrom = new Date()
  const availableTo = new Date()

  return {
    id,
    name: summary?.defaultName || "",
    description,
    Address: address,
    city,
    state,
    zipCode,
    country,
    averagePrice,
    starRating,
    checkInTime,
    checkOutTime,
    availableFrom,
    availableTo,
    amenities,
    images,
    tags,
    isCompleted: 1,
    value: averagePrice,
    dataByApi: true,
    apiId,
  }
}

export const isApiResponse = hasApiStructure
export const isDbResponse = isDbResponses


export function transformApiReviewToReview(apiReview: any, hotelId: string): Review[] {
  console.log(" transformApiReviewToReview apiReview : ", apiReview)
  const comments = apiReview?.data?.comments;
  if (!Array.isArray(comments) || comments.length === 0) return [];

  // Hotel structure (minimal for id, others can be left empty or default)
  const hotel: Hotel = {
    id: hotelId,
    name: "",
    description: "",
    Address: "",
    city: "",
    state: "",
    zipCode: "",
    averagePrice: "",
    country: "",
    starRating: "",
    checkInTime: "",
    checkOutTime: "",
    availableFrom: new Date(),
    availableTo: new Date(),
    isCompleted: 1,
    // other fields as needed...
  };

  return comments.map((comment: any) => {
    const user: User = {
      name: comment.reviewerInfo?.name || "Anonymous",
      email: "",
      phone: "",
    };

    // Standardize rating to out of 5 (assuming API is out of 10)
    const rawScore = Number(comment.rating?.score ?? 0);
    const standardizedRating = Math.round((rawScore / 10) * 5 * 10) / 10; // one decimal

    const review: Review = {
      id: comment.id,
      description: comment.reviewDetail?.comment || "",
      rating: standardizedRating.toString(),
      user,
      updatedAt: comment.reviewDetail?.date ? new Date(comment.reviewDetail.date) : new Date(),
      hotel,
    };

    return review;
  });
}

