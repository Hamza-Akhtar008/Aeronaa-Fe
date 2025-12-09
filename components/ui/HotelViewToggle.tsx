import React from "react";

interface HotelViewToggleProps {
  value: 'list' | 'grid';
  onChange: (mode: 'list' | 'grid') => void;
  className?: string;
}

const HotelViewToggle: React.FC<HotelViewToggleProps> = ({ value, onChange, className = "" }) => {
  return (
    <div className={`inline-flex rounded border border-gray-200 bg-white shadow-sm overflow-hidden ${className}`}>
      <button
        className={`px-4 py-1 text-sm font-medium transition-colors duration-150 ${
          value === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        style={{ borderRight: '1px solid #e5e7eb' }}
        onClick={() => onChange('list')}
        aria-pressed={value === 'list'}
      >
        List
      </button>
      <button
        className={`px-4 py-1 text-sm font-medium transition-colors duration-150 ${
          value === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => onChange('grid')}
        aria-pressed={value === 'grid'}
      >
        Grid
      </button>
    </div>
  );
};

export default HotelViewToggle;
