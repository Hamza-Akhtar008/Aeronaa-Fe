"use client"



import { PackagesTable } from "@/components/packages/packages-table"

export default function UmrahPage() {


  return (
  <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Umrah Packages</h1>
       
        </div>
        <PackagesTable />
      </div>
  )
}
