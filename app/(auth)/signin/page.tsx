"use client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image"
import { loginUser } from "@/lib/api"
import { useAuth } from "@/store/authContext"
import { Eye, EyeOff, Facebook, Apple } from "lucide-react"
import { ApprovalModal } from "./components/ApprovalModal"

export default function SignIn() {
  const router = useRouter()
  // Update the type definition for auth.role to include "agent" and other roles
  type AuthRole = "vendor" | "user" | "admin" | "support" | "agent"|'umrah' | "carrental" | "property";
  
  const { auth } = useAuth() as { auth: { role: AuthRole } };
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const { login } = useAuth()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams?.get("redirect") || ""

  useEffect(() => {
    if (auth) {
      if (redirectUrl != "") {
       router.push(decodeURIComponent(redirectUrl))
      } else {
        if (auth.role === "vendor") {
          router.push("/Dashboard")
        } else if (auth.role === "user") {
          router.push("/") // or your user dashboard
        } else if (auth.role === "admin") {
          router.push("/admin") // catch-all for unknown roles
        } else if (auth.role === "support") {
          router.push("/support") // for support users
        } else if (auth.role === "agent") {
          router.push("/agent")
        } else if (auth.role === "carrental") {
          router.push("/car-rental-dashboard")
        } else if(auth.role === "property")
        {
          router.push("/property-dashboard")
        }
        else if (auth.role=="umrah")
        {
          router.push('/umarah-pakage/dashboard')
        }
        else {
          router.push("/unauthorized")
        }
      }
    } else {
      setLoading(false) // Allow rendering the sign-in form
    }
  }, [auth, router])

  const handleContinue = async () => {
  if (!email) {
    toast.error("Please enter your email address.")
    return
  }
  if (!password) {
    toast.error("Please enter your password.")
    return
  }

  try {
    const data = await loginUser(email, password)
    toast.success("Successfully logged in!")

    // Extract token, role, and id from response (adjust keys as needed)
    const authData = {
      access_token: data.token || data.access_token || data.jwt || "",
      role: data.role || "user",
      id: data.id || data._id || 0,
      Permissions:data.Permissions||[],
    }
    login(authData)

  if(redirectUrl!="")
  {
    router.push(decodeURIComponent(redirectUrl))
  }
    if (authData.role === "vendor") {
      router.push("/Dashboard")
    } else if (authData.role === "user") {
      router.push("/")
    } else if (authData.role === "admin") {
      router.push("/admin")
    } else if (authData.role === "support") {
      router.push("/support")
    } else if (authData.role === "carrental") {
      router.push("/car-rental-dashboard")
    } else if(authData.role === "agent") {
      router.push("/agent")
    }
    else if (authData.role=="umrah")
    {
      router.push("/umarah-pakage/dashboard");
    }
    else if (authData.role=="property")
    {
       router.push("/property-dashboard")
    }
    else {
      router.push("/unauthorized")
    }
  } catch (error: any) {
    console.log("Full error object:", error);
    
    // Check for the specific case where user is not approved yet
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data &&
      error.response.data.message === "User not approved"
    ) {
      // Show custom popup for pending approval
      // alert("Your account is waiting for admin approval. Please try again later.");
      setShowApprovalModal(true);
    
    } else {
      // Generic error for other cases
      console.log
      toast.error("Login failed. Please try again.");
    }
  }
}


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex min-h-screen bg-white">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-10 lg:p-10">
          <div className="w-full max-w-lg space-y-8">
            <div className="space-y-1">
  <div className="flex items-center space-x-2">
    <Link href="/" passHref>
      <Image
        src="/images/aeronalogo.png"
        alt="Aerona Logo"
        width={200}
        height={200}
        priority
        className="cursor-pointer"
      />
    </Link>
  </div>
</div>

            <div className="space-y-2">
       <h1 className="text-4xl font-tradegothic  text-gray-900">Login</h1>
              <p className="text-gray-500">Login to access your account</p>
            </div>

            <div className="space-y-6">
         {/* Email */}
<div className="relative">
  <fieldset className="border border-gray-300 rounded-lg px-3 pt-1 pb-2 ">
    <legend className="text-sm text-gray-700 px-1">Email</legend>
    <input
      id="email"
      type="email"
      placeholder="john.doe@gmail.com"
      className="w-full h-10 outline-none text-gray-900 placeholder-gray-400"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </fieldset>
</div>

{/* Password */}
<div className="relative">
  <fieldset className="border border-gray-300 rounded-lg px-3 pt-1 pb-2 ">
    <legend className="text-sm text-gray-700 px-1">Password</legend>
    <div className="relative">
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder="*********"
        className="w-full h-10 outline-none text-gray-900 placeholder-gray-400 pr-12"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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


              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                    className="h-4 w-4  border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link href="#" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot Password
                </Link>
              </div>

              <Button
                type="button"
                onClick={handleContinue}
                className="w-full h-11 bg-[#0a3a7a] hover:bg-blue-700 text-white font-small text-base"
              >
                Login
              </Button>

              <div className="text-center">
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <Link
                  href={redirectUrl ? `/user/register?redirect=${encodeURIComponent(redirectUrl)}` : "/user/register"}
                  className="text-sm text-[#0a3a7a] hover:text-blue-800 font-medium"
                >
                  Sign up
                </Link>
              </div>

              <div className="text-center">
                <Link
                  href={redirectUrl ? `/user/register?redirect=${encodeURIComponent(redirectUrl)}` : "/forgetpassword"}
                  className="text-sm text-[#0a3a7a] hover:text-blue-800 font-medium"
                >
                
                <span className="text-sm text-gray-600">Forget Password </span>
                </Link>
              </div>

              {/* <div className="relative flex items-center justify-center my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative bg-white px-6 text-sm text-gray-500">Or login with</div>
              </div> */}

              {/* <div className="flex justify-center space-x-4">
                <Button variant="outline" className="w-16 h-16 border-gray-200 bg-white hover:bg-gray-50 ">
                  <Facebook className="w-6 h-6 text-blue-600" />
                </Button>
                <Button variant="outline" className="w-16 h-16 border-gray-200 bg-white hover:bg-gray-50">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                    />
                    <path
                      fill="#34A853"
                      d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                    />
                  </svg>
                </Button>
                <Button variant="outline" className="w-16 h-16 border-gray-200 bg-white hover:bg-gray-50 ">
                  <Apple className="w-6 h-6 text-gray-900" />
                </Button>
              </div> */}
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-10 rounded-l-[4rem] overflow-hidden pl-10">
            <Image
              src="/images/login.png"
              alt="Luxury tropical resort with pool and palm trees"
              fill
              className="object-contain "
              priority
            />
           
          </div>
        </div>
      </div>

      <ApprovalModal 
        isOpen={showApprovalModal} 
        onClose={() => setShowApprovalModal(false)} 
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}
