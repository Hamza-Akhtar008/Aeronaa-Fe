import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GetPropertyall } from "@/lib/property_api";
import { formatPrice } from "@/lib/utils/currency";
import { getCurrencyByLocation } from "@/lib/utils/location-currency";
import { Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  );
}

interface Property {
  id: number;
  title: string;
  description: string;
  listingType: string;
  propertyType: string;
  city: string;
  province: string;
  country: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  builtUpArea: number;
  yearBuilt: number;
  furnishingStatus: string;
  condition: string;
  images: string[];
  user: {
    name: string;
    phone: string;
    email: string;
  };
}

export function FeaturePropertyMain() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 });

  // Detect user's country/currency
  useEffect(() => {
    let country =
      localStorage.getItem("userCountry") ||
      sessionStorage.getItem("userCountry");
    if (country) {
      const currency = getCurrencyByLocation(country);
      setSelectedCurrency(currency);
    }
  }, []);

  // Fetch exchange rates dynamically
  useEffect(() => {
    if (selectedCurrency === "USD") {
      setExchangeRates({ USD: 1 });
      return;
    }
    const fetchRates = async () => {
      try {
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        const data = await res.json();
        setExchangeRates({ ...data.rates, USD: 1 });
      } catch {
        setExchangeRates({ USD: 1 });
      }
    };
    fetchRates();
  }, [selectedCurrency]);

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      const response = await GetPropertyall();
      console.log(response);
      setProperties(response);
    };
    fetchProperties();
  }, []);

  return (
    <div className="w-full mx-auto bg-[#edfaff] p-8 mb-10 rounded-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-black mb-4 text-[32px] font-bold">Featured Properties</h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Property Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.slice(0, 3).map((property) => (
            <Link key={property.id} href={`/property-search/detail/${property.id}`}>
              <Card className="overflow-hidden bg-white rounded-xl shadow-lg transition-transform transform hover:scale-105">
                <div className="aspect-[4/3] bg-white rounded-t-xl overflow-hidden">
                  <img
                    src={property.images?.[0] || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {property.description}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {property.city}, {property.province}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={Math.floor(Math.random() * 2) + 3} />
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="font-medium text-gray-500">
                      {property.bedrooms} Beds • {property.bathrooms} Baths
                    </span>
                    <span className="font-semibold text-lg text-black">
                      {formatPrice(
                        property.price * (exchangeRates[selectedCurrency] || 1),
                        selectedCurrency
                      )}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 flex justify-center h-full">
          <Card className="flex flex-col h-full justify-center items-center p-3 gap-5 w-full max-w-xs bg-gradient-to-b from-[#042E67] to-[#5BA1FF] rounded-[22px] overflow-hidden text-white border-0">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src="/images/propertybackground.png"
                alt="Featured Property"
                className="w-full h-full object-cover p-2 rounded-[22px]"
              />
            </div>
            <div className="p-4 flex flex-col gap-4 w-full text-center">
              <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                Explore Premium Properties
              </h3>
              <Button className="w-full bg-white text-blue-900 hover:bg-gray-100 font-medium py-2 sm:py-3">
                View More
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
