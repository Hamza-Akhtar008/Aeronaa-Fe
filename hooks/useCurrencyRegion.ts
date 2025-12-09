"use client"

import { useEffect, useState } from "react"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"
import { getCountryByCurrency } from "@/lib/utils/getcountry"
import { CURRENCIES } from "@/lib/utils/currency"

// ✅ Helper to reverse geocode user's location
async function getCountryFromCoords(lat: number, lng: number): Promise<string | null> {
  const apiKey = "AIzaSyBCit9qsp_C6ePD126N1h6avxnQ7EH9xGU" // Replace with your actual API key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    const result = data.results.find((r: any) => r.types.includes("country")) || data.results[0]
    const countryComponent = result.address_components.find((c: any) =>
      c.types.includes("country")
    )
    return countryComponent?.long_name || null
  } catch (err) {
    console.error("Reverse geocoding failed:", err)
    return null
  }
}

// ✅ Main Hook
export function useCurrencyRegion() {
  const [regionCountry, setRegionCountry] = useState<string | null>(null) // For flag (fixed)
  const [currencyCountry, setCurrencyCountry] = useState<string | null>(null) // For currency (changeable)
  const [currency, setCurrency] = useState<{ code: string; name: string; country: string } | null>(null)
  const [countryData, setCountryData] = useState<{ name: string; code: string } | null>(null)

  // Build full currency list
  const currencyList = Object.entries(CURRENCIES).map(([code, { name, country }]) => ({
    code: String(code),
    name: String(name),
    country: String(country),
  }))

  // ✅ On mount: detect and initialize country + currency
  useEffect(() => {
    const init = async () => {
      let region = sessionStorage.getItem("usercountry") || localStorage.getItem("usercountry")
      let currencyBase = sessionStorage.getItem("userCountry") || localStorage.getItem("userCountry")

      // If not available, fetch from geolocation
      if (!region || !currencyBase) {
        try {
          await new Promise<void>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              async (pos) => {
                const detectedCountry = await getCountryFromCoords(
                  pos.coords.latitude,
                  pos.coords.longitude
                )
                if (detectedCountry) {
                  // Set region (fixed)
                  if (!region) {
                    sessionStorage.setItem("usercountry", detectedCountry)
                    localStorage.setItem("usercountry", detectedCountry)
                    region = detectedCountry
                  }

                  // Set userCountry (mutable)
                  sessionStorage.setItem("userCountry", detectedCountry)
                  localStorage.setItem("userCountry", detectedCountry)
                  currencyBase = detectedCountry
                }
                resolve()
              },
              (err) => {
                console.error("Geolocation error:", err)
                reject(err)
              }
            )
          })
        } catch (err) {
          console.warn("Could not auto-detect location.")
        }
      }

      // Set state
      if (region) setRegionCountry(region)
      if (currencyBase) {
        setCurrencyCountry(currencyBase)
        const detectedCurrency = getCurrencyByLocation(currencyBase)
        const found = currencyList.find(c => c.code === detectedCurrency)
        if (found) setCurrency(found)
      }
    }

    init()
  }, [])

  // ✅ Derive country code (for flag) from selected currency
  useEffect(() => {
    if (currencyCountry) {
      (async () => {
        const country = await getCountryByCurrency(currencyCountry)
        if (country) {
          setCountryData({ name: country.countryName, code: country.countryCode })
        }
      })()
    }
  }, [currencyCountry])

  // ✅ Function to manually change currency
  const updateCurrency = (country: string) => {
    sessionStorage.setItem("userCountry", country)
    localStorage.setItem("userCountry", country)
    setCurrencyCountry(country)

    const detectedCurrency = getCurrencyByLocation(country)
    const found = currencyList.find(c => c.code === detectedCurrency)
    if (found) setCurrency(found)
  }

  return {
    regionCountry,     // Static flag country (usercountry)
    currencyCountry,   // Mutable currency base (userCountry)
    currency,          // Currency details object
    countryData,       // For flag (code + name)
    updateCurrency,    // Function to manually change currency
    currencyList,      // Full list for selectors
  }
}
