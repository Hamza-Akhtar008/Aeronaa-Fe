"use client"

import { useState, useMemo, useEffect } from "react"
import InvoiceTable from "@/components/invoice-table"
import type { Invoice } from "@/types/invoice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils/format"
import { Banknote, FileText, Coins, CheckCircle2 } from "lucide-react"
import { useParams, useSearchParams } from "next/navigation"
import { GetHotelInvoices } from "@/lib/invoice_api"

const sampleInvoices: Invoice[] = [
  {
    id: 6,
    isActive: true,
    createdAt: "2025-10-27T11:45:03.058Z",
    updatedAt: "2025-10-27T11:45:03.058Z",
    startDate: "2025-07-01T16:38:52.588Z",
    endDate: "2025-08-02T16:38:52.588Z",
    vendorId: 171,
    totalsales: 1690356,
    onlineRecieved: 1690356,
    hotelRecieved: 0,
    aeronaaComission: 50710,
    vendorNet: 1639646,
    isPaidByAeronaa: null,
    isPaidByVendor: null,
    paidByAeronaaDate: "2025-08-03T10:00:00.000Z",
    paidByVendorDate: null,
    toBePaidBY: "aeronaa",
    amountToBePaid: 1639646,
  },
]
export default function VendorInvoicesPage() {
  const params = useParams()
  const vendorId = Number(params?.vendorId)
  const searchParams = useSearchParams()
const vendorName = searchParams?.get("name")

  const [invoices,setInvoices] = useState<Invoice[]>([])

  useEffect(()=>
{
const getinvoice = async()=>
{
    const response = await GetHotelInvoices(vendorId)
setInvoices(response);
}
getinvoice();
},[])
  // Overview stats
  const stats = useMemo(() => {
    const totalInvoices = invoices.length
    const paidInvoices = invoices?.filter((inv) => inv.isPaidByAeronaa || inv.isPaidByVendor).length
    const totalIncome = invoices?.reduce((sum, inv) => sum + inv.totalsales, 0)
    const totalCommission = invoices?.reduce((sum, inv) => sum + inv.aeronaaComission, 0)

    return { totalInvoices, paidInvoices, totalIncome, totalCommission }
  }, [invoices])

  return (
    <main className="min-h-screen  py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-black mb-2">Invoice Management</h1>
          <p className="text-black-400">Track and manage vendor payments and payouts</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-gray-800 text-lg font-semibold">Total Invoices</CardTitle>
              <FileText className="text-blue-500 h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.totalInvoices}</p>
              <p className="text-sm text-gray-500 mt-1">Overall generated invoices</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-gray-800 text-lg font-semibold">Paid Invoices</CardTitle>
              <CheckCircle2 className="text-green-500 h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.paidInvoices}</p>
              <p className="text-sm text-gray-500 mt-1">Completed and paid</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-gray-800 text-lg font-semibold">Total Income</CardTitle>
              <Banknote className="text-emerald-500 h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalIncome)}</p>
              <p className="text-sm text-gray-500 mt-1">Gross vendor sales</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-gray-800 text-lg font-semibold">Commission</CardTitle>
              <Coins className="text-yellow-500 h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalCommission)}</p>
              <p className="text-sm text-gray-500 mt-1">Aeronaa’s total commission</p>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Table */}
        <InvoiceTable invoices={invoices} />
      </div>
    </main>
  )
}
