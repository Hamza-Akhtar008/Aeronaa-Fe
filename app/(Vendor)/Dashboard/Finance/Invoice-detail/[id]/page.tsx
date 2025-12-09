// app/Dashboard/Finance/Invoice-detail/[id]/page.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import InvoiceDetail from "@/components/Invoice/invoice-detail";
import { sampleInvoices } from "../../data/invoice";
import { Invoice } from "../../types";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import Link from "next/link";

export default function Invoice_Detail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const invoice: Invoice | undefined = useMemo(
    () => sampleInvoices.find((inv: Invoice) => inv.id === id),
    [id]
  );

  if (!invoice) {
    return (
      <div className="text-red-500 text-center py-10">Invoice not found</div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/Dashboard/Finance" className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Invoice Details</h1>
        </div>
      </div>
      {/* Invoice Details */}
      <InvoiceDetail invoice={invoice} />
    </div>
  );
}
