"use client"
import { Star, StarHalf, ThumbsUp, MapPin, Calendar, User, Hotel } from "lucide-react"
import type { Review } from "../types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ReviewCardUser {
  name: string
  email: string
}

interface ReviewCardProps {
  review: Review
  user: ReviewCardUser | null
  onRespond: (review: Review) => void
  onPhotoClick: (photo: string) => void
}

export function ReviewCard({ review, onRespond, onPhotoClick, user }: ReviewCardProps) {
  return (
    <Card className="relative overflow-hidden border-0 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group animate-fade-in">
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#033f8a] via-[#0077b6] to-[#00b4d8] p-[2px] rounded-lg animate-gradient-x">
        <div className="bg-white rounded-lg h-full w-full" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <CardHeader className="bg-gradient-to-br from-[#033f8a]/10 via-[#0077b6]/8 to-[#00b4d8]/10 relative overflow-hidden">
          {/* Animated decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00b4d8]/20 to-transparent rounded-full -translate-y-16 translate-x-16 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#FFD700]/10 to-transparent rounded-full translate-y-12 -translate-x-12 animate-bounce-slow" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 group-hover:animate-slide-in-left">
              <Hotel className="h-6 w-6 text-[#033f8a] animate-pulse" />
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-[#033f8a] to-[#0077b6] bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                {review.hotel.name}
              </CardTitle>
            </div>

            <CardDescription className="flex items-center gap-2 mb-4 group-hover:animate-slide-in-left animation-delay-100">
              <User className="h-4 w-4 text-[#0077b6] animate-pulse animation-delay-200" />
              <span className="font-medium bg-gradient-to-r from-[#033f8a]/80 to-[#0077b6]/80 bg-clip-text text-transparent">
                {review.user &&review.user.name?(review.user.name):(user?.name)} · {review.user &&review.user.email?(review.user.email):(user?.email)}
              </span>
            </CardDescription>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 group-hover:animate-slide-in-left animation-delay-200">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#033f8a] to-[#00b4d8] bg-clip-text text-transparent animate-pulse">
                  {review.rating}
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.floor(Number.parseInt(review.rating)) }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-6 w-6 fill-[#FFD700] text-[#FFD700] drop-shadow-lg transition-all duration-300 hover:scale-125 animate-star-twinkle"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                  {Number.parseFloat(review.rating) % 1 !== 0 && (
                    <StarHalf className="h-6 w-6 fill-[#FFD700] text-[#FFD700] drop-shadow-lg animate-star-twinkle animation-delay-500" />
                  )}
                </div>
              </div>

              <div className="text-right group-hover:animate-slide-in-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <Calendar className="h-4 w-4 text-[#0077b6] animate-pulse animation-delay-300" />
                  <p className="text-sm font-medium bg-gradient-to-r from-[#033f8a]/70 to-[#0077b6]/70 bg-clip-text text-transparent">
                    {new Date(review.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 relative">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#033f8a] via-transparent to-[#00b4d8] animate-gradient-shift" />
          </div>

          <div className="relative z-10">
            <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-[#033f8a]/5 to-[#00b4d8]/5 border border-[#00b4d8]/20 transition-all duration-300 hover:shadow-lg hover:border-[#00b4d8]/40 group-hover:animate-fade-in-up">
              <p className="text-[#033f8a]/90 leading-relaxed font-medium">{review.description}</p>
            </div>

            {/* Enhanced action buttons area */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#00b4d8]/10 to-[#033f8a]/10 border border-[#00b4d8]/20 group-hover:animate-fade-in-up animation-delay-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-[#0077b6] animate-bounce animation-delay-400" />
                  <span className="text-sm font-medium text-[#033f8a]/70">Premium Location</span>
                </div>

               
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Enhanced hover effect with animated overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#033f8a]/5 via-transparent to-[#00b4d8]/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg">
        <div className="absolute top-4 right-4 w-2 h-2 bg-[#FFD700] rounded-full animate-ping" />
        <div className="absolute bottom-4 left-4 w-3 h-3 bg-[#00b4d8] rounded-full animate-pulse animation-delay-500" />
      </div>
    </Card>
  )
}
