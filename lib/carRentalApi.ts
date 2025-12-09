"use client";

import axios from 'axios';
import { baseURL } from './utils/utils';

export interface CarSearchParams {
  pick_up_latitude: string;
  pick_up_longitude: string;
  drop_off_latitude: string;
  drop_off_longitude: string;
  pick_up_date: string;
  drop_off_date: string;
  pick_up_time: string;
  drop_off_time: string;
  driver_age: string;
  currency_code: string;
  location: string;
}

export interface CarLocationSearch {
  query: string;
}

// Utility function to format dates for API
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Utility function to format time for API
export const formatTimeForAPI = (dateTimeStr: string): string => {
  if (!dateTimeStr) return '10:00';
  try {
    const time = dateTimeStr.includes('T') ? 
      dateTimeStr.split('T')[1]?.split(':').slice(0, 2).join(':') : 
      dateTimeStr;
    return time || '10:00';
  } catch {
    return '10:00';
  }
};

// Function to format time (keeps HH:MM format)
export const formatTimeForBookingAPI = (timeStr: string): string => {
  if (!timeStr) return '10:00';
  
  // If it's already in HH:MM format, return as-is
  if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
    const [hours, minutes] = timeStr.split(':');
    const paddedHours = hours.padStart(2, '0');
    return `${paddedHours}:${minutes}`;
  }
  
  // If it's in HHMM format, convert to HH:MM
  if (/^\d{4}$/.test(timeStr)) {
    const hours = timeStr.substring(0, 2);
    const minutes = timeStr.substring(2, 4);
    return `${hours}:${minutes}`;
  }
  
  return '10:00';
};

// Utility functions for managing car rental search results in localStorage
export const storeCarRentalResults = (results: any): void => {
  try {
    // First, try to store the full results
    const resultsStr = JSON.stringify(results);
    
    try {
      localStorage.setItem('carRentalSearchResults', resultsStr);
      localStorage.setItem('carRentalSearchTimestamp', Date.now().toString());
    } catch (storageError) {
      console.warn('Storage quota exceeded, applying data reduction techniques');
      
      // If that fails, create a reduced version with only essential data
      if (results && results.data) {
        const essentialData = {
          status: results.status,
          message: results.message,
          fallback_location: results.fallback_location,
          data: Array.isArray(results.data) 
            ? results.data.map((car: any) => pruneCarData(car))
            : results.data.search_results 
              ? { 
                  search_results: results.data.search_results.map((car: any) => pruneCarData(car)),
                  // Include minimal essential metadata if it exists
                  ...(results.data.content && { content: { summary: results.data.content.summary } }),
                  ...(results.data.filters && { filters: { available: Object.keys(results.data.filters) } })
                }
              : results.data
        };
        
        try {
          localStorage.setItem('carRentalSearchResults', JSON.stringify(essentialData));
          localStorage.setItem('carRentalSearchTimestamp', Date.now().toString());
          localStorage.setItem('carRentalDataReduced', 'true');
        } catch (reducedStorageError) {
          // If even reduced data is too large, store just the count and a warning message
          console.error('Even reduced data exceeds storage quota:', reducedStorageError);
          const count = Array.isArray(results.data) 
            ? results.data.length 
            : results.data.search_results?.length || 0;
          
          const minimal = {
            status: true,
            message: "Data was too large for local storage. Only count preserved.",
            data: [],
            resultCount: count,
            truncated: true
          };
          
          localStorage.setItem('carRentalSearchResults', JSON.stringify(minimal));
          localStorage.setItem('carRentalSearchTimestamp', Date.now().toString());
          localStorage.setItem('carRentalDataReduced', 'severe');
        }
      }
    }
  } catch (error) {
    console.error('Error storing car rental results:', error);
  }
};

// Helper function to prune car data to essential fields only
const pruneCarData = (car: any): any => {
  // Keep only the most essential fields needed for display and filtering
  return {
    id: car.id || car.vehicle_id || '',
    name: car.name || car.car_name || car.vehicle_name || '',
    type: car.type || car.car_type || car.vehicle_info?.type || 'Economy',
    price: car.price || 0,
    currency: car.currency || car.currency_code || 'USD',
    rating: car.rating || 0,
    image: car.image || car.image_url || car.car_image || '',
    pickup_location: car.pickup_location || car.location || '',
    supplier: car.supplier || car.company || '',
    transmission: car.transmission || 'Automatic',
    unlimited_mileage: car.unlimited_mileage || false,
    seats: car.seats || car.vehicle_info?.seats || 5,
    doors: car.doors || car.vehicle_info?.doors || 4,
    air_conditioning: car.air_conditioning || true,
    fuel_type: car.fuel_type || car.vehicle_info?.fuel_type || '',
    deposit_amount: car.deposit_amount || 0,
    fuel_policy: car.fuel_policy || 'Like for like'
  };
};

export const getCarRentalResults = (): any | null => {
  try {
    const results = localStorage.getItem('carRentalSearchResults');
    const timestamp = localStorage.getItem('carRentalSearchTimestamp');
    const isReduced = localStorage.getItem('carRentalDataReduced');
    
    if (!results || !timestamp) {
      return null;
    }
    
    // Check if results are less than 1 hour old (3600000 ms)
    const age = Date.now() - parseInt(timestamp);
    if (age > 3600000) {
      clearCarRentalResults();
      return null;
    }
    
    const parsedResults = JSON.parse(results);
    
    // If data was severely reduced, show a warning
    if (isReduced === 'severe' && parsedResults.truncated) {
      console.warn(`⚠️ The car rental results were too large to store locally. 
        Found ${parsedResults.resultCount} cars, but details have been truncated.`);
    } else if (isReduced === 'true') {
      console.warn('⚠️ The car rental results were reduced in size to fit in localStorage.');
    }
    
    return parsedResults;
  } catch (error) {
    console.error('Error retrieving car rental results:', error);
    return null;
  }
};

export const clearCarRentalResults = (): void => {
  try {
    localStorage.removeItem('carRentalSearchResults');
    localStorage.removeItem('carRentalSearchTimestamp');
    localStorage.removeItem('carRentalDataReduced');
  } catch (error) {
    console.error('Error clearing car rental results:', error);
  }
};

// Helper function to process and enhance car rental data
export const processCarRentalData = (rawData: any[]): any[] => {
  if (!Array.isArray(rawData)) {
    return [];
  }

  return rawData.map((car, index) => {
    // Extract data from the actual API response structure
    const vehicleInfo = car.vehicle_info || car.content || {};
    const supplierInfo = car.supplier_info || car.content?.supplier || {};
    const routeInfo = car.route_info || {};
    const ratingInfo = car.rating_info || car.content?.supplier?.rating || {};
    const pricingInfo = car.pricing_info || {};
    
    // Get vehicle name from nested structure
    const vehicleName = vehicleInfo.v_name || vehicleInfo.name || car.name || 'Car';
    
    // Get supplier name
    const supplierName = supplierInfo.name || car.supplier_name || 'Rental Provider';
    
    // Get proper image URL
    const imageUrl = vehicleInfo.image_url || vehicleInfo.image_thumbnail_url || 
                     vehicleInfo.image || car.image || '/images/card.jpg';
    
    // Get pricing - handle all possible price fields and formats
    let price = 0;
    
    // Check car.price first (direct property)
    if (car.price !== undefined && car.price !== null) {
      price = parseFloat(car.price);
    } 
    // Then check pricing_info object if available
    else if (pricingInfo) {
      price = pricingInfo.drive_away_price || pricingInfo.base_price || pricingInfo.price || 0;
    }
    
    // Ensure price is a valid number
    if (isNaN(price)) price = 0;
    
    // Get rating
    const rating = ratingInfo.average || car.rating || 4.0;
    const ratingCount = ratingInfo.no_of_ratings || car.rating_count || 0;
    
    // Get transmission
    const transmission = vehicleInfo.transmission || 'Manual';
    
    // Get seats
    const seats = parseInt(vehicleInfo.seats) || 4;
    
    // Get currency
    const currency = car.currency || pricingInfo.currency_code || pricingInfo.currency || '$';
    
    // Get vehicle type/group
    const vehicleType = vehicleInfo.group || vehicleInfo.label || car.type || 'Standard';
    
    // Create features array from vehicle specs
    const features = [];
    if (vehicleInfo.aircon) features.push('Air Conditioning');
    if (vehicleInfo.unlimited_mileage) features.push('Unlimited Mileage');
    if (vehicleInfo.free_cancellation) features.push('Free Cancellation');
    if (vehicleInfo.doors) features.push(`${vehicleInfo.doors} Doors`);
    if (vehicleInfo.suitcases) {
      const suitcases = vehicleInfo.suitcases;
      if (suitcases.big && suitcases.small) {
        features.push(`${parseInt(suitcases.big) + parseInt(suitcases.small)} Suitcases`);
      }
    }
    
    return {
      // Ensure we have an ID
      id: car.vehicle_id || car.id || `car_${index}`,
      vehicle_id: car.vehicle_id,
      
      // Name handling
      name: vehicleName.trim(),
      
      // Price handling
      price: Math.round(price * 100) / 100, // Round to 2 decimal places
      currency: pricingInfo.base_currency === 'INR' ? '₹' : '$',
      
      // Car details
      type: vehicleType,
      transmission: transmission,
      seats: seats,
      
      // Supplier info
      supplier: supplierName,
      supplier_image: supplierInfo.logo_url,
      
      // Images
      image: imageUrl,
      
      // Features and badges
      features: features,
      badges: car.content?.badges || [],
      
      // Location info
      pickup_location: routeInfo.pickup?.name || 'Pickup Location',
      dropoff_location: routeInfo.dropoff?.name || 'Return Location',
      
      // Rating info
      rating: parseFloat(rating) || 4.0,
      rating_count: ratingCount,
      
      // Additional data
      description: vehicleInfo.group_or_similar || '',
      fuel_policy: vehicleInfo.fuel_policy || '',
      mileage: vehicleInfo.mileage || '',
      
      // Keep original data for reference
      original: car,
      content: vehicleInfo,
      supplier_details: supplierInfo,
      rating_details: ratingInfo,
      pricing_details: pricingInfo
    };
  });
};

// Utility function to get coordinates for common airports and cities
export const getLocationCoordinates = (locationName: string): { latitude: string; longitude: string } | null => {
  const locations: { [key: string]: { latitude: string; longitude: string } } = {
    // Major US Airports
    'JFK Airport': { latitude: '40.6397', longitude: '-73.7789' },
    'JFK': { latitude: '40.6397', longitude: '-73.7789' },
    'John F Kennedy Airport': { latitude: '40.6397', longitude: '-73.7789' },
    'LaGuardia Airport': { latitude: '40.7769', longitude: '-73.8740' },
    'LGA': { latitude: '40.7769', longitude: '-73.8740' },
    'Newark Airport': { latitude: '40.6895', longitude: '-74.1745' },
    'EWR': { latitude: '40.6895', longitude: '-74.1745' },
    'LAX': { latitude: '33.9425', longitude: '-118.4081' },
    'Los Angeles Airport': { latitude: '33.9425', longitude: '-118.4081' },
    'Miami Airport': { latitude: '25.7932', longitude: '-80.2906' },
    'MIA': { latitude: '25.7932', longitude: '-80.2906' },
    'Chicago O\'Hare': { latitude: '41.9786', longitude: '-87.9048' },
    'ORD': { latitude: '41.9786', longitude: '-87.9048' },
    'San Francisco Airport': { latitude: '37.6213', longitude: '-122.3790' },
    'SFO': { latitude: '37.6213', longitude: '-122.3790' },
    
    // Major Cities
    'New York': { latitude: '40.7128', longitude: '-74.0060' },
    'Los Angeles': { latitude: '34.0522', longitude: '-118.2437' },
    'Chicago': { latitude: '41.8781', longitude: '-87.6298' },
    'Miami': { latitude: '25.7617', longitude: '-80.1918' },
    'San Francisco': { latitude: '37.7749', longitude: '-122.4194' },
    'Boston': { latitude: '42.3601', longitude: '-71.0589' },
    'Washington DC': { latitude: '38.9072', longitude: '-77.0369' },
    'Seattle': { latitude: '47.6062', longitude: '-122.3321' },
    'Las Vegas': { latitude: '36.1699', longitude: '-115.1398' },
    'Orlando': { latitude: '28.5383', longitude: '-81.3792' },
  };

  const normalizedLocation = locationName.trim().toLowerCase();
  
  for (const [locationKey, coords] of Object.entries(locations)) {
    const normalizedKey = locationKey.toLowerCase();
    if (normalizedLocation.includes(normalizedKey) || normalizedKey.includes(normalizedLocation)) {
      return coords;
    }
  }
  
  return null;
};

// Vendor car rental management functions
export const updatecar = async(id:string,status:string) => {
 try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const payload = {
      status:status
    }
    const response = await axios.patch(`${baseURL}carrentals/${id}`,payload, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to get car booking. Please try again.");
    }
  }
}

export const FetchallCArBookingsbyAgent = async (id:string) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(baseURL + `carbookings/agent/${id}`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to get car booking. Please try again.");
    }
  }
}

export const FetchallCAr = async () => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(baseURL + `carbookings`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to get car booking. Please try again.");
    }
  }
}