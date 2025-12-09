"use client";
import { HeroTabProvider } from "@/components/home/HeroTabContext";
import Homepage from "@/components/home/Homapage";

export default function HomePage() {
  return (
    <HeroTabProvider>
      <Homepage />
    </HeroTabProvider>
  );
}