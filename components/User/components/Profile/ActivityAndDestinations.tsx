import React from 'react'
import Image from 'next/image'
import { Check, Clock } from 'lucide-react'

const destinations = [
  { name: 'New York', image: '/images/one.png' },
  { name: 'Paris', image: '/images/two.jpg' },
  { name: 'Tokyo', image: '/images/three.jpg' },
  { name: 'London', image: '/images/four.jpg' },
]

const activities = [
  {
    title: 'Booking confirmed at Grand Plaza Hotel',
    time: '2 hours ago',
    type: 'booking'
  },
  {
    title: 'Profile updated',
    time: '1 day ago',
    type: 'profile'
  },
  {
    title: 'Review submitted for Ocean View Resort',
    time: '3 days ago',
    type: 'review'
  },
]

const ActivityAndDestinations = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Preferred Destinations */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#023e8a]/10">
        <div className="p-6 border-b border-[#023e8a]/10">
          <h2 className="text-xl font-semibold text-[#023e8a]">Preferred Destinations</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {destinations.map((destination, index) => (
              <div key={index} className="group relative h-32 rounded-xl overflow-hidden">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-3 left-3 text-white font-medium">
                  {destination.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#023e8a]/10">
        <div className="p-6 border-b border-[#023e8a]/10">
          <h2 className="text-xl font-semibold text-[#023e8a]">Recent Activity</h2>
        </div>
        <div className="">
          {activities.map((activity, index) => (
            <div key={index} className="p-4 hover:bg-[#023e8a]/5 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-[#023e8a]/10">
                  {activity.type === 'booking' ? (
                    <Check className="w-4 h-4 text-[#023e8a]" />
                  ) : (
                    <Clock className="w-4 h-4 text-[#023e8a]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ActivityAndDestinations
