import axios from "axios";
import { baseURL } from "./utils/utils";
import { ApiHotelResponse } from "./utils/hotel-tranform";
import imageCompression from 'browser-image-compression';


// USER 
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(baseURL+"auth/login", { email:email, password:password })
    console.log("baseurl ", baseURL);
    console.log(response);
    return response.data
  } catch (error: any) {
    // Preserve the full error object with status and response data
    if (error.response) {
      // Throw the entire error response to preserve status code and data
      throw error;
    } else {
      throw new Error("Login failed. Please try again.")
    }
  }
}

export const registerUser = async (
  name: string,
  phone: string,
  email: string,
  password: string,

  role:string,
  status?:string,
  premission?:string[]
) => {


     try {

      let payload ;
  //  console.log("baseurl ", process.env.NEXT_PUBLIC_Backend_Url);
  if(role=="user" || role=="support" )
  {
payload ={ name:name, phone:phone, email:email, password:password,  role:role ,status:status}
  }
  else if (role=="agent" )
  {
    payload ={ name:name, phone:phone, email:email, password:password,  role:role ,status:status,permissions:premission}
    console.log(payload);
  }
  else

    {
payload ={ name:name, phone:phone, email:email, password:password,  role:role }
    }
      
  const response = await axios.post(baseURL+"user",payload )


   return response.data
     }catch(error :any)
     {
         // Axios error has response info
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Register User Failed. Please try again.")
    }
     }

}
export const FetchallUser = async ( ) => {
  try {
    const response = await axios.get(baseURL+"user")

    return response.data
  } catch (error: any) {
    // Axios error has response info
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Login failed. Please try again.")
    }
  }
}
export const FetchUser = async (id: string, ) => {
  try {
    const response = await axios.get(baseURL+"user/"+id)
    console.log(response);
    return response.data
  } catch (error: any) {
    // Axios error has response info
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Login failed. Please try again.")
    }
  }
}

export const PatchUser = async (id: string, data: any) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.patch(
      baseURL + "user/" + id, 
      data
    );

    if (response.status === 204) {
      // Fetch the updated user data
      const updatedUser = await FetchUser(id);
      return {
        status: 200,
        data: updatedUser,
        message: "Profile updated successfully"
      };
    }

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Update failed. Please try again.")
    }
  }
}

//HOTEL 
export const RegisterHotelbyapi = async (hotel: Hotel, jwtToken?: string) => {
  try {
    // Get JWT token from argument or localStorage
    let token = jwtToken;
    if (!token) {
      const authString = localStorage.getItem("auth");
      if (authString) {
        try {
          // If stored as string, use directly; if object, extract token property
          const parsed = JSON.parse(authString);
          token = typeof parsed === "string" ? parsed : parsed.token || parsed.access_token;
        } catch {
          token = authString;
        }
      }
    }

    const images = JSON.parse(JSON.stringify(hotel.images));
    const imageobject = images.map((img: any) => img.url);

    const input = {
      name: hotel.name,
      description: hotel.description,
      starRating: hotel.starRating,
      Address: hotel.Address,
      city: hotel.city,
      state: hotel.state,
      zipCode: hotel.zipCode,
      country: hotel.country,
      checkInTime: hotel.checkInTime,
      averagePrice: hotel.averagePrice,
      checkOutTime: hotel.checkOutTime,
      availableFrom: hotel.availableFrom,
      availableTo: hotel.availableTo,
      images: imageobject,
      amenities: hotel.amenities || [],
      tags: hotel.tags,
      isCompleted: 1,
      dataByApi: true,
      apiId: hotel.id,
    };
    console.log(input);
    console.log("Token passed to API:", token);
    const response = await axios.post(
      baseURL + "hotels/by/agoda",
      input,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error: any) {
    console.log(error);
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Hotel Register  Failed. Please try again.");
    }
  }
};

// export const RegisterHotelbyapi = async (hotel: Hotel, token: string) => {
//   try {
//     console.log("Token passed to API:", token);

//     const response = await axios.post("/api/book-hotel", hotel, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data;
//   } catch (error: any) {
//     console.log("Error response:", error?.response?.data);
//     throw new Error(error?.response?.data?.message || "Hotel Register Failed. Please try again.");
//   }
// };


export const updateHotelMetadata = async (hotel: Hotel, incomplete: boolean) => {
  const authString = localStorage.getItem("auth");
  const token = authString ? JSON.parse(authString) : null;

  const parsedTags =
    typeof hotel.tags === "string"
      ? hotel.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag !== "")
      : Array.isArray(hotel.tags)
      ? hotel.tags
      : [];

  const complete: number = incomplete ? 1 : 0;

  const payload = {
    name: hotel.name,
    description: hotel.description,
    starRating: hotel.starRating,
    Address: hotel.Address,
    city: hotel.city,
    state: hotel.state,
    zipCode: hotel.zipCode,
    country: hotel.country,
    checkInTime: hotel.checkInTime,
    checkOutTime: hotel.checkOutTime,
    availableFrom: hotel.availableFrom.toISOString(),
    availableTo: hotel.availableTo.toISOString(),
    isCompleted: complete,
    amenities: hotel.amenities ?? [],
    dataByApi:false,
    tags: parsedTags,
    images: hotel.images ?? [], // existing image URLs
  };

  const response = await axios.patch(`${baseURL}hotels/${hotel.id}`, payload, {
    headers: {
      Authorization: `Bearer ${token?.access_token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const uploadHotelImages = async (hotelId: string, images: File[]) => {
  const authString = localStorage.getItem("auth");
  const token = authString ? JSON.parse(authString) : null;

  const formData = new FormData();

  const compressimg:File[]  = await compressImages(images);
 
  compressimg.forEach((image) => {
    formData.append("images[]", image);
  });

  const response = await axios.patch(`${baseURL}hotels/${hotelId}`, formData, {
    headers: {
      Authorization: `Bearer ${token?.access_token}`,
    
    },
  });

  return response.data;
};


export const EditRegisterHotel = async (
  hotel: Hotel,
  incomplete: boolean,
  newImages: File[]
) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const parsedTags =
      typeof hotel.tags === "string"
        ? hotel.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag !== "")
        : Array.isArray(hotel.tags)
        ? hotel.tags
        : [];

    const complete: number = incomplete ? 1 : 0;

    const formData = new FormData();
    formData.append("name", hotel.name);
    formData.append("description", hotel.description);
    formData.append("starRating", hotel.starRating.toString());
    formData.append("Address", hotel.Address);
    formData.append("city", hotel.city);
    formData.append("state", hotel.state);
    formData.append("zipCode", hotel.zipCode);
    formData.append("country", hotel.country);
    formData.append("averagePrice", hotel.averagePrice);
    formData.append("checkInTime", hotel.checkInTime);
    formData.append("checkOutTime", hotel.checkOutTime);
    formData.append("availableFrom", hotel.availableFrom.toISOString());
    formData.append("availableTo", hotel.availableTo.toISOString());
    formData.append("isCompleted", complete.toString());

    // Existing image URLs (if retained)
   

    // Tags and amenities as arrays
    parsedTags.forEach((tag) => formData.append("tags[]", tag));
    (hotel.amenities ?? []).forEach((amenity) => formData.append("amenities[]", amenity));
hotel?.images?.forEach((file) => {
      formData.append("images[]", file);
    });
    // Append new image files
    newImages.forEach((file) => {
      formData.append("images[]", file);
    });

    const response = await axios.patch(`${baseURL}hotels/${hotel.id}`, formData, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
       
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Hotel edit error", error);
    throw new Error(error.response?.data?.message || "Hotel update failed");
  }
};


export const registerHotelMetadata = async (hotel: Hotel, incomplete: boolean) => {
  const authString = localStorage.getItem("auth");
  const token = authString ? JSON.parse(authString) : null;

  const parsedTags =
    typeof hotel.tags === "string"
      ? hotel.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag !== "")
      : Array.isArray(hotel.tags)
      ? hotel.tags
      : [];

  const complete: number = incomplete ? 1 : 0;

  const payload = {
    name: hotel.name,
    description: hotel.description,
    starRating: hotel.starRating,
    Address: hotel.Address,
    city: hotel.city,
    state: hotel.state,
    zipCode: hotel.zipCode,
    country: hotel.country,
    checkInTime: hotel.checkInTime,
    checkOutTime: hotel.checkOutTime,
    availableFrom: hotel.availableFrom.toISOString(),
    availableTo: hotel.availableTo.toISOString(),
    isCompleted: complete,
    amenities: hotel.amenities ?? [],
    tags: parsedTags,
  };

  const response = await axios.post(`${baseURL}hotels`, payload, {
    headers: {
      Authorization: `Bearer ${token?.access_token}`,
      "Content-Type": "application/json",
    },
  });
console.log("Hotel Registration Response: ", response);
  return response.data; // will contain the new hotel ID
};

export const RegisterHotel = async (
  hotel: Hotel,
  incomplete: boolean,
  images: File[]
) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const parsedTags =
      typeof hotel.tags === "string"
        ? hotel.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag !== "")
        : Array.isArray(hotel.tags)
        ? hotel.tags
        : [];

    const complete: number = !incomplete ? 0 : 1;

    const formData = new FormData();
    formData.append("name", hotel.name);
    formData.append("description", hotel.description);
    formData.append("starRating", hotel.starRating.toString());
    formData.append("Address", hotel.Address);
    formData.append("city", hotel.city);
    formData.append("state", hotel.state);
    formData.append("zipCode", hotel.zipCode);
    formData.append("country", hotel.country);
    formData.append("averagePrice", hotel.averagePrice);
    formData.append("checkInTime", hotel.checkInTime);
    formData.append("checkOutTime", hotel.checkOutTime);
    formData.append("availableFrom", hotel.availableFrom.toISOString());
    formData.append("availableTo", hotel.availableTo.toISOString());
    formData.append("isCompleted", complete.toString());

    // Append tags and amenities
    parsedTags.forEach((tag) => formData.append("tags[]", tag));
    (hotel.amenities ?? []).forEach((amenity) => formData.append("amenities[]", amenity));

    // Append image files
    images.forEach((file) => {
      formData.append("images[]", file);
    });

    // Send form data
    const response = await axios.post(`${baseURL}hotels`, formData, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
      
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("RegisterHotel error", error);
    throw new Error(error.response?.data?.message || "Hotel registration failed.");
  }
};



export const  setHoteltoComplete = async (hotelid:string|undefined) => {
  try {
   
const payload = {
  "isCompleted":1
}
const response = await axios.patch(
  baseURL + "hotels/"+hotelid,payload,
  
  {
    headers: {
    
      "Content-Type": "application/json",
    },
  }
);
console.log(response);
   

    // Update local state with the newly created hotel (including its ID)
    return response.data

    
  } catch (error: any) {
   if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Hotel Register  Failed. Please try again.")
    }
  }
};


export const GetHotelsPublic = async (location?: string) => {
  try {
    const response = await axios.get(baseURL + "hotels/all/list", {
      params: location ? { location } : {},
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response);

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Hotel fetch failed. Please try again.");
    }
  }
};
export const GetHotels = async (page: number, limit: number, location?: string) => {
  try {
    const response = await axios.get(baseURL + "hotels/admin/list", {
      params: {
        page,
        limit,
        ...(location ? { location } : {}),
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response);

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Hotel fetch failed. Please try again.");
    }
  }
};


export const  GetPendingHotels = async () => {
  try {
   const authString = localStorage.getItem("auth");
const token = authString ? JSON.parse(authString) : null;

const response = await axios.get(
  baseURL + "hotels/pending",
  
  {
    headers: {
      Authorization: `Bearer ${token?.access_token}`, // now token is an object
      "Content-Type": "application/json",
    },
  }
);
console.log("Pening: ",response);
   

    // Update local state with the newly created hotel (including its ID)
    return response.data

    
  } catch (error: any) {
   if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Hotel Register  Failed. Please try again.")
    }
  }
};
export const  GetCompleteHotels = async () => {
  try {
   const authString = localStorage.getItem("auth");
const token = authString ? JSON.parse(authString) : null;

const response = await axios.get(
  baseURL + "hotels/completed",
  
  {
    headers: {
      Authorization: `Bearer ${token?.access_token}`, // now token is an object
      "Content-Type": "application/json",
    },
  }
);
console.log("Pening: ",response);
   

    // Update local state with the newly created hotel (including its ID)
    return response.data

    
  } catch (error: any) {
   if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Hotel Register  Failed. Please try again.")
    }
  }
};
export const  DeleteHotel = async (id:string) => {
  try {
   const authString = localStorage.getItem("auth");
const token = authString ? JSON.parse(authString) : null;

const response = await axios.delete(
  baseURL + `hotels/${id}`,
  
  {
    headers: {
      Authorization: `Bearer ${token?.access_token}`, // now token is an object
      "Content-Type": "application/json",
    },
  }
);

   

    // Update local state with the newly created hotel (including its ID)
    return response.data

    
  } catch (error: any) {
   if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Hotel Register  Failed. Please try again.")
    }
  }
};

export const  GetHotel = async (id:string) => {
  try {
   const authString = localStorage.getItem("auth");
const token = authString ? JSON.parse(authString) : null;

const response = await axios.get(
  baseURL + `hotels/${id}`,
  
  {
    headers: {
      Authorization: `Bearer ${token?.access_token}`, // now token is an object
      "Content-Type": "application/json",
    },
  }
);
   

    // Update local state with the newly created hotel (including its ID)
    return response.data

    
  } catch (error: any) {
   if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Hotel Register  Failed. Please try again.")
    }
  }
};
export const  GetallHotelbyid = async (id:string) => {
  try {
   const authString = localStorage.getItem("auth");
const token = authString ? JSON.parse(authString) : null;

const response = await axios.get(
  baseURL + `hotels/admin/vendors/${id}`,
  
  {
    headers: {
      Authorization: `Bearer ${token?.access_token}`, // now token is an object
      "Content-Type": "application/json",
    },
  }
);
   

    // Update local state with the newly created hotel (including its ID)
    return response.data

    
  } catch (error: any) {
   if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Hotel Register  Failed. Please try again.")
    }
  }
};

//ROOMS
export const RegisterRoombyApi = async (room: Room, hotelId: string,hotel:Hotel) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    // Log the room data for debugging
    console.log("Room Data:", room);

    // Prepare the payload based on CreateRoomDto structure
const payload = {
roomType: room.roomType,
  description: room.description?.trim() || "No Description Provided",
  maxOccupancy: String(room.maxOccupancy),
  bedConfiguration: room.bedConfiguration?.length ? room.bedConfiguration.map(String) : ["1 bed"],
  roomSize: Number(room.roomSize),             // ✅ number
  roomSizeUnit: "sqm",
  basePrice: Number(room.basePrice),           // ✅ number
  discountedPrice: Number(room.discountedPrice), // ✅ number
  amenities: room.amenities?.map(String) ?? [],
  images: room.images?.map(String) ?? [""],
  quantity: Number(room.quantity),             // ✅ number
  smokingAllowed: Boolean(room.smokingAllowed),
  hotel: {
    id: Number(hotelId),                       // ✅ number inside object
  },
};

    // Log the payload to ensure it's being sent correctly
    console.log('Payload being sent:', payload);

    // Sending the data to the API via POST request
    const response = await axios.post(
      baseURL + "rooms", 
      payload,
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log the API response for debugging
    console.log('API Response:', response.data);

    return response.data;

  } catch (error: any) {
    console.error("Error occurred:", error);

    // Handling error and providing meaningful messages
    if (error.response) {
      console.error("Response Error:", error.response);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }

    // Generic error message
    throw new Error("Room registration failed. Please try again.");
  }
};


export const RegisterRooms = async (room: Room, hotelId: string, images: File[]) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const formData = new FormData();
if(room.roomType=="other")
{
  formData.append("roomType", room.customRoomType || "Custom Room Type");
}
else
{
  formData.append("roomType", room.roomType);
 
}
    formData.append("description", room.description || "No Description is Provided");
    formData.append("maxOccupancy", room.maxOccupancy.toString());

    room.bedConfiguration.forEach((item, index) => {
      formData.append(`bedConfiguration[${index}]`, item);
    });

    formData.append("roomSize", room.roomSize.toString());
    formData.append("roomSizeUnit", room.roomSizeUnit);
    formData.append("basePrice", room.basePrice.toString());
    formData.append("discountedPrice", room.discountedPrice.toString());

    (room.amenities ?? []).forEach((item, index) => {
      formData.append(`amenities[${index}]`, item);
    });

    formData.append("quantity", room.quantity.toString());
    formData.append("smokingAllowed", room.smokingAllowed ? "true" : "false");
    formData.append("hotel[id]", hotelId);
const compressimg:File[] = await compressImages(images);
    // Append images
    compressimg.forEach((image) => {
      formData.append("images", image); // key must match the backend field
    });

    const response = await axios.post(
      baseURL + "rooms",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          // ⚠️ Don't set Content-Type here; axios sets it automatically with boundary
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Room registration failed. Please try again.");
    }
  }
};


export const  GetRoomsbyHotel = async (id:string,date:string) => {
  try {
   const authString = localStorage.getItem("auth");
const token = authString ? JSON.parse(authString) : null;

const response = await axios.get(
  baseURL + `rooms/hotel/${id}?date=${encodeURIComponent(date)}`,
  
  {
    headers: {
      Authorization: `Bearer ${token?.access_token}`, // now token is an object
      "Content-Type": "application/json",
    },
  }
);
   

    // Update local state with the newly created hotel (including its ID)
    return response.data

    
  } catch (error: any) {
   if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Hotel Register  Failed. Please try again.")
    }
  }
};
export const  GetRoomsVendorsbyHotel = async (id:string) => {
  try {
   const authString = localStorage.getItem("auth");
const token = authString ? JSON.parse(authString) : null;

const response = await axios.get(
  baseURL + `rooms/vendor/hotel/${id}`,
  
  {
    headers: {
      Authorization: `Bearer ${token?.access_token}`, // now token is an object
      "Content-Type": "application/json",
    },
  }
);
   

    // Update local state with the newly created hotel (including its ID)
    return response.data

    
  } catch (error: any) {
   if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Hotel Register  Failed. Please try again.")
    }
  }
};
export const  GetRoomsbyid = async (id:string) => {
  try {
   const authString = localStorage.getItem("auth");
const token = authString ? JSON.parse(authString) : null;

const response = await axios.get(
  baseURL + `rooms/${id}`,
  
  {
    headers: {
      Authorization: `Bearer ${token?.access_token}`, // now token is an object
      "Content-Type": "application/json",
    },
  }
);
   

    // Update local state with the newly created hotel (including its ID)
    return response.data

    
  } catch (error: any) {
   if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Hotel Register  Failed. Please try again.")
    }
  }
};


export const updateRoomData = async (room: Room, id: string): Promise<any> => {
  const authString = localStorage.getItem("auth");
  const token = authString ? JSON.parse(authString) : null;

  const payload = {
    roomType: room.roomType!="Other"?room.roomType:room.customRoomType,
    description: room.description || "No Description Provided",
    maxOccupancy: room.maxOccupancy,
    bedConfiguration: room.bedConfiguration,
    roomSize: room.roomSize,
    roomSizeUnit: room.roomSizeUnit,
   
    basePrice: room.basePrice,
    discountedPrice: room.discountedPrice,
    amenities: room.amenities ?? [],
    quantity: room.quantity,
    smokingAllowed: room.smokingAllowed,
    
    
  };

  const response = await axios.patch(
    `${baseURL}rooms/${id}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};


export const uploadRoomImages = async (room:Room,id: string, images: File[]): Promise<any> => {
  const authString = localStorage.getItem("auth");
  const token = authString ? JSON.parse(authString) : null;

  const formData = new FormData();
  if(room.images)
  {

    room.images.forEach((file) => {
      formData.append("images[]", file);
    });
  }
  images.forEach((file) => {
    formData.append("images[]", file);
  });

  const response = await axios.patch(
    `${baseURL}rooms/${id}`, // Adjust endpoint if needed
    formData,
    {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        // No need to manually set content-type
      },
    }
  );

  return response.data;
};

const compressImages = async (files: File[]): Promise<File[]> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };
  return await Promise.all(files.map(file => imageCompression(file, options)));
};
export const EditRoomsbyid = async (room: Room, id: string, images: File[]) => {
  try {
    const promises: Promise<any>[] = [];

    // JSON update request
    promises.push(updateRoomData(room, id));

    // FormData upload (if there are new images)
    if (images.length > 0) {
      const compressedImages = await compressImages(images);
      promises.push(uploadRoomImages(room,id, compressedImages));
    }

    const [roomUpdateResponse] = await Promise.all(promises);

    return roomUpdateResponse;
  } catch (error: any) {
    throw new Error(error.message || "Room update failed.");
  }
};


export const  DeleteRoom = async (id:string|undefined
) => {
  try {
   const authString = localStorage.getItem("auth");
const token = authString ? JSON.parse(authString) : null;

const response = await axios.delete(
  baseURL + `rooms/${id}`,
  
  {
    headers: {
      Authorization: `Bearer ${token?.access_token}`, // now token is an object
      "Content-Type": "application/json",
    },
  }
);

   

    // Update local state with the newly created hotel (including its ID)
    return response.data

    
  } catch (error: any) {
   if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Hotel Register  Failed. Please try again.")
    }
  }
};


//Booking 

export const BookRoom = async (checkIn:Date,checkout:Date,totalPrice:string,nights:string,rooms:BookingRoom[],hotel:Hotel,paymentType:string,name:String,email:string,nicNumber:string) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
 const roomsid=   rooms.map(room => String(room.roomType))
 console.log("Rooms: ",roomsid);
const payload = {
  name:name,
  email:email,
  checkIndate: checkIn,
  checkOutDate: checkout,
  numberOfDays: nights,
  amount: totalPrice,
  room: roomsid,
  hotel: hotel,
  paymentType:paymentType,
  nicNumber:nicNumber
};
console.log("PAYMENT : ",payload);

    const response = await axios.post(
      baseURL + "bookings",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Booking failed. Please try again.");
    }
  }
};


export const GetUpcommingBooking = async () => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
 


    const response = await axios.get(
      baseURL + "bookings/user/upcoming",
    
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Booking failed. Please try again.");
    }
  }
};
export const GetallBookings = async () => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
 


    const response = await axios.get(
      baseURL + "bookings",
    
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Booking failed. Please try again.");
    }
  }
};
export const GetPastBookings = async () => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
 


    const response = await axios.get(
      baseURL + "bookings/user/past",
    
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Booking failed. Please try again.");
    }
  }
};
export const GetCancelledBookings = async () => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
 


    const response = await axios.get(
      baseURL + "bookings/user/cancelled",
    
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Booking failed. Please try again.");
    }
  }
};


export const CancelbyVendorBooking = async (id:string) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
 const payload = {

 isAppeared:false,
 };


    const response = await axios.patch(
      baseURL + "bookings/"+id,
    payload,
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
console.log("Cancel Booking Response: ",response);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Booking failed. Please try again.");
    }
  }
};


export const CancelBooking = async (id:string) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
 const payload = {
  isActive: false,
 
 };


    const response = await axios.patch(
      baseURL + "bookings/"+id,
    payload,
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
console.log("Cancel Booking Response: ",response);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Booking failed. Please try again.");
    }
  }
};


export const GetBookingbyHotel = async (id :string) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
 


    const response = await axios.get(
      baseURL + "bookings/hotel/"+id,
    
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Booking failed. Please try again.");
    }
  }
};

export const AddHotelToFavourites = async (hotelId: string) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const payload = {
      hotel: hotelId
    };

    try {
      const response = await axios.post(
        `${baseURL}hotels/add/favourites`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token?.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        await DeleteHotelFromFavourites(hotelId);
        return { deleted: true, message: "Removed from favorites" };
      }
      throw error; // Re-throw other errors
    }
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to add to favorites. Please try again.");
    }
  }
};

export const DeleteHotelFromFavourites = async (favoriteId: string) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.delete(
      `${baseURL}hotels/favourites/${favoriteId}`,
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to remove from favorites. Please try again.");
    }
  }
};


export const getFavoriteHotels = async () => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    if (!token) {
      console.log('No auth token found');
      return [];
    }

    const response = await axios.get(
      `${baseURL}hotels/favourites/users`,
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log('Favorites response:', response.data);
    
    // Ensure we return an array of favorites with valid hotel data
    const validFavorites = response.data.filter((fav: any) => fav.hotel !== null);
    console.log('Valid favorites:', validFavorites);
    
    return validFavorites;
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};



// Reviews

export const PostaReview = async (data:any,hotelid:string|undefined) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;


const payload = {
 "description": data.description,
 "rating": data.rating,
 hotel: {
    id: hotelid, // Ensure this is a string if your API expects it  
  },
};


    const response = await axios.post(
      baseURL + "reviews",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Booking failed. Please try again.");
    }
  }
};

export const Getallreviews = async()=>
{
   try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
    const response = await axios.get(
      baseURL + "reviews",
      
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Reviews failed. Please try again.");
    }
  }

}


export const GetUserReviews = async()=>
{
   try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
    const response = await axios.get(
      baseURL + "reviews/user/all",
      
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Reviews failed. Please try again.");
    }
  }

}


export const GetReviewbyHotel = async(id:string)=>
{
   try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
    const response = await axios.get(
      baseURL + "reviews/hotel/"+id,
      
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Reviews failed. Please try again.");
    }
  }

}


//API SEARCH 

export const fetchHotelFromAPI = async (
  hotelId: string,
 
): Promise<ApiHotelResponse | null> => {
  try {
    const url = "https://agoda-com.p.rapidapi.com/hotels/details";

    const response = await axios.get(url, {
      params: {
        propertyId: hotelId,
        languagecode: 'en-us',
       
      },
     headers: {
      "x-rapidapi-key": "7f66331876msh5a86fb2ce181b4dp1b2f48jsn8db63f8e12d9",
      "x-rapidapi-host": "agoda-com.p.rapidapi.com",
    },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    return null;
  }
};


export const fetchRoomfromApi = async (
  hotelId: string,
  checkin: string,
  checkout: string
): Promise<ApiHotelResponse | null> => {
  try {
    const url = "https://agoda-com.p.rapidapi.com/hotels/room-prices";

    const response = await axios.get(url, {
       params: {
          propertyId: hotelId,
          checkinDate: checkin,
          checkoutDate: checkout,
        },
      headers: {
   "x-rapidapi-key": "7f66331876msh5a86fb2ce181b4dp1b2f48jsn8db63f8e12d9",
          "x-rapidapi-host": "agoda-com.p.rapidapi.com",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    return null;
  }
};

export const GetVendorPayments = async (id: string, startDate: string, endDate: string) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(
      `${baseURL}bookings/vendor/payments/${id}`,
      {
        params: {
          startDate: startDate,
          endDate: endDate
        },
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch payments. Please try again.");
    }
  }
};

export const GetVendorBookingDetails = async (id: string, startDate: string, endDate: string) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(
      `${baseURL}bookings/vendor/bookings/details/${id}`,
      {
        params: {
          startDate: startDate,
          endDate: endDate
        },
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch booking details. Please try again.");
    }
  }
};



//CAR RENTAL API

//post api

export const createCarRental = async (rentalData: any): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.post(
      `${baseURL}carrentals`,
      rentalData,
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to create car rental. Please try again.");
    }
  }
};


//GET API

export const getCarRentals = async (): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}carrentals`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch car rentals. Please try again.");
    }
  }
};



export const getCarRentalsVendor = async (): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}carrentals/fleet/vendor`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch car rentals. Please try again.");
    }
  }

};

export const getCarDashboardStats = async (): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}carrentals/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch car rentals. Please try again.");
    }
  }

};

//GET BY ID
export const getCarRentalById = async (id: string): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}carrentals/${id}`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch car rental. Please try again.");
    }
  }
};


//PATCH API

export const updateCarRental = async (id: string, rentalData: any): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.patch(
      `${baseURL}carrentals/${id}`,
      rentalData,
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to update car rental. Please try again.");
    }
  }
};


//DELETE API
export const deleteCarRental = async (id: string): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.delete(`${baseURL}carrentals/${id}`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to delete car rental. Please try again.");
    }
  }
};


/// Stats 



export const HotelStats = async (): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}bookings/user/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to delete car rental. Please try again.");
    }
  }
};


export const admindashboardstats = async ()=> {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}bookings/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to delete car rental. Please try again.");
    }
  }
};


export const GetallCars = async ()=> {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}carrentals`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to delete car rental. Please try again.");
    }
  }
};



//Cars Booking Api's

//post api
export const createCarBooking = async (bookingData: any): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.post(`${baseURL}carbookings`, bookingData, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to create car booking. Please try again.");
    }
  }
};


//get car rentals
export const getCarBookings = async (): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}carbookings`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to get car bookings. Please try again.");
    }
  }
};


//get car booking by id
export const getCarBookingById = async (id: string): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}carbookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to get car booking. Please try again.");
    }
  }
};


//patch car booking by id
export const patchCarBookingById = async (id: string, bookingData: any): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.patch(`${baseURL}carbookings/${id}`, bookingData, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to update car booking. Please try again.");
    }
  }
};


//Delete by id
export const deleteCarBookingById = async (id: string): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.delete(`${baseURL}carbookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to delete car booking. Please try again.");
    }
  }
};



export const GetallInvoices = async ()=> {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}invoices/admin/hotels`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to delete car rental. Please try again.");
    }
  }
};

/**
 * Fetch invoices for a given admin type (hotels, cars, umrah, etc.)
 * Example endpoints: invoices/admin/hotels, invoices/admin/cars, invoices/admin/umrah
 */
export const GetAllInvoicesByType = async (type: string = "hotels") => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}invoices/admin/${type}`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch invoices. Please try again.");
    }
  }
};

export const GetVendorInvoices = async (vendorId: number, monthYear: string)=> {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}invoices/vendor/${vendorId}/month/${monthYear}`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to delete car rental. Please try again.");
    }
  }
};


//get car booking by vendor id 
export const getCarBookingsByVendorId = async (vendorId: string): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}carbookings/vendor/all`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to get car booking. Please try again.");
    }
  }
};




export const UpdateUserStatus = async (id: string,status:string): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const payload = {
      status:status
    }
    const response = await axios.patch(`${baseURL}user/${id}`,payload, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to get car booking. Please try again.");
    }
  }
};

export const UpdateHotelApprove = async (id: string,status:string)=>
{
   try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const payload = {
      status:status
    }
    const response = await axios.patch(`${baseURL}hotels/${id}`,payload, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to get car booking. Please try again.");
    }
  }
}

// UMRAH Dashboard stats
export const getUmrahDashboardStats = async (): Promise<any> => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}umrah/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch umrah dashboard stats. Please try again.");
    }
  }
}


export const GetCars = async ()=>
{
   try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

 
    const response = await axios.get(`${baseURL}carrentals`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to get car booking. Please try again.");
    }
  }
}


export const GetallHotelBookingsforAgent = async (id:string)=>
{
   try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

 
    const response = await axios.get(`${baseURL}bookings/agent/${id}`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to get car booking. Please try again.");
    }
  }
}


export const MonthWiseBookingVendor = async (id: string, month: string) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}bookings/month/${id}?month=${encodeURIComponent(month)}`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to get month-wise vendor bookings. Please try again.");
    }
  }
};


export const AgentComission =async(id:string )=> {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(`${baseURL}invoices/agent/comission/${id}`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to get month-wise vendor bookings. Please try again.");
    }
  }
} 


export const ChangeAvailability = async(id:string,availability:boolean,date:Date|null)=>
{
   try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
    
    const payload = {
      isActive:availability,
      availableUntil:date,
    }
 
    const response = await axios.patch(`${baseURL}rooms/${id}`,payload, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to get car booking. Please try again.");
    }
  }
}



export const CofirmedbyAdmin = async (id:string) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
 const payload = {

 isConfirmed:true,
 };


    const response = await axios.patch(
      baseURL + "bookings/"+id,
    payload,
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
console.log("Cancel Booking Response: ",response);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Booking failed. Please try again.");
    }
  }
};



export const CofirmedbyAdminuserAppeared = async (id:string) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
 const payload = {
isAppeared:true,
 isConfirmed:false,


 };


    const response = await axios.patch(
      baseURL + "bookings/"+id,
    payload,
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
console.log("Cancel Booking Response: ",response);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Booking failed. Please try again.");
    }
  }
};



export const  GetNotification = async () => {
  try {
   const authString = localStorage.getItem("auth");
const token = authString ? JSON.parse(authString) : null;

const response = await axios.get(
  baseURL + "notifications/user/all",
  
  {
    headers: {
      Authorization: `Bearer ${token?.access_token}`, // now token is an object
      "Content-Type": "application/json",
    },
  }
);
console.log("Pening: ",response);
   

    // Update local state with the newly created hotel (including its ID)
    return response.data

    
  } catch (error: any) {
   if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Hotel Register  Failed. Please try again.")
    }
  }
};

export const  ReadNotification = async (id:string) => {
  try {
   const authString = localStorage.getItem("auth");
const token = authString ? JSON.parse(authString) : null;

const response = await axios.patch(
  baseURL + `notifications/${id}`,
  {
seen:true
  }
  ,
  {
    headers: {
      Authorization: `Bearer ${token?.access_token}`, // now token is an object
      "Content-Type": "application/json",
    },
  }
);
console.log("Pening: ",response);
   

    // Update local state with the newly created hotel (including its ID)
    return response.data

    
  } catch (error: any) {
   if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Hotel Register  Failed. Please try again.")
    }
  }
};






export const  sendResetEmail = async (email:string) => {
  try {

const response = await axios.post(
  baseURL + `user/confirm/email?email=${email}`
  
 
);

   

    // Update local state with the newly created hotel (including its ID)
    return response.data

    
  } catch (error: any) {
   if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Hotel Register  Failed. Please try again.")
    }
  }
};
