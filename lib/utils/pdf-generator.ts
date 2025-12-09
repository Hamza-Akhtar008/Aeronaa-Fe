import type { Invoice } from "@/types/invoice"
import { formatCurrency, formatDate, formatDateTime } from "./format"

export async function generatePDF(invoice: Invoice) {
  // Dynamically import html2pdf to avoid SSR issues
  const html2pdf = (await import("html2pdf.js")).default

  const element = document.createElement("div")
  element.innerHTML = generateInvoiceHTML(invoice)

  const opt = {
    margin: 10,
    filename: `invoice-${invoice.id}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
  }

  html2pdf().set(opt).from(element).save()
}

function generateInvoiceHTML(invoice: Invoice): string {
  const isPayout = invoice.toBePaidBY === "aeronaa"

  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
      <!-- Header with Logo -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 20px;">
        <div>
          <h1 style="margin: 0; color: #1e40af; font-size: 28px;">AERONAA</h1>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">Invoice Management System</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; font-weight: bold; font-size: 14px;">Invoice #${invoice.id}</p>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">Generated: ${formatDateTime(new Date().toISOString())}</p>
        </div>
      </div>

      <!-- Invoice Details -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
        <div>
          <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 12px; text-transform: uppercase;">Invoice Period</h3>
          <p style="margin: 5px 0; font-size: 13px;"><strong>Start Date:</strong> ${formatDate(invoice.startDate)}</p>
          <p style="margin: 5px 0; font-size: 13px;"><strong>End Date:</strong> ${formatDate(invoice.endDate)}</p>
        </div>
        <div>
          <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 12px; text-transform: uppercase;">Vendor Information</h3>
          <p style="margin: 5px 0; font-size: 13px;"><strong>Vendor ID:</strong> ${invoice.vendorId}</p>
          <p style="margin: 5px 0; font-size: 13px;"><strong>Status:</strong> ${invoice.isActive ? "Active" : "Inactive"}</p>
        </div>
      </div>

      <!-- Financial Summary -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #f3f4f6; border-bottom: 2px solid #1e40af;">
            <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: bold; color: #1e40af;">Description</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold; color: #1e40af;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px; font-size: 13px;">Total Sales</td>
            <td style="padding: 12px; text-align: right; font-size: 13px; font-weight: bold;">${formatCurrency(invoice.totalsales)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px; font-size: 13px;">Online Received</td>
            <td style="padding: 12px; text-align: right; font-size: 13px;">${formatCurrency(invoice.onlineRecieved)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px; font-size: 13px;">Hotel Received</td>
            <td style="padding: 12px; text-align: right; font-size: 13px;">${formatCurrency(invoice.hotelRecieved)}</td>
          </tr>
          <tr style="border-bottom: 2px solid #1e40af; background-color: #fef3c7;">
            <td style="padding: 12px; font-size: 13px; font-weight: bold;">Aeronaa Commission</td>
            <td style="padding: 12px; text-align: right; font-size: 13px; font-weight: bold; color: #dc2626;">-${formatCurrency(invoice.aeronaaComission)}</td>
          </tr>
          <tr style="background-color: #dcfce7;">
            <td style="padding: 12px; font-size: 14px; font-weight: bold;">Vendor Net Amount</td>
            <td style="padding: 12px; text-align: right; font-size: 14px; font-weight: bold; color: #16a34a;">${formatCurrency(invoice.vendorNet)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Payment Information -->
      <div style="background-color: #f0f9ff; border-left: 4px solid #1e40af; padding: 15px; margin-bottom: 30px;">
        <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 12px; text-transform: uppercase;">Payment Information</h3>
        <p style="margin: 5px 0; font-size: 13px;"><strong>Payment Type:</strong> <span style="color: ${isPayout ? "#2563eb" : "#9333ea"}; font-weight: bold;">${isPayout ? "PAYOUT (Aeronaa to Vendor)" : "PAY-IN (Vendor to Aeronaa)"}</span></p>
        <p style="margin: 5px 0; font-size: 13px;"><strong>Amount to be Paid:</strong> <span style="font-weight: bold; color: #16a34a;">${formatCurrency(invoice.amountToBePaid)}</span></p>
        <p style="margin: 5px 0; font-size: 13px;"><strong>Payment Status:</strong> <span style="color: #16a34a; font-weight: bold;">${invoice.isPaidByAeronaa==true || invoice.isPaidByVendor==true ?"Payment Cleared":"Pending"}</span></p>
      </div>

      <!-- Instructions -->
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 12px; text-transform: uppercase;">Payment Instructions</h3>
        <ol style="margin: 0; padding-left: 20px; font-size: 12px; line-height: 1.6; color: #555;">
          <li>Please review all details carefully before processing payment</li>
          <li>Ensure payment is made within the specified timeframe</li>
          <li>Use invoice number as reference for payment tracking</li>
          <li>Contact support for any discrepancies or questions</li>
          <li>Keep this invoice for your records</li>
        </ol>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; text-align: center; color: #666; font-size: 11px;">
        <p style="margin: 5px 0;">This is an automatically generated invoice. For inquiries, please contact support@aeronaa.com</p>
        <p style="margin: 5px 0;">© 2025 Aeronaa. All rights reserved.</p>
      </div>
    </div>
  `
}
