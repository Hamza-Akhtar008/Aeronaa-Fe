"use client"

import Amadeus from 'amadeus';
import { env } from './env';

// Initialize a single instance of Amadeus client
let amadeusInstance: Amadeus | null = null;

/**
 * Gets an instance of the Amadeus client with proper error handling
 * @returns Amadeus client instance
 * @throws Error if initialization fails
 */
function getAmadeusClient(): Amadeus {
  // Return existing instance if available
  if (amadeusInstance) {
    return amadeusInstance;
  }

  // Check if we're in the browser
  if (typeof window === 'undefined') {
    throw new Error('Amadeus client can only be initialized in the browser');
  }

  // Check if credentials are available
  if (!env.AMADEUS_API_KEY || !env.AMADEUS_API_SECRET) {
    throw new Error('Amadeus API credentials are missing. Please check your environment variables.');
  }

  try {
    // Log initialization attempt
    console.log('Initializing Amadeus client with credentials:', {
      clientId: '***' + env.AMADEUS_API_KEY.slice(-4),
      hasSecret: !!env.AMADEUS_API_SECRET
    });

    amadeusInstance = new Amadeus({
      clientId: env.AMADEUS_API_KEY,
      clientSecret: env.AMADEUS_API_SECRET,
    });

    // Verify and log the structure of the client
    console.log('Amadeus client structure:', {
      hasClient: !!amadeusInstance,
      hasShopping: !!amadeusInstance?.shopping,
      hasHotelOffers: !!amadeusInstance?.shopping?.hotelOffers,
      hasReferenceData: !!amadeusInstance?.referenceData
    });

    // Verify that required properties exist
    if (!amadeusInstance?.shopping?.hotelOffers?.get) {
      throw new Error('Amadeus client initialization failed - missing hotelOffers.get method');
    }

    return amadeusInstance;
  } catch (error) {
    amadeusInstance = null; // Reset instance on error
    throw error;
  }
}

// --- HOTEL SEARCH: Use REST API, not SDK ---

/**
 * Get Amadeus OAuth2 access token
 */
export async function getAmadeusAccessToken() {
  const res = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: env.AMADEUS_API_KEY,
      client_secret: env.AMADEUS_API_SECRET,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Failed to get Amadeus access token');
  return data.access_token;
}

/**
 * Search for hotel offers by city (fetch hotel IDs first, then offers)
 */
export async function searchHotels(
  cityCode: string,
  checkInDate: string,
  checkOutDate: string,
  adults: number = 1,
  radius: number = 5,
  ratings: string[] = [],
  priceRange?: string
) {
  try {
    console.log(`Searching hotels for city: ${cityCode}`);
    const token = await getAmadeusAccessToken();

    // 1. Get hotel IDs for the city
    const hotelsRes = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const hotelsData = await hotelsRes.json();
    if (!hotelsData.data || hotelsData.data.length === 0) throw new Error('No hotels found for city');
    // Get up to 20 hotel IDs (API may have a limit)
    const hotelIds = hotelsData.data.map((h: any) => h.hotelId).slice(0, 20).join(',');

    // 2. Get hotel offers for those hotel IDs
    let url = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIds}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}`;
    if (ratings.length > 0) url += `&ratings=${ratings.join(',')}`;
    if (priceRange) url += `&priceRange=${priceRange}`;
    const offersRes = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const offersData = await offersRes.json();
    if (!offersData.data) throw new Error(offersData.errors ? JSON.stringify(offersData.errors) : 'No hotel data returned');
    console.log(`Found ${offersData.data.length} hotels for ${cityCode}`);
    return offersData.data;
  } catch (error) {
    console.error('Error searching hotels:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return [];
  }
}

// Flight Offers Search
export async function searchFlights(
  originLocationCode: string,
  destinationLocationCode: string,
  departureDate: string,
  returnDate: string,
  adults: number = 1,
  children: number = 0,
  infants: number = 0,
  travelClass: string = 'ECONOMY',
  maxResults: number = 10
) {
  try {
    const amadeus = getAmadeusClient();
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      travelClass,
      max: maxResults,
      currencyCode: 'USD'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
}

// Get hotel details by hotel ID
export async function getHotelDetails(hotelId: string) {
  try {
    const amadeus = getAmadeusClient();
    const response = await amadeus.referenceData.locations.hotels.byHotel.get({
      hotelId
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting hotel details:', error);
    return null;
  }
}

// Get points of interest for a city
export async function getPointsOfInterest(
  latitude: number, 
  longitude: number, 
  radius: number = 5
) {
  try {
    const amadeus = getAmadeusClient();
    const response = await amadeus.referenceData.locations.pointsOfInterest.get({
      latitude,
      longitude,
      radius
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting points of interest:', error);
    return [];
  }
}

// Get city information
export async function getCityInfo(cityCode: string) {
  try {
    const amadeus = getAmadeusClient();
    const response = await amadeus.referenceData.locations.get({
      keyword: cityCode,
      subType: 'CITY'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting city info:', error);
    return null;
  }
}

// Flight inspiration search
export async function getFlightInspirations(origin: string) {
  try {
    const amadeus = getAmadeusClient();
    const response = await amadeus.shopping.flightDestinations.get({
      origin
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting flight inspirations:', error);
    return [];
  }
}
