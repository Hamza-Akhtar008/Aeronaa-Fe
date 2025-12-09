"use client"
import { Button } from "@/components/ui/button"
import { useHeroTab } from "./HeroTabContext";

interface OffersSectionProps {
  exploreRef: React.RefObject<HTMLElement>|null;
}

export function OffersSection({ exploreRef }: OffersSectionProps) {
  const { activeTab, setActiveTab, heroRef } = useHeroTab();

    const scrollToExplore = () => {
    if (exploreRef?.current) {
      const topOffset = exploreRef.current.offsetTop-150; // adjust offset
      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
    }
  };
  // Scroll-to-top function


  return (
<section className="w-full px-4 sm:px-6 lg:px-8 py-6">
  {/* Section Header */}
  <div className="mb-6 text-center sm:text-left">
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2">
      {activeTab === "cars" ? "Rental Car Offers" : "Offers"}
    </h2>
    <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto sm:mx-0">
      {activeTab === "cars"
        ? "Exclusive deals, discounts, and special promotions on car rentals"
        : "Promotions, deals and special offers for you"}
    </p>
  </div>

  {/* Offers Grid */}
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-8 items-stretch">
    {/* Holiday Rentals / Flights / Cars */}
    <div className="relative w-full h-[250px] sm:h-[220px] md:h-[260px] border border-gray-400/60 rounded-[15px] overflow-hidden">
      {/* Background Image */}
      <img
        src={
          activeTab === "hotels"
            ? "/images/offer1.png"
            : activeTab === "flights"
            ? "/images/flightoffer2.png"
            : "/images/caroffer1.png"
        }
        alt="Holiday rental poolside"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-6 text-white">
        <div>
          <p className="text-xs sm:text-sm font-medium mb-1 opacity-90">
            {activeTab === "flights"
              ? "Fly in Holidays"
              : activeTab === "hotels"
              ? "Holiday Rentals"
              : "Luxury Car Rentals"}
          </p>

          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 leading-snug">
            {activeTab === "hotels"
              ? "Live the dream in a holiday home"
              : activeTab === "flights"
              ? "Fly your dream destination"
              : "Drive your dream ride on holiday"}
          </h3>

          <p className="text-xs sm:text-sm opacity-90 max-w-md">
            {activeTab === "hotels"
              ? "Choose from houses, villas, chalets and more"
              : activeTab === "flights"
              ? "Search flights and destinations to your favorite spots"
              : "Find cars and places to hire in top destinations"}
          </p>
        </div>

        <Button
          onClick={scrollToExplore}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium text-sm sm:text-base w-fit"
        >
          Book Yours
        </Button>
      </div>
    </div>

    {/* Quick Escape Card */}
    <div className="flex flex-col md:flex-row border border-gray-400/60 rounded-[15px] overflow-hidden h-auto md:h-[260px]">
      {/* Text Content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-2 leading-snug">
            Quick escape, quality time
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-3">
            {activeTab === "hotels"
              ? "Save up to 20% with a Getaway Deal"
              : activeTab === "flights"
              ? "Save up to 20% on your next flight"
              : "Save up to 20% on car rentals"}
          </p>
        </div>
        <Button
          onClick={scrollToExplore}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium text-sm sm:text-base w-fit"
        >
          Book Yours
        </Button>
      </div>

      {/* Image */}
      <div className="w-full md:w-48 lg:w-56 h-48 md:h-auto">
        <img
          src={
            activeTab === "hotels"
              ? "/images/offer2.png"
              : activeTab === "flights"
              ? "/images/flightoffer.png"
              : "/images/caroffer2.png"
          }
          alt="Offer visual"
          className="w-full h-full object-cover md:rounded-none rounded-b-[15px] md:rounded-r-[15px]"
        />
      </div>
    </div>
  </div>
</section>

  );
}
