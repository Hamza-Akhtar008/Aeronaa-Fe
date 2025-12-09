export type BookingDetail = {
  id: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  checkIndate: string
  checkOutDate: string
  numberOfDays: number
  amount: number
  user: {
    id: number
    isActive: boolean
    createdAt: string
    updatedAt: string
    name: string
    password: string
    email: string
    phone: string
    role: string
  }
}

export type PaymentData = {
  startDate: string
  endDate: string
  totalAmount: number
}
