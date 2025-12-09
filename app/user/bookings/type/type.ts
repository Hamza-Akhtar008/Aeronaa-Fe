interface UIBooking {
  id: number;
  isActive: boolean;
  checkIndate: string;
  checkOutDate: string;
  numberOfDays: string;
  amount:string;
  isConfirmed:Boolean,
  isAppeared:Boolean
  paymentType:string,
  name:string,
  email:string,
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  hotel: Hotel;
 room: Room[];
}