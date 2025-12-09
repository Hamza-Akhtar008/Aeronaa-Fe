"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Phone,
  Mail,
  Calendar,
  Home,
  Car,
  Wifi,
  Shield,
  Zap,
  Droplets,
  Wind,
  Sun,
  TreePine,
  Dumbbell,
  Users,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { GetPropertyall } from "@/lib/property_api"
import type { Property } from "@/types/property"
import PropertyMap from "@/components/property-map"
import Filters from "@/components/home/Filters"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"
import { formatPrice } from "@/lib/utils/currency"

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
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
    const fetchProperty = async () => {
      try {
        setLoading(true)
        setError(null)
        const properties = await GetPropertyall()
        const foundProperty = properties.find((p: Property) => p.id.toString() === params?.id)

        if (foundProperty) {
          setProperty(foundProperty)
        } else {
          setError("Property not found")
        }
      } catch (err) {
        setError("Failed to load property details")
        console.error("Error fetching property:", err)
      } finally {
        setLoading(false)
      }
    }

    if (params?.id) {
      fetchProperty()
    }
  }, [params?.id])

  const nextImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const prevImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes("parking") || amenityLower.includes("garage")) return <Car className="h-4 w-4" />
    if (amenityLower.includes("wifi") || amenityLower.includes("internet")) return <Wifi className="h-4 w-4" />
    if (amenityLower.includes("security")) return <Shield className="h-4 w-4" />
    if (amenityLower.includes("electricity") || amenityLower.includes("power")) return <Zap className="h-4 w-4" />
    if (amenityLower.includes("water")) return <Droplets className="h-4 w-4" />
    if (amenityLower.includes("ac") || amenityLower.includes("air")) return <Wind className="h-4 w-4" />
    if (amenityLower.includes("solar")) return <Sun className="h-4 w-4" />
    if (amenityLower.includes("garden") || amenityLower.includes("lawn")) return <TreePine className="h-4 w-4" />
    if (amenityLower.includes("gym") || amenityLower.includes("fitness")) return <Dumbbell className="h-4 w-4" />
    if (amenityLower.includes("community") || amenityLower.includes("club")) return <Users className="h-4 w-4" />
    return <Home className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Property Not Found</h1>
          <p className="text-muted-foreground">{error || "The property you're looking for doesn't exist."}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
        <div className="z-50">
                <Filters
                  initialValues={{}}
                  selectedCity={undefined}
                  onChange={() => {}}
                  onTabChange={undefined}
                  tabsRef={undefined}
                />
              </div>
        
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>

         
        </div>

        {/* Image Gallery */}
        <div className="relative mb-8">
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
            <img
              src={property.images[currentImageIndex] || `/placeholder.svg?height=500&width=800&query=property-main`}
              alt={property.title}
              className="w-full h-full object-cover"
            />

            {property.images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            <div className="absolute top-4 left-4">
              <Badge variant={property.listingType === "sale" ? "default" : "secondary"} className="text-sm">
                {property.listingType === "sale" ? "For Sale" : "For Rent"}
              </Badge>
            </div>

            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>

          {/* Image Thumbnails */}
          {property.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || `/placeholder.svg?height=64&width=80&query=property-thumb-${index + 1}`}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>
                      {property.address}, {property.city}, {property.province}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">

                      {formatPrice(
                                                                                  (property.price) * (exchangeRates[selectedCurrency] || 1),
                                                                                  selectedCurrency,
                                                                                )}
                  </div>
                  {property.priceNegotiable && <span className="text-sm text-muted-foreground">Negotiable</span>}
                </div>
              </div>

              {/* Key Features */}
              <div className="flex flex-wrap gap-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{property.bedrooms}</span>
                  <span className="text-sm text-muted-foreground">Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{property.bathrooms}</span>
                  <span className="text-sm text-muted-foreground">Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{property.builtUpArea}</span>
                  <span className="text-sm text-muted-foreground">sq ft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{property.yearBuilt}</span>
                  <span className="text-sm text-muted-foreground">Built</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property Type:</span>
                      <span className="font-medium capitalize">{property.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Built-up Area:</span>
                      <span className="font-medium">{property.builtUpArea} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plot Area:</span>
                      <span className="font-medium">{property.plotArea} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bedrooms:</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bathrooms:</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kitchen:</span>
                      <span className="font-medium">{property.kitchen}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Living Rooms:</span>
                      <span className="font-medium">{property.livingRooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Balconies:</span>
                      <span className="font-medium">{property.balconies}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Floors:</span>
                      <span className="font-medium">{property.numberOfFloors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Floor Number:</span>
                      <span className="font-medium">{property.floorNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Condition:</span>
                      <span className="font-medium capitalize">{property.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Furnishing:</span>
                      <span className="font-medium capitalize">{property.furnishingStatus}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        {getAmenityIcon(amenity)}
                        <span className="text-sm font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Features */}
            {property.additionalfeatures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {property.additionalfeatures.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-sm">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Address:</span>
                      <p className="font-medium">{property.address}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">City:</span>
                      <p className="font-medium">
                        {property.city}, {property.province}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Postal Code:</span>
                      <p className="font-medium">{property.postalCode}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Nearby Landmarks:</span>
                      <p className="font-medium">{property.nearByLands}</p>
                    </div>
                  </div>
                  <PropertyMap
                   
                    address={`${property.address}, ${property.city}`}
                    title={property.title}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-lg">{property.contactName}</p>
                  <p className="text-sm text-muted-foreground">Property Agent</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{property.contactNumber}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{property.contactEmail}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Property Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Listed:</span>
                  <span className="text-sm font-medium">{new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Updated:</span>
                  <span className="text-sm font-medium">{new Date(property.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={property.status === "active" ? "default" : "secondary"}>{property.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Property ID:</span>
                  <span className="text-sm font-medium">#{property.id}</span>
                </div>
              </CardContent>
            </Card>

            {/* Video Preview */}
            {property.videoUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Video Tour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Watch Video Tour
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
