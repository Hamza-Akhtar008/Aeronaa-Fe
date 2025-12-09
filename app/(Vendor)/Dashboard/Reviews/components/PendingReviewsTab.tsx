"use client"
import { ReviewCard } from "./ReviewCard"
import { Review } from "../types"

interface PendingReviewsTabProps {
  reviews: Review[]
  onRespond: (review: Review) => void
  onPhotoClick: (photo: string) => void
}

export function PendingReviewsTab({ reviews, onRespond, onPhotoClick }: PendingReviewsTabProps) {
  const pendingReviews = reviews.filter(review => review.status === "pending")
  
  return (
    <div className="grid gap-4">
      {pendingReviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onRespond={onRespond}
          onPhotoClick={onPhotoClick}
        />
      ))}
    </div>
  )
}
