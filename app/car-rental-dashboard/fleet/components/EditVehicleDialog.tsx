import React, { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Vehicle } from "../types";
import { CarStatus } from "@/lib/CarStatus";
import usePlacesAutocomplete from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

interface EditVehicleDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	vehicle: Vehicle | null;
	formErrors: any;
	isSubmitting: boolean;
	setVehicle: (vehicle: Vehicle) => void;
	setFormErrors: (errors: any) => void;
	validateField: (name: string, value: any) => string;
	handleUpdateVehicle: (vehicleId: string, updatedData: Partial<Vehicle> | FormData) => Promise<void>;
	toast: any;
	setIsSubmitting: (b: boolean) => void;
}

const EditVehicleDialog: React.FC<EditVehicleDialogProps> = ({
	open,
	onOpenChange,
	vehicle,
	formErrors,
	isSubmitting,
	setVehicle,
	setFormErrors,
	validateField,
	handleUpdateVehicle,
	toast,
	setIsSubmitting
}) => {
	const [newImages, setNewImages] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		requestOptions: {
			types: ["(cities)"], // restrict to cities
		},
		debounce: 300,
	});

	// Set the location value when vehicle data loads
	useEffect(() => {
		if (vehicle && vehicle.location) {
			setValue(vehicle.location, false);
		}
	}, [vehicle, setValue]);

	const handleSelectCity = (city: string) => {
		setValue(city, false);
		clearSuggestions();
		if (vehicle) {
			setVehicle({ ...vehicle, location: city });
		}
	};

	// Handle new image selection
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			// Avoid duplicates by checking name and size
			setNewImages((prev) => {
				const existing = prev.map(f => f.name + f.size);
				const filtered = newFiles.filter(f => !existing.includes(f.name + f.size));
				return [...prev, ...filtered];
			});
		}
	};

	// Remove an existing image (URL)
	const handleRemoveExistingImage = (url: string) => {
		if (!vehicle) return;
		setVehicle({
			...vehicle,
			images: (vehicle.images || []).filter((img: string) => img !== url),
		});
	};

	// Remove a new image (File)
	const handleRemoveNewImage = (file: File) => {
		setNewImages((prev) => prev.filter((f) => f !== file));
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Vehicle</DialogTitle>
					<DialogDescription>
						Edit the details of this vehicle
					</DialogDescription>
				</DialogHeader>
				{vehicle && (
					<div className="grid gap-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Make</label>
							<Input 
								placeholder="Toyota" 
								className={formErrors.make ? "border-red-500" : ""}
								value={vehicle.make} 
								onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
							/>
							{formErrors.make && <p className="text-xs text-red-500 mt-1">{formErrors.make}</p>}
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">Model</label>
							<Input 
								placeholder="Camry"
								className={formErrors.model ? "border-red-500" : ""}
								value={vehicle.model} 
								onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
							/>
							{formErrors.model && <p className="text-xs text-red-500 mt-1">{formErrors.model}</p>}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Year</label>
							<Input 
								type="number" 
								placeholder="2023"
								className={formErrors.year ? "border-red-500" : ""}
								value={vehicle.year || ''} 
								onChange={(e) => setVehicle({ ...vehicle, year: parseInt(e.target.value) || 0 })}
							/>
							{formErrors.year && <p className="text-xs text-red-500 mt-1">{formErrors.year}</p>}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Category</label>
							<Select 
								value={vehicle.category}
								onValueChange={(value) => setVehicle({ ...vehicle, category: value })}
							>
								<SelectTrigger className={formErrors.category ? "border-red-500" : ""}>
									<SelectValue placeholder="Select category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Sedan">Sedan</SelectItem>
									<SelectItem value="SUV">SUV</SelectItem>
									<SelectItem value="Electric">Electric</SelectItem>
									<SelectItem value="Luxury">Luxury</SelectItem>
									<SelectItem value="Economy">Economy</SelectItem>
									<SelectItem value="Sports">Sports</SelectItem>
								</SelectContent>
							</Select>
							{formErrors.category && <p className="text-xs text-red-500 mt-1">{formErrors.category}</p>}
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">Fuel Type</label>
							<Select
								value={vehicle.fuelType || ''}
								onValueChange={(value) => setVehicle({ ...vehicle, fuelType: value })}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Gasoline">Gasoline</SelectItem>
									<SelectItem value="Diesel">Diesel</SelectItem>
									<SelectItem value="Electric">Electric</SelectItem>
									<SelectItem value="Hybrid">Hybrid</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Seats</label>
							<Input 
								type="number" 
								placeholder="5"
								className={formErrors.seats ? "border-red-500" : ""}
								value={vehicle.seats || ''} 
								onChange={(e) => setVehicle({ ...vehicle, seats: parseInt(e.target.value) || 0 })}
							/>
							{formErrors.seats && <p className="text-xs text-red-500 mt-1">{formErrors.seats}</p>}
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">Mileage</label>
							<Input 
								type="number" 
								placeholder="0"
								className={formErrors.mileage ? "border-red-500" : ""}
								value={typeof vehicle.mileage === 'string' ? vehicle.mileage : vehicle.mileage || ''} 
								onChange={(e) => setVehicle({ ...vehicle, mileage: e.target.value })}
							/>
							{formErrors.mileage && <p className="text-xs text-red-500 mt-1">{formErrors.mileage}</p>}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Daily Rate ($)</label>
							<Input 
								type="number" 
								placeholder="65.00"
								className={formErrors.dailyRate ? "border-red-500" : ""}
								value={vehicle.dailyRate || ''} 
								onChange={(e) => setVehicle({ ...vehicle, dailyRate: parseFloat(e.target.value) || 0 })}
							/>
							{formErrors.dailyRate && <p className="text-xs text-red-500 mt-1">{formErrors.dailyRate}</p>}
						</div>
						<div className="space-y-2">
						<label className="text-sm font-medium">Location</label>

						<Combobox value={value} onChange={handleSelectCity}>
							<div className="relative">
								<ComboboxInput
									as={Input}
									placeholder="Search city..."
									className={formErrors.location ? "border-red-500" : ""}
									value={value}
									onChange={(e) => setValue(e.target.value)}
									disabled={!ready}
								/>

								{status === "OK" && data.length > 0 && (
									<ComboboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white text-sm shadow-lg">
										{[
											...new Map(
												data.map((suggestion) => {
													const city =
														suggestion.terms?.[0]?.value ||
														suggestion.structured_formatting?.main_text ||
														suggestion.description.split(",")[0]

													return [city.toLowerCase(), city] // use lowercase for uniqueness
												})
											).values(),
										].map((city, index) => (
											<ComboboxOption
												key={index}
												value={city}
												className="cursor-pointer px-3 py-2 hover:bg-gray-100"
											>
												{city}
											</ComboboxOption>
										))}
									</ComboboxOptions>
								)}
							</div>
						</Combobox>

						{formErrors.location && <p className="text-xs text-red-500 mt-1">{formErrors.location}</p>}
					</div>
					</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Status</label>
									<Select
										value={vehicle.carStatus?.toString()}
										onValueChange={(value) => setVehicle({ ...vehicle, carStatus: value as CarStatus })}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={CarStatus.ACTIVE}>Active</SelectItem>
											<SelectItem value={CarStatus.RENTED}>Rented</SelectItem>
											<SelectItem value={CarStatus.MAINTAINANCE}>Maintenance</SelectItem>
										</SelectContent>
									</Select>
								</div>

								
								{Array.isArray(vehicle.images) && vehicle.images.length > 0 && (
									<div className="space-y-2">
										<label className="text-sm font-medium">Existing Images</label>
										<div className="grid grid-cols-3 gap-2">
											{[...new Set(vehicle.images)].map((img: string, idx: number) => (
												<div key={idx} className="relative group">
													<img src={img} alt="Vehicle" className="w-20 h-20 object-cover rounded border" />
													<button
														type="button"
														className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100"
														onClick={() => handleRemoveExistingImage(img)}
														title="Remove image"
													>
														×
													</button>
												</div>
											))}
										</div>
									</div>
								)}

								
								{newImages.length > 0 && (
									<div className="space-y-2">
										<label className="text-sm font-medium">New Images to Upload</label>
										<div className="flex flex-wrap gap-2 mt-2">
											{newImages.map((file, idx) => (
												<div key={idx} className="relative group">
													<img
														src={URL.createObjectURL(file)}
														alt={`New Upload ${idx+1}`}
														className="w-20 h-20 object-cover rounded border"
													/>
													<button
														type="button"
														className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100"
														onClick={() => handleRemoveNewImage(file)}
														title="Remove new image"
													>
														×
													</button>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Image Upload Input */}
								<div className="space-y-2">
									<label className="text-sm font-medium">Add Images</label>
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										multiple
										onChange={handleImageChange}
										className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#023e8a] file:text-white hover:file:bg-[#00b4d8]"
									/>
								</div>
				</div>
			)}

					<DialogFooter>
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button
							className="bg-[#023e8a] hover:bg-[#00b4d8]"
							onClick={async () => {
								if (vehicle) {
									const newErrors = {
										make: validateField('make', vehicle.make),
										model: validateField('model', vehicle.model),
										year: validateField('year', vehicle.year),
										category: validateField('category', vehicle.category),
										seats: validateField('seats', vehicle.seats),
										mileage: validateField('mileage', vehicle.mileage),
										dailyRate: validateField('dailyRate', vehicle.dailyRate),
										location: validateField('location', vehicle.location)
									};
									setFormErrors(newErrors);
									const hasErrors = Object.values(newErrors).some(error => error !== "");
									if (hasErrors) {
										toast({
											title: "Validation Error",
											description: "Please correct the errors in the form",
											variant: "destructive",
										});
										return;
									}
									const vehicleId = vehicle.id || vehicle._id || "";
									if (vehicleId) {
										setIsSubmitting(true);
										// Prepare FormData for update
										const formData = new FormData();
										// Append all fields
										Object.entries(vehicle).forEach(([key, value]) => {
											if (key === "images") return; // handle images separately
											if (value !== undefined && value !== null) {
												formData.append(key, value as any);
											}
										});
										// Append all images (existing URLs and new files) to the same 'images' field
										let imagesArray: string[] = [];
										if (Array.isArray(vehicle.images)) {
											imagesArray = vehicle.images;
										} else if (vehicle.images) {
											imagesArray = [vehicle.images];
										}
										// Send each image URL as a separate field in FormData
										// Workaround: If only one image, append it twice so backend always gets an array
										if (imagesArray.length === 1) {
											formData.append("images", imagesArray[0]);
											formData.append("images", imagesArray[0]);
										} else {
											imagesArray.forEach((img: string) => {
												formData.append("images", img);
											});
										}
										await handleUpdateVehicle(vehicleId, formData);
										setNewImages([]);
										onOpenChange(false);
										setIsSubmitting(false);
										toast({
											title: "Vehicle Updated",
											description: "The vehicle details have been successfully updated",
										});
									}
								}
							}}
							disabled={isSubmitting}
						>
							{isSubmitting ? "Updating..." : "Update Vehicle"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
};

export default EditVehicleDialog;
