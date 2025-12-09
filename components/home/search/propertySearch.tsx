"use client"

import { useEffect, useState, type FormEvent } from "react"
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete"
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react" // simple accessible dropdown
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Send } from "lucide-react"
import { useRouter } from "next/navigation"

interface PropertySearchInputs {
  location: string
  propertyType: string
}

type PropertySearchFilterProps = {
  initialValues?: Partial<PropertySearchInputs>
  onChange?: (values: PropertySearchInputs) => void
}

export default function PropertySearchFilter({

  onChange,
}: PropertySearchFilterProps) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<PropertySearchInputs>({
    location: "",
    propertyType: "",
  })

  const [loading, setloading] = useState(true);
  // Google Places Hook
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["(cities)"], // restrict to cities
    },
    debounce: 300,
  })

  const handleChange = (field: keyof PropertySearchInputs, value: string) => {
    setFormValues((prev) => {
      const next = { ...prev, [field]: value }
      if (onChange) onChange(next)
      return next
    })
  }
  useEffect(() => {
    const storedResults = sessionStorage.getItem("propertysearch");
    setloading(true);

    if (storedResults) {

      const parsedResults = JSON.parse(storedResults);

      const validTypes = ["sale", "rent"];
      const type = validTypes.includes(parsedResults.propertyType)
        ? parsedResults.propertyType
        : "";

      setFormValues({
        location: parsedResults.location || "",
        propertyType: parsedResults.propertyType,
      });

      setValue(parsedResults.location || "", false);

    }
    setloading(false);
  }, [setValue]);

  const handleSelect = async (val: string) => {
    setValue(val, false)
    clearSuggestions()
    handleChange("location", val)
  }

  const handleSearch = (e: FormEvent) => {

    const query = new URLSearchParams({
      location: formValues.location,
      propertyType: formValues.propertyType,
    }).toString()
    sessionStorage.setItem("propertysearch",
      JSON.stringify({
        location: formValues.location,
        propertyType: formValues.propertyType,
      })

    )
    router.push(`/property-search?${query}`)

  }
  if (loading == true) {
    return <></>
  }
  return (
    <div className="w-full flex">
      <div className="w-full  text-black">
        <form className="w-full">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-3">
            {/* Location with Autocomplete */}
            <div className="flex-1 min-w-0 relative">


              <label
                htmlFor="location"
                className="absolute left-2 top-2 z-10 origin-[0] transform -translate-y-4 scale-75 cursor-text select-none bg-white px-2 text-md text-gray-500 duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500"
              >
                Location
              </label>
              <Combobox value={formValues.location} onChange={handleSelect}>
                <ComboboxInput
                  id="location"
                  as={Input}
                  placeholder="Enter city"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value)
                    handleChange("location", e.target.value)
                  }}
                  disabled={!ready}
                  className="peer w-full h-14 pl-3 pr-10 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-md"
                />
                {status === "OK" && (
                  <ComboboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white text-sm shadow-lg">
                    {[
                      ...new Map(
                        data.map((suggestion) => {
                          const city =
                            suggestion.terms?.[0]?.value ||
                            suggestion.structured_formatting?.main_text ||
                            suggestion.description.split(",")[0]

                          return [city.toLowerCase(), city] // use lowercase for uniqueness
                        })
                      ).values(),
                    ].map((city, index) => (
                      <ComboboxOption
                        key={index}
                        value={city}
                        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                      >
                        {city}
                      </ComboboxOption>
                    ))}

                  </ComboboxOptions>
                )}
              </Combobox>
            </div>

            {/* Property Type */}
            <div className="flex-1 min-w-0 relative">

              <label
                htmlFor="type"
                className="absolute left-2 top-2 z-10 origin-[0] transform -translate-y-4 scale-75 cursor-text select-none bg-white px-2 text-md text-gray-500 duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500"
              >
                Search Type
              </label>

              <Select

                value={formValues.propertyType}
                onValueChange={(val) => handleChange("propertyType", val)}
              >
                <SelectTrigger id="type" className="peer w-full h-14 pl-3 pr-10 border border-gray-300 rounded-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-md">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  <SelectItem value="sale">Buy</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>

                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}

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
