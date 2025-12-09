"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ExploreMore = () => {
  const categories = [
    {
      title: "Restaurants",
      image: "/images/one.png",
      href: "/restaurants",
    },
    {
      title: "Beaches",
      image: "/images/two.jpg",
      href: "/beaches",
    },
    {
      title: "Things to Do",
      image: "/images/three.jpg",
      href: "/things-to-do",
    },
    {
      title: "Destinations",
      image: "/images/four.jpg",
      href: "/destinations",
    },
     {
      title:"Hotels",
      image: "/images/three.jpg",
      href: "/destinations",
    },
  ];

  return (
    <div className="flex flex-col px-4 md:px-8 py-8 md:py-12">
      <div className="space-y-8">
        <div className="relative flex items-center">
          <h2 className="text-3xl text-[#023e8a] md:text-3xl font-bold whitespace-nowrap">
            Explore more Travelers&apos; Choice categories
          </h2>
          <div className="flex-1 h-[2px] bg-[#023e8a] ml-4" />
        </div>

        <div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {categories.map((category, index) => (
                <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <Link href={category.href}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg group">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                        <h3 className="text-white text-2xl font-bold">{category.title}</h3>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex h-[44px] w-[44px] border-2 border-[#023e8a] hover:bg-[#023e8a] hover:text-white transition-colors rounded-full absolute left-4" />
            <CarouselNext className="hidden md:flex h-[44px] w-[44px] border-2 border-[#023e8a] hover:bg-[#023e8a] hover:text-white transition-colors rounded-full absolute right-4" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default ExploreMore;
