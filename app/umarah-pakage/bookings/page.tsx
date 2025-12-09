import { BookingsTable } from "@/components/bookings/bookings-table";



export default function BookingsPage() {
  return (
 
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bookings Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage all bookings for your Umrah packages</p>
        </div>
        <BookingsTable />
      </div>
  
  )
}
