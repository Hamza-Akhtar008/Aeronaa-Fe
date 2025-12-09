"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Download, CheckCircle } from "lucide-react"
import Link from "next/link"
import { GetVendorInvoices, Markaspaid } from "@/lib/invoice_api"
import toast from "react-hot-toast"
import { generateInvoicePDF } from "@/lib/Invoice_pdf"
import { InvoiceGeneratorDialog } from "@/components/invoice-generator-dialog"



interface Invoice {
  id: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  startDate: string
  endDate: string
  vendorId: number
  totalsales: number
  isFlightBooking:boolean
  aeronaaComission: number
  vendorNet: number
  isPaid: boolean
  paidAt: string | null
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)

export default function VendorInvoicesPage() {
  const params = useParams()
  const vendorId = Number(params?.vendorId)
  const searchParams = useSearchParams()
const vendorName = searchParams?.get("name")
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    fetchInvoices()
  }, [vendorId])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const data = await GetVendorInvoices(vendorId||0)
      setInvoices(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching invoices:", error)
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

const handleMarkPaid = async (invoiceId: number) => {
  const toastId = toast.loading("Marking invoice as paid...")

  try {
    const result = await Markaspaid(invoiceId) // PATCH call

    if (result?.affected === 1) {
      toast.success(`✅ Invoice #${invoiceId} marked as paid successfully!`, { id: toastId })
      await fetchInvoices()
    } else if (result?.affected === 0) {
      toast.error("⚠️ No invoice was updated. It may already be marked as paid.", { id: toastId })
    } else {
      toast.error("❌ Unexpected response from server. Please verify the update.", { id: toastId })
    }
  } catch (error: any) {
    console.error("Error marking invoice as paid:", error)

    if (error?.response?.data?.message) {
      const msg = error.response.data.message
      if (msg.includes("already marked")) {
        toast.error("⚠️ This invoice is already marked as paid.", { id: toastId })
      } else if (msg.includes("not found")) {
        toast.error("❌ Invoice not found. Please refresh and try again.", { id: toastId })
      } else {
        toast.error(`❌ ${msg}`, { id: toastId })
      }
    } else {
      toast.error("❌ Failed to mark invoice as paid. Please try again later.", { id: toastId })
    }
  } finally {
    toast.dismiss(toastId)
  }
}
  const totalSales = invoices.reduce((sum, inv) => sum + inv.totalsales, 0)
  const totalCommission = invoices.reduce((sum, inv) => sum + inv.aeronaaComission, 0)
  const totalVendorNet = invoices.reduce((sum, inv) => sum + inv.vendorNet, 0)
  const paidInvoices = invoices.filter((inv) => inv.isPaid).length

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/receipt">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Receipt
          </Button>
        </Link>
      </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Vendor Invoices</h1>
          <p className="text-gray-600 mt-2 text-lg">Vendor ID: {vendorId}</p>
          <p className="text-gray-600 mt-2 text-lg">Vendor Name: {vendorName}</p>

{vendorId==0&&
<InvoiceGeneratorDialog
                                        vendorId={vendorId}
                                        vendorName={vendorName||""}
                                        role={"support"}
                                       
                                      />}
   
          
        </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-white shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{invoices.length}</p>
            <p className="text-sm text-gray-500 mt-1">{paidInvoices} paid</p>
           
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalSales)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalCommission)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Vendor Net</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalVendorNet)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Invoices</CardTitle>
          <CardDescription className="text-gray-600">All invoices for this vendor</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading invoices...</div>
          ) : invoices.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No invoices found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Vendor Net</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-semibold">#{invoice.id}</TableCell>
                      <TableCell>
                        {formatDate(invoice.startDate)} - {formatDate(invoice.endDate)}
                      </TableCell>
                      <TableCell>{formatCurrency(invoice.totalsales)}</TableCell>
                      <TableCell>{formatCurrency(invoice.aeronaaComission)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(invoice.vendorNet)}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            invoice.isPaid
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                          } border font-medium`}
                        >
                          {invoice.isPaid ? "Paid" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {/* View Details */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedInvoice(invoice)}>
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-3xl">
                              <DialogHeader>
                                <DialogTitle>Invoice Details</DialogTitle>
                                <DialogDescription>Invoice #{selectedInvoice?.id}</DialogDescription>
                              </DialogHeader>
                              {selectedInvoice && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-600">Invoice ID</p>
                                      <p className="font-semibold">#{selectedInvoice.id}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Vendor ID</p>
                                      <p className="font-semibold">{selectedInvoice.vendorId}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Start Date</p>
                                      <p className="font-semibold">{formatDate(selectedInvoice.startDate)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">End Date</p>
                                      <p className="font-semibold">{formatDate(selectedInvoice.endDate)}</p>
                                    </div>
                                  </div>

                                  <div className="border-t pt-4 space-y-3">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Total Sales:</span>
                                      <span className="font-semibold">
                                        {formatCurrency(selectedInvoice.totalsales)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Commission:</span>
                                      <span className="font-semibold">
                                        {formatCurrency(selectedInvoice.aeronaaComission)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between border-t pt-3">
                                      <span className="text-gray-600 font-semibold">Vendor Net:</span>
                                      <span className="font-bold text-lg">
                                        {formatCurrency(selectedInvoice.vendorNet)}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Status</p>
                                    <Badge
                                      className={`${
                                        selectedInvoice.isPaid
                                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                          : "bg-amber-100 text-amber-700 border-amber-200"
                                      } border font-medium mt-1`}
                                    >
                                      {selectedInvoice.isPaid ? "Paid" : "Pending"}
                                    </Badge>
                                    {selectedInvoice.isPaid && selectedInvoice.paidAt && (
                                      <p className="text-sm text-gray-600 mt-2">
                                        Paid on: {formatDate(selectedInvoice.paidAt)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {/* Mark as Paid */}
                          {!invoice.isPaid && (
                           <Button
  size="sm"
  variant="outline"
  className="gap-2"
  onClick={() => handleMarkPaid(invoice.id)}
>
  <CheckCircle className="h-4 w-4" />
  Mark Paid
</Button>
                          )}

                          {/* Download */}
                         <Button
  size="sm"
  variant="outline"
  className="gap-2 bg-transparent"
  onClick={() => generateInvoicePDF(invoice,vendorName||"")}
>
  <Download className="h-4 w-4" />
  Download
</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
