"use client"
import { hotdeal } from "@/lib/data/hotDeals"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const HotDeals = () => {
  return (
      <div className="w-full bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-[#023e8a] mb-8 text-left leading-none" style={{letterSpacing: '-0.04em'}}>
            Hot Deals
          </h2>
          <div className="relative">
            <div className="flex flex-row gap-6 overflow-x-auto scrollbar-hide pb-2 justify-start items-stretch snap-x snap-mandatory pr-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {hotdeal.map((deal, idx) => (
                <Card key={deal.name} className="flex flex-row items-stretch w-[400px] min-w-[380px] max-w-[420px] bg-white rounded-2xl shadow-lg p-0 overflow-hidden border-0 flex-shrink-0 snap-center">
                  {/* Image */}
                  <div className="relative w-[110px] h-[100px] my-auto ml-4 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={deal.image}
                      alt={deal.name}
                      fill
                      className="object-cover w-full h-full"
                      priority={idx === 0}
                    />
                    {deal.topRated && (
                      <div className="absolute top-2 left-2 bg-[#1976d2] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        Top Rated
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex flex-col justify-between flex-1 px-3 py-3">
                    <div>
                      <h3 className="text-xl font-bold text-[#023e8a] mb-1 leading-tight">{deal.name}</h3>
                      <div className="text-sm text-[#333] font-medium mb-1 truncate max-w-[120px]">{deal.description}...</div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.round(deal.rating) ? 'text-[#ffc107]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <polygon points="9.9,1.1 7.6,6.6 1.6,7.6 6,11.7 4.9,17.6 9.9,14.7 14.9,17.6 13.8,11.7 18.2,7.6 12.2,6.6" />
                          </svg>
                        ))}
                        <span className="ml-2 text-xs text-[#333] font-semibold">({deal.reviews})</span>
                      </div>
                    </div>
                    {/* Bottom row: property count and button (always horizontal) */}
                    <div className="flex flex-row gap-2 mt-2 items-center">
                      <div className="bg-[#f1f6fb] text-[#023e8a] text-base font-semibold rounded-xl px-4 py-2 text-center min-w-[90px]">
                        {deal.properties.replace('properties', 'Properties').replace('k', 'k+')}
                      </div>
                      <Button className="bg-[#023e8a] hover:bg-[#1976d2] text-white text-base font-bold rounded-xl px-4 py-2 shadow-none whitespace-nowrap max-w-[110px] truncate">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {/* Subtle scroll indicator (fade) */}
            <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>
      </div>
    );
}

export default HotDeals
