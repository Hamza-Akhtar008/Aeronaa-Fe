import React from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Star, Building, MapPin, Users } from "lucide-react";
import { CURRENCIES } from "@/lib/utils/currency";


// Types for props
import { FilterSidebarProps } from "@/types/FilterSidebarProps";

const reviewRatingLabels = {
  5: "Excellent",
  4: "Very Good",
  3: "Good",
  2: "Fair",
  1: "Poor",
};

const HotelFiltersSidebar: React.FC<FilterSidebarProps> = ({
  showFilters,
  convertedPriceRange,
  filters,
  updateFilter,
  selectedCurrency,
  availablePropertyTypes,
  apiFilters,
  handleApiFilterSelect,
  handleApiFilterCheckbox,
  clearFilters,
  exchangeRates,
}) => 
{

return (
  <motion.aside
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  className={`lg:min-w-[320px] md:min-w-[300px]  lg:w-3/12 md:w-3/4 w-full ${showFilters ? "block" : "hidden"} lg:block sticky top-0 overflow-y-auto max-h-screen  bg-white border border-gray-200 rounded-xl shadow space-y-0`}
  >
  <div className="p-4 w-full space-y-4">
  <h2 className="text-base font-semibold mb-2 tracking-tight text-gray-800">Filter by:</h2>
      {/* Price Filter */}
  <div className="mb-4 pb-4 border-b border-gray-200">
  <h3 className="font-semibold text-gray-800 mb-2 text-sm">Your budget (per night)</h3>
  <div className="px-0">
          <input
            type="range"
            min={filters.priceRange[0]}
            max={convertedPriceRange[1]}
            value={filters.priceRange[1]}
            onChange={(e) => updateFilter("priceRange", [filters.priceRange[0], Number(e.target.value)])}
            className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:rounded-full"
          />
          <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
            <div className="flex items-center border border-gray-400 rounded-md px-2 py-1">
              <span className="font-medium text-gray-800 mr-1">{CURRENCIES[selectedCurrency as keyof typeof CURRENCIES]?.symbol || selectedCurrency}</span>
              <input
                type="number"
                value={Math.ceil(convertedPriceRange[0]*exchangeRates[selectedCurrency])}
                readOnly
                className="w-16 text-right outline-none bg-transparent text-gray-800"
              />
            </div>
            <span className="mx-2 text-gray-500 text-lg font-bold">-</span>
            <div className="flex items-center border border-gray-400 rounded-md px-2 py-1">
              <span className="font-medium text-gray-800 mr-1">{CURRENCIES[selectedCurrency as keyof typeof CURRENCIES]?.symbol || selectedCurrency}</span>
              <input
                type="number"
                value={Math.ceil(filters.priceRange[1]*exchangeRates[selectedCurrency])}
                readOnly
                className="w-20 text-right outline-none bg-transparent text-gray-800"
              />
            </div>
          </div>
        </div>

  </div>
  <hr className="my-2 border-gray-200" />

      {/* Review Rating Filter */}
      <div>
  <h3 className="font-semibold text-gray-800 mb-2 text-sm flex items-center gap-2">
           Review Rating
        </h3>
  <div className="space-y-1">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.selectedReviewRatings.includes(rating)}
                onChange={() => {
                  if (filters.selectedReviewRatings.includes(rating)) {
                    updateFilter(
                      "selectedReviewRatings",
                      filters.selectedReviewRatings.filter((r) => r !== rating),
                    )
                  } else {
                    updateFilter("selectedReviewRatings", [...filters.selectedReviewRatings, rating])
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <div className="flex text-yellow-400">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#fbbf24" className="text-yellow-400" />
                ))}
                {[...Array(5 - rating)].map((_, i) => (
                  <Star key={i + rating} size={16} className="text-gray-300" />
                ))}
              </div>
              <span className="text-gray-700 text-base">{reviewRatingLabels[rating as keyof typeof reviewRatingLabels]}</span>
            </label>
          ))}
        </div>

  </div>
  <hr className="my-2 border-gray-200" />

      {/* Property Class Filter */}
      {availablePropertyTypes.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-lg flex items-center gap-2">
            Property Class
          </h3>
          <div className="space-y-2">
            {availablePropertyTypes.map((type) => (
              <label key={type} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.propertyTypes.includes(type)}
                  onChange={() => {
                    if (filters.propertyTypes.includes(type)) {
                      updateFilter(
                        "propertyTypes",
                        filters.propertyTypes.filter((t) => t !== type),
                      )
                    } else {
                      updateFilter("propertyTypes", [...filters.propertyTypes, type])
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-base">{type}-star property</span>
              </label>
            ))}
          </div>
        </div>

  )}
  <hr className="my-2 border-gray-200" />

      {/* Distance Filter */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 text-lg flex items-center gap-2">
          Distance from Center
        </h3>
        <div className="px-2">
          <input
            type="range"
            min={1}
            max={50}
            value={filters.distanceFromCenter}
            onChange={(e) => updateFilter("distanceFromCenter", Number(e.target.value))}
            className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:rounded-full"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>1 km</span>
            <span>Within {filters.distanceFromCenter} km</span>
          </div>
        </div>

  </div>
  <hr className="my-2 border-gray-200" />

      {/* Review Count Filter */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 text-lg flex items-center gap-2">
           Minimum Reviews
        </h3>
        <div className="px-2">
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={filters.reviewCountMin}
            onChange={(e) => updateFilter("reviewCountMin", Number(e.target.value))}
            className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:rounded-full"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>0</span>
            <span>{filters.reviewCountMin}+ reviews</span>
          </div>
        </div>
      </div>

      {/* API Filters - Area / Neighborhood */}
      {apiFilters?.neighborhoods?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-lg">Neighborhood</h3>
          <select
            value={apiFilters.neighborhoodId}
            onChange={(e) => handleApiFilterSelect("neighborhoodId", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Areas</option>
            {apiFilters.neighborhoods.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* API Filters - Property Type */}
      {apiFilters?.propertyType?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-lg flex items-center gap-2">
            Property Type
          </h3>
          <div className="space-y-2 w-full min-w-0">
            {apiFilters.propertyType.map((type) => (
              <label key={type.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={apiFilters.propertyTypeIds?.includes(type.id)}
                  onChange={() => handleApiFilterCheckbox("propertyTypeIds", type.id)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-base">{type.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* API Filters - Facilities */}
      {apiFilters?.facilities?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-lg flex items-center gap-2">Facilities</h3>
          <div className="space-y-2">
            {apiFilters.facilities.map((facility) => (
              <label key={facility.id} className="flex items-center space-x-3 cursor-pointer w-full min-w-0">
                <input
                  type="checkbox"
                  checked={apiFilters.facilityIds?.includes(facility.id)}
                  onChange={() => handleApiFilterCheckbox("facilityIds", facility.id)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 break-words whitespace-normal w-full">{facility.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* API Filters - Room Offers */}
      {apiFilters?.roomOffers?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-lg flex items-center gap-2">Room Offers</h3>
          <div className="space-y-2 w-full min-w-0">
            {apiFilters.roomOffers.map((offer) => (
              <label key={offer.id} className="flex items-center space-x-3 cursor-pointer w-full min-w-0">
                <input
                  type="checkbox"
                  checked={apiFilters.roomOfferIds?.includes(offer.id)}
                  onChange={() => handleApiFilterCheckbox("roomOfferIds", offer.id)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 break-words whitespace-normal w-full">{offer.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* API Filters - Room Amenities */}
      {apiFilters?.roomAmenities?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-lg flex items-center gap-2">Room Amenities</h3>
          <div className="space-y-2 w-full min-w-0">
            {apiFilters.roomAmenities.map((amenity) => (
              <label key={amenity.id} className="flex items-center space-x-3 cursor-pointer w-full min-w-0">
                <input
                  type="checkbox"
                  checked={apiFilters.roomAmenityIds?.includes(amenity.id)}
                  onChange={() => handleApiFilterCheckbox("roomAmenityIds", amenity.id)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 break-words whitespace-normal w-full">{amenity.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* API Filters - Something Special */}
      {apiFilters?.somethingSpecial?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-lg flex items-center gap-2">Something Special</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto w-full min-w-0">
            {apiFilters.somethingSpecial.map((special) => (
              <label key={special.id} className="flex items-center space-x-3 cursor-pointer w-full min-w-0">
                <input
                  type="checkbox"
                  checked={apiFilters.somethingSpecialIds?.includes(special.id)}
                  onChange={() => handleApiFilterCheckbox("somethingSpecialIds", special.id)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 break-words whitespace-normal w-full">{special.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters Button */}
      <button
        onClick={clearFilters}
        className="w-full bg-gradient-to-r from-[#024891] to-[#00afd5] hover:from-[#023e8a] hover:to-[#0096c7] text-white py-2 rounded-lg transition-all duration-300 shadow hover:shadow-lg font-medium"
      >
        Clear All Filters
      </button>
    </div>
  </motion.aside>
);
};
  
 

export default HotelFiltersSidebar;
