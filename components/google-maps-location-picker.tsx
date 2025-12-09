"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MapPin, Search } from "lucide-react"

interface LocationData {
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  lat: number
  lng: number
}
declare global {
  interface Window {
    google?: any;  // Make it optional as it may not always be present when the script is not loaded
  }
}

interface GoogleMapsLocationPickerProps {
  onLocationSelect: (location: LocationData) => void
  initialLocation?: { lat: number; lng: number }
  initialAddress?: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  height?: string
}

declare global {
  interface Window {
    google?: any
  }
}

export function GoogleMapsLocationPicker({
  onLocationSelect,
  initialLocation = { lat: 40.7128, lng: -74.006 }, // Default to NYC
  initialAddress,
  height = "400px",
}: GoogleMapsLocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [mapCenter, setMapCenter] = useState(initialLocation)
  const [address, setAddress] = useState<string | null>(null)
  // Add new state for tracking initialization
  const [isInitialized, setIsInitialized] = useState(false)
  const [needsGeocoding, setNeedsGeocoding] = useState(false)

  // Load Google Maps API
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true)
      setIsLoading(false)
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBCit9qsp_C6ePD126N1h6avxnQ7EH9xGU&libraries=places`
    script.async = true
    script.defer = true

    script.onload = () => {
      setIsLoaded(true)
      setIsLoading(false)
    }

    script.onerror = () => {
      setIsLoading(false)
      console.error("Failed to load Google Maps API")
    }

    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  // Update the mapCenter initialization logic
  useEffect(() => {
    // If we have initial address, we need to geocode it first
    if (initialAddress && initialAddress.address && !isInitialized) {
      setNeedsGeocoding(true)
    } else {
      setIsInitialized(true)
    }
  }, [initialAddress, isInitialized])

  // Update the geocodeAddress function to properly update map state
  const geocodeAddress = useCallback(
    (address: string) => {
      if (!window.google || !address) return

      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ address }, (results:any, status:any) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location
          const lat = location.lat()
          const lng = location.lng()

          console.log("Geocoded address to:", lat, lng)
          const newCenter = { lat, lng }
          setMapCenter(newCenter)

          // Update map and marker if they exist
          if (map && marker) {
            map.setCenter(newCenter)
            map.setZoom(15)
            marker.setPosition(newCenter)
          }

          setIsInitialized(true)
          setNeedsGeocoding(false)
        } else {
          console.error("Geocoding failed:", status)
          setIsInitialized(true)
          setNeedsGeocoding(false)
        }
      })
    },
    [map, marker],
  )

  // Extract address components from Google Places result
  const extractAddressComponents = useCallback((addressComponents: google.maps.GeocoderAddressComponent[]) => {
    let address = ""
    let city = ""
    let state = ""
    let zipCode = ""
    let country = ""

    addressComponents.forEach((component) => {
      const types = component.types

      // Street number and route for address
      if (types.includes("street_number")) {
        address = component.long_name + " "
      }
      if (types.includes("route")) {
        address += component.long_name
      }

      // City - try multiple types
      if (types.includes("locality")) {
        city = component.long_name
      } else if (types.includes("administrative_area_level_2") && !city) {
        city = component.long_name
      } else if (types.includes("sublocality_level_1") && !city) {
        city = component.long_name
      }

      // State/Province
      if (types.includes("administrative_area_level_1")) {
        state = component.long_name
      }

      // ZIP/Postal Code
      if (types.includes("postal_code")) {
        zipCode = component.long_name
      } else if (types.includes("postal_code_prefix") && !zipCode) {
        zipCode = component.long_name
      }

      // Country
      if (types.includes("country")) {
        country = component.long_name
      }
    })

    return { address: address.trim(), city, state, zipCode, country }
  }, [])

  // Reverse geocode coordinates to get address
  const reverseGeocode = useCallback(
    (lat: number, lng: number) => {
      if (!window.google) return

      const geocoder = new google.maps.Geocoder()
      const latlng = { lat, lng }

      geocoder.geocode({ location: latlng }, (results:any, status:any) => {
        if (status === "OK" && results && results[0]) {
          const result = results[0]
          const addressComponents = result.address_components

          const fullAddress = result.formatted_address
          const extractedComponents = extractAddressComponents(addressComponents)

          const locationData: LocationData = {
            address: fullAddress,
            city: extractedComponents.city,
            state: extractedComponents.state,
            zipCode: extractedComponents.zipCode,
            country: extractedComponents.country,
            lat,
            lng,
          }

          console.log("Reverse geocoded location:", locationData)
          setSelectedLocation(locationData)
          onLocationSelect(locationData)
        } else {
          console.error("Reverse geocoding failed:", status)
        }
      })
    },
    [onLocationSelect, extractAddressComponents],
  )

  // Handle place selection from autocomplete
  const handlePlaceSelect = useCallback(() => {
    if (!autocomplete) return

    const place = autocomplete.getPlace()
    console.log("Place selected:", place)

    if (place.geometry && place.geometry.location) {
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()

      // Update map and marker position
      if (map && marker) {
        const newPosition = { lat, lng }
        map.setCenter(newPosition)
        map.setZoom(15)
        marker.setPosition(newPosition)
      }

      // Extract address information
      if (place.address_components) {
        const fullAddress = place.formatted_address || place.name || ""
        const extractedComponents = extractAddressComponents(place.address_components)

        const locationData: LocationData = {
          address: fullAddress,
          city: extractedComponents.city,
          state: extractedComponents.state,
          zipCode: extractedComponents.zipCode,
          country: extractedComponents.country,
          lat,
          lng,
        }

        console.log("Autocomplete location data:", locationData)
        setSelectedLocation(locationData)
        onLocationSelect(locationData)
      } else {
        reverseGeocode(lat, lng)
      }
    } else {
      console.error("No geometry found for selected place")
    }
  }, [autocomplete, map, marker, onLocationSelect, extractAddressComponents, reverseGeocode])

  // Update the map initialization effect
  useEffect(() => {
    if (isLoaded && mapRef.current && !map && isInitialized) {
      const googleMap = new google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: initialAddress ? 15 : 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      // Create draggable marker
      const mapMarker = new google.maps.Marker({
        position: mapCenter,
        map: googleMap,
        draggable: true,
        title: "Drag me to select location",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#023e8a",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
      })

      // Handle marker drag
      mapMarker.addListener("dragend", () => {
        const position = mapMarker.getPosition()
        if (position) {
          const lat = position.lat()
          const lng = position.lng()
          console.log("Marker dragged to:", lat, lng)
          reverseGeocode(lat, lng)
        }
      })

      // Handle map click
      googleMap.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat()
          const lng = event.latLng.lng()
          console.log("Map clicked at:", lat, lng)

          mapMarker.setPosition({ lat, lng })
          reverseGeocode(lat, lng)
        }
      })

      setMap(googleMap)
      setMarker(mapMarker)

      // Set initial location data if we have it
      if (initialAddress && initialAddress.address) {
        const locationData: LocationData = {
          address: initialAddress.address,
          city: initialAddress.city,
          state: initialAddress.state,
          zipCode: initialAddress.zipCode,
          country: initialAddress.country,
          lat: mapCenter.lat,
          lng: mapCenter.lng,
        }
        setSelectedLocation(locationData)
      } else {
        // Get initial location data for default coordinates
        reverseGeocode(mapCenter.lat, mapCenter.lng)
      }
    }
  }, [isLoaded, map, mapCenter, initialAddress, isInitialized, reverseGeocode])

  // Initialize autocomplete
  useEffect(() => {
    if (isLoaded && searchInputRef.current && !autocomplete && map) {
      const searchAutocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
        types: ["address"],
        fields: ["address_components", "formatted_address", "geometry", "name"],
      })

      searchAutocomplete.bindTo("bounds", map)
      setAutocomplete(searchAutocomplete)
    }
  }, [isLoaded, autocomplete, map])

  // Add place_changed listener
  useEffect(() => {
    if (autocomplete) {
      const listener = autocomplete.addListener("place_changed", handlePlaceSelect)

      return () => {
        if (window.google && window.google.maps && window.google.maps.event) {
          google.maps.event.removeListener(listener)
        }
      }
    }
  }, [autocomplete, handlePlaceSelect])

  // Handle geocoding when needed
  useEffect(() => {
    if (isLoaded && needsGeocoding && initialAddress && initialAddress.address) {
      console.log("Geocoding initial address:", initialAddress.address)
      geocodeAddress(initialAddress.address)
    }
  }, [isLoaded, needsGeocoding, initialAddress, geocodeAddress])

  // Remove the old initial address handling effect and replace with this simpler one
  useEffect(() => {
    if (initialAddress && initialAddress.address && selectedLocation === null) {
      console.log("Setting initial address data:", initialAddress)

      const locationData: LocationData = {
        address: initialAddress.address,
        city: initialAddress.city,
        state: initialAddress.state,
        zipCode: initialAddress.zipCode,
        country: initialAddress.country,
        lat: mapCenter.lat,
        lng: mapCenter.lng,
      }
      setSelectedLocation(locationData)
    }
  }, [initialAddress, selectedLocation, mapCenter])

  if (isLoading) {
    return (
      <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search for an address..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border border-gray-300 shadow-sm">
        <div ref={mapRef} style={{ height }} className="w-full" />

        {/* Instructions Overlay */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-700">
              <p className="font-medium mb-1">Select Location:</p>
              <p>• Search above or</p>
              <p>• Click on map or</p>
              <p>• Drag the blue marker</p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-1">Selected Location:</p>
              <p className="text-sm text-blue-800 mb-2">{selectedLocation.address}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                <p>
                  <span className="font-medium">City:</span> {selectedLocation.city || "N/A"}
                </p>
                <p>
                  <span className="font-medium">State:</span> {selectedLocation.state || "N/A"}
                </p>
                <p>
                  <span className="font-medium">ZIP:</span> {selectedLocation.zipCode || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Country:</span> {selectedLocation.country || "N/A"}
                </p>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
