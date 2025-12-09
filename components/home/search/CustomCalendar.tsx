"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface CustomCalendarProps {
  checkIn?: string
  checkOut?: string
  onDateSelect: (checkIn: string, checkOut: string) => void
  onClose: () => void
}

export function CustomCalendar({ checkIn, checkOut, onDateSelect, onClose }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | null>(checkIn ? new Date(checkIn) : null)
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | null>(checkOut ? new Date(checkOut) : null)
  const [isSelectingCheckOut, setIsSelectingCheckOut] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Normalize date to avoid time-related issues
  const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [isMobile])

  const today = normalizeDate(new Date())

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startingDayOfWeek = firstDay.getDay()
    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) days.push(null)
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day))
    }
    return days
  }

  const handleDateClick = (date: Date) => {
    const clickedDate = normalizeDate(date)
    if (clickedDate < today) return

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut && !isSelectingCheckOut)) {
      setSelectedCheckIn(clickedDate)
      setSelectedCheckOut(null)
      setIsSelectingCheckOut(true)
    } else if (isSelectingCheckOut) {
      if (clickedDate <= selectedCheckIn) {
        setSelectedCheckIn(clickedDate)
        setSelectedCheckOut(null)
      } else {
        setSelectedCheckOut(clickedDate)
        setIsSelectingCheckOut(false)
        const formatDateForAPI = (d: Date) =>
          `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`
        const checkInStr = formatDateForAPI(selectedCheckIn)
        const checkOutStr = formatDateForAPI(clickedDate)
        setTimeout(() => {
          onDateSelect(checkInStr, checkOutStr)
        }, 100)
      }
    }
  }

  const isDateInRange = (date: Date) => {
    if (!selectedCheckIn || !selectedCheckOut) return false
    const d = normalizeDate(date)
    return d >= normalizeDate(selectedCheckIn) && d <= normalizeDate(selectedCheckOut)
  }

  const isDateSelected = (date: Date) => {
    const d = normalizeDate(date)
    return (
      (selectedCheckIn && d.getTime() === normalizeDate(selectedCheckIn).getTime()) ||
      (selectedCheckOut && d.getTime() === normalizeDate(selectedCheckOut).getTime())
    )
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      newMonth.setMonth(direction === "prev" ? prev.getMonth() - 1 : prev.getMonth() + 1)
      return newMonth
    })
  }

  const renderMonth = (monthDate: Date) => {
    const days = getDaysInMonth(monthDate)
    return (
      <div className={`flex-1 min-w-0 ${isMobile ? 'px-2' : ''}`}>
        <div className={`flex items-center justify-between mb-3 ${isMobile ? 'px-1' : ''}`}>
          <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-lg' : 'text-base'}`}>
            {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
          </h3>
          {isMobile && (
            <div className="flex items-center gap-1">
              <Button
                onClick={() => navigateMonth("prev")}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => navigateMonth("next")}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className={`text-center font-medium text-gray-500 py-2 ${isMobile ? 'text-sm' : 'text-xs'}`}>
              {isMobile ? day.slice(0, 2) : day.slice(0, 3)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) =>
            date ? (
              <button
                key={date.getTime()}
                type="button"
                onClick={() => handleDateClick(date)}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  handleDateClick(date)
                }}
                disabled={date < today}
                className={`
                  flex items-center justify-center text-sm font-medium rounded-lg transition-colors duration-200 touch-manipulation
                  ${isMobile ? 'text-base h-12 w-12 text-lg' : 'h-9 w-9 text-sm'}
                  ${date < today ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100 cursor-pointer"}
                  ${isDateSelected(date) ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                  ${isDateInRange(date) && !isDateSelected(date) ? "bg-blue-50 text-blue-600" : ""}
                  ${normalizeDate(date).getTime() === today.getTime() && !isDateSelected(date) ? "bg-gray-100 font-semibold" : ""}
                  ${isMobile ? 'active:scale-95' : ''}
                `}
              >
                {date.getDate()}
              </button>
            ) : (
              <div key={index} className={`${isMobile ? 'h-12 w-12' : 'h-9 w-9'}`} />
            )
          )}
        </div>
      </div>
    )
  }

  const nextMonth = new Date(currentMonth)
  nextMonth.setMonth(currentMonth.getMonth() + 1)

  const formatDateRange = () => {
    if (selectedCheckIn && selectedCheckOut) {
      const checkInFormatted = selectedCheckIn.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short' 
      })
      const checkOutFormatted = selectedCheckOut.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short' 
      })
      return `${checkInFormatted} — ${checkOutFormatted}`
    }
    return "Select dates"
  }

  return (
    <>
      {isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[999]" onClick={onClose} />
      )}
      <div
        className={`
          bg-white rounded-lg shadow-lg border border-gray-200 z-[1000]
          ${isMobile ? "fixed inset-0 m-0 flex flex-col w-full h-full max-h-screen" : "relative w-auto"}
          ${isMobile ? "overflow-y-auto" : ""}
        `}
        style={isMobile ? {maxWidth: '100vw', maxHeight: '100vh'} : {}}
      >
        {/* Header */}
        <div className={`flex items-center justify-between py-3 px-4 border-b border-gray-200 ${isMobile ? 'min-h-[60px] sticky top-0 bg-white z-10' : ''}`}>
          {!isMobile && (
            <div className="flex items-center gap-2 bg-blue-900">
              <Button
                onClick={() => navigateMonth("prev")}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </Button>
            </div>
          )}
          <div className="text-center flex-1">
            <span className={`font-medium text-gray-600 ${isMobile ? 'text-lg' : 'text-sm'}`}>{formatDateRange()}</span>
          </div>
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
            <Button
              onClick={() => navigateMonth("next")}
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${isMobile ? 'hover:bg-gray-100' : 'bg-blue-900 rounded-none'}`}
            >
              <ChevronRight className={`h-4 w-4 ${isMobile ? 'text-gray-600' : 'text-white'}`} />
            </Button>
          </div>
        </div>

        {/* Calendar Body */}
        <div className={`py-4 px-4 flex-1 ${isMobile ? 'overflow-y-auto pb-20' : 'overflow-y-auto'}`}>
          {isMobile ? (
            <div className="flex flex-col gap-6">
              <div>{renderMonth(currentMonth)}</div>
              <div className="border-t border-gray-200 pt-6">{renderMonth(nextMonth)}</div>
            </div>
          ) : (
            <div className="flex gap-4 min-w-[600px]">
              {renderMonth(currentMonth)}
              <div className="w-px bg-gray-200" />
              {renderMonth(nextMonth)}
            </div>
          )}
        </div>

        {/* Mobile Footer */}
        {isMobile && selectedCheckIn && selectedCheckOut && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{formatDateRange()}</span>
              </div>
              <Button
                onClick={() => {
                  const format = (d: Date) =>
                    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`
                  onDateSelect(format(normalizeDate(selectedCheckIn)), format(normalizeDate(selectedCheckOut)))
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium"
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
