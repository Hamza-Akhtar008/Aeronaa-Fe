"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"

interface PropertyMapProps {
  address: string
  title: string
}

const loadGoogleMapsAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve()
      return
    }

    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkLoaded = () => {
        if (window.google && window.google.maps) {
          resolve()
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBCit9qsp_C6ePD126N1h6avxnQ7EH9xGU&libraries=places`
    script.async = true
    script.defer = true

    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Google Maps API"))

    document.head.appendChild(script)
  })
}

export default function PropertyMap({ address, title }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGoogleMapsAPI()
      .then(() => {
        setIsLoaded(true)
        setError(null)
      })
      .catch((err) => {
        setError("Failed to load Google Maps")
        console.error("Google Maps loading error:", err)
      })
  }, [])

  useEffect(() => {
    if (!mapRef.current || !isLoaded || !window.google) return
    if (!address) return

    const geocoder = new window.google.maps.Geocoder()

    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location

        const map = new window.google.maps.Map(mapRef.current!, {
          center: location,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        })

        const marker = new window.google.maps.Marker({
          map,
          position: location,
          title,
          animation: window.google.maps.Animation.DROP,
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <strong style="font-size: 14px;">${title}</strong><br/>
              <span style="font-size: 12px; color: #666;">${address}</span>
            </div>
          `,
        })

        marker.addListener("click", () => {
          infoWindow.open(map, marker)
        })
      } else {
        console.error("Geocode failed:", status)
        setError("Could not locate address")
      }
    })
  }, [isLoaded, address, title])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>Property Location</span>
      </div>
      <div
        ref={mapRef}
        className="h-64 w-full rounded-lg border bg-muted/30 overflow-hidden"
        style={{ minHeight: "256px" }}
      >
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-destructive">{error}</div>
          </div>
        ) : !isLoaded ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-muted-foreground">Loading map...</div>
          </div>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Interactive Google Map showing property location for: <strong>{address}</strong>
      </p>
    </div>
  )
}
