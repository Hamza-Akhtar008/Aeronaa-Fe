"use client";
import { formatPrice } from '@/lib/utils/currency';
import { getCurrencyByLocation } from '@/lib/utils/location-currency';
import { baseURL } from '@/lib/utils/utils';
import { useAuth } from '@/store/authContext';
import { loadStripe } from '@stripe/stripe-js';
import React, { use, useEffect, useState } from 'react';

export interface CarBookingFormProps {
  carId: string;
  carName: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  pickUpTime: string;
  dropoffTime: string;

  dailyRate: number;
  duration: number;
  fees: number;
  amount: number;
  onSuccess: () => void;
  user?: { name: string; email: string; phone?: string };
  hideUserFields?: boolean;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_live_51RNDLyLaGWi6LnLvHm4QpTVVre3bPTAmyIHFG6v6fDRsGzicvlKTkgOR5KxuqDpstIU08FicT115Ym9RVBmiOiXR00DqkkZGcf",
)

export default function CarBookingForm({
  carId,
  carName,
  pickupLocation,
  dropoffLocation,
  pickupDate,
  dropoffDate,
  dropoffTime,
  onSuccess,
  user,
  hideUserFields = false,
  pickUpTime,
  amount,
  ...rest
}: CarBookingFormProps & { [key: string]: any }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const {auth}=useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
      const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 });
    
      // Detect country and currency from localStorage/sessionStorage
      useEffect(() => {
        let country = localStorage.getItem("userCountry") || localStorage.getItem("usercountry") || sessionStorage.getItem("userCountry") || sessionStorage.getItem("usercountry");
        if (country) {
          const currency = getCurrencyByLocation(country);
          setSelectedCurrency(currency);
        } else {
          setSelectedCurrency("USD");
        }
      }, []);
    
      // Fetch exchange rates for selected currency
      useEffect(() => {
        if (selectedCurrency === "USD") {
          setExchangeRates({ USD: 1 });
          return;
        }
        const fetchRates = async () => {
          try {
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
            const data = await response.json();
            setExchangeRates({ ...data.rates, USD: 1 });
          } catch (error) {
            setExchangeRates({ USD: 1 });
          }
        };
        fetchRates();
      }, [selectedCurrency]);
    
  
  // Update form when user data changes
  React.useEffect(() => {
    if (user) {
      setForm(prevForm => ({
        ...prevForm,
        name: user.name || prevForm.name,
        email: user.email || prevForm.email,
        phone: user.phone || prevForm.phone
      }));
    }
  }, [user]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


const handleBooking = async () => {
    try {
       const bookingData = {
  name:form.name,
  email:  form.email,
  phoneNo: form.phone,
  pickUplocation: pickupLocation,
  dropOffLocation: dropoffLocation,
  // Merge pickupDate + pickUpTime -> full datetime
  pickUpTime: `${pickupDate}T${pickUpTime}`,
  // Merge dropoffDate + pickUpTime (or you may have a separate dropOffTime field)
  returnTime: `${dropoffDate}T${dropoffTime}`,
  carRental: {
    id: carId,
  },
  amount: Math.round(amount),
}
  sessionStorage.setItem("CarBooking", JSON.stringify(bookingData))
    

      const successUrl = `${window.location.origin}/success-car`
      const cancelUrl = `${window.location.origin}/cancel-car`
      console.log("successUrl : ", successUrl)
      console.log("cancelUrl : ", cancelUrl)

      

      const stripe = await stripePromise
      console.log("Stripe initialized:", stripe)

      const randomBookingId = Math.floor(Math.random() * 1000000)
      

      const requestBody = {
        amount: Math.ceil(amount * 100),
        currency: "usd",
        successUrl,
        cancelUrl,
        customerEmail: form.email,
              bookingId: randomBookingId,
      }

      console.log("Request body:", requestBody)

      const res = await fetch(baseURL + "bookings/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await res.json()
      console.log("Backend response:", data)

      if (!data.url) {
        throw new Error("Stripe session URL not found")
      }

      window.location.href = data.url
    } catch (error) {
      console.error("Stripe Checkout Error:", error)
   
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Import dynamically to avoid issues with localStorage during SSR
    
      handleBooking();
      // Ensure user data is properly included in the submission
        // Flatten the structure to avoid nested object issues
      
    } catch (err: any) {
      setError(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {error && <div className="text-red-600">{error}</div>}
      {hideUserFields ? (
        <div className="mb-4 text-center text-gray-700 font-medium">
          Please <span className="text-blue-600 underline cursor-pointer" onClick={() => window.location.href = `/signin?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`}>Sign In</span> or <span className="text-green-600 underline cursor-pointer" onClick={() => window.location.href = `/register?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`}>Register</span> to continue booking.
        </div>
      ) : (
        <>
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
             
              readOnly={auth?.role !== "agent"}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
         
               readOnly={auth?.role !== "agent"}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
             
               readOnly={auth?.role !== "agent"}
            />
          </div>
          <div className="mt-4">
            <span className="font-semibold">Total Amount:</span>
            <span className="ml-2 text-lg text-blue-700 font-bold">${amount ? amount.toLocaleString() : '0'}

                {formatPrice(amount  * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}
            </span>
          </div>
        </>
      )}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
        disabled={loading || hideUserFields}
      >
        {loading ? 'Booking...' : 'Book Car'}
      </button>
    </form>
  );
}
