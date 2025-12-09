"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { 
  Search,
  Filter,
  UserCheck,
  UserX,
  Download,
  PlusCircle,
  AlertTriangle,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  status?: string;
  joinDate: string;
  totalBookings: number;
  totalSpent: string;
  blacklistReason?: string;
}

export default function CustomersDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showBlacklistDialog, setShowBlacklistDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Mock data for customers list
  const allCustomers = [
    { 
      id: "USR-001", 
      name: "John Smith", 
      email: "john.smith@example.com", 
      phone: "+1 555-123-4567", 
      location: "New York, USA", 
      status: "active",
      joinDate: "2023-04-12",
      totalBookings: 8,
      totalSpent: "$1,485.50"
    },
    { 
      id: "USR-002", 
      name: "Sara Johnson", 
      email: "sara.j@example.com", 
      phone: "+1 555-987-6543", 
      location: "Los Angeles, USA", 
      status: "active",
      joinDate: "2023-05-28",
      totalBookings: 5,
      totalSpent: "$970.25"
    },
    { 
      id: "USR-003", 
      name: "Michael Brown", 
      email: "michael.brown@example.com", 
      phone: "+44 20 1234 5678", 
      location: "London, UK", 
      status: "blacklisted",
      joinDate: "2023-02-10",
      totalBookings: 3,
      totalSpent: "$425.00",
      blacklistReason: "Multiple no-shows and vehicle damage incidents"
    },
    { 
      id: "USR-004", 
      name: "Emma Davis", 
      email: "emma.davis@example.com", 
      phone: "+1 555-234-5678", 
      location: "Chicago, USA", 
      status: "active",
      joinDate: "2023-06-15",
      totalBookings: 2,
      totalSpent: "$310.75"
    },
    { 
      id: "USR-005", 
      name: "David Wilson", 
      email: "david.w@example.com", 
      phone: "+1 555-345-6789", 
      location: "Miami, USA", 
      status: "active",
      joinDate: "2023-03-22",
      totalBookings: 7,
      totalSpent: "$1,250.00"
    },
    { 
      id: "USR-006", 
      name: "Sophia Martinez", 
      email: "sophia.m@example.com", 
      phone: "+34 91 123 4567", 
      location: "Madrid, Spain", 
      status: "blacklisted",
      joinDate: "2023-01-05",
      totalBookings: 4,
      totalSpent: "$890.50",
      blacklistReason: "Payment fraud attempt"
    },
    { 
      id: "USR-007", 
      name: "James Taylor", 
      joinDate: "2023-07-30",
      totalBookings: 3,
      totalSpent: "$650.00"
    },
  ];

  const blacklistedCustomers = allCustomers.filter(customer => customer.status === "blacklisted");
  const activeCustomers = allCustomers.filter(customer => customer.status === "active");

  const handleBlacklist = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowBlacklistDialog(true);
  };

  const filteredCustomers = activeTab === "all" 
    ? allCustomers 
    : activeTab === "blacklisted" 
      ? blacklistedCustomers 
      : activeCustomers;

  const searchedCustomers = searchTerm 
    ? filteredCustomers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredCustomers;

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Management</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export
          </Button>
          <Button className="bg-[#023e8a] hover:bg-[#00b4d8] gap-2">
            <PlusCircle size={16} />
            Add Customer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="blacklisted">Blacklisted</TabsTrigger>
        </TabsList>
        
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search customers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filter
          </Button>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>
                Manage all your registered customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchedCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.location}</TableCell>
                      <TableCell>
                        {customer.status === "active" ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-200">Blacklisted</Badge>
                        )}
                      </TableCell>
                      <TableCell>{customer.totalBookings}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit customer</DropdownMenuItem>
                            <DropdownMenuItem>View bookings</DropdownMenuItem>
                            {customer.status === "active" ? (
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleBlacklist(customer)}
                              >
                                Blacklist
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-green-600">
                                Remove from blacklist
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Customers</CardTitle>
              <CardDescription>
                List of customers in good standing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchedCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.location}</TableCell>
                      <TableCell>{customer.joinDate}</TableCell>
                      <TableCell>{customer.totalSpent}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit customer</DropdownMenuItem>
                            <DropdownMenuItem>View bookings</DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleBlacklist(customer)}
                            >
                              Blacklist
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blacklisted" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blacklisted Customers</CardTitle>
              <CardDescription>
                Customers who have been blacklisted for policy violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Blacklist Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchedCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.location}</TableCell>
                      <TableCell>{customer.blacklistReason}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem className="text-green-600">
                              Remove from blacklist
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Blacklist Dialog */}
      <Dialog open={showBlacklistDialog} onOpenChange={setShowBlacklistDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Blacklist Customer
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to blacklist this customer? They will no longer be able to make bookings.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer ID</p>
                  <p>{selectedCustomer.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p>{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{selectedCustomer.phone}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Reason for blacklisting</label>
                <textarea 
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
                  rows={4}
                  placeholder="Enter reason for blacklisting this customer..."
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowBlacklistDialog(false)}>
                  Cancel
                </Button>
                <Button className="bg-red-600 hover:bg-red-700">
                  Confirm Blacklist
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
