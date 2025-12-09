"use client"

import { PackageForm } from "@/components/packages/package-form"



export default function AddPackagePage() {
  return (
  
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Package</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create a new Umrah package for your customers</p>
        </div>
        <PackageForm />
      </div>

  )
}
