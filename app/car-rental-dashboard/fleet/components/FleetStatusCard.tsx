import React from "react";

interface FleetStatusCardProps {
  available: number;
  rented: number;
  maintenance: number;
  total: number;
}

const FleetStatusCard: React.FC<FleetStatusCardProps> = ({ available, rented, maintenance, total }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-green-100 p-1.5">
          {/* Icon for Available */}
          <span className="inline-block w-4 h-4 bg-green-600 rounded-full" />
        </div>
        <span className="text-sm">Available</span>
      </div>
      <span className="font-medium">{available} Vehicles</span>
    </div>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-blue-100 p-1.5">
          {/* Icon for Rented */}
          <span className="inline-block w-4 h-4 bg-blue-600 rounded-full" />
        </div>
        <span className="text-sm">Rented</span>
      </div>
      <span className="font-medium">{rented} Vehicles</span>
    </div>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-yellow-100 p-1.5">
          {/* Icon for Maintenance */}
          <span className="inline-block w-4 h-4 bg-yellow-600 rounded-full" />
        </div>
        <span className="text-sm">Maintenance</span>
      </div>
      <span className="font-medium">{maintenance} Vehicles</span>
    </div>
    <div className="mt-2 pt-2 border-t">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Total Fleet</span>
        <span className="font-medium">{total} Vehicles</span>
      </div>
    </div>
  </div>
);

export default FleetStatusCard;
