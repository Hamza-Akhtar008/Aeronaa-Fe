"use client"

import { FlightTicketManager } from "@/components/flight-ticket-manager"
import { GetFlightTicekt } from "@/lib/flight_api"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function Page() {
  const params = useParams() as { id: string }
  const id = params.id
  const [flight, setFlight] = useState(null)
  const [segments, setSegments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchFlight = async () => {
      setLoading(true)
      try {
        const response = await GetFlightTicekt(id)
        console.log("response : ", response)
        setFlight(response)
        setSegments(response.segments || [])
      } catch (err) {
        console.error("Failed to fetch flight:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFlight()
  }, [id])

  if (loading) {
    return <>loading ....</>
  }

  return (
    <FlightTicketManager mode="edit" existingFlightId={id} existingFlightData={flight} existingSegments={segments} />
  )
}
