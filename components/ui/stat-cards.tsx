import React from "react"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils/utils"

export type Trend = "up" | "down" | "neutral" | "none"

export type StatCardProps = {
  title: string
  value: string | number | React.ReactNode
  unit?: string
  change?: {
    value: number
    trend: Trend
    formatter?: (value: number) => React.ReactNode
    icon?: React.ReactNode
  }
  icon?: React.ReactNode
  illustration?: React.ReactNode
  className?: string
  ariaLabel?: string
}

export function StatCard({
  title,
  value,
  unit,
  change,
  icon,
  illustration,
  className,
  ariaLabel,
}: StatCardProps) {
  const defaultIcons = {
    up: <ArrowUp className="mr-1 h-4 w-4" />,
    down: <ArrowDown className="mr-1 h-4 w-4" />,
    neutral: <Minus className="mr-1 h-4 w-4" />,
    none: null,
  }

  const getChangeContent = () => {
    if (!change) return null

    const trendClass = {
      up: "text-lime-300",
      down: "text-red-300",
      neutral: "text-gray-200",
      none: "text-gray-200",
    }[change.trend]

    const iconToShow = change.icon ?? defaultIcons[change.trend]

    let formattedValue: React.ReactNode
    if (change.formatter) {
      formattedValue = change.formatter(change.value)
    } else {
      const sign = change.trend === "up" ? "+" : ""
      formattedValue = (
        <>
          {sign}
          {change.value}
          {unit}
        </>
      )
    }

    return (
      <div
        className={cn(
          "flex items-center text-sm font-semibold tracking-wide",
          trendClass
        )}
        aria-label={`${change.trend} change`}
      >
        {iconToShow}
        {formattedValue}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]",
       
        className
      )}
      aria-label={ariaLabel ?? `${title} statistic card`}
      role="region"
    >
      {/* Gradient border glow effect */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />

      {/* Inner content */}
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            {icon && <span className="text-gray-600">{icon}</span>}
          <h4 className="text-sm sm:text-base font-semibold text-blue-800 tracking-wide whitespace-nowrap">
  {title}
</h4>

          </div>
          <p className="text-3xl sm:text-5xl font-extrabold text-blue-900 leading-tight">
            {value}
            {typeof value === "string" || React.isValidElement(value) ? null : unit}
          </p>
          {getChangeContent()}
        </div>
        {illustration && (
          <div className="h-20 w-20 text-white/40">{illustration}</div>
        )}
      </div>
    </div>
  )
}
