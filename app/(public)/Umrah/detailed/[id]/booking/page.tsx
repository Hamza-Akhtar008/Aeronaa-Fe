"use client"

import React, { useEffect } from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, CreditCard, User, Phone, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { UmrahPackage } from "@/types/Umrah"
import { GetUmrahPakage } from "@/lib/umrah_api"
import { loadStripe } from "@stripe/stripe-js"
import { baseURL } from "@/lib/utils/utils"
import { getCurrencyByLocation } from "@/lib/utils/location-currency"
import { formatPrice } from "@/lib/utils/currency"

// Mock package data
const mockPackage = {
  id: 3,
  packageName: "Premium Umrah Experience",
  duration: 14,
  doubleSharingPrice: 2800,
  trippleSharingPrice: 2400,
  quadSharingPrice: 2100,
  discountPercent: 10,
  startDate: "2025-08-16T00:00:00.000Z",
  endDate: "2025-08-30T00:00:00.000Z",
}

interface PersonInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  passportNumber: string
  passportExpiry: string
  nationality: string
  gender: string
  specialRequests: string
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_live_51RNDLyLaGWi6LnLvHm4QpTVVre3bPTAmyIHFG6v6fDRsGzicvlKTkgOR5KxuqDpstIU08FicT115Ym9RVBmiOiXR00DqkkZGcf",
)
export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
    const { id } = React.use(params)
    const [pkg, setPackage] = useState<UmrahPackage | null>(null)


        const [selectedCurrency, setSelectedCurrency] = useState("USD");
              const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 });
            
              // Detect country and currency from localStorage/sessionStorage
              useEffect(() => {
                let country = localStorage.getItem("userCountry") || localStorage.getItem("usercountry") || sessionStorage.getItem("userCountry") || sessionStorage.getItem("usercountry");
                if (country) {
                  const currency = getCurrencyByLocation(country);
                  setSelectedCurrency(currency);
                } else {
                  setSelectedCurrency("USD");
                }
              }, []);
            
              // Fetch exchange rates for selected currency
              useEffect(() => {
                if (selectedCurrency === "USD") {
                  setExchangeRates({ USD: 1 });
                  return;
                }
                const fetchRates = async () => {
                  try {
                    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
                    const data = await response.json();
                    setExchangeRates({ ...data.rates, USD: 1 });
                  } catch (error) {
                    setExchangeRates({ USD: 1 });
                  }
                };
                fetchRates();
              }, [selectedCurrency]);
  
    // In real app, fetch package by ID
  
    useEffect(() => {
      const fetchpakage = async () => {
        const response = await GetUmrahPakage(id)
        setPackage(response)
      }
      fetchpakage()
    }, [])
  const [selectedSharing, setSelectedSharing] = useState<string>("")
  const [numberOfPersons, setNumberOfPersons] = useState<number>(1)
  const [persons, setPersons] = useState<PersonInfo[]>([
    {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      passportNumber: "",
      passportExpiry: "",
      nationality: "",
      gender: "",
      specialRequests: "",
    },
  ])
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)



  const sharingOptions = [
    { value: "single", label: "Single Sharing", price: pkg?.singlePricing, description: "1 persons per room" },

    { value: "double", label: "Double Sharing", price: pkg?.doubleSharingPrice, description: "2 persons per room" },
    { value: "triple", label: "Triple Sharing", price: pkg?.trippleSharingPrice, description: "3 persons per room" },
    { value: "quad", label: "Quad Sharing", price: pkg?.quadSharingPrice, description: "4 persons per room" },
  ]

  const updateNumberOfPersons = (num: number) => {
    setNumberOfPersons(num)
    const newPersons = [...persons]

    if (num > persons.length) {
      // Add new person objects
      for (let i = persons.length; i < num; i++) {
        newPersons.push({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          passportNumber: "",
          passportExpiry: "",
          nationality: "",
          gender: "",
          specialRequests: "",
        })
      }
    } else {
      // Remove excess persons
      newPersons.splice(num)
    }

    setPersons(newPersons)
  }

  const updatePersonInfo = (index: number, field: keyof PersonInfo, value: string) => {
    const newPersons = [...persons]
    newPersons[index] = { ...newPersons[index], [field]: value }
    setPersons(newPersons)
  }

  const calculateTotal = () => {
    const selectedOption = sharingOptions.find((option) => option.value === selectedSharing)
    if (!selectedOption) return 0

    const subtotal = (selectedOption.price||0) * numberOfPersons
    const discount = (pkg?.discountPercent||0) > 0 ? (subtotal * (pkg?.discountPercent||0)) / 100 : 0
    console.log("Subtotal:", subtotal, "Discount:", discount)
    return subtotal - discount
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    const stripe = await stripePromise
       console.log("Stripe initialized:", stripe)
 
       const randomBookingId = Math.floor(Math.random() * 1000000)
       const successUrl = `${window.location.origin}/Umrah/detailed/${id}/booking/success`
      const cancelUrl = `${window.location.origin}/Umrah/detailed/${id}/booking/cancel`;
        const selectedOption = sharingOptions.find((option) => option.value === selectedSharing)
    if (!selectedOption) return 0
 let price =  selectedOption.price||0;
  const localStorageData = {
      packageSelected: [
        {
          packageName: selectedSharing || "",
          price: price,
        },
      ],
      traveller: persons.map((p) => ({
        firstName: p.firstName,
        lastName: p.lastName || "",
        emailAddress: p.email || "",
        phoneNumber: p.phone || "",
        gender: p.gender || "",
        dateOfBirth: p.dateOfBirth || "",
        nationality: p.nationality || "",
        passportNumber: p.passportNumber || "",
        passportExpiryDate: p.passportExpiry || "",
        specialRequests: p.specialRequests || "",
      })),
      totalPrice: calculateTotal(),
      umrahPurchased: pkg?.id,
    };

    console.log(localStorageData);

     localStorage.setItem("umrahBooking", JSON.stringify(localStorageData));
       const requestBody = {
         amount:calculateTotal()*100,
         currency: "usd",
         successUrl,
         cancelUrl,
         customerEmail: persons[0].email,
         bookingId: randomBookingId,
       }
 
       console.log("Request body:", requestBody)
 
       const res = await fetch(baseURL + "bookings/checkout", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(requestBody),
       })
 
       const data = await res.json()
       console.log("Backend response:", data)
 
       if (!data.url) {
         throw new Error("Stripe session URL not found")
       }
  
    
     window.location.href = data.url

    // In real app, submit to API

    setIsSubmitting(false)
    // Redirect to confirmation page
    
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/Umrah/detailed/${pkg?.id}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Package Details
          </Link>
          <div className="backdrop-blur-md bg-white/70 p-6 rounded-2xl border border-white/20 shadow-xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Umrah Package</h1>
            <p className="text-gray-600">
              {pkg?.packageName} • {pkg?.duration} Days
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(pkg?.startDate||"")} - {formatDate(pkg?.endDate||"")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Selection */}
            <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Select Package Option
                </CardTitle>
                <CardDescription>Choose your preferred room sharing and number of travelers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Room Sharing Selection */}
                <div>
                  <Label className="text-base font-medium mb-4 block">Room Sharing Type</Label>
                  <RadioGroup value={selectedSharing} onValueChange={setSelectedSharing}>
                    {sharingOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50/50 backdrop-blur-sm bg-white/30 border-blue-200/50"
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <div className="flex-1">
                          <Label htmlFor={option.value} className="font-medium cursor-pointer">
                            {option.label}
                          </Label>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          
                              {formatPrice(
                                                                                    ((option.price||0)) * (exchangeRates[selectedCurrency] || 1),
                                                                                    selectedCurrency,
                                                                                  )}
                          </p>
                          <p className="text-xs text-gray-500">per person</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Number of Persons */}
                <div>
                  <Label htmlFor="numberOfPersons" className="text-base font-medium">
                    Number of Travelers
                  </Label>
                  <Select
                    value={numberOfPersons.toString()}
                    onValueChange={(value) => updateNumberOfPersons(Number.parseInt(value))}
                  >
                    <SelectTrigger className="mt-2 bg-white/50 backdrop-blur-sm border-blue-200">
                      <SelectValue placeholder="Select number of travelers" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Person" : "Persons"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Traveler Information */}
            {persons.map((person, index) => (
              <Card key={index} className="backdrop-blur-md bg-white/70 border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Traveler {index + 1} Information
                  </CardTitle>
                  <CardDescription>Please provide accurate information as per passport</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`firstName-${index}`}>First Name *</Label>
                      <Input
                        id={`firstName-${index}`}
                        value={person.firstName}
                        onChange={(e) => updatePersonInfo(index, "firstName", e.target.value)}
                        required
                        className="bg-white/50 backdrop-blur-sm border-blue-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`lastName-${index}`}>Last Name *</Label>
                      <Input
                        id={`lastName-${index}`}
                        value={person.lastName}
                        onChange={(e) => updatePersonInfo(index, "lastName", e.target.value)}
                        required
                        className="bg-white/50 backdrop-blur-sm border-blue-200"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`email-${index}`}>Email Address *</Label>
                      <Input
                        id={`email-${index}`}
                        type="email"
                        value={person.email}
                        onChange={(e) => updatePersonInfo(index, "email", e.target.value)}
                        required
                        className="bg-white/50 backdrop-blur-sm border-blue-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`phone-${index}`}>Phone Number *</Label>
                      <Input
                        id={`phone-${index}`}
                        type="tel"
                        value={person.phone}
                        onChange={(e) => updatePersonInfo(index, "phone", e.target.value)}
                        required
                        className="bg-white/50 backdrop-blur-sm border-blue-200"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`dateOfBirth-${index}`}>Date of Birth *</Label>
                      <Input
                        id={`dateOfBirth-${index}`}
                        type="date"
                        value={person.dateOfBirth}
                        onChange={(e) => updatePersonInfo(index, "dateOfBirth", e.target.value)}
                        required
                        className="bg-white/50 backdrop-blur-sm border-blue-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`gender-${index}`}>Gender *</Label>
                      <Select value={person.gender} onValueChange={(value) => updatePersonInfo(index, "gender", value)}>
                        <SelectTrigger className="bg-white/50 backdrop-blur-sm border-blue-200">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`nationality-${index}`}>Nationality *</Label>
                      <Input
                        id={`nationality-${index}`}
                        value={person.nationality}
                        onChange={(e) => updatePersonInfo(index, "nationality", e.target.value)}
                        required
                        className="bg-white/50 backdrop-blur-sm border-blue-200"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`passportNumber-${index}`}>Passport Number *</Label>
                      <Input
                        id={`passportNumber-${index}`}
                        value={person.passportNumber}
                        onChange={(e) => updatePersonInfo(index, "passportNumber", e.target.value)}
                        required
                        className="bg-white/50 backdrop-blur-sm border-blue-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`passportExpiry-${index}`}>Passport Expiry Date *</Label>
                      <Input
                        id={`passportExpiry-${index}`}
                        type="date"
                        value={person.passportExpiry}
                        onChange={(e) => updatePersonInfo(index, "passportExpiry", e.target.value)}
                        required
                        className="bg-white/50 backdrop-blur-sm border-blue-200"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`specialRequests-${index}`}>Special Requests (Optional)</Label>
                    <Textarea
                      id={`specialRequests-${index}`}
                      value={person.specialRequests}
                      onChange={(e) => updatePersonInfo(index, "specialRequests", e.target.value)}
                      placeholder="Any dietary requirements, accessibility needs, or other special requests..."
                      rows={3}
                      className="bg-white/50 backdrop-blur-sm border-blue-200"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Terms and Conditions */}
            <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  />
                  <div className="text-sm">
                    <Label htmlFor="terms" className="cursor-pointer">
                      I agree to the{" "}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4 backdrop-blur-md bg-white/80 border-white/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Package:</span>
                    <span className="font-medium">{pkg?.packageName}</span>
                  </div>

                  {selectedSharing && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Room Type:</span>
                        <span className="font-medium">
                          {sharingOptions.find((opt) => opt.value === selectedSharing)?.label}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Number of Travelers:</span>
                        <span className="font-medium">{numberOfPersons}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Price per person:</span>
                        <span className="font-medium">
                               {formatPrice(
                                                                                    ((sharingOptions.find((opt) => opt.value === selectedSharing)?.price||0)) * (exchangeRates[selectedCurrency] || 1),
                                                                                    selectedCurrency,
                                                                                  )}
                        
                        </span>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span className="font-medium">
                          
                          
  {formatPrice(((sharingOptions.find((opt) => opt.value === selectedSharing)?.price || 0) * numberOfPersons) * (exchangeRates[selectedCurrency] || 1),
                                                                                    selectedCurrency,
                                                                                  )}
                        </span>
                      </div>

                      {(pkg?.discountPercent||0) > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({pkg?.discountPercent}%):</span>
                          <span className="font-medium">
                            -$

-{formatPrice(((Math.round(
                              ((sharingOptions.find((opt) => opt.value === selectedSharing)?.price || 0) *
                                numberOfPersons *
                               (pkg?.discountPercent||0) ) /
                                100,
                            ))) * (exchangeRates[selectedCurrency] || 1),
                                                                                    selectedCurrency,
                                                                                  )}

                          
                          </span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        
                            {formatPrice(((calculateTotal()) ) * (exchangeRates[selectedCurrency] || 1),
                                                                                    selectedCurrency,
                                                                                  )}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                  size="lg"
                  disabled={!selectedSharing || !agreeToTerms || isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Complete Booking"}
                </Button>

                <div className="text-center text-xs text-gray-500">
                  <p>Secure payment • SSL encrypted</p>
                  <p>You will receive confirmation via email</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
          
          </div>
        </form>
      </div>
    </div>
  )
}
