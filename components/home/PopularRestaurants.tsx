"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { searchPhotos } from "@/lib/unsplash"
import { UnsplashImageResult } from "@/lib/types/unsplash"
import { restaurants } from "@/lib/data/restaurants"

export function PopularRestaurants() {
  const [restaurantImages, setRestaurantImages] = useState<Record<string, UnsplashImageResult | null>>({})
  const [loading, setLoading] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)

  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    
    const scrollAmount = direction === 'right' ? 300 : -300;
    sliderRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  // Fetch images from Unsplash when component mounts
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        
        const { env } = await import('@/lib/env');
        
        if (!env.UNSPLASH_ACCESS_KEY) {
          console.warn('Unsplash API key is missing. Using fallback images.');
          setLoading(false);
          return;
        }
        
        const imagePromises = restaurants.map(async (restaurant) => {
          try {
            const results = await searchPhotos(restaurant.imageQuery, 1, 1);
            
            if (!results.results.length) {
              return { name: restaurant.name, image: null };
            }
            
            const mainImage = results.results[0];
            return { name: restaurant.name, image: mainImage };
          } catch (error) {
            console.error(`Failed to fetch image for ${restaurant.name}:`, error);
            return { name: restaurant.name, image: null };
          }
        });

        const imagesData = await Promise.all(imagePromises);
        
        const imagesMap = imagesData.reduce((acc, item) => {
          acc[item.name] = item.image;
          return acc;
        }, {} as Record<string, UnsplashImageResult | null>);

        setRestaurantImages(imagesMap);
      } catch (error) {
        console.error('Failed to fetch restaurant images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);
  
  const getRestaurantImage = (restaurantName: string): string => {
    const unsplashImage = restaurantImages[restaurantName];
    const fallbackImage = restaurants.find(r => r.name === restaurantName)?.image || '';
    
    return unsplashImage?.url || fallbackImage;
  };

  return (
    <div className="container py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-[#333333] relative">
          Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#023e8a] to-[#00b4d8]">Restaurants</span>
          <div className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-[#023e8a] to-[#00b4d8]"></div>
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scrollSlider('left')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Scroll left"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => scrollSlider('right')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Scroll right"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div 
        ref={sliderRef}
        className="flex overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {restaurants.map((restaurant) => (
          <Link 
            key={restaurant.name}
            href={`/detailed`}
            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#00b4d8]/20 transition-all duration-300 flex-shrink-0 w-72 mx-2"
          >
            <div className="relative h-64">
              <Image
                src={getRestaurantImage(restaurant.name)}
                alt={restaurant.name}
                fill
                className="object-cover group-hover:scale-110 transition-all duration-500 ease-in-out"
                unoptimized={true}
              />
              {restaurant.topRated && (
                <div className="absolute top-4 right-4 bg-[#00b4d8] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm z-10">
                  Travelers' Choice
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
              )}
              <div className="absolute inset-0  transition-opacity duration-300 group-hover:opacity-95" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-white bg-[#023e8a] px-2 py-1 rounded-full">
                  {restaurant.cuisine}
                </span>
                <span className="text-xs font-medium text-[#023e8a]">{restaurant.priceRange}</span>
                <span className="text-xs text-[#00b4d8]">{restaurant.timing}</span>
              </div>

              <h3 className="font-bold text-lg text-[#333333] mb-1">{restaurant.name}</h3>
              <p className="text-sm text-[#023e8a] mb-3 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {restaurant.location}
              </p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className={`w-4 h-4 rounded-full ${i < Math.floor(restaurant.rating) ? 'bg-[#00b4d8]' : 'bg-white/30'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[#00b4d8] text-sm ml-2">{restaurant.rating}</span>
                  <span className="text-gray-500 text-xs ml-2">({restaurant.reviews})</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {restaurant.features.map((feature, index) => (
                  <span 
                    key={index}
                    className="text-xs text-[#023e8a]/70 bg-[#023e8a]/5 px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="text-sm text-[#333333] mb-2">Top Dishes:</p>
                <div className="flex flex-wrap gap-2">
                  {restaurant.topDishes.map((dish, index) => (
                    <span 
                      key={index}
                      className="text-xs text-[#00b4d8] bg-[#00b4d8]/5 px-2 py-1 rounded-full"
                    >
                      {dish}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {restaurant.highlights.map((highlight, index) => (
                    <span 
                      key={index}
                      className="text-xs text-[#023e8a] flex items-center"
                    >
                      {index > 0 && <span className="mx-1">•</span>}
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
