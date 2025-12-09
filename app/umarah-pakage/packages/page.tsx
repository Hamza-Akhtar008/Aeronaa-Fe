
import { PackagesTable } from "@/components/packages/packages-table"

export default function PackagesPage() {
  return (

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Packages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage all your Umrah packages in one place</p>
        </div>
        <PackagesTable />
      </div>
    
  )
}
