"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { resetPassword } from "@/lib/verifyEmail"

export default function ChangePassword() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Extract both id and email from the query
  const id = searchParams?.get("id")
  const email = searchParams?.get("email")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChangePassword = async () => {
    if (!id || !email) {
      toast.error("Invalid password reset link.")
      return
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await resetPassword(id,  newPassword)
      console.log(response)
      toast.success("Password changed successfully!")

      setTimeout(() => {
        router.push("/signin")
      }, 1500)
    } catch (err: any) {
      toast.error(err.message || "Failed to change password.")
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

        <h1 className="text-2xl font-semibold text-center mb-2">Change Password</h1>
        <p className="text-center text-xs text-gray-600 mb-6">
          Enter your new password below.
        </p>

        <ToastContainer position="top-right" autoClose={3000} />

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="w-full h-12 border border-gray-300 rounded-md px-4 text-sm focus:border-[#006CE4] focus:ring-2 focus:ring-[#006CE4]/20 outline-none transition-all mb-4"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full h-12 border border-gray-300 rounded-md px-4 text-sm focus:border-[#006CE4] focus:ring-2 focus:ring-[#006CE4]/20 outline-none transition-all mb-6"
        />

        <Button
          onClick={handleChangePassword}
          disabled={!newPassword || !confirmPassword || isSubmitting}
          className={`w-full h-12 text-base font-semibold rounded-md transition-all ${
            newPassword && confirmPassword
              ? "bg-[#006CE4] hover:bg-[#00224f] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Updating..." : "Change Password"}
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
