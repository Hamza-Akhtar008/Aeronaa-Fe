"use client"

import React, { JSX, use, useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { TableComponent } from "@/components/TableComponent/DynamicTableComponent"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/ui/stat-cards"
import { ArrowUp, ArrowDown, icons, ChevronDown } from "lucide-react"
import { BookMarked, LogIn, LogOut, Star, XCircle } from "lucide-react"
import { DeleteHotel, DeleteRoom, GetCompleteHotels, GetPendingHotels, GetRoomsbyHotel, HotelStats } from "@/lib/api";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ConfirmModal } from "@/components/ui/confirmationmodal";
import { useTransition } from "react";
import { set } from "date-fns";
import FloatingSpeedDial from "@/components/floatingspeeddail";

type Property = {
  id: string
  name: string
  description: string
  status:string
  registration: number
  averagePrice?: string
  starRating: number
  address?: string
}

type Room = {
  id: string
  roomType: string
  basePrice: number
  roomSize: number
  roomSizeUnit: string
  maxOccupancy: number
  smokingAllowed: boolean
  quantity: number
}

type Hotel = {
  id: string | number
  name: string
  description: string
  Address: string
  city: string
  state: string
  zipCode: string
  status:string
  country: string
  starRating: string
  checkInTime: string
  checkOutTime: string
  availableFrom: string
  averagePrice: string
  availableTo: string
  amenities: any[]
  images: any[]
  tags: string
}
type Trend = "up" | "down" | "neutral"
interface Stat {
  title: string
  value: number
  icon: JSX.Element
  change?: { value: number; trend: "up" | "down" | "neutral" }
}
export default function Dashboard() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [selectedDashboard, setSelectedDashboard] = useState("Hotel");
  const [properties, setProperties] = useState<Property[]>([])
  const [activeproperties, setActiveProperties] = useState<Property[]>([])
  const [selectedHotelId, setSelectedHotelId] = useState<string>("")
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [hotelRooms, setHotelRooms] = useState<Room[]>([])
  const [isConfirmOpenRoom, setIsConfirmOpenRoom] = useState(false)
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined)
  const [isNavigating, setIsNavigating] = useState(false)
  const [roomloading ,setroomloading]=useState(false)
const [loading, setLoading] = useState(true);
const [stats, setStats] = useState<Stat[]>([])

 useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await HotelStats();// your API endpoint
       

        const mappedStats: Stat[] = [
          {
            title: "Total Hotels",
            value: data.totalHotels,
            icon: <BookMarked className="text-[#023e8a]" />,
          },
          {
            title: "Active Hotels",
            value: data.completedHotels,
            icon: <LogIn className="text-[#023e8a]" />,
          },
          {
            title: "Pending Hotels",
            value: data.pendingHotels,
            icon: <LogOut className="text-[#023e8a]" />,
          },
          {
            title: "Total Bookings",
            value: data.totalBookings,
            icon: <Star className="text-[#023e8a]" />,
          },
          {
            title: "Cancellations",
            value: data.cancelledBookings,
            icon: <XCircle className="text-[#023e8a]" />,
          },
        ]

        setStats(mappedStats)
      } catch (err) {
        console.error("Error fetching stats:", err)
      }
    }

    fetchStats()
  }, [])


  const handleNavigation = async (path: string) => {
    setIsNavigating(true)
    try {
      await router.push(path)
    } catch (error) {
      console.error("Navigation error:", error)
      toast.error("Failed to navigate")
    } finally {
      setIsNavigating(false)
    }
  }

  const openConfirm = (id: string) => {
    setSelectedIdToDelete(id)
    setIsConfirmOpen(true)
  }

 const fetchPending = async () => {
  try {
    const hotels: Hotel[] = await GetPendingHotels();

    // ✅ Sort by updatedAt (descending)
    hotels.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    const mapped: Property[] = hotels.map((hotel) => {
      const fieldsToCheck = [
        hotel.name,
        hotel.description,
        hotel.Address,
        hotel.city,
        hotel.state,
        hotel.zipCode,
        hotel.country,
        hotel.starRating,
        hotel.checkInTime,
        hotel.checkOutTime,
        hotel.availableFrom,
        hotel.availableTo,
        hotel.amenities?.length ? "✓" : "",
        hotel.tags,
      ];

      const filled = fieldsToCheck.filter(Boolean).length;
      const total = fieldsToCheck.length;
      const registration = Math.round((filled / total) * 100);

      return {
        id: hotel.id.toString(),
        name: hotel.name,
        description:
          hotel.description.length > 100
            ? hotel.description.slice(0, 100) + "..."
            : hotel.description,
        status: "pending",
        starRating: parseInt(hotel.starRating || "0"),
        registration,
      };
    });

    startTransition(() => {
      setProperties(mapped);
    });
  } catch (err) {
    console.error("Failed to fetch pending hotels:", err);
  }
};

const fetchactive = async () => {
  try {
    const hotels: Hotel[] = await GetCompleteHotels();

    // ✅ Sort by updatedAt (descending)
    hotels.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    const mapped: Property[] = hotels.map((hotel) => {
      const fieldsToCheck = [
        hotel.name,
        hotel.description,
        hotel.Address,
        hotel.city,
        hotel.state,
        hotel.zipCode,
        hotel.country,
        hotel.starRating,
        hotel.checkInTime,
        hotel.checkOutTime,
        hotel.availableFrom,
        hotel.availableTo,
        hotel.amenities?.length ? "✓" : "",
        hotel.tags,
      ];

      const filled = fieldsToCheck.filter(Boolean).length;
      const total = fieldsToCheck.length;
      const registration = Math.round((filled / total) * 100);

      return {
        id: hotel.id.toString(),
        name: hotel.name,
        description:
          hotel.description.length > 100
            ? hotel.description.slice(0, 100) + "..."
            : hotel.description,
        status:
          hotel.status.charAt(0).toUpperCase() +
          hotel.status.slice(1).toLowerCase(),
        starRating: parseInt(hotel.starRating),
        averagePrice: hotel.averagePrice + "$ per night",
        registration,
      };
    });

    startTransition(() => {
      setActiveProperties(mapped);
    });
  } catch (err) {
    console.error("Failed to fetch active hotels:", err);
  }
};


  const handleConfirmDelete = async () => {
    if (!selectedIdToDelete) return
    try {
      await DeleteHotel(selectedIdToDelete)
      await fetchPending()
      toast.success("Property deleted successfully")
    } catch (err) {
      console.error("Failed to delete:", err)
      toast.error("Failed to delete property")
    } finally {
      setIsConfirmOpen(false)
      setSelectedIdToDelete(null)
    }
  }

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchPending(), fetchactive()]);
    setLoading(false);
  };
  fetchData();
}, []);

  const handleHotelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hotelId = e.target.value
    setSelectedHotelId(hotelId)
setroomloading(true);
    if (hotelId) {
      try {
        const rooms = await GetRoomsbyHotel(hotelId)
        setHotelRooms(rooms)
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch rooms.")
      }
    } else {
      setHotelRooms([])
    }
    setroomloading(false);
  }

  const handleDeleteRoom = async (id: string | undefined) => {
    try {
      if (!id) return
      await DeleteRoom(id)
      setHotelRooms((prev) => prev.filter((room) => room.id !== id))
      toast.success("Room deleted successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete room")
    }
  }

  const propertyColumns = [
    { key: "name", label: "Name", accessor: "name" },
    { key: "description", label: "Description", accessor: "Description" },
     
    {
      key: "registration",
      label: "Registration",
      accessor: "registration",
      render: (row: Property) => {
        const percentage = row.registration
        return (
          <div className="relative group w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-[#cc0000] h-4 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white">
              {percentage}%
            </span>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex px-2 py-1 text-xs text-white bg-black rounded shadow-md z-10">
              {percentage}% complete
            </div>
          </div>
        )
      },
    },
    {
      key: "action",
      label: "Action",
      accessor: "action",
      render: (row: Property) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNavigation(`/Dashboard/property/add/${row.id}`)}
          disabled={isPending || isNavigating}
          aria-label={`Continue registration for ${row.name}`}
        >
          {isPending || isNavigating ? "Loading..." : "Continue registration"}
        </Button>
      ),
    },
    {
      key: "delete",
      label: "Delete",
      accessor: "delete",
      render: (row: Property) => (
        <Button
          className="bg-[#023e8a] hover:bg-[#EF0926]"
          size="sm"
          onClick={() => openConfirm(row.id)}
          disabled={isPending}
          aria-label={`Delete property ${row.name}`}
        >
          Delete
        </Button>
      ),
    },
  ]

  const ActivepropertyColumns = [
    { key: "name", label: "Name", accessor: "name" },
    { key: "description", label: "Description", accessor: "Description" },
     { key: "averagePrice", label: "Average Price", accessor: "Average Price" },
   
    { key: "status", label: "Staus", accessor: "status" },

    {
      key: "starRating",
      label: "Star Rating",
      accessor: "starRating",
      render: (row: Property) => {
        const stars = Array.from({ length: Number(row.starRating) || 0 })
        return (
          <div className="flex items-center gap-1 text-yellow-500">
            {stars.map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            ))}
            <span className="ml-1 text-gray-600 text-sm">({row.starRating})</span>
          </div>
        )
      },
    },
    {
      key: "registration",
      label: "Registration",
      accessor: "registration",
      render: (row: Property) => {
        const percentage = row.registration
        return (
          <div className="relative w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-width duration-500"
              style={{ width: `${percentage}%` }}
              title={`${percentage}%`}
            />
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-white">
              {percentage}%
            </span>
          </div>
        )
      },
    },
    {
      key: "viewrooms",
      label: "View Rooms",
      accessor: "addRooms",
      render: (row: Property) => (
        <Button
          className="bg-gradient-to-r from-[#023e8a] to-[#00b4d8] hover:bg-green-500 text-white"
          size="sm"
          onClick={() => handleNavigation(`/Dashboard/property/viewrooms/${row.id}`)}
          disabled={isPending || isNavigating}
          aria-label={`Add rooms to ${row.name}`}
        >
          {isPending || isNavigating ? "Loading..." : "View Rooms"}
        </Button>
      ),
    },
    {
      key: "addRooms",
      label: "Add Rooms",
      accessor: "addRooms",
      render: (row: Property) => (
        <Button
          className="bg-gradient-to-r from-[#023e8a] to-[#00b4d8] hover:bg-green-500 text-white"
          size="sm"
          onClick={() => handleNavigation(`/Dashboard/property/add/${row.id}`)}
          disabled={isPending || isNavigating}
          aria-label={`Add rooms to ${row.name}`}
        >
          {isPending || isNavigating ? "Loading..." : "Add Room"}
        </Button>
      ),
    },
  ]

  const gradients = [
    "from-[#023e8a] to-[#00b4d8]",
    "from-[#3a0ca3] to-[#4cc9f0]",
    "from-[#023e8a] to-[#48cae4]",
    "from-[#0096c7] to-[#48cae4]",
    "from-[#023e8a] to-[#90e0ef]",
  ]



  const roomColumns = [
    {
      key: "roomType",
      label: "Room Type",
      accessor: "roomType",
    },
    {
      key: "basePrice",
      label: "Base Price",
      accessor: "basePrice",
      render: (room: Room) => `$${room.basePrice}`,
    },
    {
      key: "roomSize",
      label: "Room Size",
      accessor: "roomSize",
      render: (room: Room) => `${room.roomSize} ${room.roomSizeUnit}`,
    },
    {
      key: "maxOccupancy",
      label: "Max Occupancy",
      accessor: "maxOccupancy",
    },
    {
      key: "smokingAllowed",
      label: "Smoking Allowed",
      accessor: "smokingAllowed",
      render: (room: Room) => (
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            room.smokingAllowed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {room.smokingAllowed ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "quantity",
      label: "Available Quantity",
      accessor: "quantity",
    },
    {
      key: "viewRoom",
      label: "View",
      accessor: "viewRoom",
      render: (room: Room) => (
        <Button
          className="bg-gradient-to-r from-[#023e8a] to-[#00b4d8] hover:from-[#023e8a]/90 hover:to-[#00b4d8]/90 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5"
          onClick={() => handleNavigation(`/Dashboard/property/view/${room.id}`)}
          disabled={isNavigating}
          aria-label={`View room ${room.roomType}`}
        >
          {isNavigating ? "Loading..." : "View"}
        </Button>
      ),
    },
    {
      key: "deleteRoom",
      label: "Delete",
      accessor: "deleteRoom",
      render: (room: Room) => (
        <Button
          className="bg-white text-red-600 border border-red-200 hover:bg-red-50 text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transform transition-all duration-200 hover:-translate-y-0.5"
          onClick={() => {
            setSelectedRoomId(room.id)
            setIsConfirmOpenRoom(true)
          }}
          disabled={isPending}
          aria-label={`Delete room ${room.roomType}`}
        >
          Delete
        </Button>
      ),
    },
  ]

  const [isOpen, setIsOpen] = useState(false);

  const handleSelectDashboard = (dashboard: string) => {
    setSelectedDashboard(dashboard);
    setIsOpen(false); // Close the dropdown after selection
  };
  if(loading)
  {
     return (
     <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Multi-layer spinner */}
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#023e8a] rounded-full animate-spin"></div>

          {/* Middle ring */}
          <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-[#0077b6] rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>

          {/* Inner ring */}
          <div className="absolute inset-4 w-8 h-8 border-4 border-transparent border-t-[#00b4d8] rounded-full animate-spin [animation-duration:0.8s]"></div>

          {/* Center dot */}
          <div className="absolute inset-6 w-4 h-4 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-full animate-pulse"></div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-lg font-medium bg-gradient-to-r from-[#023e8a] to-[#00b4d8] bg-clip-text text-transparent">
            Loading...
          </p>
        </div>
      </div>
    </div>
  )
  }
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900">
      {/* Hero Section with Background */}
   

      <div className="relative overflow-hidden bg-gradient-to-r from-[#023e8a] to-[#00b4d8] h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#023e8a]/90 to-[#00b4d8]/90 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-[1200px] mx-auto px-4 py-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Welcome Back
          </h1>
          <p className="text-blue-50 text-lg max-w-2xl">
            Monitor your properties, manage bookings, and track performance all in one place.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-[1200px] mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-8">
          {stats.map(({ title, value, change, icon }, i) => (
            <div key={i} className="transform hover:translate-y-[-5px] transition-all duration-300">
              <StatCard
                key={i}
                title={title}
                value={value}
                change={change}
                icon={icon}
                className={`bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl border border-gray-100 
                           hover:border-[#00b4d8]/20 transition-all p-6 relative overflow-hidden
                           before:absolute before:inset-0 before:bg-gradient-to-r ${gradients[i]} before:opacity-[0.08]
                           hover:shadow-lg hover:shadow-[#023e8a]/5`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-[1200px] mx-auto px-4 space-y-8 mt-8">
        {/* Properties Not Listed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#023e8a]/10 border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#023e8a]/5 to-[#00b4d8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-[#023e8a]/10 to-[#00b4d8]/10 transform rotate-45 pointer-events-none"></div>
          
          <TableComponent<Property>
            title="Draft Properties"
            data={properties}
            columns={propertyColumns}
            buttonTitle="Add New Property"
            onButtonClick={() => handleNavigation("/Dashboard/property/add")}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </div>

        {/* Active Properties */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#023e8a]/10 border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#023e8a]/5 to-[#00b4d8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-[#023e8a]/10 to-[#00b4d8]/10 transform rotate-45 pointer-events-none"></div>

          <TableComponent<Property>
            title="All Properties"
            data={activeproperties}
            columns={ActivepropertyColumns}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </div>

        {/* Hotel Selection */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#023e8a]/10 border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#023e8a]/5 to-[#00b4d8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-[#023e8a]/10 to-[#00b4d8]/10 transform rotate-45 pointer-events-none"></div>

          <div className="relative">
            <label className="block text-xl font-semibold bg-gradient-to-r from-[#023e8a] to-[#00b4d8] bg-clip-text text-transparent mb-4">
              Select Hotel to View Rooms
            </label>
            <div className="relative max-w-[300px] group/select">
              <select
                className="w-full appearance-none bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 shadow-sm transition-all duration-200 focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8] focus:ring-opacity-50 group-hover/select:border-[#00b4d8]/50"
                value={selectedHotelId}
                onChange={handleHotelChange}
              >
                <option value="">-- Choose a hotel --</option>
                {activeproperties.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <svg className="h-5 w-5 text-[#023e8a] dark:text-[#00b4d8] transition-transform duration-200 group-hover/select:scale-110" 
                     viewBox="0 0 20 20" 
                     fill="currentColor">
                  <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                </svg>
              </div>
            </div>
          </div>
        </div> */}

        {/* Loading State */}
      

        {/* Rooms Table */}
        {/* {hotelRooms.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-shadow hover:shadow-xl">
            <TableComponent<Room>
              title="Rooms for Selected Hotel"
              data={hotelRooms}
              columns={roomColumns}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </div>
        ):
        ( <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-shadow hover:shadow-xl">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No rooms available for this hotel. Please add rooms to manage them
            </p>
          </div>)} */}
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Property?"
        message="Are you sure you want to delete this property? This action cannot be undone."
      />
      <ConfirmModal
        isOpen={isConfirmOpenRoom}
        onCancel={() => {
          setIsConfirmOpenRoom(false)
          setSelectedRoomId(undefined)
        }}
        onConfirm={async () => {
          await handleDeleteRoom(selectedRoomId)
          setIsConfirmOpenRoom(false)
          setSelectedRoomId(undefined)
        }}
        title="Delete Room?"
        message="Are you sure you want to delete this room? This action cannot be undone."
      />

      <ToastContainer position="bottom-right" autoClose={5000} />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}