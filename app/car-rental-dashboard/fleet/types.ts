// Types for Fleet Management
import { CarStatus } from "@/lib/CarStatus";

export interface Vehicle {
  id?: string;
  _id?: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  license?: string;
  category: string;
  carStatus: CarStatus;
  fuelType?: string;
  seats: number;
  mileage: string | number;
  dailyRate: number;
  images?: string[];
  location: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: string;
  description: string;
  carStatus: CarStatus;
  startDate: string;
  estimatedEndDate: string;
  cost: number;
  technician: string;
}
