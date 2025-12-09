"use client"

// Environment variables helper
// This file provides type-safe access to environment variables

/**
 * Environment variables used in the app
 * Available in both client and server components
 */
export const env = {
  /**
   * Unsplash API key
   */
  UNSPLASH_ACCESS_KEY: 
    // In the browser, use the NEXT_PUBLIC_ variable
    typeof window !== "undefined" 
      ? process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || ""
      // In server components, use the non-NEXT_PUBLIC_ variable if available
      : (process.env.UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || ""),
    /**
   * Amadeus API credentials
   */
  AMADEUS_API_KEY: 
    typeof window !== "undefined" 
      ? process.env.NEXT_PUBLIC_AMADEUS_API_KEY || ""
      : (process.env.AMADEUS_API_KEY || process.env.NEXT_PUBLIC_AMADEUS_API_KEY || ""),
  AMADEUS_API_SECRET: 
    typeof window !== "undefined" 
      ? process.env.NEXT_PUBLIC_AMADEUS_API_SECRET || ""
      : (process.env.AMADEUS_API_SECRET || process.env.NEXT_PUBLIC_AMADEUS_API_SECRET || ""),
}
