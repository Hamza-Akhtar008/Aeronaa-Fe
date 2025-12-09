"use client"

import { useEffect, useState } from "react"
import { Invoice } from "@/types/invoice"
import {
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { cn } from "@/lib/utils/utils"
import { PatchInvoiceStatus } from "@/lib/invoice_api"
import { generatePDF } from "@/lib/utils/pdf-generator"

interface InvoiceTableProps {
  invoices: Invoice[]
  title?: string
  description?: string
}

export default function InvoiceTable({
  invoices,
  title = "Vendor Invoices",
  description = "View and manage vendor invoices",
}: InvoiceTableProps) {
  const [localInvoices, setLocalInvoices] = useState(invoices)
  const [loadingId, setLoadingId] = useState<number | null>(null)


  useEffect(()=>
{
setLocalInvoices(invoices);
},[invoices])
  const togglePaymentStatus = async (id: number) => {
    setLocalInvoices((prev) =>
      prev.map((invoice) => {
        if (invoice.id !== id) return invoice

        const isPayout = invoice.toBePaidBY === "aeronaa"
        const isPayin = invoice.toBePaidBY === "vendor"

        if (isPayout) {
          return {
            ...invoice,
            isPaidByAeronaa: invoice.isPaidByAeronaa ? null : true,
            paidByAeronaaDate: invoice.isPaidByAeronaa
              ? null
              : new Date().toISOString(),
          }
        }

        if (isPayin) {
          return {
            ...invoice,
            isPaidByVendor: invoice.isPaidByVendor ? null : true,
            paidByVendorDate: invoice.isPaidByVendor
              ? null
              : new Date().toISOString(),
          }
        }

        return invoice
      })
    )

    const updated = localInvoices.find((inv) => inv.id === id)
    if (!updated) return

    try {
      setLoadingId(id)

      const patchData =
        updated.toBePaidBY === "aeronaa"
          ? {
              isPaidByAeronaa: !updated.isPaidByAeronaa,
              paidByAeronaaDate: !updated.isPaidByAeronaa
                ? new Date().toISOString()
                : null,
            }
          : {
              isPaidByVendor: !updated.isPaidByVendor,
              paidByVendorDate: !updated.isPaidByVendor
                ? new Date().toISOString()
                : null,
            }

      await PatchInvoiceStatus(id, patchData)
    } catch (error) {
      console.error("Failed to patch invoice:", error)
      // Optional rollback logic could go here
    } finally {
      setLoadingId(null)
    }
  }

  
  return (
    <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
      <CardHeader className="border-b border-slate-200 pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
          {title}
          <span className="text-sm text-slate-500 font-medium">
            ({localInvoices.length})
          </span>
        </CardTitle>
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-700">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-xs text-slate-600">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-xs text-slate-600">
                  Vendor ID
                </th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-xs text-slate-600">
                  Period
                </th>
                <th className="px-6 py-3 text-right font-semibold uppercase tracking-wide text-xs text-slate-600">
                  Total Sales
                </th>
                <th className="px-6 py-3 text-right font-semibold uppercase tracking-wide text-xs text-slate-600">
                  Commission
                </th>
                <th className="px-6 py-3 text-right font-semibold uppercase tracking-wide text-xs text-slate-600">
                  Net Amount
                </th>
                <th className="px-6 py-3 text-center font-semibold uppercase tracking-wide text-xs text-slate-600">
                  Direction
                </th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-xs text-slate-600">
                  Status
                </th>
                <th className="px-6 py-3 text-center font-semibold uppercase tracking-wide text-xs text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {localInvoices.length > 0 ? (
                localInvoices.map((invoice) => {
                  const isPayout = invoice.toBePaidBY === "aeronaa"
                  const isPayin = invoice.toBePaidBY === "vendor"
                  const isPaid = isPayout
                    ? invoice.isPaidByAeronaa
                    : invoice.isPaidByVendor

                  const statusText =
                    isPaid === true
                      ? "Paid"
                      : isPaid === null
                      ? "Unpaid"
                      : "Pending"

                  const isLoading = loadingId === invoice.id

                  return (
                    <tr
                      key={invoice.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        #{invoice.id}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {invoice.vendorId}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(invoice.startDate).toLocaleDateString()} –{" "}
                        {new Date(invoice.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900 font-medium">
                        {invoice.totalsales.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-red-500 font-medium">
                        -{invoice.aeronaaComission.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-emerald-600 font-semibold">
                        {invoice.vendorNet.toLocaleString()}
                      </td>

                      {/* Direction */}
                      <td className="px-6 py-4 text-center">
                        <div
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
                            isPayout
                              ? "bg-blue-100 text-blue-700"
                              : isPayin
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-600"
                          )}
                        >
                          {isPayout ? (
                            <>
                              <ArrowUpRight className="h-4 w-4" />
                              <span>Payout</span>
                            </>
                          ) : isPayin ? (
                            <>
                              <ArrowDownLeft className="h-4 w-4" />
                              <span>Pay-in</span>
                            </>
                          ) : (
                            <span>—</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
                            statusText === "Paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : statusText === "Unpaid"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          )}
                        >
                          {statusText}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          {/* Payment Button */}
                          <Button
                            size="sm"
                            disabled={isLoading}
                            className={cn(
                              "gap-2 text-xs font-medium",
                              isPayout
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : isPayin
                                ? "bg-purple-600 hover:bg-purple-700 text-white"
                                : "bg-slate-500 hover:bg-slate-600 text-white"
                            )}
                            onClick={() => togglePaymentStatus(invoice.id)}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : isPaid ? (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                {isPayout
                                  ? "Paid to Vendor"
                                  : "Received from Vendor"}
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4" />
                                {isPayout
                                  ? "Mark as Paid to Vendor"
                                  : "Mark as Received"}
                              </>
                            )}
                          </Button>

                          {/* View / PDF */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-slate-700 border-slate-300 hover:bg-slate-100"
                              onClick={async()=>{
   await generatePDF(invoice)
                              }}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
