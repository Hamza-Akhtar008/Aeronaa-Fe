"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { AddHotelToFavourites, DeleteHotelFromFavourites, getFavoriteHotels } from "@/lib/api"
import { useAuth } from "@/store/authContext"
import { Popbutton } from "./Popbutton"




interface HotelCardProps {
  hotel: Hotel
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const { auth } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  // Add a unique ID for this card instance
  const cardId = `hotel-${hotel.id}`;

  // Check initial favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!auth) {
        setIsFavorite(false);
        setFavoriteId(null);
        return;
      }
      try {
        const favorites = await getFavoriteHotels();
        console.log('All favorites:', favorites); // Debug log
        
        const favorite = favorites?.find((fav: any) => {
          console.log('Comparing:', {
            favHotelId: fav.hotel?.id,
            currentHotelId: hotel.id,
            isFavorite: String(fav.hotel?.id) === String(hotel.id)
          });
          return fav.hotel && String(fav.hotel.id) === String(hotel.id);
        });

        if (favorite) {
          console.log('Found favorite:', favorite);
          setIsFavorite(true);
          setFavoriteId(favorite.id);
        } else {
          console.log('No favorite found for hotel:', hotel.id);
          setIsFavorite(false);
          setFavoriteId(null);
        }
      } catch (error) {
        console.error('Error checking favorites:', error);
        setIsFavorite(false);
        setFavoriteId(null);
      }
    };

    checkFavoriteStatus();
  }, [auth, hotel.id]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!auth) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      if (isFavorite && favoriteId) {
        await DeleteHotelFromFavourites(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        try {
          const result = await AddHotelToFavourites(String(hotel.id));
          setIsFavorite(true);
          if (result.id) {
            setFavoriteId(result.id);
          }
        } catch (error: any) {
          if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
            setIsFavorite(true);
          } else {
            console.error('Failed to update favorites:', error);
          }
        }
      }
    } catch (error) {
      console.error('Failed to update favorite:', error);
    }
  };

  const toggleDescription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    // Store expanded state in sessionStorage
    sessionStorage.setItem(cardId, (!isExpanded).toString());
  };

  // Initialize expanded state from sessionStorage
  useEffect(() => {
    const savedState = sessionStorage.getItem(cardId);
    if (savedState !== null) {
      setIsExpanded(savedState === 'true');
    }
  }, [cardId]);
 

  return (
    <>
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] relative group h-72 md:h-80 flex flex-col">
  {/* Background Image with Overlay */}
  <div className="relative w-full h-full">
    <Image
      src={hotel.images?.[0] || "/images/image1.jpg"}
      alt={hotel.name}
      layout="fill"
      objectFit="cover"
      className="brightness-90"
    />
    {/* Blue Tint Overlay */}
    <div className="absolute inset-0" />
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    {/* Travellers' Choice Badge */}
    <div className="absolute top-2 md:top-4 left-2 md:left-4 z-20">
      <span className="bg-cyan-400 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-medium">Top Rated</span>
    </div>
    {/* Favorite Button */}
    <button
      onClick={handleFavorite}
      className="absolute top-2 md:top-4 right-2 md:right-4 z-20 p-1.5 md:p-2 rounded-full bg-white/20 backdrop-blur-sm 
      hover:bg-white/30 transition-all duration-300 opacity-100"
    >
      <Heart
        className={`w-4 h-4 md:w-5 md:h-5 transition-colors duration-300 ${
          isFavorite ? "fill-red-500 text-red-500" : "fill-transparent text-white"
        }`}
      />
    </button>
    {/* Content Overlay */}
    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 z-10">
      {/* Category and Location */}
      <div className="flex items-center gap-2 mb-1 md:mb-2">
        <span className="bg-blue-600 text-white px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-xs font-medium">Hotel</span>
        <span className="text-cyan-300 text-xs md:text-sm font-medium">
          {hotel.city}, {hotel.country}
        </span>
      </div>
      {/* Hotel Name */}
      <h2 className="text-white text-lg md:text-xl font-bold mb-1 md:mb-2 line-clamp-1">{hotel.name}</h2>
      {/* Description */}
      <div className="mb-2 md:mb-3">
        <div className={`relative ${isExpanded ? "max-h-none" : "max-h-8 md:max-h-10 overflow-hidden"}`}>
          <p className="text-white/90 text-xs md:text-sm leading-relaxed">{hotel.description}</p>
        </div>
        {hotel.description && hotel.description.length > 80 && (
          <button
            onClick={toggleDescription}
            className="text-cyan-300 text-xs font-medium hover:text-cyan-200 focus:outline-none mt-1"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Rating, Average Price, and View Button */}
      <div className="flex items-center justify-between">
        {/* Rating */}
        <div className="flex items-center gap-1 md:gap-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${star <= parseInt(hotel.starRating) ? "bg-cyan-400" : "bg-white/30"}`}
              />
            ))}
          </div>
          <span className="text-cyan-300 text-xs md:text-sm font-medium">{hotel.starRating} </span>
        </div>
        {/* Average Price */}
        <div className="text-cyan-300 text-xs md:text-sm font-medium">
          ${hotel.averagePrice || "N/A"} / night
        </div>
      </div>

      {/* View Button */}
      <div className="mt-2 md:mt-3">
        <Link href={`/detailed/${hotel.id}`}>
          <button className="px-4 py-2 bg-[#024891] text-white rounded-lg shadow hover:bg-[#023e8a] transition-all">
            See availability
          </button>
        </Link>
      </div>
    </div>
    {/* Click overlay for navigation */}
    <Link href={`/detailed/${hotel.id}`} className="absolute inset-0 z-5" />
  </div>
</div>


{showLoginPrompt && (
        <Popbutton
          title="Login Required"
          message="Please login to add hotels to your favorites"
          actionLabel="Login"
          onConfirm={() => window.location.href = '/signin'}
          onClose={() => setShowLoginPrompt(false)}
        />
      )}
    
    </>
  )
}

export default HotelCard