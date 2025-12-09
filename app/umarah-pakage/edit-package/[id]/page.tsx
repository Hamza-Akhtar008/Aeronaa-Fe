// app/packages/[id]/edit/page.tsx
"use client";
import { PackageForm } from "@/components/packages/package-form"



interface EditPackagePageProps {
  params: { id: string }
}

export default function EditPackagePage({ params }: EditPackagePageProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Package</h1>
      <PackageForm packageId={params.id} /> {/* pass id → edit mode */}
    </div>
  )
}
