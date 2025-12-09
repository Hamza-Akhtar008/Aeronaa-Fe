import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GetCars } from "@/lib/api"
import { formatPrice } from "@/lib/utils/currency"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"
import { Star } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const countries = [
  { name: "Dubai", active: true },
  { name: "Pakistan", active: false },
  { name: "Saudi Arabia", active: false },
  { name: "United Kingdom", active: false },
  { name: "Oman", active: false },
]

const cars = [
  {
    name: "Toyota Corolla",
    image: "/images/car1.png",
    rating: 4,
    reviews: 84,
    price: "59,548",
  },
  {
    name: "Ford Explorer",
    image: "/images/car2.png",
    rating: 3,
    reviews: 84,
    price: "59,548",
  },
  {
    name: "Tesla Model 3",
    image: "/images/car3.png",
    rating: 3,
    reviews: 84,
    price: "59,548",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  )
}
interface Car {
  id: string;
  make: string;
  model: string;
  location: string;
  dailyRate: string;
  images: string[];  // Assuming images are an array of URLs or paths to images
}
export function BookYourRide() {
  const [cars, setcars] = useState<Car[]>([]);
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

  useEffect(() => {
    const getcar = async () => {
      const response = await GetCars();
      console.log(response);
      setcars(response);
    }
    getcar();
  }, [])
  return (
    <div className=" w-full mx-auto bg-[#edfaff] p-8 mb-10 rounded-lg">
      {/* Header Section */}
      <div className="mb-8">
          <h1 className="  text-black mb-4 text-[32px] font-bold">Book Your Ride</h1>
        <div className="flex flex-wrap gap-6 text-sm text-black">
          <span
            className="border-b-2 border-[#d1d8da]"
            style={{ borderBottomStyle: 'dashed', borderBottomWidth: '2px', borderBottomColor: '#d1d8da', borderImage: 'repeating-linear-gradient(to right, #d1d8da 0, #d1d8da 4px, transparent 4px, transparent 8px) 1' }}
          >
            Official Partner of Global Rail Operators
          </span>
          <span
            className="border-b-2 border-[#d1d8da]"
            style={{ borderBottomStyle: 'dashed', borderImage: 'repeating-linear-gradient(to right, #d1d8da 0, #d1d8da 4px, transparent 4px, transparent 8px) 1' }}
          >
            Cheap Ride in Europe and Asia
          </span>
          <span
            className="border-b-2 border-[#d1d8da]"
            style={{ borderBottomStyle: 'dashed', borderImage: 'repeating-linear-gradient(to right, #d1d8da 0, #d1d8da 4px, transparent 4px, transparent 8px) 1' }}
          >
            Multiple Currencies Accepted
          </span>


        </div>
      </div>



      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Car Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cars && cars.slice(0, 3).map((car) => {
            const dropoffDate = new Date();
            dropoffDate.setDate(dropoffDate.getDate() + 1); // Set dropoffDate to tomorrow

            return (
              <Link
                key={car.id}
                href={`/car-detail/${car.id}?pickupLocation=${encodeURIComponent(car.location)}&dropoffLocation=${encodeURIComponent(car.location)}&pickupDate=${encodeURIComponent(new Date().toISOString().split('T')[0])}&dropoffDate=${encodeURIComponent(dropoffDate.toISOString().split('T')[0])}&driverAge=${encodeURIComponent(30)}&pickupTime=${"10:00"}&dropoffTime=${"10:00"}`}
              >
                <Card className="overflow-hidden bg-white rounded-xl shadow-lg transition-transform transform hover:scale-105">
                  <div className="aspect-[4/3] bg-white rounded-t-xl overflow-hidden">
                    <img
                      src={car.images[0] || "/placeholder.svg"}
                      alt={car.make}
                      className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">{car.make} {car.model}</h3>
                    <p className="text-sm text-gray-500 mb-2">Location: {car.location}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <StarRating rating={Math.floor(Math.random() * 2) + 3 || 0} />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="font-bold text-black">
                        {Math.floor(Math.random() * (1200 - 200 + 1)) + 200} reviews
                      </span>
                      <span className="font-semibold text-lg ">
                        From{" "}
                        {formatPrice(
                          parseInt(car.dailyRate) * (exchangeRates[selectedCurrency] || 1),
                          selectedCurrency
                        )}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>

            );
          })}

        </div>

        {/* Promotional Sidebar */}
        <div className="lg:col-span-1 flex justify-center h-full">
          <Card className="flex flex-col h-full justify-center items-center p-3 gap-4 sm:gap-5 w-full max-w-xs sm:w-[274px] sm:h-full h-auto bg-gradient-to-b from-[#042E67] to-[#5BA1FF] rounded-[22px] overflow-hidden text-white border-0">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src="/images/car4.png"
                alt="Scenic road"
                className="w-full h-full object-cover p-2 rounded-[22px]"
              />
            </div>
            <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 w-full text-center">
              <h3 className="text-lg sm:text-xl font-semibold leading-tight">Cheap car rentals across the world</h3>
              <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 sm:py-3">Go now</Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
