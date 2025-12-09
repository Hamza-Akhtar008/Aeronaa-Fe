"use client"
import { ReviewCard } from '@/app/(Vendor)/Dashboard/Reviews/components/ReviewCard'
import { Review } from '@/app/(Vendor)/Dashboard/Reviews/types'
import { FetchUser, GetUserReviews } from '@/lib/api'
import { useAuth } from '@/store/authContext'
import React, { useEffect } from 'react'



const UserReviews = () => {
    const { auth, loading } = useAuth();
  const [user, setUser] = React.useState<User | null>(null);
  const [Reviews, setReviews] = React.useState<Review[]>([])
  const handleRespond = (review: Review) => {
    console.log('Responding to:', review)
  }

  const handlePhotoClick = (photo: string) => {
    console.log('Photo clicked:', photo)
  }
useEffect(() => {
  if (!loading && auth) {
    const fetchUserData = async () => {
      try {
        const response = await FetchUser(auth.id.toString());
        setUser(response);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUserData();
  }
}, [loading, auth]);
  const FetchReviews= async ( )=>
  {
    const response =await GetUserReviews();

    setReviews(response);

  }

   
useEffect(()=>
{
FetchReviews();
},[])

if(loading)
{
   return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="flex items-center space-x-2">
        <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce" />
      </div>
    </div>
  )
}

  return (
    <div className="grid gap-4 p-6">
    {Reviews.length === 0 && (
      <p className="text-center text-gray-500">No reviews available.</p>
    )}
      {Reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          user={user}
          onRespond={handleRespond}
          onPhotoClick={handlePhotoClick}
        />
      ))}
    </div>
  )
}

export default UserReviews
