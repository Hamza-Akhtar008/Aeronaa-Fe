"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import CarCard from '@/components/CarCard';
import CarTypeFilter from '@/components/CarTypeFilter';
import Pagination from '@/components/Pagination';
import { CarRentalSearch } from '@/components/home/search';
import { getCarRentals } from '@/lib/api';
import { motion } from "framer-motion";
import { 
  Star, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  AlignJustify, 
  ShoppingBag, 
  CalendarDays, 
  Clock, 
  Car,
  MapPin,
  Settings,
  UserCheck,
  Users,
  CreditCard,
  BatteryCharging,
  Lock,
  Fuel
} from "lucide-react";
import { formatPrice, CURRENCIES } from '@/lib/utils/currency';
import Filters from '@/components/home/Filters';

interface CarRental {
  id?: string;
  name?: string;
  title?: string;
  model?: string;
  type?: string;
  price?: number;
  rate?: number;
  dailyRate?: number;
  supplier?: string;
  vendor?: string;
  rentalCompany?: string;
  image?: string;
  photo?: string;
  thumbnail?: string;
  description?: string;
  car_type?: string;
  currency?: string;
  currency_code?: string;
  currencySymbol?: string;
  seats?: number;
  passengerCount?: number;
  transmission?: string;
  features?: string[];
  amenities?: string[];
  badges?: {
    greenVehicle?: string;
    [key: string]: any;
  };
  special_offer_text?: string;
  content?: {
    badges?: {
      greenVehicle?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  details?: {
    transmission?: string;
    seats?: number;
    features?: string[];
  };
  vehicle_info?: {
    type?: string;
    transmission?: string;
    seats?: number;
    features?: string[];
    image?: string;
  };
  location?: string;
  pickup_location?: string;
  dropoff_location?: string;
  rental_days?: number;
  rating?: number;
  pricing_details?: any;
  original?: any;
  [key: string]: any;
}

export default function CarRentalResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<CarRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiFailed, setApiFailed] = useState(false); // Track if API failed
  const [sortBy, setSortBy] = useState("recommended");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCarTypes, setSelectedCarTypes] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  // New state variables for all filter categories
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [selectedMileage, setSelectedMileage] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [selectedPaymentTiming, setSelectedPaymentTiming] = useState<string[]>([]);
  const [selectedCarSpecs, setSelectedCarSpecs] = useState<string[]>([]);
  const [selectedElectricTypes, setSelectedElectricTypes] = useState<string[]>([]);
  const [selectedDeposits, setSelectedDeposits] = useState<string[]>([]);
  const [selectedFuelPolicies, setSelectedFuelPolicies] = useState<string[]>([]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 20; // Number of cars to show per page

  // Get search parameters from URL
  const pickupLocation = searchParams?.get('pickupLocation') || '';
  const dropoffLocation = searchParams?.get('dropoffLocation') || '';
  const pickupDate = searchParams?.get('pickupDate') || '';
  const dropoffDate = searchParams?.get('dropoffDate') || '';
    const pickupTime = searchParams?.get('pickupTime') || '';
  const dropoffTime = searchParams?.get('dropoffTime') || '';
  const driverAge = searchParams?.get('driverAge') || '30';
            

  // Calculate rental days
  const rentalDays = useMemo(() => {
    if (!pickupDate || !dropoffDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  }, [pickupDate, dropoffDate]);

  // Date formatter for display
  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };
  
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        
        // Fetch vendor car results only
        const processVendorResults = async () => {
          try {
            console.log("Fetching vendor cars...");
            const allVendorCars = await getCarRentals();
            console.log("Vendor cars fetched:", allVendorCars?.length || 0, "cars");
            
            // If no cars or invalid response, return empty
            if (!allVendorCars || !Array.isArray(allVendorCars) || allVendorCars.length === 0) {
              console.log("No vendor cars found or invalid response format");
              return { cars: [] };
            }
            
            // Map images array to image, photo, thumbnail fields for UI compatibility
            const mapImages = (cars: any[]) => cars.map((car: any) => {
              const firstImage = Array.isArray(car.images) && car.images.length > 0 ? car.images[0] : undefined;
              return {
                ...car,
                image: car.image || firstImage,
                photo: car.photo || firstImage,
                thumbnail: car.thumbnail || firstImage,
              };
            });
            
            // If no search location, show all vendor cars
            if (!pickupLocation) {
              console.log("No pickup location specified, showing all vendor cars");
              return { cars: mapImages(allVendorCars) };
            }
            
            // Robust filter: ignore spaces/case
            const norm = (str: string) => str.replace(/\s+/g, '').toLowerCase();
            const searchLoc = norm(pickupLocation);
            const filtered = allVendorCars.filter((car: any) =>
              car.location && searchLoc && norm(car.location).includes(searchLoc)
            );
            
            console.log(`Filtered vendor cars for ${pickupLocation}:`, filtered.length);
            return { cars: mapImages(filtered) };
          } catch (err: any) {
            console.error("Vendor car results error:", err);
            return { cars: [], error: err.message || 'Failed to fetch vendor cars' };
          }
        };
        
        // Fetch vendor results
        const vendorResults = await processVendorResults();
        
        // Handle vendor results
        if (vendorResults.error) {
          console.error("Vendor cars error:", vendorResults.error);
          setError(vendorResults.error);
          setResults([]);
          setVendorCars([]);
        } else {
          const cars = vendorResults.cars || [];
          setResults(cars);
          setVendorCars(cars);
          console.log(`Successfully loaded ${cars.length} vendor cars`);
          
          // Calculate price range from loaded cars
          const prices = cars.map((car: any) => car.price || car.rate || car.dailyRate || 0).filter((p: number) => p > 0);
          if (prices.length > 0) {
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            setPriceRange([min, max]);
            setMaxPrice(max);
          }
        }
        
      } catch (err: any) {
        console.error("Error loading car rental data:", err);
        setError(err.message || 'Failed to load car rental data');
        setResults([]);
        setVendorCars([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams, pickupLocation]);

  // Fetch exchange rates when selected currency changes
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };
    fetchRates();
  }, [selectedCurrency]);

  // Enhanced debug for car filters - logs all car types
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // Map the car types in the dataset to debug inconsistencies
      const carTypes = results.map(car => {
        const rawType = car.type || car.car_type || (car.original?.vehicle_info?.group as string) || car.category || 'Unknown';
        return {
          id: car.id,
          name: car.name,
          rawType,
          processedType: (() => {
            // Reproduce the car type logic for debug purposes
            const typeLower = (rawType || '').toLowerCase();
            // Match exact car types from the API data first
            if (typeLower === 'mini') return 'Mini';
            if (typeLower === 'compact') return 'Compact';
            if (typeLower === 'intermediate') return 'Intermediate';
            if (typeLower === 'mid-size' || typeLower === 'midsize') return 'Mid-size';
            if (typeLower === 'large') return 'Large';
            if (typeLower === 'luxury') return 'Luxury';
            if (typeLower === 'special') return 'Special';
            
            // Then try broader patterns
            if (typeLower.includes('mini')) return 'Mini';
            if (typeLower.includes('compact') || typeLower.includes('economy')) return 'Compact';
            if (typeLower.includes('intermediate')) return 'Intermediate';
            if (typeLower.includes('mid') || typeLower.includes('standard')) return 'Mid-size';
            if (typeLower.includes('large') || typeLower.includes('full')) return 'Large';
            if (typeLower.includes('wagon') || typeLower.includes('estate')) return 'Station Wagon';
            if (typeLower.includes('luxury') || typeLower.includes('premium')) return 'Luxury';
            if (typeLower.includes('minivan') || typeLower.includes('van')) return 'Minivans';
            if (typeLower.includes('suv') || typeLower.includes('crossover') || typeLower.includes('4x4')) return 'SUV';
            if (typeLower.includes('convertible')) return 'Convertible';
            if (typeLower.includes('special')) return 'Special';
            
            // Check name for additional clues
            const nameLower = (car.name || '').toLowerCase();
            if (nameLower.includes('mini')) return 'Mini';
            if (nameLower.includes('special')) return 'Special';
            
            // If we still can't classify, return the raw type
            return rawType;
          })()
        };
      });
      
      console.log('Car types in dataset:', carTypes.slice(0, 10)); // Log just a sample for readability
      
      // Count each car type for verification against filter counts
      const typeCounts: Record<string, number> = {};
      carTypes.forEach(car => {
        const type = car.processedType;
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
      
      console.log('Car type counts for verification:', typeCounts);
      
      // Additionally log any unusual or unclassified types
      const unclassified = carTypes.filter(car => 
        !['Mini', 'Compact', 'Intermediate', 'Mid-size', 'Large', 'Luxury', 
          'Station Wagon', 'Minivans', 'SUV', 'Convertible', 'Special'].includes(car.processedType)
      );
      
      if (unclassified.length > 0) {
        console.log('Unclassified car types:', unclassified.slice(0, 10));
      }
    }
  }, [results]);
  
  // Filtering logic based on all filters
  const filteredCars = useMemo(() => {
    console.log("Filtering with criteria:", {
      selectedCarTypes,
      selectedTransmissions,
      selectedMileage,
      selectedSuppliers,
      priceRange
    });
    
    // Debug the first few cars to see what data we're working with
    if (results.length > 0) {
      console.log("First car data sample:", {
        name: results[0].name,
        transmission: results[0].transmission,
        supplier: results[0].supplier,
        mileage: results[0].mileage,
        features: results[0].features
      });
    }
    
    return results.filter((car) => {
      // Extract values with proper fallbacks based on the actual API response
      // Vendor cars use dailyRate, API cars might use price
      const price = car.price || car.dailyRate || car.rate || 0;
      const rating = car.rating || 0;
      
      // Car type from various possible locations with enhanced extraction
      const carType = (() => {
        // First try to get from direct properties - exact match to API data types
        let type = car.type || car.car_type || car.category || (car.original?.vehicle_info?.group as string);
        
        // Check if we already have one of the expected types based on the console output
        if (type) {
          const typeLower = type.toLowerCase();
          if (typeLower === 'mini' || 
              typeLower === 'compact' || 
              typeLower === 'intermediate' || 
              typeLower === 'mid-size' || 
              typeLower === 'large' || 
              typeLower === 'luxury' || 
              typeLower === 'special') {
            return type; // Return type as-is since it's already a valid category
          }
        }
        
        // If not one of the expected types, try to map to the right category
        if (type) {
          const typeLower = type.toLowerCase();
          if (typeLower.includes('mini') || typeLower.includes('small')) return 'Mini';
          if (typeLower.includes('compact') || typeLower.includes('economy')) return 'Compact';
          if (typeLower.includes('intermediate') || typeLower.includes('mid')) return 'Intermediate';
          if (typeLower.includes('standard')) return 'Mid-size';
          if (typeLower.includes('large') || typeLower.includes('full')) return 'Large';
          if (typeLower.includes('luxury') || typeLower.includes('premium')) return 'Luxury';
          if (typeLower.includes('specialty') || typeLower.includes('special') || typeLower === 'convertible') return 'Special';
          if (typeLower.includes('minivan') || typeLower.includes('van')) return 'Minivans';
          if (typeLower.includes('suv') || typeLower.includes('crossover')) return 'SUVs';
        } 
        
        // If not found, try to extract from name or description
        if ((!type || type === '') && car.name) {
          const name = car.name.toLowerCase();
          if (name.includes('compact') || name.includes('economy')) return 'Compact';
          if (name.includes('intermediate')) return 'Intermediate';
          if (name.includes('mid-size') || name.includes('standard')) return 'Mid-size';
          if (name.includes('large') || name.includes('full-size')) return 'Large';
          if (name.includes('luxury') || name.includes('premium')) return 'Luxury';
          if (name.includes('mini')) return 'Mini';
          if (name.includes('special')) return 'Special';
          if (name.includes('minivan') || name.includes('van')) return 'Minivans';
          if (name.includes('suv') || name.includes('crossover') || name.includes('4x4')) return 'SUVs';
        }
        
        // If still not found, check other properties
        if (!type) {
          type = car.class || 
                 car.car_class || 
                 car.vehicle_type ||
                 (car.original?.vehicle_info?.category as string);
        }
        
        // Still not found? Default to mid-size which is a common fallback
        return type || 'Mid-size';
      })();
                    
      // Location information - Don't show placeholders as actual locations
      const pickupLoc = car.pickup_location && car.pickup_location !== "Pickup Location" ? 
                      car.pickup_location : 
                      (car.original?.route_info?.pickup?.name as string) || '';
      
      const dropoffLoc = car.dropoff_location && car.dropoff_location !== "Return Location" ? 
                       car.dropoff_location : 
                       (car.original?.route_info?.dropoff?.name as string) || '';
                       
      const location = pickupLoc || car.location || '';
                     
      // Transmission information
      const transmission = car.transmission || 
                         (car.original?.vehicle_info?.transmission as string) ||
                         'Automatic';
                         
      // Location-related properties extracted
                         
      // Supplier information
      const supplier = car.supplier || 
                     car.company || 
                     (car.original?.supplier_info?.name as string) ||
                     'Rental Provider'; // Default value when supplier is "Rental Provider"
                     
      // Mileage information - check both properties and text values
      let mileage = 'limited';
      if (car.unlimited_mileage || 
          car.original?.vehicle_info?.unlimited_mileage === 1 || 
          ((car.original?.vehicle_info?.mileage as string) || '').toLowerCase().includes('unlimited') ||
          (car.features || []).some(f => typeof f === 'string' && f.toLowerCase().includes('unlimited mileage')) ||
          (car.mileage || '').toLowerCase().includes('unlimited')) {
        mileage = 'unlimited';
      }
      
      // Seat information - safely parse seat numbers
      const seatValue = car.seats || car.original?.vehicle_info?.seats;
      const seats = typeof seatValue === 'number' ? seatValue :
                  typeof seatValue === 'string' ? parseInt(seatValue) || 5 : 5;
                  
      // Car specs - handle doors and air conditioning
      const hasAirCon = car.air_conditioning || 
                      car.original?.vehicle_info?.aircon === 1 ||
                      (car.features || []).some(f => typeof f === 'string' && f.toLowerCase().includes('air conditioning'));
      
      // Extract door count from features if available
      let doorCount = 4; // Default
      if (car.doors) {
        doorCount = typeof car.doors === 'number' ? car.doors : parseInt(car.doors) || 4;
      } else if (car.original?.vehicle_info?.doors) {
        doorCount = typeof car.original.vehicle_info.doors === 'number' ? 
                   car.original.vehicle_info.doors : parseInt(car.original.vehicle_info.doors) || 4;
      } else if (car.features) {
        // Try to extract door count from features
        const doorFeature = (car.features as string[]).find(f => typeof f === 'string' && f.toLowerCase().includes('door'));
        if (doorFeature) {
          const doorMatch = doorFeature.match(/\d+/);
          if (doorMatch) {
            doorCount = parseInt(doorMatch[0]);
          }
        }
      }
      
      const specs = {
        airConditioning: hasAirCon,
        doors: doorCount
      };
      
      // Fuel/electric type - enhanced to detect hybrid and electric vehicles
      const electricType = car.badges?.greenVehicle || 
                        car.content?.badges?.greenVehicle ||
                        car.fuel_type || 
                        (car.original?.vehicle_info?.fuel_type as string) ||
                        (car.name && (
                          car.name.toLowerCase().includes('hybrid') || 
                          car.name.toLowerCase().includes('e-power') ||
                          car.name.toLowerCase().includes('electric')
                        )) ? 
                          (car.name && (car.name.toLowerCase().includes('hybrid') || car.name.toLowerCase().includes('e-power'))) ? 
                            'Hybrid' : 'Electric'
                        : '';
                         
      // Deposit amount - safely handle deposit values
      const depositValue = car.deposit_amount || car.original?.vehicle_info?.deposit;
      const deposit = typeof depositValue === 'number' ? depositValue :
                    typeof depositValue === 'string' ? parseInt(depositValue) || 0 : 0;
                    
      // Fuel policy
      const fuelPolicy = car.fuel_policy || 
                       (car.original?.vehicle_info?.fuel_policy as string) ||
                       'Like for like';
      
      // Price filter
      const inPrice = price >= priceRange[0] && price <= priceRange[1];
      
      // Rating filter
      const ratingMatches = selectedRatings.length === 0 || selectedRatings.some((star) => {
        if (star == 5) {
          return rating >= 5;
        }
        return rating >= star && rating < star + 1;
      });
      
      // Car type filter - Enhanced to match all car types from dataset
      const typeMatches = selectedCarTypes.length === 0 || selectedCarTypes.some(type => {
        // Convert both to lowercase for case-insensitive comparison
        const carTypeLower = carType.toLowerCase();
        const selectedTypeLower = type.toLowerCase();
        
        // Also check the car name for additional type indicators
        const carNameLower = (car.name || '').toLowerCase();
        
        // Log individual car type matches for debugging (first car only)
        if (car.id === results[0]?.id) {
          console.log(`Car type filter check: Selected=${selectedTypeLower}, Actual=${carTypeLower}, Name=${carNameLower}`);
        }
        
        // Enhanced mapping based on console output
        switch(selectedTypeLower) {
          case 'compact':
            return carTypeLower === 'compact' || 
                  carTypeLower === 'economy' ||
                  carTypeLower.includes('compact') || 
                  carTypeLower.includes('economy');
                  
          case 'mid-size':
          case 'midsize':
            return carTypeLower === 'mid-size' || 
                  carTypeLower === 'midsize' ||
                  carTypeLower === 'standard' ||
                  carTypeLower.includes('mid') || 
                  carTypeLower.includes('medium') ||
                  (carTypeLower !== 'intermediate' && carTypeLower.includes('interm')); // Partial match but not exact intermediate
                  
          case 'intermediate':
            return carTypeLower === 'intermediate' ||
                  carTypeLower.includes('intermediate');
                  
          case 'large':
            return carTypeLower === 'large' || 
                  carTypeLower === 'full-size' ||
                  carTypeLower.includes('large') || 
                  carTypeLower.includes('full');
                  
          case 'luxury':
            return carTypeLower === 'luxury' || 
                  carTypeLower === 'premium' || 
                  carTypeLower.includes('luxury') || 
                  carTypeLower.includes('premium') || 
                  carTypeLower.includes('elite');
                  
          case 'station-wagon':
            return carTypeLower === 'station-wagon' || 
                  carTypeLower.includes('wagon') || 
                  carTypeLower.includes('estate');
                  
          case 'minivans':
            return carTypeLower === 'minivan' || 
                  carTypeLower === 'van' ||
                  carTypeLower.includes('minivan') || 
                  carTypeLower.includes('van') || 
                  carTypeLower.includes('people carrier');
                  
          case 'suvs':
            return carTypeLower === 'suv' || 
                  carTypeLower.includes('suv') || 
                  carTypeLower.includes('crossover') || 
                  carTypeLower.includes('4x4');
                  
          case 'mini':
            return carTypeLower === 'mini' ||
                  carTypeLower.includes('mini') ||
                  carNameLower.includes('mini');
                  
          case 'special':
            return carTypeLower === 'special' || 
                  carTypeLower.includes('special') ||
                  carTypeLower.includes('unique') ||
                  carNameLower.includes('special');
                  
          default:
            // For any other filter type, try a simple match
            return carTypeLower === selectedTypeLower || carTypeLower.includes(selectedTypeLower);
        }
      });
      
      // Location filter
      const locationMatches = selectedLocations.length === 0 || selectedLocations.some(loc => {
        if (loc === 'airport-terminal') return location.toLowerCase().includes('terminal');
        if (loc === 'airport-hotel') return location.toLowerCase().includes('hotel');
        if (loc === 'airport-meet') return location.toLowerCase().includes('meet');
        if (loc === 'other-locations') return !location.toLowerCase().includes('airport');
        return false;
      });
      
      // Transmission filter
      const transmissionMatches = selectedTransmissions.length === 0 || 
        (transmission && selectedTransmissions.some(t => transmission.toLowerCase().includes(t)));
      
      // Supplier filter
      const supplierMatches = selectedSuppliers.length === 0 || 
        (supplier && selectedSuppliers.some(s => supplier.toLowerCase().includes(s) || 
          // Special case for when API returns "Rental Provider" but we want to match specific suppliers
          (supplier === 'Rental Provider' && selectedSuppliers.includes('rental-provider'))));
      
      // Mileage filter
      const mileageMatches = selectedMileage.length === 0 || 
        selectedMileage.includes(mileage);
      
      // Seats filter
      const seatsMatches = selectedSeats.length === 0 || selectedSeats.some(s => {
        if (s === '4seats') return seats === 4;
        if (s === '5seats') return seats === 5;
        if (s === '6+seats') return seats >= 6;
        return false;
      });
      
      // Review filter
      const reviewMatches = selectedReviews.length === 0 || selectedReviews.some(r => {
        if (r === 'exceptional') return rating >= 9.5;
        if (r === 'excellent') return rating >= 9;
        if (r === 'superb') return rating >= 8.5;
        if (r === 'very-good') return rating >= 8;
        if (r === 'good') return rating >= 7;
        return false;
      });
      
      // Car specs filter
      const specsMatches = selectedCarSpecs.length === 0 || selectedCarSpecs.every(spec => {
        if (spec === 'air-conditioning') return specs.airConditioning;
        if (spec === '4plus-doors') return specs.doors >= 4;
        return false;
      });
      
      // Electric type filter - enhanced to check multiple places
      const electricMatches = selectedElectricTypes.length === 0 || selectedElectricTypes.some(type => {
        // Check all possible places where electric/hybrid info might be stored
        const hasGreenVehicleBadge = car.badges?.greenVehicle || 
                                    car.content?.badges?.greenVehicle || 
                                    car.original?.badges?.[0]?.text?.toLowerCase().includes('hybrid');
                                    
        const vehicleName = (car.name || '').toLowerCase();
        const vehicleDesc = (car.description || '').toLowerCase();
        
        if (type === 'fully-electric') {
          return electricType?.toLowerCase()?.includes('electric') || 
                 vehicleName.includes('electric') ||
                 vehicleName.includes('ev') ||
                 hasGreenVehicleBadge === 'Electric';
        }
        
        if (type === 'hybrid') {
          return electricType?.toLowerCase()?.includes('hybrid') || 
                 vehicleName.includes('hybrid') || 
                 vehicleName.includes('e-power') ||
                 vehicleDesc.includes('hybrid') ||
                 hasGreenVehicleBadge === 'Hybrid';
        }
        
        if (type === 'plugin-hybrid') {
          return electricType?.toLowerCase()?.includes('plug-in') || 
                 vehicleName.includes('plug-in') || 
                 vehicleName.includes('phev') ||
                 hasGreenVehicleBadge === 'Plug-in Hybrid';
        }
        
        return false;
      });
      
      // Deposit filter
      const depositMatches = selectedDeposits.length === 0 || selectedDeposits.some(d => {
        if (d === 'deposit-0-100k') return deposit >= 0 && deposit <= 100000;
        if (d === 'deposit-100k-200k') return deposit > 100000 && deposit <= 200000;
        if (d === 'deposit-200k-plus') return deposit > 200000;
        return false;
      });
      
      // Fuel policy filter
      const fuelPolicyMatches = selectedFuelPolicies.length === 0 || 
        selectedFuelPolicies.some(p => {
          // Convert kebab-case ID to space-separated words for matching
          const formattedP = p.replace(/-/g, ' ');
          return fuelPolicy.toLowerCase().includes(formattedP.toLowerCase());
        });
      
      // Payment timing filter
      const paymentTimingMatches = selectedPaymentTiming.length === 0 || 
        selectedPaymentTiming.some(p => {
          if (p === 'pay-now') {
            // Consider it pay-now by default unless explicitly marked as pay-at-pickup
            return !(car.pay_at_pickup || car.payment_at_pickup || car.original?.payment_options?.pay_at_pickup);
          }
          if (p === 'pay-pickup') {
            return car.pay_at_pickup || car.payment_at_pickup || car.original?.payment_options?.pay_at_pickup;
          }
          return false;
        });
      
      // Debug when the first car gets filtered for troubleshooting
      if (car.id === results[0]?.id) {
        console.log(`Filter debug for first car (${car.name}):`, {
          carType,
          transmission,
          supplier,
          mileage,
          fuelPolicy,
          typeMatches,
          transmissionMatches,
          supplierMatches,
          mileageMatches,
          fuelPolicyMatches,
          reviewMatches,
          paymentTimingMatches,
          selectedCarTypes,
          selectedFuelPolicies,
          selectedReviews,
          selectedPaymentTiming
        });
      }
      
      return inPrice && 
             ratingMatches && 
             typeMatches && 
             locationMatches &&
             transmissionMatches &&
             supplierMatches &&
             mileageMatches &&
             seatsMatches &&
             reviewMatches &&
             specsMatches &&
             electricMatches &&
             depositMatches &&
             fuelPolicyMatches &&
             paymentTimingMatches;
    });
  }, [
    results, 
    priceRange, 
    selectedRatings, 
    selectedCarTypes, 
    selectedTransmissions, 
    selectedMileage,
    selectedSuppliers,
    selectedLocations,
    selectedSeats,
    selectedReviews,
    selectedPaymentTiming,
    selectedCarSpecs,
    selectedElectricTypes,
    selectedDeposits,
    selectedFuelPolicies
  ]);

  // Sorting filtered cars
  const sortedCars = useMemo(() => {
    const sorted = [...filteredCars];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => {
          const priceA = a.price || a.dailyRate || a.rate || 0;
          const priceB = b.price || b.dailyRate || b.rate || 0;
          return priceA - priceB;
        });
      case "price-high":
        return sorted.sort((a, b) => {
          const priceA = a.price || a.dailyRate || a.rate || 0;
          const priceB = b.price || b.dailyRate || b.rate || 0;
          return priceB - priceA;
        });
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  }, [filteredCars, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedCars.length / carsPerPage);
  const currentCars = useMemo(() => {
    const startIndex = (currentPage - 1) * carsPerPage;
    return sortedCars.slice(startIndex, startIndex + carsPerPage);
  }, [sortedCars, currentPage, carsPerPage]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCarTypes, 
    selectedRatings, 
    priceRange, 
    sortBy,
    selectedLocations,
    selectedTransmissions,
    selectedSuppliers,
    selectedMileage,
    selectedSeats,
    selectedReviews,
    selectedPaymentTiming,
    selectedCarSpecs,
    selectedElectricTypes,
    selectedDeposits,
    selectedFuelPolicies,
    selectedCurrency
  ]);

  // Clear filters reset handler
  const clearFilters = () => {
    setSelectedRatings([]);
    setSelectedCarTypes([]);
    setSelectedLocations([]);
    setSelectedTransmissions([]);
    setSelectedSuppliers([]);
    setSelectedMileage([]);
    setSelectedSeats([]);
    setSelectedReviews([]);
    setSelectedPaymentTiming([]);
    setSelectedCurrency("USD");
    setSelectedCarSpecs([]);
    setSelectedElectricTypes([]);
    setSelectedDeposits([]);
    setSelectedFuelPolicies([]);
    setSelectedSeats([]);
    setSelectedReviews([]);
    setSelectedPaymentTiming([]);
    setSelectedCarSpecs([]);
    setSelectedElectricTypes([]);
    setSelectedDeposits([]);
    setSelectedFuelPolicies([]);
    const prices = results.map((car) => car.price || car.dailyRate || car.rate || 0).filter((p) => p > 0);
    if (prices.length) setPriceRange([Math.min(...prices), Math.max(...prices)]);
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Filter data arrays
  // Dynamic calculation of location options with accurate counts
  const locationOptions = useMemo(() => {
    const counts = {
      'airport-terminal': 0,
      'airport-hotel': 0,
      'airport-meet': 0,
      'other-locations': 0
    };
    
    results.forEach(car => {
      // Extract location information
      const locationText = [
        car.pickup_location,
        car.dropoff_location,
        car.location,
        car.original?.route_info?.pickup?.name,
        car.original?.route_info?.dropoff?.name
      ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
      
      if (locationText.includes('terminal')) {
        counts['airport-terminal']++;
      } else if (locationText.includes('hotel') && locationText.includes('airport')) {
        counts['airport-hotel']++;
      } else if ((locationText.includes('meet') && locationText.includes('greet')) || 
                 locationText.includes('shuttle')) {
        counts['airport-meet']++;
      } else {
        counts['other-locations']++;
      }
    });
    
    return [
      { id: 'airport-terminal', label: 'Airport (in terminal)', count: counts['airport-terminal'] },
      { id: 'airport-hotel', label: 'Airport (airport hotel)', count: counts['airport-hotel'] },
      { id: 'airport-meet', label: 'Airport (meet & greet)', count: counts['airport-meet'] },
      { id: 'other-locations', label: 'All other locations', count: counts['other-locations'] },
    ];
  }, [results]);
  
  // Dynamic calculation of transmission options with accurate counts
  const transmissionOptions = useMemo(() => {
    let manualCount = 0;
    let automaticCount = 0;
    
    results.forEach(car => {
      // Extract transmission information
      const transmission = (car.transmission || 
                          car.original?.vehicle_info?.transmission || 
                          'Automatic').toLowerCase();
      
      if (transmission.includes('manual') || transmission === 'manual') {
        manualCount++;
      } else {
        // Default to automatic for anything else
        automaticCount++;
      }
    });
    
    return [
      { id: 'manual', label: 'Manual', count: manualCount },
      { id: 'automatic', label: 'Automatic', count: automaticCount },
    ];
  }, [results]);
  
  // Dynamic calculation of supplier options with accurate counts
  const supplierOptions = useMemo(() => {
    // Define base supplier structure with initial counts of 0
    const supplierCounts: Record<string, {id: string, label: string, count: number}> = {
      'alamo': { id: 'alamo', label: 'Alamo', count: 0 },
      'autounion': { id: 'autounion', label: 'Autounion', count: 0 },
      'dollar': { id: 'dollar', label: 'Dollar', count: 0 },
      'enterprise': { id: 'enterprise', label: 'Enterprise', count: 0 },
      'europcar': { id: 'europcar', label: 'Europcar', count: 0 },
      'goldcar': { id: 'goldcar', label: 'Goldcar', count: 0 },
      'greenmotion': { id: 'greenmotion', label: 'Green Motion', count: 0 },
      'hertz': { id: 'hertz', label: 'Hertz', count: 0 },
      'okmobility': { id: 'okmobility', label: 'OK Mobility', count: 0 },
      'sixt': { id: 'sixt', label: 'Sixt', count: 0 },
      'thrifty': { id: 'thrifty', label: 'Thrifty', count: 0 },
      'rental-provider': { id: 'rental-provider', label: 'Rental Provider', count: 0 },
    };
    
    // Count cars for each supplier
    results.forEach(car => {
      // Extract supplier information
      const supplier = car.supplier || 
                     car.company || 
                     (car.original?.supplier_info?.name as string) ||
                     'Rental Provider';
                     
      // Check for known suppliers (case insensitive)
      const lowerSupplier = supplier.toLowerCase();
      
      // Check each supplier by name pattern
      for (const key of Object.keys(supplierCounts)) {
        const supplierKey = key === 'rental-provider' ? 'rental provider' : key;
        if (lowerSupplier.includes(supplierKey)) {
          supplierCounts[key].count++;
          return; // Only count once per car
        }
      }
      
      // If no match found, increment "Rental Provider" as fallback
      supplierCounts['rental-provider'].count++;
    });
    
    // Return array of suppliers with counts, filter out those with 0 cars if needed
    return Object.values(supplierCounts); //.filter(s => s.count > 0);
  }, [results]);
  
  // Dynamic calculation of mileage options with accurate counts
  const mileageOptions = useMemo(() => {
    let limitedCount = 0;
    let unlimitedCount = 0;
    
    results.forEach(car => {
      const isUnlimited = 
        car.unlimited_mileage || 
        car.original?.vehicle_info?.unlimited_mileage === 1 || 
        ((car.original?.vehicle_info?.mileage as string) || '').toLowerCase().includes('unlimited') ||
        (car.features || []).some(f => typeof f === 'string' && f.toLowerCase().includes('unlimited mileage')) ||
        (car.mileage || '').toLowerCase().includes('unlimited');
      
      if (isUnlimited) {
        unlimitedCount++;
      } else {
        limitedCount++;
      }
    });
    
    return [
      { id: 'limited', label: 'Limited', count: limitedCount },
      { id: 'unlimited', label: 'Unlimited', count: unlimitedCount },
    ];
  }, [results]);
  
  // Static filter options that will always be shown
  const staticFilterOptions = {
    deposits: [
      { id: 'deposit-low', label: 'PKR 0 - PKR 100,000', count: 0, disabled: true },
      { id: 'deposit-medium', label: 'PKR 100,000 - PKR 200,000', count: 0, disabled: true },
      { id: 'deposit-high', label: 'PKR 200,000 +', count: 0, disabled: true }
    ],
    electric: [
      { id: 'full-electric', label: 'Fully electric', count: 0, disabled: true },
      { id: 'hybrid', label: 'Hybrid', count: 0, disabled: true },
      { id: 'plugin-hybrid', label: 'Plug-in hybrid', count: 0, disabled: true }
    ],
    fuelPolicies: [],
    locations: [
      { id: 'airport-terminal', label: 'Airport (in terminal)', count: 0 },
      { id: 'airport-hotel', label: 'Airport (airport hotel)', count: 0 },
      { id: 'meet-greet', label: 'Airport (meet & greet)', count: 0 },
      { id: 'other-locations', label: 'All other locations', count: 0 }
    ],
    mileage: [
      { id: 'limited', label: 'Limited', count: 0 },
      { id: 'unlimited', label: 'Unlimited', count: 0 }
    ],
    payment: [
      { id: 'pay-now', label: 'Pay now', count: 0, disabled: true },
      { id: 'pay-pickup', label: 'Pay at pick-up', count: 0, disabled: true }
    ],
    reviews: [
      { id: 'exceptional', label: 'Exceptional: 9.5+', count: 0 },
      { id: 'excellent', label: 'Excellent: 9+', count: 0 },
      { id: 'superb', label: 'Superb: 8.5+', count: 0 },
      { id: 'very-good', label: 'Very good: 8+', count: 0 },
      { id: 'good', label: 'Good: 7+', count: 0 }
    ],
    specs: [
      { id: 'air-conditioning', label: 'Air Conditioning', count: 0 },
      { id: '4plus-doors', label: '4+ doors', count: 0 }
    ],
    suppliers: [
      { id: 'alamo', label: 'Alamo', count: 0 },
      { id: 'autounion', label: 'Autounion', count: 0 },
      { id: 'dollar', label: 'Dollar', count: 0 },
      { id: 'enterprise', label: 'Enterprise', count: 0 },
      { id: 'europcar', label: 'Europcar', count: 0 },
      { id: 'goldcar', label: 'Goldcar', count: 0 },
      { id: 'green-motion', label: 'Green Motion', count: 0 },
      { id: 'hertz', label: 'Hertz', count: 0 },
      { id: 'ok-mobility', label: 'OK Mobility', count: 0 },
      { id: 'sixt', label: 'Sixt', count: 0 },
      { id: 'thrifty', label: 'Thrifty', count: 0 },
      { id: 'rental-provider', label: 'Rental Provider', count: 0 }
    ],
    transmissions: [
      { id: 'manual', label: 'Manual', count: 0 },
      { id: 'automatic', label: 'Automatic', count: 0 }
    ]
  };

  // Dynamic calculation of car category options with accurate counts
  const carCategoryOptions = useMemo(() => {
    const categories = {
      'compact': { id: 'compact', label: 'Compact car', count: 0 },
      'midsize': { id: 'midsize', label: 'Mid-size car', count: 0 },
      'intermediate': { id: 'intermediate', label: 'Intermediate car', count: 0 },
      'large': { id: 'large', label: 'Large car', count: 0 },
      'mini': { id: 'mini', label: 'Mini car', count: 0 },
      'special': { id: 'special', label: 'Special car', count: 0 },
      'station-wagon': { id: 'station-wagon', label: 'Station wagon', count: 0 },
      'luxury': { id: 'luxury', label: 'Luxury car', count: 0 },
      'minivans': { id: 'minivans', label: 'Minivans', count: 0 },
      'suvs': { id: 'suvs', label: 'SUVs', count: 0 }
    };
    
    results.forEach(car => {
      // Extract car type from various possible locations
      const carType = (car.type || 
                      car.car_type || 
                      (car.original?.vehicle_info?.group as string) ||
                      car.category ||
                      car.vehicle_info?.type || 
                      'Unknown')
                      .toLowerCase();
      
      // Categorize by car type
      if (carType.includes('compact') || carType.includes('economy')) {
        categories['compact'].count++;
      } else if (carType.includes('intermediate')) {
        categories['intermediate'].count++;
      } else if (carType.includes('mid') || carType.includes('standard')) {
        categories['midsize'].count++;
      } else if (carType.includes('large') || carType.includes('full')) {
        categories['large'].count++;
      } else if (carType.includes('mini')) {
        categories['mini'].count++;
      } else if (carType.includes('special')) {
        categories['special'].count++;
      } else if (carType.includes('wagon') || carType.includes('estate')) {
        categories['station-wagon'].count++;
      } else if (carType.includes('luxury') || carType.includes('premium')) {
        categories['luxury'].count++;
      } else if (carType.includes('minivan') || carType.includes('van') || carType.includes('people carrier')) {
        categories['minivans'].count++;
      } else if (carType.includes('suv') || carType.includes('crossover') || carType.includes('4x4')) {
        categories['suvs'].count++;
      } else {
        // For unclassified, check the name to see if we can determine the type
        const name = (car.name || '').toLowerCase();
        if (name.includes('mini')) {
          categories['mini'].count++;
        } else if (name.includes('special')) {
          categories['special'].count++;
        } else {
          // Default for completely unrecognized types - can log for debugging
          if (process.env.NODE_ENV !== 'production') {
            console.log('Unclassified car type:', carType, car.name);
          }
          categories['midsize'].count++; // Default fallback
        }
      }
    });
    
    // Convert object to array and filter out categories with 0 count
    return Object.values(categories).filter(category => category.count > 0);
  }, [results]);
  
  // Dynamic calculation of seat options with accurate counts
  const seatOptions = useMemo(() => {
    const counts = {
      '4seats': 0,
      '5seats': 0,
      '6+seats': 0
    };
    
    results.forEach(car => {
      // Extract seat information from various possible locations
      const seatValue = car.seats || 
                        car.original?.vehicle_info?.seats || 
                        car.details?.seats || 
                        car.passengerCount;
      
      let seatCount = 0;
      if (typeof seatValue === 'number') {
        seatCount = seatValue;
      } else if (typeof seatValue === 'string') {
        const parsed = parseInt(seatValue);
        if (!isNaN(parsed)) {
          seatCount = parsed;
        }
      }
      
      // Categorize by seat count
      if (seatCount === 4) {
        counts['4seats']++;
      } else if (seatCount === 5) {
        counts['5seats']++;
      } else if (seatCount >= 6) {
        counts['6+seats']++;
      } else if (seatCount > 0 && seatCount < 4) {
        // For seats less than 4, count them in 4seats category
        counts['4seats']++;
      }
    });
    
    return [
      { id: '4seats', label: '4 seats', count: counts['4seats'] },
      { id: '5seats', label: '5 seats', count: counts['5seats'] },
      { id: '6+seats', label: '6+ seats', count: counts['6+seats'] },
    ];
  }, [results]);
  
  // Dynamic calculation of review options with accurate counts
  const reviewOptions = useMemo(() => {
    // Define review ranges
    const reviews = [
      { id: 'exceptional', label: 'Exceptional: 9.5+', minRating: 9.5, count: 0 },
      { id: 'excellent', label: 'Excellent: 9+', minRating: 9.0, count: 0 },
      { id: 'superb', label: 'Superb: 8.5+', minRating: 8.5, count: 0 },
      { id: 'very-good', label: 'Very good: 8+', minRating: 8.0, count: 0 },
      { id: 'good', label: 'Good: 7+', minRating: 7.0, count: 0 },
    ];
    
    // Count cars for each review range
    results.forEach(car => {
      // Extract rating safely
      const rating = typeof car.rating === 'number' ? car.rating : 
                    typeof car.rating === 'string' ? parseFloat(car.rating) : 
                    car.original?.rating ? parseFloat(car.original.rating) : 0;
      
      // Add to appropriate rating bucket
      for (const review of reviews) {
        if (rating >= review.minRating) {
          review.count++;
          break; // Only count in the highest applicable bucket
        }
      }
    });
    
    // Return results
    return reviews;
  }, [results]);
  
  // Dynamic calculation of payment options with accurate counts
  const paymentOptions = useMemo(() => {
    const options: { id: string; label: string; count: number; disabled?: boolean }[] = [
      { id: 'pay-now', label: 'Pay now', count: 0 },
      { id: 'pay-pickup', label: 'Pay at pick-up', count: 0 },
    ];
    
    // Count payment options
    results.forEach(car => {
      // Check if car has pay-at-pickup option
      const payAtPickup = car.pay_at_pickup || 
                         car.original?.payment_options?.pay_at_pickup ||
                         car.payment_at_pickup;
                         
      if (payAtPickup) {
        options[1].count++;
      } else {
        // Default to pay now
        options[0].count++;
      }
    });
    
    // Mark options as disabled if no cars available
    options.forEach(option => {
      if (option.count === 0) {
        option.disabled = true;
      }
    });
    
    return options;
  }, [results]);
  
  // Dynamic calculation of car specs with accurate counts
  const carSpecOptions = useMemo(() => {
    let airConditioningCount = 0;
    let fourPlusDoorsCount = 0;
    
    // Count cars for each spec
    results.forEach(car => {
      // Check for air conditioning
      const hasAirCon = car.air_conditioning || 
                      car.original?.vehicle_info?.aircon === 1 ||
                      (car.features || []).some(f => typeof f === 'string' && f.toLowerCase().includes('air conditioning'));
      
      if (hasAirCon) {
        airConditioningCount++;
      }
      
      // Check for door count
      let doorCount = 4; // Default
      if (car.doors) {
        doorCount = typeof car.doors === 'number' ? car.doors : parseInt(car.doors) || 4;
      } else if (car.original?.vehicle_info?.doors) {
        doorCount = typeof car.original.vehicle_info.doors === 'number' ? 
                   car.original.vehicle_info.doors : parseInt(car.original.vehicle_info.doors) || 4;
      } else if (car.features) {
        // Try to extract door count from features
        const doorFeature = (car.features as string[]).find(f => typeof f === 'string' && f.toLowerCase().includes('door'));
        if (doorFeature) {
          const doorMatch = doorFeature.match(/\d+/);
          if (doorMatch) {
            doorCount = parseInt(doorMatch[0]);
          }
        }
      }
      
      if (doorCount >= 4) {
        fourPlusDoorsCount++;
      }
    });
    
    return [
      { id: 'air-conditioning', label: 'Air Conditioning', count: airConditioningCount },
      { id: '4plus-doors', label: '4+ doors', count: fourPlusDoorsCount },
    ];
  }, [results]);
  
  // Dynamic calculation of electric car options with accurate counts
  const electricCarOptions = useMemo(() => {
    // Define base options
    const options = [
      { id: 'fully-electric', label: 'Fully electric', count: 0 },
      { id: 'hybrid', label: 'Hybrid', count: 0 },
      { id: 'plugin-hybrid', label: 'Plug-in hybrid', count: 0 },
    ];
    
    // Count vehicles for each category
    results.forEach(car => {
      // Check for hybrid vehicles
      const isHybrid = 
        car.badges?.greenVehicle === 'Hybrid' || 
        car.content?.badges?.greenVehicle === 'Hybrid' ||
        (car.name && car.name.toLowerCase().includes('hybrid')) ||
        (car.name && car.name.toLowerCase().includes('e-power')) ||
        (car.description && car.description.toLowerCase().includes('hybrid'));
      
      // Check for fully electric vehicles
      const isElectric = 
        car.badges?.greenVehicle === 'Electric' || 
        car.content?.badges?.greenVehicle === 'Electric' ||
        (car.name && car.name.toLowerCase().includes('electric')) ||
        (car.name && car.name.toLowerCase().includes(' ev ')) ||
        (car.fuel_type && car.fuel_type.toLowerCase().includes('electric'));
        
      // Check for plug-in hybrid vehicles
      const isPluginHybrid = 
        car.badges?.greenVehicle === 'Plug-in Hybrid' || 
        car.content?.badges?.greenVehicle === 'Plug-in Hybrid' ||
        (car.name && car.name.toLowerCase().includes('plug-in')) ||
        (car.name && car.name.toLowerCase().includes('phev')) ||
        (car.description && car.description.toLowerCase().includes('plug-in hybrid'));
        
      // Update counts
      if (isPluginHybrid) options[2].count++;
      else if (isHybrid) options[1].count++;
      else if (isElectric) options[0].count++;
    });
    
    // Set disabled flag for options with 0 count
    return options.map(option => ({
      ...option,
      disabled: option.count === 0
    }));
  }, [results]);
  
  // Dynamic calculation of deposit options with accurate counts
  const depositOptions = useMemo(() => {
    const counts = {
      'deposit-0-100k': 0,
      'deposit-100k-200k': 0,
      'deposit-200k-plus': 0
    };
    
    results.forEach(car => {
      // Extract deposit amount from various possible locations
      const depositValue = car.deposit_amount || 
                         car.deposit ||
                         car.original?.deposit_amount || 
                         car.original?.vehicle_info?.deposit || 0;
      
      const deposit = typeof depositValue === 'number' ? depositValue :
                    typeof depositValue === 'string' ? parseInt(depositValue) || 0 : 0;
      
      // Categorize by deposit amount
      if (deposit >= 0 && deposit <= 100000) {
        counts['deposit-0-100k']++;
      } else if (deposit > 100000 && deposit <= 200000) {
        counts['deposit-100k-200k']++;
      } else if (deposit > 200000) {
        counts['deposit-200k-plus']++;
      }
    });
    
    const options = [
      { id: 'deposit-0-100k', label: 'PKR 0 - PKR 100,000', count: counts['deposit-0-100k'] },
      { id: 'deposit-100k-200k', label: 'PKR 100,000 - PKR 200,000', count: counts['deposit-100k-200k'] },
      { id: 'deposit-200k-plus', label: 'PKR 200,000 +', count: counts['deposit-200k-plus'] },
    ];
    
    // Mark options as disabled if no cars available
    return options.map(option => ({
      ...option,
      disabled: option.count === 0
    }));
  }, [results]);
  
  // Dynamic calculation of fuel policy options with accurate counts
  const fuelPolicyOptions = useMemo(() => {
    // Define known fuel policies with initial counts
    const policies = {
      'like-for-like': { id: 'like-for-like', label: 'Like for like', count: 0 },
      'full-to-full': { id: 'full-to-full', label: 'Full to Full', count: 0 },
      'full-to-empty': { id: 'full-to-empty', label: 'Full to Empty', count: 0 },
      'same-as-pickup': { id: 'same-as-pickup', label: 'Same as pickup', count: 0 }
    };
    
    results.forEach(car => {
      // Extract fuel policy from various possible locations
      const fuelPolicy = car.fuel_policy || 
                        car.original?.fuel_policy ||
                        car.original?.vehicle_info?.fuel_policy || 
                        'like for like';
      
      const policyLower = fuelPolicy.toLowerCase();
      
      // Match to known policies
      if (policyLower.includes('full to full') || policyLower.includes('full-to-full')) {
        policies['full-to-full'].count++;
      } else if (policyLower.includes('full to empty') || policyLower.includes('full-to-empty')) {
        policies['full-to-empty'].count++;
      } else if (policyLower.includes('like for like') || policyLower.includes('same as')) {
        policies['like-for-like'].count++;
      } else {
        // Default for unrecognized policies
        policies['like-for-like'].count++;
      }
    });
    
    // Return only policies with cars available
    return Object.values(policies).filter(policy => policy.count > 0);
  }, [results]);

  // Log calculated filter counts for debugging
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Dynamic filter counts:', {
        locations: locationOptions.map(l => `${l.label}: ${l.count}`),
        transmissions: transmissionOptions.map(t => `${t.label}: ${t.count}`),
        suppliers: supplierOptions.map(s => `${s.label}: ${s.count}`),
        reviews: reviewOptions.map(r => `${r.label}: ${r.count}`),
        payment: paymentOptions.map(p => `${p.label}: ${p.count}${p.disabled ? ' (disabled)' : ''}`),
        specs: carSpecOptions.map(s => `${s.label}: ${s.count}`),
        mileage: mileageOptions.map(m => `${m.label}: ${m.count}`),
        electric: electricCarOptions.map(e => `${e.label}: ${e.count}${e.disabled ? ' (disabled)' : ''}`),
        deposits: depositOptions.map(d => `${d.label}: ${d.count}${d.disabled ? ' (disabled)' : ''}`),
        fuelPolicies: fuelPolicyOptions.map(f => `${f.label}: ${f.count}`)
      });
    }
  }, [locationOptions, transmissionOptions, supplierOptions, reviewOptions, paymentOptions, carSpecOptions, mileageOptions, electricCarOptions, depositOptions, fuelPolicyOptions]);

  // Vendor cars state
  const [vendorCars, setVendorCars] = useState<any[]>([]);

  // Vendor car fetching is now handled in the main useEffect with Promise.all

  // Merge vendor cars with API results for display
  const allResults = useMemo(() => {
    // Always merge vendor and API cars regardless of API status
    const apiIds = new Set(results.map(car => car.id || car._id));
    const uniqueVendorCars = vendorCars.filter(car => !apiIds.has(car.id || car._id));
    return [...results, ...uniqueVendorCars];
  }, [results, vendorCars]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f7fa]">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-16 h-16 border-4 border-[#00afd5] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-[#024891] font-medium">Finding the best cars for you...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show error message only if we have no cars to display
  if (error && allResults.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f7fa]">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 p-6 rounded-xl text-red-700 text-center shadow-md"
          >
            <h2 className="text-xl font-bold mb-4">Car Search Error</h2>
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => router.push('/')}
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Return to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }
  
  // If there are results but also a warning message, display it at the top
  if (error && allResults.length > 0) {
    // We'll handle this in the main UI layout
  }

  // If API failed and we have vendor cars, show a message
  if (apiFailed) {
    // Always render this section when API fails, even if vendorCars is empty
    console.log("API failed rendering vendor cars section, vendor cars count:", vendorCars.length);
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f7fa]">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          {/* Optional SearchBar at the top */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-[#024891] to-[#00afd5] text-white">
              <h2 className="text-lg font-medium">Modify your search</h2>
            </div>
            <div className="p-4 md:p-6">
              <div className="max-w-5xl mx-auto">
                <CarRentalSearch initialValues={{
                  pickupLocation: pickupLocation || '',
                  dropoffLocation: dropoffLocation || '',
                  pickupTime: pickupDate || '',
                  dropoffTime: dropoffDate || '',
                  driverAge: driverAge || '30',
                  sameLocation: dropoffLocation ? pickupLocation === dropoffLocation : true,
                  pickupLatitude: '',
                  pickupLongitude: '',
                  dropoffLatitude: '',
                  dropoffLongitude: ''
                }} />
              </div>
            </div>
          </motion.div>
          

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h2 className="text-2xl font-bold mb-6 text-[#024891]">Cars {pickupLocation ? ` in ${pickupLocation}` : ''}</h2>
            {vendorCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendorCars.map((car, idx) => (
                  <CarCard
                    key={car.id || car._id || idx}
                    car={car}
                    index={idx}
                    selectedCurrency={selectedCurrency}
                    exchangeRate={exchangeRates[selectedCurrency] || 1}
                    onSelect={(selectedCar) => {
                      try {
                        localStorage.setItem('selectedCarDetail', JSON.stringify(selectedCar));
                      } catch (err) {}
                      router.push(`/car-detail/${selectedCar.id || selectedCar._id}?pickupLocation=${encodeURIComponent(pickupLocation)}&dropoffLocation=${encodeURIComponent(dropoffLocation)}&pickupDate=${encodeURIComponent(pickupDate)}&dropoffDate=${encodeURIComponent(dropoffDate)}&driverAge=${encodeURIComponent(driverAge)}&`);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No vendor cars available for this location. Please modify your search or check back later.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    // If vendor cars exist, show them
    if (vendorCars.length > 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f7fa]">
          <div className="container mx-auto py-8 px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-blue-700 text-center shadow-md"
            >
              <h2 className="text-xl font-bold mb-4">Vendor Registered Cars</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendorCars.map((car, idx) => (
                  <CarCard
                    key={car.id || car._id || idx}
                    car={car}
                    index={idx}
                    selectedCurrency={selectedCurrency}
                    exchangeRate={exchangeRates[selectedCurrency] || 1}
                    onSelect={(selectedCar) => {
                      try {
                        localStorage.setItem('selectedCarDetail', JSON.stringify(selectedCar));
                      } catch (err) {}
                      router.push(`/car-detail/${selectedCar.id || selectedCar._id}?pickupLocation=${encodeURIComponent(pickupLocation)}&dropoffLocation=${encodeURIComponent(dropoffLocation)}&pickupDate=${encodeURIComponent(pickupDate)}&dropoffDate=${encodeURIComponent(dropoffDate)}&driverAge=${encodeURIComponent(driverAge)}`);
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      );
    }
    // If no results at all
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f7fa] flex items-center justify-center">
        <span>No car rentals found.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="w-full max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4">

         <Filters
                initialValues={[]}
                onChange={()=>{}}
                tabValue="cars"
              />
        {/* Display warning if there's an error but we still have cars */}
        {error && allResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-yellow-700 mb-6 shadow-sm"
          >
            <p>{error}</p>
          </motion.div>
        )}
        
        {/* Search Form */}
    
        
        {/* Main Layout: Filters + Results */}
        <div className="flex flex-col lg:flex-row gap-6 mt-5  max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4 items-start w-full">
          {/* Filter Panel */}
          <div className="w-full lg:w-1/3">
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6 sticky top-8"
            >
              <div className="bg-white p-6 rounded-xl shadow-md">
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-[#023e8a]" />
                    <h3 className="font-semibold text-[#023e8a] text-lg">Filter</h3>
                  </div>
                  <button 
                    onClick={clearFilters}
                    className="text-[#023e8a] text-sm font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              
              {/* Sort Options */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Sort By</h3>
                <div className="bg-gray-50 p-0.5 rounded-lg">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 bg-transparent border-none focus:ring-2 focus:ring-[#023e8a]/20 rounded-lg"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Currency Selector */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-700 mb-3">Currency</h3>
                <div className="bg-gray-50 p-0.5 rounded-lg">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full p-3 bg-transparent border-none focus:ring-2 focus:ring-[#023e8a]/20 rounded-lg"
                  >
                    {Object.entries(CURRENCIES).map(([code, { name }]) => (
                      <option key={code} value={code}>
                        {code} - {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag size={16} className="text-[#023e8a]" />
                  <h3 className="font-semibold text-gray-700">Price Range</h3>
                </div>
                <div className="px-2">
                  <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#023e8a]"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>{formatPrice(priceRange[0] * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}</span>
                    <span>{formatPrice(priceRange[1] * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}</span>
                  </div>
                </div>
              </div>
              
              {/* Car Category Filter */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Car size={16} className="text-[#023e8a]" />
                  <h3 className="font-semibold text-gray-700">Car category</h3>
                </div>
                <div className="space-y-2">
                  {carCategoryOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center justify-between w-full cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedCarTypes.includes(option.id)}
                          onChange={() => {
                            if (selectedCarTypes.includes(option.id)) {
                              setSelectedCarTypes(selectedCarTypes.filter((t) => t !== option.id));
                            } else {
                              setSelectedCarTypes([...selectedCarTypes, option.id]);
                            }
                          }}
                          className="w-4 h-4 accent-[#023e8a] rounded"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </div>
                      <span className="text-sm text-gray-500">{option.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Review score */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star size={16} className="text-[#023e8a]" />
                  <h3 className="font-semibold text-gray-700">Review score</h3>
                </div>
                <div className="space-y-2">
                  {reviewOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center justify-between w-full cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedReviews.includes(option.id)}
                          onChange={() => {
                            if (selectedReviews.includes(option.id)) {
                              setSelectedReviews(selectedReviews.filter((t) => t !== option.id));
                            } else {
                              setSelectedReviews([...selectedReviews, option.id]);
                            }
                          }}
                          className="w-4 h-4 accent-[#023e8a] rounded"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </div>
                      <span className="text-sm text-gray-500">{option.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-[#023e8a]" />
                  <h3 className="font-semibold text-gray-700">Location</h3>
                </div>
                <div className="space-y-2">
                  {staticFilterOptions.locations.map((location) => (
                    <label
                      key={location.id}
                      className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors
                        ${selectedLocations.includes(location.id) ? 'bg-[#e0f7fa] text-[#023e8a] font-medium' : 'hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location.id)}
                        onChange={() => {
                          if (selectedLocations.includes(location.id)) {
                            setSelectedLocations(selectedLocations.filter((l) => l !== location.id));
                          } else {
                            setSelectedLocations([...selectedLocations, location.id]);
                          }
                        }}
                        className="w-4 h-4 accent-[#023e8a] rounded"
                      />
                      <span className="text-sm">{location.label}</span>
                      <span className="text-xs text-gray-500">({location.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Transmission Filter */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Settings size={16} className="text-[#023e8a]" />
                  <h3 className="font-semibold text-gray-700">Transmission</h3>
                </div>
                <div className="space-y-2">
                  {staticFilterOptions.transmissions.map((transmission) => (
                    <label
                      key={transmission.id}
                      className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors
                        ${selectedTransmissions.includes(transmission.id) ? 'bg-[#e0f7fa] text-[#023e8a] font-medium' : 'hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTransmissions.includes(transmission.id)}
                        onChange={() => {
                          console.log("Transmission selected:", transmission.id);
                          if (selectedTransmissions.includes(transmission.id)) {
                            const updated = selectedTransmissions.filter((t) => t !== transmission.id);
                            console.log("Updated transmissions:", updated);
                            setSelectedTransmissions(updated);
                          } else {
                            const updated = [...selectedTransmissions, transmission.id];
                            console.log("Updated transmissions:", updated);
                            setSelectedTransmissions(updated);
                          }
                        }}
                        className="w-4 h-4 accent-[#023e8a] rounded"
                      />
                      <span className="text-sm">{transmission.label}</span>
                      <span className="text-xs text-gray-500">({transmission.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Supplier Filter */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck size={16} className="text-[#023e8a]" />
                  <h3 className="font-semibold text-gray-700">Supplier</h3>
                </div>
                <div className="space-y-2">
                  {staticFilterOptions.suppliers.map((supplier) => (
                    <label
                      key={supplier.id}
                      className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors
                        ${selectedSuppliers.includes(supplier.id) ? 'bg-[#e0f7fa] text-[#023e8a] font-medium' : 'hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSuppliers.includes(supplier.id)}
                        onChange={() => {
                          console.log("Supplier selected:", supplier.id);
                          if (selectedSuppliers.includes(supplier.id)) {
                            const updated = selectedSuppliers.filter((s) => s !== supplier.id);
                            console.log("Updated suppliers:", updated);
                            setSelectedSuppliers(updated);
                          } else {
                            const updated = [...selectedSuppliers, supplier.id];
                            console.log("Updated suppliers:", updated);
                            setSelectedSuppliers(updated);
                          }
                        }}
                        className="w-4 h-4 accent-[#023e8a] rounded"
                      />
                      <span className="text-sm">{supplier.label}</span>
                      <span className="text-xs text-gray-500">({supplier.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mileage Filter */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-[#023e8a]" />
                  <h3 className="font-semibold text-gray-700">Mileage</h3>
                </div>
                <div className="space-y-2">
                  {staticFilterOptions.mileage.map((mileage) => (
                    <label
                      key={mileage.id}
                      className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors
                        ${selectedMileage.includes(mileage.id) ? 'bg-[#e0f7fa] text-[#023e8a] font-medium' : 'hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMileage.includes(mileage.id)}
                        onChange={() => {
                          console.log("Mileage selected:", mileage.id);
                          if (selectedMileage.includes(mileage.id)) {
                            const updated = selectedMileage.filter((m) => m !== mileage.id);
                            console.log("Updated mileage options:", updated);
                            setSelectedMileage(updated);
                          } else {
                            const updated = [...selectedMileage, mileage.id];
                            console.log("Updated mileage options:", updated);
                            setSelectedMileage(updated);
                          }
                        }}
                        className="w-4 h-4 accent-[#023e8a] rounded"
                      />
                      <span className="text-sm">{mileage.label}</span>
                      <span className="text-xs text-gray-500">({mileage.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Seats Filter */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-[#023e8a]" />
                  <h3 className="font-semibold text-gray-700">Seats</h3>
                </div>
                <div className="space-y-2">
                  {seatOptions.map((seat) => (
                    <label
                      key={seat.id}
                      className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors
                        ${selectedSeats.includes(seat.id) ? 'bg-[#e0f7fa] text-[#023e8a] font-medium' : 'hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSeats.includes(seat.id)}
                        onChange={() => {
                          if (selectedSeats.includes(seat.id)) {
                            setSelectedSeats(selectedSeats.filter((s) => s !== seat.id));
                          } else {
                            setSelectedSeats([...selectedSeats, seat.id]);
                          }
                        }}
                        className="w-4 h-4 accent-[#023e8a] rounded"
                      />
                      <span className="text-sm">{seat.label}</span>
                      <span className="text-xs text-gray-500">({seat.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reviews Filter */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star size={16} className="text-[#023e8a]" />
                  <h3 className="font-semibold text-gray-700">Reviews</h3>
                </div>
                <div className="space-y-2">
                  {staticFilterOptions.reviews.map((review) => (
                    <label
                      key={review.id}
                      className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors
                        ${selectedReviews.includes(review.id) ? 'bg-[#e0f7fa] text-[#023e8a] font-medium' : 'hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedReviews.includes(review.id)}
                        onChange={() => {
                          if (selectedReviews.includes(review.id)) {
                            setSelectedReviews(selectedReviews.filter((r) => r !== review.id));
                          } else {
                            setSelectedReviews([...selectedReviews, review.id]);
                          }
                        }}
                        className="w-4 h-4 accent-[#023e8a] rounded"
                      />
                      <span className="text-sm">{review.label}</span>
                      <span className="text-xs text-gray-500">({review.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Timing Filter */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard size={16} className="text-[#023e8a]" />
                  <h3 className="font-semibold text-gray-700">Payment Timing</h3>
                </div>
                <div className="space-y-2">
                  {staticFilterOptions.payment.map((payment) => (
                    <label
                      key={payment.id}
                      className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors
                        ${payment.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${selectedPaymentTiming.includes(payment.id) ? 'bg-[#e0f7fa] text-[#023e8a] font-medium' : 'hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        disabled={payment.disabled}
                        checked={selectedPaymentTiming.includes(payment.id)}
                        onChange={() => {
                          if (!payment.disabled) {
                            if (selectedPaymentTiming.includes(payment.id)) {
                              setSelectedPaymentTiming(selectedPaymentTiming.filter((p) => p !== payment.id));
                            } else {
                              setSelectedPaymentTiming([...selectedPaymentTiming, payment.id]);
                            }
                          }
                        }}
                        className="w-4 h-4 accent-[#023e8a] rounded"
                      />
                      <span className="text-sm">{payment.label}</span>
                      <span className="text-xs text-gray-500">({payment.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Car Specs Filter */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Settings size={16} className="text-[#023e8a]" />
                  <h3 className="font-semibold text-gray-700">Car Specs</h3>
                </div>
                <div className="space-y-2">
                  {carSpecOptions.map((spec) => (
                    <label
                      key={spec.id}
                      className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors
                        ${selectedCarSpecs.includes(spec.id) ? 'bg-[#e0f7fa] text-[#023e8a] font-medium' : 'hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCarSpecs.includes(spec.id)}
                        onChange={() => {
                          if (selectedCarSpecs.includes(spec.id)) {
                            setSelectedCarSpecs(selectedCarSpecs.filter((s) => s !== spec.id));
                          } else {
                            setSelectedCarSpecs([...selectedCarSpecs, spec.id]);
                          }
                        }}
                        className="w-4 h-4 accent-[#023e8a] rounded"
                      />
                      <span className="text-sm">{spec.label}</span>
                      <span className="text-xs text-gray-500">({spec.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Electric Types Filter */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <BatteryCharging size={16} className="text-[#023e8a]" />
                  <h3 className="font-semibold text-gray-700">Electric Types</h3>
                </div>
                <div className="space-y-2">
                  {staticFilterOptions.electric.map((electric) => (
                    <label
                      key={electric.id}
                      className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors
                        ${electric.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${selectedElectricTypes.includes(electric.id) ? 'bg-[#e0f7fa] text-[#023e8a] font-medium' : 'hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        disabled={electric.disabled}
                        checked={selectedElectricTypes.includes(electric.id)}
                        onChange={() => {
                          if (!electric.disabled) {
                            if (selectedElectricTypes.includes(electric.id)) {
                              setSelectedElectricTypes(selectedElectricTypes.filter((e) => e !== electric.id));
                            } else {
                              setSelectedElectricTypes([...selectedElectricTypes, electric.id]);
                            }
                          }
                        }}
                        className="w-4 h-4 accent-[#023e8a] rounded"
                      />
                      <span className="text-sm">{electric.label}</span>
                      <span className="text-xs text-gray-500">({electric.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Deposits Filter */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={16} className="text-[#023e8a]" />
                  <h3 className="font-semibold text-gray-700">Deposits</h3>
                </div>
                <div className="space-y-2">
                  {staticFilterOptions.deposits.map((deposit) => (
                    <label
                      key={deposit.id}
                      className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors
                        ${deposit.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${selectedDeposits.includes(deposit.id) ? 'bg-[#e0f7fa] text-[#023e8a] font-medium' : 'hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        disabled={deposit.disabled}
                        checked={selectedDeposits.includes(deposit.id)}
                        onChange={() => {
                          if (!deposit.disabled) {
                            if (selectedDeposits.includes(deposit.id)) {
                              setSelectedDeposits(selectedDeposits.filter((d) => d !== deposit.id));
                            } else {
                              setSelectedDeposits([...selectedDeposits, deposit.id]);
                            }
                          }
                        }}
                        className="w-4 h-4 accent-[#023e8a] rounded"
                      />
                      <span className="text-sm">{deposit.label}</span>
                      <span className="text-xs text-gray-500">({deposit.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fuel Policies Filter */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Fuel size={16} className="text-[#023e8a]" />
                  <h3 className="font-semibold text-gray-700">Fuel Policies</h3>
                </div>
                <div className="space-y-2">
                  {fuelPolicyOptions.map((policy) => (
                    <label
                      key={policy.id}
                      className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors
                        ${selectedFuelPolicies.includes(policy.id) ? 'bg-[#e0f7fa] text-[#023e8a] font-medium' : 'hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFuelPolicies.includes(policy.id)}
                        onChange={() => {
                          if (selectedFuelPolicies.includes(policy.id)) {
                            setSelectedFuelPolicies(selectedFuelPolicies.filter((p) => p !== policy.id));
                          } else {
                            setSelectedFuelPolicies([...selectedFuelPolicies, policy.id]);
                          }
                        }}
                        className="w-4 h-4 accent-[#023e8a] rounded"
                      />
                      <span className="text-sm">{policy.label}</span>
                      <span className="text-xs text-gray-500">({policy.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full bg-gray-100 hover:bg-gray-200 text-[#023e8a] font-medium py-3 px-4 rounded-lg transition-colors mt-4"
              >
                Clear All Filters
              </button>
            </div>
            </motion.aside>
          </div>

          {/* Main Content - Cars List */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1 space-y-3"
          >
            {/* Car Count and Category Filters */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{sortedCars.length} cars available</h2>
              
              {/* Car Category Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-6 overflow-x-auto pb-2">
                  {carCategoryOptions.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        if (selectedCarTypes.includes(category.id)) {
                          setSelectedCarTypes(selectedCarTypes.filter((t) => t !== category.id));
                        } else {
                          setSelectedCarTypes([...selectedCarTypes, category.id]);
                        }
                      }}
                      className={`flex flex-col items-center min-w-[100px] py-2 px-3 rounded-lg transition-all ${
                        selectedCarTypes.includes(category.id)
                          ? 'bg-blue-50 border-2 border-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <Car size={24} className={selectedCarTypes.includes(category.id) ? 'text-blue-600' : 'text-gray-700'} />
                      <span className={`text-sm font-medium mt-1 whitespace-nowrap ${
                        selectedCarTypes.includes(category.id) ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {category.label.replace(' car', '').replace(' Car', '')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

           
            
            
            {/* Cars List - Vertical Layout */}
            {sortedCars.length === 0 && results.length > 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500 mb-4">No cars match your current filters.</p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-[#024891] to-[#00afd5] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentCars.map((car, index) => (
                  <motion.div
                    key={car.id || `car-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <CarCard 
                      car={car as any}
                      index={index}
                      selectedCurrency={selectedCurrency}
                      exchangeRate={exchangeRates[selectedCurrency] || 1}
                      onSelect={(selectedCar) => {
                        console.log('Selected car:', selectedCar);
                        try {
                          localStorage.setItem('selectedCarDetail', JSON.stringify(selectedCar));
                        } catch (err) {
                          console.error('Error saving car to localStorage:', err);
                        }
                        router.push(`/car-detail/${selectedCar.id}?pickupLocation=${encodeURIComponent(pickupLocation)}&dropoffLocation=${encodeURIComponent(dropoffLocation)}&pickupDate=${encodeURIComponent(pickupDate)}&dropoffDate=${encodeURIComponent(dropoffDate)}&driverAge=${encodeURIComponent(driverAge)}&pickupTime=${pickupTime}&dropoffTime=${dropoffTime}`);
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {sortedCars.length > carsPerPage && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
