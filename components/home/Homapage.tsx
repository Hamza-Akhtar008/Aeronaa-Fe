"use client";
import {
  HeroSection,
  PopularDestinations,
  ThingsToDo,
  PopularRestaurants,
  Footer
} from "@/components/home"
import HotDeals from "@/components/home/HotDeals";

import { GetHotels } from "@/lib/api";

import { SigninSiteHeader } from "@/components/signin-header"
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HotelCard from "@/components/home/HotelCard";
import Ads from "@/components/home/Ads";
import { Reviews } from "@/components/home/landingreview";
import AppDownloadSection from "@/components/home/appdownload";
import TravelBookingPage from "@/components/home/allservicessection";
import { BookYourRide } from "@/components/home/featureride";
import { BookYourFlight } from "@/components/home/featureplane";
import { BookYourProperty } from "@/components/home/FeaturedProperties";
import { OffersSection } from "@/components/home/offersection";
import { useHeroTab } from "./HeroTabContext";
import TopTredingDestination from "./TopTredingDestination";
import { FeaturePropertyMain } from "./FeaturedProperty";
import { FeatureUmrah } from "./FeaturedUmrah";



export default function Homepage() {
  const [Hotels, setHotels] = useState<any[]>([]);
  const exploreRef = useRef(null) //
  const hotelsContainerRef = useRef<HTMLDivElement>(null);
  const { activeTab, setActiveTab, heroRef } = useHeroTab();
  useEffect(() => {
  // Only fetch geolocation if the user hasn't manually set a country/currency yet
  const storedCountry = sessionStorage.getItem("userCountry") || localStorage.getItem("userCountry");
  const storedCurrency = sessionStorage.getItem("currency") || localStorage.getItem("currency");

  if (!storedCountry && !storedCurrency) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        getCountryFromCoords(latitude, longitude);
      },
      error => {
        console.error("Error getting location:", error);
      }
    );
  } else {
    console.log("Skipping geolocation: user already has country/currency set");
  }
}, []);

async function getCountryFromCoords(lat: number, lng: number) {
  const apiKey = "AIzaSyBCit9qsp_C6ePD126N1h6avxnQ7EH9xGU";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const result =
      data.results.find((r: any) => r.types.includes("country")) || data.results[0];

    if (!result) return;

    const countryComponent = result.address_components.find((component: any) =>
      component.types.includes("country")
    );

    if (!countryComponent) return;

    const countryName = countryComponent.long_name;
    const countryCode = countryComponent.short_name;

    // Set only if not already stored
    if (!sessionStorage.getItem("userCountry")) {
      sessionStorage.setItem("userCountry", countryName);
      sessionStorage.setItem("usercountry", countryName);
    }

    // You can also set a default currency once
    if (!sessionStorage.getItem("currency")) {
      const defaultCurrency = countryCode === "PK" ? "PKR" : "USD";
      sessionStorage.setItem("currency", defaultCurrency);
    }

  } catch (err) {
    console.error("Reverse geocoding failed:", err);
  }
}


  useEffect(() => {
    sessionStorage.removeItem("flightSearchParams");
    sessionStorage.removeItem("propertysearch");
  }, []);
  const scrollLeft = () => {
    if (hotelsContainerRef.current) {
      hotelsContainerRef.current.scrollBy({
        left: -300, // Adjust this value to control the scroll distance
        behavior: "smooth", // Smooth scroll
      });
    }
  };

  const scrollRight = () => {
    if (hotelsContainerRef.current) {
      hotelsContainerRef.current.scrollBy({
        left: 300, // Adjust this value to control the scroll distance
        behavior: "smooth", // Smooth scroll
      });
    }
  };
  return (


      <main ref={heroRef}  className="bg-[#fafbfc]">
        {/* <SigninSiteHeader /> */}

        <section className="w-full relative  m-0 p-0">

          <HeroSection />

        </section>
        <div className="w-full flex flex-col  px-4 md:px-0 lg:px-0">
          {/* Hero Section */}

          {/* Offers Section */}
         {(activeTab === "hotels" || activeTab === "flights" || activeTab === "cars") && (
  <section  className="w-full max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4 mt-[1rem] sm:mt-[2rem] mb-8">
    <OffersSection exploreRef={exploreRef} />
  </section>
)}


{activeTab=="hotels"&&
  <div ref={exploreRef} className="w-full  max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4">
            <BookYourProperty />
          </div>
}
        
        {activeTab=="flights"&&
  <div ref={exploreRef} className="w-full max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4">
           <BookYourFlight />
          </div>
}

  
        {activeTab=="cars"&&
  <div ref={exploreRef} className="w-full max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4">
           <BookYourRide />
          </div>
}
    
{activeTab=="property"&&
  <div ref={exploreRef} className="w-full  max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-12">
            <FeaturePropertyMain />
          </div>
}
      
{activeTab=="umrah"&&
  <div ref={exploreRef} className="w-full  max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-12">
            <FeatureUmrah />
          </div>
}
      


          {/* Travel Booking Page
          <section className="w-full  max-w-[98rem]   mx-auto px-2 sm:px-4 lg:px-6 pt-4">
            <TravelBookingPage />
          </section> */}

          {/* App Download Section */}
        </div>

        <AppDownloadSection />
        {activeTab=="hotels"&&
        
   <section className="w-full max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4">

<TopTredingDestination/>
   </section>
        }
        {/* Reviews Section */}
        <section className="w-full max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4">
          <Reviews />
        </section>
      </main>

  )
}
