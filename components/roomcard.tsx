"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Users,
  Bed,
  Maximize,
  Wifi,
  Car,
  Coffee,
  Waves,
  Dumbbell,
  Utensils,
  Tv,
  Wind,
  ShieldCheck,
  Edit,
  Eye,
  MoreVertical,
  Timer,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ChangeAvailabilityModal } from "./ChangeAvailabilityModal"
import { ChangeAvailability } from "@/lib/api"

interface RoomCardProps {
  room: Room
   reload: () => void;
}

const getAmenityIcon = (amenity: string) => {
  const amenityLower = amenity.toLowerCase()
  if (amenityLower.includes("wifi") || amenityLower.includes("internet")) return <Wifi className="w-4 h-4" />
  if (amenityLower.includes("parking")) return <Car className="w-4 h-4" />
  if (amenityLower.includes("coffee") || amenityLower.includes("breakfast")) return <Coffee className="w-4 h-4" />
  if (amenityLower.includes("pool") || amenityLower.includes("swimming")) return <Waves className="w-4 h-4" />
  if (amenityLower.includes("gym") || amenityLower.includes("fitness")) return <Dumbbell className="w-4 h-4" />
  if (amenityLower.includes("restaurant") || amenityLower.includes("dining")) return <Utensils className="w-4 h-4" />
  if (amenityLower.includes("tv") || amenityLower.includes("television")) return <Tv className="w-4 h-4" />
  if (amenityLower.includes("ac") || amenityLower.includes("air")) return <Wind className="w-4 h-4" />
  return <ShieldCheck className="w-4 h-4" />
}

export function RoomCard({ room,reload }: RoomCardProps) {
  const router =useRouter();
   const [showAvailabilityModal, setShowAvailabilityModal] = useState
   (false);
  const hasDiscount = room.discountedPrice < room.basePrice
  const discountPercentage = hasDiscount
    ? Math.round(((room.basePrice - room.discountedPrice) / room.basePrice) * 100)
    : 0

  const getAvailabilityStatus = () => {
    if (room.quantity === 0) return { label: "Sold Out", variant: "destructive" as const }
    if (room.quantity <= 3) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "Available", variant: "default" as const }
  }

  const availabilityStatus = getAvailabilityStatus()
   const handleAvailabilitySave = async (available: boolean, untilDate?: Date) => {
    console.log(`Room ${room.id} availability changed:`, { available, untilDate });
    
    // Example API call
    try {
     
    const response  = await ChangeAvailability(room.id,available,untilDate||null);
    reload();
    } catch (error) {
      console.error("Failed to update availability:", error);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative">
         
         {
          room?.images?
          (<>
            <img
            src={room?.images[0] || `https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Froom&psig=AOvVaw3oNUyy8tIy6UW7BEGhh3A7&ust=1761979983705000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCMjF6IrtzZADFQAAAAAdAAAAABAE}`}
            alt={room.roomType}
            className="w-full h-48 object-cover"
          /></>):(
<>
  <img
            src={`https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Froom&psig=AOvVaw3oNUyy8tIy6UW7BEGhh3A7&ust=1761979983705000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCMjF6IrtzZADFQAAAAAdAAAAABAE}`}
            alt={room.roomType}
            className="w-full h-48 object-cover"
          />
</>
          )
         }
        
          <Badge
  className={`absolute top-2 right-2 ${
    room.isActive ? "bg-green-500" : "bg-red-500"
  } text-white`}
>
  {room.isActive ? "Available" : "Unavailable"}
</Badge>

        
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="absolute bottom-2 right-2 bg-white/80 hover:bg-white">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
             
              <DropdownMenuItem onClick={()=>
                {
                  router.push(`/Dashboard/property/view/${room.id}`)
                }
              }>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>

             <DropdownMenuItem
              onClick={() => setShowAvailabilityModal(true)} // 👈 open modal
            >
              <Timer className="w-4 h-4 mr-2" />
              Change Availability
            </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-balance">{room.roomType}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>
            </div>
            <Badge variant="outline" className="text-xs ml-2">
              ID: {room.id}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{room.maxOccupancy} guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{room.bedConfiguration.join(", ")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              <span>
                {room.roomSize} {room.roomSizeUnit}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {room.amenities.slice(0, 4).map((amenity:any, index:any) => (
              <div key={index} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
            {room.amenities.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{room.amenities.length - 4} more
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="bg-muted p-2 rounded-md">
              <p className="text-xs text-muted-foreground">Available Rooms</p>
              <p className="font-semibold">{room.quantity}</p>
            </div>
          
          </div>

          <div className="flex items-center gap-2">
            {!room.smokingAllowed && (
              <Badge variant="outline" className="text-xs">
                Non-smoking
              </Badge>
            )}
            {room.smokingAllowed && (
              <Badge variant="outline" className="text-xs">
                Smoking allowed
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">${room.discountedPrice!=0&&room.discountedPrice<room.basePrice ? room.discountedPrice:room.basePrice}/night</p>
            {room.discountedPrice!=0 &&hasDiscount && <p className="text-sm text-muted-foreground line-through">${room.basePrice}</p>}
          </div>
          <p className="text-xs text-muted-foreground">Base rate: ${room.basePrice}</p>
        </div>
       
      </CardFooter>

       <ChangeAvailabilityModal
        open={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        room={room}
        onSave={handleAvailabilitySave}
      />
    </Card>
  )
}
