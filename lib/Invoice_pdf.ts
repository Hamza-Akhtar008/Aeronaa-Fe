import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

interface Invoice {
  id: number
  vendorId: number
  startDate: string
  endDate: string
  totalsales: number
  aeronaaComission: number
  vendorNet: number
  isFlightBooking:boolean
  isPaid: boolean
  paidAt: string | null
  createdAt: string
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)

export async function generateInvoicePDF(invoice: Invoice,vendorName:string) {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4
  const { width, height } = page.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // === Header Section ===
  const logoUrl = "/images/aeronalogo.png"
  const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer())
  const logoImage = await pdfDoc.embedPng(logoBytes)

  const logoWidth = 120
  const logoHeight = 40
  const logoX = 50
  const logoY = height - 80
  page.drawImage(logoImage, { x: logoX, y: logoY, width: logoWidth, height: logoHeight })

 

  // Invoice details under header
  let y = height - 120
  page.drawText(`Invoice ID: #${invoice.id}`, { x: 50, y, size: 12, font })
  y -= 16

invoice.isFlightBooking !== true &&
  (() => {
    page.drawText(`Vendor ID: ${invoice.vendorId}`, { x: 50, y, size: 12, font })
    y -= 16
  })()
 
  if (invoice.isFlightBooking !== true) {
  page.drawText(`Vendor Name: ${vendorName}`, { x: 50, y, size: 12, font })
  y -= 16
}

  
  page.drawText(`Created: ${formatDate(invoice.createdAt)}`, { x: 50, y, size: 12, font })

  // === Table Section ===
  y -= 40
  page.drawText("Invoice Summary", {
    x: 50,
    y,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0.6),
  })

  y -= 20

  const tableX = 50
  const tableWidth = width - 100
  const colWidths = [tableWidth * 0.4, tableWidth * 0.6]
  const rowHeight = 28
const tableData = [
  ["Description", "Amount / Detail"],
  ["Total Bookings Amount", formatCurrency(invoice.totalsales)],
  ["Commission/Sale", formatCurrency(invoice.aeronaaComission)],
  ["Vendor Net", formatCurrency(invoice.vendorNet)],
  ["Period", `${formatDate(invoice.startDate)} to ${formatDate(invoice.endDate)}`],
  ["Status", invoice.isPaid ? "Paid" : "Pending"],
  ...(invoice.isPaid
    ? [["Paid At", invoice.paidAt ? formatDate(invoice.paidAt) : "-"]]
    : []),
]


  // Draw table
  tableData.forEach((row, i) => {
    const rowY = y - i * rowHeight
    const isHeader = i === 0

    // Background color
    page.drawRectangle({
      x: tableX,
      y: rowY - rowHeight + 5,
      width: tableWidth,
      height: rowHeight,
      color: isHeader
        ? rgb(0.2, 0.3, 0.7)
        : i % 2 === 0
        ? rgb(0.96, 0.96, 0.96)
        : rgb(1, 1, 1),
    })

    // Text
    page.drawText(row[0], {
      x: tableX + 10,
      y: rowY - 15,
      size: 12,
      font: isHeader ? boldFont : font,
      color: isHeader ? rgb(1, 1, 1) : rgb(0.1, 0.1, 0.1),
    })
    page.drawText(row[1], {
      x: tableX + colWidths[0] + 10,
      y: rowY - 15,
      size: 12,
      font: isHeader ? boldFont : font,
      color: isHeader ? rgb(1, 1, 1) : rgb(0.1, 0.1, 0.1),
    })

    // Borders (bottom line)
    page.drawLine({
      start: { x: tableX, y: rowY - rowHeight + 5 },
      end: { x: tableX + tableWidth, y: rowY - rowHeight + 5 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    })
  })

  // === Footer Section ===
  const footerY = 80
  page.drawLine({
    start: { x: 50, y: footerY + 25 },
    end: { x: width - 50, y: footerY + 25 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  })

  page.drawText("Thank you for partnering with Aeronaa!", {
    x: 50,
    y: footerY + 5,
    size: 12,
    font,
    color: rgb(0.3, 0.3, 0.3),
  })

  page.drawText("Generated on: " + formatDate(new Date().toISOString()), {
    x: width - 220,
    y: footerY + 5,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5),
  })

  // === Save and Download ===
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `invoice-${invoice.id}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}
