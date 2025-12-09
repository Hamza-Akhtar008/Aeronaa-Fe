import axios from "axios"
import { baseURL } from "./utils/utils"


export const PostProperty = async (formattedData:any) => {
  try {
   
     const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.post(baseURL + "property", formattedData, {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
 
        }},);

    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to post flight ticket. Please try again.");
    }
  }
}

export const EditProperty = async (formattedData:any,id:string) => {
  try {
   
     const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.patch(baseURL + `property/${id}`, formattedData, {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
 
        }},);

    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to post flight ticket. Please try again.");
    }
  }
}


export const GetPropertybyuser = async () => {
  try {
   
     const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(baseURL + "property/user/all",  {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
 
        }},);

    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to post flight ticket. Please try again.");
    }
  }
}

export const GetPropertyall = async () => {
  try {
    
    

    const response = await axios.get(baseURL + "property", {
     // axios will append ?location=...&propertyType=...
    })

    return response.data
  } catch (error: any) {
    console.error("API Error:", error)
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Failed to fetch properties. Please try again.")
    }
  }
}


export const GetPropertySearch = async (location?: string, propertyType?: string) => {
  try {
    let url = baseURL + "property"

    if (location || propertyType) {
      const query = new URLSearchParams()
      if (location) query.append("location", location)
      if (propertyType) query.append("listingType", propertyType)

      url += `?${query.toString()}`
    }

    const response = await axios.get(url)
    return response.data
  } catch (error: any) {
    console.error("API Error:", error)
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error("Failed to fetch properties. Please try again.")
    }
  }
}

export const fetchPropertyById = async (id:string) => {
  try {
   
     const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(baseURL + `property/${id}`,  {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
 
        }},);

    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to post flight ticket. Please try again.");
    }
  }
}

export const DeletePropertybyid = async (id:string) => {
  try {
   
     const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.delete(baseURL + `property/${id}`,  {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
 
        }},);

    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to post flight ticket. Please try again.");
    }
  }
}