"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  BookOpen,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { getUmrahDashboardStats } from "@/lib/api";
import { Button } from "../ui/button";

// Mock data for analytics
const monthlyRevenue = [
  { month: "Jan", revenue: 12500, bookings: 25 },
  { month: "Feb", revenue: 18200, bookings: 32 },
  { month: "Mar", revenue: 24500, bookings: 47 },
  { month: "Apr", revenue: 19800, bookings: 38 },
  { month: "May", revenue: 28900, bookings: 52 },
  { month: "Jun", revenue: 32100, bookings: 61 },
];

const packagePerformance = [
  /* Updated chart colors to use blue gradient theme */
  { name: "Economy Umrah", bookings: 45, revenue: 54000, color: "#023e8a" },
  { name: "Standard Umrah", bookings: 32, revenue: 57600, color: "#0077b6" },
  { name: "Luxury Umrah", bookings: 18, revenue: 45000, color: "#00b4d8" },
  { name: "VIP Umrah", bookings: 8, revenue: 28000, color: "#90e0ef" },
];

const upcomingDepartures = [
  {
    id: "1",
    packageName: "14 Days Luxury Umrah",
    departureDate: "2024-03-15",
    passengers: 24,
    status: "Confirmed",
    destination: "Makkah, Madinah",
  },
  {
    id: "2",
    packageName: "Economy Umrah Package",
    departureDate: "2024-03-22",
    passengers: 18,
    status: "Filling",
    destination: "Makkah, Madinah",
  },
  {
    id: "3",
    packageName: "Ramadan Special",
    departureDate: "2024-04-01",
    passengers: 32,
    status: "Confirmed",
    destination: "Makkah, Madinah, Jeddah",
  },
];

const recentBookings = [
  {
    id: "1",
    customerName: "Ahmed Hassan",
    packageName: "Luxury Umrah Package",
    amount: 2500,
    status: "Confirmed",
    bookingDate: "2024-02-28",
    passengers: 2,
  },
  {
    id: "2",
    customerName: "Fatima Ali",
    packageName: "Economy Umrah",
    amount: 1200,
    status: "Pending",
    bookingDate: "2024-02-27",
    passengers: 1,
  },
  {
    id: "3",
    customerName: "Omar Khan",
    packageName: "Standard Umrah",
    amount: 1800,
    status: "Confirmed",
    bookingDate: "2024-02-26",
    passengers: 3,
  },
];

export function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await getUmrahDashboardStats();
        setData(resp);
      } catch (e: any) {
        setError(e?.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = [
    {
      title: "Total Packages",
      value: loading ? "—" : String(data?.totalPackages ?? 0),
      description: "",
      icon: Package,
      color: "text-[#023e8a]",
      change: "",
      changeType: "",
    },
    {
      title: "Total Bookings",
      value: loading ? "—" : String(data?.stats?.totalBookings ?? 0),
      description: "",
      icon: BookOpen,
      color: "text-[#0077b6]",
      change: "",
      changeType: "",
    },
    {
      title: "Total Revenue",
      value: loading
        ? "—"
        : `$${Number(data?.stats?.totalRevenue ?? 0).toLocaleString()}`,
      description: "",
      icon: DollarSign,
      color: "text-[#00b4d8]",
      change: "",
      changeType: "",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      /* Updated badge colors to use blue gradient theme */
      Confirmed: "bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white",
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Filling: "bg-orange-100 text-orange-800 border-orange-200",
    } as const;

    return (
      <Badge
        className={`capitalize ${
          variants[status as keyof typeof variants] ||
          "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        {status}
      </Badge>
    );
  };
  const packageTypes = ["Economy", "Standard", "Luxury", "VIP"];
const colors = ["#023e8a", "#0077b6", "#00b4d8", "#90e0ef"];

// Merge API data and ensure small placeholder value for missing types
const mergedData = packageTypes.map((pkg) => {
const found = data?.stats?.result?.find((r: any) => r.packageType === pkg);
const count = found ? Number(found.count) : 0;
return { name: pkg, value: count > 0 ? count : 0.1 };
});
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's an overview of your Umrah business performance.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.description}
                </p>
                <div
                  className={`flex items-center text-xs ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                 
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <div className="mt-4">
          <Card>
            <CardContent>
              <div className="text-red-600">{error}</div>
              <div className="mt-2">
                <Button onClick={() => window.location.reload()}>Reload</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Monthly revenue and booking trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue" ? `$${value.toLocaleString()}` : value,
                    name === "revenue" ? "Revenue" : "Bookings",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#023e8a"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#00b4d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Package Performance</CardTitle>
            <CardDescription>Packages by Bookings </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
          
              <PieChart>
                {" "}
                <Pie
                  data={mergedData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value < 1 ? 0 : value}`}
                >
                  {" "}
                  {mergedData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}{" "}
                </Pie>{" "}
                <Tooltip
                  formatter={(value:number) => [`${value < 1 ? 0 : value} Bookings`, "Packages"]}
                />{" "}
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      {/* <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
          <TabsTrigger value="departures">Upcoming Departures</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                Latest booking requests and confirmations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {booking.customerName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.packageName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Users className="h-3 w-3" />
                          {booking.passengers} passengers
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-[#023e8a] dark:text-[#00b4d8]">
                          ${booking.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Departures</CardTitle>
              <CardDescription>
                Scheduled departures in the next 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDepartures.map((departure) => (
                  <div
                    key={departure.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {departure.packageName}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="h-3 w-3 text-[#00b4d8]" />
                              {new Date(
                                departure.departureDate
                              ).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="h-3 w-3 text-[#00b4d8]" />
                              {departure.destination}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {departure.passengers} passengers
                        </p>
                        <p className="text-xs text-gray-500">
                          {Math.ceil(
                            (new Date(departure.departureDate).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days left
                        </p>
                      </div>
                      {getStatusBadge(departure.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}
    </div>
  );
}
