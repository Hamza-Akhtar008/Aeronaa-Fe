'use client'

import { Star, MapPin, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface HotelHeaderProps {
  hotel: Hotel
  onBookNow: () => void
}

export default function HotelHeader({ hotel, onBookNow }: HotelHeaderProps) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4">
          <span>Hotels</span> &gt; <span>{hotel.city}</span> &gt; <span className="text-gray-900">{hotel.name}</span>
        </div>

        {/* Hotel Title and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div className="flex-1">
            {/* Badge */}
            
            {/* Hotel Name */}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              {hotel.name}
            </h1>

            {/* Location and Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center text-blue-600 hover:underline cursor-pointer">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{hotel.Address}</span>
                
              </div>
            </div>
          </div>

          {/* Actions */}
        
        </div>

        {/* Rating Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rating</span>
            <div className="bg-blue-600 text-white px-2 py-1 rounded font-bold">
              {hotel.starRating}
            </div>
           
          </div>
         
        </div>
      </div>
    </div>
  )
}
