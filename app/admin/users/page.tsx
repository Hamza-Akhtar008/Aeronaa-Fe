"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Filter, Eye, Ban, CheckCircle, User, Mail, Phone, ChevronRight, ChevronLeft } from "lucide-react"

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
import { FetchallUser, GetallBookings } from "@/lib/api"

// Updated user data structure to match your schema



interface UIBooking {
  id: number
  isActive: boolean
  checkIndate: string
  checkOutDate: string
  numberOfDays: string
  amount: string
  user: {
    id: number
    name: string
    email: string
  }
  hotel: Hotel
  room: Room[]
}

const getStatusColor = (isActive: boolean) => {
  return isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"
}

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "vendor":
      return "bg-violet-100 text-violet-700 border-violet-200"
    case "user":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "admin":
      return "bg-amber-100 text-amber-700 border-amber-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [filters, setFilters] = useState({
    role: "",
    isActive: "",
    createdAt: "",
    name: "",
  })
  const [users, setUsers] = useState<any[]>([])
  const [bookings, setBookings] = useState<UIBooking[]>([])
  const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
  const fetchbookings = async () => {
    const response = await GetallBookings()
    setBookings(response)
  }
  useEffect(() => {
    fetchbookings()
  }, []) // Add empty dependency array

  useEffect(() => {
    fetchUsers()
  }, []) // Add empty dependency array
  const filteredUsers = users.filter((user) => {
    return (
      (!filters.role || user.role.toLowerCase() === filters.role.toLowerCase()) &&
      (!filters.isActive || (filters.isActive === "active" ? user.isActive : !user.isActive)) &&
      (!filters.createdAt || new Date(user.createdAt) >= new Date(filters.createdAt)) &&
      (!filters.name || user.name.toLowerCase().includes(filters.name.toLowerCase()))
    )
  })
 const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)
  const fetchUsers = async () => {
    const response = await FetchallUser()
    setUsers(response.filter((user: { role: string }) => user.role === "user"))
  }

  const toggleUserStatus = (userId: number) => {
    // This would typically make an API call to update the user status
    console.log(`Toggling status for user ${userId}`)
  }

  const getUserBookings = useCallback(
    (userId: number) => {
      return bookings.filter((booking) => booking.user?.id === userId)
    },
    [bookings],
  )

  const calculateUserStats = useCallback(
    (userId: number) => {
      const userBookings = getUserBookings(userId)
      const totalBookings = userBookings.length
      const totalAmount = userBookings.reduce((sum, booking) => {
        if (booking.isActive === true) {
          return sum + Number.parseFloat(booking.amount)
        } else {
          return sum + 0
        }
      }, 0)
      return { totalBookings, totalAmount }
    },
    [getUserBookings],
  )

  // Add memoized user stats for the table
  const userStatsMap = useMemo(() => {
    const statsMap = new Map()
    filteredUsers.forEach((user) => {
      statsMap.set(user.id, calculateUserStats(user.id))
    })
    return statsMap
  }, [filteredUsers, calculateUserStats])

  const getBookingStatusColor = (isActive: boolean) => {
    return isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-700 border-gray-200"
  }

  const selectedUserBookings = useMemo(() => {
    return selectedUser ? getUserBookings(selectedUser.id) : []
  }, [selectedUser, getUserBookings])

  const selectedUserStats = useMemo(() => {
    return selectedUser ? calculateUserStats(selectedUser.id) : { totalBookings: 0, totalAmount: 0 }
  }, [selectedUser, calculateUserStats])
 const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage users and vendors on your platform</p>
        </div>
       
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-semibold text-gray-700">
                Role
              </Label>
              <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
                <SelectTrigger className="rounded-2xl border-gray-200 focus:border-blue-500/50 focus:ring-blue-500/20">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold text-gray-700">
                Status
              </Label>
              <Select value={filters.isActive} onValueChange={(value) => setFilters({ ...filters, isActive: value })}>
                <SelectTrigger className="rounded-2xl border-gray-200 focus:border-blue-500/50 focus:ring-blue-500/20">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="createdAt" className="text-sm font-semibold text-gray-700">
                Registration Date
              </Label>
              <Input
                id="createdAt"
                type="date"
                value={filters.createdAt}
                onChange={(e) => setFilters({ ...filters, createdAt: e.target.value })}
                className="rounded-2xl border-gray-200 focus:border-blue-500/50 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Search by name..."
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="rounded-2xl border-gray-200 focus:border-blue-500/50 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Users ({filteredUsers.length})</CardTitle>
              <CardDescription className="text-gray-600 mt-1">Manage user accounts and permissions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="font-semibold text-gray-700">ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Email</TableHead>
                  <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                  <TableHead className="font-semibold text-gray-700">Role</TableHead>
                  <TableHead className="font-semibold text-gray-700">Bookings</TableHead>
                  <TableHead className="font-semibold text-gray-700">Total Spent</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Created</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => {
                  const { totalBookings, totalAmount } = userStatsMap.get(user.id) || {
                    totalBookings: 0,
                    totalAmount: 0,
                  }
                  return (
                    <TableRow key={user.id} className="border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <TableCell>
                        <div className="font-mono text-sm text-gray-600">#{user.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-start to-primary-end rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
               <div className="font-semibold text-gray-900 whitespace-nowrap">
  {user.name.replace(/\n/g, ' ').trim()}
</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-900">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-900">{user.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getRoleColor(user.role)} border font-medium capitalize`}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{totalBookings ? totalBookings : "N/A"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-gray-900">
                          ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(user.isActive)} border font-medium`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{formatDate(user.createdAt)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-gray-200 hover:bg-gray-50"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-gray-900">
                                  User Profile - {selectedUser?.name}
                                </DialogTitle>
                                <DialogDescription className="text-gray-600">
                                  Complete user information and booking history
                                </DialogDescription>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-6">
                                  {/* User Information */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                                        <div className="space-y-3">
                                          <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-600">ID:</span>
                                            <span className="font-mono">#{selectedUser.id}</span>
                                          </div>
                                          <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-600">Name:</span>
                                            <span>{selectedUser.name}</span>
                                          </div>
                                          <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-600">Email:</span>
                                            <span>{selectedUser.email}</span>
                                          </div>
                                          <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-600">Phone:</span>
                                            <span>{selectedUser.phone}</span>
                                          </div>
                                          <div className="flex justify-between py-2">
                                            <span className="font-medium text-gray-600">Role:</span>
                                            <Badge
                                              className={`${getRoleColor(selectedUser.role)} border font-medium capitalize`}
                                            >
                                              {selectedUser.role}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Account Information</h3>
                                        <div className="space-y-3">
                                          <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-600">Status:</span>
                                            <Badge
                                              className={`${getStatusColor(selectedUser.isActive)} border font-medium`}
                                            >
                                              {selectedUser.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                          </div>
                                          <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-600">Total Bookings:</span>
                                            <span className="font-semibold">{selectedUserStats.totalBookings}</span>
                                          </div>
                                          <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-600">Total Spent:</span>
                                            <span className="font-semibold text-blue-600">
                                              $
                                              {selectedUserStats.totalAmount.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              })}
                                            </span>
                                          </div>
                                          <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-600">Created:</span>
                                            <span className="text-sm">{formatDateTime(selectedUser.createdAt)}</span>
                                          </div>
                                          <div className="flex justify-between py-2">
                                            <span className="font-medium text-gray-600">Last Updated:</span>
                                            <span className="text-sm">{formatDateTime(selectedUser.updatedAt)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
{
  selectedUser.role=="user"&&
   selectedUserBookings.length > 0 ? (
                                    <div>
                                      <h3 className="font-semibold text-gray-900 mb-4">
                                        Booking History ({selectedUserBookings.length})
                                      </h3>
                                      <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {selectedUserBookings.map((booking) => (
                                          <div
                                            key={booking.id}
                                            className="flex justify-between items-start p-4 bg-gray-50 rounded-xl border"
                                          >
                                            <div className="flex-1">
                                              <div className="flex items-center gap-2 mb-2">
                                                <div className="font-semibold text-gray-900">#{booking.id}</div>
                                                <Badge
                                                  className={`${getBookingStatusColor(booking.isActive)} border font-medium text-xs`}
                                                >
                                                  {booking.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                              </div>
                                              <div className="space-y-1">
                                                <div className="font-medium text-gray-800">{booking.hotel.name}</div>
                                                <div className="text-sm text-gray-600">
                                                  Rooms: {booking.room.map((r) => r.roomType).join(", ")}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                  Check-in: {formatDate(booking.checkIndate)}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                  Check-out: {formatDate(booking.checkOutDate)}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                  Duration: {booking.numberOfDays} days
                                                </div>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="font-bold text-lg text-gray-900">{booking.amount}</div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ) :selectedUser.role=="user"&& (
                                    <div className="text-center py-8">
                                      <div className="text-gray-500">No bookings found for this user</div>
                                    </div>
                                  )
}
                                  {/* Booking History */}
                                 

                                  {/* Action Buttons */}
                                  <div className="flex gap-3 pt-4 border-t">
                                    <Button
                                      variant="outline"
                                      className={`${
                                        selectedUser.isActive
                                          ? "border-red-200 text-red-600 hover:bg-red-50"
                                          : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                      }`}
                                      onClick={() => toggleUserStatus(selectedUser.id)}
                                    >
                                      {selectedUser.isActive ? (
                                        <>
                                          <Ban className="h-4 w-4 mr-2" />
                                          Deactivate User
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Activate User
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                         
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
                   {filteredUsers.length > 0 && (
                          <div className="px-6 py-4 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}{" "}
                                Users
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  disabled={currentPage === 1}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNumber
                                    if (totalPages <= 5) {
                                      pageNumber = i + 1
                                    } else if (currentPage <= 3) {
                                      pageNumber = i + 1
                                    } else if (currentPage >= totalPages - 2) {
                                      pageNumber = totalPages - 4 + i
                                    } else {
                                      pageNumber = currentPage - 2 + i
                                    }
                                    return (
                                      <Button
                                        key={pageNumber}
                                        variant={currentPage === pageNumber ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNumber)}
                                        className="h-8 w-8 p-0"
                                      >
                                        {pageNumber}
                                      </Button>
                                    )
                                  })}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  disabled={currentPage === totalPages}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
      </Card>
    </div>
  )
}
