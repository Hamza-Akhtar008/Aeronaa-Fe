"use client"



import { BookingsTable } from "@/components/bookings/bookings-table"
import { PackagesTable } from "@/components/packages/packages-table"

export default function UmrahBookingPage() {


  return (
  <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Umrah Packages Booking</h1>
       
        </div>
        < BookingsTable/>
      </div>
  )
}
