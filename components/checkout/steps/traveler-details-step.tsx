"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { BookingFormData, Ticket } from "@/types/checkout"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface TravelerDetailsStepProps {
  formData: BookingFormData
  onInputChange: (travelerIndex: number, field: string, value: string) => void
  ticket: Ticket
}

export default function TravelerDetailsStep({
  formData,
  onInputChange,
  ticket
}: TravelerDetailsStepProps) {
  // Local state for each traveler’s date fields
  const [dates, setDates] = useState(
    formData.travelers.map((t) => ({
      dateOfBirth: t.dateOfBirth ? new Date(t.dateOfBirth) : undefined,
      passportExpiry: t.passportExpiry ? new Date(t.passportExpiry) : undefined
    }))
  )

  const handleDateChange = (index: number, field: "dateOfBirth" | "passportExpiry", date?: Date) => {
    const newDates = [...dates]
    newDates[index][field] = date
    setDates(newDates)
    if (date) onInputChange(index, field, date.toISOString())
  }

  return (
    <div className="space-y-6">
      {formData.travelers.map((traveler, index) => (
        <div key={index} className="space-y-6 border rounded-lg p-6 bg-gray-50">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Traveler {index + 1} - {traveler.type.charAt(0).toUpperCase() + traveler.type.slice(1)}
            </h3>

            {/* --- PERSONAL INFO --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor={`firstName-${index}`}>First Name*</Label>
                <Input
                  id={`firstName-${index}`}
                  value={traveler.firstName}
                  onChange={(e) => onInputChange(index, "firstName", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor={`middleName-${index}`}>Middle Name</Label>
                <Input
                  id={`middleName-${index}`}
                  value={traveler.middleName ?? ""}
                  onChange={(e) => onInputChange(index, "middleName", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor={`lastName-${index}`}>Last Name*</Label>
                <Input
                  id={`lastName-${index}`}
                  value={traveler.lastName}
                  onChange={(e) => onInputChange(index, "lastName", e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Date of Birth Picker */}
              <div>
                <Label htmlFor={`dateOfBirth-${index}`}>Date of Birth*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`mt-1 w-full justify-start text-left font-normal ${
                        !dates[index]?.dateOfBirth && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dates[index]?.dateOfBirth
                        ? format(dates[index].dateOfBirth, "MM-dd-yyyy")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dates[index]?.dateOfBirth}
                      onSelect={(selectedDate) =>
                        handleDateChange(index, "dateOfBirth", selectedDate)
                      }
                      disabled={(day) => day > new Date()} // 🚫 future dates
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* --- GENDER --- */}
            <div className="mb-6">
              <Label>Gender*</Label>
              <RadioGroup
                value={traveler.gender}
                onValueChange={(value) => onInputChange(index, "gender", value)}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id={`male-${index}`} />
                  <Label htmlFor={`male-${index}`}>Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id={`female-${index}`} />
                  <Label htmlFor={`female-${index}`}>Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id={`other-${index}`} />
                  <Label htmlFor={`other-${index}`}>Other</Label>
                </div>
              </RadioGroup>
            </div>

            {/* --- CONTACT INFO --- */}
            {(traveler.type !== "infant" && traveler.type !== "toddler") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor={`email-${index}`}>Email*</Label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    value={traveler.email ?? ""}
                    onChange={(e) => onInputChange(index, "email", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`phone-${index}`}>Phone Number*</Label>
                  <div className="flex mt-1">
                    <Select defaultValue="+92">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">+1</SelectItem>
                        <SelectItem value="+92">+92</SelectItem>
                        <SelectItem value="+971">+971</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id={`phone-${index}`}
                      value={traveler.phone ?? ""}
                      onChange={(e) => onInputChange(index, "phone", e.target.value)}
                      className="flex-1 ml-2"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- PASSPORT INFO --- */}
          <div>
            <h4 className="font-semibold mb-4">Passport Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor={`passportNumber-${index}`}>Passport Number*</Label>
                <Input
                  id={`passportNumber-${index}`}
                  value={traveler.passportNumber ?? ""}
                  onChange={(e) => onInputChange(index, "passportNumber", e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Passport Expiry Picker */}
              <div>
                <Label htmlFor={`passportExpiry-${index}`}>Passport Expiration Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`mt-1 w-full justify-start text-left font-normal ${
                        !dates[index]?.passportExpiry && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dates[index]?.passportExpiry
                        ? format(dates[index].passportExpiry, "MM-dd-yyyy")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dates[index]?.passportExpiry}
                      onSelect={(selectedDate) =>
                        handleDateChange(index, "passportExpiry", selectedDate)
                      }
                      disabled={(day) => day < new Date()} // 🚫 past dates
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor={`issuingCountry-${index}`}>Issuing Country*</Label>
                <Select
                  value={traveler.issuingCountry ?? ""}
                  onValueChange={(value) => onInputChange(index, "issuingCountry", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Pakistan">Pakistan</SelectItem>
                    <SelectItem value="UAE">UAE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`nationality-${index}`}>Nationality*</Label>
                <Select
                  value={traveler.nationality ?? ""}
                  onValueChange={(value) => onInputChange(index, "nationality", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Pakistani">Pakistani</SelectItem>
                    <SelectItem value="Emirati">Emirati</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Checkbox id={`redressNumber-${index}`} />
              <Label htmlFor={`redressNumber-${index}`}>I have a Redress Number</Label>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
