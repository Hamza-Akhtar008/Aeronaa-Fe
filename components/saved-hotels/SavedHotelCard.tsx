import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { DeleteHotelFromFavourites } from "@/lib/api";

interface SavedHotelCardProps {
  hotel: any;
  favoriteId: string;
  onDelete: (favoriteId: string) => void;
  grid?: boolean;
}

export const SavedHotelCard = ({ hotel, favoriteId, onDelete, grid }: SavedHotelCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await DeleteHotelFromFavourites(favoriteId);
      onDelete(favoriteId);
    } catch (error) {
      console.error('Failed to delete favorite:', error);
    }
  };

  if (grid) {
    // Grid view: vertical card (fills grid column, not centered)
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col w-full">
        <div className="relative w-full h-48">
          <Image
            src={hotel.images?.[0] || "/images/image1.jpg"}
            alt={hotel.name}
            layout="fill"
            objectFit="cover"
            className="brightness-95 rounded-t-2xl z-0"
          />
          <button 
            onClick={handleDelete}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 opacity-100 shadow-lg"
          >
            <Heart className="w-5 h-5 transition-colors duration-300 fill-[#023e8a] text-[#023e8a]" />
          </button>
        </div>
        <div className="flex flex-col flex-1 p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#023e8a] font-semibold text-lg line-clamp-1">{hotel.name}</span>
            <span className="ml-2 px-2 py-0.5 text-xs rounded border border-gray-200 bg-gray-50 font-medium text-gray-700">Featured</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#023e8a] mb-2">
            <Star className="w-4 h-4 text-[#023e8a] fill-[#023e8a]" />
            <span className="text-[#023e8a] font-medium text-sm">{hotel.starRating}</span>
            <span className="text-xs text-gray-500">{hotel.city}, {hotel.country}</span>
          </div>
          <div className="text-xs text-gray-500 mb-2">{hotel.description}</div>
          <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col items-end gap-2">
            <Link href={`/detailed/${hotel.id}`} className="block w-full">
              <button className="w-full px-4 py-2 bg-[#024891] text-white rounded-lg shadow hover:bg-[#023e8a] transition-all">
                See availability
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  // List view: horizontal card (default)
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] cursor-pointer relative group h-full flex flex-col">
      <div className="relative w-full h-56">
        <Image
          src={hotel.images?.[0] || "/images/image1.jpg"}
          alt={hotel.name}
          layout="fill"
          objectFit="cover"
          className="brightness-95 z-0"
        />
        <button 
          onClick={handleDelete}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 opacity-100 shadow-lg"
        >
          <Heart className="w-5 h-5 transition-colors duration-300 fill-[#023e8a] text-[#023e8a]" />
        </button>
      </div>
      {/* Rest of the card content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-semibold text-[#023e8a] line-clamp-1">{hotel.name}</h2>
            <div className="flex items-center gap-1.5 bg-[#023e8a]/5 px-2.5 py-1 rounded-full">
              <Star className="w-4 h-4 text-[#023e8a] fill-[#023e8a]" />
              <span className="text-[#023e8a] font-medium text-sm">{hotel.starRating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">{hotel.city}, {hotel.country}</p>
          <div className="relative mb-4">
            <p className={`text-sm text-gray-700 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>{hotel.description}</p>
            {hotel.description && hotel.description.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-[#023e8a] text-sm font-medium hover:text-[#023e8a]/80 focus:outline-none"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col items-end gap-2">
          <Link href={`/detailed/${hotel.id}`} className="block w-full">
            <button className="w-full px-4 py-2 bg-[#024891] text-white rounded-lg shadow hover:bg-[#023e8a] transition-all">
              See availability
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
