"use client"

import { useState } from "react"
import { Send, Eye, Users, Filter, ImageIcon, Bell } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

// Mock notification history data
const notificationHistory = [
  {
    id: "N001",
    title: "New Hotel Listings Available",
    message: "Check out our latest luxury hotel listings in Dubai Marina with special opening rates!",
    type: "promotional",
    target: "All Users",
    sentOn: "2024-03-20 14:30",
    recipients: 2847,
    openRate: "68%",
    clickRate: "12%",
    hasImage: true,
  },
  {
    id: "N002",
    title: "System Maintenance Notice",
    message: "Our platform will undergo scheduled maintenance on March 25th from 2:00 AM to 4:00 AM UTC.",
    type: "system",
    target: "All Users",
    sentOn: "2024-03-18 09:15",
    recipients: 2847,
    openRate: "89%",
    clickRate: "5%",
    hasImage: false,
  },
  {
    id: "N003",
    title: "New Vendor Application Guidelines",
    message: "Updated guidelines for vendor applications are now available. Please review the new requirements.",
    type: "announcement",
    target: "Vendors",
    sentOn: "2024-03-15 16:45",
    recipients: 573,
    openRate: "92%",
    clickRate: "34%",
    hasImage: false,
  },
  {
    id: "N004",
    title: "Ramadan Special Umrah Packages",
    message: "Discover our exclusive Ramadan Umrah packages with premium accommodations and spiritual guidance.",
    type: "promotional",
    target: "Umrah Service Users",
    sentOn: "2024-03-12 11:20",
    recipients: 456,
    openRate: "76%",
    clickRate: "28%",
    hasImage: true,
  },
  {
    id: "N005",
    title: "Car Rental Safety Guidelines",
    message: "Important safety guidelines and new features for our car rental service. Your safety is our priority.",
    type: "announcement",
    target: "Car Service Users",
    sentOn: "2024-03-10 13:00",
    recipients: 892,
    openRate: "71%",
    clickRate: "15%",
    hasImage: false,
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case "promotional":
      return "bg-violet-100 text-violet-700 border-violet-200"
    case "system":
      return "bg-red-100 text-red-700 border-red-200"
    case "announcement":
      return "bg-electric-100 text-electric-700 border-electric-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

export default function NotificationsPage() {
  const [selectedNotification, setSelectedNotification] = useState<any>(null)
  const [previewModal, setPreviewModal] = useState(false)
  const [composer, setComposer] = useState({
    title: "",
    message: "",
    audience: "",
    serviceType: "",
    hasImage: false,
    imageUrl: "",
  })
  const [filters, setFilters] = useState({
    type: "",
    target: "",
    dateFrom: "",
  })

  const filteredNotifications = notificationHistory.filter((notification) => {
    return (
      (!filters.type || notification.type === filters.type) &&
      (!filters.target || notification.target.toLowerCase().includes(filters.target.toLowerCase())) &&
      (!filters.dateFrom || notification.sentOn >= filters.dateFrom)
    )
  })

  const handleSendNotification = () => {
    console.log("Sending notification:", composer)
    // Reset composer
    setComposer({
      title: "",
      message: "",
      audience: "",
      serviceType: "",
      hasImage: false,
      imageUrl: "",
    })
  }

  const getAudienceSize = () => {
    switch (composer.audience) {
      case "all-users":
        return "2,847 users"
      case "vendors":
        return "573 vendors"
      case "hotel-users":
        return "1,245 users"
      case "car-users":
        return "892 users"
      case "property-users":
        return "234 users"
      case "umrah-users":
        return "456 users"
      case "flight-users":
        return "678 users"
      default:
        return "Select audience"
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-gray-600 mt-2 text-lg">Send platform-wide notifications and manage communication</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-start/90 hover:to-primary-end/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl px-6">
            <Bell className="h-4 w-4 mr-2" />
            Quick Notification
          </Button>
        </div>
      </div>

      {/* Notification Composer */}
      <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Send className="h-5 w-5" />
            Notification Composer
          </CardTitle>
          <CardDescription className="text-gray-600 mt-1">Create and send notifications to your users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                  Notification Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter notification title..."
                  value={composer.title}
                  onChange={(e) => setComposer({ ...composer, title: e.target.value })}
                  className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Enter your notification message..."
                  value={composer.message}
                  onChange={(e) => setComposer({ ...composer, message: e.target.value })}
                  className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20"
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasImage"
                  checked={composer.hasImage}
                  onCheckedChange={(checked) => setComposer({ ...composer, hasImage: checked as boolean })}
                />
                <Label htmlFor="hasImage" className="text-sm font-medium text-gray-700">
                  Include image
                </Label>
              </div>
              {composer.hasImage && (
                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-sm font-semibold text-gray-700">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    placeholder="Enter image URL..."
                    value={composer.imageUrl}
                    onChange={(e) => setComposer({ ...composer, imageUrl: e.target.value })}
                    className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20"
                  />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="audience" className="text-sm font-semibold text-gray-700">
                  Target Audience
                </Label>
                <Select
                  value={composer.audience}
                  onValueChange={(value) => setComposer({ ...composer, audience: value })}
                >
                  <SelectTrigger className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-users">All Users</SelectItem>
                    <SelectItem value="vendors">All Vendors</SelectItem>
                    <SelectItem value="hotel-users">Hotel Service Users</SelectItem>
                    <SelectItem value="car-users">Car Service Users</SelectItem>
                    <SelectItem value="property-users">Property Service Users</SelectItem>
                    <SelectItem value="umrah-users">Umrah Service Users</SelectItem>
                    <SelectItem value="flight-users">Flight Service Users</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {getAudienceSize()}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Notification Preview</h3>
                <div className="space-y-2">
                  <div className="font-medium text-gray-900">{composer.title || "Notification Title"}</div>
                  <div className="text-sm text-gray-600">
                    {composer.message || "Your notification message will appear here..."}
                  </div>
                  {composer.hasImage && composer.imageUrl && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ImageIcon className="h-3 w-3" />
                      Image attached
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Dialog open={previewModal} onOpenChange={setPreviewModal}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-2xl border-gray-200 hover:bg-gray-50"
                      disabled={!composer.title || !composer.message}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md rounded-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-gray-900">Notification Preview</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        How your notification will appear to users
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-start to-primary-end rounded-full flex items-center justify-center">
                            <Bell className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 mb-1">{composer.title}</div>
                            <div className="text-sm text-gray-600 mb-2">{composer.message}</div>
                            {composer.hasImage && composer.imageUrl && (
                              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                            <div className="text-xs text-gray-400 mt-2">Just now</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={handleSendNotification}
                  disabled={!composer.title || !composer.message || !composer.audience}
                  className="flex-1 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-start/90 hover:to-primary-end/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Notification History Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-semibold text-gray-700">
                Type
              </Label>
              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promotional">Promotional</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target" className="text-sm font-semibold text-gray-700">
                Target
              </Label>
              <Input
                id="target"
                placeholder="Search by target audience..."
                value={filters.target}
                onChange={(e) => setFilters({ ...filters, target: e.target.value })}
                className="rounded-2xl border-gray-200 focus:border-primary-start/50 focus:ring-primary-start/20"
              />
            </div>
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
          </div>
        </CardContent>
      </Card>

      {/* Notification History Table */}
      <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Notification History ({filteredNotifications.length})
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">Track sent notifications and performance</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="font-semibold text-gray-700">Message</TableHead>
                  <TableHead className="font-semibold text-gray-700">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Target</TableHead>
                  <TableHead className="font-semibold text-gray-700">Sent On</TableHead>
                  <TableHead className="font-semibold text-gray-700">Recipients</TableHead>
                  <TableHead className="font-semibold text-gray-700">Performance</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id} className="border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 max-w-[250px] truncate">{notification.title}</div>
                        <div className="text-sm text-gray-500 max-w-[250px] truncate">{notification.message}</div>
                        {notification.hasImage && (
                          <div className="flex items-center gap-1">
                            <ImageIcon className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">Image attached</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getTypeColor(notification.type)} border font-medium capitalize`}>
                        {notification.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{notification.target}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{notification.sentOn}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{notification.recipients.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600">
                          Open: <span className="font-medium text-emerald-600">{notification.openRate}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Click: <span className="font-medium text-electric-600">{notification.clickRate}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-gray-200 hover:bg-gray-50"
                            onClick={() => setSelectedNotification(notification)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-3xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-900">
                              Notification Details - {selectedNotification?.id}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                              Complete notification information and performance metrics
                            </DialogDescription>
                          </DialogHeader>
                          {selectedNotification && (
                            <div className="space-y-6">
                              {/* Notification Content */}
                              <div className="p-4 bg-gray-50 rounded-xl">
                                <h3 className="font-semibold text-gray-900 mb-2">{selectedNotification.title}</h3>
                                <p className="text-gray-700 mb-3">{selectedNotification.message}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <Badge className={`${getTypeColor(selectedNotification.type)} border font-medium`}>
                                    {selectedNotification.type}
                                  </Badge>
                                  <span>Target: {selectedNotification.target}</span>
                                  <span>Sent: {selectedNotification.sentOn}</span>
                                </div>
                              </div>

                              {/* Performance Metrics */}
                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                                  <div className="text-2xl font-bold text-emerald-600">
                                    {selectedNotification.recipients.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-emerald-700">Recipients</div>
                                </div>
                                <div className="text-center p-4 bg-electric-50 rounded-xl">
                                  <div className="text-2xl font-bold text-electric-600">
                                    {selectedNotification.openRate}
                                  </div>
                                  <div className="text-sm text-electric-700">Open Rate</div>
                                </div>
                                <div className="text-center p-4 bg-violet-50 rounded-xl">
                                  <div className="text-2xl font-bold text-violet-600">
                                    {selectedNotification.clickRate}
                                  </div>
                                  <div className="text-sm text-violet-700">Click Rate</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
