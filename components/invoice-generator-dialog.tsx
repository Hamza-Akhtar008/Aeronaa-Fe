"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Loader2 } from "lucide-react"
import { GenerateInvoice } from "@/lib/invoice_api"
import toast from "react-hot-toast"


interface InvoiceGeneratorDialogProps {
  vendorId: number
  vendorName: string
  role: string
  onSuccess?: () => void
}

export function InvoiceGeneratorDialog({ vendorId, vendorName, role, onSuccess }: InvoiceGeneratorDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  })

const handleGenerateInvoice = async () => {
  if (!formData.startDate || !formData.endDate) {
    toast.warning("Please select both start and end dates")
    return
  }

  setLoading(true)
  try {
    const payload = {
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      vendorId,
      role,
    }

    console.log(typeof(payload.startDate))
    const result = await GenerateInvoice(payload)
    console.log(result)

    // Handle success (if totalsales exist, invoice created)
    if (result?.totalsales !== undefined) {
      toast.success(
        `✅ Invoice generated successfully!\n\nTotal Sales: ${result.totalsales}\nAeronaa Commission: ${result.aeronaaComission}\nVendor Net: ${result.vendorNet}`
      )

      setFormData({ startDate: "", endDate: "" })
      setOpen(false)
      onSuccess?.()
    } else {
      toast.error(result.message)
    }
  } catch (error:any) {
    console.error("Error generating invoice:", error)

    // Handle backend error messages gracefully
    if (error?.response?.data?.message) {
      const message = error.response.data.message
      if (message.includes("No bookings found")) {
        toast.error("⚠️ No bookings found for the selected date range.")
      } else if (message.includes("already included")) {
        toast.error("⚠️ These dates are already covered in an existing invoice.")
      } else {
        toast.error(`❌ ${message}`)
      }
    } else {
      toast.error("Failed to generate invoice. Please try again.")
    }
  } finally {
    setLoading(false)
  }
}
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
          <FileText className="h-4 w-4" />
          Generate Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Generate Invoice</DialogTitle>
          <DialogDescription>Create an invoice for {vendorName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <p className="font-semibold">Invoice Details:</p>
            <p>Vendor: {vendorName}</p>
            <p>Vendor ID: {vendorId}</p>
            <p>Role: {role}</p>
          </div>
          <Button onClick={handleGenerateInvoice} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Invoice"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
