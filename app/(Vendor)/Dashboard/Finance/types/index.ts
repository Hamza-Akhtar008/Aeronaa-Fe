export type InvoiceRoom = {
  id: number;
  type: string;
  description: string;
  nights: number;
  rate: number;
  total: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  issueDate: string; // ISO string or formatted
  status: "Paid" | "Unpaid" | "Pending";
  hotel: {
    name: string;
    address: string;
    phone: string;
    website: string;
    logoUrl: string;
  };
  guest: {
    name: string;
    address: string;
    phone: string;
  };
  checkIn: string;
  checkOut: string;
  rooms: InvoiceRoom[];
  pricing: {
    subtotal: number;
    serviceCharges: number;
    discount: number;
    taxes: number;
    total: number;
    currency: string;
  };
  notes: string;
  contactEmail: string;
};
