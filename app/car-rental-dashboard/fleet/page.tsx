"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Filter,
  PlusCircle,
  Download,
  AlertTriangle,
  Search
} from "lucide-react";

//api call import
import { createCarRental, getCarRentals,getCarRentalById,deleteCarRental,updateCarRental, getCarRentalsVendor } from "@/lib/api";
import { CarStatus } from "@/lib/CarStatus";


// Types moved to types.ts
import type { Vehicle, MaintenanceRecord } from "./types";
import VehicleTable from "./components/VehicleTable";
import AddVehicleDialog from "./components/AddVehicleDialog";
import FleetStatusCard from "./components/FleetStatusCard";
import VehicleCategoriesCard from "./components/VehicleCategoriesCard";
import UpcomingMaintenanceCard from "./components/UpcomingMaintenanceCard";
import FleetTabs from "./components/FleetTabs";
import EditVehicleDialog from "./components/EditVehicleDialog";
import VehicleDetailsDialog from "./components/VehicleDetailsDialog";

export default function FleetManagement() {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingVehicleDetails, setLoadingVehicleDetails] = useState(false);
  const [fetchedVehicles, setFetchedVehicles] = useState<Vehicle[]>([]);
  const [showEditVehicleDialog, setShowEditVehicleDialog] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();
 
  
  // For field-level validation errors
  const [formErrors, setFormErrors] = useState({
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
  
  
  // Form state
  const [newVehicle, setNewVehicle] = useState<Vehicle>({
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
  });
  
  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);
  
  // Function to fetch vehicles
  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await getCarRentalsVendor();
      
      // Process API response
      if (Array.isArray(response)) {
        // Direct array response
        setFetchedVehicles(response);
      } else if (response && typeof response === 'object') {
        // Response might be wrapped in a property like 'data' or 'vehicles'
        const dataArray = 
          response.data ? response.data : 
          response.vehicles ? response.vehicles : 
          response.carrentals ? response.carrentals : 
          [];
          
        if (Array.isArray(dataArray)) {
          setFetchedVehicles(dataArray);
        } else {
          setFetchedVehicles([]);
          console.error("Unexpected API response format:", response);
          setError("Unexpected data format received from API");
        }
      } else {
        setFetchedVehicles([]);
        console.error("Invalid API response:", response);
        setError("Invalid response received from API");
      }
    } catch (error: any) {
      console.error("Error fetching vehicles:", error);
      setFetchedVehicles([]);
      setError(error.message || "Failed to load vehicles");
      toast({
        title: "Error",
        description: "Failed to load vehicles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  
  // Apply a transform to ensure all vehicles have consistent carStatus values
  const displayVehicles = fetchedVehicles.map(vehicle => {
    // Make a copy to avoid direct mutation
    const processedVehicle = { ...vehicle };
    
    // Normalize carStatus to match enum values if needed
    if (!processedVehicle.carStatus || 
        (typeof processedVehicle.carStatus === 'string' && 
         !Object.values(CarStatus).includes(processedVehicle.carStatus as CarStatus))) {
      // Default to ACTIVE if missing or invalid
      processedVehicle.carStatus = CarStatus.ACTIVE;
    }
    
    return processedVehicle;
  });
  
  
  // Filter vehicles based on tab with safer checks
  const availableVehicles = displayVehicles.filter(vehicle => 
    vehicle && vehicle.carStatus && (
      vehicle.carStatus === CarStatus.ACTIVE || 
      vehicle.carStatus.toString() === 'active'
    )
  );
  
  const rentedVehicles = displayVehicles.filter(vehicle => 
    vehicle && vehicle.carStatus && (
      vehicle.carStatus === CarStatus.RENTED ||
      vehicle.carStatus.toString() === 'rented'
    )
  );
  
  const maintenanceVehicles = displayVehicles.filter(vehicle => 
    vehicle && vehicle.carStatus && (
      vehicle.carStatus === CarStatus.MAINTAINANCE ||
      vehicle.carStatus.toString() === 'maintainance'
    )
  );

  const activeTabVehicles = activeTab === "all"
    ? displayVehicles
    : activeTab === "available" 
      ? availableVehicles 
      : activeTab === "rented" 
        ? rentedVehicles 
        : maintenanceVehicles;
  
  // Log the active tab vehicles before filtering
  console.log(`Current active tab: ${activeTab} with ${activeTabVehicles.length} vehicles`, activeTabVehicles);
  
  // Filter vehicles based on search with additional safeguards
  const filteredVehicles = searchTerm
    ? activeTabVehicles.filter(vehicle => {
        if (!vehicle) return false;
        
        try {
          const searchLower = searchTerm.toLowerCase();
          // Handle different property names that might come from API
          return (
            // Make and model
            (vehicle.make?.toString().toLowerCase().includes(searchLower) || false) ||
            (vehicle.model?.toString().toLowerCase().includes(searchLower) || false) ||
            
            // ID fields (could be id or _id in MongoDB)
            (vehicle.id?.toString().toLowerCase().includes(searchLower) || false) ||
            (vehicle._id?.toString().toLowerCase().includes(searchLower) || false) ||
            
         
            
            // Location and category
            (vehicle.location?.toString().toLowerCase().includes(searchLower) || false) ||
            (vehicle.category?.toString().toLowerCase().includes(searchLower) || false)
          );
        } catch (err) {
          console.error("Error filtering vehicle:", err, vehicle);
          return false;
        }
      })
    : activeTabVehicles;
  
  // Log the final filtered vehicles for debugging
  console.log(`Final filtered vehicles count: ${filteredVehicles.length}`, filteredVehicles);
  
  // Function to handle viewing vehicle details
  const handleViewDetails = async (vehicleId: string) => {
    setLoadingVehicleDetails(true);
    try {
      console.log("Fetching details for vehicle ID:", vehicleId);
      
      if (!vehicleId) {
        throw new Error("Vehicle ID is required");
      }
      
      const response = await getCarRentalById(vehicleId);
      console.log("Vehicle details API response:", response);
      
      // Handle different API response formats
      let vehicleData: Vehicle | null = null;
      
      if (response) {
        // Check if response is an array
        if (Array.isArray(response)) {
          // Take the first item from the array
          if (response.length > 0) {
            vehicleData = response[0];
            console.log("Using first vehicle from array response");
          }
        } else if (response.data && typeof response.data === 'object') {
          // Response has a data property
          if (Array.isArray(response.data) && response.data.length > 0) {
            // data is an array, take first item
            vehicleData = response.data[0];
            console.log("Using first vehicle from response.data array");
          } else {
            // data is a single object
            vehicleData = response.data;
          }
        } else if (response.carrental && typeof response.carrental === 'object') {
          // Response has a carrental property
          vehicleData = response.carrental;
        } else if (response.car && typeof response.car === 'object') {
          // Response has a car property
          vehicleData = response.car; 
        } else if (typeof response === 'object') {
          // Response is directly the vehicle object
          vehicleData = response;
        }
      }
      
      console.log("Extracted vehicle data:", vehicleData);
      
      // If we still don't have valid data, look in the vehicle list
      if (!vehicleData) {
        console.warn("No vehicle data returned from API, searching in local data");
        const localVehicle = fetchedVehicles.find(v => (v.id === vehicleId || v._id === vehicleId));
        
        if (localVehicle) {
          console.log("Found vehicle in local data:", localVehicle);
          vehicleData = localVehicle;
        } else {
          console.error("Could not find vehicle data locally or from API");
        }
      }
      
      setSelectedVehicle(vehicleData);
      console.log("Set selected vehicle:", vehicleData);
      setShowVehicleDetails(true);
    } catch (error: any) {
      console.error("Error fetching vehicle details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch vehicle details",
        variant: "destructive",
      });
    } finally {
      setLoadingVehicleDetails(false);
    }
  };
    
  // Validate a single field
  const validateField = (name: string, value: any): string => {
    // Check for empty/null/undefined values
    if (value === null || value === undefined || value === "") {
      // Special handling for optional fields
      if (name === 'fuelType' || name === 'licensePlate') {
        return "";
      }
      return "This field is required";
    }
    
    // Add specific validations for different fields
    switch (name) {
      case 'make':
        if (typeof value !== 'string') return "Make must be text";
        if (value.trim().length < 2) return "Make must be at least 2 characters";
        if (value.trim().length > 50) return "Make must be less than 50 characters";
        if (!/^[a-zA-Z0-9\s-]+$/.test(value)) return "Make can only contain letters, numbers, spaces and hyphens";
        return "";
        
      case 'model':
        if (typeof value !== 'string') return "Model must be text";
        if (value.trim().length < 1) return "Model must be at least 1 character";
        if (value.trim().length > 50) return "Model must be less than 50 characters";
        if (!/^[a-zA-Z0-9\s-]+$/.test(value)) return "Model can only contain letters, numbers, spaces and hyphens";
        return "";
        
     case 'year':
    const yearNum = Number(value);
    const currentYear = new Date().getFullYear();

    if (isNaN(yearNum)) return "Year must be a number";
    if (!Number.isInteger(yearNum)) return "Year must be a whole number";
    if (yearNum < 1900) return "Year must be 1900 or later";
    if (yearNum > currentYear) return `Year cannot be later than ${currentYear}`;
    return "";

        
      case 'category':
        if (typeof value !== 'string') return "Please select a category";
        if (value.trim().length === 0) return "Please select a category";
        const validCategories = ['Sedan', 'SUV', 'Electric', 'Luxury', 'Economy', 'Sports'];
        if (!validCategories.includes(value)) return "Please select a valid category";
        return "";
        
      case 'fuelType':
        // Optional field
        if (!value || value.trim().length === 0) return "";
        const validFuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
        if (!validFuelTypes.includes(value)) return "Please select a valid fuel type";
        return "";
        
      case 'seats':
        const seatsNum = Number(value);
        if (isNaN(seatsNum)) return "Seats must be a number";
        if (!Number.isInteger(seatsNum)) return "Seats must be a whole number";
        if (seatsNum < 1) return "Seats must be at least 1";
        if (seatsNum > 50) return "Seats cannot exceed 50";
        return "";
        
      case 'mileage':
        const mileageNum = Number(value);
        if (isNaN(mileageNum)) return "Mileage must be a number";
        if (mileageNum < 0) return "Mileage cannot be negative";
        if (mileageNum > 999999) return "Mileage seems unrealistic";
        return "";
        
      case 'dailyRate':
        const rateNum = Number(value);
        if (isNaN(rateNum)) return "Daily rate must be a number";
        if (rateNum <= 0) return "Daily rate must be greater than 0";
        if (rateNum > 10000) return "Daily rate seems too high";
        return "";
        
      case 'location':
        if (typeof value !== 'string') return "Location must be text";
        if (value.trim().length < 2) return "Location must be at least 2 characters";
        if (value.trim().length > 100) return "Location must be less than 100 characters";
        return "";
        
      case 'licensePlate':
        // Optional field
        if (!value || value.trim().length === 0) return "";
        if (value.trim().length > 20) return "License plate must be less than 20 characters";
        return "";
        
      default:
        return "";
    }
  };
  
  // Handle field change with validation
  const handleFieldChange = (name: string, value: any) => {
    // Update the vehicle state
    setNewVehicle(prev => ({ ...prev, [name]: value }));
    
    // Validate and update error state
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };
  
  // Handle adding a new vehicle
  const handleAddVehicle = async () => {
    // Validate all fields at once
    const newErrors = {
      make: validateField('make', newVehicle.make),
      model: validateField('model', newVehicle.model),
      year: validateField('year', newVehicle.year),
      licensePlate: "",
      category: validateField('category', newVehicle.category),
      seats: validateField('seats', newVehicle.seats),
      mileage: validateField('mileage', newVehicle.mileage),
      dailyRate: validateField('dailyRate', newVehicle.dailyRate),
      location: validateField('location', newVehicle.location)
    };
    
    setFormErrors(newErrors);
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (hasErrors) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format the data according to the API schema
      const vehicleData = {
        make: newVehicle.make,
        model: newVehicle.model,
        year: newVehicle.year,
        licensePlate: newVehicle.licensePlate||"",
        category: newVehicle.category,
        seats: newVehicle.seats,
        mileage: newVehicle.mileage.toString(),
        dailyRate: newVehicle.dailyRate,
        location: newVehicle.location,
        carStatus: newVehicle.carStatus,
        images: newVehicle.images || [] 
      };
      
      console.log("Submitting vehicle data:", vehicleData);
      
      // Call the API
      const response = await createCarRental(vehicleData);
      console.log("Create vehicle API response:", response);
      
      // Get the created vehicle from response
      let createdVehicle = response?.data || response; 
      
      // Ensure the created vehicle has the proper carStatus format to match the enum
      if (createdVehicle) {
         setFetchedVehicles(prev => [...prev, createdVehicle]);
        // Add or normalize the carStatus field if needed
        if (!createdVehicle.carStatus) {
          createdVehicle = {
            ...createdVehicle,
            carStatus: newVehicle.carStatus // Use the value from the form
          };
        }
        
        console.log("Normalized vehicle to add:", createdVehicle);
        
        // First update the vehicle state (synchronous)
        setFetchedVehicles(prev => {
          const updatedVehicles = [...prev, createdVehicle];
          console.log("Updated vehicles state:", updatedVehicles);
          return updatedVehicles;
        });
        
        // Use a small timeout to ensure the state update is processed
        // This helps when fakefiller or other tools rapidly fill the form
        setTimeout(() => {
          // Force a UI refresh by setting a dummy state
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 10);
        }, 100);
      }    
      
        // Handle success
      toast({
        title: "Vehicle Added",
        description: "The vehicle was successfully added to the fleet",
        variant: "default",
      });
      
      // Reset form errors
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
      
      // Reset form
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
      });
      
      // Close the dialog
      setShowAddVehicleDialog(false);
      
      // Allow a little time for the UI to update
      setTimeout(() => {
        // If the data doesn't appear after adding the vehicle,
        // this will trigger a re-render that should show it
        setActiveTab(prev => {
          console.log("Forcing UI refresh by toggling active tab");
          return prev;
        });
      }, 300);
      
     
      toast({
        title: "Error",
        description: typeof error === "object" && error !== null && "message" in error
          ? (error as any).message
          : (typeof error === "string" ? error : "Failed to add vehicle. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE VEHICLE
  const handleDeleteVehicle = async (vehicleId: string) => {
    console.log("Deleting vehicle with ID:", vehicleId);
    try {
      const response = await deleteCarRental(vehicleId);
      
      if (!response || response.error) {
        toast({
          title: "Error",
          description: response?.error || "Failed to delete vehicle. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Show success toast
      toast({
        title: "Vehicle Deleted",
        description: "The vehicle has been successfully removed from your fleet.",
        variant: "default",
      });

      // Refresh the vehicle list
      await fetchVehicles();

      console.log("Delete vehicle API response:", response);
    } catch (error: any) {
      console.error("Error deleting vehicle:", error);
      toast({
        title: "Error Deleting Vehicle",
        description: error?.response?.data?.message || error?.message || "Failed to delete vehicle. Please try again.",
        variant: "destructive",
      });
    }
  };


  // Update vehicle details
  const handleUpdateVehicle = async (vehicleId: string, updatedData: Partial<Vehicle> | FormData) => {
    console.log("Updating vehicle with ID:", vehicleId);
    try {
      let response;
      if (updatedData instanceof FormData) {
        // Send as multipart/form-data
        const authString = localStorage.getItem("auth");
        const token = authString ? JSON.parse(authString) : null;
        const headers: Record<string, string> = {};
        if (token?.access_token) headers['Authorization'] = `Bearer ${token.access_token}`;
        
        const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_Backend_Url || ''}carrentals/${vehicleId}`, {
          method: 'PATCH',
          headers,
          body: updatedData,
        });
        
        if (!fetchResponse.ok) {
          const errorData = await fetchResponse.json().catch(() => ({}));
          throw new Error(errorData?.message || 'Failed to update vehicle');
        }
        
        response = await fetchResponse.json();
      } else {
        response = await updateCarRental(vehicleId, updatedData);
      }
      
      if (!response || response.error) {
        toast({
          title: "Error",
          description: response?.error || "Failed to update vehicle. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Show success toast
      toast({
        title: "Vehicle Updated",
        description: "The vehicle details have been successfully updated.",
        variant: "default",
      });

      // Refresh the vehicle list
      await fetchVehicles();

      console.log("Update vehicle API response:", response);
    } catch (error: any) {
      console.error("Error updating vehicle:", error);
      toast({
        title: "Error Updating Vehicle",
        description: error?.response?.data?.message || error?.message || "Failed to update vehicle. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Fleet Management</h2>
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-t-[#023e8a] border-r-[#00b4d8] border-b-[#023e8a] border-l-[#00b4d8] rounded-full animate-spin"></div>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full p-1 h-8 w-8" 
              onClick={fetchVehicles}
              title="Refresh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
              </svg>
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export
          </Button>
          <Button 
            className="bg-[#023e8a] hover:bg-[#00b4d8] gap-2"
            onClick={() =>{

              setShowAddVehicleDialog(true)
            
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
            }

            } 
              
          >
            <PlusCircle size={16} />
            Add Vehicle
          </Button>
        </div>
      </div>
      
      <FleetTabs activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search vehicles..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filter
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Inventory</CardTitle>
            <CardDescription>
              {activeTab === "all" ? "All vehicles in your fleet" : 
               activeTab === "available" ? "Vehicles available for rental" :
               activeTab === "rented" ? "Currently rented vehicles" :
               "Vehicles under maintenance"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-t-[#023e8a] border-r-[#00b4d8] border-b-[#023e8a] border-l-[#00b4d8] rounded-full animate-spin"></div>
                  <p className="mt-2 text-gray-500">Loading vehicles...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-40">
                <div className="flex flex-col items-center">
                  <AlertTriangle className="h-10 w-10 text-red-500" />
                  <p className="mt-2 text-red-500">{error}</p>
                  <Button 
                    onClick={fetchVehicles} 
                    className="mt-4 bg-[#023e8a] hover:bg-[#00b4d8]"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <VehicleTable
                vehicles={filteredVehicles}
                onViewDetails={handleViewDetails}
                onEditVehicle={(vehicle) => { setEditVehicle({...vehicle}); setShowEditVehicleDialog(true); }}
                onDeleteVehicle={handleDeleteVehicle}
                toast={toast}
              />
            )}
          </CardContent>
        </Card>
      </FleetTabs>
      


      
      {/* <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Fleet Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="w-8 h-8 border-4 border-t-[#023e8a] border-r-[#00b4d8] border-b-[#023e8a] border-l-[#00b4d8] rounded-full animate-spin"></div>
              </div>
            ) : (
              <FleetStatusCard
                available={availableVehicles.length}
                rented={rentedVehicles.length}
                maintenance={maintenanceVehicles.length}
                total={displayVehicles.length}
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Vehicle Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="w-8 h-8 border-4 border-t-[#023e8a] border-r-[#00b4d8] border-b-[#023e8a] border-l-[#00b4d8] rounded-full animate-spin"></div>
              </div>
            ) : (
              <VehicleCategoriesCard
                categories={Array.from(new Set(displayVehicles.map(v => v.category))).map(category => ({
                  name: category,
                  count: displayVehicles.filter(v => v.category === category).length
                }))}
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Upcoming Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="w-8 h-8 border-4 border-t-[#023e8a] border-r-[#00b4d8] border-b-[#023e8a] border-l-[#00b4d8] rounded-full animate-spin"></div>
              </div>
            ) : (
              <UpcomingMaintenanceCard
                vehicles={maintenanceVehicles.map(v => ({
                  id: String(v.id || v._id || "unknown"),
                  make: v.make,
                  model: v.model
                }))}
              />
            )}
          </CardContent>
        </Card>
      </div> */}
      
      <AddVehicleDialog
        open={showAddVehicleDialog}
        onOpenChange={setShowAddVehicleDialog}
        newVehicle={newVehicle}
        setNewVehicle={setNewVehicle}
        formErrors={formErrors}
        handleFieldChange={handleFieldChange}
        handleAddVehicle={handleAddVehicle}
        isSubmitting={isSubmitting}
        fetchVehicles={fetchVehicles}
        validateField={validateField}
        setFormErrors={setFormErrors}
        toast={toast}
      />
      
      <VehicleDetailsDialog
        open={showVehicleDetails}
        onOpenChange={setShowVehicleDetails}
        loading={loadingVehicleDetails}
        vehicle={selectedVehicle}
      />

      <EditVehicleDialog
        open={showEditVehicleDialog}
        onOpenChange={setShowEditVehicleDialog}
        vehicle={editVehicle}
        formErrors={formErrors}
        isSubmitting={isSubmitting}
        setVehicle={setEditVehicle}
        setFormErrors={setFormErrors}
        validateField={validateField}
        handleUpdateVehicle={handleUpdateVehicle}
        toast={toast}
        setIsSubmitting={setIsSubmitting}
      />
    </div>
  );
}


