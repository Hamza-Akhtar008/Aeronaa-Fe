import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import DetailTopWorld from "./DetailTopWorld";

const TopWorld = () => {
  const images = [
    { src: "/images/one.png", alt: "Hotel Image 1" },
    { src: "/images/two.jpg", alt: "Hotel Image 2" },
    { src: "/images/three.jpg", alt: "Hotel Image 3" },
    { src: "/images/four.jpg", alt: "Hotel Image 4" },
  ];

  return (
    <div className="flex flex-col">
      <div className="max-w-9xl px-2 sm:px-4 md:px-8 py-4 md:py-8">
        <div className="space-y-3 sm:space-y-4 md:space-y-6 pt-4 md:pt-8 mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#023e8a]">
            Top - World
          </h1>

          <p className="text-lg text-gray-600">
            When you think of a hotel that checks all the boxes (outstanding
            service, comfy rooms, the works) it's probably one of these winning
            spots.
          </p>

          <p className="text-base text-gray-600 pb-16 border-b-2 border-[#023e8a]">
            The Travelers' Choice Awards Best of the Best title celebrates the
            highest level of excellence in travel. It's awarded to those who
            receive a high volume of above-and-beyond reviews and opinions from
            the Tripadvisor community over a 12-month period. Out of our 8
            million listings, fewer than 1% achieve this milestone.
          </p>
        </div>

        <div className="mt-6 sm:mt-8 md:mt-14">
          <Carousel className="w-full relative">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-[500px]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-lg"
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex h-[44px] w-[44px] border-2 border-[#023e8a] hover:bg-[#023e8a] hover:text-white transition-colors rounded-full absolute top-1/2 -translate-y-1/2 left-4" />
            <CarouselNext className="hidden md:flex h-[44px] w-[44px] border-2 border-[#023e8a] hover:bg-[#023e8a] hover:text-white transition-colors rounded-full absolute top-1/2 -translate-y-1/2 right-4" />
          </Carousel>
        </div>
        <div>
            <DetailTopWorld/>
        </div>
      </div>
    </div>
  );
};

export default TopWorld;
