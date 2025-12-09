"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter,useSearchParams  } from "next/navigation"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useAuth } from "@/store/authContext"
import { loginUser, registerUser } from "@/lib/api"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ChevronLeft, EyeIcon, EyeOffIcon } from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Role } from "@/lib/UsersEnum"
import dynamic from "next/dynamic"

const PhoneInput = dynamic(() => import('react-phone-input-2'), { ssr: false })
import 'react-phone-input-2/lib/style.css';

export default function Register() {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [address, setAddress] = useState("")
  const [formattedPhone, setFormattedPhone] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedService, setSelectedService] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get('redirect') || '';
  const { auth, login } = useAuth()
  const [loading, setLoading] = useState(true); // true initially - checking auth
  useEffect(() => {
    setLoading(false);
  }, []);

  // If already authenticated, redirect immediately (in useEffect, not render)
  useEffect(() => {
    if (auth) {
      if (redirectUrl) {
        window.location.replace(redirectUrl);
      } else {
        router.push("/user/bookings");
      }
    }
  }, [auth, redirectUrl, router]);

  // Effect to update the formatted phone whenever the phone value changes
  useEffect(() => {
    if (phone) {
      // Ensure phone number has + prefix for backend
      setFormattedPhone(phone.startsWith('+') ? phone : `+${phone}`);
    }
  }, [phone])

  const passwordSchemaOk = (pwd: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pwd)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!fullName || !phone || !email || !password || !confirmPassword || !address) {
    toast.error("All fields are required.");
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }
   if (!passwordSchemaOk(password)) {
        toast.error("Password must be 8+ chars with upper, lower, number, and symbol")
        return 
      }

  try {
    // Register the user first
    const result = await registerUser(fullName, formattedPhone || `+${phone}`, email, password,  Role.USER,"approved");
    console.log("Registration successful:", result);
    toast.success("Account created successfully!");

    // Redirect to email verification page with email and redirectUrl as query params
    try {
      // Pass both email and the original redirect URL (or default to /user/bookings)
      const finalRedirect = redirectUrl || "/user/bookings";
      // Pass phone as well so verify-email page can display the correct number
         const verifyEmailPath = `/verify-email?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(formattedPhone || phone)}&redirect=${encodeURIComponent(finalRedirect)}`;
      
  
        router.push(verifyEmailPath);
  
    } catch (navError) {
      console.error("Navigation error:", navError);
      // Fallback navigation using window.location if router.push fails
      setTimeout(() => {
        window.location.href = `/verify-email?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(formattedPhone || phone)}`;
      }, 1500);
      
    }
  } catch (err: any) {
    console.error("Registration error:", err);
    toast.error(err.message || "Signup failed.");
  }
};


  return (
      <div className="flex h-screen">
        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-12 rounded-l-[4rem] overflow-hidden">
            <Image
              src="/images/login.png"
              alt="Luxury tropical resort with pool and palm trees"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-start px-8 py-12 lg:px-16 overflow-x-auto whitespace-nowrap">
          <div className="w-full max-lg-md-sm">
            <div className="mb-8">
              <div className="space-y-1">
                <div className="flex mb-1">
                  <Link href="/" passHref>
                    <Image
                      src="/images/aeronalogo.png"
                      alt="Aerona Logo"
                      width={200}
                      height={200}
                      priority
                      sizes="(max-width: 640px) 120px, (max-width: 1024px) 150px, 180px"
                      className="h-auto w-[120px] sm:w-[150px] lg:w-[180px]"
                    />
                  </Link>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign up</h1>
              <p className="text-gray-600">Let's get you all set up so you can access your personal account.</p>
            </div>


            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Full Name & Phone */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="space-y-1 w-full">
                  <Label htmlFor="full-name" className="text-[#023e8a] font-medium">Full Name</Label>
                  <Input 
                    id="full-name" 
                    type="text" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    placeholder="Enter your full name"
                    className="border-[#023e8a] focus:ring-[#023e8a] focus:border-[#023e8a] focus:outline-none focus-visible:ring-[#023e8a]"
                  />
                </div>
                <div className="space-y-1 w-full">
                  <Label htmlFor="phone" className="text-[#023e8a] font-medium">Phone Number</Label>
                  <PhoneInput
                    country={'pk'}
                    value={phone}
                    onChange={(value, data: any) => {
                      setPhone(value);
                      setFormattedPhone(`+${value}`);
                    }}
                    inputProps={{
                      name: 'phone',
                      required: true,
                      autoFocus: false,
                      className: 'h-12 w-full bg-transparent border-2 border-gradient-to-r from-primary-start via-blue-600 to-primary-end focus:ring-2 ring-primary-end/50 focus:border-primary-end text-base rounded-md pl-12',
                      id: 'phone',
                      placeholder: 'Enter phone number',
                    }}
                    containerClass="w-full"
                    inputClass="w-full !pl-12"
                    buttonClass="!border-0 !bg-transparent"
                    dropdownClass="z-[9999]"
                    enableSearch
                    disableDropdown={false}
                    disableCountryCode={false}
                    countryCodeEditable={false}
                    specialLabel=""
                  />
                </div>
              </div>

              {/* Row 2: Email & Address */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="space-y-1 w-full">
                  <Label htmlFor="email" className="text-[#023e8a] font-medium">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email"
                    className="border-[#023e8a] focus:ring-[#023e8a] focus:border-[#023e8a] focus:outline-none focus-visible:ring-[#023e8a]"
                  />
                </div>
                <div className="space-y-1 w-full">
                  <Label htmlFor="address" className="text-[#023e8a] font-medium">Address</Label>
                  <Input 
                    id="address" 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder="Your full address"
                    className="border-[#023e8a] focus:ring-[#023e8a] focus:border-[#023e8a] focus:outline-none focus-visible:ring-[#023e8a]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-[#023e8a] font-medium">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="border-[#023e8a] focus:ring-[#023e8a] focus:border-[#023e8a] focus:outline-none focus-visible:ring-[#023e8a] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#023e8a] hover:text-[#023e8a]/80"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <Label htmlFor="confirm-password" className="text-[#023e8a] font-medium">Confirm Password</Label>
                <div className="relative">
                  <Input 
                    id="confirm-password" 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="border-[#023e8a] focus:ring-[#023e8a] focus:border-[#023e8a] focus:outline-none focus-visible:ring-[#023e8a] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#023e8a] hover:text-[#023e8a]/80"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Services Dropdown */}
              {/* <div className="relative">
                <Label htmlFor="services" className="text-[#023e8a] font-medium">Services</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="w-full h-10 outline-none border border-gray-300 shadow-none p-0">
                    <SelectValue placeholder="Hotels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hotels">Hotels</SelectItem>
                    <SelectItem value="Car Rentals">Car Rentals</SelectItem>
                    <SelectItem value="Properties Selling">Properties Selling</SelectItem>
                    <SelectItem value="Umrah Packages">Umrah Packages</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to all the{" "}
                  <Link href="#" className="text-orange-500 hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-pink-500 hover:underline">
                    Privacy Policies
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#0a3a7a] hover:bg-blue-700 text-white  "
              >
                Create account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Already have an account?{" "}
                <Link href="/signin" className="text-pink-500 hover:underline font-medium">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    
  )
}