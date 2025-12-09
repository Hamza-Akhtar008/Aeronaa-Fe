"use client"

import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"


import { Search, Filter } from "lucide-react"
import { RoomCard } from "@/components/roomcard"
import { useParams } from "next/navigation"
import { GetRoomsbyHotel, GetRoomsVendorsbyHotel } from "@/lib/api"

// Mock data - replace with your actual data source


export default function RoomsPage() {
    const params = useParams()
    const id = params?.id as string
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("price-high")
  const [filterByOccupancy, setFilterByOccupancy] = useState("all")
  const [rooms,setrooms ]=useState<Room[]>([]);
  
  const fetchrooms =async ()=>
  {
    const response = await  GetRoomsVendorsbyHotel(id)
    setrooms(response);
  
  }
  useEffect(()=>
  {
fetchrooms();
  },[])
const filteredAndSortedRooms = useMemo(() => {
  let filtered = rooms.filter(
    (room) =>
      room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.amenities.some((amenity) =>
        amenity.toLowerCase().includes(searchTerm.toLowerCase())
      ),
  )

  if (filterByOccupancy !== "all") {
    filtered = filtered.filter(
      (room) =>
        Number.parseInt(room.maxOccupancy) >=
        Number.parseInt(filterByOccupancy)
    )
  }

  return filtered.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.discountedPrice - b.discountedPrice
      case "price-high":
        return b.discountedPrice - a.discountedPrice
      case "size":
        return b.roomSize - a.roomSize
      case "occupancy":
        return (
          Number.parseInt(b.maxOccupancy) - Number.parseInt(a.maxOccupancy)
        )
      default:
        return 0
    }
  })
}, [rooms, searchTerm, sortBy, filterByOccupancy])
  const uniqueOccupancies = Array.from(new Set(rooms.map((room) => room.maxOccupancy))).sort(
    (a, b) => Number.parseInt(a) - Number.parseInt(b),
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-balance">Hotel Rooms</h1>
          <p className="text-muted-foreground">Discover our comfortable and luxurious accommodations</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search rooms by name, description, or amenities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="size">Room Size</SelectItem>
                  <SelectItem value="occupancy">Max Occupancy</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterByOccupancy} onValueChange={setFilterByOccupancy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by occupancy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Occupancies</SelectItem>
                  {uniqueOccupancies.map((occupancy) => (
                    <SelectItem key={occupancy} value={occupancy}>
                      {occupancy}+ Guests
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Search: {searchTerm}
              </Badge>
            )}
            {filterByOccupancy !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Filter className="w-3 h-3" />
                {filterByOccupancy}+ Guests
              </Badge>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedRooms.length} of {rooms.length} rooms
          </p>
        </div>

        {/* Rooms Grid */}
        {filteredAndSortedRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedRooms.map((room) => (
              <RoomCard key={room.id} room={room} reload={fetchrooms} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No rooms found matching your criteria.</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
