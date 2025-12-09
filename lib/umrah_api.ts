import axios from "axios"
import { baseURL } from "./utils/utils"


export const PostUmrahPakage = async (formattedData:any) => {
  try {
    const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
   

    const response = await axios.post(baseURL + "umrah", formattedData, {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
       
        }});

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



export const EditUmrahPackage = async (formattedData:any,pakageid:string) => {
  try {
   
   
  const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
    const response = await axios.patch(baseURL + `umrah/${pakageid}`, formattedData,{
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
    
        }});

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



export const GetUmrahPakageallVEndor = async () => {
  try {
   
   
  const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
    const response = await axios.get(baseURL + "umrah/vendor/packages",{
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
    
        }});

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


export const GetUmrahPakageall = async () => {
  try {
   
   

    const response = await axios.get(baseURL + "umrah");

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


export const SearchUmrahPackages = async (packageType: string, duration: string, city: string) => {
  try {
    const params = new URLSearchParams();
    if (packageType) params.append('packageType', packageType);
    if (duration) params.append('duration', duration);
    if (city) params.append('city', city);

    const response = await axios.get(`${baseURL}umrah?${params.toString()}`);

    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to search Umrah packages. Please try again.");
    }
  }
}


export const GetUmrahPakage = async (id:string) => {
  try {
   
   

    const response = await axios.get(baseURL + `umrah/${id}`);

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


export const DeletePakage =async (id:string)=>
{

  try {
   
   

    const response = await axios.delete(baseURL + `umrah/${id}`);

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


export const Getallumrahbookings =async()=>
{
 try {
   
   

    const response = await axios.get(baseURL + `umrahbookings`);

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

export const GetallumrahbookingVendor =async()=>
{
 try {
   
   const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(baseURL + `umrahbookings/vender/only`,{  headers: {
          Authorization: `Bearer ${token?.access_token}`,
    
        }});

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




export const GetallUmrahBookingsbyAgent =async(id:string)=>
{
 try {
   
   

    const response = await axios.get(baseURL + `umrahbookings/agent/${id}`);

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