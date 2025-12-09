import React from "react";

interface VehicleCategoriesCardProps {
  categories: { name: string; count: number }[];
}

const VehicleCategoriesCard: React.FC<VehicleCategoriesCardProps> = ({ categories }) => (
  <div className="space-y-4">
    {categories.map(({ name, count }) => (
      <div key={name} className="flex justify-between items-center">
        <span className="text-sm">{name}</span>
        <span className="font-medium">{count} Vehicles</span>
      </div>
    ))}
  </div>
);

export default VehicleCategoriesCard;
