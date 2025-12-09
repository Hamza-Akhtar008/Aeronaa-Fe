"use client"
import { useState } from "react"
import { Star, User, MessageSquare } from "lucide-react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Review } from "@/app/(Vendor)/Dashboard/Reviews/types"

interface ReviewCard {
  reviews: Review[]
}

export function Card({ reviews }: ReviewCard) {
  const [expandedCards, setExpandedCards] = useState<number[]>([])

  const toggleExpanded = (reviewId: number) => {
    setExpandedCards((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    )
  }

  const truncateText = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white border border-dashed border-gray-300 rounded-xl shadow-sm">
        <div className="bg-gradient-to-br from-[#023e8a] to-[#0077b6] p-4 rounded-full shadow-lg mb-4">
          <MessageSquare className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">No Reviews Yet</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          This hotel hasn’t received any reviews yet. Once guests start sharing their experiences, they’ll appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 md:px-8 py-8">
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 1,
          loop: true,
        }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-6">
          {reviews.map((review) => {
            const isExpanded = expandedCards.includes(review.id)
            const shouldShowButton = review.description.length > 150

            return (
              <CarouselItem key={review.id} className="pl-6 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 transition-colors ${
                          i < Number.parseInt(review.rating)
                            ? "fill-amber-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-600">{review.rating}/5</span>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 mb-6">
                    <p className="text-gray-700 text-base leading-relaxed">
                      {isExpanded ? review.description : truncateText(review.description)}
                    </p>

                    {shouldShowButton && (
                      <button
                        onClick={() => toggleExpanded(review.id)}
                        className="mt-3 inline-flex items-center text-sm font-medium text-[#023e8a] hover:text-[#012a5c] transition-colors group"
                      >
                        {isExpanded ? "Show less" : "Read more"}
                        <svg
                          className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#023e8a] to-[#0077b6] flex items-center justify-center shadow-md">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-base">{review.user.name}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {new Date(review.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>

        {/* Carousel Navigation */}
        <CarouselPrevious className="hidden md:flex h-12 w-12 border-2 border-[#023e8a]/20 bg-white hover:bg-[#023e8a] hover:text-white hover:border-[#023e8a] transition-all duration-200 rounded-full absolute -left-16 shadow-lg hover:shadow-xl" />
        <CarouselNext className="hidden md:flex h-12 w-12 border-2 border-[#023e8a]/20 bg-white hover:bg-[#023e8a] hover:text-white hover:border-[#023e8a] transition-all duration-200 rounded-full absolute -right-16 shadow-lg hover:shadow-xl" />
      </Carousel>
    </div>
  )
}
