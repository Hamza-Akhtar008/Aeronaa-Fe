"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"


import { MessageSquare, Eye, Home, TrendingUp, Plus, Search } from "lucide-react"
import { PropertyHeader } from "@/components/property/header"
import { PropertySidebar } from "@/components/property/sidebar"

// Mock data for the dashboard
const mockStats = {
  totalProperties: 0,
  activeListings: 0,
  viewsThisMonth: 0,
  inquiries: 0,
}

const mockRecentActivity = [
  {
    id: 1,
    type: "inquiry",
    message: "New inquiry for Modern Downtown Apartment",
    time: "2 hours ago",
    property: "Modern Downtown Apartment",
  },
  {
    id: 2,
    type: "view",
    message: "Property viewed 15 times today",
    time: "4 hours ago",
    property: "Luxury Villa with Pool",
  },
  {
    id: 3,
    type: "listing",
    message: "New property listing approved",
    time: "1 day ago",
    property: "Cozy Studio Near University",
  },
  {
    id: 4,
    type: "update",
    message: "Price updated for Suburban Family Home",
    time: "2 days ago",
    property: "Suburban Family Home",
  },
]

const mockTopProperties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    location: "Downtown, City Center",
    price: "$450,000",
    views: 156,
    inquiries: 8,
    image: "/modern-apartment-living.png",
  },
  {
    id: 2,
    title: "Luxury Villa with Pool",
    location: "Hillside, Premium District",
    price: "$1,200,000",
    views: 203,
    inquiries: 12,
    image: "/luxury-villa-pool.png",
  },
  {
    id: 3,
    title: "Cozy Studio Near University",
    location: "University District",
    price: "$180,000",
    views: 89,
    inquiries: 5,
    image: "/cozy-studio-apartment.png",
  },
]

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <PropertySidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 lg:ml-0">
        <PropertyHeader setSidebarOpen={setSidebarOpen} />

        <div className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, John!</h2>
            <p className="text-slate-600">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{mockStats.totalProperties}</div>
                
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Active Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{mockStats.activeListings}</div>
       
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Views This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{mockStats.viewsThisMonth.toLocaleString()}</div>
            
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{mockStats.inquiries}</div>
                
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Recent Activity */}
        

            {/* Quick Actions & Top Properties */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/property-dashboard/properties/add">
                    <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Property
                    </Button>
                  </Link>
                  <Link href="/property-dashboard/properties">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-slate-200 mt-2 hover:bg-slate-50 bg-transparent"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Browse Properties
                    </Button>
                  </Link>
               
                </CardContent>
              </Card>

              {/* Top Performing Properties */}
         
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
