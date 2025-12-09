import axios from "axios"
import { baseURL } from "./utils/utils"
import { Role } from "./UsersEnum"




export async function GenerateInvoice(payload: {
  startDate: Date
  endDate: Date
  vendorId: number
  role: string
}) {
  try {

     let response ;
     if(payload.role=="vendor")
     {
 response = await fetch(baseURL+"hotel-invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
     }
     else

      {
 response = await fetch(baseURL+"invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      }
    
   
    return response.json()
  } catch (error) {
    console.error("Error generating invoice:", error)
    throw error
  }
}

export async function GetVendorInvoices(id:number) {
  try {
    const response = await fetch(baseURL+`invoice/vendor/${id}`)
    return response.json()
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return []
  }
}



export async function Markaspaid(invoiceId: number) {
 try {
   const authString = localStorage.getItem("auth");
    const token = authString ? JSON.parse(authString) : null;
    const response = await fetch(baseURL+`invoice/${invoiceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" ,
           Authorization: `Bearer ${token?.access_token}`,
      },
      body: JSON.stringify({
        isPaid: true,
        paidAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) throw new Error("Failed to update invoice")
    return await response.json()
  } catch (error) {
    console.error("Error marking invoice as paid:", error)
    throw error
  }
}


export async function GetHotelInvoices(id:number) {
  try {
    const response = await fetch(baseURL+`hotel-invoice/${id}`)
    return response.json()
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return []
  }
}



export async function PatchInvoiceStatus(id: number, data: Record<string, any>) {
  try {
    const response = await fetch(baseURL+`hotel-invoice/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to update invoice ${id}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating invoice:", error)
    throw error
  }
}