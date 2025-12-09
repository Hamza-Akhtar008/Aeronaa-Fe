"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Filter, Eye, Ban, CheckCircle, User, Mail, Phone, XCircle, Check } from "lucide-react"

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
import { AgentComission, FetchallUser, GetallBookings, PatchUser, registerUser } from "@/lib/api"
import { Role } from "@/lib/UsersEnum"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MonthSummaryModal } from "./modal/commisionmodal"

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
  hotel: any
  room: any[]
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
    case "agent":
      return "bg-green-100 text-green-700 border-green-200"
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

export default function AgentsPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [commission, setCommission] = useState<any>(null);
    const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState({
    role: "",
    isActive: "",
    createdAt: "",
    name: "",
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
const [newUser, setNewUser] = useState({
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "agent",
   permissions: [] as string[],
});
  const [users, setUsers] = useState<any[]>([])
  const [bookings, setBookings] = useState<UIBooking[]>([])

  const fetchbookings = async () => {
    const response = await GetallBookings()
    setBookings(response)
  }
  useEffect(() => {
    fetchbookings()
  }, [])
  const fetchUsers = async () => {
    const response = await FetchallUser()
    setUsers(response.filter((user: { role: string }) => user.role === "agent"))
  }
  useEffect(() => {
    fetchUsers()
  }, [])
  const filteredUsers = users.filter((user) => {
    return (
      (!filters.role || user.role.toLowerCase() === filters.role.toLowerCase()) &&
      (!filters.isActive || (filters.isActive === "active" ? user.isActive : !user.isActive)) &&
      (!filters.createdAt || new Date(user.createdAt) >= new Date(filters.createdAt)) &&
      (!filters.name || user.name.toLowerCase().includes(filters.name.toLowerCase()))
    )
  })

const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
  const newStatus = !currentStatus;
  try {
    const toastId = toast.loading("Updating user status...");
    const payload = { isActive: newStatus };
    const response = await PatchUser(String(userId), payload);
    toast.update(toastId, {
      render: `User ${newStatus ? "activated" : "deactivated"} successfully.`,
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
    setSelectedUser((prev: any) =>
      prev && prev.id === userId ? { ...prev, isActive: newStatus } : prev
    );
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isActive: newStatus } : user
      )
    );
  } catch (error) {
    console.error("Error updating user status:", error);
    toast.error("Failed to update user status.");
  }
};

const getUserBookings = useCallback(
  (userId: number) => {
    return bookings.filter(
      (booking) => booking.user?.id === userId
    )
  },
  [bookings],
)
const handleCreateAgentUser = async () => {
  const { name, email, phone, password } = newUser;
  if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
    return toast.error("Please fill out all fields.");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
     toast.error("Please enter a valid email address.");
     return;
  }
  if (password.length < 6) {
     toast.error("Password must be at least 6 characters.");
    return
  }
  const phoneRegex = /^[0-9+\-()\s]{8,15}$/;
  if (!phoneRegex.test(phone)) {
     toast.error("Please enter a valid phone number.");
     return;
  }
  if (newUser.permissions.length === 0) {
  
  toast.error("Please select at least one permission.");
 return;

}
  try {
  await registerUser(name, phone, email, password, Role.AGENT, "approved",newUser.permissions);
  toast.success("Agent user created successfully.");
  setNewUser({ name: "", email: "", password: "", phone: "", role: "agent",permissions: [] });
  setIsCreateModalOpen(false);
  // Reset filters so all agents show
  setFilters({ role: "", isActive: "", createdAt: "", name: "" });
  // Immediately fetch and update users list
  const response = await FetchallUser();
  setUsers(response.filter((user: { role: string }) => user.role === "agent"));
  } catch (err) {
    console.error("Error creating agent user:", err);
    toast.error("Failed to create user. Please try again.");
  }
};

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
const fetchcommissions=async(id:string)=>{
try {
  const response = await AgentComission(id);
  setCommission(response)
  setOpen(true)
} catch (error) {
  
}
}
return (
  <div className="space-y-8 animate-fade-in">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Agent Management</h1>
        <p className="text-gray-600 mt-2 text-lg">Manage Agents on your platform</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Agent
        </Button>
      </div>
    </div>
    <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-semibold text-gray-700">
              Role
            </Label>
            <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
              <SelectTrigger className="rounded-2xl border-gray-200 focus:border-blue-500/50 focus:ring-blue-500/20">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent</SelectItem>
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
    <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Agents ({filteredUsers.length})</CardTitle>
            <CardDescription className="text-gray-600 mt-1">Manage agent accounts and permissions</CardDescription>
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
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Created</TableHead>
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
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
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-gray-900">
                                Agent - {selectedUser?.name}
                              </DialogTitle>
                              <DialogDescription className="text-gray-600">
                                View detailed information of agent
                              </DialogDescription>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-6">
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
  <span className="font-medium text-gray-600">Permissions:</span>
  <div className="flex flex-wrap gap-1 justify-end">
    {selectedUser.permissions?.length ? (
      selectedUser.permissions.map((perm: string) => (
        <Badge key={perm} className="bg-blue-100 text-blue-700 border border-blue-200 capitalize">
          {perm}
        </Badge>
      ))
    ) : (
      <span className="text-gray-500 italic">No permissions</span>
    )}
  </div>
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
                                <div className="flex gap-3 pt-4 border-t">
                                  <Button
                                    variant="outline"
                                    className={`${
                                      selectedUser.isActive
                                        ? "border-red-200 text-red-600 hover:bg-red-50"
                                        : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                    }`}
                                    onClick={() => toggleUserStatus(selectedUser.id,selectedUser.isActive)}
                                  >
                                    {selectedUser.isActive ? (
                                      <>
                                        <Ban className="h-4 w-4 mr-2" />
                                        Deactivate Agent
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Activate Agent
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${
                            user.isActive
                              ? "border-red-200 text-red-600 hover:bg-red-50"
                              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          }`}
                          onClick={() => toggleUserStatus(user.id,user.isActive)}
                        >
                          {user.isActive?<> <XCircle className="h-3 w-3" /></>:<>
                          <Check className="h-3 w-3"/></>}  
                        </Button>


                           <Button className="bg-green-600 hover:bg-green-700 text-white rounded-2xl  shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" onClick={() => router.push(`/admin/agent-wisebooking/${user.id}`)}>
                        View Bookings    </Button>

                          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-2xl  shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" onClick={()=>
                            {
                              fetchcommissions(user.id);
                            }
                          }>
                        View Commission    </Button>
                      </div>


                    
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Create Agent</DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill in the details to add a new agent
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
  <Label className="font-medium text-gray-700">Access</Label>
  <div className="grid grid-cols-2 gap-3">
    {["hotel", "car", "umrah", "property"].map((perm) => (
      <label
        key={perm}
        className="flex items-center gap-2 rounded-lg border border-gray-200 p-2 hover:bg-gray-50 cursor-pointer transition"
      >
        <input
          type="checkbox"
          className="accent-blue-600 w-4 h-4"
          checked={newUser.permissions.includes(perm)}
          onChange={(e) => {
            setNewUser((prev) => ({
              ...prev,
              permissions: e.target.checked
                ? [...prev.permissions, perm]
                : prev.permissions.filter((p) => p !== perm),
            }));
          }}
        />
        <span className="capitalize text-gray-800">{perm}</span>
      </label>
    ))}
  </div>
</div>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleCreateAgentUser}
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
     <MonthSummaryModal
        open={open}
        onClose={() => setOpen(false)}
        monthSummaryData={commission}
      />
  </div>
)
}
