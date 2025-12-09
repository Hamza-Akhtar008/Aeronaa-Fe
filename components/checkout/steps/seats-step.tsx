"use client"

import { Button } from "@/components/ui/button"
import { Plane } from "lucide-react"

interface SeatsStepProps {
  onNext: () => void
}

export default function SeatsStep({ onNext }: SeatsStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-lg">
        <div className="bg-orange-500 p-3 rounded-lg">
          <Plane className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="font-medium text-blue-900">No seats selected – Seats will be assigned at check-in</p>
          <p className="text-sm text-gray-600 mt-1">Seats Terms & Conditions</p>
          <p className="text-sm text-gray-600">
            Advanced seat selection is dependent upon your airline. Airlines may change aircraft and seat assignments
            prior to departure, and specific seat requests are not guaranteed. Seat selection, cancellation, and refund
            policies differ by airline.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button className="flex-1 bg-gray-800 hover:bg-gray-900">Select seats now</Button>
        <Button variant="outline" className="px-8 bg-transparent" onClick={onNext}>
          Skip
        </Button>
      </div>
    </div>
  )
}
