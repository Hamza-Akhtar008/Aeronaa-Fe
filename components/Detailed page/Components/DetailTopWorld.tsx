import React, { useState } from 'react'
import { MapPin, Star, Heart, Waves, Flower2, Utensils, Sparkles } from 'lucide-react';
import Link from 'next/link';

const DetailTopWorld = () => {
  const [isReadMore, setIsReadMore] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const ratings = [
    { label: "Location", value: 96, score: "4.8" },       
    { label: "Cleanliness", value: 98, score: "4.9" },     
    { label: "Service", value: 96, score: "4.8" },
    { label: "Value", value: 92, score: "4.6" }
  ];

  const amenities = [
    { icon: <Waves className="h-6 w-6" />, label: "Infinity Pool" },
    { icon: <Flower2 className="h-6 w-6" />, label: "Spa" },
    { icon: <Utensils className="h-6 w-6" />, label: "Restaurant" }
  ];

  const fullText =
    "Secrets Akumal Riviera Maya offers a grand escape full of both relaxation and adventure. The hotel features spacious rooms as well as inviting gardens and direct beach access. Wellness lovers will enjoy the world-class spa, while foodies can indulge in multiple dining options.";
  const shortText = fullText.slice(0, 120) + "...";

  return (
    <div className="bg-[#f8f8f6] p-4 sm:p-6 md:p-8 rounded-lg w-full">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 lg:gap-10">
        {/* Left Main Section */}
        <div className="flex-1 min-w-0 lg:min-w-[360px]">
          {/* Hotel Number & Title */}
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#023e8a]">01.</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#023e8a] leading-tight mt-0 mb-2">
              Secrets Akumal Riviera Maya
            </h2>
          </div>

          {/* Location and Description */}
          <div className="space-y-4 md:space-y-6">
            <Link href="#" className="flex items-center gap-2 text-lg text-gray-600 underline hover:text-[#023e8a] mb-6" style={{ width: 'fit-content' }}>
              <MapPin className="h-5 w-5" />
              Akumal, Mexico
            </Link>
            <div className="flex flex-col sm:flex-row items-start gap-2">
              <span className="mt-1">
                <Sparkles className="h-5 w-5 text-[#023e8a]" />
              </span>
              <div className="text-gray-600 text-base sm:text-lg leading-relaxed font-normal max-w-xl">
                {isReadMore ? fullText : shortText}
                <button
                  type="button"
                  className="ml-2 underline font-medium text-[#023e8a] hover:opacity-80 transition-colors"
                  onClick={() => setIsReadMore(!isReadMore)}
                >
                  Read {isReadMore ? 'less' : 'more'} <span className={`inline-block align-middle ${isReadMore ? 'rotate-180' : ''}`}>▼</span>
                </button>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-6 sm:mt-8">
            <h4 className="text-lg font-bold text-[#023e8a] mb-4">What travelers love most</h4>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-full shadow-sm border border-[#eee] text-[#222] font-semibold text-sm sm:text-base flex-1 sm:flex-none justify-center sm:justify-start"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Ratings Section */}
        <div className="flex flex-col min-w-0 lg:min-w-[300px] mt-8 lg:mt-14 w-full lg:w-[340px]">
          {/* Save Button */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="flex items-center gap-2 px-6 sm:px-8 py-2 border-2 border-[#023e8a] rounded-full text-lg sm:text-xl font-semibold hover:bg-[#023e8a] hover:text-white transition-all mb-6 sm:mb-8 w-full sm:w-auto justify-center"
          >
            <Heart className={`h-6 w-6 ${isSaved ? 'fill-current text-[#023e8a]' : 'text-[#023e8a]'}`} />
            Save
          </button>

          {/* Rating and Reviews */}
          <div className="space-y-4 w-full">
            <div className="flex items-center flex-wrap gap-2 sm:gap-3">
              <span className="text-4xl sm:text-5xl font-bold text-[#023e8a] leading-none">4.8</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="inline-block">
                    <svg width="24" height="24">
                      <circle cx="12" cy="12" r="9" fill="#023e8a" />
                    </svg>
                  </span>
                ))}
              </div>
              <Link href="#" className="text-gray-600 text-base sm:text-lg underline hover:text-[#023e8a]">
                (13,815 reviews)
              </Link>
            </div>

            {/* Ratings Graph */}
            <div className="flex flex-col gap-2 w-full">
              {ratings.map((rating) => (
                <div key={rating.label} className="flex items-center gap-2 w-full">
                  <span className="w-24 sm:w-32 text-gray-600 text-sm sm:text-base font-medium">{rating.label}</span>
                  <div className="flex-1 h-3 bg-[#e6e6e3] rounded-full overflow-hidden mx-2">
                    <div
                      className="h-full bg-[#023e8a] rounded-full transition-all duration-500"
                      style={{ width: `${rating.value}%` }}
                    />
                  </div>
                  <span className="w-8 text-[#023e8a] text-base font-semibold text-right">{rating.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTopWorld;