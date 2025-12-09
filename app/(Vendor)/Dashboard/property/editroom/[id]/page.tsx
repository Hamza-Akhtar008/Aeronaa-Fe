"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { BedDouble } from "lucide-react";


import { toast, ToastContainer } from "react-toastify";
import { EditRoomsbyid, GetRoomsbyid } from "@/lib/api";
import { RoomDetailsForm } from "@/components/forms/room-detailsform";


const EditRoomPage = () => {
   const params = useParams()
    const id = params?.id as string
  const router = useRouter();

  const [room, setRoom] = useState<Room>({
    id: "",
    roomType: "",
    description: "",
    maxOccupancy: "",
    bedConfiguration: [],
    roomSize: 0,
    roomSizeUnit: "",
    customRoomType:"",
    basePrice: 0,
    discountedPrice: 0,
    amenities: [],
    images: [],
    quantity: 0,
    smokingAllowed: false,
    hotel: { id: "" },
    isActive: false,
    availableRooms: 0,
  });
  const [roomLoading, setRoomLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomData = await GetRoomsbyid(id);
        if (roomData) {
          setRoom(roomData);
        } else {
          toast.error("Room not found.");
          router.push("/Dashboard");
        }
      } catch (error) {
        toast.error("Failed to fetch room details.");
        router.push("/Dashboard");
      }
    };

    fetchRoom();
  }, [id, router]);

 const handleRoomSave = async (room: Room, images: File[]) => {
  try {
    setRoomLoading(true);
    const response = await EditRoomsbyid(room, id, images);

    // Check if response indicates success
    if (!response || response.affected !== 1) {
      throw new Error("Room update failed");
    }

    toast.success("Room details updated successfully!");
    setTimeout(() => {
      router.push("/Dashboard");
    }, 500);
  } catch (error: any) {
    console.error("Error updating room:", error);
    toast.error("Failed to update room details. Please try again.");
  } finally {
    setRoomLoading(false);
  }
};


  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800">Edit Room Details</h1>
      <RoomDetailsForm
        room={room}
        hotelId={room.hotel?.id ?? ""}
        setRoom={setRoom}
        onSaved={handleRoomSave}
       
      />
      {/* Room Loading Overlay */}
      {roomLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
            <div className="text-center">
              {/* Animated Room Icon */}
              <div className="relative mx-auto mb-4">
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                <BedDouble className="w-6 h-6 text-green-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>

              {/* Loading Text */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Updating Room Details
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Please wait while we save your room changes...
              </p>

              {/* Progress Dots */}
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
     <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default EditRoomPage;
