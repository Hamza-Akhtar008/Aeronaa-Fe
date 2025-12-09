"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, AlertTriangle, CheckCircle, Filter, Download } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data - replace with real data from your API
const bookings = [
  {
    id: "BK-3846",
    customerName: "John Smith",
    vehicle: "Toyota Camry",
    status: "confirmed",
    startDate: "2025-06-15",
    endDate: "2025-06-18",
    totalAmount: "$240.00",
    location: "New York City"
  },
  {
    id: "BK-3847",
    customerName: "Sarah Johnson",
    vehicle: "Honda CR-V",
    status: "pending",
    startDate: "2025-06-16",
    endDate: "2025-06-20",
    totalAmount: "$320.00",
    location: "Los Angeles"
  },
  {
    id: "BK-3848",
    customerName: "Michael Brown",
    vehicle: "Tesla Model 3",
    status: "confirmed",
    startDate: "2025-06-18",
    endDate: "2025-06-22",
    totalAmount: "$480.00",
    location: "San Francisco"
  },
  {
    id: "BK-3849",
    customerName: "Emma Davis",
    vehicle: "Ford Mustang",
    status: "completed",
    startDate: "2025-06-10",
    endDate: "2025-06-13",
    totalAmount: "$360.00",
    location: "Miami"
  },
  {
    id: "BK-3850",
    customerName: "David Wilson",
    vehicle: "Jeep Wrangler",
    status: "confirmed",
    startDate: "2025-06-20",
    endDate: "2025-06-25",
    totalAmount: "$500.00",
    location: "Denver"
  },
  {
    id: "BK-3851",
    customerName: "Lisa Taylor",
    vehicle: "Chevrolet Tahoe",
    status: "cancelled",
    startDate: "2025-06-14",
    endDate: "2025-06-18",
    totalAmount: "$400.00",
    location: "Chicago"
  },
  {
    id: "BK-3852",
    customerName: "Robert Martin",
    vehicle: "BMW X5",
    status: "pending",
    startDate: "2025-06-17",
    endDate: "2025-06-19",
    totalAmount: "$320.00",
    location: "Boston"
  },
  {
    id: "BK-3853",
    customerName: "Jennifer Garcia",
    vehicle: "Audi Q5",
    status: "confirmed",
    startDate: "2025-06-22",
    endDate: "2025-06-26",
    totalAmount: "$440.00",
    location: "Seattle"
  }
];

const pendingBookings = bookings.filter(booking => booking.status === "pending");
const cancelledBookings = bookings.filter(booking => booking.status === "cancelled");

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter bookings based on search term and active tab
  const filteredBookings = activeTab === "all" 
    ? bookings 
    : activeTab === "pending" 
      ? pendingBookings 
      : cancelledBookings;
      
  const searchedBookings = searchTerm 
    ? filteredBookings.filter(booking => 
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredBookings;

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bookings Management</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export
          </Button>
          <Button className="bg-[#023e8a] hover:bg-[#00b4d8]">
            New Booking
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="cancelled">Cancellations</TabsTrigger>
        </TabsList>
        
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <Calendar className="h-4 w-4 text-gray-500" />
            </div>
            <Input
              type="date"
              className="pl-8"
              placeholder="Filter by date"
            />
          </div>
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <Filter className="h-4 w-4 text-gray-500" />
            </div>
            <Input
              placeholder="Search bookings..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "all" ? "All Bookings" : 
               activeTab === "pending" ? "Pending Approval Bookings" : 
               "Cancelled Bookings"}
            </CardTitle>
            <CardDescription>
              {activeTab === "all" ? "Manage all your car rental bookings" : 
               activeTab === "pending" ? "Bookings awaiting your approval" : 
               "Bookings that have been cancelled"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchedBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>{booking.vehicle}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{booking.startDate}</span>
                        <span>to</span>
                        <span>{booking.endDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>{booking.location}</TableCell>
                    <TableCell>{booking.totalAmount}</TableCell>
                    <TableCell>
                      {booking.status === "confirmed" ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>
                      ) : booking.status === "pending" ? (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
                      ) : booking.status === "completed" ? (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        {booking.status === "pending" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Approve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Booking Confirmed</p>
                  <p className="text-xs text-gray-500">BK-3853 • 10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-yellow-100 p-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">New Booking Request</p>
                  <p className="text-xs text-gray-500">BK-3852 • 1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-red-100 p-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Booking Cancelled</p>
                  <p className="text-xs text-gray-500">BK-3851 • 2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Upcoming Pickups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Toyota Camry</p>
                  <p className="text-xs text-gray-500">John Smith • Today, 2:00 PM</p>
                </div>
                <Button variant="outline" size="sm">Details</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Honda CR-V</p>
                  <p className="text-xs text-gray-500">Sarah Johnson • Tomorrow, 10:30 AM</p>
                </div>
                <Button variant="outline" size="sm">Details</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Tesla Model 3</p>
                  <p className="text-xs text-gray-500">Michael Brown • Jun 18, 9:00 AM</p>
                </div>
                <Button variant="outline" size="sm">Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Upcoming Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">BMW X5</p>
                  <p className="text-xs text-gray-500">Alex Thompson • Today, 6:00 PM</p>
                </div>
                <Button variant="outline" size="sm">Details</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Ford Mustang</p>
                  <p className="text-xs text-gray-500">Emma Davis • Tomorrow, 4:30 PM</p>
                </div>
                <Button variant="outline" size="sm">Details</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Audi Q5</p>
                  <p className="text-xs text-gray-500">Jennifer Garcia • Jun 19, 12:00 PM</p>
                </div>
                <Button variant="outline" size="sm">Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
