import React from "react";

interface HotelsNoResultsProps {
  onClearFilters: () => void;
}

const HotelsNoResults: React.FC<HotelsNoResultsProps> = ({ onClearFilters }) => (
  <div className="text-center py-16 bg-white rounded-xl shadow-md">
    <p className="text-gray-600 text-lg">No hotels match your current filters.</p>
    <button
      onClick={onClearFilters}
      className="mt-4 bg-gradient-to-r from-[#024891] to-[#00afd5] hover:from-[#023e8a] hover:to-[#0096c7] text-white px-6 py-2 rounded-lg transition-all duration-300"
    >
      Clear All Filters
    </button>
  </div>
);

export default HotelsNoResults;
