"use client"

import { useEffect, useState } from "react"
import { Filter, Eye, CheckCircle, Trash2, Star, ExternalLink, Phone, Mail, UserIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import Image from "next/image"
import { Review } from "@/app/(Vendor)/Dashboard/Reviews/types"
import { Getallreviews } from "@/lib/api"






const getRatingColor = (rating: string) => {
  const numRating = Number.parseInt(rating)
  if (numRating >= 4) return "text-emerald-600"
  if (numRating >= 3) return "text-amber-600"
  return "text-red-600"
}

const renderStars = (rating: string) => {
  const numRating = Number.parseInt(rating)
  return Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`h-4 w-4 ${i < numRating ? "text-amber-400 fill-current" : "text-gray-300"}`} />
  ))
}

 const formatDate = (date: Date | string | number) => {
  const dateObject = new Date(date); // Convert to Date if not already
  return dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};



export default function ReviewsPage() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [filters, setFilters] = useState({
    hotel: "",
    rating: "",
    date: "",
    city: "",
  })
 const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
  const fetchReviews = async () => {
  const response = await Getallreviews();
    setReviews(response)
  }

  useEffect(()=>{

    fetchReviews();
  },[])
  const filteredReviews = reviews.filter((review) => {
    return (
      (!filters.hotel || review.hotel.name.toLowerCase().includes(filters.hotel.toLowerCase())) &&
      (!filters.rating || review.rating === filters.rating) &&
      (!filters.date || new Date(review.updatedAt) >= new Date(filters.date)) &&
      (!filters.city || review.hotel.city.toLowerCase().includes(filters.city.toLowerCase()))
    )
  })
 const totalPages = Math.ceil(filteredReviews?.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentReviews = filteredReviews?.slice(startIndex, endIndex)
 const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Hotel Reviews & Ratings</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage and moderate hotel reviews from guests</p>
        </div>
       
      </div>

      {/* Filters */}
      <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="hotel" className="text-sm font-semibold text-gray-700">
                Hotel Name
              </Label>
              <Input
                id="hotel"
                placeholder="Search by hotel name..."
                value={filters.hotel}
                onChange={(e) => setFilters({ ...filters, hotel: e.target.value })}
                className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating" className="text-sm font-semibold text-gray-700">
                Rating
              </Label>
              <Select value={filters.rating} onValueChange={(value) => setFilters({ ...filters, rating: value })}>
                <SelectTrigger className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20">
                  <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold text-gray-700">
                Date From
              </Label>
              <Input
                id="date"
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
                City
              </Label>
              <Input
                id="city"
                placeholder="Search by city..."
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Reviews ({filteredReviews?.length})</CardTitle>
              <CardDescription className="text-gray-600 mt-1">Manage and moderate hotel reviews</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="font-semibold text-gray-700">Guest</TableHead>
                  <TableHead className="font-semibold text-gray-700">Hotel</TableHead>
                  <TableHead className="font-semibold text-gray-700">Review</TableHead>
                  <TableHead className="font-semibold text-gray-700">Rating</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentReviews?.map((review) => (
                  <TableRow key={review.id} className="border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-start to-primary-end rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {review.user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{review.user.name}</div>
                          <div className="text-sm text-gray-500">{review.user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 max-w-[200px] truncate">{review.hotel.name}</div>
                        <div className="text-sm text-gray-500">
                          {review.hotel.city}, {review.hotel.country}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-400 fill-current" />
                          <span className="text-xs text-gray-600">{review.hotel.starRating} Star Hotel</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px]">
                        <div className="text-sm text-gray-900 line-clamp-3">{review.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                        <span className={`ml-1 text-sm font-medium ${getRatingColor(review.rating)}`}>
                          {review.rating}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{formatDate(review.updatedAt)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-gray-200 hover:bg-gray-50"
                              onClick={() => setSelectedReview(review)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-gray-900">
                                Review Details - #{selectedReview?.id}
                              </DialogTitle>
                              <DialogDescription className="text-gray-600">
                                Complete review information and guest details
                              </DialogDescription>
                            </DialogHeader>
                            {selectedReview && (
                              <div className="space-y-6">
                                {/* Review Header */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-start to-primary-end rounded-full flex items-center justify-center text-white font-semibold">
                                      {selectedReview.user.name.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="font-semibold text-gray-900">{selectedReview.user.name}</div>
                                      <div className="text-sm text-gray-500">{selectedReview.user.email}</div>
                                      <div className="text-sm text-gray-500">{selectedReview.user.phone}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-1 mb-1">
                                      {renderStars(selectedReview.rating)}
                                      <span className={`ml-1 font-semibold ${getRatingColor(selectedReview.rating)}`}>
                                        {selectedReview.rating}/5
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-500">{formatDate(selectedReview.updatedAt)}</div>
                                  </div>
                                </div>

                                {/* Hotel Information */}
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Hotel Information</h3>
                                    <div className="space-y-3">
                                      <div className="flex items-start gap-3">
                                      
                                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                              src={ "/images/image1.jpg"}
                                              alt={selectedReview.hotel.name}
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                       
                                        <div className="flex-1">
                                          <div className="font-medium text-gray-900">{selectedReview.hotel.name}</div>
                                          <div className="text-sm text-gray-600 mt-1">
                                            {selectedReview.hotel.description}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-sm space-y-1">
                                        <div className="flex justify-between">
                                          <span className="font-medium">Location:</span>
                                          <span>
                                            {selectedReview.hotel.city}, {selectedReview.hotel.country}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="font-medium">Star Rating:</span>
                                          <div className="flex items-center gap-1">
                                            <Star className="h-3 w-3 text-amber-400 fill-current" />
                                            <span>{selectedReview.hotel.starRating} Stars</span>
                                          </div>
                                        </div>
                                      
                                        <div className="flex justify-between">
                                          <span className="font-medium">Status:</span>
                                          <Badge
                                            className={
                                              selectedReview.hotel.isCompleted
                                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                                : "bg-amber-100 text-amber-700 border-amber-200"
                                            }
                                          >
                                            {selectedReview.hotel.isCompleted ? "Active" : "Inactive"}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Guest Contact</h3>
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <UserIcon className="h-4 w-4 text-gray-400" />
                                        <div>
                                          <div className="text-sm font-medium text-gray-900">
                                            {selectedReview.user.name}
                                          </div>
                                          <div className="text-xs text-gray-500">Guest Name</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <div>
                                          <div className="text-sm font-medium text-gray-900">
                                            {selectedReview.user.email}
                                          </div>
                                          <div className="text-xs text-gray-500">Email Address</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <div>
                                          <div className="text-sm font-medium text-gray-900">
                                            {selectedReview.user.phone}
                                          </div>
                                          <div className="text-xs text-gray-500">Phone Number</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Full Review */}
                                <div>
                                  <h3 className="font-semibold text-gray-900 mb-3">Full Review</h3>
                                  <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-gray-900 leading-relaxed">{selectedReview.description}</p>
                                  </div>
                                </div>

                                {/* Hotel Amenities */}
                                {selectedReview.hotel.amenities && selectedReview.hotel.amenities.length > 0 && (
                                  <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Hotel Amenities</h3>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedReview.hotel.amenities.map((amenity) => (
                                        <Badge key={amenity} variant="outline" className="rounded-full border-gray-200">
                                          {amenity}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Action Buttons */}
                              
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      
                       
                      
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
           {filteredReviews.length > 0 && (
                          <div className="px-6 py-4 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredReviews.length)} of {filteredReviews.length}{" "}
                                Reviews
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  disabled={currentPage === 1}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNumber
                                    if (totalPages <= 5) {
                                      pageNumber = i + 1
                                    } else if (currentPage <= 3) {
                                      pageNumber = i + 1
                                    } else if (currentPage >= totalPages - 2) {
                                      pageNumber = totalPages - 4 + i
                                    } else {
                                      pageNumber = currentPage - 2 + i
                                    }
                                    return (
                                      <Button
                                        key={pageNumber}
                                        variant={currentPage === pageNumber ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNumber)}
                                        className="h-8 w-8 p-0"
                                      >
                                        {pageNumber}
                                      </Button>
                                    )
                                  })}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  disabled={currentPage === totalPages}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
      </Card>
    </div>
  )
}
