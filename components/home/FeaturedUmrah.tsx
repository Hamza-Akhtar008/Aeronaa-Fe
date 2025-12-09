"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GetUmrahPakage, GetUmrahPakageall } from "@/lib/umrah_api";
import { formatPrice } from "@/lib/utils/currency";
import { getCurrencyByLocation } from "@/lib/utils/location-currency";
import { Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Rating Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// Umrah Package Type
interface UmrahPackage {
  id: number;
  packageName: string;
  duration: number;
  shortDescription: string;
  currency: string;
  singlePricing: number;
  doubleSharingPrice: number;
  coverImage: string;
  makkahHotelName: string;
  medinaHotelName: string;
  makkahStarRating: string;
  medinaStarRating: string;
  citiesCovered: string[];
}

export function FeatureUmrah() {
  const [packages, setPackages] = useState<UmrahPackage[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    USD: 1,
  });

  // Detect currency based on location
  useEffect(() => {
    let country =
      localStorage.getItem("userCountry") ||
      localStorage.getItem("usercountry") ||
      sessionStorage.getItem("userCountry") ||
      sessionStorage.getItem("usercountry");

    if (country) {
      const currency = getCurrencyByLocation(country);
      setSelectedCurrency(currency);
    }
  }, []);

  // Fetch exchange rates
  useEffect(() => {
    if (selectedCurrency === "USD") return;
    const fetchRates = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await response.json();
        setExchangeRates({ ...data.rates, USD: 1 });
      } catch {
        setExchangeRates({ USD: 1 });
      }
    };
    fetchRates();
  }, [selectedCurrency]);

  // Example data — you’ll later fetch from your API
  useEffect(() => {
    const fetchumrah = async()=>{
        const response = await GetUmrahPakageall();
        setPackages(response);
    }

fetchumrah();
  }, []);

  return (
    <div className="w-full mx-auto bg-[#edfaff] p-6 sm:p-8 mb-10 rounded-lg">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-[32px] font-bold text-black mb-3">
          Featured Umrah Packages
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Handpicked Umrah packages for a seamless spiritual journey.
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Package Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {packages.slice(0, 3).map((pkg) => (
            <Link key={pkg.id} href={`/Umrah/detailed/${pkg.id}`}>
              <Card className="overflow-hidden bg-white rounded-xl shadow-md transition-transform hover:scale-105 hover:shadow-lg">
                <div className="aspect-[4/3] bg-white overflow-hidden">
                  <img
                    src={pkg.coverImage}
                    alt={pkg.packageName}
                    className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {pkg.packageName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Duration: {pkg.duration} Days
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={4} />
                    <span className="text-gray-500 text-xs">(Top Rated)</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {pkg.shortDescription}
                  </p>

                  <div className="flex justify-between items-center text-sm font-medium text-gray-800">
                    <span>
                      From{" "}
                      {formatPrice(
                        pkg.doubleSharingPrice *
                          (exchangeRates[selectedCurrency] || 1),
                        selectedCurrency
                      )}
                    </span>
                    <Button
                      variant="default"
                      className="bg-blue-700 hover:bg-blue-800 text-white text-sm px-3 py-1.5 rounded-md"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Promotional Sidebar */}
        <div className="lg:col-span-1 flex justify-center h-full">
          <Card className="flex flex-col h-full justify-center items-center p-4 gap-5 bg-gradient-to-b from-[#042E67] to-[#5BA1FF] rounded-[22px] overflow-hidden text-white border-0">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src="/images/Umrah.jpg"
                alt="Umrah promotion"
                className="w-full h-full object-cover p-2 rounded-[22px]"
              />
            </div>
            <div className="text-center px-3">
              <h3 className="text-lg font-semibold mb-1">Best Umrah Packages</h3>
              <p className="text-sm opacity-90">
                Experience the journey of a lifetime with our curated Umrah
                offers.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
