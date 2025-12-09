"use client"

import { useState } from "react"
import { Download, Filter, TrendingUp, DollarSign, Users, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Mock analytics data
const monthlyRevenueData = [
  { month: "Jan", revenue: 45000, bookings: 120 },
  { month: "Feb", revenue: 52000, bookings: 145 },
  { month: "Mar", revenue: 48000, bookings: 132 },
  { month: "Apr", revenue: 61000, bookings: 168 },
  { month: "May", revenue: 55000, bookings: 155 },
  { month: "Jun", revenue: 67000, bookings: 189 },
  { month: "Jul", revenue: 72000, bookings: 201 },
  { month: "Aug", revenue: 69000, bookings: 195 },
  { month: "Sep", revenue: 58000, bookings: 162 },
  { month: "Oct", revenue: 63000, bookings: 178 },
  { month: "Nov", revenue: 71000, bookings: 198 },
  { month: "Dec", revenue: 78000, bookings: 215 },
]

const bookingsPerServiceData = [
  { service: "Hotel", bookings: 450, revenue: 285000 },
  { service: "Car", bookings: 320, revenue: 128000 },
  { service: "Property", bookings: 85, revenue: 425000 },
  { service: "Umrah", bookings: 180, revenue: 315000 },
  { service: "Flight", bookings: 275, revenue: 192500 },
]

const revenueByCategory = [
  { name: "Hotel", value: 285000, color: "#8b5cf6" },
 
]

const totalRevenue = revenueByCategory.reduce((sum, item) => sum + item.value, 0)

export default function AnalyticsPage() {
  const [filters, setFilters] = useState({
    dateFrom: "2024-01-01",
    dateTo: "2024-12-31",
    serviceType: "",
  })

  const handleExport = (format: string) => {
    console.log(`Exporting analytics data as ${format}`)
    // Implement export functionality
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2 text-lg">Comprehensive insights into platform performance</p>
        </div>
        {/* <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleExport("csv")}
            className="rounded-2xl border-gray-200 hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() => handleExport("pdf")}
            className="bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-start/90 hover:to-primary-end/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl px-6"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div> */}
      </div>

      {/* Filters */}
      <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="dateFrom" className="text-sm font-semibold text-gray-700">
                Date From
              </Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo" className="text-sm font-semibold text-gray-700">
                Date To
              </Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType" className="text-sm font-semibold text-gray-700">
                Service Type
              </Label>
              <Select
                value={filters.serviceType}
                onValueChange={(value) => setFilters({ ...filters, serviceType: value })}
              >
                <SelectTrigger className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20">
                  <SelectValue placeholder="All services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  {/* <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="umrah">Umrah</SelectItem>
                  <SelectItem value="flight">Flight</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Revenue</CardTitle>
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-gray-900 mb-2">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 rounded-full">
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                <span className="text-xs text-emerald-700 font-semibold">+12.5%</span>
              </div>
              <p className="text-xs text-gray-500">from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-violet-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Bookings</CardTitle>
            <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-gray-900 mb-2">1,310</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-violet-100 rounded-full">
                <TrendingUp className="h-3 w-3 text-violet-600" />
                <span className="text-xs text-violet-700 font-semibold">+8.2%</span>
              </div>
              <p className="text-xs text-gray-500">from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-electric-50 to-electric-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">Avg. Order Value</CardTitle>
            <div className="p-3 bg-gradient-to-br from-electric-500 to-electric-600 rounded-2xl shadow-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              ${Math.round(totalRevenue / 1310).toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-electric-100 rounded-full">
                <TrendingUp className="h-3 w-3 text-electric-600" />
                <span className="text-xs text-electric-700 font-semibold">+3.8%</span>
              </div>
              <p className="text-xs text-gray-500">from last month</p>
            </div>
          </CardContent>
        </Card>

      
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Revenue Chart */}
        <Card className="lg:col-span-2 border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Monthly Revenue Trend</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Revenue and bookings over the last 12 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      color: "#1e293b",
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#023e8a"
                    strokeWidth={3}
                    dot={{ fill: "#023e8a", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#023e8a", strokeWidth: 2, fill: "white" }}
                    name="Revenue ($)"
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "white" }}
                    name="Bookings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Category Pie Chart */}
        <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Revenue by Category</CardTitle>
            <CardDescription className="text-gray-600 mt-1">Distribution of revenue across services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      color: "#1e293b",
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings per Service Chart */}
    
    </div>
  )
}
