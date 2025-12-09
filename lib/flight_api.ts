import axios from "axios"
import { baseURL } from "./utils/utils"
import { FlightFormData,Ticket } from "@/types/checkout"





interface FlightSearchParams {
  fromname: string
  toname: string
  departureDate: string
  returnDate?: string | null
  cabinClass: string
  tripType: string
}

export const PostFlight = async (formattedData:any) => {
  try {
   
   

    const response = await axios.post(baseURL + "flights", formattedData);
    console.log("API Response:", response);
    
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


export const UpdateFlight = async (id:string,formattedData:any) => {
  try {
   
   

    const response = await axios.patch(baseURL + `flights/${id}`, formattedData);
    console.log("API Response:", response);
    
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




export const PostSegment = async (formattedData:any) => {
  try {
   
   

    const response = await axios.post(baseURL + "flights/create/segments", formattedData);
    console.log("API Response:", response);
    
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

export const UpdateSegments = async (id:string,formattedData:any) => {
  try {
   
   

    const response = await axios.patch(baseURL + `flights/create/segments/${id}`, formattedData);
    console.log("API Response:", response);
    
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





export const GetTicket = async (): Promise<Ticket[]> => {
  try {
    const response = await axios.get(`${baseURL}flights`)
    console.log(response);
    return response.data as Ticket[]
  } catch (error: any) {
    console.error("Error fetching tickets:", error)
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch flight tickets. Please try again."
    throw new Error(message)
  }
}



export async function fetchFlights(params: FlightSearchParams) {
  try {
    const { fromname, toname, departureDate, returnDate, cabinClass, tripType } = params

    const queryParams = new URLSearchParams({
      from: fromname,
      to: toname,
      departureDate: departureDate,
      flightClass: cabinClass.toLowerCase(),
    })

    if (tripType === "round-trip" && returnDate) {
      queryParams.append("returnDate", returnDate)
    }

    console.log(queryParams.toString())
    const response = await axios.get(baseURL+`flights?${queryParams.toString()}`)
    return response.data
  } catch (error) {
    console.error("Error fetching flights:", error)
    throw new Error("Failed to fetch flights. Please try again.")
  }
}


export async function FetchTicketDetails(params: any) {
  try {
    const { id } = params;

    
    const queryParams = new URLSearchParams({ id: id });

    console.log(queryParams.toString());

    const response = await axios.get(`${baseURL}flights/${id}`);

    

    return response.data;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw new Error("Failed to fetch flights. Please try again.");
  }
}



export async function FetchFlightBookings() {
  try {
  

    
  
    const response = await axios.get(`${baseURL}flightbooking`);

    

    return response.data;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw new Error("Failed to fetch flights. Please try again.");
  }
}


export async function GetUpcomingFlightBookings() {
  try {

     const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(baseURL + "flightbooking/user/upcoming",  {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw new Error("Failed to fetch flights. Please try again.");
  }
}
export async function GetPastFlightBookings() {
  try {

     const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(baseURL + "flightbooking/user/past",  {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw new Error("Failed to fetch flights. Please try again.");
  }
}




export async function IssuePNRFlightBookings(id:string,pnrNumber:string,BookingStatus:string) {
  try {

     const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.patch(baseURL + `flightbooking/${id}`,{
pnrNumber:pnrNumber,
bookingStatus:BookingStatus,
    } , {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw new Error("Failed to fetch flights. Please try again.");
  }
}

export const DeleteFlightTicket = async (id:string)=>
{
 try {

     const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.delete(baseURL + `flights/${id}`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw new Error("Failed to fetch flights. Please try again.");
  }
}



export const GetFlightTicekt = async (id:string)=>
{
 try {

     const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(baseURL + `flights/${id}`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw new Error("Failed to fetch flights. Please try again.");
  }
}

export async function FlightBookingbyAgent(id:string) {
  try {
  

    
  
 const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;

    const response = await axios.get(baseURL + `flightbooking/agent/${id}`, {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      }
    });
    

    return response.data;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw new Error("Failed to fetch flights. Please try again.");
  }
}