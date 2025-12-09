import React from 'react';
import { 
  Car, 
  Truck, 
  Tractor, 
  MountainSnow, 
  Sparkles, 
  Wind, 
  Building2, 
  Users 
} from 'lucide-react';

interface CarTypeFilterProps {
  selectedCarTypes: string[];
  onChange: (types: string[]) => void;
}

// Define car types with their icon and label
const carTypes = [
  {
    id: 'Mini',
    label: 'Mini',
    icon: (props: any) => <Car {...props} />,
    description: 'Smallest size, best for city driving'
  },
  {
    id: 'Economy',
    label: 'Economy',
    icon: (props: any) => <Car {...props} />,
    description: 'Fuel efficient, budget friendly'
  },
  {
    id: 'Compact',
    label: 'Compact',
    icon: (props: any) => <Car {...props} />,
    description: 'Small, easy to park'
  },
  {
    id: 'Intermediate',
    label: 'Intermediate',
    icon: (props: any) => <Car {...props} />,
    description: 'Between compact and mid-size'
  },
  {
    id: 'Mid-size',
    label: 'Mid-size',
    icon: (props: any) => <Car {...props} />,
    description: 'Balanced comfort and efficiency'
  },
  {
    id: 'Large',
    label: 'Large',
    icon: (props: any) => <Car {...props} />,
    description: 'Full-size car with ample space'
  },
  {
    id: 'SUV',
    label: 'SUV',
    icon: (props: any) => <MountainSnow {...props} />,
    description: 'Spacious, good for all terrain'
  },
  {
    id: 'Luxury',
    label: 'Luxury',
    icon: (props: any) => <Sparkles {...props} />,
    description: 'Premium features and comfort'
  },
  {
    id: 'Special',
    label: 'Special',
    icon: (props: any) => <Sparkles {...props} />,
    description: 'Unique or specialty vehicles'
  },
  {
    id: 'Convertible',
    label: 'Convertible',
    icon: (props: any) => <Wind {...props} />,
    description: 'Open-air driving experience'
  },
  {
    id: 'Pickup',
    label: 'Pickup',
    icon: (props: any) => <Truck {...props} />,
    description: 'Hauling and towing capability'
  },
  {
    id: 'Van',
    label: 'Van',
    icon: (props: any) => <Users {...props} />,
    description: 'Extra space for passengers'
  },
];

const CarTypeFilter: React.FC<CarTypeFilterProps> = ({ selectedCarTypes, onChange }) => {
  const toggleCarType = (typeId: string) => {
    if (selectedCarTypes.includes(typeId)) {
      onChange(selectedCarTypes.filter((id) => id !== typeId));
    } else {
      onChange([...selectedCarTypes, typeId]);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Car Categories</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {carTypes.map((carType) => {
          const isSelected = selectedCarTypes.includes(carType.id);
          return (
            <button
              key={carType.id}
              onClick={() => toggleCarType(carType.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all group relative ${
                isSelected
                  ? 'bg-[#023e8a] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {React.createElement(carType.icon, {
                className: `w-8 h-8 mb-2 ${isSelected ? 'text-white' : 'text-[#023e8a]'}`,
              })}
              <span className="text-sm font-medium">{carType.label}</span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-max max-w-[200px] bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {carType.description}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CarTypeFilter;
