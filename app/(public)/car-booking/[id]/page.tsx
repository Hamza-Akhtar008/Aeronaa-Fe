'use client'
import { useRouter, useSearchParams } from  'next/navigation'// On mount: try to get from query params, else from localStorage

import * as React from 'react';
import CarBookingForm from '@/components/forms/CarBookingForm';
import { useAuth } from '@/store/authContext';
import Link from 'next/link';
import { FetchUser } from '@/lib/api';
import { getCurrencyByLocation } from '@/lib/utils/location-currency';
import { formatPrice } from '@/lib/utils/currency';

// Helper function to format user info for the booking form
function formatUserInfoForBooking(userInfo: any) {
  if (!userInfo) return undefined;
  return {
    name: userInfo.name || '',
    email: userInfo.email || '',
    phone: userInfo.phone || '',
    address: userInfo.address || '',
    // Add any other fields that the booking form expects
  };
}

export default function CarBookingPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const { auth } = useAuth();
  const [userInfo, setUserInfo] = React.useState<any>(null);
  const carId = React.use(params).id;
   const [selectedCurrency, setSelectedCurrency] = React.useState("USD");
      const [exchangeRates, setExchangeRates] = React.useState<Record<string, number>>({ USD: 1 });
    
      // Detect country and currency from localStorage/sessionStorage
      React.useEffect(() => {
        let country = localStorage.getItem("userCountry") || localStorage.getItem("usercountry") || sessionStorage.getItem("userCountry") || sessionStorage.getItem("usercountry");
        if (country) {
          const currency = getCurrencyByLocation(country);
          setSelectedCurrency(currency);
        } else {
          setSelectedCurrency("USD");
        }
      }, []);
    
      // Fetch exchange rates for selected currency
      React.useEffect(() => {
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
    

  // Fetch user info when auth changes
  React.useEffect(() => {
    const fetchUserInfo = async () => {
      if (auth?.id) {
        try {
          const userData = await FetchUser(auth.id.toString());
          setUserInfo(userData);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };
    fetchUserInfo();
  }, [auth?.id]);

  // --- Booking Info State ---
  const [bookingInfo, setBookingInfo] = React.useState({
    carName: '',
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    dropoffDate: '',
    pickUpTime: '10:00', // Default pickup time
    dropoffTime:"10:00",
    dailyRate: '',
    duration: '',
    fees: '',
    totalPrice: '',
  });

  // On mount: try to get from query params, else from localStorage
    React.useEffect(() => {

       
    const info = {
      carName: searchParams?.get('carName') || '',
      pickupLocation: searchParams?.get('pickupLocation') || '',
      dropoffLocation: searchParams?.get('dropoffLocation') || '',
      pickupDate: searchParams?.get('pickupDate') || '',
      dropoffDate: searchParams?.get('dropoffDate') || '',
      pickUpTime: searchParams?.get('pickUpTime') || '10:00', // Default to 10:00 AM if not provided
      dailyRate: searchParams?.get('dailyRate') || '',
    dropoffTime:searchParams?.get('dropoffTime') || '10:00', 
      duration: searchParams?.get('duration') || '',
      fees: searchParams?.get('fees') || '',
      totalPrice: searchParams?.get('totalPrice') || '',
    };
    // If any value is missing, try to restore from localStorage
    const hasAll = Object.values(info).every(v => v);
    if (hasAll) {
      setBookingInfo(info);
      localStorage.setItem('carBookingInfo', JSON.stringify(info));
    } else {
      const stored = localStorage.getItem('carBookingInfo');
      if (stored) {
        try {
          setBookingInfo(JSON.parse(stored));
        } catch {}
      }
    }
  }, [searchParams]);

  // Format for display
  const dailyRate = bookingInfo.dailyRate && !isNaN(Number(bookingInfo.dailyRate)) ? `${Number(bookingInfo.dailyRate).toLocaleString()}` : bookingInfo.dailyRate;
  const duration = bookingInfo.duration && !isNaN(Number(bookingInfo.duration)) ? `${bookingInfo.duration} day${bookingInfo.duration === '1' ? '' : 's'}` : bookingInfo.duration;
  const fees = bookingInfo.fees && !isNaN(Number(bookingInfo.fees)) ? `${Number(bookingInfo.fees).toLocaleString()}` : bookingInfo.fees;
  const totalPrice = bookingInfo.totalPrice && !isNaN(Number(bookingInfo.totalPrice)) ? `${Number(bookingInfo.totalPrice).toLocaleString()}` : bookingInfo.totalPrice;

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-0 overflow-hidden">
        {/* Booking Summary */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-[#f8fafc] to-[#e0f2fe] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-[#024891] mb-2">Booking Summary</h2>
            <div className="text-gray-700 mb-1"><span className="font-semibold">Car:</span> {bookingInfo.carName}</div>
            <div className="text-gray-700 mb-1"><span className="font-semibold">Pickup:</span> {bookingInfo.pickupLocation}</div>
            <div className="text-gray-700 mb-1"><span className="font-semibold">Dropoff:</span> {bookingInfo.dropoffLocation}</div>
            <div className="text-gray-700 mb-1"><span className="font-semibold">Pickup Date:</span> {bookingInfo.pickupDate}</div>
            <div className="text-gray-700 mb-1"><span className="font-semibold">Pickup Time:</span> {bookingInfo.pickUpTime}</div>
            <div className="text-gray-700 mb-1"><span className="font-semibold">Dropoff Date:</span> {bookingInfo.dropoffDate}</div>
            <div className="mt-4 border-t pt-4 space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">Daily Rate</span><span className="font-medium">
                     {formatPrice((Number.parseInt(dailyRate)) * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Duration</span><span className="font-medium">{duration}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Fees & Taxes</span><span className="font-medium">
                 {formatPrice((Number.parseInt(fees)) * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}</span></div>
              <div className="flex justify-between font-bold text-lg mt-2"><span>Total</span><span className="text-[#024891]">
                     {formatPrice((Number.parseInt(totalPrice)) * (exchangeRates[selectedCurrency] || 1), selectedCurrency)}
                </span></div>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start md:items-end">
            <span className="text-green-700 font-semibold text-sm mt-4 md:mt-0">Free cancellation up to 24 hours before pick-up</span>
          </div>
        </div>
        {/* Booking Form Section */}
        <div className="px-8 py-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Complete Your Booking</h2>
          {!auth ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-700 text-base mb-2">Please sign in or register to continue booking:</p>
              <div className="flex gap-4">
                <Link href={`/signin?redirect=/car-booking/${carId}?carName=${encodeURIComponent(bookingInfo.carName)}&pickupLocation=${encodeURIComponent(bookingInfo.pickupLocation)}&dropoffLocation=${encodeURIComponent(bookingInfo.dropoffLocation)}&pickupDate=${encodeURIComponent(bookingInfo.pickupDate)}&dropoffDate=${encodeURIComponent(bookingInfo.dropoffDate)}&pickUpTime=${encodeURIComponent(bookingInfo.pickUpTime)}&dailyRate=${encodeURIComponent(bookingInfo.dailyRate)}&duration=${encodeURIComponent(bookingInfo.duration)}&fees=${encodeURIComponent(bookingInfo.fees)}&totalPrice=${encodeURIComponent(bookingInfo.totalPrice)}`} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">Sign In</Link>
                <Link href={`/register?redirect=/car-booking/${carId}?carName=${encodeURIComponent(bookingInfo.carName)}&pickupLocation=${encodeURIComponent(bookingInfo.pickupLocation)}&dropoffLocation=${encodeURIComponent(bookingInfo.dropoffLocation)}&pickupDate=${encodeURIComponent(bookingInfo.pickupDate)}&dropoffDate=${encodeURIComponent(bookingInfo.dropoffDate)}&pickUpTime=${encodeURIComponent(bookingInfo.pickUpTime)}&dailyRate=${encodeURIComponent(bookingInfo.dailyRate)}&duration=${encodeURIComponent(bookingInfo.duration)}&fees=${encodeURIComponent(bookingInfo.fees)}&totalPrice=${encodeURIComponent(bookingInfo.totalPrice)}`} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium">Register</Link>
              </div>
            </div>
          ) : (
            <CarBookingForm
                carId={carId}
                carName={bookingInfo.carName}
                pickupLocation={bookingInfo.pickupLocation}
                dropoffLocation={bookingInfo.dropoffLocation}
                pickupDate={bookingInfo.pickupDate}
                dropoffDate={bookingInfo.dropoffDate}
          dropoffTime={bookingInfo.dropoffTime}
                user={formatUserInfoForBooking(userInfo)}
                hideUserFields={false}
                pickUpTime={bookingInfo.pickUpTime}
                dailyRate={Number(bookingInfo.dailyRate) || 0}
                duration={Number(bookingInfo.duration) || 0}
                fees={Number(bookingInfo.fees) || 0}
                amount={Number(bookingInfo.totalPrice.replace('$', '').replace(',', '')) || 115}
                onSuccess={() => { }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
