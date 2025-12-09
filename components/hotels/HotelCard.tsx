import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Wifi, Parking, Pool, Utensils, Car } from "lucide-react";
import { motion } from "framer-motion";
import type { HotelAPI } from "@/types/hotels";
import EmbeddedMap from "../embeddedmap";

interface HotelCardProps {
  hotel: HotelAPI;
  index: number;
  checkIn: string;
  checkOut: string;
  getDistanceFromCityCenter: (hotel: HotelAPI) => number;
  getReviewRatingRange: (score: number) => number;
  convertPrice: (price: number, fromCurrency?: string, toCurrency?: string) => number;
  selectedCurrency: string;
  formatPrice: (price: number, currency: string) => string;
  grid?: boolean;
  travelers?:string
}
const reviewRatingLabels: Record<number, string> = {
  9: "Excellent",
  8: "Very Good",
  7: "Good",
  6: "Fair",
  5: "Poor",
};const getReviewLabel = (score: number): string => {
  if (score >= 9) return "Excellent";
  if (score >= 8) return "Very Good";
  if (score >= 7) return "Good";
  if (score >= 6) return "Fair";
  return "Poor";
};
const GoldStar = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#FFD700"
  >
    <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.402 8.174L12 18.896l-7.336 3.861 
             1.402-8.174L.132 9.211l8.2-1.193L12 .587z"/>
  </svg>
);

// Helper function to get amenities icons
const getAmenitiesIcons = (hotel: HotelAPI) => {
  const amenities = [];
  
  // Check for common amenities in the hotel data
  if (hotel.property.facilities?.some(f => f.name.toLowerCase().includes('wifi'))) {
    amenities.push({ icon: Wifi, label: 'Free WiFi' });
  }
  if (hotel.property.facilities?.some(f => f.name.toLowerCase().includes('parking'))) {
    amenities.push({ icon: Parking, label: 'Parking' });
  }
  if (hotel.property.facilities?.some(f => f.name.toLowerCase().includes('pool'))) {
    amenities.push({ icon: Pool, label: 'Pool' });
  }
  if (hotel.property.facilities?.some(f => f.name.toLowerCase().includes('restaurant'))) {
    amenities.push({ icon: Utensils, label: 'Restaurant' });
  }
  if (hotel.property.facilities?.some(f => f.name.toLowerCase().includes('shuttle'))) {
    amenities.push({ icon: Car, label: 'Shuttle' });
  }
  
  return amenities.slice(0, 4); // Limit to 4 amenities for mobile
};

const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  index,
  checkIn,
  checkOut,
  getDistanceFromCityCenter,
  getReviewRatingRange,
  convertPrice,
  selectedCurrency,
  formatPrice,
  grid,
  travelers="2 adults"
}) => {
  const {
    id,
    name,
    reviewScore,
    reviewCount,
    photoUrls,
    priceBreakdown,
    propertyClass,
    address,
    checkinDate,
    checkoutDate,
    accessibilityLabel,
  } = hotel.property;
  const distance = getDistanceFromCityCenter(hotel);
  const price = priceBreakdown?.grossPrice?.value || 0;
  const originalPrice = priceBreakdown?.strikethroughPrice?.value;
  const photo = photoUrls && photoUrls.length > 0 ? photoUrls[0] : null;
  const reviewRating = getReviewRatingRange(reviewScore || 0);
  const hasDeals = priceBreakdown?.benefitBadges && priceBreakdown.benefitBadges.length > 0;
  const amenities = getAmenitiesIcons(hotel);

  if (grid) {
    // Grid view: vertical card
    return (
   <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: index * 0.05 }}
  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col w-full max-w-md mx-auto hover:bg-blue-200"
>
  {/* Image Section */}
  <div className="relative w-full h-40 sm:h-48 md:h-44 lg:h-48">
    {photo ? (
      <Image
        src={photo || "/placeholder.svg?height=224&width=300&query=hotel exterior"}
        alt={accessibilityLabel || name}
        fill
        className="object-cover rounded-t-2xl"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
    ) : (
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-full w-full flex items-center justify-center text-gray-500 rounded-t-2xl">
        <p className="text-xs sm:text-sm md:text-xs">No image available</p>
      </div>
    )}

    {/* Price badge overlay */}
    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1">
      <div className="text-xs sm:text-sm font-bold text-[#024891]">
        {formatPrice(convertPrice(price), selectedCurrency)}
      </div>
    </div>
  </div>

  {/* Details Section */}
  <div className="flex flex-col flex-1 p-3 sm:p-4 lg:p-5">
    <div className="flex items-center gap-1 sm:gap-2 mb-1">
      <span className="text-[#024891] font-semibold text-sm sm:text-base lg:text-lg line-clamp-1">
        {name}
      </span>


      <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded border border-gray-200 bg-gray-50 font-medium text-gray-700">
        Featured
      </span>
    </div>
  {address && (
        
       < EmbeddedMap name={name}  address={address}/>
          
        )}

    {/* Stars */}
    <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
      {Array.from({ length: propertyClass || 0 }, (_, i) => (
        <GoldStar key={i} size={12} className="sm:w-4 sm:h-4" />
      ))}
    </div>

    {/* Reviews */}
    <div className="flex items-center flex-wrap gap-1 sm:gap-2 text-[11px] sm:text-sm text-[#024891] mb-1 sm:mb-2">
      <span>{getReviewLabel(reviewScore || 0)}</span>
      <span className="bg-[#024891] text-white px-1.5 sm:px-2 py-0.5 rounded-lg font-bold text-[11px] sm:text-sm">
        {reviewScore}
      </span>
      <span className="text-[10px] sm:text-xs text-gray-500">{reviewCount} reviews</span>
      <span className="text-[11px] sm:text-sm text-gray-700">
        Comfort {getReviewRatingRange(reviewScore ?? 0)}
      </span>
    </div>

    {/* Amenities */}
    {amenities.length > 0 && (
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
        {amenities.map((amenity, idx) => (
          <div key={idx} className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600">
            <amenity.icon size={10} className="sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">{amenity.label}</span>
          </div>
        ))}
      </div>
    )}

    <div className="text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-2">Guest review summary</div>

    <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm text-[#024891] mb-1 sm:mb-2">
      <span className="text-gray-500">{distance.toFixed(2)} km from downtown</span>
    </div>

    {/* Footer */}
    <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div className="flex flex-col items-start">
        {(() => {
          let nights = 1;
          if (checkIn && checkOut) {
            const inDate = new Date(checkIn);
            const outDate = new Date(checkOut);
            if (!isNaN(inDate.getTime()) && !isNaN(outDate.getTime())) {
              nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));
            }
          }
          return (
            <div className="text-[10px] sm:text-xs text-gray-500 mb-1">
              {nights} nights, {travelers}
            </div>
          );
        })()}
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#024891]">
          {formatPrice(convertPrice(price), selectedCurrency)}
        </div>
        <div className="text-[10px] sm:text-xs text-gray-500">+taxes and fees</div>
      </div>

      <Link
        href={{
          pathname: `/detailed/${id}`,
          query: { checkin: checkIn, checkout: checkOut },
        }}
        target="_blank"
        onClick={async() => {
 await   sessionStorage.setItem('firstroomprice',price.toLocaleString());
    await   localStorage.setItem('firstroomprice',price.toLocaleString());


    const channel = new BroadcastChannel("session-sync");

    // Serialize sessionStorage to plain object
    const sessionData: Record<string, string> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) sessionData[key] = sessionStorage.getItem(key) as string;
    }

    // Send to other tabs
    channel.postMessage({ type: "SYNC_SESSION", data: sessionData });

    // Receive from other tabs
    channel.onmessage = (e) => {
      if (e.data.type === "SYNC_SESSION") {
        for (const key in e.data.data) {
          sessionStorage.setItem(key, e.data.data[key]);
        }
      }
    };

    // Mirror some important keys to localStorage
    ["searchResults", "selectedCity", "userCountry", "usercountry"].forEach((key) => {
      const val = sessionStorage.getItem(key);
      if (val) localStorage.setItem(key, val);
    });
  }}
        className="w-full sm:w-auto"
      >
        <button className="mt-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#024891] text-white rounded-lg font-medium shadow hover:bg-[#023e8a] transition-all w-full lg:w-auto text-[12px] sm:text-sm">
          See availability
        </button>
      </Link>
    </div>
  </div>
</motion.div>

    );
  }
  // List view: styled like the custom card in page.tsx
  return (
<motion.div
  key={id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: index * 0.05 }}
  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col lg:flex-row w-full hover:shadow-xl transition-all duration-200"
>
  <Link
    href={{
      pathname: `/detailed/${id}`,
      query: { checkin: checkIn, checkout: checkOut },
    }}
    target="_blank"
    className="flex w-full"
 onClick={async() => {
    await   sessionStorage.setItem('firstroomprice',price.toLocaleString());
    await   localStorage.setItem('firstroomprice',price.toLocaleString());


    const channel = new BroadcastChannel("session-sync");

    // Serialize sessionStorage to plain object
    const sessionData: Record<string, string> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) sessionData[key] = sessionStorage.getItem(key) as string;
    }

    // Send to other tabs
    channel.postMessage({ type: "SYNC_SESSION", data: sessionData });

    // Receive from other tabs
    channel.onmessage = (e) => {
      if (e.data.type === "SYNC_SESSION") {
        for (const key in e.data.data) {
          sessionStorage.setItem(key, e.data.data[key]);
        }
      }
    };

    // Mirror some important keys to localStorage
    ["searchResults", "selectedCity", "userCountry", "usercountry"].forEach((key) => {
      const val = sessionStorage.getItem(key);
      if (val) localStorage.setItem(key, val);
    });
  }}
  >
    {/* ---------- IMAGE ---------- */}
    <div className="relative w-full lg:w-56 lg:min-w-[220px] h-48 lg:h-full rounded-t-2xl lg:rounded-l-2xl overflow-hidden flex-shrink-0">
      {photo ? (
        <Image
          src={photo}
          alt={name}
          fill
          className="object-cover h-full w-full"
        />
      ) : (
        <div className="bg-gray-200 h-full w-full flex items-center justify-center text-gray-500">
          <p>No image</p>
        </div>
      )}

      {/* Mobile price badge */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 lg:hidden">
        <div className="text-sm font-bold text-[#024891]">
          {formatPrice(convertPrice(price), selectedCurrency)}
        </div>
        <div className="text-xs text-gray-500">per night</div>
      </div>
    </div>

    {/* ---------- INFO ---------- */}
    <div className="flex flex-1 flex-col justify-between p-4 gap-3">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#024891] font-semibold text-base lg:text-lg line-clamp-1">{name}</span>
            <span className="ml-2 px-2 py-0.5 text-xs rounded border border-gray-200 bg-gray-50 font-medium text-gray-700">Featured</span>
          </div>

        {address && (
        
       < EmbeddedMap name={name}  address={address}/>
          
        )}

          {/* Stars */}
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: propertyClass || 0 }, (_, i) => (
              <GoldStar key={i} size={14} />
            ))}
          </div>
           <div className="flex flex-wrap gap-2 mt-2">
            {  <span className="px-2 py-1 text-xs bg-gray-100 rounded-full border border-gray-200">  {(() => {
          let nights = 1;
          if (checkIn && checkOut) {
            const inDate = new Date(checkIn);
            const outDate = new Date(checkOut);
            if (!isNaN(inDate.getTime()) && !isNaN(outDate.getTime())) {
              nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));
            }
          }
          return (
            <div className="text-[10px] sm:text-xs text-gray-500 mb-1">
              {nights} nights
            </div>
          );
        })()}</span>}
           <span className="px-2 py-1 text-xs bg-gray-100 rounded-full border border-gray-200">{travelers}</span>
          </div>

          {/* Distance */}
          {typeof distance === "number" && (
            <p className="text-gray-500 text-xs mb-2">{distance.toFixed(1)} km from downtown</p>
          )}

          {/* Amenities for mobile */}
          {amenities?.length > 0 && (
            <div className="flex flex-wrap gap-2 lg:hidden mt-1">
              {amenities.map((a, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full border border-gray-200">
                  {a.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Ratings */}
        <div className="flex flex-col items-start lg:items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">{getReviewLabel(reviewScore || 0)}</span>
            <span className="bg-[#024891] text-white px-2 py-1 rounded-lg font-bold text-sm">{reviewScore}</span>
          </div>
          <span className="text-xs text-gray-500">{reviewCount} reviews</span>
          <span className="text-sm text-gray-700">Comfort {getReviewRatingRange(reviewScore ?? 0)}</span>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mt-2 gap-4">
        <div className="flex flex-col justify-end items-start lg:items-end flex-1">
          <div className="text-xs text-gray-500 mb-1">

             {(() => {
          let nights = 1;
          if (checkIn && checkOut) {
            const inDate = new Date(checkIn);
            const outDate = new Date(checkOut);
            if (!isNaN(inDate.getTime()) && !isNaN(outDate.getTime())) {
              nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));
            }
          }
          return (
            <div className="text-[10px] sm:text-xs text-gray-500 mb-1">
              {nights} nights, {travelers}
            </div>
          );
        })()}
          </div>
          <div className="text-xl lg:text-2xl font-bold text-[#024891]">{formatPrice(convertPrice(price), selectedCurrency)}</div>
          <div className="text-xs text-gray-500">+ taxes and fees</div>
          <button className="mt-2 px-3 py-1 bg-[#024891] text-white rounded-lg font-medium shadow hover:bg-[#023e8a] transition-all w-full lg:w-auto">
            See availability
          </button>
        </div>
      </div>
    </div>
  </Link>
</motion.div>

  );
};

export default HotelCard;
