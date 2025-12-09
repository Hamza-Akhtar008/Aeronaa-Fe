"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  minDate?: Date
}

export function DateTimePicker({
  date,
  setDate,
  placeholder = "Pick a date and time",
  className,
  disabled = false,
  minDate = new Date(),
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const [selectedTime, setSelectedTime] = React.useState<string>(
    date ? format(date, "HH:mm") : "09:00"
  )

  React.useEffect(() => {
    setSelectedDate(date)
    if (date) setSelectedTime(format(date, "HH:mm"))
  }, [date])

  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate)
    if (newDate) {
      const [hours, minutes] = selectedTime.split(":")
      const dateTime = new Date(newDate)
      dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
      setDate(dateTime)
    } else {
      setDate(undefined)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    if (selectedDate) {
      const [hours, minutes] = time.split(":")
      const dateTime = new Date(selectedDate)
      dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
      setDate(dateTime)
    }
  }

  // Generate time options every 30 minutes
  const timeOptions = React.useMemo(() => {
    const options: string[] = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        options.push(
          `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        )
      }
    }
    return options
  }, [])

  return (
    <div
      className={cn(
        "flex flex-row gap-x-2 w-full",
        className
      )}
    >
      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full h-12 flex-1 justify-start text-left border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-900 font-normal px-4",
              !selectedDate && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 z-[9999] overflow-visible"
          align="start"
          forceMount
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => disabled || (minDate && date < minDate)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Time Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full h-12 flex-1 justify-start text-left border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-900 font-normal px-4"
            )}
            disabled={disabled || !selectedDate}
          >
            <Clock className="mr-2 h-4 w-4" />
            {selectedTime ? <span>{selectedTime}</span> : <span>Pick a time</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 z-[9999] overflow-visible"
          align="start"
          forceMount
        >
          <div className="max-h-60 overflow-y-auto p-1">
            <Select value={selectedTime} onValueChange={handleTimeSelect}>
              <SelectTrigger className="w-full border-[#00b4d8]/20 focus:border-[#00b4d8] focus:ring-[#00b4d8]">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
