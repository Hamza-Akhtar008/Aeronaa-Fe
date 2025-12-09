"use client"

import axios from 'axios';

// Define types for our API
interface FlightOffer {
  id: string;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
      operating?: {
        carrierCode: string;
      };
      duration: string;
    }>;
  }>;
  price: {
    currency: string;
    total: string;
    base: string;
    fees: Array<{
      amount: string;
      type: string;
    }>;
    grandTotal: string;
  };
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
      base: string;
    };
    fareDetailsBySegment: Array<{
      segmentId?: string;
      cabin: string;
      fareBasis?: string;
      class?: string;
      includedCheckedBags?: {
        quantity: number;
      };
    }>;
  }>;
}

// Types for the API response
interface FlightAPISegment {
  id?: string;
  departureAirport?: {
    code: string;
    terminal?: string;
  };
  arrivalAirport?: {
    code: string;
    terminal?: string;
  };
  departure?: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival?: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  marketingCarrier?: {
    code: string;
    flightNumber: string;
  };
  operatingCarrier?: {
    code: string;
  };
  aircraft?: {
    code: string;
  };
  carrierCode?: string;
  number?: string;
  duration?: string;
  departureDateTime?: string;
  arrivalDateTime?: string;
  cabin?: string;
  fareBasis?: string;
  bookingClass?: string;
  includedBaggage?: {
    quantity: number;
  };
}

interface FlightAPIItinerary {
  itineraryId?: string;
  id?: string;
  duration?: string;
  legs?: FlightAPISegment[];
  segments?: FlightAPISegment[];
  priceBreakdown?: {
    total?: {
      currencyCode: string;
      units: number;
    };
    base?: {
      currencyCode: string;
      units: number;
    };
  };
  price?: {
    currency: string;
    total: string;
    base: string;
  };
  fareType?: string;
  itineraries?: FlightAPIItinerary[];
}

interface FlightAPIGroup {
  itineraries: FlightAPIItinerary[];
  priceBreakdown?: {
    total?: {
      currencyCode: string;
      units: number;
    };
    base?: {
      currencyCode: string;
      units: number;
    };
  };
}

// Helper function to format dates to YYYY-MM-DD
function formatDateToYYYYMMDD(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Flight Offers Search using RapidAPI booking-com15
export async function searchFlights(
  originId: string,
  destinationId: string,
  departureDate: string,
  returnDate: string,
  adults: number = 1,
  children: number = 0,
  stops: string = 'none',
  cabinClass: string = 'ECONOMY',
  currency: string = 'USD'
) {  try {
    // Check if we have stored results in sessionStorage
    const storedResults = sessionStorage.getItem('flightSearchResults');
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);
      // Clear the session storage to avoid using the same results for different searches
      sessionStorage.removeItem('flightSearchResults');
      // Agoda: data is an array or object with bundles/other keys
      if (parsedResults.data && Array.isArray(parsedResults.data)) {
        return parsedResults.data;
      } else if (parsedResults.data && parsedResults.data.bundles) {
        // Agoda: data.bundles is the array of flight results
        return parsedResults.data.bundles;
      } else if (parsedResults.data && parsedResults.data.flights) {
        return parsedResults.data.flights;
      } else if (parsedResults.data && parsedResults.data.flightOffers) {
        return parsedResults.data.flightOffers;
      } else if (Array.isArray(parsedResults)) {
        return parsedResults;
      }
      return [];
    }

    // Format dates to YYYY-MM-DD as required by API
    const formattedDepartDate = formatDateToYYYYMMDD(departureDate);
    const formattedReturnDate = returnDate ? formatDateToYYYYMMDD(returnDate) : undefined;
    
    console.log('Making flight search with params:', {
      fromId: originId.includes('.AIRPORT') ? originId : `${originId}.AIRPORT`,
      toId: destinationId.includes('.AIRPORT') ? destinationId : `${destinationId}.AIRPORT`,
      departDate: formattedDepartDate,
      returnDate: formattedReturnDate,
    });
    
    // If no stored results, make the API call
    const response = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights', {
      params: {
        fromId: originId.includes('.AIRPORT') ? originId : `${originId}.AIRPORT`,
        toId: destinationId.includes('.AIRPORT') ? destinationId : `${destinationId}.AIRPORT`,
        departDate: formattedDepartDate,
        ...(formattedReturnDate && { returnDate: formattedReturnDate }),
        adults: adults.toString(),
        children: children ? children.toString() : '0',
        stops: stops,
        pageNo: '1',
        sort: 'BEST',
        cabinClass: cabinClass,
        currency_code: currency
      },
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
        'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
      }
    });
    
    console.log('Flight search API response:', response.data);      // Check if we received a valid response
    if (response.data) {
      // Log the full response structure for debugging
      console.log('API response structure:', JSON.stringify(response.data, null, 2));
      
      // Function to normalize flight offer structure
      const normalizeFlightOffers = (offers: any[]): FlightOffer[] => {
        return offers.map(offer => {
          // Ensure the offer has a valid structure with required fields
          if (!offer.id) offer.id = `flight-${Math.random().toString(36).substring(2, 9)}`;
          
          // Ensure itineraries exists and has segments
          if (!offer.itineraries || !Array.isArray(offer.itineraries) || offer.itineraries.length === 0) {
            offer.itineraries = [{ 
              duration: "PT0H0M", 
              segments: [] 
            }];
          }
          
          // Ensure each itinerary has segments
          offer.itineraries.forEach((itinerary: any) => {
            if (!itinerary.segments || !Array.isArray(itinerary.segments)) {
              itinerary.segments = [];
            }
            
            // Ensure duration exists
            if (!itinerary.duration) itinerary.duration = "PT0H0M";
          });
          
          // Ensure price info exists
          if (!offer.price) {
            offer.price = { 
              currency: "USD", 
              total: "0.00",
              base: "0.00",
              fees: [],
              grandTotal: "0.00"
            };
          }
          
          // Ensure travelerPricings exists
          if (!offer.travelerPricings || !Array.isArray(offer.travelerPricings)) {
            offer.travelerPricings = [{
              travelerId: "1",
              fareOption: "STANDARD",
              travelerType: "ADULT",
              price: { currency: "USD", total: "0.00", base: "0.00" },
              fareDetailsBySegment: []
            }];
          }
          
          return offer;
        });
      };
        // Handle different response formats
      if (response.data.status === true && response.data.data) {
        // If we have aggregation data, try to extract flight information from it
        if (response.data.data.aggregation) {
          console.log('Found aggregation data in response');
          
          // Extract flights from the aggregation data structure
          const flights = (response.data.data.itineraryGroups || response.data.data.flights || []) as (FlightAPIGroup | FlightAPIItinerary)[];
          console.log(`Found ${flights.length} flights in aggregation data`);
          
          if (flights.length > 0) {
            // Transform flight data to match our FlightOffer interface
            const transformedOffers = flights.flatMap((group: FlightAPIGroup | FlightAPIItinerary) => {
              // Handle both direct flight entries and itinerary groups
              const itineraries = (group as FlightAPIGroup).itineraries || [group as FlightAPIItinerary];
              
              return itineraries.map((itinerary: FlightAPIItinerary) => {
                const legs = itinerary.legs || itinerary.segments || [];
                const priceInfo = itinerary.priceBreakdown || itinerary.price || (group as FlightAPIGroup).priceBreakdown || {};
                
                return {
                  id: itinerary.itineraryId || itinerary.id || `flight-${Math.random().toString(36).substring(2, 9)}`,
                  itineraries: [{
                    duration: itinerary.duration || legs[0]?.duration || "PT0H0M",
                    segments: legs.map((segment: FlightAPISegment) => ({
                      departure: {
                        iataCode: segment.departureAirport?.code || segment.departure?.iataCode || "UNK",
                        terminal: segment.departureAirport?.terminal || segment.departure?.terminal,
                        at: segment.departureDateTime || segment.departure?.at || new Date().toISOString()
                      },
                      arrival: {
                        iataCode: segment.arrivalAirport?.code || segment.arrival?.iataCode || "UNK",
                        terminal: segment.arrivalAirport?.terminal || segment.arrival?.terminal,
                        at: segment.arrivalDateTime || segment.arrival?.at || new Date().toISOString()
                      },
                      carrierCode: segment.marketingCarrier?.code || segment.carrierCode || "UNK",
                      number: segment.marketingCarrier?.flightNumber || segment.number || "0000",
                      aircraft: {
                        code: segment.aircraft?.code || "UNK"
                      },
                      operating: segment.operatingCarrier ? {
                        carrierCode: segment.operatingCarrier.code
                      } : undefined,
                      duration: segment.duration || "PT0H0M"
                    }))
                  }],
                  price: {
                    currency: (typeof priceInfo.total === 'object' && priceInfo.total?.currencyCode) || ('currency' in priceInfo ? priceInfo.currency : "USD"),
                    total: (typeof priceInfo.total === 'object' ? priceInfo.total?.units : priceInfo.total || "0").toString(),
                    base: (typeof priceInfo.base === 'object' ? priceInfo.base?.units : priceInfo.base || "0").toString(),
                    fees: [],
                    grandTotal: (typeof priceInfo.total === 'object' ? priceInfo.total?.units : priceInfo.total || "0").toString()
                  },
                  travelerPricings: [{
                    travelerId: "1",
                    fareOption: itinerary.fareType || "STANDARD",
                    travelerType: "ADULT",
                    price: {
                      currency: (typeof priceInfo.total === 'object' ? priceInfo.total?.currencyCode : undefined) || ('currency' in priceInfo ? priceInfo.currency : "USD"),
                      total: (typeof priceInfo.total === 'object' ? priceInfo.total?.units : priceInfo.total || "0").toString(),
                      base: (typeof priceInfo.base === 'object' ? priceInfo.base?.units : priceInfo.base || "0").toString()
                    },
                    fareDetailsBySegment: legs.map((segment: FlightAPISegment) => ({
                      segmentId: segment.id || undefined,
                      cabin: segment.cabin || "ECONOMY",
                      fareBasis: segment.fareBasis || undefined,
                      class: segment.bookingClass || undefined,
                      includedCheckedBags: segment.includedBaggage?.quantity 
                        ? { quantity: segment.includedBaggage.quantity }
                        : undefined
                    }))
                  }]
                };
              });
            });
            
            console.log(`Transformed ${transformedOffers.length} flight offers`);
            return transformedOffers;
          }
        }
      } else if (response.data.data && response.data.data.error) {
        console.error('API returned error:', response.data.data.error);
        throw new Error(`API Error: ${response.data.data.error.code}`);
      } else if (Array.isArray(response.data)) {
        console.log(`Found ${response.data.length} items in direct response array`);
        return normalizeFlightOffers(response.data);
      }
    }
    
    console.warn('No flight data found in API response');
    return [];
  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
}

// Search for airports
export async function searchAirports(query: string) {
  try {
    const response = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination', {
      params: { query },
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
        'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
      }
    });
    
    // Filter for airport type locations
    const airports = response.data.data
      .filter((location: any) => location.type === 'AIRPORT')
      .map((airport: any) => ({
        id: airport.id,
        name: airport.name,
        iata_code: airport.id.split('.')[0], // Extract IATA code from id (e.g., "DXB.AIRPORT" -> "DXB")
        city: airport.city || 'Unknown City',
        country: airport.country || 'Unknown Country'
      }));
      
    return airports || [];
  } catch (error) {
    console.error('Error searching airports:', error);
    return [];
  }
}
