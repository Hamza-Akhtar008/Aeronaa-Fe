"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Pencil, CalendarDays } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { GetRoomsbyid } from "@/lib/api"

export default function ViewRoom() {
  const params = useParams()
  const id = params?.id as string
  const [room, setRoom] = useState<Room | null>(null)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await GetRoomsbyid(id as string)
        setRoom(data)
      } catch (error) {
        console.error("Failed to fetch room:", error)
      }
    }

    fetchRoom()
  }, [id])

  if (!room) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative max-w-4xl mx-auto p-6">
      <Card>
        {/* Edit Room Button */}
        <button
          onClick={() => router.push(`/Dashboard/property/editroom/${room.id}`)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white hover:opacity-90 shadow-md transition"
          aria-label="Edit Room"
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* Check Availability Button */}
        {/* <button
          onClick={() => setOpen(true)}
          className="absolute top-4 right-16 p-2 rounded-full bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white hover:opacity-90 shadow-md transition"
          aria-label="Check Availability"
        >
          <CalendarDays className="w-4 h-4" />
        </button> */}

        {/* Room Images */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {room.images?.map((img, idx) => (
              <Image
                key={idx}
                width={300}
                height={160}
                src={`${img}`}
                alt={`Hotel placeholder ${idx + 1}`}
                className="rounded-lg object-cover h-40 w-full border"
              />
            ))}
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-2xl font-bold">{room?.roomType}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground mb-4">{room?.description}</p>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Room Size:</strong> {room?.roomSize} {room?.roomSizeUnit}</div>
            <div><strong>Max Occupancy:</strong> {room?.maxOccupancy}</div>
            <div><strong>Base Price:</strong> ${room?.basePrice}</div>
            <div><strong>Discounted Price:</strong> ${room?.discountedPrice ?? "N/A"}</div>
            <div><strong>Quantity:</strong> {room?.quantity}</div>
            <div><strong>Smoking Allowed:</strong> {room?.smokingAllowed ? "Yes" : "No"}</div>

            <div className="col-span-2">
              <strong>Bed Configuration:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {room?.bedConfiguration?.map((bed, i) => (
                  <Badge key={i} variant="secondary">{bed}</Badge>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <strong className="block text-lg mb-2">Amenities:</strong>
              {room?.amenities?.length ? (
                <div className="flex flex-wrap gap-3 mt-1">
                  {room?.amenities.map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-white text-sm font-medium shadow-sm"
                      style={{ background: 'linear-gradient(to right, #023e8a, #00b4d8)' }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground">No amenities listed</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability Modal */}
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Room Availability</DialogTitle>
    </DialogHeader>

    <div className="pt-4">
      <Calendar
        mode="range"
        modifiers={{
          available: () => true, // mark all as available for now
        }}
        modifiersClassNames={{
          available: "bg-green-200 text-green-900 font-medium",
          selected: "bg-blue-600 text-white",
          today: "border border-blue-400",
        }}
        className="rounded-md border shadow-sm"
        classNames={{
          months: "flex flex-col sm:flex-row gap-4",
          caption: "flex justify-center py-2 font-medium text-base",
          nav: "space-x-1 flex items-center",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          row: "flex w-full",
          cell: "relative w-10 h-10 text-center text-sm rounded-md hover:bg-blue-100 cursor-pointer",
          day: "inline-flex items-center justify-center w-full h-full",
          day_today: "border border-blue-500",
          day_selected: "bg-blue-600 text-white",
        }}
      />
    </div>
  </DialogContent>
</Dialog>

    </div>
  )
}
