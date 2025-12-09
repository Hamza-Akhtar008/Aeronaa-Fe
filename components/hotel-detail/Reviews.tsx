'use client'
import { Star } from 'lucide-react'
import { useState } from 'react'

interface User {
  avatarUrl?: string
  name: string
}

interface Review {
  title?: string
  imageUrl?: string
  id: number
  description: string
  rating: string
  user: User
  updatedAt: Date
}

interface ReviewsProps {
  reviews: Review[]
}

export default function Reviews({ reviews }: ReviewsProps) {
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null)

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return '0'
    const sum = reviews.reduce((acc, review) => acc + (parseFloat(review.rating) || 0), 0)
    return (sum / reviews.length).toFixed(1)
  }

  const getRatingDescription = (rating: number) => {
    if (rating >= 9) return 'Wonderful'
    if (rating >= 8) return 'Very good'
    if (rating >= 7) return 'Good'
    if (rating >= 6) return 'Pleasant'
    if (rating >= 5) return 'Okay'
    return 'Disappointing'
  }

  const averageRating = parseFloat(calculateAverageRating())
  const ratingDescription = getRatingDescription(averageRating)

  // Show either all or first 6 reviews
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 6)

  const toggleReviewExpansion = (id: number) => {
    setExpandedReviewId(expandedReviewId === id ? null : id)
  }

  const truncateText = (text: string, limit = 120) => {
    if (text.length <= limit) return text
    return text.slice(0, limit) + '...'
  }

  return (
    <div className="bg-[#f9fafb] py-10">
      <div className="max-w-[103rem] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-black mb-4 text-[32px] font-bold">Reviews</h1>
          <p className="text-gray-500 text-base">What people say about us</p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No reviews available for this property yet.</p>
            <p className="text-sm mt-2">Be the first to leave a review!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedReviews.map((review) => {
              const isExpanded = expandedReviewId === review.id
              return (
                <div
                  key={review.id}
                  onClick={() => toggleReviewExpansion(review.id)}
                  className="cursor-pointer bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3 h-full hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                      {review.user?.avatarUrl ? (
                        <img
                          src={review.user.avatarUrl}
                          alt={review.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-gray-600 text-lg">
                          {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold block text-gray-900">
                        {review.user?.name || 'Anonymous'}
                      </span>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{review.rating}/5</span>
                      </div>
                    </div>
                  </div>

                  {review.imageUrl && (
                    <img
                      src={review.imageUrl}
                      alt="Review"
                      className="rounded-lg w-full h-40 object-cover mb-2"
                    />
                  )}

                  {review.title && (
                    <div className="font-bold text-base mb-1">{review.title}</div>
                  )}

                  <div className="text-gray-700 text-sm flex-1">
                    {isExpanded ? review.description : truncateText(review.description)}
                  </div>

                  {!isExpanded && review.description.length > 120 && (
                    <span className="text-blue-600 text-sm font-semibold mt-2">
                      Read more
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {reviews.length > 6 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all"
            >
              {showAllReviews ? 'Show less' : 'View all testimonials'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
