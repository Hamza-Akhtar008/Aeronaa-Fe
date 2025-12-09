"use client";

import Image from "next/image";
import React from "react";

type Card = {
  title: string;
  src: string;
  className: string; // height + responsive col-span
};

const cards: Card[] = [
  {
    title: "Dubai",
    src: "/topTrending1.png",
    className: "lg:col-span-3 h-[280px] sm:h-[280px] lg:h-[280px]",
  },
  {
    title: "Islamabad",
    src: "/topTrending2.png",
    className: "lg:col-span-6 h-[280px] sm:h-[280px] lg:h-[280px]",
  },
  {
    title: "London",
    src: "/topTrending3.png",
    className: "lg:col-span-3 h-[280px] sm:h-[280px] lg:h-[280px]",
  },
  {
    title: "Oman",
    src: "/topTrending4.png",
    className: "lg:col-span-6 h-[280px] sm:h-[280px] lg:h-[280px]",
  },
  {
    title: "Makkah",
    src: "/topTrending5.png",
    className: "lg:col-span-6 h-[280px] sm:h-[280px] lg:h-[280px]",
  },
];

const TopTredingDestination = () => {
  const [loadingIdx, setLoadingIdx] = React.useState<number | null>(null);

  return (
    <section className="mx-auto w-full max-w-8xl px-4 sm:px-6 md:px-3 py-8 sm:py-10">
      {/* Heading */}
      <div className="mb-6 sm:mb-8">
     <h1 className="  text-black  text-[32px] font-bold">
          Trending destinations
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Most popular choices for travelers from Pakistan
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
        {cards.map((card, idx) => (
          <DestinationCard
            key={idx}
            {...card}
            loading={loadingIdx === idx}
            onClick={() => {
              setLoadingIdx(idx);
              const today = new Date();
              const checkInDate = today.toISOString().split("T")[0];
              const tomorrow = new Date(today);
              tomorrow.setDate(today.getDate() + 1);
              const checkOutDate = tomorrow.toISOString().split("T")[0];
              const locationQuery = card.title;
              // Placeholder values for demonstration
              const filters = {};
              const id = "";
              const typeName = "";
              const selectedCity = card.title;
              const searchData = {
                data: {
                  citySearch: {
                    properties: [],
                  },
                },
              };
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
              window.location.href = `/hotels?city=${encodeURIComponent(locationQuery)}&checkIn=${checkInDate}&checkOut=${checkOutDate}&adults=2&children=0&rooms=1`;
            }}
          />
        ))}
      </div>
    </section>
  );
};

const DestinationCard: React.FC<Card & { onClick?: () => void; loading?: boolean }> = ({
  title,
  src,
  className,
  onClick,
  loading,
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gray-200 ${className}`}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      {/* Image */}
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={title}
          fill
          priority
          className="object-cover object-center"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        {/* Top shadow overlay */}
        <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
        {/* Bottom shadow overlay */}
        <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        {/* Loader overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-white"></div>
          </div>
        )}
      </div>

      {/* Dark gradient overlay on top */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Title + flag (emoji to keep it asset-free) */}
      <div className="absolute left-4 sm:left-5 top-4 sm:top-5 flex items-center gap-2">
        <h3 className="text-white text-lg sm:text-xl md:text-2xl font-semibold drop-shadow">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default TopTredingDestination;
