"use client"
import { ReviewCard } from "./ReviewCard"

interface PublishedReviewsTabProps {
  reviews: any[]
  onRespond: (review: any) => void
  onPhotoClick: (photo: string) => void
}

export function PublishedReviewsTab({ reviews, onRespond, onPhotoClick }: PublishedReviewsTabProps) {
  const publishedReviews = reviews.filter(review => review.status === "published")
  
  return (
    <div className="grid gap-4">
      {publishedReviews.map((review) => (
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
