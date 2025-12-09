"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const TRAVELER_TYPES = [
  { key: "adults", label: "Adults", desc: "11>", min: 1, max: 9 },
  { key: "children", label: "Children", desc: "2-11", min: 0, max: 9 },
  { key: "infants", label: "Infants on lap", desc: "under 2", min: 0, max: 9 },
]

const CABIN_CLASSES = ["Economy", "PremiumEconomy", "Business", "First"]

export default function TravelersDropdown({ value, onChange, cabinClass, onCabinClassChange }: any) {
  const [open, setOpen] = useState(false)
  const [counts, setCounts] = useState(value || { adults: 1, children: 0, infants: 0 })
  const [selectedCabin, setSelectedCabin] = useState(cabinClass || "Economy")

  const handleCount = (key: string, delta: number) => {
    setCounts((prev: any) => {
      const next = {
        ...prev,
        [key]: Math.max(
          TRAVELER_TYPES.find((t) => t.key === key)?.min || 0,
          Math.min((prev[key] || 0) + delta, TRAVELER_TYPES.find((t) => t.key === key)?.max || 9),
        ),
      }
      if (key === "adults" && next[key] < 1) next[key] = 1
      return next
    })
  }

  const handleCabinClass = (cls: string) => {
    setSelectedCabin(cls)
    onCabinClassChange && onCabinClassChange(cls)
  }

  const handleApply = () => {
    setOpen(false)
    onChange && onChange(counts)
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        className="w-full text-left !overflow-hidden !truncate !whitespace-nowrap !px-0 h-auto py-0"
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className="block truncate text-xs sm:text-sm max-w-[100px] xs:max-w-[120px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px] overflow-hidden whitespace-nowrap text-ellipsis"
          title={`Travelers, ${selectedCabin}`}
        >
          {`Travelers, ${selectedCabin}`}
        </span>
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 sm:hidden" onClick={() => setOpen(false)} />
          <div className="absolute right-0 sm:right-auto sm:left-0 z-50 mt-2 w-[280px] xs:w-[320px] sm:w-[350px] bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 text-black max-h-[80vh] overflow-y-auto">
            <div className="max-h-72 overflow-y-auto pr-2">
              <div className="font-bold mb-3 text-sm sm:text-base">Travelers</div>
              {TRAVELER_TYPES.map((t) => (
                <div key={t.key} className="flex items-center justify-between py-2 sm:py-3">
                  <div>
                    <div className="font-medium text-sm sm:text-base">
                      {t.label} <span className="text-xs text-gray-400">{t.desc}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 sm:h-9 sm:w-9 text-sm bg-transparent"
                      onClick={() => handleCount(t.key, -1)}
                      disabled={counts[t.key] === t.min || (t.key === "adults" && counts[t.key] <= 1)}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center text-sm sm:text-base">{counts[t.key] || 0}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 sm:h-9 sm:w-9 text-sm bg-transparent"
                      onClick={() => handleCount(t.key, 1)}
                      disabled={counts[t.key] === t.max}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <hr className="my-4" />
            <div className="font-bold mb-3 text-sm sm:text-base">Cabin Class</div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {CABIN_CLASSES.map((cls) => (
                <Button
                  key={cls}
                  type="button"
                  variant={selectedCabin === cls ? "outline" : "ghost"}
                  className={`text-xs sm:text-sm ${selectedCabin === cls ? "border-black" : ""}`}
                  onClick={() => handleCabinClass(cls)}
                >
                  {cls}
                </Button>
              ))}
            </div>
            <Button type="button" className="w-full mt-2 text-sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
