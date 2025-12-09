"use client"

import { useState } from "react"
import { DashboardLayout } from "./dashboard-layout"

import { BookingInfo } from "./booking-info"

import { TicketList } from "./ticket-list"
import { FlightTicketManager } from "./flight-ticket-manager"

export function TicketDashboard() {
  const [currentPage, setCurrentPage] = useState("create")

  const renderPage = () => {
    switch (currentPage) {
      case "create":
        return <FlightTicketManager />
      case "tickets":
        return <TicketList />
      case "bookings":
        return <BookingInfo />
      case "dashboard":
        return (
          <div className="max-w-4xl mx-auto p-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
              <p className="text-gray-600">Welcome to the Flight Support Management System</p>
            </div>
          </div>
        )
      default:
        return <FlightTicketManager />
    }
  }

  return (
    <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </DashboardLayout>
  )
}
