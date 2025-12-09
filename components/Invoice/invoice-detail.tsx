// components/InvoiceDetail.tsx
"use client";

import { Invoice } from "@/app/(Vendor)/Dashboard/Finance/types";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";


export default function InvoiceDetail({ invoice }: { invoice: Invoice }) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-3xl mx-auto text-sm font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <Image
            src="/images/Aeronaa-Logo.png"
            alt="Aeronaa"
            width={140}
            height={70}
            priority
            className="h-auto w-auto"
          />
          <p className="text-xs text-gray-500 mt-1">www.aeronaa.com</p>
        </div>
        <div className="text-right">
          <span
  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-1
    ${
      invoice.status === "Paid"
        ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
        : invoice.status === "Unpaid"
        ? "bg-gradient-to-r from-red-400 to-red-600 text-white"
        : invoice.status === "Pending"
        ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white"
        : "bg-gray-300 text-gray-800"
    }
  `}
>
  {invoice.status}
</span>
          <h2 className="text-lg font-bold tracking-wide">{`Invoice #${invoice.invoiceNumber}`}</h2>
          <p className="text-xs text-gray-500">
            Issued: {new Date(invoice.checkIn).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Hotel and Guest Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm">
        <div>
          <h3 className="font-semibold text-gray-700 mb-1">From</h3>
          <p className="font-medium">Aeronaa Grand Hotel</p>
          <p className="text-gray-600 text-xs">123 Skyline Avenue · Islamabad, PK</p>
          <p className="text-gray-600 text-xs">Phone: +92 300 123 4567</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-1">To</h3>
          <p className="font-medium">{invoice.guest.name}</p>
          <p className="text-gray-600 text-xs">{invoice.guest.address}</p>
          <p className="text-gray-600 text-xs">Phone: {invoice.guest.phone}</p>
        </div>
      </div>

      {/* Booking Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-gray-700 mb-1">Check-in</h3>
          <p>{new Date(invoice.checkIn).toLocaleDateString()}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-1">Check-out</h3>
          <p>{new Date(invoice.checkOut).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-800 text-white text-left">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Room Type</th>
              <th className="px-4 py-2 text-right">Nights</th>
              <th className="px-4 py-2 text-right">Rate</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {invoice.rooms.map((room, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  <span className="font-medium">{room.type}</span>
                  <p className="text-gray-500 text-xs">{room.description}</p>
                </td>
                <td className="px-4 py-2 text-right">{room.nights}</td>
                <td className="px-4 py-2 text-right">
                  ${room.rate.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right font-medium">
                  ${(room.nights * room.rate).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex flex-col items-end space-y-1 text-sm mb-6">
        <div className="flex justify-between w-full md:w-1/2">
          <span className="text-gray-600">Subtotal</span>
          <span>${invoice.pricing.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-full md:w-1/2">
          <span className="text-gray-600">Service Charges</span>
          <span>${invoice.pricing.serviceCharges.toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-full md:w-1/2">
          <span className="text-gray-600">Discount</span>
          <span className="text-red-600">- ${invoice.pricing.discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-full md:w-1/2">
          <span className="text-gray-600">Taxes (5%)</span>
          <span>${invoice.pricing.taxes.toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-full md:w-1/2 border-t pt-2 font-semibold text-base">
          <span>Total</span>
          <span>${invoice.pricing.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Notes and Contact */}
      <div className="flex flex-col md:flex-row justify-between text-sm border-t pt-4">
        <div className="mb-3 md:mb-0">
          <h3 className="font-medium mb-1">Notes</h3>
          <p className="text-gray-600 max-w-xs">
            Thank you for choosing Aeronaa Grand. We look forward to your stay again!
          </p>
        </div>
        <div className="text-right">
          <h3 className="font-medium mb-1">Need Help?</h3>
          <a
            href="mailto:booking@aeronaa.com"
            className="text-blue-600 hover:underline inline-flex items-center"
          >
            booking@aeronaa.com
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
