import React, { useState } from 'react';
import { X, Car, MapPin, Calendar, User, DollarSign } from 'lucide-react';
import { getBookingSummary } from '@/lib/carRentalApi';

interface CarBookingModalProps {
  car: any;
  searchParams: {
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: string;
    dropoffDate: string;
    pickupTime: string;
    dropoffTime: string;
    driverAge: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingData: any) => void;
}

const CarBookingModal: React.FC<CarBookingModalProps> = ({
  car,
  searchParams,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    driverLicense: ''
  });

  const calculateDays = () => {
    const pickup = new Date(searchParams.pickupDate);
    const dropoff = new Date(searchParams.dropoffDate);
    const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const totalDays = calculateDays();
  const basePrice = car.price || car.rate || car.dailyRate || 0;
  const totalPrice = basePrice * totalDays;
  const taxes = totalPrice * 0.1; // 10% tax estimate
  const finalTotal = totalPrice + taxes;

  const handleGetBookingSummary = async () => {
    if (!car.id || !car.search_key) {
      console.warn('Missing required data for booking summary');
      return;
    }

    setLoading(true);
    try {
      const summary = await getBookingSummary({
        vehicle_id: car.id,
        search_key: car.search_key,
        currency_code: 'USD'
      });
      setBookingData(summary);
    } catch (error) {
      console.error('Error getting booking summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = () => {
    const fullBookingData = {
      car,
      searchParams,
      customerInfo,
      pricing: {
        basePrice,
        totalDays,
        totalPrice,
        taxes,
        finalTotal
      },
      bookingData
    };
    onConfirm(fullBookingData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Complete Your Booking</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Car Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start gap-4">
              <img
                src={car.image || '/images/card.jpg'}
                alt={car.name || 'Car'}
                className="w-24 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{car.name || car.title || 'Car'}</h3>
                <p className="text-gray-600">{car.supplier || 'Rental Provider'}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {car.seats || 4} seats
                  </span>
                  <span className="flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    {car.transmission || 'Manual'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium">Pickup</div>
                  <div className="text-sm text-gray-600">{searchParams.pickupLocation}</div>
                  <div className="text-sm text-gray-600">{searchParams.pickupDate} at {searchParams.pickupTime}</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium">Return</div>
                  <div className="text-sm text-gray-600">{searchParams.dropoffLocation}</div>
                  <div className="text-sm text-gray-600">{searchParams.dropoffDate} at {searchParams.dropoffTime}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Driver Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={customerInfo.firstName}
                onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={customerInfo.lastName}
                onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
              <input
                type="text"
                placeholder="Driver License Number"
                value={customerInfo.driverLicense}
                onChange={(e) => setCustomerInfo({...customerInfo, driverLicense: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2 md:col-span-2"
              />
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>${basePrice}/day × {totalDays} day{totalDays > 1 ? 's' : ''}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleGetBookingSummary}
              disabled={loading}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-md font-medium disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Get Booking Details'}
            </button>
            <button
              onClick={handleConfirmBooking}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarBookingModal;
