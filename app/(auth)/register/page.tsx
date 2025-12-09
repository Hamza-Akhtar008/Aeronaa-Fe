// "use client"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import dynamic from "next/dynamic"
// // Dynamically import react-phone-input-2 to avoid SSR issues
// const PhoneInput = dynamic(() => import('react-phone-input-2'), { ssr: false })
// import 'react-phone-input-2/lib/style.css';
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import { useRouter } from "next/navigation"
// import Image from "next/image"
// import { useEffect, useState } from "react"
// import { useAuth } from "@/store/authContext"
// import { registerUser } from "@/lib/api"
// import { toast, ToastContainer } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import { Role } from "@/lib/UsersEnum"
// import { ChevronLeft, Eye, EyeOff } from "lucide-react"

// export default function Register() {
//   const [fullName, setFullName] = useState("")
//   const [phone, setPhone] = useState("")
//   const [formattedPhone, setFormattedPhone] = useState("")
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [address, setAddress] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [services, setServices] = useState<string[]>([]);

// const handleServiceChange = (service: string) => {
//   setServices(prevServices => 
//     prevServices.includes(service)
//       ? prevServices.filter(s => s !== service)  // Remove if already selected
//       : [...prevServices, service]               // Add if not selected
//   );
// };
//   const router = useRouter()
//   const { auth } = useAuth()
//   const [loading, setLoading] = useState(true) // true initially - checking auth
//   const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

//   useEffect(() => {
//     // Get the redirect URL from the query parameters
//     const params = new URLSearchParams(window.location.search)
//     const redirect = params.get('redirect')
//     setRedirectUrl(redirect)
//   }, [])

//   // Effect to update the formatted phone whenever the phone value changes
//   useEffect(() => {
//     if (phone) {
//       // Ensure phone number has + prefix for backend
//       setFormattedPhone(phone.startsWith('+') ? phone : `+${phone}`);
//     }
//   }, [phone])

//   useEffect(() => {
//     if (auth) {
//       // If auth exists, redirect to the saved URL or dashboard
//       if (redirectUrl) {
//         router.push(redirectUrl)
//       } else {
//         router.push("/Dashboard")
//       }
//     } else {
//       // No auth, allow rendering of sign-in page
//       setLoading(false)
//     }
//   }, [auth, router, redirectUrl])

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center ">
//         <div className="flex items-center space-x-2">
//           <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce [animation-delay:-0.3s]" />
//           <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce [animation-delay:-0.15s]" />
//           <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce" />
//         </div>
//       </div>
//     )
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!fullName || !phone || !email || !password || !confirmPassword || !address) {
//       toast.error("All fields are required.")
//       return
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match.")
//       return
//     }

//     try {
//       const selectedRole =
//       services.includes("carrental") ? Role.CARRENTAL : Role.VENDOR;
//       // Use formattedPhone that includes the + sign, selec
//       await registerUser(fullName, formattedPhone || `+${phone}`, email, password,  selectedRole)
//       toast.success("Account created successfully!")
//       // Redirect to email verification page with email and redirectUrl as query params
//       setTimeout(() => {
//         const finalRedirect = redirectUrl || "/Dashboard";
//         router.push(`/verify-email?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(finalRedirect)}`)
//       }, 1500)
//     } catch (err: any) {
//       toast.error(err.message || "Signup failed.")
//     }
//   }

//   return (
//     <div className="flex flex-col md:flex-row w-full h-screen">
//       {/* Left Side - Form */}
      
//       <div className="flex-1 flex items-center justify-center  px-4 py-6 bg-white overflow-y-auto min-h-screen scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//         <div className="w-full max-w-md mt-72">
//           <button
//         onClick={() => router.back()} // Navigate to the previous page
//         className="ml-2 text-gray-600 hover:text-[#023e8a] transition-colors duration-300 flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 hover:border-[#023e8a] bg-white"
//         aria-label="Go back to the previous page"
//       >
//         <ChevronLeft className="w-5 h-5" />
//       </button>
//           <div className="space-y-4 text-center">
//             <div className="flex justify-center mb-6">
//               <Image
//                 src="/images/Aeronaa-Logo.png"
//                 alt="Aeronaa Logo"
//                 width={200}
//                 height={80}
//                 priority
//               />
//             </div>
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-start via-blue-600 to-primary-end bg-clip-text text-transparent">
//               Create an account
//             </h1>
//            <p className="text-sm text-muted-foreground">
//             Register as a Partner to unlock exclusive business opportunities and services.
//           </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-2 mt-6">
//             {/* Full Name */}
//             <div className="space-y-2">
//               <Label htmlFor="full-name" className="text-[#023e8a] font-medium">Full Name</Label>
//               <Input 
//                 id="full-name" 
//                 type="text" 
//                 value={fullName} 
//                 onChange={(e) => setFullName(e.target.value)} 
//                 placeholder="Enter your full name"
//                 className="h-12 bg-transparent border-2 border-gradient-to-r from-primary-start via-blue-600 to-primary-end focus:ring-2 ring-primary-end/50 focus:border-primary-end"
//               />
//             </div>

//             {/* Phone */}
//             <div className="space-y-2">
//               <Label htmlFor="phone" className="text-[#023e8a] font-medium">Phone Number</Label>
//               <PhoneInput
//                 country={'pk'}
//                 value={phone}
//                 onChange={(value, data: any) => {
//                   setPhone(value);
//                   // Format the phone with + sign for backend
//                   setFormattedPhone(`+${value}`);
//                 }}
//                 inputProps={{
//                   name: 'phone',
//                   required: true,
//                   autoFocus: false,
//                   className: 'h-12 w-full bg-transparent border-2 border-gradient-to-r from-primary-start via-blue-600 to-primary-end focus:ring-2 ring-primary-end/50 focus:border-primary-end text-base rounded-md pl-12',
//                   id: 'phone',
//                   placeholder: 'Enter phone number',
//                 }}
//                 containerClass="w-full"
//                 inputClass="w-full !pl-12"
//                 buttonClass="!border-0 !bg-transparent"
//                 dropdownClass="z-[9999]"
//                 enableSearch
//                 disableDropdown={false}
//                 disableCountryCode={false}
//                 // masks={{ pk: '(...) ..........' }}
//                 countryCodeEditable={false}
//                 specialLabel=""
//               />
//               {/* Note: If any digit is getting cut off, the format might not match your country's phone number pattern */}
//             </div>

//             {/* Email */}
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-[#023e8a] font-medium">Email</Label>
//               <Input 
//                 id="email" 
//                 type="email" 
//                 value={email} 
//                 onChange={(e) => setEmail(e.target.value)} 
//                 placeholder="Email"
//                 className="h-12 bg-transparent border-2 border-gradient-to-r from-primary-start via-blue-600 to-primary-end focus:ring-2 ring-primary-end/50 focus:border-primary-end"
//               />
//             </div>

//             {/* Address */}
//             <div className="space-y-2">
//               <Label htmlFor="address" className="text-[#023e8a] font-medium">Address</Label>
//               <Input 
//                 id="address" 
//                 type="text" 
//                 value={address} 
//                 onChange={(e) => setAddress(e.target.value)} 
//                 placeholder="Your full address"
//                 className="h-12 bg-transparent border-2 border-gradient-to-r from-primary-start via-blue-600 to-primary-end focus:ring-2 ring-primary-end/50 focus:border-primary-end"
//               />
//             </div>

//             <div className="space-y-2">
//             <Label className="text-[#023e8a] font-medium">Services</Label>
//             <div className="flex flex-wrap gap-4">
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="hotel"
//                   checked={services.includes("Hotel")}
//                   onChange={() => handleServiceChange("Hotel")}
//                   className="h-5 w-5"
//                 />
//                 <Label htmlFor="hotel" className="ml-2 text-[#023e8a]">Hotel</Label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="carrental"
//                   checked={services.includes("carrental")}
//                   onChange={() => handleServiceChange("carrental")}
//                   className="h-5 w-5"
//                 />
//                 <Label htmlFor="carrental" className="ml-2 text-[#023e8a]">Car Rentals</Label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="properties"
//                   checked={services.includes("Properties Selling")}
//                   onChange={() => handleServiceChange("Properties Selling")}
//                   className="h-5 w-5"
//                 />
//                 <Label htmlFor="properties" className="ml-2 text-[#023e8a]">Properties Selling</Label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="umrah-packages"
//                   checked={services.includes("Umrah Packages")}
//                   onChange={() => handleServiceChange("Umrah Packages")}
//                   className="h-5 w-5"
//                 />
//                 <Label htmlFor="umrah-packages" className="ml-2 text-[#023e8a]">Umrah Packages</Label>
//               </div>
//             </div>
//           </div>


//             {/* Password */}
//             <div className="space-y-1">
//               <Label htmlFor="password" className="text-[#023e8a] font-medium">Password</Label>
//               <div className="relative">
//                 <Input 
//                   id="password" 
//                   type={showPassword ? "text" : "password"}
//                   value={password} 
//                   onChange={(e) => setPassword(e.target.value)} 
//                   placeholder="Password"
//                   className="h-12 bg-transparent border-2 border-gradient-to-r from-primary-start via-blue-600 to-primary-end focus:ring-2 ring-primary-end/50 focus:border-primary-end pr-10"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 >
//                   {showPassword ? (
//                     <EyeOff size={20} className="text-primary-end" />
//                   ) : (
//                     <Eye size={20} className="text-primary-end" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Confirm Password */}
//             <div className="space-y-1">
//               <Label htmlFor="confirm-password" className="text-[#023e8a] font-medium">Confirm Password</Label>
//               <div className="relative">
//                 <Input 
//                   id="confirm-password" 
//                   type={showConfirmPassword ? "text" : "password"}
//                   value={confirmPassword} 
//                   onChange={(e) => setConfirmPassword(e.target.value)} 
//                   placeholder="Confirm password"
//                   className="h-12 bg-transparent border-2 border-gradient-to-r from-primary-start via-blue-600 to-primary-end focus:ring-2 ring-primary-end/50 focus:border-primary-end pr-10"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff size={20} className="text-primary-end" />
//                   ) : (
//                     <Eye size={20} className="text-primary-end" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <Button 
//               type="submit" 
//               className="w-full bg-gradient-to-r from-primary-start via-blue-600 to-primary-end py-6 text-base hover:opacity-90 transition-opacity"
//             >
//               Create account
//             </Button>
//           </form>

//           {/* Footer Text */}
//           <div className="text-center text-sm">
//             Already have an account?{" "}
//             <Link href="/signin" className="text-[#023e8a] hover:underline">
//               Sign in
//             </Link>
//           </div>

//           <div className="text-center text-xs text-muted-foreground space-y-1">
//             <p>
//               By signing up, you agree to our{" "}
//               <Link href="#" className="text-[#006CE4] hover:underline">Terms</Link> and{" "}
//               <Link href="#" className="text-[#006CE4] hover:underline">Privacy Policy</Link>.
//             </p>
//             <p>&copy; 2006 - {new Date().getFullYear()} Aeronaa™</p>
//           </div>
//         </div>
//       </div>

//       {/* Right Side - Banner Image */}
//       <div className="hidden md:block md:w-1/2 relative h-screen">
//         <Image
//           src="/images/banner.jpg"
//           alt="Luxury hotel room"
//           fill
//           className="object-cover z-10"
//           priority
//         />
//         <div className="absolute inset-0 bg-[#023e8a]/40 flex flex-col items-center justify-center text-white text-center px-4 z-20">
//           <h2 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Aeronaa</h2>
//           <p className="text-lg md:text-xl opacity-90">Experience luxury and comfort</p>
//         </div>
//       </div>
//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   )
// }






"use client"
import Link from "next/link"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useAuth } from "@/store/authContext"
import { registerUser } from "@/lib/api"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Role } from "@/lib/UsersEnum"
import { Eye, EyeOff } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import react-phone-input-2 to avoid SSR issues
const PhoneInput = dynamic(() => import("react-phone-input-2"), { ssr: false })
import "react-phone-input-2/lib/style.css"

export default function Register() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [formattedPhone, setFormattedPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedService, setSelectedService] = useState("Hotels")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const router = useRouter()
  const { auth } = useAuth()
  const [loading, setLoading] = useState(true)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get("redirect")
    setRedirectUrl(redirect)
  }, [])

  useEffect(() => {
    if (phone) {
      setFormattedPhone(phone.startsWith("+") ? phone : `+${phone}`)
    }
  }, [phone])

  useEffect(() => {
    if (auth) {
      if (redirectUrl) {
        router.push(redirectUrl)
      } else {
        router.push("/Dashboard")
      }
    } else {
      setLoading(false)
    }
  }, [auth, router, redirectUrl])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce" />
        </div>
      </div>
    )
  }

   const passwordSchemaOk = (pwd: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pwd)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName ||!lastName || !phone || !email || !password || !confirmPassword || !selectedService) {
      toast.error("All fields are required.")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }
 if (!passwordSchemaOk(password)) {
      toast.error("Password must be 8+ chars with upper, lower, number, and symbol")
      return 
    }
    try {
      const selectedRole =
      selectedService=="Car Rentals" ? Role.CARRENTAL :selectedService=="Properties Selling"? Role.PROPERTY:selectedService=="Umrah Packages"?Role.Umrah:Role.VENDOR;
      // Use formattedPhone that includes the + sign
      await registerUser(firstName+ " "+lastName, formattedPhone || `+${phone}`, email, password,  selectedRole)
      toast.success("Account created successfully!")
      // Redirect to email verification page with email and redirectUrl as query params
      setTimeout(() => {
        const finalRedirect = redirectUrl || "/Dashboard";
         
      // Pass phone as well so verify-email page can display the correct number
         const verifyEmailPath = `/verify-email?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(formattedPhone || phone)}&redirect=${encodeURIComponent(finalRedirect)}`;
      
  
        router.push(verifyEmailPath);

      }, 1500)
    } catch (err: any) {
      toast.error(err.message || "Signup failed.")
    }
  }

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
    <div className="flex-1 flex items-center justify-start px-8 py-12 lg:px-16">
        <div className="w-full max-lg-md-sm">
          <div className="mb-8">
              <div className="space-y-1">
  <div className="flex mb-6">
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
         <div className="grid grid-cols-2 gap-4">
  {/* First Name */}
  <div className="relative">
    <fieldset className="border border-gray-300 rounded-md px-3 pt-1 pb-2 focus-within:border-blue-500">
      <legend className="text-sm text-gray-600 px-1">
        First Name
      </legend>
      <input
        id="firstName"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="John"
        className="w-full h-8 outline-none text-gray-900 placeholder-gray-400"
      />
    </fieldset>
  </div>

  {/* Last Name */}
  <div className="relative">
    <fieldset className="border border-gray-300 rounded-md px-3 pt-1 pb-2 focus-within:border-blue-500">
      <legend className="text-sm text-gray-600 px-1">
        Last Name
      </legend>
      <input
        id="lastName"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Doe"
        className="w-full h-8 outline-none text-gray-900 placeholder-gray-400"
      />
    </fieldset>
  </div>
</div>


          <div className="grid grid-cols-2 gap-4">
  {/* Email */}
  <div className="relative">
    <fieldset className="border border-gray-300 rounded-md px-3 pt-1 pb-2 focus-within:border-blue-500">
      <legend className="text-sm text-gray-600 px-1">
        Email
      </legend>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="john.doe@gmail.com"
        className="w-full h-8 outline-none text-gray-900 placeholder-gray-400"
      />
    </fieldset>
  </div>

  {/* Phone Number */}
  <div className="relative">
    <fieldset className="border border-gray-300 rounded-md px-3 pt-1 pb-2 focus-within:border-blue-500">
      <legend className="text-sm text-[#023e8a] font-medium px-1">
        Phone Number
      </legend>
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
          className:
            'w-full h-8 bg-transparent outline-none text-gray-900 placeholder-gray-400 pl-12',
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
        specialLabel="" // we don’t need the library’s label
      />
    </fieldset>
  </div>
</div>


          {/* Password */}
<div className="relative">
  <fieldset className="border border-gray-300 rounded-md px-3 pt-1 pb-2 focus-within:border-blue-500">
    <legend className="text-sm text-gray-600 px-1">Password</legend>
    <div className="relative">
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="*************"
        className="w-full h-8 outline-none text-gray-900 placeholder-gray-400 pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </fieldset>
</div>

{/* Confirm Password */}
<div className="relative">
  <fieldset className="border border-gray-300 rounded-md px-3 pt-1 pb-2 focus-within:border-blue-500">
    <legend className="text-sm text-gray-600 px-1">Confirm Password</legend>
    <div className="relative">
      <input
        id="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="*************"
        className="w-full h-8 outline-none text-gray-900 placeholder-gray-400 pr-10"
      />
      <button
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </fieldset>
</div>

{/* Services Dropdown */}
<div className="relative">
  <fieldset className="border border-gray-300 rounded-md px-3 pt-1 pb-2 focus-within:border-blue-500">
    <legend className="text-sm text-gray-600 px-1">Services</legend>
    <Select value={selectedService} onValueChange={setSelectedService}>
      <SelectTrigger className="w-full h-8 outline-none border-none shadow-none p-0">
        <SelectValue placeholder="Hotels" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Hotels">Hotels</SelectItem>
     
        <SelectItem value="Umrah Packages">Umrah Packages</SelectItem>
      </SelectContent>
    </Select>
  </fieldset>
</div>

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
