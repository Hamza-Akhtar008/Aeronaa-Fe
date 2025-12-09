
import React from "react";
import Image from "next/image";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import type { Vehicle } from "../types";
import { CarStatus } from "@/lib/CarStatus";

interface VehicleDetailsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	loading: boolean;
	vehicle: Vehicle | null;
}

const VehicleDetailsDialog: React.FC<VehicleDetailsDialogProps> = ({ open, onOpenChange, loading, vehicle }) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className="max-w-3xl">
			<DialogHeader>
				<DialogTitle>Vehicle Details</DialogTitle>
				<DialogDescription>
					Detailed information about the selected vehicle
				</DialogDescription>
			</DialogHeader>
			{loading ? (
				<div className="flex justify-center items-center py-8">
					<div className="w-8 h-8 border-4 border-t-[#023e8a] border-r-[#00b4d8] border-b-[#023e8a] border-l-[#00b4d8] rounded-full animate-spin"></div>
				</div>
			) : vehicle ? (
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
											<div className="relative rounded-lg overflow-hidden h-48 bg-gray-100 flex items-center justify-center">
												{vehicle.images && vehicle.images.length > 0 ? (
													<Carousel className="w-full h-full">
														<CarouselContent>
															{vehicle.images.map((img: string, idx: number) => (
																<CarouselItem key={idx} className="w-full h-48 flex items-center justify-center">
																	<Image
																		src={img}
																		alt={`${vehicle.make} ${vehicle.model} ${idx+1}`}
																		width={400}
																		height={192}
																		className="w-full h-full object-cover"
																	/>
																</CarouselItem>
															))}
														</CarouselContent>
														<CarouselPrevious />
														<CarouselNext />
													</Carousel>
												) : (
													<div className="flex flex-col items-center justify-center text-gray-400">
														<Car size={64} />
														<span className="mt-2">No image available</span>
													</div>
												)}
											</div>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<p className="text-sm text-gray-500">Status</p>
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
								</div>
								<div>
									<p className="text-sm text-gray-500">Daily Rate</p>
									<p className="font-semibold">${vehicle.dailyRate || 0}/day</p>
								</div>
							</div>
						</div>
						<div className="space-y-4">
							<div>
								<h3 className="text-xl font-bold">{vehicle.make} {vehicle.model} ({vehicle.year})</h3>
								<p className="text-gray-500">{vehicle.category}</p>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-gray-500">License Plate</p>
									<p className="font-medium">{vehicle.licensePlate || vehicle.license || 'N/A'}</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">Location</p>
									<p className="font-medium">{vehicle.location || 'N/A'}</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">Seats</p>
									<p className="font-medium">{vehicle.seats || 'N/A'}</p>
								</div>
								
								<div>
									<p className="text-sm text-gray-500">Mileage</p>
									<p className="font-medium">{vehicle.mileage || '0'} km</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">ID</p>
									<p className="font-medium text-gray-500 text-xs truncate">{vehicle.id || vehicle._id || 'N/A'}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="py-8 text-center text-gray-500">
					No vehicle information available
				</div>
			)}
			<DialogFooter>
				<Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);

export default VehicleDetailsDialog;
