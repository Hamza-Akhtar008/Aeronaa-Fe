"use client"

import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { saveAs } from "file-saver"
import { Download } from "lucide-react"
import { useState } from "react"

export default function BookingPdfGenerator({ booking }: { booking: UIBooking }) {
  const [showTooltip, setShowTooltip] = useState(false)

  const generatePDF = async () => {
    const doc = await PDFDocument.create()
    const page = doc.addPage([595, 842])
    const { width, height } = page.getSize()
    const margin = 50

    const font = await doc.embedFont(StandardFonts.Helvetica)
    const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)

    const blue = rgb(0.12, 0.32, 0.6)
    const darkBlue = rgb(0.1, 0.25, 0.5)
    const textGray = rgb(0.2, 0.2, 0.25)
    const lightGray = rgb(0.93, 0.94, 0.96)
    const borderGray = rgb(0.85, 0.85, 0.85)

    let y = height - margin

    // === HEADER WITH LOGO AND HOTEL NAME ===
    try {
      const logoBytes = await fetch("/images/Aeronaa-Logo.png").then((res) => res.arrayBuffer())
      const logoImage = await doc.embedPng(logoBytes)
      const logoDims = logoImage.scale(0.15)

      page.drawImage(logoImage, {
        x: margin,
        y: y - logoDims.height + 10,
        width: logoDims.width,
        height: logoDims.height,
      })

      page.drawText(booking.hotel.name, {
        x: margin + logoDims.width + 15,
        y: y - 5,
        size: 20,
        font: boldFont,
        color: blue,
      })
    } catch {
      page.drawText(booking.hotel.name, {
        x: margin,
        y: y - 5,
        size: 20,
        font: boldFont,
        color: blue,
      })
    }

    y -= 25
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.7,
      color: borderGray,
    })
    y -= 30

    // === HOTEL INFORMATION ===
    page.drawText("HOTEL INFORMATION", { x: margin, y, size: 11, font: boldFont, color: blue })
    y -= 18

    const hotelDetails = [
      `Address: ${booking.hotel.Address || "N/A"}`,
      `City: ${booking.hotel.city || "N/A"}`,
    ]
    hotelDetails.forEach((line) => {
      page.drawText(line, { x: margin, y, size: 10, font, color: textGray })
      y -= 14
    })

    y -= 15

    // === BOOKING DETAILS ===
    page.drawText("BOOKING DETAILS", { x: margin, y, size: 11, font: boldFont, color: blue })
    y -= 18

    const checkIn = new Date(booking.checkIndate).toDateString()
    const checkOut = new Date(booking.checkOutDate).toDateString()

    const leftDetails = [
      `Check in: ${checkIn}`,
      `Check out: ${checkOut}`,
      `Guests: ${booking.adults || 2} Adults, ${booking.children || 0} Children`,
    ]

    leftDetails.forEach((line) => {
      page.drawText(line, { x: margin, y, size: 10, font, color: textGray })
      y -= 15
    })

    y -= 10

    page.drawText("BOOKING INFO", { x: width / 2, y: y + 55, size: 11, font: boldFont, color: blue })
    page.drawText(`Booking #: AER-${booking.id}`, {
      x: width / 2,
      y: y + 35,
      size: 10,
      font,
      color: textGray,
    })
    page.drawText(`Status: ${booking.isActive ? "Confirmed" : "Pending"}`, {
      x: width / 2,
      y: y + 20,
      size: 10,
      font,
      color: textGray,
    })

    y -= 30

    // === GUEST SECTION ===
    page.drawText("BOOKED BY", { x: margin, y, size: 11, font: boldFont, color: blue })
    y -= 18

    page.drawText(`${booking.name}${booking.user?.role === "agent" ? " (Agent)" : ""}`, {
      x: margin,
      y,
      size: 10,
      font: boldFont,
      color: textGray,
    })

    y -= 14
    page.drawText(booking.email, { x: margin, y, size: 10, font, color: textGray })

    y -= 30

    // === STAY SUMMARY BOX ===
    const boxHeight = 70
    page.drawRectangle({
      x: margin,
      y: y - boxHeight,
      width: width - 2 * margin,
      height: boxHeight,
      borderWidth: 1,
      borderColor: borderGray,
      color: lightGray,
    })

    page.drawText("Stay Summary", { x: margin + 15, y: y - 18, size: 10, font: boldFont, color: blue })
    page.drawText(`${booking.numberOfDays} Nights`, {
      x: margin + 15,
      y: y - 35,
      size: 10,
      font,
      color: textGray,
    })
    page.drawText(`Room Type: ${booking.room[0]?.roomType || "N/A"}`, {
      x: margin + 15,
      y: y - 50,
      size: 10,
      font,
      color: textGray,
    })

    y -= boxHeight + 30

    // === TOTAL AMOUNT BOX ===
    page.drawRectangle({
      x: margin,
      y: y - 50,
      width: width - 2 * margin,
      height: 50,
      color: blue,
    })
    page.drawText("TOTAL AMOUNT", {
      x: margin + 15,
      y: y - 20,
      size: 11,
      font: boldFont,
      color: rgb(1, 1, 1),
    })
    page.drawText(`$${booking.amount}`, {
      x: width - margin - 80,
      y: y - 20,
      size: 16,
      font: boldFont,
      color: rgb(1, 1, 1),
    })

    y -= 80

    // === CANCELLATION POLICY ===
  page.drawText("CANCELLATION POLICY", { x: margin, y, size: 11, font: boldFont, color: blue })
y -= 18

const policyLines = [
  "1. Free cancellation up to 48 hours before check-in.",
  "2. Cancellations made within 48 hours will incur a charge for one night’s stay.",
  "3. No-shows will be charged the full booking amount.",
  "4. Early departures are non-refundable.",
  "5. In case of unforeseen circumstances, contact customer support for assistance.",
]

policyLines.forEach((line) => {
  page.drawText(line, { x: margin, y, size: 9, font, color: textGray })
  y -= 12
})

y -= 10

    // === FOOTER ===
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.5,
      color: borderGray,
    })

    y -= 25
    page.drawText(
      `Check in from ${booking.hotel.checkInTime}, check out until ${booking.hotel.checkOutTime}.`,
      { x: margin, y, size: 9, font, color: textGray }
    )
    y -= 14
    page.drawText("Thank you for booking with us!", { x: margin, y, size: 9, font, color: darkBlue })

    // Brand footer text (right-aligned)
    page.drawText("Aeronaa.com", {
      x: width - margin - 90,
      y,
      size: 9,
      font: boldFont,
      color: blue,
    })

    const pdfBytes = await doc.save()
    saveAs(new Blob([pdfBytes], { type: "application/pdf" }), `Booking_${booking.id}.pdf`)
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={generatePDF}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="p-2 rounded-md transition-all duration-200 hover:bg-[#1f4e79]/10"
        aria-label="Download Booking PDF"
      >
        <Download className="w-5 h-5 text-[#1f4e79]" />
      </button>

      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1f4e79] text-black text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap">
          Download Booking PDF
        </div>
      )}
    </div>
  )
}
