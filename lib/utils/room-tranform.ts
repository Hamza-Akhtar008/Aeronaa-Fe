  export const transformApiDataToRooms = (data: any,hotelid:string): Room[] => {
  if (!data?.data?.roomGroups) return []

  const roomMap = new Map<string, Room>()

  data.data.roomGroups.forEach((roomGroup: any) => {
    roomGroup.rooms.forEach((room: any) => {
      const id =  room.roomTypeId?.toString()
      const roomType = roomGroup.masterRoomTypeName || "Standard Room"
      if (!id) return // skip if id is not present

      const discountedPrice = room.pc?.a || 0
      const smokingAllowed = !room.benefits?.some((b: any) => b.displayText.includes("Non-smoking"))

      // Use composite key for uniqueness by roomType + price + smokingAllowed
      const compositeKey = `${roomType}-${smokingAllowed}`

      const transformedRoom: Room = {
        id,
        roomType,
        description: roomType || "",
        maxOccupancy: room.maxRoomOccupancy,
        bedConfiguration: [roomGroup.bedType || "1 bed"],
        roomSize: roomGroup.roomSize || 20,
        roomSizeUnit: roomGroup.sizeInfo?.unit || "sqm",
        basePrice: room.pc?.originalTotal || discountedPrice,
        discountedPrice,
        amenities: room.benefits?.map((b: any) => b.displayText) || [],
        images: roomGroup.images?.map((img: any) => img.url) || ["/placeholder.svg?height=200&width=300"],
        quantity: room.remainRoom || 1,
        smokingAllowed,
        hotel: {
          id: hotelid,
        },
      }

      // Only add if this combination hasn't been seen
      if (!roomMap.has(compositeKey)) {
        roomMap.set(compositeKey, transformedRoom)
      }
      // If you want to always keep the latest occurrence, simply remove the if condition.
    })
  })

  return Array.from(roomMap.values())
}