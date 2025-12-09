'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HotelImageGalleryProps {
  images: string[]
  hotelName: string
}

export default function HotelImageGallery({ images, hotelName }: HotelImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-2 h-96">
          {/* Main Image */}
          <div className="col-span-3 relative rounded-lg overflow-hidden">
            <Image
              src={images[selectedImage] || '/placeholder.svg'}
              alt={`${hotelName} - Main view`}
              fill
              className="object-cover"
              priority
            />
            
            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="space-y-2">
            {images.slice(0, 3).map((image, index) => (
              <div
                key={index}
                className={`relative h-[calc(33.333%-0.25rem)] cursor-pointer rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-blue-600' : ''
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || '/placeholder.svg'}
                  alt={`${hotelName} - View ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
            
            {/* Show all photos button */}
          
          </div>
        </div>
      </div>
    </div>
  )
}
