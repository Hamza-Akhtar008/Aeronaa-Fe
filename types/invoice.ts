export interface Invoice {
  id: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  startDate: string
  endDate: string
  vendorId: number
  totalsales: number
  onlineRecieved: number
  hotelRecieved: number
  aeronaaComission: number
  vendorNet: number
  isPaidByAeronaa: boolean | null
  isPaidByVendor: boolean | null
  paidByAeronaaDate: string | null
  paidByVendorDate: string | null
  toBePaidBY: "aeronaa" | "vendor"
  amountToBePaid: number
}
