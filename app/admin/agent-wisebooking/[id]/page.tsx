"use client"

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Imported components
import BookingsPage from "@/components/agent/hotel/booking-page"
import { BookingInfo } from "@/components/agent/flight/booking-info"
import { BookingsTable as UmrahBookingsTable } from "@/components/agent/umrah/booking-table"
import { CarBookingsTable } from "@/components/agent/car/car-bookings-table"
import { useParams } from "next/navigation"

export default function AgentBookingsPage() {
   const params = useParams();
    
    const id = params?.id || "";
  return (
    <main className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-balance">Agent Bookings Preview</h1>
        <p className="text-muted-foreground">Manage and preview bookings across categories.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hotel" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="hotel">Hotel Bookings</TabsTrigger>
              <TabsTrigger value="flight">Flight Bookings</TabsTrigger>
              <TabsTrigger value="car">Car Bookings</TabsTrigger>
              <TabsTrigger value="umrah">Umrah Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="hotel" className="mt-6">
              {/* Hotel Bookings */}
             <BookingsPage id={Array.isArray(id) ? id[0] : id || ""} />

            </TabsContent>

            <TabsContent value="flight" className="mt-6">
              {/* Flight Bookings */}
              <BookingInfo  id={Array.isArray(id) ? id[0] : id || ""} />
            </TabsContent>

            <TabsContent value="car" className="mt-6 space-y-4">
              {/* Car Bookings + link to full page */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Car Bookings</h2>
                <Button asChild>
                  <Link href="/agent/bookings/cars">View car bookings page</Link>
                </Button>
              </div>
              <CarBookingsTable id={Array.isArray(id) ? id[0] : id || ""} />
            </TabsContent>

            <TabsContent value="umrah" className="mt-6">
              {/* Umrah Bookings */}
              <UmrahBookingsTable   id={Array.isArray(id) ? id[0] : id || ""}/>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
