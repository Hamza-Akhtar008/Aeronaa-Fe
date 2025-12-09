import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Vehicle } from "../types";
import { baseURL } from "@/lib/utils/utils";
import { CarStatus } from "@/lib/CarStatus";
import axios from "axios";
import usePlacesAutocomplete from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react" 


interface AddVehicleDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	newVehicle: Vehicle;
	setNewVehicle: (vehicle: Vehicle) => void;
	formErrors: any;
	handleFieldChange: (name: string, value: any) => void;
	handleAddVehicle: () => void;
	isSubmitting: boolean;
	fetchVehicles: () => void;
	validateField: (name: string, value: any) => string;
	setFormErrors: (errors: any) => void;
	toast: any;
}

const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({
	open,
	onOpenChange,
	newVehicle,
	setNewVehicle,
	formErrors,
	handleFieldChange,
	handleAddVehicle,
	isSubmitting,
	fetchVehicles,
	validateField,
	setFormErrors,
	toast
}) => {
	const [files, setFiles] = useState<File[]>([]);
	const [uploading, setUploading] = useState(false);
	const [imageError, setImageError] = useState("");

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

// Clear files and location value when dialog opens
useEffect(() => {
	if (open) {
		setFiles([]);
		setValue("", false);
		setImageError("");
	}
}, [open, setValue]);

const handleSelectCity = (city: string) => {
  setValue(city, false);
  clearSuggestions();
  handleFieldChange("location", city);
};
	// Handle file input change (multiple)
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			// Avoid duplicates by checking name and size
			setFiles((prevFiles) => {
				const existing = prevFiles.map(f => f.name + f.size);
				const filtered = newFiles.filter(f => !existing.includes(f.name + f.size));
				return [...prevFiles, ...filtered];
			});
			// Clear image error when files are selected
			if (newFiles.length > 0) {
				setImageError("");
			}
		}
	};

	// Submit all fields and images in one request
	const handleAddVehicleWithImage = async () => {
		// Validate all fields first
		const newErrors = {
			make: validateField('make', newVehicle.make),
			model: validateField('model', newVehicle.model),
			year: validateField('year', newVehicle.year),
			licensePlate: validateField('licensePlate', newVehicle.licensePlate),
			category: validateField('category', newVehicle.category),
			seats: validateField('seats', newVehicle.seats),
			mileage: validateField('mileage', newVehicle.mileage),
			dailyRate: validateField('dailyRate', newVehicle.dailyRate),
			location: validateField('location', newVehicle.location)
		};
		
		setFormErrors(newErrors);
		
		// Check if there are any validation errors
		const hasErrors = Object.values(newErrors).some(error => error !== "");
		if (hasErrors) {
			// Errors will be displayed on the form fields
			return;
		}

		// Check for images
		if (!files.length) {
			setImageError("Please select at least one image file.");
			return;
		}

		setUploading(true);
		const formData = new FormData();
		formData.append("make", newVehicle.make);
		formData.append("model", newVehicle.model);
		formData.append("year", newVehicle.year.toString());
		formData.append("licensePlate", newVehicle.licensePlate || "");
		formData.append("category", newVehicle.category);
		formData.append("fuelType", newVehicle.fuelType || "");
		formData.append("seats", newVehicle.seats.toString());
		formData.append("mileage", newVehicle.mileage.toString());
		formData.append("dailyRate", newVehicle.dailyRate.toString());
		formData.append("location", newVehicle.location);
		formData.append("carStatus", newVehicle.carStatus);
		files.forEach((file) => {
			formData.append("images", file);
		});

		try {
			const authString = localStorage.getItem("auth");
			const token = authString ? JSON.parse(authString) : null;
			const res = await axios.post(baseURL + "carrentals", formData, {
				headers: {
					Authorization: token?.access_token ? `Bearer ${token.access_token}` : undefined,
				},
			});
			setUploading(false);
			if (res.status === 200 || res.status === 201) {
				fetchVehicles(); // Refresh the table
				setNewVehicle({
    make: "",
    model: "",
    year: 0,
    licensePlate: "",
    category: "",
    fuelType: "",
    seats: 0,
    mileage: 0,
    dailyRate: 0,
    location: "",
    carStatus: CarStatus.ACTIVE
  })
				// Clear files
				setFiles([]);
				// Clear form errors
				setFormErrors({
					make: "",
					model: "", 
					year: "",
					licensePlate: "",
					category: "",
					seats: "",
					mileage: "",
					dailyRate: "",
					location: ""
				});
				onOpenChange(false);
				
				// Show success toast
				toast({
					title: "Vehicle Added Successfully",
					description: "The vehicle has been added to your fleet.",
					variant: "default",
				});
			} else {
				toast({
					title: "Error Adding Vehicle",
					description: "Failed to add vehicle. Please try again.",
					variant: "destructive",
				});
			}
		} catch (err: any) {
			setUploading(false);
			const errorMessage = err.response?.data?.message || err.message || "Failed to add vehicle. Please try again.";
			toast({
				title: "Error Adding Vehicle",
				description: errorMessage,
				variant: "destructive",
			});
		}
	};

	return (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className="max-w-md max-h-[80vh] overflow-y-auto ">
			<DialogHeader>
				<DialogTitle>Add New Vehicle</DialogTitle>
				<DialogDescription>
					Enter the details of the new vehicle to add to your fleet
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-4 py-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className="text-sm font-medium">Make</label>
						<Input 
							placeholder="Toyota" 
							className={formErrors.make ? "border-red-500" : ""}
							value={newVehicle.make} 
							onChange={(e) => handleFieldChange('make', e.target.value)}
						/>
						{formErrors.make && <p className="text-xs text-red-500 mt-1">{formErrors.make}</p>}
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium">Model</label>
						<Input 
							placeholder="Camry"
							className={formErrors.model ? "border-red-500" : ""}
							value={newVehicle.model} 
							onChange={(e) => handleFieldChange('model', e.target.value)}
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
							value={newVehicle.year || ''} 
							onChange={(e) => handleFieldChange('year', parseInt(e.target.value) || 0)}
						/>
						{formErrors.year && <p className="text-xs text-red-500 mt-1">{formErrors.year}</p>}
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium">Category</label>
						<Select 
							value={newVehicle.category}
							onValueChange={(value) => handleFieldChange('category', value)}
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
					
				</div>
				<div className="grid grid-cols-2 gap-4">
					
					<div className="space-y-2">
						<label className="text-sm font-medium">Fuel Type</label>
						<Select
							value={newVehicle.fuelType}
							onValueChange={(value) => setNewVehicle({ ...newVehicle, fuelType: value })}
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

					<div className="space-y-2">
						<label className="text-sm font-medium">Seats</label>
						<Input 
							type="number" 
							placeholder="5"
							className={formErrors.seats ? "border-red-500" : ""}
							value={newVehicle.seats || ''} 
							onChange={(e) => handleFieldChange('seats', parseInt(e.target.value) || 0)}
						/>
						{formErrors.seats && <p className="text-xs text-red-500 mt-1">{formErrors.seats}</p>}
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					
					<div className="space-y-2">
						<label className="text-sm font-medium">Mileage</label>
						<Input 
							type="number" 
							placeholder="0"
							className={formErrors.mileage ? "border-red-500" : ""}
							value={newVehicle.mileage || ''} 
							onChange={(e) => handleFieldChange('mileage', parseInt(e.target.value) || 0)}
						/>
						{formErrors.mileage && <p className="text-xs text-red-500 mt-1">{formErrors.mileage}</p>}
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium">Daily Rate ($)</label>
						<Input 
							type="number" 
							placeholder="65.00"
							className={formErrors.dailyRate ? "border-red-500" : ""}
							value={newVehicle.dailyRate || ''} 
							onChange={(e) => handleFieldChange('dailyRate', parseFloat(e.target.value) || 0)}
						/>
						{formErrors.dailyRate && <p className="text-xs text-red-500 mt-1">{formErrors.dailyRate}</p>}
					</div>
				</div>
				<div className="grid grid-cols-1 gap-4">
					
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
						value={newVehicle.carStatus}
						onValueChange={(value) => handleFieldChange('carStatus', value as CarStatus)}
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
												<div className="space-y-2">
														<label className="text-sm font-medium">Vehicle Images</label>
														<Input 
															type="file" 
															multiple 
															onChange={handleFileChange}
															className={imageError ? "border-red-500" : ""}
														/>
														{imageError && <p className="text-xs text-red-500 mt-1">{imageError}</p>}
														{files.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-2">
									{files.map((file, idx) => (
										<div key={idx} className="relative group">
											<img
												src={URL.createObjectURL(file)}
												alt={`preview-${idx}`}
												className="w-20 h-20 object-cover rounded border"
											/>
											<button
												type="button"
												onClick={() => {
													setFiles(prevFiles => prevFiles.filter((_, i) => i !== idx));
												}}
												className="absolute top-0 right-0 bg-black/70 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors opacity-0 group-hover:opacity-100"
												aria-label="Remove image"
											>
												×
											</button>
										</div>
									))}
								</div>
							)}
														{uploading && <p className="text-xs text-blue-500 mt-1">Uploading images...</p>}
												</div>
			</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button 
							className="bg-[#023e8a] hover:bg-[#00b4d8]"
							onClick={handleAddVehicleWithImage}
							disabled={isSubmitting || uploading}
						>
							{isSubmitting || uploading ? "Adding..." : "Add Vehicle"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
	);
};

export default AddVehicleDialog;
