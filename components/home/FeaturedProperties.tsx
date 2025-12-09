'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import { getCurrencyByLocation } from "@/lib/utils/location-currency";
import { formatPrice } from "@/lib/utils/currency";
import { convertPrice } from "@/lib/utils/hotelUtils";

type Property = {
  id?: string | number;
  name: string;
  imageUrl?: string;
  rating?: number;
  reviews?: number;
  price?: string | number;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "fill-[#ffb400] text-[#ffb400]" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  );
}

const countryImages = [
  { name: "Dubai", image: "/Dubai.png", rating: 5, reviews: 212, price: "72" },
  { name: "Islamabad", image: "/images/PC.jpg", rating: 4, reviews: 156, price: "48" },
  { name: "New York", image: "/penthouse-city-view.png", rating: 3, reviews: 189, price: "95" },
  { name: "Makkah", image: "/images/makkah.jpg", rating: 5, reviews: 263, price: "68" },
  { name: "London", image: "/charming-townhouse-historic.png", rating: 4, reviews: 174, price: "83" },
];


export function BookYourProperty() {
  const [featureProperties, setFeatureProperties] = useState<Property[]>([]);
  const [loadingCard, setLoadingCard] = useState<string | null>(null);

  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 });

  // Detect country and currency from localStorage/sessionStorage
  useEffect(() => {

    let country = localStorage.getItem("userCountry") || localStorage.getItem("usercountry") || sessionStorage.getItem("userCountry") || sessionStorage.getItem("usercountry");
    if (country) {
      const currency = getCurrencyByLocation(country);
      setSelectedCurrency(currency);
    } else {
      setSelectedCurrency("USD");
    }
  }, []);

  // Fetch exchange rates for selected currency
  useEffect(() => {
    if (selectedCurrency === "USD") {
      setExchangeRates({ USD: 1 });
      return;
    }
    const fetchRates = async () => {
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        const data = await response.json();
        setExchangeRates({ ...data.rates, USD: 1 });
      } catch (error) {
        setExchangeRates({ USD: 1 });
      }
    };
    fetchRates();
  }, [selectedCurrency]);

  // Fetch Agoda properties for the selected country tab, using check-in = today+1, check-out = today+2
  const fetchFeatureProperties = async (countryName: string) => {
    setLoadingCard(countryName);
    try {
      // Try to get from localStorage first
      const cacheKey = `featuredProperties_${countryName}`;
      const cacheExpiryKey = `${cacheKey}_expiry`;
      const cached = localStorage.getItem(cacheKey);
      const cacheExpiry = localStorage.getItem(cacheExpiryKey);
      const now = Date.now();
      if (cached && cacheExpiry && now < parseInt(cacheExpiry)) {
        setFeatureProperties(JSON.parse(cached));
        setLoadingCard(null);
        return;
      }

      // 1. Get city autocomplete result for the country name
      const autoRes = await fetch(
        `https://agoda-com.p.rapidapi.com/hotels/auto-complete?query=${encodeURIComponent(countryName)}`,
        {
          headers: {
            "x-rapidapi-key": "7f66331876msh5a86fb2ce181b4dp1b2f48jsn8db63f8e12d9",
            "x-rapidapi-host": "agoda-com.p.rapidapi.com",
          },
        }
      );
      const autoData = await autoRes.json();
      console.log("Agoda autocomplete data response:", autoData);
      const city = autoData.places[0];
      if (!city || !city.id || !city.typeName) {
        setFeatureProperties([]);
        setLoadingCard(null);
        return;
      }

      // 2. Use city.id and city.typeName to fetch properties
      // check-in = today+1, check-out = today+2 (one day after check-in)
      const today = new Date();
      const checkInDateObj = new Date(today);
      checkInDateObj.setDate(today.getDate() + 1);
      const checkOutDateObj = new Date(checkInDateObj);
      checkOutDateObj.setDate(checkInDateObj.getDate() + 2);
      const checkInDate = checkInDateObj.toISOString().split("T")[0];
      const checkOutDate = checkOutDateObj.toISOString().split("T")[0];

      const searchRes = await fetch(
        `https://agoda-com.p.rapidapi.com/hotels/search-overnight?typeName=${city.typeName}&id=1_${city.id}&checkinDate=${checkInDate}&checkoutDate=${checkOutDate}&adult=2&room_qty=1&language=en-us&currency=USD`,
        {
          headers: {
            "x-rapidapi-key": "7f66331876msh5a86fb2ce181b4dp1b2f48jsn8db63f8e12d9",
            "x-rapidapi-host": "agoda-com.p.rapidapi.com",
          },
        }
      );
      const searchData = await searchRes.json();
      console.log("Agoda search data response:", searchData);
      // Store the full API response in sessionStorage for later use (e.g., on Show More navigation)
      sessionStorage.setItem("searchResultsFull", JSON.stringify(searchData));
      // Also store the city data that was used for this search
      sessionStorage.setItem("searchCity", JSON.stringify(city));
      // Helper to extract image URL from hotelImages
      const getImageUrl = (hotelImages: any): string => {
        if (!hotelImages || !hotelImages.length) return "/placeholder.svg";
        // Prefer 'original', fallback to first value in urls array
        const urlsArr = hotelImages[0].urls || [];
        const original = urlsArr.find((u: { key: string; value: string }) => u.key === "original");
        let url = original?.value || urlsArr[0]?.value;
        if (url && !url.startsWith('http')) url = `https:${url}`;
        return url || "/placeholder.svg";
      };
console.log("Agoda search data:", searchData.data.citySearch.properties);
      const mapped = (searchData.data.citySearch.properties || []).map((p: any) => {
        const content = p.content || {};
        return {
          id: p.propertyId || content.propertyId,
          name: content.informationSummary?.defaultName || "Unnamed Property",
          imageUrl: getImageUrl(content.images?.hotelImages),
          rating: content.reviews?.cumulative?.score ? Math.round(content.reviews.cumulative.score) : 0,
          reviews: content.reviews?.cumulative?.reviewCount || 0,
          price: content.pricing?.displayPrice ? `$${content.pricing.displayPrice}` : "-",
        };
      });
      setFeatureProperties(mapped);
      // Store in localStorage with 10 min expiry
      localStorage.setItem(cacheKey, JSON.stringify(mapped));
      localStorage.setItem(cacheExpiryKey, (now + 10 * 60 * 1000).toString());

      // Store the full Agoda API response in sessionStorage for /hotels page
      // This ensures /hotels can use the raw properties and filters for mapping
      const filters = searchData.data?.filters;
      const locationQuery = city.name || city.id || "";
      const id = city.id;
      const typeName = city.typeName;
      const selectedCity = city;

      // Log the search parameters for debugging
      console.log("Saving search results with parameters:", {
        location: locationQuery,
        id,
        typeName,
        properties: searchData.data.citySearch.properties?.length || 0
      });

      // Make sure we have the necessary data
      if (!id || !typeName || !searchData.data.citySearch.properties) {
        console.error("Missing required search data:", { id, typeName, propertiesFound: !!searchData.data.data.citySearch.properties });
      }

      sessionStorage.setItem(
        "searchResults",
        JSON.stringify({
          hotels: searchData.data.citySearch.properties || [],
          filters,
          search: {
            location: locationQuery,
            id,
            typeName,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            travelers: `2 adults · 0 children`,
            rooms: "1",
          },
          selectedCity,
        })
      );
    } catch (error) {
      console.error("Error fetching properties:", error);
      setFeatureProperties([]);
    }
    setLoadingCard(null);
  };


  // Handle country image click: fetch properties and navigate
  const handleCountryImageClick = async (countryName: string) => {
    setLoadingCard(countryName);
    try {
      // First try to fetch properties to make sure we have data
      await fetchFeatureProperties(countryName);

      // Get the latest search results that should have been set by fetchFeatureProperties
      const searchResultsFull = sessionStorage.getItem("searchResultsFull");
      const searchCityStr = sessionStorage.getItem("searchCity");

      if (!searchResultsFull || !searchCityStr) {
        throw new Error("Search data not available. Please try again.");
      }

      const fullData = JSON.parse(searchResultsFull);
      const city = JSON.parse(searchCityStr);

      
      // Make sure we have the necessary data
      if (!fullData.data.citySearch.properties || !city.id || !city.typeName) {
        throw new Error("Incomplete search data. Please try again.");
      }

      // Setup dates
      const today = new Date();
      const checkInDateObj = new Date(today);
      checkInDateObj.setDate(today.getDate() + 1);
      const checkOutDateObj = new Date(checkInDateObj);
      checkOutDateObj.setDate(checkInDateObj.getDate() + 2);

      const checkInDate = checkInDateObj.toISOString().split("T")[0];
      const checkOutDate = checkOutDateObj.toISOString().split("T")[0];

      // Get the information needed for hotels page
      const locationQuery = city.name || countryName;
      const id = city.id;
      const typeName = city.typeName;

      // Ensure we have hotel data and filter data
      const hotels = fullData.data.citySearch.properties || [];
      const filters = fullData.data.citySearch.filters || {};

      // Log what we're saving to make debugging easier
      console.log("Saving search results with:", {
        hotelsCount: hotels.length,
        locationQuery,
        id,
        typeName,
        checkInDate,
        checkOutDate,
      });

      // Save the search data in the format the hotels page expects
      sessionStorage.setItem(
        "searchResults",
        JSON.stringify({
          hotels,
          filters,
          search: {
            location: locationQuery,
            id,
            typeName,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            travelers: "2 adults · 0 children",
            rooms: "1",
          },
          selectedCity: city,
        })
      );

      // Navigate to hotels page with query parameters
      window.location.href = `/hotels?city=${encodeURIComponent(locationQuery)}&checkIn=${checkInDate}&checkOut=${checkOutDate}&adults=2&children=0&rooms=1`;
    } catch (error) {
      console.error("Error preparing hotel search:", error);

    } finally {
      setLoadingCard(null);
    }
  };

  return (
    <div className=" w-full mx-auto  bg-[#edfaff] p-8 mb-10 rounded-lg">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="  text-black mb-4 text-[32px] font-bold">Featured Properties</h1>
        <div className="flex flex-wrap gap-6 text-sm text-black">
          <span
            className="border-b-2 border-[#d1d8da]"
            style={{
              borderBottomStyle: "dashed",
              borderBottomWidth: "2px",
              borderBottomColor: "#d1d8da",
              borderImage:
                "repeating-linear-gradient(to right, #d1d8da 0, #d1d8da 4px, transparent 4px, transparent 8px) 1",
            }}
          >
            We Price Match
          </span>
          <span
            className="border-b-2 border-[#d1d8da]"
            style={{
              borderBottomStyle: "dashed",
              borderBottomWidth: "2px",
              borderBottomColor: "#d1d8da",
              borderImage:
                "repeating-linear-gradient(to right, #d1d8da 0, #d1d8da 4px, transparent 4px, transparent 8px) 1",
            }}
          >
            Hotel Booking Guarentee
          </span>
          <span
            className="border-b-2 border-[#d1d8da]"
            style={{
              borderBottomStyle: "dashed",
              borderBottomWidth: "2px",
              borderBottomColor: "#d1d8da",
              borderImage:
                "repeating-linear-gradient(to right, #d1d8da 0, #d1d8da 4px, transparent 4px, transparent 8px) 1",
            }}
          >
            Hotel Stay Guarentee
          </span>
        </div>
      </div>

      {/* Country Images Selection - horizontal scrollable row */}
      <div className="w-full overflow-x-auto mb-8 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div
          className="flex gap-6 min-w-fit pb-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {countryImages.map((country) => (
            <Card
              key={country.name}
              className="overflow-hidden bg-white border-0 shadow-sm cursor-pointer group flex-shrink-0"
              style={{ minWidth: 270, maxWidth: 320 }}
              onClick={() => handleCountryImageClick(country.name)}
            >
              <div className="aspect-[4/3] bg-white rounded-lg overflow-hidden relative">
                <Image
                  src={country.image}
                  alt={country.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-300 p-4 rounded-3xl"
                  unoptimized
                />
                <div className="absolute inset-0">
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black bg-opacity-70 text-white text-base md:text-lg font-bold shadow">{country.name}</span>
                </div>
                {loadingCard === country.name && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                    <span className="text-black font-semibold">Loading...</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={country.rating} />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
									<span className="font-bold text-black">
										{country.reviews} reviews
									</span>
									<span className="font-bold text-black">
										From{" "}
										{formatPrice(
											Math.floor(parseInt(country.price))  * (exchangeRates[selectedCurrency] || 1),
											selectedCurrency
										)}
									</span>
								</div>
              
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
