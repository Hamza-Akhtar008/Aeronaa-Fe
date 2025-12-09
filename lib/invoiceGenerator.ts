import { BookingDetail } from "@/lib/types/booking";
import { Booking, BookingFormData, Ticket } from "@/types/checkout";
import { toast } from "react-toastify";
import { format } from "date-fns";

export const generateFlightInvoicePDF = (
  ticket: Ticket,
  formData: BookingFormData,
  booking?:Booking,
  bookingId: string = `FLT-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
) => {
  const invoiceNumber = `INV-FLT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}`;
  
  // Calculate totals
  const basePrice = ticket.basePrice || 0;
  const taxPrice = ticket.taxPrice || 0;
  const totalPrice = basePrice + taxPrice;
  
  // Format dates
  const departureDate = new Date(ticket.departureTime);
  const arrivalDate = new Date(ticket.arrivalTime);
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Flight Booking - ${invoiceNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
          padding: 40px;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .invoice-header {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          padding: 30px 40px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .invoice-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
          animation: float 20s infinite linear;
        }
        
        @keyframes float {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(-50px) translateY(-50px); }
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        

        .company-name {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -1px;
        }
        
        .tagline {
          font-size: 14px;
          opacity: 0.9;
          margin-top: 5px;
        }
        
        .header-content {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .company-info {
          flex: 1;
        }
        
        .invoice-details {
          text-align: right;
          position: relative;
          z-index: 2;
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .status-badge {
          background: #10b981;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 10px;
          display: inline-block;
          box-shadow: 0 2px 5px rgba(16, 185, 129, 0.3);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        .booking-number, .invoice-number {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 5px;
          letter-spacing: 0.3px;
        }
        
        .booking-date, .invoice-date {
          font-size: 14px;
          opacity: 0.9;
        }
        
        .invoice-body {
          padding: 48px;
          background-color: #fcfcfd;
        }
        
        .flight-summary {
          margin-bottom: 36px;
          background: #f9fafb;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid #f0f0f4;
          position: relative;
          overflow: hidden;
        }
        
        .flight-summary::before {
          content: '✈';
          position: absolute;
          right: -10px;
          top: -30px;
          font-size: 180px;
          color: rgba(59, 130, 246, 0.03);
          transform: rotate(45deg);
          pointer-events: none;
        }
        
        .flight-path {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 30px 0;
          position: relative;
          padding: 20px 0;
        }
        
        .flight-path::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 20%;
          right: 20%;
          height: 3px;
          background: linear-gradient(90deg, #e5e7eb 0%, #3b82f6 50%, #e5e7eb 100%);
          z-index: 1;
          border-radius: 3px;
        }
        
        .flight-path .plane-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          z-index: 2;
          font-size: 20px;
          box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        
        .flight-point {
          text-align: center;
          width: 120px;
          background: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.04);
          border: 1px solid #f0f0f4;
          z-index: 2;
          position: relative;
          transition: transform 0.3s ease;
        }
        
        .flight-point:hover {
          transform: translateY(-5px);
        }
        
        .flight-point .airport {
          font-size: 28px;
          font-weight: 700;
          color: #1e3a8a;
          letter-spacing: 1px;
        }
        
        .flight-point .city {
          font-size: 13px;
          color: #4b5563;
          margin: 4px 0;
          font-weight: 500;
        }
        
        .flight-point .time {
          font-size: 20px;
          font-weight: 700;
          margin-top: 8px;
          color: #111827;
        }
        
        .flight-point .date {
          font-size: 13px;
          color: #4b5563;
          margin-top: 2px;
          letter-spacing: 0.5px;
        }
        
        .flight-details {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 18px;
          margin-top: 30px;
        }
        
        .detail-item {
          background: white;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s ease;
          box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }
        
        .detail-item:hover {
          border-color: #3b82f6;
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.1);
        }
        
        .detail-label {
          font-size: 13px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
          margin-bottom: 5px;
        }
        
        .detail-value {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          letter-spacing: 0.2px;
        }
        
        .passenger-section {
          margin-bottom: 36px;
          padding: 30px;
          background: #f9fafb;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid #f0f0f4;
        }
        
        .section-title {
          color: #1e3a8a;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e5e7eb;
          position: relative;
          display: inline-block;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 60px;
          height: 2px;
          background-color: #3b82f6;
        }
        
        .passenger-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
        }
        
        .passenger-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          transition: transform 0.2s ease;
        }
        
        .passenger-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.05);
          border-color: #d1d5db;
        }
        
        .passenger-name {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 1px dashed #e5e7eb;
        }
        
        .passenger-type {
          background: linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 5px rgba(59, 130, 246, 0.2);
        }
        
        .passenger-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-size: 14px;
          gap: 15px;
          margin-top: 10px;
        }
        
        .passenger-detail {
          display: flex;
          align-items: baseline;
        }
        
        .detail-name {
          width: 110px;
          color: #4b5563;
          font-weight: 500;
          font-size: 13px;
        }
        
        .price-summary {
          background: linear-gradient(to bottom right, #f9fafb, #ffffff);
          border-radius: 16px;
          padding: 25px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 25px rgba(0,0,0,0.03);
          margin-top: 36px;
          position: relative;
          overflow: hidden;
        }
        
        .price-summary::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(to bottom, #3b82f6, #1e40af);
          border-radius: 3px 0 0 3px;
        }
        
        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
          font-size: 15px;
          padding: 4px 0;
        }
        
        .price-label {
          color: #4b5563;
          font-weight: 500;
        }
        
        .price-value {
          font-weight: 600;
          color: #111827;
        }
        
        .price-total {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          padding: 15px 0;
          border-top: 2px solid #e5e7eb;
          font-weight: 700;
          position: relative;
        }
        
        .price-total::before {
          content: '';
          position: absolute;
          top: -2px;
          left: 0;
          width: 60px;
          height: 2px;
          background-color: #3b82f6;
        }
        
        .price-total .price-label {
          font-size: 18px;
          color: #111827;
        }
        
        .price-total .price-value {
          font-size: 24px;
          color: #1e3a8a;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        
        .footer {
          margin-top: 40px;
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          background: #f8f9fa;
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }
        
        .notes-section {
          flex: 1;
          margin-right: 20px;
        }
        
        .notes-title {
          color: #333;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .notes-content {
          color: #666;
          line-height: 1.6;
          font-size: 13px;
        }
        
        .help-section {
          text-align: right;
        }
        
        .help-title {
          color: #333;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .help-email {
          color: #2563eb;
          font-size: 13px;
          text-decoration: none;
        }
        
        .footer-bottom {
          text-align: center;
          color: #6b7280;
          font-size: 12px;
          border-top: 1px solid #e5e7eb;
          padding-top: 15px;
        }
        
        .footer p {
          margin-bottom: 6px;
        }
        
        @media print {
          .invoice-container {
            box-shadow: none;
          }
          
          .flight-point:hover, 
          .detail-item:hover, 
          .passenger-card:hover {
            transform: none;
            box-shadow: inherit;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div class="header-content">
            <div class="company-info">
              <div class="logo-section">
                <img src="/images/Aeronaa-Logo.png" alt="Aeronaa" style="width: 200px; height: 100px; object-fit: contain; margin-right: 20px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="display: none; align-items: center;">
                  <div style="font-size: 32px; font-weight: 700; letter-spacing: -1px; color: white;">AERONAA</div>
                </div>
              </div>
              
            </div>
            <div class="invoice-details">
              <div class="status-badge">${booking?booking.bookingStatus:"RESERVED"}</div>
              ${booking?booking.bookingStatus=="CONFIRMED"?`<div class="booking-number">PNR #: ${booking?.pnrNumber}</div>`:"":""}
              
              <div class="booking-number">Booking ID: ${bookingId}</div>
              <div class="booking-date">Date: ${format(new Date(), 'MMM dd, yyyy')}</div>
            </div>
          </div>
        </div>
        
        <div class="invoice-body">
          <div class="flight-summary">
            <div class="section-title">Flight Details</div>
            
            <div class="flight-path">
              <div class="flight-point">
                <div class="airport">${ticket.departureAirport}</div>
                <div class="city">${ticket.from}</div>
                <div class="time">${format(departureDate, 'HH:mm')}</div>
                <div class="date">${format(departureDate, 'MMM dd, yyyy')}</div>
              </div>
              
              <div class="plane-icon">✈</div>
              
              <div class="flight-point">
                <div class="airport">${ticket.arrivalAirport}</div>
                <div class="city">${ticket.to}</div>
                <div class="time">${format(arrivalDate, 'HH:mm')}</div>
                <div class="date">${format(arrivalDate, 'MMM dd, yyyy')}</div>
              </div>
            </div>
            
            <div class="flight-details">
              <div class="detail-item">
                <div class="detail-label">Airline</div>
                <div class="detail-value">${ticket.airline}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Flight Number</div>
                <div class="detail-value">${ticket.flightNumber}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Class</div>
                <div class="detail-value">${ticket.flightClass}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Trip Type</div>
                <div class="detail-value">${ticket.tripType}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Checked Baggage</div>
                <div class="detail-value">${ticket.checkedBaggage}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Cabin Baggage</div>
                <div class="detail-value">${ticket.cabinnBaggage}</div>
              </div>
            </div>
          </div>
          
          <div class="passenger-section">
            <div class="section-title">Passenger Information</div>
            <div class="passenger-list">
              ${formData.travelers.map((traveler, index) => `
                <div class="passenger-card">
                  <div class="passenger-name">
                    ${traveler.firstName} ${traveler.middleName ? traveler.middleName + ' ' : ''}${traveler.lastName}
                    <span class="passenger-type">${traveler.type.toUpperCase()}</span>
                  </div>
                  <div class="passenger-details">
                    <div class="passenger-detail">
                      <div class="detail-name">Date of Birth:</div>
                      <div>${traveler.dateOfBirth}</div>
                    </div>
                    <div class="passenger-detail">
                      <div class="detail-name">Gender:</div>
                      <div>${traveler.gender}</div>
                    </div>
                    <div class="passenger-detail">
                      <div class="detail-name">Email:</div>
                      <div>${traveler.email || 'N/A'}</div>
                    </div>
                    <div class="passenger-detail">
                      <div class="detail-name">Phone:</div>
                      <div>${traveler.phone || 'N/A'}</div>
                    </div>
                    ${traveler.passportNumber ? `
                      <div class="passenger-detail">
                        <div class="detail-name">Passport No:</div>
                        <div>${traveler.passportNumber}</div>
                      </div>
                      <div class="passenger-detail">
                        <div class="detail-name">Expiry Date:</div>
                        <div>${traveler.passportExpiry || 'N/A'}</div>
                      </div>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="price-summary">
            <div class="section-title">Price Summary</div>
            <div class="price-row">
              <div class="price-label">Base Fare</div>
              <div class="price-value">${ticket.currency} ${basePrice.toFixed(2)}</div>
            </div>
            <div class="price-row">
              <div class="price-label">Taxes & Fees</div>
              <div class="price-value">${ticket.currency} ${taxPrice.toFixed(2)}</div>
            </div>
            <div class="price-total">
              <div class="price-label">Total</div>
              <div class="price-value">${ticket.currency} ${totalPrice.toFixed(2)}</div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-content">
              <div class="notes-section">
                <div class="notes-title">Notes</div>
                <div class="notes-content">
                  Thank you for choosing Aeronaa for your travel needs. We hope you have a pleasant journey!
                </div>
              </div>
              <div class="help-section">
                <div class="help-title">Need Help?</div>
                <a href="mailto:support@aeronaa.com" class="help-email">support@aeronaa.com ↗</a>
              </div>
            </div>
            <div class="footer-bottom">
              <p>Generated on ${new Date().toLocaleString()}</p>
              <p>© ${new Date().getFullYear()} Aeronaa. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Create a new window with the HTML content for PDF generation
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print to PDF
    printWindow.onload = () => {
      // Set the document title for the PDF filename
      printWindow.document.title = `Aeronaa_Flight_Booking_${bookingId}`;
      
      // Trigger print dialog (user can save as PDF)
      printWindow.print();
      
      // Close the window after printing
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
    
    toast.success("Booking confirmation generated successfully! Use Print > Save as PDF to download.");
    return true;
  } else {
    toast.error("Unable to open print window. Please check your browser settings.");
    return false;
  }
};

export const generateInvoicePDF = (
  bookingDetails: BookingDetail[],
  hotelName: string,
  startDate: string,
  endDate: string
) => {
  const totalAmount = bookingDetails.reduce((sum, booking) => sum + booking.amount, 0);
  const invoiceNumber = `INV-HTL-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice - ${invoiceNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
          padding: 40px;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .invoice-header {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          padding: 30px 40px;
          position: relative;
          overflow: hidden;
        }
        
        .invoice-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
          animation: float 20s infinite linear;
        }
        
        @keyframes float {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(-50px) translateY(-50px); }
        }
        
        .header-content {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .company-info {
          flex: 1;
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .company-name {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -1px;
        }
        
        .tagline {
          font-size: 14px;
          opacity: 0.9;
          margin-top: 5px;
        }
        
        .invoice-details {
          text-align: right;
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }
        
        .status-badge {
          background: #10b981;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 10px;
          display: inline-block;
        }
        
        .invoice-number {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .invoice-date {
          font-size: 14px;
          opacity: 0.9;
        }
        
        .invoice-body {
          padding: 40px;
        }
        
        .billing-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        
        .billing-info h3 {
          color: #1e3a8a;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 15px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
        }
        
        .billing-info p {
          margin-bottom: 8px;
          color: #6b7280;
        }
        
        .booking-period {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        
        .period-info h3 {
          color: #1e3a8a;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 15px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
        }
        
        .period-info p {
          margin-bottom: 8px;
          color: #6b7280;
        }
        
        .bookings-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .bookings-table th {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          padding: 15px 12px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
        }
        
        .bookings-table td {
          padding: 15px 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }
        
        .bookings-table tr:nth-child(even) {
          background: #f9fafb;
        }
        
        .bookings-table tr:hover {
          background: #f3f4f6;
        }
        
        .status-active {
          color: #10b981;
          font-weight: 600;
        }
        
        .status-cancelled {
          color: #ef4444;
          font-weight: 600;
        }
        
        .amount-cell {
          font-weight: 600;
          color: #1e3a8a;
        }
        
        .summary-section {
          background: #f8fafc;
          padding: 25px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .summary-row:last-child {
          border-bottom: none;
          font-size: 18px;
          font-weight: 700;
          color: #1e3a8a;
          background: white;
          margin: 15px -15px -15px -15px;
          padding: 20px 15px;
          border-radius: 8px;
        }
        
        .summary-label {
          font-weight: 600;
          color: #374151;
        }
        
        .summary-value {
          font-weight: 600;
          color: #1e3a8a;
        }
        
        .footer {
          margin-top: 40px;
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          background: #f8f9fa;
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }
        
        .notes-section {
          flex: 1;
          margin-right: 20px;
        }
        
        .notes-title {
          color: #333;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .notes-content {
          color: #666;
          line-height: 1.6;
          font-size: 13px;
        }
        
        .help-section {
          text-align: right;
        }
        
        .help-title {
          color: #333;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .help-email {
          color: #2563eb;
          font-size: 13px;
          text-decoration: none;
        }
        
        .footer-bottom {
          text-align: center;
          color: #6b7280;
          font-size: 12px;
          border-top: 1px solid #e5e7eb;
          padding-top: 15px;
        }
        
        .contact-info {
          margin-top: 10px;
        }
        
        @media print {
          body { padding: 0; }
          .invoice-container { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div class="header-content">
            <div class="company-info">
              <div class="logo-section">
                <img src="/images/Aeronaa-Logo.png" alt="Aeronaa" style="width: 200px; height: 100px; object-fit: contain; margin-right: 20px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="display: none; align-items: center;">
                  <div style="font-size: 32px; font-weight: 700; letter-spacing: -1px; color: white;">AERONAA</div>
                </div>
              </div>
            </div>
            <div class="invoice-details">
              <div class="status-badge">Paid</div>
              <div class="invoice-number">Invoice #${invoiceNumber}</div>
              <div class="invoice-date">Issued: ${new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
        
        <div class="invoice-body">
          <div class="billing-section">
            <div class="billing-info">
              <h3>From</h3>
              <p><strong>${hotelName}</strong></p>
              <p>123 Hotel Street</p>
              <p>City, State 12345</p>
              <p>Phone: +92 300 123 4567</p>
            </div>
            <div class="billing-info">
              <h3>Bill To</h3>
              <p><strong>Multiple Guests</strong></p>
              <p>Booking Period Report</p>
              <p>Various Locations</p>
            </div>
          </div>
          
          <div class="booking-period">
            <div class="period-info">
              <h3>Check-in Date</h3>
              <p><strong>${new Date(startDate).toLocaleDateString()}</strong></p>
              <p>Start of booking period</p>
            </div>
            <div class="period-info">
              <h3>Check-out Date</h3>
              <p><strong>${new Date(endDate).toLocaleDateString()}</strong></p>
              <p>End of booking period</p>
            </div>
          </div>
          
          <table class="bookings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Guest Name</th>
                <th>Nights</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${bookingDetails.map((booking, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${booking.user.name}</td>
                  <td>${booking.numberOfDays}</td>
                  <td>${new Date(booking.checkIndate).toLocaleDateString()}</td>
                  <td>${new Date(booking.checkOutDate).toLocaleDateString()}</td>
                  <td class="${booking.isActive ? 'status-active' : 'status-cancelled'}">
                    ${booking.isActive ? 'Active' : 'Cancelled'}
                  </td>
                  <td class="amount-cell">$${booking.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="summary-section">
            <div class="summary-row">
              <span class="summary-label">Subtotal</span>
              <span class="summary-value">$${totalAmount.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Service Charges</span>
              <span class="summary-value">$${(totalAmount * 0.05).toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Discount</span>
              <span class="summary-value" style="color: #ef4444;">-$${(totalAmount * 0.02).toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Taxes (5%)</span>
              <span class="summary-value">$${(totalAmount * 0.05).toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Total</span>
              <span>$${(totalAmount * 1.08).toFixed(2)}</span>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-content">
              <div class="notes-section">
                <div class="notes-title">Notes</div>
                <div class="notes-content">
                  Thank you for choosing Aeronaa Grand. We look forward to your next stay again!
                </div>
              </div>
              <div class="help-section">
                <div class="help-title">Need Help?</div>
                <a href="mailto:booking@aeronaa.com" class="help-email">booking@aeronaa.com ↗</a>
              </div>
            </div>
            <div class="footer-bottom">
              <p>Generated on ${new Date().toLocaleString()}</p>
              <p>© ${new Date().getFullYear()} Aeronaa Hotel Management System. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Create a new window with the HTML content for PDF generation
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print to PDF
    printWindow.onload = () => {
      // Set the document title for the PDF filename
      printWindow.document.title = `Invoice-${invoiceNumber}-${hotelName.replace(/\s+/g, '-')}`;
      
      // Trigger print dialog (user can save as PDF)
      printWindow.print();
      
      // Close the window after printing
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
    
    
    return true;
  } else {
    toast.error("Unable to open print window. Please check your browser settings.");
    return false;
  }
};
