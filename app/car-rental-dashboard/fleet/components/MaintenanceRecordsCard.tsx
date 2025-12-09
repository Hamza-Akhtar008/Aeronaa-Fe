import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface MaintenanceVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  licensePlate?: string;
  license?: string;
  location: string;
  dailyRate: number;
}

interface MaintenanceRecordsCardProps {
  isLoading: boolean;
  vehicles: MaintenanceVehicle[];
}

const MaintenanceRecordsCard: React.FC<MaintenanceRecordsCardProps> = ({ isLoading, vehicles }) => (
  <Card>
    <CardHeader>
      <CardTitle>Maintenance Records</CardTitle>
      <CardDescription>
        Current and scheduled maintenance activities
      </CardDescription>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-t-[#023e8a] border-r-[#00b4d8] border-b-[#023e8a] border-l-[#00b4d8] rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-500">Loading maintenance records...</p>
          </div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">No vehicles currently in maintenance</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Daily Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{vehicle.make} {vehicle.model}</span>
                    <span className="text-xs text-gray-500">{vehicle.year}</span>
                  </div>
                </TableCell>
                <TableCell>{vehicle.category}</TableCell>
                <TableCell>{vehicle.licensePlate || vehicle.license}</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Maintenance</Badge>
                </TableCell>
                <TableCell>{vehicle.location}</TableCell>
                <TableCell>${vehicle.dailyRate}/day</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </CardContent>
  </Card>
);

export default MaintenanceRecordsCard;
