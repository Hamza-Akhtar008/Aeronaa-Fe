import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface HotelsLoadMoreProps {
  onClick: () => void;
  loading: boolean;
}

const HotelsLoadMore: React.FC<HotelsLoadMoreProps> = ({ onClick, loading }) => {
  const [hasSearchResults, setHasSearchResults] = useState(true);
  
  // Check if search results exist in sessionStorage
  useEffect(() => {
    const checkSearchResults = () => {
      const searchResults = sessionStorage.getItem("searchResults");
      if (!searchResults) {
        console.warn("No search results found in sessionStorage");
        setHasSearchResults(false);
        return;
      }
      
      try {
        const parsed = JSON.parse(searchResults);
        const hasValidData = 
          parsed && 
          parsed.search && 
          parsed.search.id && 
          parsed.search.typeName;
        
        setHasSearchResults(hasValidData);
        
        if (!hasValidData) {
          console.warn("Invalid search results in sessionStorage:", parsed);
        }
      } catch (e) {
        console.error("Error parsing search results:", e);
        setHasSearchResults(false);
      }
    };
    
    checkSearchResults();
  }, []);
  
  const handleClick = () => {
    if (!hasSearchResults) {
      alert("Unable to load more hotels. Please try a new search.");
      return;
    }
    onClick();
  };
  
  return (
    <div className="text-center py-8">
      <button
        onClick={handleClick}
        disabled={loading || !hasSearchResults}
        className="bg-gradient-to-r from-[#024891] to-[#00afd5] hover:from-[#023e8a] hover:to-[#0096c7] text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading More...
          </>
        ) : !hasSearchResults ? (
          "Search Data Missing"
        ) : (
          "Load More Hotels"
        )}
      </button>
    </div>
  );
};

export default HotelsLoadMore;
