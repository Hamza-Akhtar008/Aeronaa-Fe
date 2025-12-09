"use client"

import type React from "react"

import {
  Activity,
  CheckCircle,
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  ArrowUpRight,
  Star,
  Sparkles,
  TrendingDown,
  MoreHorizontal,
  Bell,
  Settings,
  Crown,
  Rocket,
  Shield,
  MessageSquare,
  BarChart3,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import BookingsChart from "@/components/admin/bookings-chart"
import ServicesChart from "@/components/admin/services-chart"
import { useEffect, useState } from "react"
import { admindashboardstats } from "@/lib/api"

type MonthRevenue = {
  month: string
  totalAmount: string
}

interface RevenueChartProps {
  monthRevenue: MonthRevenue[]
}
// Types for better type safety
interface KPIData {
  title: string
  value: string
 
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  glowColor: string
  textGradient: string
  bgPattern: string
}

interface ActivityItem {
  id: string
  user: {
    name: string
    avatar: string
    initials: string
  }
  action: string
  timestamp: string
  value?: string
  status?: "approved" | "pending" | "completed"
  gradient: string
}

interface QuickAction {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  hoverGradient: string
  iconBg: string
}

// Animated Background Component
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-[#08428d] via-[#0066cc] to-[#00b4d8] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
      <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-4000"></div>
    </div>
  )
}

// Enhanced KPI Card Component
function KPICard({
  title,
  value,

  icon: Icon,
  gradient,
  glowColor,
  textGradient,
  bgPattern,
}: KPIData) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group backdrop-blur-sm bg-white/90 hover:bg-white/95">
      {/* Animated Background Pattern */}
      <div
        className={`absolute inset-0 ${bgPattern} opacity-0 group-hover:opacity-100 transition-all duration-500`}
      ></div>

      {/* Gradient Border Effect */}
      <div
        className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`}
      ></div>
      <div className="absolute inset-[1px] bg-white rounded-lg"></div>

      {/* Floating Orb Effect */}
      <div
        className={`absolute top-2 right-2 w-12 h-12 ${gradient} rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300 blur-lg`}
      ></div>

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-xs font-semibold text-gray-600 group-hover:text-gray-800 transition-colors duration-300 uppercase tracking-wide">
          {title}
        </CardTitle>
        <div className="relative">
          <div
            className={`absolute inset-0 ${gradient} rounded-lg blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-300`}
          ></div>
          <div
            className={`relative p-2 ${gradient} rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 pb-3">
        <div
          className={`text-2xl font-bold mb-2 bg-gradient-to-r ${textGradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}
        >
          {value}
        </div>
      
      </CardContent>
    </Card>
  )
}

// Enhanced Activity Item Component
function ActivityItemComponent({ item }: { item: ActivityItem }) {
  return (
    <div className="relative group">
      <div
        className={`absolute inset-0 ${item.gradient} rounded-lg blur opacity-0 group-hover:opacity-15 transition-opacity duration-300`}
      ></div>
      <div className="relative bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`absolute inset-0 ${item.gradient} rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
            ></div>
            <Avatar className="relative h-8 w-8 border-2 border-white shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <AvatarImage src={item.user.avatar || "/placeholder.svg"} alt={item.user.name} />
              <AvatarFallback className={`${item.gradient} text-white text-xs font-semibold`}>
                {item.user.initials}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 ${item.gradient} rounded-full animate-pulse`}></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate text-sm group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 group-hover:bg-clip-text transition-all duration-300">
              {item.user.name}
            </p>
            <p className="text-gray-600 truncate text-xs">{item.action}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-medium uppercase tracking-wide">{item.timestamp}</p>
          </div>
          <div className="flex items-center gap-2">
            {item.value && (
              <div className="text-right">
                <div className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {item.value}
                </div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Revenue</div>
              </div>
            )}
            {item.status && (
              <Badge
                className={`${item.gradient} text-white border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 px-2 py-1 text-xs`}
              >
                {item.status === "approved" && <Star className="h-3 w-3 mr-1" />}
                <span className="font-semibold capitalize">{item.status}</span>
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 rounded-lg"
                >
                  <MoreHorizontal className="h-3 w-3" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-lg">
                <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded text-xs">
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded text-xs">
                  Contact user
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Quick Action Component
function QuickActionButton({ title, description, icon: Icon, gradient, hoverGradient, iconBg }: QuickAction) {
  return (
    <Button
      className={`w-full ${gradient} hover:${hoverGradient} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 p-3 rounded-lg justify-start group relative overflow-hidden h-auto`}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-500"></div>

      <div
        className={`relative mr-3 p-2 ${iconBg} rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105`}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>

      <div className="text-left relative z-10 flex-1">
        <div className="font-bold text-sm mb-0.5">{title}</div>
        <div className="text-xs opacity-90">{description}</div>
      </div>

      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Button>
  )
}

export default function Dashboard() {
  // Enhanced mock data with varied gradients

  const [dashboardkpidata,setKPIDATA]=useState<KPIData[]>(
    []
  )
  const [hotelcount,sethotelcount]=useState(0);
  const [carcount,setcarcount]=useState(0);
  const [umrahcount,setumrahcount]=useState(0);
  const [flightcount,setflightcount]=useState(0);


  const [monthlyChart, setMonthlyChart] = useState<MonthRevenue[]>([])
const [loading,setLoading]=useState(true);

  useEffect(()=>
  {

const getlivestats =async()=>
{
  setLoading(true);
  const response = await admindashboardstats();
  sethotelcount(response.hotelBookings)
  setcarcount(response.carbookings)
  setumrahcount(response.umrahbookings)
  setflightcount(response.flightbookings)


  const price = new Intl.NumberFormat("en-US").format(response.totalAmount);
  setMonthlyChart(response.monthRevenue);
  setKPIDATA( [{
      title: "Total Revenue",
      value: price,
  
      icon: DollarSign,
      gradient: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
      glowColor: "shadow-emerald-500/50",
      textGradient: "from-emerald-600 via-teal-600 to-cyan-600",
      bgPattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]",
    },
    {
      title: "Total Bookings",
      value: String(response.totalBookings),
 
      icon: CreditCard,
      gradient: "bg-gradient-to-br from-[#08428d] to-[#00b4d8]", // Main gradient
      glowColor: "shadow-[#08428d]/50",
      textGradient: "from-[#08428d] to-[#00b4d8]",
      bgPattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(8,66,141,0.1),transparent_50%)]",
    },
    {
      title: "Total Users",
      value: String(response.userCount),
  
      icon: Users,
      gradient: "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500",
      glowColor: "shadow-violet-500/50",
      textGradient: "from-violet-600 via-purple-600 to-fuchsia-600",
      bgPattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]",
    },
    {
      title: "Active Vendors",
   value: String(response.vendorCount),
  
  
      icon: Activity,
      gradient: "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
      glowColor: "shadow-amber-500/50",
      textGradient: "from-amber-600 via-orange-600 to-red-600",
      bgPattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent_50%)]",
    }])
 setLoading(false);
}
getlivestats();

  },[])
 

  const recentActivity: ActivityItem[] = [
    {
      id: "1",
      user: {
        name: "Olivia Martin",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "OM",
      },
      action: "Booked a 3-night stay at 'Sunset Paradise Hotel'",
      timestamp: "2 minutes ago",
      value: "+$1,999.00",
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-500",
    },
    {
      id: "2",
      user: {
        name: "Jackson Lee",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JL",
      },
      action: "Updated listing for 'City Center Apartments'",
      timestamp: "5 minutes ago",
      status: "approved" as const,
      gradient: "bg-gradient-to-r from-[#08428d] to-[#00b4d8]", // Main gradient
    },
    {
      id: "3",
      user: {
        name: "Isabella Nguyen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "IN",
      },
      action: "Rented a 'Compact Sedan' for 5 days",
      timestamp: "12 minutes ago",
      value: "+$239.00",
      gradient: "bg-gradient-to-r from-violet-500 to-purple-500",
    },
    {
      id: "4",
      user: {
        name: "William Kim",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "WK",
      },
      action: "Submitted new property listing",
      timestamp: "1 hour ago",
      status: "pending" as const,
      gradient: "bg-gradient-to-r from-amber-500 to-orange-500",
    },
  ]

  const quickActions: QuickAction[] = [
    {
      title: "Approve Listings",
      description: "Review pending submissions",
      icon: CheckCircle,
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-500",
      hoverGradient: "from-emerald-600 to-teal-600",
      iconBg: "bg-emerald-600",
    },
    {
      title: "Review Vendors",
      description: "Manage vendor applications",
      icon: Shield,
      gradient: "bg-gradient-to-r from-[#08428d] to-[#00b4d8]", // Main gradient
      hoverGradient: "from-[#06356b] to-[#0099cc]",
      iconBg: "bg-[#08428d]",
    },
    {
      title: "Send Notification",
      description: "Broadcast to all users",
      icon: MessageSquare,
      gradient: "bg-gradient-to-r from-violet-500 to-purple-500",
      hoverGradient: "from-violet-600 to-purple-600",
      iconBg: "bg-violet-600",
    },
  ]
  if(loading==true)
  {
    return
    <>Loading....</>
  }

  return (
    <>
      <AnimatedBackground />
      <div className="space-y-6 p-4  mx-auto relative">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#08428d] to-[#00b4d8] rounded-lg blur-md opacity-40"></div>
                <div className="relative p-2 bg-gradient-to-br from-[#08428d] to-[#00b4d8] rounded-lg shadow-lg">
                  <Crown className="h-5 w-5 text-white" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#08428d] to-[#00b4d8] bg-clip-text text-transparent tracking-tight">
                Dashboard
              </h1>
            </div>
          <div className="text-gray-600 flex items-center gap-3 text-sm">
  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#08428d]/10 to-[#00b4d8]/10 rounded-full shadow-sm border border-[#08428d]/20 backdrop-blur-sm">
    <Sparkles className="h-4 w-4 text-[#08428d] animate-spin" />
    <span className="text-[#08428d] font-semibold text-xs">Welcome back!</span>
  </div>
</div>
              <span className="font-medium">Here's what's happening with your platform.</span>
          </div>
         
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardkpidata.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/95 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#08428d]/5 via-[#0066cc]/5 to-[#00b4d8]/5 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#08428d] to-[#00b4d8] rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-2xl"></div>
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-[#08428d] to-[#00b4d8] bg-clip-text text-transparent flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#08428d] to-[#00b4d8] rounded-full animate-pulse"></div>
                 Hotel   Booking Trends
                    <BarChart3 className="h-4 w-4 text-[#08428d]" />
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1 text-sm">
                    Performance over the last {monthlyChart.length} months
                  </CardDescription>
                </div>
                
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pb-4">
              <BookingsChart monthRevenue={monthlyChart}/>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/95 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/50 to-cyan-50/50 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-2xl"></div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
                Top Services
                <Star className="h-4 w-4 text-emerald-500" />
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1 text-sm">Most popular services</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 pb-4">
              <ServicesChart hotelBookings={hotelcount} flightbookings={flightcount} umrahbookings={umrahcount} carbookings={carcount}/>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Activity and Actions */}
        {/* <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/95 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-purple-50/50 to-fuchsia-50/50 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-2xl"></div>
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-pulse"></div>
                    Recent Activity
                    <Zap className="h-4 w-4 text-violet-500" />
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1 text-sm">
                    Latest updates from your platform
                  </CardDescription>
                </div>
              
              </div>
            </CardHeader>
            <CardContent className="space-y-3 relative z-10 pb-4">
              {recentActivity.map((item) => (
                <ActivityItemComponent key={item.id} item={item} />
              ))}
            </CardContent>
          </Card>

      
        </div> */}
      </div>
    </>
  )
}
