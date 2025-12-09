import React from "react";

interface MaintenanceVehicle {
  id: string;
  make: string;
  model: string;
}

interface UpcomingMaintenanceCardProps {
  vehicles: MaintenanceVehicle[];
}

const UpcomingMaintenanceCard: React.FC<UpcomingMaintenanceCardProps> = ({ vehicles }) => (
  <div className="space-y-4">
    {vehicles.length === 0 ? (
      <div className="flex justify-center items-center h-32 text-gray-500">
        <p>No maintenance scheduled</p>
      </div>
    ) : (
      <>
        {vehicles.slice(0, 3).map((vehicle) => (
          <div key={vehicle.id} className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <span className="inline-block w-4 h-4 bg-yellow-600 rounded-full" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{vehicle.make} {vehicle.model}</p>
                <p className="text-xs text-gray-500">Maintenance Scheduled</p>
              </div>
            </div>
            <button className="btn btn-outline btn-sm">Details</button>
          </div>
        ))}
        {vehicles.length > 3 && (
          <div className="text-center mt-2 pt-2 border-t text-sm text-blue-600">
            +{vehicles.length - 3} more vehicles in maintenance
          </div>
        )}
      </>
    )}
  </div>
);

export default UpcomingMaintenanceCard;
