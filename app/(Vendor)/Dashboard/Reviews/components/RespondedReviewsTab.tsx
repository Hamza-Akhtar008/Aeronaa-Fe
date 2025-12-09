"use client"
import { ReviewCard } from "./ReviewCard"

interface RespondedReviewsTabProps {
  reviews: any[]
  onRespond: (review: any) => void
  onPhotoClick: (photo: string) => void
}

export function RespondedReviewsTab({ reviews, onRespond, onPhotoClick }: RespondedReviewsTabProps) {
  const respondedReviews = reviews.filter(review => review.response)
  
  return (
    <div className="grid gap-4">
      {respondedReviews.map((review) => (
        <ReviewCard
        user={null} // Assuming user is not needed here, or you can pass it if available
          key={review.id}
          review={review}
          onRespond={onRespond}
          onPhotoClick={onPhotoClick}
        />
      ))}
    </div>
  )
}
