"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { sendResetEmail } from "@/lib/api"
//import { sendResetEmail } from "@/lib/sendResetEmail" // You'll create this API function

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContinue = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    setIsSubmitting(true)
    try {
   const response=   await sendResetEmail(email) 
   console.log(response);
      toast.success("Verification code sent to your email!")
      setTimeout(() => {
        router.push(`/verify-email-password-reset?email=${encodeURIComponent(email)}`)
      }, 1500)
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset email.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
        <div className="mb-8 flex flex-col items-center">
          <Image src="/images/Aeronaa-Logo.png" alt="Logo" width={150} height={150} className="mb-4" />
        </div>
        <h1 className="text-2xl font-semibold text-center mb-2">Forgot Password?</h1>
        <p className="text-center text-xs text-gray-600 mb-6">
          Enter your registered email address to receive a verification code.
        </p>

        <ToastContainer position="top-right" autoClose={3000} />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full h-12 border border-gray-300 rounded-md px-4 text-sm focus:border-[#006CE4] focus:ring-2 focus:ring-[#006CE4]/20 outline-none transition-all mb-6"
        />

        <Button
          onClick={handleContinue}
          disabled={!email || isSubmitting}
          className={`w-full h-12 text-base font-semibold rounded-md transition-all ${
            email ? "bg-[#006CE4] hover:bg-[#00224f] text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Sending..." : "Continue"}
        </Button>

        <div className="text-center mt-4">
          <Link href="/signin" className="text-[#006CE4] font-semibold hover:underline text-xs">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
