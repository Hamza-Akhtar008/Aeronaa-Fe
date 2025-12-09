"use client";
import { useState, useEffect } from "react";
import { getFavoriteHotels } from "@/lib/api";
import { useAuth } from "@/store/authContext";
import { SavedHotelCard } from "@/components/saved-hotels/SavedHotelCard";

export default function SavedHotelsPage() {
  const { auth } = useAuth();
  const [favoriteHotels, setFavoriteHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth) {
      fetchFavoriteHotels();
    }
  }, [auth]);

  const fetchFavoriteHotels = async () => {
    try {
      const favorites = await getFavoriteHotels();
      setFavoriteHotels(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (favoriteId: string) => {
    setFavoriteHotels((prev) => prev.filter((fav) => fav.id !== favoriteId));
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#023e8a] mb-6">
        Your Favorite Hotels
      </h1>
      {favoriteHotels.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No favorite hotels found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteHotels.map((favorite) => (
            <SavedHotelCard
              key={favorite.id}
              hotel={favorite.hotel}
              favoriteId={favorite.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}