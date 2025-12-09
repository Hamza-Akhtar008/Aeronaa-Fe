"use client"

import { useEffect, useState } from "react"
import { Filter, Eye, Calendar, Users, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign, Calculator } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GetallInvoices, GetAllInvoicesByType, MonthWiseBookingVendor } from "@/lib/api"

// Types for invoice data
interface VendorTotal {
  vendorId: number | null
  vendorName: string | null
  onlineTotal: string
  payAtHotelTotal: string
  total: string
}

interface MonthWiseTotal {
  month: string
  onlineTotal: string
  payAtHotelTotal: string
  total: string
}

interface MonthWiseVendorTotal {
  vendorId: number | null
  vendorName: string | null
  month: string
  onlineTotal: string
  payAtHotelTotal: string
  total: string
}
interface SettlementBreakdown {
  totalEarnings: number
  commission: number
  aeronaSetslement: number // Positive = vendor receives from Aerona, Negative = vendor owes to Aerona
  payAtHotelAmount: number // What guests pay directly to vendor
  vendorTotalReceived: number // Total amount vendor gets (from Aerona + PayAtHotel)
}
interface InvoiceData {
  totalPayments: {
    onlineTotal: string
    payAtHotelTotal: string
    total: string
  }
  monthWiseTotals: MonthWiseTotal[]
  vendorTotals: VendorTotal[]
  monthWiseVendorTotals: MonthWiseVendorTotal[]
}

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.parseFloat(amount))
}

const formatMonth = (monthStr: string) => {
  const date = new Date(monthStr + "-01")
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
}

const calculateSettlement = (onlineTotal: number, hotelTotal: number): SettlementBreakdown => {
  const totalEarnings = onlineTotal + hotelTotal
  const commission = totalEarnings * 0.03 // 3% commission

  const aeronaSetslement = onlineTotal - commission // Positive = vendor receives, Negative = vendor owes
  const payAtHotelAmount = hotelTotal // Guests pay this directly to vendor
  const vendorTotalReceived = Math.max(0, aeronaSetslement) + payAtHotelAmount

  return {
    totalEarnings,
    commission,
    aeronaSetslement,
    payAtHotelAmount,
    vendorTotalReceived,
  }
}

const calculateCommissionBreakdown = (total: string, online: string, payAtHotel: string) => {
  const totalAmount = Number.parseFloat(total)
  const onlineAmount = Number.parseFloat(online)
  const hotelAmount = Number.parseFloat(payAtHotel)

  // 3% commission
  const commission = totalAmount * 0.03

  let commissionFromOnline = 0
  let commissionFromHotel = 0
  let vendorReceivesFromAerona = 0
  let vendorOwesToAerona = 0

  if (onlineAmount >= commission) {
    commissionFromOnline = commission
    vendorReceivesFromAerona = onlineAmount - commission
  } else {
    commissionFromOnline = onlineAmount
    commissionFromHotel = commission - onlineAmount
    vendorOwesToAerona = commissionFromHotel
  }

  return {
    commission,
    commissionFromOnline,
    commissionFromHotel,
    vendorReceivesFromAerona,
    vendorOwesToAerona,
    finalVendorAmount: hotelAmount - commissionFromHotel + vendorReceivesFromAerona,
  }
}

// Normalize different API invoice shapes (hotel has online/payAtHotel; car/umrah may only have Total)
const normalizeInvoiceResponse = (resp: any) => {
  // defensive defaults
  const totalPaymentsRaw = resp?.totalPayments || {}

  // Try to extract online and payAtHotel values. If only a single Total exists, treat it as online.
  const onlineTotalStr =
    totalPaymentsRaw.onlineTotal ?? totalPaymentsRaw.Online ?? totalPaymentsRaw.Total ?? totalPaymentsRaw.total ?? "0"
  const payAtHotelTotalStr =
    totalPaymentsRaw.payAtHotelTotal ?? totalPaymentsRaw.payAtHotel ?? totalPaymentsRaw.PayAtHotel ?? "0"

  const totalStr =
    totalPaymentsRaw.total ?? totalPaymentsRaw.Total ?? String(Number.parseFloat(onlineTotalStr || "0") + Number.parseFloat(payAtHotelTotalStr || "0"))

  // Normalize monthWiseTotals: ensure fields onlineTotal/payAtHotelTotal/total exist
  const monthWiseTotals = Array.isArray(resp?.monthWiseTotals)
    ? resp.monthWiseTotals.map((m: any) => ({
        month: m.month,
        onlineTotal: m.onlineTotal ?? m.Online ?? m.total ?? m.Total ?? "0",
        payAtHotelTotal: m.payAtHotelTotal ?? m.payAtHotel ?? "0",
        total: m.total ?? m.Total ?? (m.onlineTotal ?? m.Total ?? "0"),
      }))
    : []

  const vendorTotals = Array.isArray(resp?.vendorTotals)
    ? resp.vendorTotals.map((v: any) => ({
        vendorId: v.vendorId ?? v.id ?? null,
        vendorName: v.vendorName ?? v.name ?? null,
        onlineTotal: v.onlineTotal ?? v.Total ?? v.total ?? "0",
        payAtHotelTotal: v.payAtHotelTotal ?? v.payAtHotel ?? "0",
        total: v.total ?? v.Total ?? (v.onlineTotal ?? "0"),
      }))
    : []

  const monthWiseVendorTotals = Array.isArray(resp?.monthWiseVendorTotals)
    ? resp.monthWiseVendorTotals.map((mv: any) => ({
        vendorId: mv.vendorId ?? mv.id ?? null,
        vendorName: mv.vendorName ?? mv.vendorName ?? null,
        month: mv.month,
        onlineTotal: mv.onlineTotal ?? mv.Total ?? mv.total ?? "0",
        payAtHotelTotal: mv.payAtHotelTotal ?? mv.payAtHotel ?? "0",
        total: mv.total ?? mv.Total ?? (mv.onlineTotal ?? "0"),
      }))
    : []

  return {
    totalPayments: {
      onlineTotal: String(onlineTotalStr),
      payAtHotelTotal: String(payAtHotelTotalStr),
      total: String(totalStr),
    },
    monthWiseTotals,
    vendorTotals,
    monthWiseVendorTotals,
  }
}

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<"hotel" | "car" | "flight" | "umrah">("hotel")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedVendor, setSelectedVendor] = useState<VendorTotal | null>(null)
  const [selectedMonthData, setSelectedMonthData] = useState<MonthWiseVendorTotal | null>(null)
  const [selectedBookings, setSelectedBookings] = useState<any[] | null>(null)

  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)

   const [currentPageMonth, setCurrentPageMonth] = useState(1);

   const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalPagesMonth = selectedBookings
    ? Math.ceil(selectedBookings.length / itemsPerPage)
    : 1;

  const startIndexMonth = (currentPageMonth - 1) * itemsPerPage;
  const currentBookings = selectedBookings
    ? selectedBookings.slice(startIndexMonth, startIndexMonth + itemsPerPage)
    : [];
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    month: "all",
    vendor: "all",
  })

  useEffect(() => {
    const fetchAllInvoice = async () => {
      setIsLoading(true)
      setInvoiceData(null)
      try {
        const typeMap: Record<string, string> = {
          hotel: "hotels",
          car: "cars",
          umrah: "umrah",
          flight: "flights",
        }

        const apiType = typeMap[activeTab] || "hotels"
        const response = await GetAllInvoicesByType(apiType)
        const normalized = normalizeInvoiceResponse(response)
        setInvoiceData(normalized as any)
      } catch (err) {
        // Fallback to the legacy hotels endpoint
        try {
          const response = await GetallInvoices()
          
          const normalized = normalizeInvoiceResponse(response)
          setInvoiceData(normalized as any)
        } catch (e) {
          // If everything fails, keep invoiceData null and optionally report
          setInvoiceData(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllInvoice()
  }, [activeTab])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!invoiceData) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">No invoice data available.</div>
      </div>
    )
  }

  // Filter vendor totals
  const filteredVendors = invoiceData.vendorTotals.filter((vendor) => {
    const monthFilter =
      filters.month === "all" ||
      invoiceData.monthWiseVendorTotals.some((mv) => mv.vendorId === vendor.vendorId && mv.month === filters.month)

    const vendorFilter = filters.vendor === "all" || vendor.vendorName === filters.vendor

    return monthFilter && vendorFilter
  })

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentVendors = filteredVendors.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }


  const monthwisebookingforvendor = async (vendorId: string | null, month: string) => {
  try {
    const response = await MonthWiseBookingVendor(vendorId||"", month);
    setSelectedBookings(response)
setCurrentPageMonth(1); // Reset to first page when new bookings are loaded
  } catch (error) {
    
  }
  
  }

  return (
    <div className="space-y-8 animate-fade-in p-6">
      {/* Header */}
        <div className="flex gap-3">
              {[
                { key: "hotel", label: "Hotel Payments" },
                { key: "car", label: "Car Payments" },
                
                
                { key: "umrah", label: "Umrah Payments" },
                { key: "flight", label: "Flight Payments" },
              ].map((tab) => (
                <Button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key as any)
                    setCurrentPage(1)
                  }}
                  className={`rounded-full px-6 ${
                    activeTab === tab.key ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Invoice Management</h1>
          <p className="text-gray-600 mt-2">Track payments and vendor invoices</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Payments */}
        <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(invoiceData.totalPayments.total)}</div>
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <span>
                Online: {" "}
                <strong className="text-blue-600">{formatCurrency(invoiceData.totalPayments.onlineTotal)}</strong>
              </span>
              {activeTab === "hotel" && (
                <span>
                  Pay at Hotel: {" "}
                  <strong className="text-purple-600">{formatCurrency(invoiceData.totalPayments.payAtHotelTotal)}</strong>
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Recent Months */}
        {invoiceData.monthWiseTotals
          .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())
          .slice(0, 3)
          .map((month, index, sortedArr) => {
            const previousMonth = sortedArr[index + 1]
            const growth =
              previousMonth && Number.parseFloat(previousMonth.total) !== 0
                ? ((Number.parseFloat(month.total) - Number.parseFloat(previousMonth.total)) /
                    Number.parseFloat(previousMonth.total)) *
                  100
                : null

            return (
              <Card key={month.month} className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{formatMonth(month.month)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(month.total)}</div>
                  <div className="flex gap-3 mt-1 text-sm text-gray-600">
                    <span>
                      Online: <strong className="text-blue-600">{formatCurrency(month.onlineTotal)}</strong>
                    </span>
                    {activeTab === "hotel" && (
                      <span>
                        Pay at Hotel: <strong className="text-purple-600">{formatCurrency(month.payAtHotelTotal)}</strong>
                      </span>
                    )}
                  </div>
                  {growth !== null && (
                    <div
                      className={`flex items-center gap-1 text-sm mt-2 ${
                        growth >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {Math.abs(growth).toFixed(1)}%
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
      </div>

      {/* Vendor Payments Table */}
      {activeTab!="flight" &&
       <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Vendor Payments ({filteredVendors.length})
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Manage vendor payments and invoice totals
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="font-semibold text-gray-700">Vendor ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Vendor Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Total Amount</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentVendors.map((vendor) => (
                  <TableRow key={vendor.vendorId || "unknown"} className="border-gray-100 hover:bg-gray-50">
                    <TableCell>
                      <div className="font-bold text-gray-900">#{vendor.vendorId || "Api"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {vendor.vendorName ? vendor.vendorName.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{vendor.vendorName || "Agoda"}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-lg text-green-600">{formatCurrency(vendor.total)}</div>
                      <div className="text-sm text-gray-600">
                        Online: <span className="text-blue-600">{formatCurrency(vendor.onlineTotal)}</span>
                        {activeTab === "hotel" && (
                          <>
                            {" "}| Hotel: {" "}
                            <span className="text-purple-600">{formatCurrency(vendor.payAtHotelTotal)}</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
                            onClick={() => setSelectedVendor(vendor)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto rounded-3xl border-0 shadow-2xl">
                          <DialogHeader className="pb-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <DialogTitle className="text-3xl font-bold text-gray-900">
                                  {selectedVendor?.vendorName || "Agoda"}
                                </DialogTitle>
                                <DialogDescription className="text-gray-600 mt-2 text-lg">
                                  Vendor ID: #{selectedVendor?.vendorId || "api"}
                                </DialogDescription>
                              </div>
                              <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-2 rounded-full text-lg font-semibold">
                                {formatCurrency(selectedVendor?.total || "0")}
                              </Badge>
                            </div>
                          </DialogHeader>

                          {selectedVendor && (
                            <div className="space-y-6 py-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Monthly Breakdown */}
                                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-3xl border border-green-200">
                                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                                      <Calendar className="h-5 w-5" />
                                    </div>
                                    Monthly Breakdown
                                  </h3>
                                  <div className="space-y-3">
                                    {invoiceData.monthWiseVendorTotals
                                      .filter((mv) => mv.vendorId === selectedVendor.vendorId)
                                      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
                                      .map((monthData) => (
                                        <div
                                          key={monthData.month}
                                          className="p-4 bg-white rounded-xl shadow-sm space-y-3 border border-gray-100"
                                        >
                                          <div className="flex justify-between font-semibold text-gray-700 border-b border-gray-100 pb-2">
                                            <span>{formatMonth(monthData.month)}:</span>
                                            <span className="text-green-600">{formatCurrency(monthData.total)}</span>
                                          </div>

                                          {/* Original Earnings */}
                                          <div className="text-sm space-y-1">
                                            <div className="flex justify-between text-gray-600">
                                              <span>Online Received:</span>
                                              <span className="text-blue-600 font-medium">
                                                {formatCurrency(monthData.onlineTotal)}
                                              </span>
                                            </div>
                                            {activeTab === "hotel" && (
                                              <div className="flex justify-between text-gray-600">
                                                <span>Received at Hotel:</span>
                                                <span className="text-purple-600 font-medium">
                                                  {formatCurrency(monthData.payAtHotelTotal)}
                                                </span>
                                              </div>
                                            )}
                                          </div>

                                          {/* Settlement Modal Button */}
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl border-gray-200 hover:bg-gray-50 mt-3"
                                            onClick={() => setSelectedMonthData(monthData)}
                                          >
                                            View Settlement Details
                                          </Button>
{selectedVendor.vendorId&& activeTab=="hotel"&& <Button
  variant="outline"
  size="sm"
  className="rounded-xl border-gray-200 hover:bg-gray-50 mt-4 ml-3 px-8"
  onClick={() => {
 monthwisebookingforvendor(String(selectedVendor.vendorId), monthData.month);

  }}
>
  View Details
</Button>}
                                        

                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>}
     

      {/* Settlement Modal */}
  <Dialog open={!!selectedMonthData} onOpenChange={() => setSelectedMonthData(null)}>
  <DialogContent className="max-w-3xl rounded-3xl border-0 shadow-2xl">
    {selectedMonthData && (() => {
      const settlement = calculateSettlement(
        Number(selectedMonthData.onlineTotal),
        Number(selectedMonthData.payAtHotelTotal)
      )

      return (
        <>
          <DialogHeader className="pb-4 border-b border-gray-100">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {formatMonth(selectedMonthData.month)} Settlement
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Vendor ID: #{selectedVendor?.vendorId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Commission Breakdown */}
            <Card className="border-0 bg-orange-50 shadow-lg rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-orange-900 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-orange-600" />
                  Commission Breakdown (3%)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between p-3 bg-orange-100 rounded-xl">
                  <span className="font-semibold text-orange-800">Total Commission:</span>
                  <span className="font-bold text-orange-900">{formatCurrency(String(settlement.commission))}</span>
                </div>
                <div className="text-sm text-gray-600 p-3 bg-white rounded-xl">
                  Commission is deducted from online payments first. If online is insufficient, Vendor owe the remaining
                  amount to Aerona.
                </div>
              </CardContent>
            </Card>

            {/* Final Settlement Card */}
            <Card className="border-0 bg-green-50 shadow-lg rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-green-900 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Your Settlement Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {settlement.aeronaSetslement >= 0 ? (
                  <div className="flex justify-between p-3 bg-green-100 rounded-xl">
                    <span className="font-semibold text-green-800">You owe to Vendor:</span>
                    <span className="font-bold text-green-900 text-lg">
                      {formatCurrency(String(settlement.aeronaSetslement))}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between p-3 bg-red-100 rounded-xl">
                    <span className="font-semibold text-red-800">Vendor owe to Aerona:</span>
                    <span className="font-bold text-red-900 text-lg">
                      {formatCurrency(String(Math.abs(settlement.aeronaSetslement)))}
                    </span>
                  </div>
                )}

                {activeTab === "hotel" && (
                  <div className="flex justify-between p-3 bg-purple-100 rounded-xl">
                    <span className="font-semibold text-purple-800">Guests pay at Hotel directly:</span>
                    <span className="font-bold text-purple-900">{formatCurrency(String(settlement.payAtHotelAmount))}</span>
                  </div>
                )}
{/* 
                <div className="flex justify-between p-3 bg-blue-100 rounded-xl border-2 border-blue-200">
                  <span className="font-bold text-blue-800">Your Total Received:</span>
                  <span className="font-bold text-blue-900 text-xl">
                    {formatCurrency(String(settlement.vendorTotalReceived))}
                  </span>
                </div> */}

                <div className="text-sm text-gray-500 text-right">
                  For {formatMonth(selectedMonthData.month)}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )
    })()}
  </DialogContent>
</Dialog>

      {/* Pagination */}
         {activeTab!="flight" &&
          <div className="flex justify-center items-center gap-3 mt-6">
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-gray-200"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-gray-600 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-gray-200"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
         }
     

      {/* Booking Details Modal */}
  <Dialog open={!!selectedBookings} onOpenChange={() => setSelectedBookings(null)}>
      <DialogContent className="max-w-5xl rounded-3xl border-0 shadow-2xl overflow-hidden">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Booking Details
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Showing all bookings for{" "}
            {selectedMonthData?.vendorName || "this vendor"}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100">
                <TableHead className="font-semibold text-gray-700">Booking ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Check-In</TableHead>
                <TableHead className="font-semibold text-gray-700">Check-Out</TableHead>
                <TableHead className="font-semibold text-gray-700">Days</TableHead>
                <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                <TableHead className="font-semibold text-gray-700">Payment Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                <TableHead className="font-semibold text-gray-700">Created At</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentBookings.length > 0 ? (
                currentBookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    className="border-gray-100 hover:bg-gray-50"
                  >
                    <TableCell className="font-semibold text-gray-900">
                      #{booking.id}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.checkIndate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{booking.numberOfDays}</TableCell>
                    <TableCell className="font-bold text-green-700">
                      ${booking.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          booking.paymentType === "payathotel"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      >
                        {booking.paymentType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">
                          {booking.name || "N/A"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {booking.email || "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-6">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {selectedBookings && selectedBookings.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-3 mt-5">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-gray-200"
              onClick={() => setCurrentPageMonth((prev) => Math.max(1, prev - 1))}
              disabled={currentPageMonth === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-gray-600 font-medium">
              Page {currentPageMonth} of {totalPagesMonth}
            </span>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-gray-200"
              onClick={() =>
                setCurrentPageMonth((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPageMonth === totalPagesMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>

    </div>
  )
}
