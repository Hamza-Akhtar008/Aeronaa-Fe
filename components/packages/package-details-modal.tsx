"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  X,
  MapPin,
  Star,
  Plane,
  Calendar,
  Users,
  Utensils,
  Car,
  Shield,
  Clock,
  Phone,
  CheckCircle,
  Building,
  Route,
} from "lucide-react"

interface Package {
  id: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  packageName: string
  packageCode: string
  packageType: string
  duration: number
  startDate: string
  endDate: string
  citiesCovered: string[]
  shortDescription: string
  longDescription: string
  makkahHotelName: string
  makkahStarRating: string
  distanceFromHaram: number
  medinaHotelName: string
  medinaStarRating: string
  distanceFromMasjidNabwi: number
  roomTypes: string
  mealsIncluded: string[]
  flightIncluded: number
  airportTransfersIncluded: number
  interCityTransportType: string
  ziyaratIncluded: number
  tentativeDepartureDate: string
  tentativeReturnDate: string
  airLineName: string
  flightClass: string
  routeType: string
  departureCity: string
  arrivalCity: string
  flightDuration: number
  flightNotes: string
  currency: string
  doubleSharingPrice: number
  trippleSharingPrice: number
  quadSharingPrice: number
  discountPercent: number
  refundPolicy: string
  paymentTerms: string
  specialNotes: string
  vendorNotes: string
  extrasIncluded: string[]
  religiousServicesIncluded: string[]
  hotelImages: string[]
  coverImage: string
}

interface PackageDetailsModalProps {
  package: Package | null
  isOpen: boolean
  onClose: () => void
}

export function PackageDetailsModal({ package: pkg, isOpen, onClose }: PackageDetailsModalProps) {
  if (!pkg) return null

  const renderStars = (rating: string) => {
    const stars = Number.parseInt(rating)
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < stars ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating} Star</span>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-scroll bg-white">
        <DialogHeader className="px-8 py-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-semibold text-gray-900">{pkg.packageName}</DialogTitle>
              <p className="text-gray-600 mt-1">{pkg.packageCode}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-8 space-y-8">
            {/* Package Overview */}
            <div className="relative">
              <img
                src={pkg.coverImage || "/placeholder.svg?height=250&width=900&query=kaaba makkah golden hour"}
                alt={pkg.packageName}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4">
                <Badge variant={pkg.isActive ? "default" : "secondary"} className={pkg.isActive ? "bg-green-600" : ""}>
                  {pkg.isActive ? "Active Package" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-gray-200">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <p className="font-semibold text-lg text-gray-900">{pkg.duration} Days</p>
                  <p className="text-gray-600 text-sm">Duration</p>
                </CardContent>
              </Card>
              <Card className="border border-gray-200">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <p className="font-semibold text-lg text-gray-900">{pkg.citiesCovered.join(", ")}</p>
                  <p className="text-gray-600 text-sm">Cities Covered</p>
                </CardContent>
              </Card>
              <Card className="border border-gray-200">
                <CardContent className="p-6 text-center">
                  <Badge variant="outline" className="text-blue-600 border-blue-600 mb-3">
                    {pkg.packageType}
                  </Badge>
                  <p className="text-gray-600 text-sm">Package Type</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Package Description</h3>
                <p className="text-gray-700 leading-relaxed">{pkg.longDescription}</p>
              </CardContent>
            </Card>

            {/* Hotels Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                <Building className="h-5 w-5 text-blue-600" />
                Hotel Accommodations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>🕋</span>
                        <span>Makkah Hotel</span>
                      </span>
                      {renderStars(pkg.makkahStarRating)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <h4 className="font-medium text-gray-900 mb-2">{pkg.makkahHotelName}</h4>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{pkg.distanceFromHaram}m from Haram Sharif</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>🕌</span>
                        <span>Medina Hotel</span>
                      </span>
                      {renderStars(pkg.medinaStarRating)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <h4 className="font-medium text-gray-900 mb-2">{pkg.medinaHotelName}</h4>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{pkg.distanceFromMasjidNabwi}m from Masjid Nabwi</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Flight Details */}
            {
                pkg.flightIncluded==1&&
                 <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                <Plane className="h-5 w-5 text-blue-600" />
                Flight Information
              </h3>
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-base">✈️ {pkg.airLineName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Route className="h-4 w-4 text-blue-600" />
                        <span>
                          {pkg.departureCity} → {pkg.arrivalCity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>
                          {pkg.flightDuration} hours ({pkg.routeType})
                        </span>
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        {pkg.flightClass} Class
                      </Badge>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h5 className="font-medium mb-2 text-gray-900">Flight Notes</h5>
                      <p className="text-gray-700 text-sm">{pkg.flightNotes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            }
           

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Pricing Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border border-gray-200 text-center">
                  <CardContent className="p-6">
                    <Users className="h-6 w-6 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-900 mb-2">Double Sharing</h4>
                    <p className="text-2xl font-semibold text-gray-900 mb-1">
                      {pkg.currency} {pkg.doubleSharingPrice.toLocaleString()}
                    </p>
                    <p className="text-gray-600 text-sm">per person</p>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 text-center">
                  <CardContent className="p-6">
                    <Users className="h-6 w-6 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-900 mb-2">Triple Sharing</h4>
                    <p className="text-2xl font-semibold text-gray-900 mb-1">
                      {pkg.currency} {pkg.trippleSharingPrice.toLocaleString()}
                    </p>
                    <p className="text-gray-600 text-sm">per person</p>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 text-center">
                  <CardContent className="p-6">
                    <Users className="h-6 w-6 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-900 mb-2">Quad Sharing</h4>
                    <p className="text-2xl font-semibold text-gray-900 mb-1">
                      {pkg.currency} {pkg.quadSharingPrice.toLocaleString()}
                    </p>
                    <p className="text-gray-600 text-sm">per person</p>
                  </CardContent>
                </Card>
              </div>
              {pkg.discountPercent > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium text-center">
                    🎉 Special Discount: {pkg.discountPercent}% off on all packages!
                  </p>
                </div>
              )}
            </div>

            {/* Services Included */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Services Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pkg.mealsIncluded.map((meal, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-700">
                        <Utensils className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{meal}</span>
                      </div>
                    ))}
                    {pkg.airportTransfersIncluded === 1 && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Car className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Airport Transfers</span>
                      </div>
                    )}
                    {pkg.ziyaratIncluded === 1 && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Ziyarat Tours</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-700">
                      <Car className="h-4 w-4 text-orange-600" />
                      <span className="text-sm capitalize">Inter-city {pkg.interCityTransportType}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Additional Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pkg.extrasIncluded?.map((extra, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{extra}</span>
                      </div>
                    ))}
                    {pkg.religiousServicesIncluded.map((service, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Terms and Policies */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Terms & Policies</h3>
              <div className="space-y-4">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-base">💳 Payment Terms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-sm leading-relaxed">{pkg.paymentTerms}</p>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-base">🔄 Refund Policy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-sm leading-relaxed">{pkg.refundPolicy}</p>
                  </CardContent>
                </Card>
                {pkg.specialNotes && (
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-base">⚠️ Special Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-sm leading-relaxed">{pkg.specialNotes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="px-8 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button variant="outline" onClick={onClose} className="sm:w-auto bg-transparent">
            Close
          </Button>
         
        </div>
      </DialogContent>
    </Dialog>
  )
}
