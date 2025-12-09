"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Star, Search, Users } from "lucide-react"
import { GetUmrahPakageall, SearchUmrahPackages } from "@/lib/umrah_api"
import type { UmrahPackage } from "@/types/Umrah"
import { useSearchParams } from "next/navigation"
import Filters from "@/components/home/Filters"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"
import { formatPrice } from "@/lib/utils/currency"

export default function UmrahPackagesPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [packageType, setPackageType] = useState("all")
  const [priceRange, setPriceRange] = useState([1000, 5000])
  const [duration, setDuration] = useState("all")
  const [starRating, setStarRating] = useState("all")
  const [sortBy, setSortBy] = useState("best-match")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [umrahPackages, setUmrahPackages] = useState<UmrahPackage[]>([])
  const [loading, setLoading] = useState(true)
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

  const popularFilters = [
    { id: "Breakfast", label: "Breakfast included", count: 156 },
    { id: "Flight Included", label: "Flight included", count: 203 },
    { id: "Airport Transfer", label: "Airport transfer", count: 89 },
    { id: "Ziyarat Tours", label: "Ziyarat tours", count: 134 },
    { id: "Guided Tour", label: "Guided tour", count: 167 },
    { id: "Umrah Visa", label: "Umrah visa included", count: 78 },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)

        // Get URL parameters
        const urlPackageType = searchParams?.get("packageType") || ""
        const urlDuration = searchParams?.get("numberOfDays") || ""
        const city = searchParams?.get("city") || ""

        let response

        // If search parameters exist, use search API
        if (urlPackageType || urlDuration || city) {
          response = await SearchUmrahPackages(urlPackageType, urlDuration, city)

          // Set the filters based on URL parameters
          if (urlPackageType) {
            setPackageType(urlPackageType.toLowerCase())
          }
          if (urlDuration) {
            const durationNum = Number.parseInt(urlDuration)
            if (durationNum <= 10) {
              setDuration("short")
            } else if (durationNum <= 14) {
              setDuration("medium")
            } else {
              setDuration("long")
            }
          }
        } else {
          // Otherwise fetch all packages
          response = await GetUmrahPakageall()
        }

        console.log(response)
        setUmrahPackages(response)
      } catch (error) {
        console.error("Error fetching packages:", error)
        setUmrahPackages([])
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [searchParams])

  const filteredAndSortedPackages = useMemo(() => {
    const filtered = umrahPackages.filter((pkg) => {
      const matchesSearch =
        pkg?.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg?.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg?.citiesCovered.some((city) => city.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesType = packageType === "all" || pkg.packageType.toLowerCase() === packageType.toLowerCase()

      const lowestPrice = Math.min(pkg.doubleSharingPrice, pkg.trippleSharingPrice, pkg.quadSharingPrice)
      const matchesPrice = lowestPrice >= priceRange[0] && lowestPrice <= priceRange[1]

      const matchesDuration =
        duration === "all" ||
        (duration === "short" && pkg.duration <= 10) ||
        (duration === "medium" && pkg.duration > 10 && pkg.duration <= 14) ||
        (duration === "long" && pkg.duration > 14)

      const minStarRating = Math.min(Number.parseInt(pkg.makkahStarRating), Number.parseInt(pkg.medinaStarRating))
      const matchesStars = starRating === "all" || minStarRating >= Number.parseInt(starRating)

      const packageAmenities = [
        ...(pkg.mealsIncluded || []),
        ...(pkg.extrasIncluded || []),
        ...(pkg.religiousServicesIncluded || []),
      ]

      // Add flight and airport transfer as amenities if included
      if (pkg.flightIncluded === 1) {
        packageAmenities.push("Flight Included")
      }
      if (pkg.airportTransfersIncluded === 1) {
        packageAmenities.push("Airport Transfer")
      }
      if (pkg.ziyaratIncluded === 1) {
        packageAmenities.push("Ziyarat Tours")
      }

      const matchesAmenities =
        selectedAmenities.length === 0 || selectedAmenities.every((amenity) => packageAmenities.includes(amenity))

      return matchesSearch && matchesType && matchesPrice && matchesDuration && matchesStars && matchesAmenities
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "best-match":
          return (b.discountPercent || 0) - (a.discountPercent || 0)
        case "lowest-price":
          return (
            Math.min(a.doubleSharingPrice, a.trippleSharingPrice, a.quadSharingPrice) -
            Math.min(b.doubleSharingPrice, b.trippleSharingPrice, b.quadSharingPrice)
          )
        case "highest-rated":
          return (b.discountPercent || 0) - (a.discountPercent || 0)
        case "most-reviewed":
          return b.duration - a.duration
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, packageType, priceRange, duration, starRating, sortBy, selectedAmenities, umrahPackages])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066cc] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Umrah packages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
        
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Text search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-gray-300"
              />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 whitespace-nowrap">Sort by</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] h-10 bg-[#0066cc] text-white border-[#0066cc]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="best-match">Best match</SelectItem>
                  <SelectItem value="highest-rated">Top reviewed</SelectItem>
                  <SelectItem value="lowest-price">Lowest price first</SelectItem>
                  <SelectItem value="most-reviewed">Most reviewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Your budget (per night)</h3>
                <div className="space-y-3">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={5000}
                    min={1000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">MIN</span>

    
                      
                      <Input
                        value={(priceRange[0]) * (exchangeRates[selectedCurrency] || 1)}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-20 h-8 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">MAX</span>
                      <Input
                        value={(priceRange[1]) * (exchangeRates[selectedCurrency] || 1)}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-20 h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Popular filters for Umrah</h3>
                <div className="space-y-2">
                  {popularFilters.map((filter) => (
                    <div key={filter.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={filter.id}
                        checked={selectedAmenities.includes(filter.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAmenities([...selectedAmenities, filter.id])
                          } else {
                            setSelectedAmenities(selectedAmenities.filter((a) => a !== filter.id))
                          }
                        }}
                      />
                      <label htmlFor={filter.id} className="text-sm text-gray-700 cursor-pointer flex-1">
                        {filter.label}
                      </label>
                    
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Package type</h3>
                <div className="space-y-2">
                  {["Economy", "Standard", "Luxury"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.toLowerCase()}
                        checked={packageType === type.toLowerCase() || packageType === "all"}
                        onCheckedChange={(checked) => {
                          setPackageType(checked ? type.toLowerCase() : "all")
                        }}
                      />
                      <label htmlFor={type.toLowerCase()} className="text-sm text-gray-700 cursor-pointer">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Star rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3].map((stars) => (
                    <div key={stars} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${stars}-stars`}
                        checked={starRating === stars.toString()}
                        onCheckedChange={(checked) => {
                          setStarRating(checked ? stars.toString() : "all")
                        }}
                      />
                      <label
                        htmlFor={`${stars}-stars`}
                        className="text-sm text-gray-700 cursor-pointer flex items-center gap-1"
                      >
                        <div className="flex">
                          {[...Array(stars)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredAndSortedPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-80 h-48 md:h-auto">
                        <img
                          src={pkg.coverImage || "/placeholder.svg?height=200&width=300&query=umrah package"}
                          alt={pkg.packageName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-[#0066cc] mb-1">{pkg.packageName}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <div className="flex">
                                {[
                                  ...Array(
                                    Math.min(
                                      Number.parseInt(pkg.makkahStarRating),
                                      Number.parseInt(pkg.medinaStarRating),
                                    ),
                                  ),
                                ].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <MapPin className="h-3 w-3" />
                              <span>{pkg.citiesCovered.join(", ")} • View on map</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="bg-[#0066cc] text-white px-2 py-1 rounded text-sm font-semibold">
                              {pkg.discountPercent || 8.6} Excellent
                            </div>
                         
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-700 mb-2">This package offers:</p>
                          <div className="flex flex-wrap gap-2">
                            {pkg.mealsIncluded?.map((meal) => (
                              <Badge key={meal} variant="secondary" className="text-xs">
                                {meal}
                              </Badge>
                            ))}
                            {pkg.flightIncluded === 1 && (
                              <Badge variant="secondary" className="text-xs">
                                Flight Included
                              </Badge>
                            )}
                            {pkg.ziyaratIncluded === 1 && (
                              <Badge variant="secondary" className="text-xs">
                                Ziyarat Tours
                              </Badge>
                            )}
                            {pkg.airportTransfersIncluded === 1 && (
                              <Badge variant="secondary" className="text-xs">
                                Airport Transfer
                              </Badge>
                            )}
                          </div>
                        </div>

                        {pkg.duration <= 10 && (
                          <div className="bg-red-600 text-white px-2 py-1 text-xs font-medium rounded mb-2 inline-block">
                            ONLY 3 LEFT
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Users className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">
                           


                      {formatPrice(
                                                                                  (pkg.singlePricing* 0.05) * (exchangeRates[selectedCurrency] || 1),
                                                                                  selectedCurrency,
                                                                                )}
                                                                                applied

                          </span>
                          <span className="text-gray-500">Per night before taxes and fees</span>
                        </div>
                      </div>

                      <div className="p-4 md:w-48 bg-gray-50 flex flex-col justify-between">
                        <div className="text-right">
                          {pkg.discountPercent > 0 && (
                            <div className="text-sm text-gray-500 line-through mb-1">
                             {Math.floor(pkg.singlePricing * 1.2).toLocaleString()}
                            </div>
                          )}
                          {pkg.discountPercent > 0 && (
                            <div className="text-sm text-green-600 font-medium mb-1">-{pkg.discountPercent}%</div>
                          )}
                          <div className="text-2xl font-bold text-gray-900 mb-1">
                        
                           


                      {formatPrice(
                                                                                  (Math.min(
                                                                                    pkg.singlePricing,
                              pkg.doubleSharingPrice,
                              pkg.trippleSharingPrice,
                              pkg.quadSharingPrice,
                            )) * (exchangeRates[selectedCurrency] || 1),
                                                                                  selectedCurrency,
                                                                                )}

                          </div>
                          <div className="text-xs text-gray-600 mb-3">Subject to Cashback Terms</div>
                        
                        
                        </div>

                        <div className="mt-4 space-y-2">
                          <Link href={`/Umrah/detailed/${pkg.id}`}>
                            <Button variant="outline" className="w-full text-sm bg-transparent">
                              See availability
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAndSortedPackages.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No packages found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setPackageType("all")
                      setPriceRange([1000, 5000])
                      setDuration("all")
                      setStarRating("all")
                      setSelectedAmenities([])
                    }}
                    className="bg-[#0066cc] hover:bg-[#0052a3] text-white"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
