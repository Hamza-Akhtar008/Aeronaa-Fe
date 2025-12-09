"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { TableComponent } from "@/components/TableComponent/DynamicTableComponent"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/ui/stat-cards"
import { ArrowUp, ArrowDown, icons } from "lucide-react"
import { BookMarked, LogIn, LogOut, Star, XCircle } from "lucide-react"
import { DeleteHotel, DeleteRoom, GetBookingbyHotel, GetCompleteHotels, GetPendingHotels, GetRoomsbyHotel } from "@/lib/api";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ConfirmModal } from "@/components/ui/confirmationmodal";
import { useTransition } from "react";
import BookingModal from "@/components/ui/hotelmodal";

type Property = {
  id: string
  name: string
  description: string
  registration: number
  starRating: number
  address?: string
}




type BookingData = {
  id: string;
  customerName: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  customerEmail: string;
  roomType: string;

}

type TableColumn<T> = {
  key: string;
  label: string;
  accessor: keyof T | string;
  render?: (row: T) => React.ReactNode;
};
export default function Bookings() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [Booking, setBooking] = useState<UIBooking[]>([])
const [selectedBooking, setSelectedBooking] = useState<UIBooking>(null as any)
const [bookingTableData, setBookingTableData] = useState<BookingData[]>([]);
const [showBookingModal, setShowBookingModal] = useState(false)


  const [activeproperties, setActiveProperties] = useState<Property[]>([])
  const [selectedHotelId, setSelectedHotelId] = useState<string>("")
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const [isConfirmOpenRoom, setIsConfirmOpenRoom] = useState(false)
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined)
  const [isNavigating, setIsNavigating] = useState(false)
const [loading, setLoading] = useState(true);
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

  

  const fetchactive = async () => {
    try {
      const hotels: Hotel[] = await GetCompleteHotels()

   const mapped: Property[] = hotels
  .filter((hotel): hotel is Hotel & { id: number | string } => hotel.id !== undefined && hotel.id !== null)
  .map((hotel) => {
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
      address: hotel.Address,
      starRating: parseInt(hotel.starRating),
      registration,
    };
  });

      
      startTransition(() => {
        setActiveProperties(mapped)
      })
    } catch (err) {
      console.error("Failed to fetch pending hotels:", err)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedIdToDelete) return
    try {
      await DeleteHotel(selectedIdToDelete)
    
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
    await Promise.all([ fetchactive()]);
    setLoading(false);
  };
  fetchData();
}, []);


const mapUIBookingToBookingData = (bookings: UIBooking[]): BookingData[] => {
  const mapped = bookings.map(b => ({
    id: b.id.toString(),
    customerName: b.user.name,
    checkInDate: b.checkIndate,
    checkOutDate: b.checkOutDate,
    status:
      !b.isAppeared 
        ? "Not-Appeared"
        : b.isActive
        ? "Confirmed"
        : "Cancelled",
    customerEmail: b.user.email,
    roomType: b.room.length > 0 ? b.room[0].roomType : "N/A",
  }))

  console.table(mapped) // ✅ Displays output nicely in browser or Node console
  return mapped
}
useEffect(() => {
  // assuming you have bookings fetched as UIBooking[]
 console.log("Bookings updated:", Booking);
  const mappedData = mapUIBookingToBookingData(Booking);
  setBookingTableData(mappedData);
}, [Booking]);

  const handleHotelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hotelId = e.target.value
    setSelectedHotelId(hotelId)

    if (hotelId) {
      try {
        const rooms = await GetBookingbyHotel(hotelId)
        setBooking(rooms)
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch rooms.")
      }
    } else {
      setBooking([])
    }
  }
  
  // Function to refresh the booking data - useful after a cancellation
  const refreshBookings = async () => {
    if (selectedHotelId) {
      try {
        const rooms = await GetBookingbyHotel(selectedHotelId)
        setBooking(rooms)
        
        // Also update the selected booking's status in the local state
        if (selectedBooking) {
          selectedBooking.isActive = false;
          // Update the table data immediately
          const updatedTableData = bookingTableData.map(item => {
            if (item.id === String(selectedBooking.id)) {
             
            }
            return item;
          });
          setBookingTableData(updatedTableData);
        }
      } catch (error: any) {
        console.error("Failed to refresh bookings:", error)
      }
    }
  }

const bookingColumns: TableColumn<BookingData>[] = [
  {
    key: "customerName",
    label: "Customer Name",
    accessor: "customerName",
  },
  {
    key: "customerEmail",
    label: "Customer Email",
    accessor: "customerEmail",
  },
  {
    key: "checkInDate",
    label: "Check-In",
    accessor: "checkInDate",
    render: (row: any) => new Date(row.checkInDate).toLocaleDateString(),
  },
  {
    key: "checkOutDate",
    label: "Check-Out",
    accessor: "checkOutDate",
    render: (row: any) => new Date(row.checkOutDate).toLocaleDateString(),
  },
  {
  key: "status",
  label: "Status",
  accessor: "status",
  render: (row: any) => (
    <span
      className={`px-2 py-1 rounded-full text-white text-xs whitespace-nowrap ${
        row.status === "Confirmed" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {row.status}
    </span>
  ),
}
,
  {
    key: "customerEmail",
    label: "Email",
    accessor: "customerEmail",
  },
  {
    key: "roomType",
    label: "Room Type",
    accessor: "roomType",
  },
  {
    key: "view",
    label: "View",
    accessor: "view",
    render: (row: any) => (
      <button
        className="bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white text-sm px-4 py-2 rounded-md"
       onClick={() => {
  const fullBooking = Booking.find(b => b.id.toString() === row.id);
  if (fullBooking) {
    setSelectedBooking(fullBooking);
    setShowBookingModal(true);
  }
}}
      >
        View
      </button>
    ),
  },
];


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
    

      {/* Main Content Section */}
      <div className="max-w-[1200px] mx-auto px-4 space-y-8 mt-8">
      

     

        {/* Hotel Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#023e8a]/10 border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#023e8a]/5 to-[#00b4d8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-[#023e8a]/10 to-[#00b4d8]/10 transform rotate-45 pointer-events-none"></div>

          <div className="relative">
            <label className="block text-xl font-semibold bg-gradient-to-r from-[#023e8a] to-[#00b4d8] bg-clip-text text-transparent mb-4">
              Select Hotel to View Bookings
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
        </div>

        {/* Loading State */}
      

        {/* Rooms Table */}
        {bookingTableData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-shadow hover:shadow-xl">
           <TableComponent<BookingData>
  title="Bookings for Selected Hotel"
  data={bookingTableData}
  columns={bookingColumns}
  rowsPerPageOptions={[5, 10, 25]}
/>
          </div>
        )}
      </div>

  <BookingModal 
    booking={selectedBooking as any} 
    isOpen={showBookingModal} 
    onClose={() => {
        setShowBookingModal(false)
    }}
    onBookingUpdated={refreshBookings}  
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