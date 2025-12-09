"use client"

import { useEffect, useState } from "react"
import { Users, Calculator, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GetVendorInvoices } from "@/lib/api"
import { useAuth } from "@/store/authContext"

// Types
interface VendorInvoice {
  vendorId: number
  vendorName: string
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

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === "string" ? Number.parseFloat(amount?.trim() || "0") : amount
  if (isNaN(num)) return "$0.00"
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num)
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

export default function VendorInvoicesPage() {
  const { auth, loading } = useAuth()
  const [vendorId, setVendorId] = useState<number>(0)
  const [vendorData, setVendorData] = useState<VendorInvoice | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [isFetching, setIsFetching] = useState(false)
  const [settlement, setSettlement] = useState<SettlementBreakdown | null>(null)

  useEffect(() => {
    if (!loading && auth?.id) {
      setVendorId(auth.id)
    }
  }, [loading, auth])

  useEffect(() => {
    const fetchData = async () => {
      if (!vendorId || !selectedMonth) return
      setIsFetching(true)
      try {
        const response = await GetVendorInvoices(vendorId, selectedMonth)
        console.log("API Response:", response)
        const data = response[0]
        setVendorData(data)

        if (data) {
          const onlineTotal = Number.parseFloat(data.onlineTotal || "0")
          const hotelTotal = Number.parseFloat(data.payAtHotelTotal || "0")
          const settlementCalc = calculateSettlement(onlineTotal, hotelTotal)
          setSettlement(settlementCalc)
        } else {
          setSettlement(null)
        }
      } catch (err) {
        console.error("Failed to fetch vendor invoices", err)
        setSettlement(null)
        setVendorData(null)
      } finally {
        setIsFetching(false)
      }
    }
    fetchData()
  }, [vendorId, selectedMonth])

  if (loading) {
    return <p className="text-center text-gray-500">Loading authentication...</p>
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">My Invoices</h1>
          <p className="text-gray-600 mt-2">Track your payments and commission breakdown</p>
        </div>
        {settlement && (
          <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-2 rounded-full text-lg font-semibold">
            {formatCurrency(settlement.vendorTotalReceived)}
          </Badge>
        )}
      </div>

     {/* Month Selector */}
{/* Month Selector */}
<div className="max-w-xs">
  <label className="text-sm font-semibold text-gray-700">Select Month</label>
  <Select value={selectedMonth} onValueChange={(value) => setSelectedMonth(value)}>
    <SelectTrigger className="rounded-xl border-gray-200 mt-1">
      <SelectValue placeholder="Choose a month" />
    </SelectTrigger>

    {/* Force dropdown to always open downward */}
    <SelectContent  className="z-[99999]" side="bottom" align="start" avoidCollisions={false} sideOffset={4}>
      {Array.from({ length: 12 }).map((_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const value = d.toISOString().slice(0, 7)
        return (
          <SelectItem key={value} value={value}>
            {d.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </SelectItem>
        )
      })}
    </SelectContent>
  </Select>
</div>


      {/* Vendor Summary */}
      {isFetching && <p className="text-gray-500 text-center">Fetching invoices...</p>}

      {!isFetching && !selectedMonth && (
        <p className="text-gray-500 text-center">Please select a month</p>
      )}

      {!isFetching && selectedMonth && (!vendorData || !settlement) && (
        <p className="text-gray-500 text-center">No Result Found</p>
      )}

      {!isFetching && vendorData && settlement && selectedMonth && (
        <div className="grid gap-6">
          {/* Original Earnings Card */}
          <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                {vendorData.vendorName} - Original Earnings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Total Earnings:</span>
                <span className="font-bold text-gray-900">{formatCurrency(settlement.totalEarnings)}</span>
              </div>
              <div className="flex justify-between p-3 bg-blue-50 rounded-xl">
                <span className="font-semibold text-gray-700">Online:</span>
                <span className="font-bold text-blue-600">{formatCurrency(vendorData.onlineTotal)}</span>
              </div>
              <div className="flex justify-between p-3 bg-purple-50 rounded-xl">
                <span className="font-semibold text-gray-700">Pay at Hotel:</span>
                <span className="font-bold text-purple-600">{formatCurrency(vendorData.payAtHotelTotal)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Commission Breakdown Card */}
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
                <span className="font-bold text-orange-900">{formatCurrency(settlement.commission)}</span>
              </div>
              <div className="text-sm text-gray-600 p-3 bg-white rounded-xl">
                Commission is deducted from online payments first. If online is insufficient, you owe the remaining
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
                  <span className="font-semibold text-green-800">You receive from Aerona:</span>
                  <span className="font-bold text-green-900 text-lg">
                    {formatCurrency(settlement.aeronaSetslement)}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between p-3 bg-red-100 rounded-xl">
                  <span className="font-semibold text-red-800">You owe to Aerona:</span>
                  <span className="font-bold text-red-900 text-lg">
                    {formatCurrency(Math.abs(settlement.aeronaSetslement))}
                  </span>
                </div>
              )}

              <div className="flex justify-between p-3 bg-purple-100 rounded-xl">
                <span className="font-semibold text-purple-800">Guests pay you directly:</span>
                <span className="font-bold text-purple-900">{formatCurrency(settlement.payAtHotelAmount)}</span>
              </div>

              <div className="flex justify-between p-3 bg-blue-100 rounded-xl border-2 border-blue-200">
                <span className="font-bold text-blue-800">Your Total Received:</span>
                <span className="font-bold text-blue-900 text-xl">
                  {formatCurrency(settlement.vendorTotalReceived)}
                </span>
              </div>

              <div className="text-sm text-gray-500 text-right">For {formatMonth(selectedMonth)}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
