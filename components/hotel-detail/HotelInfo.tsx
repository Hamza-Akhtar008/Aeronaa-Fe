'use client'

import { MapPin, Medal, Car } from 'lucide-react'
import { useEffect, useRef, useState } from 'react';

interface HotelInfoProps {
  hotel: Hotel
  reviews: any[]
}

export default function HotelInfo({ hotel, reviews }: HotelInfoProps) {

  const [showFullDesc, setShowFullDesc] = useState(false);
  const [descOverflows, setDescOverflows] = useState(false);
  const descRef = useRef<HTMLDivElement>(null);
   const cleanDescription = (htmlString: string) => {
    if (!htmlString) return ''
    
    // Remove HTML tags and convert <br> to line breaks
    return htmlString
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '') 
      .replace(/\n{3,}/g, '\n\n') 
      .trim()
  }
  const formatDescription = (description: string) => {
    if (!description) return []
    
    const cleanText = cleanDescription(description)
    const paragraphs = cleanText.split('\n\n').filter(p => p.trim())
    
    return paragraphs.map((paragraph, index) => ({
      id: index,
      content: paragraph.trim()
    }))
  }

  const descriptionSections = formatDescription(hotel?.description || '')
  // Function to clean HTML and convert to plain text
 
  useEffect(() => {
    if (descRef.current) {
      setDescOverflows(descRef.current?.scrollHeight > descRef.current?.clientHeight)
    }
  }, [descriptionSections, showFullDesc]);
  // Function to split description into sections

  return (
    <div className="bg-white w-full  mx-auto px-3 sm:px-4 py-6 sm:py-8 rounded-lg mt-10 sm:rounded-xl shadow">
      {/* Main Content, single column to match image gallery width */}
      <div className="space-y-6 sm:space-y-8">
            {/* About This Property */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">About this property</h2>
              <div className="relative">
                <div
                  ref={descRef}
                  className={
                    `space-y-3 sm:space-y-4 transition-all duration-300 text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base mt-10
                    ${showFullDesc ? 'max-h-none' : 'max-h-[180px] sm:max-h-[220px] overflow-y-auto pr-2'}`
                  }
                  style={{
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  {descriptionSections.length > 0 ? (
                    descriptionSections.map(section => (
                      <p key={section.id}>{section.content}</p>
                    ))
                  ) : (
                    <p>
                      {cleanDescription(hotel?.description) ||
                        "No description available."}
                    </p>
                  )}
                {((!showFullDesc && descOverflows) || showFullDesc) && (
                  <div className="mt-3">
                    <button
                      onClick={() => setShowFullDesc(!showFullDesc)}
                      className="px-3 sm:px-4 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition text-sm sm:text-base"
                    >
                      {showFullDesc ? "Show Less" : "View All"}
                    </button>
                  </div>
                )}
                {/* If not overflowing, don't show the button */}
              </div>
            </div>

          
        </div>
      </div>
    </div>
  );
}
