import type { HotelAPI } from "@/types/hotels";

// Utility to map hotel API data to HotelAPI type
export default function mapHotelToAPI(hotelObj: any, numofdays: number): HotelAPI | undefined {
  const property = hotelObj;
  if (!property?.propertyId || !property?.content?.informationSummary?.defaultName) {
    return undefined;
  }
  if (property?.propertyResultType === "SoldOutProperty") {
    return undefined;
  }

  // 🖼️ Collect hotel images
  const photoUrls = (property.content.images?.hotelImages || [])
    .map((img: any) => img.urls?.[0]?.value)
    .filter(Boolean);

  // 💰 Price handling
  const roomOffer = property.pricing?.offers?.[0]?.roomOffers?.[0]?.room;
  const grossPrice =
    roomOffer?.pricing?.[0]?.price?.perRoomPerNight?.exclusive?.display || 0;
  const grossCurrency = roomOffer?.pricing?.[0]?.currency || "USD";

  const finalPrice = grossPrice ? grossPrice * numofdays : undefined;
  const finalCurrency = grossCurrency;

  // 🌟 Review score word
  const score = property?.content?.reviews?.cumulative?.score || 0;
  let reviewScoreWord: string | undefined;
  if (score >= 8) reviewScoreWord = "Excellent";
  else if (score >= 7) reviewScoreWord = "Good";
  else if (score >= 5) reviewScoreWord = "Average";
  else if (score > 0) reviewScoreWord = "Poor";

  // 📍 Address construction
  const addressInfo = property?.content?.informationSummary?.address;
  let location = "Unknown Location";

  if (addressInfo) {
    const area = addressInfo?.area?.name?.toString();
    const city = addressInfo?.city?.name?.toString();
    const country = addressInfo?.country?.name?.toString();

    const locationParts = [area, city, country].filter(
      (part) => part && part.length > 0
    );

    if (locationParts.length > 0) {
      location = locationParts.join(", ");
    } else {
      // Fallback to localeName if location data missing
      location =
        property?.content?.informationSummary?.localeName?.toString() ||
        "Unknown Location";
    }
  }

  // 🗺️ Optional highlights (not used but logged for debugging)
  const locationHighlights =
    property?.content?.informationSummary?.contentHighlights
      ?.locationHighlights || [];

  if (locationHighlights.length > 0) {
    console.debug(
      "mapHotelToAPI: location highlights:",
      locationHighlights.map((h: any) => h?.name).filter(Boolean)
    );
  }

  // 🧩 Final object
  return {
    property: {
      id: property.propertyId,
      name: property.content.informationSummary.defaultName,
      reviewScore: score,
      reviewCount: property?.content?.reviews?.cumulative?.reviewCount || 0,
      reviewScoreWord,
      propertyClass:
        Math.ceil(property.content.informationSummary.rating) || 0,
      photoUrls,
      priceBreakdown: finalPrice
        ? {
            grossPrice: { currency: finalCurrency, value: finalPrice },
          }
        : undefined,
      latitude:
        property.content.informationSummary.geoInfo?.latitude || 0,
      longitude:
        property.content.informationSummary.geoInfo?.longitude || 0,
      countryCode:
        property.content.informationSummary.address?.country?.name ||
        "Unknown",
      ufi: property.content.informationSummary.address?.city?.id || 0,
      address: location, // ✅ Added human-readable address
    },
  };
}
