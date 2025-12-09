"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Filter, MapPin, Bed, Bath, Square, Phone, Mail, Grid3X3, List, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import Filters from "@/components/home/Filters"
import { GetPropertyall, GetPropertySearch } from "@/lib/property_api"
import type { Property } from "@/types/property"
import { useRouter, useSearchParams } from "next/navigation"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"
import { formatPrice } from "@/lib/utils/currency"

type SortOption = "best-match" | "price-low" | "price-high" | "newest" | "bedrooms" | "area"
type ViewMode = "grid" | "list"

interface FiltersState {
  listingType: string
  propertyType: string
  priceRange: [number, number]
  bedrooms: string
  bathrooms: string
  furnishingStatus: string
  condition: string
  amenities: string[]
  city: string
  nearByLands: string
}

export default function PropertySearch() {
    const searchParams = useSearchParams()
  const location = searchParams?.get("location") || ""
  const propertyType = searchParams?.get("propertyType") || ""
    const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("best-match")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
   const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 });
  
    // Detect country and currency from localStorage/sessionStorage
    useEffect(() => {
      let country = localStorage.getItem("userCountry") || localStorage.getItem("usercountry") || sessionStorage.getItem("userCountry") || sessionStorage.getItem("usercountry");
      if (country) {
        const currency = getCurrencyByLocation(country);
        setSelectedCurrency(currency);
      } else {
        setSelectedCurrency("USD");
      }
    }, []);
  
    // Fetch exchange rates for selected currency
    useEffect(() => {
      if (selectedCurrency === "USD") {
        setExchangeRates({ USD: 1 });
        return;
      }
      const fetchRates = async () => {
        try {
          const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
          const data = await response.json();
          setExchangeRates({ ...data.rates, USD: 1 });
        } catch (error) {
          setExchangeRates({ USD: 1 });
        }
      };
      fetchRates();
    }, [selectedCurrency]);
  
  

  useEffect(() => {
    const fetchallproperties = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log(location);
        const response = await GetPropertySearch(location,propertyType);
        console.log("response : ",response);
        setProperties(response)
      } catch (err) {
        setError("Failed to load properties. Please try again.")
        console.error("Error fetching properties:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchallproperties()
  }, [])

  const dynamicFilterData = useMemo(() => {
    if (properties.length === 0) {
      return {
        cities: [],
        nearByAreas: [],
        propertyTypes: [],
        furnishingStatuses: [],
        conditions: [],
        allAmenities: [],
        bedroomOptions: [],
        bathroomOptions: [],
        priceRange: { min: 0, max: 1000000 },
      }
    }

    const cities = [...new Set(properties.map((p) => p.city))].sort()
    const nearByAreas = [...new Set(properties.map((p) => p.nearByLands))].sort()
    const propertyTypes = [...new Set(properties.map((p) => p.propertyType))].sort()
    const furnishingStatuses = [...new Set(properties.map((p) => p.furnishingStatus))].sort()
    const conditions = [...new Set(properties.map((p) => p.condition))].sort()
    const allAmenities = [...new Set(properties.flatMap((p) => p.amenities))].sort()
    const bedroomOptions = [...new Set(properties.map((p) => p.bedrooms))].sort((a, b) => a - b)
    const bathroomOptions = [...new Set(properties.map((p) => p.bathrooms))].sort((a, b) => a - b)
    const priceRange = {
      min: Math.min(...properties.map((p) => p.price)),
      max: Math.max(...properties.map((p) => p.price)),
    }

    return {
      cities,
      nearByAreas,
      propertyTypes,
      furnishingStatuses,
      conditions,
      allAmenities,
      bedroomOptions,
      bathroomOptions,
      priceRange,
    }
  }, [properties])

  const [filters, setFilters] = useState<FiltersState>({
    listingType: "all",
    propertyType: "all",
    priceRange: [0, 1000000],
    bedrooms: "all",
    bathrooms: "all",
    furnishingStatus: "all",
    condition: "all",
    amenities: [],
    city: "all",
    nearByLands: "all",
  })

  useEffect(() => {
    if (dynamicFilterData.priceRange.min !== 0 || dynamicFilterData.priceRange.max !== 1000000) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [dynamicFilterData.priceRange.min, dynamicFilterData.priceRange.max],
      }))
    }
  }, [dynamicFilterData])

  const filteredAndSortedProperties = useMemo(() => {
    const filtered = properties.filter((property) => {
      // Search query filter
      if (
        searchQuery &&
        !property.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !property.address.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !property.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !property.nearByLands.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Filters
      if (filters.listingType !== "all" && property.listingType !== filters.listingType) return false
      if (filters.propertyType !== "all" && property.propertyType !== filters.propertyType) return false
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) return false
      if (filters.bedrooms !== "all" && property.bedrooms.toString() !== filters.bedrooms) return false
      if (filters.bathrooms !== "all" && property.bathrooms.toString() !== filters.bathrooms) return false
      if (filters.furnishingStatus !== "all" && property.furnishingStatus !== filters.furnishingStatus) return false
      if (filters.condition !== "all" && property.condition !== filters.condition) return false
      if (filters.city !== "all" && property.city !== filters.city) return false
      if (filters.nearByLands !== "all" && property.nearByLands !== filters.nearByLands) return false

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((amenity) => property.amenities.includes(amenity))
        if (!hasAllAmenities) return false
      }

      return true
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "newest":
          return b.yearBuilt - a.yearBuilt
        case "bedrooms":
          return b.bedrooms - a.bedrooms
        case "area":
          return b.builtUpArea - a.builtUpArea
        case "best-match":
        default:
          return b.yearBuilt - a.yearBuilt
      }
    })

    return filtered
  }, [searchQuery, sortBy, filters, properties])

  const PropertySkeleton = () => (
    <Card className="group">
      <div className="relative">
        <Skeleton className="w-full h-48 rounded-t-lg" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const FilterSidebar = ({ isMobile = false }) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3 text-foreground">Your budget</h3>
        <div className="px-2">
          <Slider
            value={[filters.priceRange[1]]}
            onValueChange={(value) => {
              setFilters({
                ...filters,
                priceRange: [dynamicFilterData.priceRange.min, value[0]],
              })
            }}
            max={dynamicFilterData.priceRange.max}
            min={dynamicFilterData.priceRange.min}
            className="mb-4"
            step={1000}
          />

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              <span className="text-sm mr-1">{selectedCurrency}</span>
             
              <Input
                type="number"
                value={(dynamicFilterData.priceRange.min) * (exchangeRates[selectedCurrency] || 1)}
                readOnly
                className="w-20 h-8 text-sm bg-muted"
              />
            </div>

            <span className="text-sm text-muted-foreground">-</span>

            <div className="flex items-center">
              <span className="text-sm mr-1">{selectedCurrency}</span>
              <Input
                type="number"
                   value={(filters.priceRange[1]) * (exchangeRates[selectedCurrency] || 1)}
              
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value) || dynamicFilterData.priceRange.max
                  setFilters({
                    ...filters,
                    priceRange: [dynamicFilterData.priceRange.min, value],
                  })
                }}
                className="w-20 h-8 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-foreground">Property Class</h3>
        <div className="space-y-2">
          {dynamicFilterData.propertyTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={filters.propertyType === type}
                onCheckedChange={(checked) => {
                  setFilters({ ...filters, propertyType: checked ? type : "all" })
                }}
              />
              <label htmlFor={type} className="text-sm text-foreground cursor-pointer capitalize">
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-foreground">Listing Type</h3>
        <Select value={filters.listingType} onValueChange={(value) => setFilters({ ...filters, listingType: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-foreground">City</h3>
        <Select value={filters.city} onValueChange={(value) => setFilters({ ...filters, city: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {dynamicFilterData.cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-foreground">Nearby Areas</h3>
        <Select value={filters.nearByLands} onValueChange={(value) => setFilters({ ...filters, nearByLands: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {dynamicFilterData.nearByAreas.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Bedrooms</h3>
          <Select value={filters.bedrooms} onValueChange={(value) => setFilters({ ...filters, bedrooms: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              {dynamicFilterData.bedroomOptions.map((count) => (
                <SelectItem key={count} value={count.toString()}>
                  {count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-foreground">Bathrooms</h3>
          <Select value={filters.bathrooms} onValueChange={(value) => setFilters({ ...filters, bathrooms: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              {dynamicFilterData.bathroomOptions.map((count) => (
                <SelectItem key={count} value={count.toString()}>
                  {count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-foreground">Furnishing</h3>
        <Select
          value={filters.furnishingStatus}
          onValueChange={(value) => setFilters({ ...filters, furnishingStatus: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {dynamicFilterData.furnishingStatuses.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-foreground">Condition</h3>
        <Select value={filters.condition} onValueChange={(value) => setFilters({ ...filters, condition: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {dynamicFilterData.conditions.map((condition) => (
              <SelectItem key={condition} value={condition} className="capitalize">
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-foreground">Amenities</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {dynamicFilterData.allAmenities.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={filters.amenities.includes(amenity)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({ ...filters, amenities: [...filters.amenities, amenity] })
                  } else {
                    setFilters({ ...filters, amenities: filters.amenities.filter((a) => a !== amenity) })
                  }
                }}
              />
              <label htmlFor={amenity} className="text-sm text-foreground cursor-pointer">
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() =>
          setFilters({
            listingType: "all",
            propertyType: "all",
            priceRange: [dynamicFilterData.priceRange.min, dynamicFilterData.priceRange.max],
            bedrooms: "all",
            bathrooms: "all",
            furnishingStatus: "all",
            condition: "all",
            amenities: [],
            city: "all",
            nearByLands: "all",
          })
        }
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="z-50">
        <Filters
          initialValues={{location:location,
          
            propertyType:propertyType
          }}
          selectedCity={undefined}
          onChange={() => {}}
          onTabChange={undefined}
           tabValue="property"
          tabsRef={undefined}
        />
      </div>

      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span className="text-sm text-muted-foreground">
                {loading ? "Loading properties..." : `${filteredAndSortedProperties.length} properties found`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Grid
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search Property by Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="best-match">Best match</SelectItem>
                  <SelectItem value="price-low">Lowest price first</SelectItem>
                  <SelectItem value="price-high">Highest price first</SelectItem>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="bedrooms">Most bedrooms</SelectItem>
                  <SelectItem value="area">Largest area</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filter by:</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar isMobile={true} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="hidden lg:block w-80 shrink-0">
            <Card className="sticky top-6">
              <CardHeader>
                <h2 className="text-lg font-semibold text-foreground">Filter by:</h2>
              </CardHeader>
              <CardContent>
                <FilterSidebar />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                <p className="text-destructive text-sm">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            )}

            {loading ? (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <PropertySkeleton key={index} />
                ))}
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredAndSortedProperties.map((property) => (
                  <Card
                    key={property.id}
                    className={`group hover:shadow-lg transition-shadow duration-200 cursor-pointer ${
                      viewMode === "list" ? "flex flex-col sm:flex-row" : ""
                    }`}
                  >
                    <div className={`relative ${viewMode === "list" ? "w-full sm:w-64 flex-shrink-0" : ""}`}>
                      <img
                        src={property.images[0] || "/placeholder.svg?height=200&width=300&query=property"}
                        alt={property.title}
                        className={`object-cover ${
                          viewMode === "list"
                            ? "w-full h-48 sm:rounded-l-lg rounded-t-lg sm:rounded-t-none"
                            : "w-full h-48 rounded-t-lg"
                        }`}
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant={property.listingType === "sale" ? "default" : "secondary"}>
                          {property.listingType === "sale" ? "For Sale" : "For Rent"}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className={`p-4 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-blue-600 hover:text-blue-800 line-clamp-2">
                              {property.title}
                            </h3>
                            <div className="flex items-center text-muted-foreground text-sm mt-1">
                              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="line-clamp-1">
                                {property.address}, {property.city}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <Bed className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{property.bedrooms}</span>
                            </div>
                            <div className="flex items-center">
                              <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{property.bathrooms}</span>
                            </div>
                            <div className="flex items-center">
                              <Square className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{property.builtUpArea} sq ft</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl sm:text-2xl font-bold text-primary">

                               {formatPrice(
                                                              (property.price) * (exchangeRates[selectedCurrency] || 1),
                                                              selectedCurrency,
                                                            )}
                       
                            </span>
                            {property.priceNegotiable && (
                              <span className="text-xs text-muted-foreground ml-1">Negotiable</span>
                            )}
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                             <Button
      size="sm"
      onClick={() => router.push(`/property-search/detail/${property.id}`)}
    >
                                View Details
                              </Button>
                            </DialogTrigger>
                           
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && filteredAndSortedProperties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No properties found matching your criteria.</p>
                <p className="text-muted-foreground text-sm mt-2">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
