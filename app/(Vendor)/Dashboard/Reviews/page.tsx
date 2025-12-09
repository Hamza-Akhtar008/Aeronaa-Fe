"use client"
import { Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AllReviewsTab } from "./components/AllReviewsTab"
import { PendingReviewsTab } from "./components/PendingReviewsTab"
import { PublishedReviewsTab } from "./components/PublishedReviewsTab"
import { RespondedReviewsTab } from "./components/RespondedReviewsTab"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { startTransition, useEffect, useState } from "react"
import { Review } from "./types"
import { GetCompleteHotels, GetReviewbyHotel } from "@/lib/api"
type Property = {
  id: string
  name: string
  description: string
  registration: number
  starRating: number
  address?: string
}


export default function Reviews() {
   const [activeproperties, setActiveProperties] = useState<Property[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
  const [activeReview, setActiveReview] = useState<Review | null>(null)
  const [responseText, setResponseText] = useState("")
    const [selectedHotelId, setSelectedHotelId] = useState<string>("")
const  [reviews, setReviews] = useState<Review[]>([])
const [loading, setLoading] = useState(true);
const [contentloading, setContentLoading] = useState(false);
  const handlePhotoClick = (photo: string) => {
    setSelectedPhoto(photo)
  }

  const handleRespond = (review: Review) => {
    setActiveReview(review)
    setResponseText("")
    setIsResponseDialogOpen(true)
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
 useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    await Promise.all([ fetchactive()]);
    setLoading(false);
  };
  fetchData();
}, []);

  const submitResponse = () => {
    if (!activeReview || !responseText.trim()) return

    // Here you would typically make an API call to save the response
    console.log("Submitting response:", {
      reviewId: activeReview.id,
      response: responseText
    })
    
    setIsResponseDialogOpen(false)
    setResponseText("")
    setActiveReview(null)
  }
  const handleHotelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const hotelId = e.target.value
      setSelectedHotelId(hotelId)
  if(hotelId)
  {
    setContentLoading(true);
   const response= await GetReviewbyHotel(hotelId);
 
   setReviews(response);
    setContentLoading(false);

  }
     
    }
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
    <>
    
      <div className="space-y-4">
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#023e8a]/10 border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#023e8a]/5 to-[#00b4d8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-[#023e8a]/10 to-[#00b4d8]/10 transform rotate-45 pointer-events-none"></div>

          <div className="relative">
            <label className="block text-xl font-semibold bg-gradient-to-r from-[#023e8a] to-[#00b4d8] bg-clip-text text-transparent mb-4">
              Select Hotel to View Reviews
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

        <div className="flex items-center gap-4">
          <div className="flex-1">
         
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search reviews" className="pl-8" />
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Select defaultValue="latest">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="highest">Highest rated</SelectItem>
              <SelectItem value="lowest">Lowest rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Reviews</TabsTrigger>
          
          </TabsList>
          <TabsContent value="all">
            {contentloading ? (
              <div className="flex min-h-screen items-center justify-center ">
      <div className="flex items-center space-x-2">
        <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce" />
      </div>
    </div>
            ) : (
              <AllReviewsTab
                reviews={reviews}
                onRespond={handleRespond}
                onPhotoClick={handlePhotoClick}
              />
            )}
           
          </TabsContent>
   
        </Tabs>
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Photo</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <img
              src={selectedPhoto}
              alt="Review photo"
              className="w-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>

   
    </>
  )
}
