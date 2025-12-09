"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Users, 
  CreditCard, 
  Bell, 
  Shield,
  Globe,
  Mail,
  Smartphone
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Settings</h2>
        <Button className="bg-[#023e8a] hover:bg-[#00b4d8]">Save Changes</Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="Aeronaa Car Rentals" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input id="businessType" defaultValue="Car Rental Services" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" defaultValue="123 Main Street, New York, NY 10001" />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Business Email</Label>
                  <Input id="email" type="email" defaultValue="contact@aeronaa.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Business Phone</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" defaultValue="https://aeronaa.com" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="automatedEmails" defaultChecked />
                <Label htmlFor="automatedEmails">Send automated booking confirmation emails</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure regional preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select id="timezone" className="w-full rounded-md border border-gray-300 p-2">
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC-6">Central Time (UTC-6)</option>
                    <option value="UTC-7">Mountain Time (UTC-7)</option>
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC+0">UTC</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <select id="currency" className="w-full rounded-md border border-gray-300 p-2">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <select id="dateFormat" className="w-full rounded-md border border-gray-300 p-2">
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your team members and their roles</CardDescription>
                </div>
                <Button className="bg-[#023e8a] hover:bg-[#00b4d8]">
                  <Users className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="p-4">
                  <p className="text-sm text-center text-muted-foreground">
                    Team members management interface will appear here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>Configure user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="p-4">
                  <p className="text-sm text-center text-muted-foreground">
                    Role management interface will appear here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Configure payment options for your customers</CardDescription>
                </div>
                <Button className="bg-[#023e8a] hover:bg-[#00b4d8]">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 p-2">
                      <CreditCard className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Credit Cards</p>
                      <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 p-2">
                      <svg className="h-6 w-6 text-[#253B80]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21c-1.06 0-2.155-.171-2.97-.628C3.2 19.99 3 19.284 3 18.57v-.28c.348-2.287 1.55-3.094 3.528-3.587.84-.22 1.894-.398 3.142-.398h.128c.114 0 .242.015.37.015 1.429.045 3.01.403 3.01 1.784 0 .957-.651 1.5-1.825 1.5-.071 0-.14 0-.213-.015-.592-.044-.759-.236-1.348-.624-.452-.312-.908-.627-1.513-.627-.825 0-1.406.314-1.406.81 0 .497.616.808 1.358.808.115 0 .231 0 .346-.015.265-.03.544-.06.826-.06 1.141 0 2.277.356 2.277 1.43 0 .958-.878 2.189-3.67 2.189z" />
                        <path d="M20.953 7.068a10.57 10.57 0 01-3.012 4.23 7.432 7.432 0 01-4.07 1.83c-.179.036-.363.053-.547.053-1.08 0-2.063-.515-2.748-1.384-.614-.737-.935-1.696-.93-2.797 0-2.2 1.666-3.818 3.729-3.818 1.618 0 2.997 1.065 3.315 2.513.112.501.094 1.036-.052 1.551-.143.538-.4 1.033-.752 1.458a2.988 2.988 0 01-.437.409c.3.035.63.053.9.053.866 0 1.725-.281 2.429-.796 1.325-.968 2.156-2.525 2.38-4.302M11.79 7.932c-.565 0-1.173.268-1.345.961-.096.357-.096.742.007 1.119.102.446.369.82.739 1.037.174.1.364.15.557.15.6 0 1.195-.29 1.337-.996.021-.117.033-.236.035-.356.007-.167-.006-.334-.038-.498-.112-.48-.393-.874-.781-1.096a1.28 1.28 0 00-.511-.32z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-gray-500">Connect your PayPal account</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 p-2">
                      <svg className="h-6 w-6 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22 4v16H2V4h20zm2-2H0v20h24V2z" />
                        <path d="M4 7h4v4H4z" />
                        <path d="M4 13h16v2H4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Bank Transfers</p>
                      <p className="text-sm text-gray-500">Allow direct bank transfers</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Processing</CardTitle>
              <CardDescription>Configure payment processing settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="depositType">Deposit Requirements</Label>
                  <select id="depositType" className="w-full rounded-md border border-gray-300 p-2">
                    <option value="percentage">Percentage of Total (25%)</option>
                    <option value="fixed">Fixed Amount ($100)</option>
                    <option value="full">Full Payment</option>
                    <option value="none">No Deposit</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                  <select id="cancellationPolicy" className="w-full rounded-md border border-gray-300 p-2">
                    <option value="flexible">Flexible (Full refund 24h before)</option>
                    <option value="moderate">Moderate (Full refund 5d before)</option>
                    <option value="strict">Strict (50% refund 7d before)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="autoCapture" defaultChecked />
                <Label htmlFor="autoCapture">Automatically capture payments upon booking</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="sendReceipts" defaultChecked />
                <Label htmlFor="sendReceipts">Send email receipts to customers</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-4 text-sm font-medium">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="emailBookings">New Booking Notifications</Label>
                    </div>
                    <Switch id="emailBookings" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="emailCancellations">Cancellation Notifications</Label>
                    </div>
                    <Switch id="emailCancellations" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="emailPayments">Payment Notifications</Label>
                    </div>
                    <Switch id="emailPayments" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="emailReviews">Review Notifications</Label>
                    </div>
                    <Switch id="emailReviews" />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="mb-4 text-sm font-medium">SMS Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="smsBookings">New Booking Notifications</Label>
                    </div>
                    <Switch id="smsBookings" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-gray-500" />
                      <Label htmlFor="smsCancellations">Cancellation Notifications</Label>
                    </div>
                    <Switch id="smsCancellations" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Notification Email Address</Label>
                <Input id="notificationEmail" type="email" defaultValue="alerts@aeronaa.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notificationPhone">Notification Phone Number</Label>
                <Input id="notificationPhone" type="tel" defaultValue="+1 (555) 987-6543" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Customer Notifications</CardTitle>
              <CardDescription>Configure automatic notifications sent to customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Booking Confirmation</p>
                    <p className="text-sm text-gray-500">Send confirmation email when booking is confirmed</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Booking Reminders</p>
                    <p className="text-sm text-gray-500">Send reminder 24 hours before pickup</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Post-Rental Reviews</p>
                    <p className="text-sm text-gray-500">Prompt customer for review after rental</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Promotional Emails</p>
                    <p className="text-sm text-gray-500">Send periodic deals and promotions</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure your account security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Authentication</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <Label htmlFor="2fa">Two-Factor Authentication</Label>
                  </div>
                  <Switch id="2fa" />
                </div>
                
                <div className="space-y-1">
                  <Button variant="outline" className="w-full justify-start text-left">
                    Reset Password
                  </Button>
                  <p className="text-xs text-gray-500">Last changed: 30 days ago</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">API Access</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <Label htmlFor="apiAccess">Enable API Access</Label>
                  </div>
                  <Switch id="apiAccess" defaultChecked />
                </div>
                
                <div className="space-y-1">
                  <Button variant="outline" className="w-full justify-start text-left">
                    Manage API Keys
                  </Button>
                  <p className="text-xs text-gray-500">2 active API keys</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Session Management</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  </div>
                  <Input id="sessionTimeout" type="number" defaultValue="30" className="w-20 text-right" />
                </div>
                
                <div className="space-y-1">
                  <Button variant="outline" className="w-full justify-start text-left text-red-600 hover:bg-red-50 hover:text-red-700">
                    Terminate All Active Sessions
                  </Button>
                  <p className="text-xs text-gray-500">This will log out all devices</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Security Logs</h3>
                
                <div className="rounded-md border p-4">
                  <p className="text-sm text-center text-muted-foreground">
                    Security logs and activity history will appear here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
