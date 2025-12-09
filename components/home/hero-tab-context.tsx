"use client"

import type React from "react"

import { createContext, useContext, useRef, useState, type ReactNode } from "react"

type HeroTabType = "hotels" | "flights" | "cars" | "property"

interface HeroTabContextType {
  activeTab: HeroTabType
  setActiveTab: (tab: HeroTabType) => void
  heroRef: React.RefObject<HTMLDivElement>
}

const HeroTabContext = createContext<HeroTabContextType | undefined>(undefined)

export function HeroTabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<HeroTabType>("hotels")
  const heroRef = useRef<HTMLDivElement>(null)

  return <HeroTabContext.Provider value={{ activeTab, setActiveTab, heroRef }}>{children}</HeroTabContext.Provider>
}

export function useHeroTab() {
  const context = useContext(HeroTabContext)
  if (context === undefined) {
    throw new Error("useHeroTab must be used within a HeroTabProvider")
  }
  return context
}
