"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Bed, Maximize, Check, Info } from "lucide-react"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"
import { formatPrice } from "@/lib/utils/currency"
import { ShoppingCart } from "lucide-react"

interface Room {
  id: string
  roomType: string
  description: string
  maxOccupancy: number
  bedConfiguration: string[]
  roomSize: number
  roomSizeUnit: string
  basePrice: number
  discountedPrice: number
  amenities: string[]
  images: string[]
  quantity: number
  smokingAllowed: boolean
  hotel: {
    id: string
  }
}

interface RoomBookingTableProps {
  apiData?: any
  isapidata: boolean
  Rooms?: Room[]
  loadingrooms: boolean
  onBookNow: () => void
  roomFetchSource:string
  
}

const RoomBookingTable = ({ apiData, isapidata, Rooms, loadingrooms,onBookNow,roomFetchSource }: RoomBookingTableProps) => {
  const [selectedRooms, setSelectedRooms] = useState<{ [key: string]: number }>({})
  const [TableRoom, setTableRoom] = useState<Room[]>([])
  const [selectedcurrency, setSelectedCurrency] = useState("USD")
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 })

  // Transform API data to Room interface
  const transformApiDataToRooms = (data: any): Room[] => {
    if (!data?.data?.roomGroups) return []
    const roomMap = new Map<string, Room>()

    data.data.roomGroups.forEach((roomGroup: any) => {
      roomGroup.rooms.forEach((room: any) => {
        const id = room.roomTypeId?.toString()
        const roomType = roomGroup.masterRoomTypeName || "Standard Room"
        if (!id) return // skip if id is not present

        const discountedPrice = 0
        const smokingAllowed = !room.benefits?.some((b: any) => b.displayText.includes("Non-smoking"))

        // Use composite key for uniqueness by roomType + price + smokingAllowed
        const compositeKey = `${roomType}-${smokingAllowed}`

        const transformedRoom: Room = {
          id,
          roomType,
          description: roomType || "",
          maxOccupancy: room.maxRoomOccupancy ?? 2,
          bedConfiguration: [roomGroup.bedType || "1 bed"],
          roomSize: roomGroup.roomSize || 20,
          roomSizeUnit: roomGroup.sizeInfo?.unit || "sqm",
          basePrice: room.pricingDisplaySummary?.perNight.chargeTotal.allInclusive || discountedPrice,
          discountedPrice,
          amenities: room.benefits?.map((b: any) => b.displayText) || [],
          images: roomGroup.images?.map((img: any) => img.url) || ["/placeholder.svg?height=200&width=300"],
          quantity: room.remainRoom || 1,
          smokingAllowed,
          hotel: {
            id: data.data.searchInfo?.hotelId || "1",
          },
        }

        // Only add if this combination hasn't been seen
        if (!roomMap.has(compositeKey)) {
          roomMap.set(compositeKey, transformedRoom)
        }
      })
    })

    return Array.from(roomMap.values())
  }

  useEffect(() => {
  

    let data2 = localStorage.getItem("userCountry")
    if (!data2) {
      data2 = sessionStorage.getItem("userCountry")
    }

    if (data2)
    {
const detectedCurrency = getCurrencyByLocation(data2)
      setSelectedCurrency(detectedCurrency)
    }
   
    
  }, [])

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
        const data = await response.json()
     
        setExchangeRates({ ...data.rates, USD: 1 })
      } catch (error) {
        console.error("Error fetching exchange rates:", error)
        setExchangeRates({ USD: 1 })
      }
    }
    if (selectedcurrency !== "USD") {
      fetchRates()
    }
  }, [selectedcurrency])

  useEffect(() => {
   if (Rooms && Rooms.length > 0) {
      setTableRoom(Rooms)
      sessionStorage.setItem("rooms", JSON.stringify(Rooms))
    }
   
  }, [])

  // Handle quantity selection
  const handleQuantityChange = (roomId: string, quantity: number) => {
   
    setSelectedRooms((prev) => {
      const updated = { ...prev }
      if (quantity === 0) {
        delete updated[roomId] // Remove the room if quantity is 0
      } else {
        updated[roomId] = quantity
      }
    
      return updated
    })
  }

  // Calculate totals
  const calculateTotals = () => {
    let totalRooms = 0
    let totalPrice = 0

  

    Object.entries(selectedRooms).forEach(([roomId, quantity]) => {
   
      if (quantity > 0) {
        const room = TableRoom.find((r) => r.id == roomId)
      
        if (room) {
          totalRooms += quantity
          const roomPrice = room.discountedPrice > 0 ? room.discountedPrice : room.basePrice
          totalPrice += roomPrice * quantity * (exchangeRates[selectedcurrency] || 1)
        }
      }
    })

   
    return { totalRooms, totalPrice }
  }

  const { totalRooms, totalPrice } = calculateTotals()

  const formatPriceShort = (price: number) => {
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)},${(price % 1000).toString().padStart(3, "0")}`
    }
    return price.toString()
  }

  const renderGuestIcons = (occupancy: number) => {
    const count = occupancy || 2
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(count, 4) }, (_, i) => (
          <User key={i} className="w-4 h-4 text-gray-600" />
        ))}
      </div>
    )
  }

  // Generate quantity options for dropdown
  const generateQuantityOptions = (room: Room) => {
    const maxQuantity = Math.min(room.quantity, 5) // Limit to 5 or available quantity
    const roomPrice = room.discountedPrice > 0 ? room.discountedPrice : room.basePrice
    const options = []

    for (let i = 1; i <= maxQuantity; i++) {
      const totalPrice = roomPrice * i * (exchangeRates[selectedcurrency] || 1)
      options.push({
        value: i,
        label: `${i} ${formatPrice(totalPrice, selectedcurrency)}`,
      })
    }

    return options
  }

  // Loading state
 if (loadingrooms) {
  return (
    <div className="w-full">
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white/50 backdrop-blur-sm relative">
        {/* ... existing loading table ... */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center bg-white p-6 rounded-lg shadow-lg border">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce delay-100"></div>
              <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce delay-200"></div>
            </div>
            <p className="font-medium text-gray-700">
              {roomFetchSource == "api" 
                ? "Fetching real-time pricing from API..." 
                : "Loading room data..."}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This may take a few moments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
  // No rooms state
  if (!loadingrooms && (!TableRoom || TableRoom.length === 0)) {
    return (
      <div className="w-full border border-gray-300 rounded-lg overflow-hidden bg-white p-8">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <div className="p-4 rounded-full bg-gray-100">
            <Bed className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No Rooms Available</h3>
          <p className="text-gray-500 max-w-md">
            There are currently no rooms available for the selected dates. Please try different dates or check back
            later.
          </p>
        </div>
      </div>
    )
  }

  const renderReserveSummary = () => {
    if (totalRooms > 0) {
      return (
        <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-900 text-sm">
                {totalRooms} room{totalRooms > 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="text-lg font-bold text-blue-600">{formatPrice(totalPrice, selectedcurrency)}</div>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 w-full"
         onClick={() => {
  const selectedRoomsWithDetails = Object.entries(selectedRooms)
    .filter(([_, quantity]) => quantity > 0)
    .map(([roomId, quantity]) => {
      const room = TableRoom.find((r) => r.id == roomId)
      if (!room) return null

      const roomPrice = room.discountedPrice > 0 ? room.discountedPrice : room.basePrice

      return {
        ...room,
        quantity,
        totalPrice: roomPrice * quantity, // in USD
        effectivePrice: roomPrice,        // in USD per room
      }
    })
    .filter(Boolean)

  const totalRooms = selectedRoomsWithDetails.reduce((sum, room) => sum + (room?.quantity || 0), 0)
  const totalPrice = selectedRoomsWithDetails.reduce((sum, room) => sum + (room?.totalPrice || 0), 0)

  const roomBookingData = {
    selectedRooms: selectedRoomsWithDetails,
    summary: {
      totalRooms,
      totalPrice,
      currency: "USD",
      selectedDisplayCurrency: selectedcurrency,
      exchangeRate: exchangeRates[selectedcurrency] || 1,
    },
    bookingInfo: {
      bookingId: `booking_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString(),
      status: "pending",
    },
  }

  sessionStorage.setItem("roomBookingData", JSON.stringify(roomBookingData))
  console.log("📦 Booking saved to sessionStorage:", roomBookingData)

 onBookNow();
}}

          >
            Reserve Now
          </Button>
        </div>
      )
    } else {
      return <div className="text-sm text-gray-500 text-center">Select rooms to reserve</div>
    }
  }

  // Mobile Room Card Component
  const MobileRoomCard = ({ room, index }: { room: Room; index: number }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Room Type and Price */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{room.roomType}</h3>
          <div className="flex items-center gap-1 mt-1">
            <Bed className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-600">{room.bedConfiguration.join(", ")}</span>
          </div>
        </div>
        <div className="text-right">
          {room.basePrice > room.discountedPrice && room.discountedPrice > 0 && (
            <div className="text-xs text-gray-500 line-through">
              {formatPrice(room.basePrice * (exchangeRates[selectedcurrency] || 1), selectedcurrency)}
            </div>
          )}
          <div className="text-lg font-bold text-gray-900">
            {room.discountedPrice > 0
              ? formatPrice(room.discountedPrice * (exchangeRates[selectedcurrency] || 1), selectedcurrency)
              : formatPrice(room.basePrice * (exchangeRates[selectedcurrency] || 1), selectedcurrency)}
          </div>
        </div>
      </div>

      {/* Room Details */}
      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <Maximize className="w-3 h-3" />
          <span>{room.roomSize} {room.roomSizeUnit}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>Max {room.maxOccupancy} guests</span>
        </div>
      </div>

      {/* Smoking Status */}
      <div className="flex items-center gap-1 text-xs">
        {room.smokingAllowed ? (
          <>
            <span className="text-orange-500">🚬</span>
            <span className="text-gray-600">Smoking allowed</span>
          </>
        ) : (
          <>
            <span className="text-green-500">🚭</span>
            <span className="text-gray-600">Non-smoking</span>
          </>
        )}
      </div>

      {/* Amenities */}
      {room.amenities.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-gray-700">Amenities:</h4>
          <div className="flex flex-wrap gap-1">
            {room.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                <Check className="w-3 h-3 text-green-600" />
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-xs text-gray-500">+{room.amenities.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      {/* Quantity Selection */}
      <div className="flex items-center justify-between">
        <Select
          value={selectedRooms[room.id] !== undefined ? selectedRooms[room.id].toString() : "0"}
          onValueChange={(value) => handleQuantityChange(room.id, parseInt(value))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0" className="bg-white">Select Quantity</SelectItem>
            {generateQuantityOptions(room).map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {room.quantity <= 3 && (
          <span className="text-xs text-orange-600">Only {room.quantity} left!</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {/* Reserve Summary - Always visible on mobile */}
      <div className="block lg:hidden">
        {renderReserveSummary()}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block border border-gray-300 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-600 hover:bg-blue-600">
              <TableHead className="text-white font-semibold py-3 px-4 text-left border-r border-blue-500">
                Accommodation Type
              </TableHead>
              <TableHead className="text-white font-semibold py-3 px-4 text-center border-r border-blue-500 w-32">
                Number of guests
              </TableHead>
              <TableHead className="text-white font-semibold py-3 px-4 text-left border-r border-blue-500 w-40">
                {"Today's Price"}
              </TableHead>
              <TableHead className="text-white font-semibold py-3 px-4 text-left border-r border-blue-500">
                Your options
              </TableHead>
              <TableHead className="text-white font-semibold py-3 px-4 text-center border-r border-blue-500 w-32">
                Quantity
              </TableHead>
              <TableHead className="text-white font-semibold py-3 px-4 text-center w-40">Reserve</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TableRoom.map((room, index) => (
              <TableRow key={room.id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {/* Accommodation Type */}
                <TableCell className="p-4 border-r border-gray-200 align-top">
                  <div className="space-y-2">
                    <a href="#" className="text-blue-600 hover:underline font-medium text-sm">
                      {room.roomType}
                    </a>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Bed className="w-3 h-3" />
                        <span>{room.bedConfiguration.join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize className="w-3 h-3" />
                        <span>
                          {room.roomSize} {room.roomSizeUnit}
                        </span>
                      </div>
                      {room.description && <div className="text-xs text-gray-600 mt-1">{room.description}</div>}
                      <div className="flex items-center gap-1 mt-1">
                        {room.smokingAllowed ? (
                          <>
                            <span className="text-orange-500">🚬</span>
                            <span>Smoking allowed</span>
                          </>
                        ) : (
                          <>
                            <span className="text-green-500">🚭</span>
                            <span>Non-smoking</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Number of guests */}
                <TableCell className="p-4 border-r border-gray-200 text-center align-top">
                  {renderGuestIcons(room.maxOccupancy)}
                </TableCell>

                {/* Today's Price */}
                <TableCell className="p-4 border-r border-gray-200 align-top">
                  <div className="space-y-1">
                    {room.basePrice > room.discountedPrice && room.discountedPrice > 0 && (
                      <div className="text-xs text-gray-500 line-through">
                        {formatPrice(room.basePrice * (exchangeRates[selectedcurrency] || 1), selectedcurrency)}
                      </div>
                    )}
                    <div className="text-lg font-bold text-gray-900">
                      {room.discountedPrice > 0
                        ? formatPrice(room.discountedPrice * (exchangeRates[selectedcurrency] || 1), selectedcurrency)
                        : formatPrice(room.basePrice * (exchangeRates[selectedcurrency] || 1), selectedcurrency)}{" "}
                      <Info className="w-3 h-3 inline ml-1 text-gray-400" />
                    </div>
                  </div>
                </TableCell>

                {/* Your options - Only show amenities from Room data */}
                <TableCell className="p-4 border-r border-gray-200 align-top">
                  <div className="space-y-2">
                    {room.amenities.length > 0 ? (
                      room.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No amenities listed</div>
                    )}
                  </div>
                </TableCell>

                {/* Quantity Selection */}
                <TableCell className="p-4 border bg-white text-center align-top">
                  <Select
                    value={selectedRooms[room.id] !== undefined ? selectedRooms[room.id].toString() : "0"}
                    onValueChange={(value) => handleQuantityChange(room.id, parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0" className="bg-white">Select Quantity</SelectItem>
                      {generateQuantityOptions(room).map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {room.quantity <= 3 && <div className="text-xs text-orange-600 mt-1">Only {room.quantity} left!</div>}
                </TableCell>

                {/* Reserve Button - Only in first row */}
                <TableCell className="p-4 text-center align-top">{index === 0 && renderReserveSummary()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {TableRoom.map((room, index) => (
          <MobileRoomCard key={room.id || index} room={room} index={index} />
        ))}
      </div>
    </div>
  )
}

export default RoomBookingTable
