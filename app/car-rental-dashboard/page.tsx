"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, PieChart as PieChartIcon, Calendar, Car, Users, CreditCard, 
  Settings, LogOut, AlertTriangle, CheckCircle, Clock, Eye,
  MapPin, Download, Hash
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { getCarBookingsByVendorId,getCarDashboardStats,getCarRentals, getCarRentalsVendor } from '@/lib/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
const colors = [
  "#2563eb", // blue
  "#16a34a", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
];
export default function CarRentalDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch car bookings when the "bookings" tab is active
  useEffect(() => {
    if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [activeTab]);
  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Using vendor ID '1' as example - replace with actual vendor ID as needed
      const data = await getCarBookingsByVendorId("1");
      setBookings(data || []);
      console.log("Fetched bookings:", data);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch bookings:", err);
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };


  //getting fleet information
  const [fleet, setFleet] = useState<any[]>([]);
  
  useEffect(() => {
    fetchFleet();
  }, []);
  
  const fetchFleet = async () => {  
    setLoading(true);
    try {
      const data = await getCarRentalsVendor();
      setFleet(data || []);
      console.log("Fetched fleet:", data);
      setError(null);
    }     catch (err: any) {
      console.error("Failed to fetch fleet:", err);
      setError(err.message || "Failed to load fleet");
    } finally {
      setLoading(false);
    }
  }

  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [Distribution,setDistibution] =useState<any>(null);

useEffect(() => {
  if (activeTab === "overview") {
    fetchOverviewStats();
  }
}, [activeTab]);

const fetchOverviewStats = async () => {
  setLoading(true);
  try {
    const data = await getCarDashboardStats();
    setOverviewStats(data);
    setError(null);
  } catch (err: any) {
    console.error("Failed to fetch overview stats:", err);
    setError(err.message || "Failed to load overview stats");
  } finally {
    setLoading(false);
  }
};

  // Stats data (replace with actual data from your backend)
 const stats = overviewStats
  ? [
      { title: "Total Bookings", value: overviewStats.stats.totalBookings, icon: Calendar },
      { title: "Active Vehicles", value: overviewStats.totalCars, icon: Car },
      { title: "Revenue (Month)", value: `$${overviewStats.stats.totalRevenue}`, icon: CreditCard },
    ]
  : [];

 const allVehicleTypes = ["Sedan", "SUV", "Electric", "Luxury", "Economy", "Sports"];
 const chartData: any[] = allVehicleTypes.map((type, index) => {
    const found = overviewStats?.stats?.result?.find((item: any) => item.category === type);
    return {
      name: type,
      value: found ? Number(found.count) : 0,
      color: colors[index % colors.length],
    };
  });
 const filteredChartData = chartData.filter((item) => item.value > 0);
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Car Rental Dashboard</h2>
        <div className="flex items-center space-x-2">

        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
          {/* <TabsTrigger value="partners">Partners</TabsTrigger> */}
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className="rounded-full bg-blue-100 p-2">
                    <stat.icon className="h-4 w-4 text-[#023e8a]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                 
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Booking Overview</CardTitle>
                <CardDescription>
                  Booking trends for the current month
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-80 w-full bg-slate-50 flex items-center justify-center">
                  <BarChart className="h-16 w-16 text-slate-300" />
                  <span className="ml-2 text-slate-400">Chart will render here</span>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Vehicle Distribution by Bookings</CardTitle>
              
              </CardHeader>
              <CardContent>
          {overviewStats?.stats?.result?.length > 0 ? (
        <div className="flex flex-col items-center">
          {/* Pie Chart */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={110}
                  innerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="#fff"
                >
                  {filteredChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                  labelStyle={{ fontWeight: 600 }}
                  itemStyle={{ color: "#374151" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700 font-medium">
                  {item.name}: {item.value} Booking{item.value !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-80 w-full bg-slate-50 flex items-center justify-center">
          <PieChartIcon className="h-16 w-16 text-slate-300" />
          <span className="ml-2 text-slate-400">No category data available</span>
        </div>
      )}



              </CardContent>
            </Card>
          </div>
          
      
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Car Rental Bookings</CardTitle>
              <CardDescription>
                View and manage all car rental bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="rounded-md bg-red-50 p-4 text-red-800">
                  <p>{error}</p>
                  <Button 
                    onClick={fetchBookings}
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              ) : bookings.length === 0 ? (
                <div className="rounded-md border p-8 text-center">
                  <Car className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-500 mb-4">No car bookings have been made yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 mt-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="overflow-hidden border border-gray-200 shadow-md bg-white rounded-xl">
                      <div className="flex flex-col md:flex-row items-start gap-6 p-6">
                        {/* Left: Car Image */}
                        <div className="flex-shrink-0">
                          {booking.carRental?.images && booking.carRental.images.length > 0 ? (
                            <img src={booking.carRental.images[0]} alt="Car" className="w-36 h-24 object-cover rounded-xl border" />
                          ) : (
                            <div className="w-36 h-24 bg-gray-100 flex items-center justify-center rounded-xl border text-gray-400">
                              <Car className="w-10 h-10" />
                            </div>
                          )}
                        </div>
                        {/* Middle: Main Info */}
                        <div className="flex-1 w-full">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-orange-500 text-white font-bold px-3 py-1 rounded-full">
                                RESERVED
                              </Badge>
                              <span className="text-xs text-gray-500">Booking Status</span>
                            </div>
                            <div className="text-xl font-bold text-gray-900">
                              {booking.carRental?.make || ''} {booking.carRental?.model || 'Unknown Car'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">{booking.carRental?.location || 'Unknown Location'}</span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className="text-xs">Booking ID: <span className="font-semibold">{String(booking.id).slice(0, 8)}</span></span>
                          </div>
                          <div className="flex flex-wrap gap-4 my-4">
                            <div className="bg-blue-50 rounded-xl px-4 py-2 flex items-center gap-2">
                              <Users className="w-5 h-5 text-blue-600" />
                              <div>
                                <div className="text-xs text-gray-500">CUSTOMER</div>
                                <div className="font-semibold text-gray-800">{booking.name || 'N/A'}</div>
                              </div>
                            </div>
                            <div className="bg-green-50 rounded-xl px-4 py-2 flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-green-600" />
                              <div>
                                <div className="text-xs text-gray-500">BOOKING DATE</div>
                                <div className="font-semibold text-gray-800">
                                  {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString("en-US", {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  }) : 'N/A'}
                                </div>
                              </div>
                            </div>
                            <div className="bg-purple-50 rounded-xl px-4 py-2 flex items-center gap-2">
                              <Clock className="w-5 h-5 text-purple-600" />
                              <div>
                                <div className="text-xs text-gray-500">PICKUP TIME</div>
                                <div className="font-semibold text-gray-800">{booking.pickUpTime || 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-gray-500">Contact: <span className="font-medium">{booking.phoneNo || 'N/A'}</span></div>
                            <div>
                              <div className="text-xs text-gray-500 text-right">Total Amount</div>
                              <div className="text-2xl font-bold text-purple-600">${booking.amount}</div>
                            </div>
                          </div>
                        </div>
                        {/* Right: Actions */}
                        <div className="flex flex-row md:flex-col gap-2 ml-0 md:ml-4 mt-4 md:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1 border-blue-500 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1 border-green-500 text-green-600 hover:bg-green-50"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fleet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Overview</CardTitle>
              <CardDescription>
                Summary of your vehicle fleet
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="rounded-md bg-red-50 p-4 text-red-800">
                  <p>{error}</p>
                  <Button 
                    onClick={fetchFleet}
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              ) : fleet.length === 0 ? (
                <div className="rounded-md border p-8 text-center">
                  <Car className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                  <p className="text-gray-500 mb-4">No vehicles have been added to your fleet yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 mt-4">
                  {fleet.map((car) => (
                    <div key={car.id || car._id} className="overflow-hidden border border-gray-200 shadow-md bg-white rounded-xl">
                      <div className="flex flex-col md:flex-row items-start gap-6 p-6">
                        {/* Left: Car Image */}
                        <div className="flex-shrink-0">
                          {car.images && car.images.length > 0 ? (
                            <img src={car.images[0]} alt="Car" className="w-36 h-24 object-cover rounded-xl border" />
                          ) : (
                            <div className="w-36 h-24 bg-gray-100 flex items-center justify-center rounded-xl border text-gray-400">
                              <Car className="w-10 h-10" />
                            </div>
                          )}
                        </div>
                        {/* Middle: Main Info */}
                        <div className="flex-1 w-full">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={`text-white font-bold px-3 py-1 rounded-full ${
                                car.carStatus === 'ACTIVE' || car.carStatus === 'active' 
                                  ? 'bg-green-500' 
                                  : car.carStatus === 'RENTED' || car.carStatus === 'rented' 
                                    ? 'bg-blue-500' 
                                    : 'bg-amber-500'
                              }`}>
                                {car.carStatus === 'ACTIVE' || car.carStatus === 'active' 
                                  ? 'AVAILABLE' 
                                  : car.carStatus === 'RENTED' || car.carStatus === 'rented' 
                                    ? 'RENTED' 
                                    : 'MAINTENANCE'}
                              </Badge>
                              <span className="text-xs text-gray-500">Status</span>
                            </div>
                            <div className="text-xl font-bold text-gray-900">
                              {car.make || ''} {car.model || 'Unknown Car'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">{car.location || 'Unknown Location'}</span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className="text-xs">Car ID: <span className="font-semibold">{String(car.id || car._id).slice(0, 8)}</span></span>
                          </div>
                          <div className="flex flex-wrap gap-4 my-4">
                            <div className="bg-blue-50 rounded-xl px-4 py-2 flex items-center gap-2">
                              <Hash className="w-5 h-5 text-blue-600" />
                              <div>
                                <div className="text-xs text-gray-500">LICENSE</div>
                                <div className="font-semibold text-gray-800">{car.licensePlate || 'N/A'}</div>
                              </div>
                            </div>
                            <div className="bg-purple-50 rounded-xl px-4 py-2 flex items-center gap-2">
                              <Users className="w-5 h-5 text-purple-600" />
                              <div>
                                <div className="text-xs text-gray-500">CAPACITY</div>
                                <div className="font-semibold text-gray-800">{car.seats || car.passengerCapacity || 'N/A'}</div>
                              </div>
                            </div>
                            <div className="bg-green-50 rounded-xl px-4 py-2 flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-green-600" />
                              <div>
                                <div className="text-xs text-gray-500">YEAR</div>
                                <div className="font-semibold text-gray-800">{car.year || 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-gray-500">
                              Category: <span className="font-medium">{car.category || car.type || 'N/A'}</span>
                              {car.fuelType && <span className="ml-3">Fuel: <span className="font-medium">{car.fuelType}</span></span>}
                              {car.mileage && <span className="ml-3">Mileage: <span className="font-medium">{car.mileage}</span></span>}
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 text-right">Daily Rate</div>
                              <div className="text-2xl font-bold text-purple-600">${car.dailyRate || car.price || 'N/A'}</div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            </Card>

        </TabsContent>
        
      </Tabs>
    </div>
  );
}
