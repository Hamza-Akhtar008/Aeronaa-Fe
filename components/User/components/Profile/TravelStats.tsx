import React from 'react'
import { Plane, CreditCard, Award, Calendar } from 'lucide-react'

const stats = [
  {
    label: 'Total Bookings',
    value: '12',
    icon: Plane,
    trend: '+2 this month'
  },
  {
    label: 'Total Spent',
    value: '$4,850',
    icon: CreditCard,
    trend: '+$850 this month'
  },
  {
    label: 'Loyalty Points',
    value: '2,400',
    icon: Award,
    trend: '+200 points to next tier'
  },
  {
    label: 'Member Since',
    value: '2022',
    icon: Calendar,
    trend: '2 years with us'
  }
]

const TravelStats = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#023e8a]/10 overflow-hidden">
      <div className="p-6 border-b border-[#023e8a]/10">
        <h2 className="text-xl font-semibold text-[#023e8a]">Travel Status</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#023e8a]/10">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 group hover:bg-[#023e8a]/5 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#023e8a]/10 group-hover:bg-[#023e8a]/20 transition-colors">
                <stat.icon className="w-6 h-6 text-[#023e8a]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold text-[#023e8a] mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.trend}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TravelStats
