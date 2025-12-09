"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Bed, Building, Coffee, DollarSign, Link, Loader2, Plus, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/utils"
// Define room amenities options
const roomAmenities = [
  { id: "tv", label: "TV" },
  { id: "ac", label: "Air conditioning" },
  { id: "heating", label: "Heating" },
  { id: "wifi", label: "Free WiFi" },
  { id: "minibar", label: "Minibar" },
  { id: "safe", label: "Safe" },
  { id: "desk", label: "Work desk" },
  { id: "bathtub", label: "Bathtub" },
  { id: "shower", label: "Shower" },
  { id: "hairdryer", label: "Hair dryer" },
  { id: "toiletries", label: "Toiletries" },
  { id: "balcony", label: "Balcony" },
  { id: "oceanView", label: "Ocean view" },
  { id: "cityView", label: "City view" },
  { id: "coffeeMaker", label: "Coffee maker" },
]

// Define bed types
const bedTypes = [
  { id: "single", label: "Single Bed" },
  { id: "twin", label: "Twin Beds" },
  { id: "double", label: "Double Bed" },
  { id: "queen", label: "Queen Bed" },
  { id: "king", label: "King Bed" },
  { id: "sofa", label: "Sofa Bed" },
]

// Define form schema
const formSchema = z.object({
  id:z.string().optional(),
  roomType: z.string().min(1, { message: "Room type is required." }),
  description: z.string().min(0, { message: "Description must be at least 10 characters." }),
  maxOccupancy: z.string().min(1, { message: "Max occupancy is required." }),
  bedConfiguration: z.array(
    z.object({
      type: z.string(),
      count: z.string(),
    }),
  ),
  roomSize: z.string().min(1, { message: "Room size is required." }),
  roomSizeUnit: z.string().min(1, { message: "Room size unit is required." }),
  basePrice: z.string().min(1, { message: "Base price is required." }),
  discountedPrice: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.any()).optional(),
  quantity: z.string().min(1, { message: "Quantity is required." }),
  smokingAllowed: z.boolean().default(false),
  
})

type RoomDetailsFormProps = {
  hotelId: string |number
  onSaved: (room: Room,images:File[]) => void  
   room: Room & { customRoomType?: string }
  setRoom: React.Dispatch<React.SetStateAction<Room & { customRoomType?: string }>>
}


export function RoomDetailsForm({ hotelId,onSaved,setRoom,room }: RoomDetailsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const maxSteps = 4
const router = useRouter();
  const steps = [
    { step: 1, label: "Room Info", icon: Building },
    { step: 2, label: "Beds", icon: Bed },
    { step: 3, label: "Pricing", icon: DollarSign },
    { step: 4, label: "Amenities", icon: Coffee },
  ]

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomType: "",
      quantity: "",
      description: "",
      maxOccupancy: "",
      roomSize: "",
      roomSizeUnit: "sqm",
      bedConfiguration: [{ type: "", count: "1" }],
      basePrice: "",
      discountedPrice: "",
      amenities: [],
      smokingAllowed: false,
    },
  })

const addBedConfiguration = () => {
  const defaultType = (bedTypes && bedTypes[0]?.id) ? bedTypes[0].id : "single";
  setRoom((prev) => ({
    ...prev,
    bedConfiguration: [...(prev.bedConfiguration || []), `1 x ${defaultType}`],
  }));
};


 const removeBedConfiguration = (index: number) => {
  setRoom((prev) => {
    const copy = [...(prev.bedConfiguration || [])];
    copy.splice(index, 1);
    return { ...prev, bedConfiguration: copy };
  });
};

 // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setImages((prev) => [...prev, ...newImages])
    }
  }

  // Handle removing an image preview
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }


const handleRemoveExistingImage = (index: number) => {
const updatedImages = [...(room.images ?? [])];
  updatedImages.splice(index, 1);
  setRoom({
    ...room,
    images: updatedImages,
  });
};

const validateRoom = () => {
  // Step 1: Room Info
  if (!room.roomType) {
    toast.error("Room type is required.");
    return false;
  }

  if (!room.quantity || room.quantity <= 0) {
    toast.error("Quantity must be at least 1.");
    return false;
  }

 

  if (!room.maxOccupancy) {
    toast.error("Please select max occupancy.");
    return false;
  }

  if (!room.roomSize || room.roomSize <= 0) {
    toast.error("Room size must be greater than 0.");
    return false;
  }

  if (!room.roomSizeUnit) {
    toast.error("Please select room size unit.");
    return false;
  }

  // Step 2: Bed Configuration
  if (!room.bedConfiguration || room.bedConfiguration.length === 0) {
    toast.error("At least one bed configuration is required.");
    return false;
  }

  for (let config of room.bedConfiguration) {
    const parts = config.split(" x ");
    if (parts.length !== 2 || isNaN(parseInt(parts[0])) || !parts[1]) {
      toast.error("Invalid bed configuration format.");
      return false;
    }
  }

  // Step 3: Pricing
  if (room.basePrice === undefined || room.basePrice < 0) {
    toast.error("Base price must be 0 or greater.");
    return false;
  }

  if (room.discountedPrice !== undefined && room.discountedPrice < 0) {
    toast.error("Discounted price cannot be negative.");
    return false;
  }

  if (room.discountedPrice && room.discountedPrice > room.basePrice) {
    toast.error("Discounted price cannot be more than base price.");
    return false;
  }

  // Step 4: Amenities & Images
  if (!room.amenities || room.amenities.length === 0) {
    toast.error("Please select at least one amenity.");
    return false;
  }



  // Passed all checks
  return true;
};

const parseBedConfig = (bedConfig: any): [string, string] => {
  // Accept "1 x single", ["1","single"], { count: 1, type: "single" }, or malformed values
  if (typeof bedConfig === "string") {
    const parts = bedConfig.split(" x ");
    const count = parts[0] ?? "";
    const type = parts[1] ?? "";
    return [count.toString(), type.toString()];
  }
  if (Array.isArray(bedConfig) && bedConfig.length >= 2) {
    return [String(bedConfig[0] ?? ""), String(bedConfig[1] ?? "")];
  }
  if (bedConfig && typeof bedConfig === "object") {
    return [String(bedConfig.count ?? ""), String(bedConfig.type ?? "")];
  }
  return ["", ""];
};
  return (
  <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#f8fafc] to-[#f1f5f9] py-10">
  <div className="max-w-5xl mx-auto px-4">
    {/* Header */}
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#023e8a] to-[#00b4d8] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-pattern-grid"></div>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.5,
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-white hover:text-blue-200 transition-all hover:scale-110">
            <div className="bg-white/10 rounded-full p-2 backdrop-blur-sm">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">Add New Room</h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">Fill out the details to add a new room type</p>
          </div>
        </div>
      </div>
    </div>

    {/* Form Card */}
    <Card className="w-full rounded-2xl border border-gray-100 shadow-lg bg-white overflow-hidden mb-4 sm:mb-6">
      <div className="p-4 sm:p-6">
        {/* Steps Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] -translate-y-1/2"
              style={{
                width: `${(currentStep / maxSteps) * 100}%`,
              }}
            ></div>

            <div className="flex justify-between relative px-2">
              {steps.map((item) => {
                const isActive = currentStep === item.step
                const isCompleted = currentStep > item.step

                return (
                  <div key={item.step} className="flex flex-col items-center z-10">
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full mb-1 sm:mb-2 text-center transition-all cursor-pointer",
                        isCompleted ? "bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white" : "",
                        isActive ? "bg-white border-4 border-blue-800 text-blue-900" : "",
                        !isActive && !isCompleted ? "bg-gray-200 text-gray-400" : "",
                        "shadow-md",
                      )}
                      onClick={() => isCompleted && setCurrentStep(item.step)}
                    >
                      <item.icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </div>
                    <span
                      className={cn(
                        "text-[10px] xs:text-xs font-medium transition-colors text-center",
                        isActive || isCompleted ? "text-blue-900" : "text-gray-500",
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="min-h-[300px]">
          <Form {...form}>
           
              <div className="space-y-6">
                {/* Step 1: Room Information */}
               {currentStep === 1 && (
  <div>
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Room Information</h2>
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {/* Room Type */}
      <FormItem>
          <FormLabel className="text-xs sm:text-sm">Room Type</FormLabel>
          <Select
            value={room.roomType}
            onValueChange={(value: string) => {
              setRoom({ ...room, roomType: value });
              if (value !== "other") {
                setRoom((prev) => ({ ...prev, customRoomType: "" }));
              }
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="standard">Standard Room</SelectItem>
              <SelectItem value="deluxe">Deluxe Room</SelectItem>
              <SelectItem value="suite">Suite</SelectItem>
              <SelectItem value="executive">Executive Room</SelectItem>
              <SelectItem value="family">Family Room</SelectItem>
              <SelectItem value="connecting">Connecting Room</SelectItem>
              <SelectItem value="accessible">Accessible Room</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {/* Show custom input if 'Other' is selected */}
          {room.roomType === "other" && (
            <div className="mt-2">
              <FormLabel className="text-xs sm:text-sm">Custom Room Type</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter custom room type description"
                  value={room.customRoomType || ""}
                  onChange={(e) => setRoom({ ...room, customRoomType: e.target.value })}
                />
              </FormControl>
              <FormDescription className="text-xs">Please specify your custom room type.</FormDescription>
            </div>
          )}
        </FormItem>

      {/* Quantity */}
    <FormItem>
  <FormLabel className="text-xs sm:text-sm">Number of Rooms</FormLabel>
  <FormControl>
    <Input
      type="number"
      min="1"
      value={room.quantity}
      onChange={(e) =>
        setRoom({ ...room, quantity: Math.max(1, parseInt(e.target.value) || 1) })
      }
      placeholder="Number of rooms of this type"
    />
  </FormControl>
  <FormDescription className="text-xs">
    How many rooms of this type are available?
  </FormDescription>
</FormItem>

      {/* Description */}
      <FormItem className="md:col-span-2">
        <FormLabel className="text-xs sm:text-sm">Description</FormLabel>
        <FormControl>
          <Textarea
            placeholder="Write a detailed description..."
            className="min-h-32"
            value={room.description}
            onChange={(e) => setRoom({ ...room, description: e.target.value })}
          />
        </FormControl>
      </FormItem>

      {/* Max Occupancy */}
      <FormItem>
        <FormLabel className="text-xs sm:text-sm">Max Occupancy</FormLabel>
        <Select
          value={room.maxOccupancy}
          onValueChange={(value) => setRoom({ ...room, maxOccupancy: value })}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select max occupancy" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="1">1 Person</SelectItem>
            <SelectItem value="2">2 People</SelectItem>
            <SelectItem value="3">3 People</SelectItem>
            <SelectItem value="4">4 People</SelectItem>
            <SelectItem value="5">5 People</SelectItem>
            <SelectItem value="6">6 People</SelectItem>
            <SelectItem value="7">7 People</SelectItem>
            <SelectItem value="8">8 People</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>

      <div className="flex gap-4 md:col-span-2">
        {/* Room Size */}
        <FormItem className="flex-1">
          <FormLabel className="text-xs sm:text-sm">Room Size</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="1"
              placeholder="Room size"
              value={room.roomSize}
              onChange={(e) => setRoom({ ...room, roomSize: parseInt (e.target.value) })}
            />
          </FormControl>
        </FormItem>

        {/* Room Size Unit */}
        <FormItem className="w-24">
          <FormLabel className="text-xs sm:text-sm">Unit</FormLabel>
          <Select
            value={room.roomSizeUnit}
            onValueChange={(value) => setRoom({ ...room, roomSizeUnit: value })}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="sqm">m²</SelectItem>
              <SelectItem value="sqft">ft²</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      </div>
    </div>
  </div>
)}

                {/* Step 2: Bed Configuration */}
 {currentStep === 2 && (
  <div>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-0">Bed Configuration</h2>
      <Button type="button" variant="outline" size="sm" onClick={addBedConfiguration}>
        <Plus className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Add Bed
      </Button>
    </div>

    <div className="space-y-3 sm:space-y-4">
      {/* Iterate over bedConfiguration and display it */}
    {room.bedConfiguration.map((bedConfig, index) => {
  const [count, type] = parseBedConfig(bedConfig);

  return (
    <Card key={index}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          {/* Bed Type */}
          <FormItem className="flex-1 w-full">
            <FormLabel className="text-xs sm:text-sm">Bed Type</FormLabel>
            <Select
              value={type || ""}
              onValueChange={(value) => {
                const updated = [...room.bedConfiguration];
                const newCount = count || "1";
                updated[index] = `${newCount} x ${value}`;
                setRoom({ ...room, bedConfiguration: updated });
              }}
            >
              <FormControl>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select bed type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {bedTypes.map((bed) => (
                  <SelectItem key={bed.id} value={bed.id} className="text-xs sm:text-sm">
                    {bed.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>

          {/* Bed Count */}
          <FormItem className="w-full sm:w-24">
            <FormLabel className="text-xs sm:text-sm">Count</FormLabel>
            <Select
              value={count || ""}
              onValueChange={(value) => {
                const updated = [...room.bedConfiguration];
                const newType = type || (bedTypes && bedTypes[0]?.id) || "";
                updated[index] = `${value} x ${newType}`;
                setRoom({ ...room, bedConfiguration: updated });
              }}
            >
              <FormControl>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Count" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1" className="text-xs sm:text-sm">1</SelectItem>
                <SelectItem value="2" className="text-xs sm:text-sm">2</SelectItem>
                <SelectItem value="3" className="text-xs sm:text-sm">3</SelectItem>
                <SelectItem value="4" className="text-xs sm:text-sm">4</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          {/* Remove Bed Configuration */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mt-0 sm:mt-6"
            onClick={() => removeBedConfiguration(index)}
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
})}

    </div>
  </div>
)}


                {/* Step 3: Pricing */}
              {currentStep === 3 && (
  <div>
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Pricing</h2>
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {/* Base Price Field */}
      <FormItem>
        <FormLabel className="text-xs sm:text-sm">Base Price (per night) $</FormLabel>
        <FormControl>
          <Input
            type="number"
            min="0"
          
            placeholder=""
            value={room.basePrice} // Controlled value from room state
            onChange={(e) => setRoom({ ...room, basePrice: parseFloat(e.target.value)  })}
          />
        </FormControl>
        <FormMessage className="text-xs" />
      </FormItem>

      {/* Discounted Price Field */}
      <FormItem>
        <FormLabel className="text-xs sm:text-sm">Discounted Price (optional) $</FormLabel>
        <FormControl>
          <Input
            type="number"
            min="0"
          
           
            value={room.discountedPrice} // Controlled value from room state
            onChange={(e) => setRoom({ ...room, discountedPrice: parseFloat(e.target.value)  })}
          />
        </FormControl>
        <FormDescription className="text-xs">Leave empty if no discount applies</FormDescription>
        <FormMessage className="text-xs" />
      </FormItem>
    </div>
  </div>
)}


                {/* Step 4: Amenities and Images */}
     {currentStep === 4 && (
  <div className="space-y-8">
    {/* Room Amenities */}
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Room Amenities</h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3">
        {roomAmenities.map((amenity) => (
          <div key={amenity.id} className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={room.amenities?.includes(amenity.id)} // Check if amenity is in the room
                onCheckedChange={(checked) => {
                  const updatedAmenities = checked
                    ? [...(room.amenities || []), amenity.id]
                    : (room.amenities || []).filter((value) => value !== amenity.id);
                    
                  setRoom({ ...room, amenities: updatedAmenities });  // Update room amenities state
                }}
              />
            </FormControl>
            <FormLabel className="font-normal">{amenity.label}</FormLabel>
          </div>
        ))}
      </div>
    </div>

    {/* Additional Options (Smoking Allowed) */}
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Additional Options</h2>
      <div className="flex flex-row items-start space-x-3 space-y-0">
        <FormControl>
          <Checkbox
            checked={room.smokingAllowed} // Use room.smokingAllowed
            onCheckedChange={(checked) => {
              setRoom({ ...room, smokingAllowed: checked === true });  // Ensure it's a boolean
            }}
          />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel className="text-xs sm:text-sm">Smoking Allowed</FormLabel>
          <FormDescription className="text-xs">Allow smoking in this room type</FormDescription>
        </div>
      </div>
    </div>

    {/* Room Images */}
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Room Images</h2>
      <div className="mb-4 rounded-md border border-dashed border-gray-300 p-6">
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="mb-2 h-8 w-8 text-gray-400" />
          <h3 className="mb-1 text-sm font-medium">Drop or select files</h3>
          <p className="text-xs text-gray-500">Drag files here or click to browse</p>
          <Input
            type="file"
            multiple
            className="mt-4 w-full max-w-xs"
            onChange={handleImageUpload} // Use handleImageUpload for image upload
            accept="image/*"
          />
        </div>
      </div>

     <div className="mt-3 sm:mt-4 space-y-6">

 {room.images && room.images.length > 0 && (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Previous Images</h3>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
        {room.images.map((url, index) => (
          <div key={`existing-${index}`} className="relative">
            <img
              src={url}
              alt={`Existing ${index}`}
              className="w-full h-24 sm:h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => handleRemoveExistingImage(index)}
              className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-600 text-white rounded-full p-0.5 sm:p-1 hover:bg-red-700 text-xs sm:text-sm"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  )}
  

                         {images.length > 0 && (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">New Uploaded Images</h3>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
        {images.map((image, index) => (
          <div key={`new-${index}`} className="relative">
            <img
              src={URL.createObjectURL(image)}
              alt={`New upload ${index}`}
              className="w-full h-24 sm:h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-600 text-white rounded-full p-0.5 sm:p-1 hover:bg-red-700 text-xs sm:text-sm"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  )}
                        </div>
    </div>
  </div>
)}


              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-50 transition-all ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Previous
                </button>

                {currentStep < maxSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white rounded-lg hover:shadow-md transition-all"
                  >
                    Next
                  </button>
                ) : (
                  <div className="flex gap-2 sm:gap-3">
                   <button
                          onClick={() => {
  if (validateRoom()) {
    onSaved(room, images);
  }
}}
                          className="px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-[#023e8a] to-[#00b4d8] text-white rounded-lg hover:shadow-md transition-all"
                        >
                          Complete Registration
                        </button>
                  </div>
                )}
              </div>
         
          </Form>
        </div>
      </div>
    </Card>

    <ToastContainer position="top-right" autoClose={3000} />
  </div>
</div>
  )
}
