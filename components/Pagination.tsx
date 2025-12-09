import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Create pagination array with current page and neighbors
  const getPaginationItems = () => {
    const items: (number | string)[] = [];
    const maxPagesToShow = 5;
    
    // Always show first page
    items.push(1);
    
    // Calculate range of pages to show around current page
    let rangeStart = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let rangeEnd = Math.min(totalPages - 1, currentPage + Math.floor(maxPagesToShow / 2));
    
    // Adjust range if current page is near start or end
    if (currentPage <= 3) {
      rangeEnd = Math.min(totalPages - 1, maxPagesToShow);
    } else if (currentPage >= totalPages - 2) {
      rangeStart = Math.max(2, totalPages - maxPagesToShow);
    }
    
    // Add ellipsis if needed before range start
    if (rangeStart > 2) {
      items.push('...');
    }
    
    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      items.push(i);
    }
    
    // Add ellipsis if needed after range end
    if (rangeEnd < totalPages - 1) {
      items.push('...');
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(totalPages);
    }
    
    return items;
  };

  const paginationItems = getPaginationItems();

  return (
    <div className="flex items-center justify-center mt-8 gap-1">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center h-10 w-10 rounded-md transition-colors ${
          currentPage === 1
            ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-100'
            : 'bg-white text-[#023e8a] hover:bg-[#023e8a]/10 border border-gray-200'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {paginationItems.map((item, index) => {
        if (item === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex items-center justify-center h-10 w-10 text-gray-400"
            >
              &hellip;
            </span>
          );
        }
        
        const isCurrentPage = item === currentPage;
        return (
          <button
            key={`page-${item}`}
            onClick={() => handlePageChange(item as number)}
            className={`flex items-center justify-center h-10 w-10 rounded-md font-medium transition-colors ${
              isCurrentPage
                ? 'bg-[#023e8a] text-white'
                : 'bg-white text-gray-700 hover:bg-[#023e8a]/10 border border-gray-200'
            }`}
            aria-label={`Page ${item}`}
            aria-current={isCurrentPage ? 'page' : undefined}
          >
            {item}
          </button>
        );
      })}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center h-10 w-10 rounded-md transition-colors ${
          currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-100'
            : 'bg-white text-[#023e8a] hover:bg-[#023e8a]/10 border border-gray-200'
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
