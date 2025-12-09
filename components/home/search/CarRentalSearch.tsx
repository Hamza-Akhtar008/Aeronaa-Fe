"use client";

import { FormEvent, useState } from "react";
import { MapPin, Calendar, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { CarRentalSearch as CarRentalSearchType } from "./types";
import { debounce } from "./utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { formatTimeForAPI, formatDateForAPI, getLocationCoordinates } from "@/lib/carRentalApi";

interface CarRentalSearchProps {
  initialValues?: CarRentalSearchType;
}

export default function CarRentalSearch({ initialValues }: CarRentalSearchProps) {
  const router = useRouter();

  // Initialize dates with defaults (tomorrow and day after - better availability)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  // Set default times (10:00 AM pickup, 10:00 AM return)
  tomorrow.setHours(10, 0, 0, 0);
  dayAfter.setHours(10, 0, 0, 0);

  const [carRentalSearch, setCarRentalSearch] = useState<CarRentalSearchType>(initialValues || {
    pickupLocation: '',
    pickupLatitude: '',
    pickupLongitude: '',
    dropoffLocation: '',
    dropoffLatitude: '',
    dropoffLongitude: '',
    pickupTime: '',
    dropoffTime: '',
    driverAge: '30',
    sameLocation: true
  });

  // Separate state for the date/time pickers
  const [pickupDateTime, setPickupDateTime] = useState<Date | undefined>(tomorrow);
  const [dropoffDateTime, setDropoffDateTime] = useState<Date | undefined>(dayAfter);

  const [carRentalError, setCarRentalError] = useState<string | null>(null);
  const [carRentalLoading, setCarRentalLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // Geocode a location name to get coordinates
  const geocodeLocation = async (locationName: string): Promise<{ latitude: string, longitude: string } | null> => {
    try {
      // First, try to get coordinates from our known locations
      const knownCoords = getLocationCoordinates(locationName);
      if (knownCoords) {
        console.log(`Using known coordinates for ${locationName}:`, knownCoords);
        return knownCoords;
      }

      // Using OpenStreetMap's Nominatim API for geocoding (free and doesn't require API key)
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: locationName,
          format: 'json',
          limit: 1
        }
      });

      if (response.data && response.data.length > 0) {
        return {
          latitude: response.data[0].lat,
          longitude: response.data[0].lon
        };
      }
      return null;
    } catch (error) {
      console.error("Error geocoding location:", error);
      return null;
    }
  };

  const handleCarRentalSearch = async (e: FormEvent) => {
    e.preventDefault();
    setCarRentalError(null);
    setCarRentalLoading(true);

    // Validate required fields
    if (!carRentalSearch.pickupLocation || (!carRentalSearch.sameLocation && !carRentalSearch.dropoffLocation)) {
      setCarRentalError("Please enter both pickup and dropoff locations.");
      setCarRentalLoading(false);
      return;
    }

    // Ensure we have coordinates for pickup location
    if (!carRentalSearch.pickupLatitude || !carRentalSearch.pickupLongitude) {
      const geocodeResult = await geocodeLocation(carRentalSearch.pickupLocation);
      if (geocodeResult) {
        carRentalSearch.pickupLatitude = geocodeResult.latitude;
        carRentalSearch.pickupLongitude = geocodeResult.longitude;
      } else {
        // Use JFK Airport coordinates as default (more appropriate for car rentals)
        carRentalSearch.pickupLatitude = '40.6397';
        carRentalSearch.pickupLongitude = '-73.7789';
      }
    }

    // Ensure we have coordinates for dropoff location (if different from pickup)
    if (!carRentalSearch.sameLocation) {
      if (!carRentalSearch.dropoffLatitude || !carRentalSearch.dropoffLongitude) {
        const geocodeResult = await geocodeLocation(carRentalSearch.dropoffLocation);
        if (geocodeResult) {
          carRentalSearch.dropoffLatitude = geocodeResult.latitude;
          carRentalSearch.dropoffLongitude = geocodeResult.longitude;
        } else {
          // Use JFK Airport coordinates as default
          carRentalSearch.dropoffLatitude = '40.6413';
          carRentalSearch.dropoffLongitude = '-73.7781';
        }
      }
    } else {
      // Use pickup coordinates for dropoff when same location
      carRentalSearch.dropoffLatitude = carRentalSearch.pickupLatitude;
      carRentalSearch.dropoffLongitude = carRentalSearch.pickupLongitude;
    }

    // Format dates and times from the DateTimePicker
    const formatTimeOnly = (date: Date): string => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const formatDateString = (date: Date): string => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Use the DateTimePicker values or fallback to defaults
    const pickupDate = pickupDateTime || tomorrow;
    const dropoffDate = dropoffDateTime || dayAfter;

    const pickupTime = formatTimeOnly(pickupDate);
    const dropoffTime = formatTimeOnly(dropoffDate);
    const pickupDateStr = formatDateString(pickupDate);
    const dropoffDateStr = formatDateString(dropoffDate);

    try {
      console.log("Navigating to car results with parameters:", {
        pickupLocation: carRentalSearch.pickupLocation,
        dropoffLocation: carRentalSearch.dropoffLocation || carRentalSearch.pickupLocation,
        pickupDate: pickupDateStr,
        dropoffDate: dropoffDateStr,
        pickupTime,
        dropoffTime,
        driverAge: carRentalSearch.driverAge
      });

      // Navigate directly to /cars page with search parameters
      // This will load vendor cars only
      const queryParams: Record<string, string> = {
        pickupLocation: carRentalSearch.pickupLocation,
        dropoffLocation: carRentalSearch.dropoffLocation || carRentalSearch.pickupLocation,
        pickupDate: pickupDateStr,
        dropoffDate: dropoffDateStr,
        pickupTime: pickupTime,
        dropoffTime: dropoffTime,
        driverAge: carRentalSearch.driverAge || '30'
      };

      const queryString = new URLSearchParams(queryParams).toString();
      console.log("Navigating to:", `/cars?${queryString}`);
      router.push(`/cars?${queryString}`);

    } catch (error: any) {
      console.error("Error preparing car search:", error);
      setCarRentalError("An error occurred. Please try again.");
    } finally {
      setCarRentalLoading(false);
    }
  };  // Function to fetch location suggestions using geocoding
  const fetchLocationSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setLocationSuggestions([]);
      return;
    }

    try {
      console.log("Fetching suggestions for:", query);

      // Try geocoding first
      const geocodeResult = await geocodeLocation(query);
      if (geocodeResult) {
        const geocodedLocation = {
          name: query,
          latitude: parseFloat(geocodeResult.latitude),
          longitude: parseFloat(geocodeResult.longitude),
          country: '',
          region: ''
        };

        console.log("Successfully geocoded location:", geocodedLocation);
        setLocationSuggestions([geocodedLocation]);
        setShowLocationSuggestions(true);
        return;
      }

      // Fallback to manual suggestions for common cities and airports
      const commonLocations = [
        // Airports
        {
          name: "JFK Airport (John F. Kennedy International Airport)",
          latitude: 40.6413,
          longitude: -73.7781,
          country: "USA",
          region: "New York"
        },
        {
          name: "LAX Airport (Los Angeles International Airport)",
          latitude: 33.9425,
          longitude: -118.4081,
          country: "USA",
          region: "California"
        },
        {
          name: "LHR Airport (London Heathrow Airport)",
          latitude: 51.4700,
          longitude: -0.4543,
          country: "UK",
          region: "England"
        },
        {
          name: "DXB Airport (Dubai International Airport)",
          latitude: 25.2532,
          longitude: 55.3657,
          country: "UAE",
          region: "Dubai"
        },
        // Cities
        {
          name: "Islamabad",
          latitude: 33.6844,
          longitude: 73.0479,
          country: "Pakistan",
          region: "Federal Territory"
        },
        {
          name: "Lahore",
          latitude: 31.5204,
          longitude: 74.3587,
          country: "Pakistan",
          region: "Punjab"
        },
        {
          name: "Karachi",
          latitude: 24.8607,
          longitude: 67.0011,
          country: "Pakistan",
          region: "Sindh"
        },
        {
          name: "New York",
          latitude: 40.7128,
          longitude: -74.0060,
          country: "USA",
          region: "New York"
        },
        {
          name: "London",
          latitude: 51.5074,
          longitude: -0.1278,
          country: "UK",
          region: "England"
        },
        {
          name: "Dubai",
          latitude: 25.2048,
          longitude: 55.2708,
          country: "UAE",
          region: "Dubai"
        }
      ];

      // Filter locations based on the query (search in name and check for common airport codes)
      const filteredLocations = commonLocations.filter(location => {
        const queryLower = query.toLowerCase();
        const nameLower = location.name.toLowerCase();

        // Check if query matches the location name
        if (nameLower.includes(queryLower)) {
          return true;
        }

        // Check for airport codes
        if (queryLower.includes('jkf') || queryLower.includes('jfk')) {
          return nameLower.includes('jfk');
        }
        if (queryLower.includes('lax')) {
          return nameLower.includes('lax');
        }
        if (queryLower.includes('lhr')) {
          return nameLower.includes('lhr');
        }
        if (queryLower.includes('dxb')) {
          return nameLower.includes('dxb');
        }

        return false;
      });

      if (filteredLocations.length > 0) {
        console.log("Using fallback location data:", filteredLocations);
        setLocationSuggestions(filteredLocations);
        setShowLocationSuggestions(true);
      } else {
        console.warn('No location suggestions found for query:', query);
        setLocationSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);

      // On API error, still show some fallback suggestions
      const fallbackCities = [
        {
          name: "Islamabad",
          latitude: 33.6844,
          longitude: 73.0479,
          country: "Pakistan",
          region: "Federal Territory"
        },
        {
          name: "Lahore",
          latitude: 31.5204,
          longitude: 74.3587,
          country: "Pakistan",
          region: "Punjab"
        }
      ];

      setLocationSuggestions(fallbackCities);
      setShowLocationSuggestions(true);
    }
  };

  const debouncedFetchLocations = debounce(fetchLocationSuggestions, 300);

  return (
    <div className="w-full  mx-auto sm:px-2 md:px-4 lg:px-6">
      {carRentalError && (
        <div className="mb-2 p-2 rounded bg-red-100 border border-red-300 text-red-700 text-xs font-medium">
          {carRentalError}
        </div>
      )}

      <form onSubmit={handleCarRentalSearch} className="flex flex-col gap-2">
        {/* Same Location Checkbox */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <input
            type="checkbox"
            id="sameLocation"
            checked={carRentalSearch.sameLocation}
            onChange={(e) => {
              setCarRentalSearch(prev => ({
                ...prev,
                sameLocation: e.target.checked,
                dropoffLocation: e.target.checked ? prev.pickupLocation : '',
                dropoffLatitude: e.target.checked ? prev.pickupLatitude : '',
                dropoffLongitude: e.target.checked ? prev.pickupLongitude : ''
              }));
            }}
            className="rounded border-[#00b4d8]/20 text-[#00b4d8] focus:ring-[#00b4d8] text-xs"
          />
          <label htmlFor="sameLocation" className="text-gray-600 text-xs sm:text-sm">
            Return to same location
          </label>
        </div>

        {/* Pickup & Dropoff Locations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Pickup Location */}
          <div className="relative min-w-0">
            <label
              htmlFor="picklocation"
              className="absolute left-2 top-2 z-10 origin-[0] transform -translate-y-4 scale-75 cursor-text select-none bg-white px-2 text-md text-gray-500 duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500">

              Pickup Location
            </label>


            <input
              id="picklocation"
              type="text"
              placeholder="Enter city or airport"
              className="peer w-full h-14 pl-3 pr-10 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-md"
              value={carRentalSearch.pickupLocation}
              onChange={(e) => {
                const value = e.target.value;
                setCarRentalSearch(prev => ({ ...prev, pickupLocation: value }));
                debouncedFetchLocations(value);
              }}
              onFocus={() => setShowLocationSuggestions(true)}
              required
            />
            {showLocationSuggestions && locationSuggestions.length > 0 && (
              <div className="absolute z-[999] w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto text-xs sm:text-sm">
                {locationSuggestions.map((location, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 cursor-pointer hover:bg-[#00b4d8]/10 text-gray-800"
                    onClick={() => {
                      const latitude = location.latitude || location.lat || '';
                      const longitude = location.longitude || location.lng || '';
                      setCarRentalSearch(prev => ({
                        ...prev,
                        pickupLocation: location.name || location.label || location.title || '',
                        pickupLatitude: latitude.toString(),
                        pickupLongitude: longitude.toString(),
                        dropoffLocation: carRentalSearch.sameLocation
                          ? (location.name || location.label || location.title || '')
                          : prev.dropoffLocation,
                        dropoffLatitude: carRentalSearch.sameLocation
                          ? latitude.toString()
                          : prev.dropoffLatitude,
                        dropoffLongitude: carRentalSearch.sameLocation
                          ? longitude.toString()
                          : prev.dropoffLongitude,
                      }));
                      setShowLocationSuggestions(false);
                    }}
                  >
                    <div className="font-medium">{location.name || location.label || location.title}</div>
                    {(location.country || location.region) && (
                      <div className="text-xs text-gray-500">
                        {location.region && location.region}{location.region && location.country && ', '}
                        {location.country && location.country}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drop-off Location */}
          {!carRentalSearch.sameLocation && (
            <div className="relative min-w-0">
              <label
                htmlFor="droplocation"
                className="absolute left-2 top-2 z-10 origin-[0] transform -translate-y-4 scale-75 cursor-text select-none bg-white px-2 text-md text-gray-500 duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500">

                Drop-off Location
              </label>
              <input
                id="droplocation"
                type="text"
                placeholder="Enter city or airport"
                className="peer w-full h-14 pl-3 pr-10 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-md"
                value={carRentalSearch.dropoffLocation}
                onChange={(e) => {
                  const value = e.target.value;
                  setCarRentalSearch(prev => ({ ...prev, dropoffLocation: value }));
                  debouncedFetchLocations(value);
                }}
                required
              />
            </div>
          )}
        </div>

        {/* Date, Time & Driver Age */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {/* Pickup Date & Time */}
          <div className="min-w-0 w-full ">
            <div className="w-full ">
              <label className="flex items-center gap-1 font-medium mb-1 text-xs sm:text-sm">
                <Calendar className="h-4 w-4" />
                Pickup Date & Time
              </label>
              <DateTimePicker
                date={pickupDateTime}
                setDate={setPickupDateTime}
                placeholder="Select pickup date and time"
                className="w-full text-black text-xs sm:text-sm z-[1000] h-8 sm:h-9"
                minDate={new Date()}
              />
            </div>
          </div>

          {/* Return Date & Time */}
          <div className="min-w-0 w-full flex sm:justify-end">
            <div className="w-full max-w-[240px]">
              <label className="flex items-center gap-1 font-medium mb-1 text-xs sm:text-sm">
                <Calendar className="h-4 w-4" />
                Return Date & Time
              </label>
              <DateTimePicker
                date={dropoffDateTime}
                setDate={setDropoffDateTime}
                placeholder="Select return date and time"
                className="w-full text-black text-xs sm:text-sm z-[1000] h-8 sm:h-9"
                minDate={pickupDateTime || new Date()}
              />
            </div>
          </div>

          {/* Driver Age */}
          {/* <div className="min-w-0 w-full flex sm:justify-end">
        <div className="w-full max-w-[220px]">
          <label 
    htmlFor="driverage"
    className="relative  right-14 top-3 z-10 origin-[0] transform -translate-y-4 scale-75 cursor-text select-none bg-white px-2 text-md text-gray-500 duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500">
        
           
            Driver Age
          </label>
          <input
          id="driverage"
            type="number"
            min="18"
            max="99"
             className="peer w-full h-10 pl-3 pr-10 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-md"
            value={carRentalSearch.driverAge}
            onChange={(e) =>
              setCarRentalSearch(prev => ({ ...prev, driverAge: e.target.value }))
            }
            required
          />
        </div>
      </div> */}
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm bg-[#0a3a7a] hover:bg-[#0a3a7a]-700 text-white min-h-0"
              disabled={carRentalLoading}
            >
              <Send className="w-3 h-3 mr-2" />
              {carRentalLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white animate-spin mr-2"></div>
                  Searching...
                </div>
              ) : (
                "Find a Car"
              )}
            </Button>
          </div>
        </div>

        {/* Search Button */}

      </form>
    </div>


  );
}
