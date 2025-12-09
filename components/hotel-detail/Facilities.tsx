'use client'

import {
  Home,
  Coffee,
  Utensils,
  Building,
  Car,
  Wifi,
  Waves,
  Fan,
  Bell,
  Bath,
  Dumbbell,
  BedDouble,
  Shield,
  Globe,
  Languages,
  Users,
  Tv,
  Lock,
  BusFront,
  Plus,
  Star,
  Loader2
} from 'lucide-react'
import { Dialog } from '@headlessui/react'
import { useState } from 'react'

interface FacilitiesProps {
  amenities: string[]
}

const facilityIcons = {
 'Apartments': Home,
 'Breakfast': Coffee,
 'Restaurant': Utensils,
 'Balcony': Building,
 'Free on-site parking': Car,
 'Private bathroom': Bath,
 'Free Wifi': Wifi,
 'Airport shuttle': BusFront,
 'Room service': Bell,
 'Air conditioning': Fan,
 'Swimming Pool': Waves,
 'Fitness center': Dumbbell,
 'Safety deposit boxes': Shield,
 'Non-smoking': Shield,
 'Multilingual staff': Languages,
 'Wi-Fi in public areas': Globe,
 'Shared lounge/TV area': Tv,
 'In-room safe box': Lock,
 'Public transport access': BusFront,
 'Massage': Plus,
 'Spa': Star,
 'Daily housekeeping': Loader2
 // Add more as needed...
}
export default function Facilities({ amenities }: FacilitiesProps) {
  const [showAll, setShowAll] = useState(false)

  const topCount = 20
  const topAmenities = amenities.slice(0, topCount)
  const remainingAmenities = amenities.slice(topCount)

  const getIcon = (facility: string) => {
    const IconComponent = facilityIcons[facility as keyof typeof facilityIcons] || Home
    return <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
  }

  return (
    <div className="bg-white border-b">
      <div className=" mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Most popular facilities</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {topAmenities.map((facility) => (
            <div key={facility} className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="text-green-600 flex-shrink-0">{getIcon(facility)}</div>
              <span className="truncate">{facility}</span>
            </div>
          ))}
        </div>

        {remainingAmenities.length > 0 && (
          <button
            className="mt-3 sm:mt-4 text-blue-600 hover:underline text-xs sm:text-sm"
            onClick={() => setShowAll(true)}
          >
            View All Facilities
          </button>
        )}
      </div>

      {/* Modal */}
      <Dialog open={showAll} onClose={() => setShowAll(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4">
          <Dialog.Panel className="bg-white p-4 sm:p-6 rounded-lg max-h-[80vh] w-full max-w-sm sm:max-w-2xl lg:max-w-3xl overflow-y-auto">
            <Dialog.Title className="text-base sm:text-lg font-bold mb-3 sm:mb-4">All Facilities</Dialog.Title>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {amenities.map((facility) => (
                <div key={facility} className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="text-green-600 flex-shrink-0">{getIcon(facility)}</div>
                  <span className="truncate">{facility}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 sm:mt-6 text-right">
              <button
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
                onClick={() => setShowAll(false)}
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}