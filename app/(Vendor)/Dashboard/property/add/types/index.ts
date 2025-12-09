interface Hotel {
  id?:string,
  name: string
  description: string
  Address: string
  city: string
  state: string
  zipCode: string
  averagePrice: string,
  country: string
  starRating: string
  checkInTime: string
  checkOutTime: string
  availableFrom: Date
  availableTo: Date
  amenities?: string[]
  images?: any[]
  tags?: string | string[];
  isCompleted:Number;
  value?:string
  dataByApi?:Boolean
  apiId?: string
  status:string
}


interface Room {
  id: string;
  roomType: string;
  description: string;
  maxOccupancy: string;
  bedConfiguration: string[];
  roomSize: number;
  roomSizeUnit: string;
  basePrice: number;
  discountedPrice: number;
  amenities: string[];
  images: string[];
  quantity: number;
  customRoomType:string;
  smokingAllowed: boolean;
  isActive: boolean;
  availableRooms: number;
  availableUntil?: Date;
  hotel: {
    id: string | number;
  };
}