"use client"

import { ArrowUpRight, ArrowDownLeft, FileText } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { generatePDF } from "@/lib/utils/pdf-generator"
import { Button } from "@/components/ui/button"
import { Invoice } from "@/types/invoice"

interface InvoiceRowProps {
  invoice: Invoice
}

export default function InvoiceRow({ invoice }: InvoiceRowProps) {
  const isPayout = invoice.toBePaidBY === "aeronaa"
  const isPayin = invoice.toBePaidBY === "vendor"

  const handleDownloadPDF = async () => {
    await generatePDF(invoice)
  }

  return (
    <tr className="transition-all duration-200 hover:bg-slate-50">
      <td className="px-6 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap">#{invoice.id}</td>
      <td className="px-6 py-4 text-sm text-slate-600">{invoice.vendorId}</td>
      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
        {formatDate(invoice.startDate)} – {formatDate(invoice.endDate)}
      </td>
      <td className="px-6 py-4 text-sm text-right font-medium text-slate-700">
        {formatCurrency(invoice.totalsales)}
      </td>
      <td className="px-6 py-4 text-sm text-right text-rose-500 font-medium">
        –{formatCurrency(invoice.aeronaaComission)}
      </td>
      <td className="px-6 py-4 text-sm text-right font-semibold text-emerald-600">
        {formatCurrency(invoice.vendorNet)}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {isPayout && (
            <>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                <ArrowUpRight className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-sm font-medium text-blue-600">Payout</span>
            </>
          )}
          {isPayin && (
            <>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100">
                <ArrowDownLeft className="w-4 h-4 text-violet-500" />
              </div>
              <span className="text-sm font-medium text-violet-600">Pay-in</span>
            </>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
            invoice.isActive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-200 text-slate-600"
          }`}
        >
          {invoice.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      <td className="px-6 py-4 text-center">
        <Button
          onClick={handleDownloadPDF}
          variant="outline"
          size="sm"
          className="gap-2 bg-transparent hover:bg-slate-100"
        >
          <FileText className="w-4 h-4" />
          Download
        </Button>
      </td>
    </tr>
  )
}
