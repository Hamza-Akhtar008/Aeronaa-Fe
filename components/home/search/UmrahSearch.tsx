"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Send, CalendarIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { debouncedFetchMunicipalities } from "@/components/Flight-helper"
import AsyncSelect from "react-select/async"
import { Label } from "recharts"
interface PropertySearchInputs {
  packageType: string
  numberOfDays: string
  From: string
}

type PropertySearchFilterProps = {
  initialValues?: Partial<PropertySearchInputs>
  onChange?: (values: PropertySearchInputs) => void
}

const packageTypes = ["Economy", "Standard", "Luxury", "VIP"]

export default function PropertySearchFilter({ onChange }: PropertySearchFilterProps) {
  const router = useRouter()
  const [formValues, setFormValues] = useState<PropertySearchInputs>({
    packageType: "",
    numberOfDays: "",
    From: "",
  })

  const [showCalendar, setShowCalendar] = useState(false)
  const [loading, setloading] = useState(true)

  const handleChange = (field: keyof PropertySearchInputs, value: string | Date | null) => {
    setFormValues((prev) => {
      const next = { ...prev, [field]: value }
      if (onChange) onChange(next)
      return next
    })
  }

  useEffect(() => {
    const storedResults = sessionStorage.getItem("propertysearch")
    setloading(true)

    if (storedResults) {
      const parsedResults = JSON.parse(storedResults)

      setFormValues({
        packageType: parsedResults.packageType || "",
        numberOfDays: parsedResults.numberOfDays || "",
        From: parsedResults.From ? parsedResults.From : null,
      })
    }
    setloading(false)
  }, [])

  const handleSearch = (e: FormEvent) => {
    const query = new URLSearchParams({
      packageType: formValues.packageType,
      numberOfDays: formValues.numberOfDays,
      city: formValues.From ? formValues.From : "",
    }).toString()

    sessionStorage.setItem(
      "propertysearch",
      JSON.stringify({
        packageType: formValues.packageType,
        numberOfDays: formValues.numberOfDays,
        city: formValues.From ? formValues.From : null,
      }),
    )

    router.push(`/Umrah?${query}`)
  }

  if (loading == true) {
    return <></>
  }

  return (
    <div className="w-full flex">
      <div className="w-full  text-black">
        <form className="w-full">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-3">
            <div className="flex-1 min-w-0 relative">
              <label
                htmlFor="package"
                className="absolute left-2 top-2 z-10 origin-[0] transform -translate-y-4 scale-75 cursor-text select-none bg-white px-2 text-md text-gray-500 duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500"
              >
                Package Type
              </label>
              <Select value={formValues.packageType} onValueChange={(val) => handleChange("packageType", val)}>
                <SelectTrigger
                  id="package"
                  className="peer w-full h-14 pl-3 pr-10 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-md"
                >
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {packageTypes.map((pkg) => (
                    <SelectItem key={pkg} value={pkg}>
                      {pkg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-0 relative">
              <label
                htmlFor="days"
                className="absolute left-2 top-2 z-10 origin-[0] transform -translate-y-4 scale-75 cursor-text select-none bg-white px-2 text-md text-gray-500 duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500"
              >
                Number of Days
              </label>
              <Input
                id="days"
                type="number"
                placeholder="Enter number of days"
                value={formValues.numberOfDays}
                onChange={(e) => handleChange("numberOfDays", e.target.value)}
                className="peer w-full h-14 pl-3 pr-10 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-md"
                min="1"
              />
            </div>

            <div className="flex-1 min-w-0 relative">
              <Label >Departure City (Search) *</Label>
              <AsyncSelect
                id="departureCity"
                cacheOptions
                defaultOptions
                loadOptions={debouncedFetchMunicipalities}
                value={formValues.From ? { label: formValues.From, value: formValues.From } : null}
                onChange={(option: any) => handleChange("From", option?.value || "")}
                placeholder="Search departure city..."
                className="react-select-container"

                classNamePrefix="react-select"
                isClearable
              />
              {/* {errors.departureCity && <p className="text-sm text-red-500">{errors.departureCity}</p>} */}
            </div>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end mt-3 pt-3 gap-2">
          <Button
            type="submit"
            className="bg-[#0a3a7a] hover:bg-blue-700 text-white px-4 py-2 font-medium text-xs w-full sm:w-auto"
            onClick={handleSearch}
          >
            <Send className="w-3 h-3 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
