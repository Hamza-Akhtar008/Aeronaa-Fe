import { Button } from "@/components/ui/button"
import { useHeroTab } from "./HeroTabContext";
import { Send } from 'lucide-react';
import { set } from "date-fns";


export default function TravelBookingPage() {

  const { setActiveTab, heroRef } = useHeroTab();

  const handleShowTab = (tab: HeroTab) => {
    setActiveTab(tab);
    setTimeout(() => {
      heroRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  //  const handleShowFlights = () => {
  //   setActiveTab("flights");
  //   setTimeout(() => {
  //     heroRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }, 50); // slight delay to ensure tab is set
  // };

  return (
    <div className="  w-full max-w-[98rem] mx-auto mb-4 mt-4 px-2 sm:px-4 lg:px-6 pt-4 ">
      <div className=" mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* Flights Card */}
          <div className="relative h-72 rounded-2xl overflow-hidden group cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('/images/flightmain.png')` }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative h-full flex flex-col justify-center items-center p-6 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Flights</h2>
              <p className="text-md mb-4 opacity-90">
                Search Flights & Places Hire to our most popular destinations
              </p>
              <Button
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 w-fit flex items-center"
                onClick={() => handleShowTab("flights")}
              >
                <Send className="w-4 h-4 mr-2" />
                Show Flights
              </Button>
            </div>
          </div>

          {/* Hotels Card */}
          <div className="relative h-72 rounded-2xl overflow-hidden group cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('/images/Hotellanding.png')` }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative h-full flex flex-col justify-center items-center p-6 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Hotels</h2>
              <p className="text-md mb-4 opacity-90">
                Search hotels & Places Hire to our most popular destinations
              </p>
              <Button
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 w-fit flex items-center"
                onClick={() => handleShowTab("hotels")}
              >
                <Send className="w-4 h-4 mr-2" />
                Show Hotels
              </Button>
            </div>
          </div>

          {/* Car Rentals Card */}
          <div className="relative h-72 rounded-2xl overflow-hidden group cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('/images/Carrentallanding.png')` }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative h-full flex flex-col justify-center items-center p-6 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Car Rentals</h2>
              <p className="text-md mb-4 opacity-90">
                Search Flights & Places Hire to our most popular destinations
              </p>
              <Button
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 w-fit flex items-center"
                onClick={() => handleShowTab("cars")}
              >
                <Send className="w-4 h-4 mr-2" />
                Show Car Rentals
              </Button>
            </div>
          </div>

          {/* Umrah Card */}
          <div className="relative h-72 rounded-2xl overflow-hidden group cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('/images/Carrentallanding.png')` }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative h-full flex flex-col justify-center items-center p-6 text-white text-center bg-gradient-to-b from-[#042E67] to-[#5BA1FF] rounded-lg">
              <h2 className="text-3xl font-bold mb-4">Find Your Perfect Property</h2>
              <p className="text-md mb-4 opacity-90">
                Discover a wide range of properties available for rent or sale in prime locations.

              </p>
              <Button
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 w-fit flex items-center"
                onClick={() => handleShowTab("property")}
              >
                <Send className="w-4 h-4 mr-2" />
                Show Properties
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>

  )
}
