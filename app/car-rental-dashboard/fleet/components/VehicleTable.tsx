
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { Vehicle } from "../types";
import { CarStatus } from "@/lib/CarStatus";

interface VehicleTableProps {
	vehicles: Vehicle[];
	onViewDetails: (id: string) => void;
	onEditVehicle: (vehicle: Vehicle) => void;
	onDeleteVehicle: (id: string) => void;
	toast: any;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles, onViewDetails, onEditVehicle, onDeleteVehicle, toast }) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>Vehicle</TableHead>
					<TableHead>Category</TableHead>
					<TableHead>Location</TableHead>
					
					<TableHead>Status</TableHead>
					<TableHead>Daily Rate</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{!vehicles || vehicles.length === 0 ? (
					<TableRow>
						<TableCell colSpan={8} className="text-center py-8">
							No vehicles found
						</TableCell>
					</TableRow>
				) : (
					vehicles.map((vehicle, index) => {
						if (!vehicle) return null;
						return (
							<TableRow key={vehicle.id || vehicle._id || `vehicle-${index}`}>
								<TableCell className="font-medium">{vehicle.id || vehicle._id || `N/A-${index}`}</TableCell>
								<TableCell>
									<div className="flex flex-col">
										<span className="font-medium">{vehicle.make || 'N/A'} {vehicle.model || ''}</span>
										<span className="text-xs text-gray-500">{vehicle.year || 'N/A'}</span>
									</div>
								</TableCell>
								<TableCell>{vehicle.category || 'N/A'}</TableCell>
								<TableCell>{vehicle.location || 'N/A'}</TableCell>
								
								<TableCell>
									{(() => {
										if (!vehicle.carStatus) {
											return <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge>;
										}
										switch(vehicle.carStatus) {
											case CarStatus.ACTIVE:
												return <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge>;
											case CarStatus.RENTED:
												return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Rented</Badge>;
											case CarStatus.MAINTAINANCE:
												return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Maintenance</Badge>;
											default:
												return <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge>;
										}
									})()}
								</TableCell>
								<TableCell>${vehicle.dailyRate || 0}/day</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="h-8 w-8 p-0">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={() => {
												let id = vehicle.id?.toString() || vehicle._id?.toString() || "";
												if (id) {
													onViewDetails(id);
												} else {
													toast({
														title: "Error",
														description: "Could not find vehicle ID",
														variant: "destructive",
													});
												}
											}}>View Details</DropdownMenuItem>
											<DropdownMenuItem onClick={() => {
												onEditVehicle(vehicle);
											}}>Edit Vehicle</DropdownMenuItem>
											<DropdownMenuItem>Booking History</DropdownMenuItem>
											<DropdownMenuItem onClick={() => onDeleteVehicle(vehicle.id || vehicle._id || "")}>Delete Vehicle</DropdownMenuItem>
											{vehicle.carStatus === CarStatus.ACTIVE ? (
												<DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
											) : vehicle.carStatus === CarStatus.MAINTAINANCE ? (
												<DropdownMenuItem>Maintenance Details</DropdownMenuItem>
											) : null}
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						);
					})
				)}
			</TableBody>
		</Table>
	);
};

export default VehicleTable;
