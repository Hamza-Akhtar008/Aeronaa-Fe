"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart,
  LineChart,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FinancialDashboard() {
  const [period, setPeriod] = useState("monthly");
  const [activeTab, setActiveTab] = useState("revenue");
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Management</h2>
        <div className="flex items-center gap-2">
          <Select 
            defaultValue="monthly" 
            onValueChange={(value) => setPeriod(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <div className="rounded-full bg-green-100 p-1">
              <BarChart className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              <span>+20.1% from last {period}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bookings
            </CardTitle>
            <div className="rounded-full bg-blue-100 p-1">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              <span>+12.2% from last {period}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Booking Value
            </CardTitle>
            <div className="rounded-full bg-purple-100 p-1">
              <LineChart className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$189.43</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              <span>+7.4% from last {period}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cancellation Rate
            </CardTitle>
            <div className="rounded-full bg-red-100 p-1">
              <PieChart className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2%</div>
            <div className="flex items-center text-xs text-red-600">
              <ArrowDownRight className="mr-1 h-3 w-3" />
              <span>-1.1% from last {period}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="revenue" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>
                Revenue breakdown by vehicle category and time period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full bg-slate-50 flex items-center justify-center">
                <BarChart className="h-16 w-16 text-slate-300" />
                <span className="ml-2 text-slate-400">Revenue chart will render here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  List of recent payment transactions
                </CardDescription>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">TRX-2023-10001</TableCell>
                    <TableCell>2025-06-10</TableCell>
                    <TableCell>John Smith</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell>$245.00</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TRX-2023-10002</TableCell>
                    <TableCell>2025-06-11</TableCell>
                    <TableCell>Alice Johnson</TableCell>
                    <TableCell>PayPal</TableCell>
                    <TableCell>$320.50</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TRX-2023-10003</TableCell>
                    <TableCell>2025-06-12</TableCell>
                    <TableCell>Robert Brown</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell>$198.75</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TRX-2023-10004</TableCell>
                    <TableCell>2025-06-13</TableCell>
                    <TableCell>Emma Davis</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell>$412.00</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TRX-2023-10005</TableCell>
                    <TableCell>2025-06-14</TableCell>
                    <TableCell>Michael Wilson</TableCell>
                    <TableCell>Apple Pay</TableCell>
                    <TableCell>$155.25</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                Manage invoices and billing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-8 flex items-center justify-center">
                <p className="text-sm text-center text-muted-foreground">
                  Invoice management interface coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="refunds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Refund Requests</CardTitle>
              <CardDescription>
                Manage customer refund requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-8 flex items-center justify-center">
                <p className="text-sm text-center text-muted-foreground">
                  Refund management interface coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>
                Generate and download financial reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-8 flex items-center justify-center">
                <p className="text-sm text-center text-muted-foreground">
                  Financial reporting tools coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
