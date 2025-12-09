"use client"
import { ReviewCard } from "./ReviewCard"
import { Review } from "../types"

interface AllReviewsTabProps {
  reviews: Review[]
  onRespond: (review: Review) => void
  onPhotoClick: (photo: string) => void
}

export function AllReviewsTab({ reviews, onRespond, onPhotoClick }: AllReviewsTabProps) {
  return (
    <div className="grid gap-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          user={null}
          onRespond={onRespond}
          onPhotoClick={onPhotoClick}
        />
      ))}
    </div>
  )
}
