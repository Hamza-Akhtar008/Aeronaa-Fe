"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  Download, 
  Calendar, 
  Mail
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReportsDashboard() {
  const [reportPeriod, setReportPeriod] = useState("monthly");
  
  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <div className="flex items-center gap-2">
          <Select 
            defaultValue="monthly" 
            onValueChange={(value) => setReportPeriod(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-[#023e8a] hover:bg-[#00b4d8] gap-2">
            <Download size={16} />
            Export Reports
          </Button>
        </div>
      </div>

      <Tabs defaultValue="business" className="space-y-4">
        <TabsList>
          <TabsTrigger value="business">Business Performance</TabsTrigger>
          <TabsTrigger value="fleet">Fleet Analytics</TabsTrigger>
          <TabsTrigger value="customer">Customer Insights</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="business" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <div className="rounded-full bg-blue-100 p-1">
                  <BarChartIcon className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,248</div>
                <p className="text-xs text-green-500">+12% from last {reportPeriod}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
                <div className="rounded-full bg-purple-100 p-1">
                  <PieChartIcon className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76.8%</div>
                <p className="text-xs text-green-500">+5.2% from last {reportPeriod}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rental Duration</CardTitle>
                <div className="rounded-full bg-yellow-100 p-1">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 days</div>
                <p className="text-xs text-green-500">+0.3 days from last {reportPeriod}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue per Vehicle</CardTitle>
                <div className="rounded-full bg-green-100 p-1">
                  <LineChartIcon className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$876.45</div>
                <p className="text-xs text-green-500">+8.3% from last {reportPeriod}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Business Performance Overview</CardTitle>
              <CardDescription>
                Key metrics and trends across your car rental operation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full bg-slate-50 flex items-center justify-center">
                <LineChartIcon className="h-16 w-16 text-slate-300" />
                <span className="ml-2 text-slate-400">Performance chart will render here</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>
                  Monthly booking volume over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full bg-slate-50 flex items-center justify-center">
                  <BarChartIcon className="h-12 w-12 text-slate-300" />
                  <span className="ml-2 text-slate-400">Booking trend chart will render here</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
                <CardDescription>
                  Revenue by vehicle category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full bg-slate-50 flex items-center justify-center">
                  <PieChartIcon className="h-12 w-12 text-slate-300" />
                  <span className="ml-2 text-slate-400">Revenue distribution chart will render here</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="fleet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Performance</CardTitle>
              <CardDescription>
                Vehicle utilization and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Top Performing Vehicles</h3>
                    <ol className="space-y-1">
                      <li className="text-sm flex justify-between">
                        <span>Toyota RAV4 (SUV)</span>
                        <span className="font-semibold">94% utilization</span>
                      </li>
                      <li className="text-sm flex justify-between">
                        <span>Tesla Model 3 (Electric)</span>
                        <span className="font-semibold">92% utilization</span>
                      </li>
                      <li className="text-sm flex justify-between">
                        <span>Honda CR-V (SUV)</span>
                        <span className="font-semibold">89% utilization</span>
                      </li>
                      <li className="text-sm flex justify-between">
                        <span>Ford Mustang (Sports)</span>
                        <span className="font-semibold">86% utilization</span>
                      </li>
                      <li className="text-sm flex justify-between">
                        <span>Jeep Wrangler (SUV)</span>
                        <span className="font-semibold">85% utilization</span>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Underperforming Vehicles</h3>
                    <ol className="space-y-1">
                      <li className="text-sm flex justify-between">
                        <span>Chevrolet Spark (Economy)</span>
                        <span className="font-semibold">42% utilization</span>
                      </li>
                      <li className="text-sm flex justify-between">
                        <span>Ford Focus (Compact)</span>
                        <span className="font-semibold">45% utilization</span>
                      </li>
                      <li className="text-sm flex justify-between">
                        <span>Hyundai Accent (Economy)</span>
                        <span className="font-semibold">47% utilization</span>
                      </li>
                    </ol>
                  </div>
                </div>
                
                <div className="h-64 border rounded-lg flex items-center justify-center">
                  <PieChartIcon className="h-12 w-12 text-slate-300" />
                  <span className="ml-2 text-slate-400">Vehicle category distribution chart</span>
                </div>
              </div>
              
              <div className="mt-8 h-64 w-full bg-slate-50 flex items-center justify-center">
                <BarChartIcon className="h-12 w-12 text-slate-300" />
                <span className="ml-2 text-slate-400">Fleet performance chart will render here</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Analytics</CardTitle>
              <CardDescription>
                Vehicle maintenance statistics and cost analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-slate-50 flex items-center justify-center">
                <LineChartIcon className="h-12 w-12 text-slate-300" />
                <span className="ml-2 text-slate-400">Maintenance cost chart will render here</span>
              </div>
              
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4 text-center">
                  <h3 className="text-lg font-medium text-[#023e8a]">$24,850</h3>
                  <p className="text-sm text-gray-500">Total maintenance cost ({reportPeriod})</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <h3 className="text-lg font-medium text-[#023e8a]">87</h3>
                  <p className="text-sm text-gray-500">Maintenance requests ({reportPeriod})</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <h3 className="text-lg font-medium text-[#023e8a]">$198.40</h3>
                  <p className="text-sm text-gray-500">Avg. maintenance cost per vehicle</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Demographics</CardTitle>
              <CardDescription>
                Insights into your customer base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-80 w-full bg-slate-50 flex items-center justify-center">
                  <PieChartIcon className="h-12 w-12 text-slate-300" />
                  <span className="ml-2 text-slate-400">Age distribution chart</span>
                </div>
                <div className="h-80 w-full bg-slate-50 flex items-center justify-center">
                  <BarChartIcon className="h-12 w-12 text-slate-300" />
                  <span className="ml-2 text-slate-400">Regional distribution chart</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>
                  Ratings and feedback analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full bg-slate-50 flex items-center justify-center">
                  <LineChartIcon className="h-12 w-12 text-slate-300" />
                  <span className="ml-2 text-slate-400">Satisfaction trend chart</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
                <CardDescription>
                  Repeat booking metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full bg-slate-50 flex items-center justify-center">
                  <LineChartIcon className="h-12 w-12 text-slate-300" />
                  <span className="ml-2 text-slate-400">Retention chart</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Customer Feedback Summary</CardTitle>
              <CardDescription>
                Key insights from customer reviews and ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Top Positive Feedback Topics</h3>
                  <ol className="space-y-1">
                    <li className="text-sm">Clean, well-maintained vehicles (87% positive)</li>
                    <li className="text-sm">Friendly and helpful staff (82% positive)</li>
                    <li className="text-sm">Easy booking process (79% positive)</li>
                    <li className="text-sm">Competitive pricing (75% positive)</li>
                  </ol>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Areas for Improvement</h3>
                  <ol className="space-y-1">
                    <li className="text-sm">Pickup wait times (23% negative)</li>
                    <li className="text-sm">Vehicle availability during peak seasons (18% negative)</li>
                    <li className="text-sm">Additional fees clarity (15% negative)</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>
                  Detailed revenue breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full bg-slate-50 flex items-center justify-center">
                  <LineChartIcon className="h-12 w-12 text-slate-300" />
                  <span className="ml-2 text-slate-400">Revenue trend chart</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Analysis</CardTitle>
                <CardDescription>
                  Operational cost breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full bg-slate-50 flex items-center justify-center">
                  <PieChartIcon className="h-12 w-12 text-slate-300" />
                  <span className="ml-2 text-slate-400">Expense distribution chart</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Financial Report Documents</CardTitle>
              <CardDescription>
                Download detailed financial reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <BarChartIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Financial Summary - {reportPeriod}</p>
                      <p className="text-sm text-gray-500">Complete financial statement</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download size={14} />
                    PDF
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <LineChartIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Revenue Report - {reportPeriod}</p>
                      <p className="text-sm text-gray-500">Detailed revenue analysis</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download size={14} />
                    Excel
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-red-100 p-2">
                      <PieChartIcon className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Expense Report - {reportPeriod}</p>
                      <p className="text-sm text-gray-500">Detailed expense analysis</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download size={14} />
                    Excel
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-purple-100 p-2">
                      <Mail className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Tax Statement - {reportPeriod}</p>
                      <p className="text-sm text-gray-500">Tax documentation</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download size={14} />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss</CardTitle>
              <CardDescription>
                P&L statement summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-slate-50 flex items-center justify-center">
                <BarChartIcon className="h-12 w-12 text-slate-300" />
                <span className="ml-2 text-slate-400">Profit & Loss chart will render here</span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border p-4 text-center">
                  <h3 className="text-lg font-medium text-[#023e8a]">$156,850</h3>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <h3 className="text-lg font-medium text-[#023e8a]">$98,230</h3>
                  <p className="text-sm text-gray-500">Total Expenses</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <h3 className="text-lg font-medium text-green-600">$58,620</h3>
                  <p className="text-sm text-gray-500">Net Profit</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <h3 className="text-lg font-medium text-green-600">37.4%</h3>
                  <p className="text-sm text-gray-500">Profit Margin</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Schedule Reports</CardTitle>
            <CardDescription>
              Set up automatic report delivery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Reports To:</label>
                <input 
                  type="email" 
                  placeholder="email@example.com"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Frequency:</label>
                <Select defaultValue="weekly">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type:</label>
                <Select defaultValue="summary">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Executive Summary</SelectItem>
                    <SelectItem value="detailed">Detailed Report</SelectItem>
                    <SelectItem value="financial">Financial Report</SelectItem>
                    <SelectItem value="fleet">Fleet Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-[#023e8a] hover:bg-[#00b4d8]">
                Schedule Report
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Custom Report Builder</CardTitle>
            <CardDescription>
              Create customized reports with the metrics you need
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">Select metrics to include in your custom report:</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="revenue" className="rounded text-[#023e8a] focus:ring-[#023e8a]" />
                  <label htmlFor="revenue" className="text-sm">Revenue</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="bookings" className="rounded text-[#023e8a] focus:ring-[#023e8a]" />
                  <label htmlFor="bookings" className="text-sm">Bookings</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="fleet" className="rounded text-[#023e8a] focus:ring-[#023e8a]" />
                  <label htmlFor="fleet" className="text-sm">Fleet Utilization</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="customers" className="rounded text-[#023e8a] focus:ring-[#023e8a]" />
                  <label htmlFor="customers" className="text-sm">Customer Data</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="expenses" className="rounded text-[#023e8a] focus:ring-[#023e8a]" />
                  <label htmlFor="expenses" className="text-sm">Expenses</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="profit" className="rounded text-[#023e8a] focus:ring-[#023e8a]" />
                  <label htmlFor="profit" className="text-sm">Profit & Loss</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="maintenance" className="rounded text-[#023e8a] focus:ring-[#023e8a]" />
                  <label htmlFor="maintenance" className="text-sm">Maintenance</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="partners" className="rounded text-[#023e8a] focus:ring-[#023e8a]" />
                  <label htmlFor="partners" className="text-sm">Partner Performance</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="satisfaction" className="rounded text-[#023e8a] focus:ring-[#023e8a]" />
                  <label htmlFor="satisfaction" className="text-sm">Customer Satisfaction</label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range:</label>
                  <Select defaultValue="last30">
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last7">Last 7 days</SelectItem>
                      <SelectItem value="last30">Last 30 days</SelectItem>
                      <SelectItem value="last90">Last 90 days</SelectItem>
                      <SelectItem value="ytd">Year to date</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Format:</label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button className="bg-[#023e8a] hover:bg-[#00b4d8]">
                Generate Custom Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
