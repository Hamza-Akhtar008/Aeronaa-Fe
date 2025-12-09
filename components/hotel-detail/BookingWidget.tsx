'use client'

import { Calendar, Users, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BookingWidgetProps {
  onBookNow: () => void
}

export default function BookingWidget({ onBookNow }: BookingWidgetProps) {
  return (
    <div className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Sign in, save money</h3>
            <div className="text-blue-600">
              🎁
            </div>
          </div>
          <p className="text-gray-700 mb-4">Sign in to see if you can save 10% or more at this property.</p>
          <div className="flex gap-3">
            <Button variant="outline" className="border-blue-600 text-blue-600">
              Sign in
            </Button>
            <Button variant="outline">
              Create an account
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Select your option</h2>
            <div className="text-sm text-gray-600">
              Prices converted to USD 💱
            </div>
          </div>

          {/* Date and Guest Selector */}
          <div className="bg-white border rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-3 border rounded">
                <Calendar className="w-4 h-4 text-gray-600" />
                <div>
                  <div className="text-sm font-medium">Tue, Jul 15 — Thu, Jul 17</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 border rounded">
                <Users className="w-4 h-4 text-gray-600" />
                <div>
                  <div className="text-sm font-medium">2 adults • 0 children • 1 room</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600 ml-auto" />
              </div>
              
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Change search
              </Button>
            </div>
          </div>

          {/* Room Options Table */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="font-semibold">Accommodation Type</div>
                <div className="font-semibold">Number of guests</div>
                <div className="font-semibold">Price for 2 nights</div>
                <div className="font-semibold">Your options</div>
              </div>
            </div>
            
            <div className="p-4 border-b">
              <div className="grid grid-cols-4 gap-4 items-center">
                <div>
                  <h4 className="font-semibold text-blue-600">Deluxe King Studio</h4>
                </div>
                <div>
                  <Users className="w-4 h-4 inline mr-1" />
                  <span>2</span>
                </div>
                <div>
                  <div className="text-xl font-bold">US$146</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">Continental breakfast included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="border rounded px-2 py-1 text-sm">
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                    </select>
                    <Button 
                      onClick={onBookNow}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1"
                    >
                      I'll reserve
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* We Price Match */}
          <div className="flex items-center justify-end mt-4">
            <div className="flex items-center gap-2 text-blue-600">
              <span className="text-sm">🏷️ We Price Match</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
