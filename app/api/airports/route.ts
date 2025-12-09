import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    // Get the search query from the URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase() || '';

    console.log('Received request for airport search with query:', query);

    // Read the airports data
    const filePath = path.join(process.cwd(), 'public', 'Airport.json');
    
    // Validate file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error('Airport data file not found:', filePath);
      return NextResponse.json(
        { error: 'Airport data not available' },
        { status: 404 }
      );
    }

    const jsonData = await fs.readFile(filePath, 'utf8');
    
    // Validate JSON data
    let airports;
    try {
      airports = JSON.parse(jsonData);
      if (!Array.isArray(airports)) {
        throw new Error('Invalid airport data format');
      }
    } catch (error) {
      console.error('Failed to parse airport data:', error);
      return NextResponse.json(
        { error: 'Invalid airport data format' },
        { status: 500 }
      );
    }

    if (!query || query.length < 1) {
      console.log('Query too short, returning empty results');
      return NextResponse.json([]);
    }

    const searchTerms = query.split(/\s+/).filter(Boolean);
    const allowedTypes = ["small_airport", "medium_airport", "large_airport"];

    console.log('Search query:', query);
    console.log('Search terms:', searchTerms);

    const filteredAirports = airports
      .filter((airport: any) => {
        // Skip invalid or undefined airports
        if (!airport || typeof airport !== 'object') return false;
        
        // Only include allowed airport types
        if (!allowedTypes.includes(airport.type)) return false;

        const airportName = String(airport.name || "").toLowerCase();
        const airportCity = String(airport.municipality || "").toLowerCase();
        const airportCountry = String(airport.iso_country || "").toLowerCase();
        const airportCode = String(airport.iata_code || airport.local_code || airport.ident || "").toLowerCase();

        // Match against all search terms
        return searchTerms.some(term =>
          airportName.includes(term) ||
          airportCity.includes(term) ||
          airportCountry.includes(term) ||
          airportCode.includes(term)
        );
      })
      .map((airport: any) => ({
        name: airport.name || "Unknown",
        municipality: airport.municipality || "Unknown",
        iso_country: airport.iso_country || "N/A",
        iata_code: airport.iata_code || airport.local_code || airport.ident || "N/A",
        type: airport.type,
        value: airport.iata_code || airport.local_code || airport.ident || "",
        label: `${airport.name || "Unknown"} (${airport.iata_code || airport.local_code || airport.ident || "N/A"}) - ${airport.municipality || "Unknown"}, ${airport.iso_country || "N/A"}`,
      }))
      .slice(0, 15); // Limit results to prevent overwhelming response

    console.log(`Found ${filteredAirports.length} matching airports`);
    
    if (filteredAirports.length === 0) {
      console.log('No matching airports found for query:', query);
    } else {
      console.log('First match:', filteredAirports[0]);
    }

    return NextResponse.json(filteredAirports);
  } catch (error) {
    console.error('Error in airports API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch airports' },
      { status: 500 }
    );
  }
}
