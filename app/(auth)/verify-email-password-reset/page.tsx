"use client"

import { useSearchParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ConfirmEmail, verifyEmail } from "@/lib/verifyEmail"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function VerifyEmail() {
  const searchParams = useSearchParams()
  const email = searchParams?.get("email") || "your@email.com"
  const phone = searchParams?.get("phone") || "+921234567890"
  const redirectUrl = searchParams?.get("redirect") || "/Dashboard"
  const router = useRouter()
  const [code, setCode] = useState<string[]>(Array(6).fill(""))
  const [countdown, setCountdown] = useState(60)
  const [isVerifying, setIsVerifying] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

 


  useEffect(() => {
    inputRefs.current[0]?.focus()
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (value && !/^\d+$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index]) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").trim()
    if (/^\d{6}$/.test(pasted)) {
      setCode(pasted.split(""))
      inputRefs.current[5]?.focus()
    }
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    try {
      const verificationCode = code.join("")
   const response =   await ConfirmEmail(email, verificationCode)
      toast.success("Verification successfull!")
      
      // Redirect to the specified redirect URL or Dashboard after successful verification
      setTimeout(() => {
     
        router.push(`/changepassword?id=${encodeURIComponent(response.id)}&email=${encodeURIComponent(response.email)}`)

      }, 1500)
    } catch (err: any) {
      toast.error(err.message || "Verification failed.")
      setIsVerifying(false)
    }
  }

  const isCodeComplete = code.every((digit) => digit !== "")

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
        <div className="mb-8 flex flex-col items-center">
          <Image src="/images/Aeronaa-Logo.png" alt="Logo" width={150} height={150} className="mb-4" />
        </div>
        <h1 className="text-2xl font-semibold text-center mb-2">Verify through email address </h1>
        <div className="text-center text-xs text-gray-600 mb-6">
          We&apos;ve sent a verification code to <span className="text-[#006CE4] underline">{email}</span>. Please enter this code to continue.
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex justify-center gap-3 mb-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="text"
                maxLength={1}
                value={code[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-14 h-14 border border-gray-300 rounded-lg text-center text-2xl font-semibold focus:border-[#006CE4] focus:ring-2 focus:ring-[#006CE4]/20 outline-none transition-all"
                style={{ boxShadow: '0 1px 4px 0 rgba(0,0,0,0.08)' }}
              />
            ))}
        </div>
        <Button
          onClick={handleVerify}
          disabled={!isCodeComplete || isVerifying}
          className={`w-full h-12 text-base font-semibold rounded-md transition-all ${
            isCodeComplete ? "bg-[#006CE4] hover:bg-[#00224f] text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isVerifying ? "Verifying..." : "Verify email"}
        </Button>
        {/* <div className="text-center text-xs mt-4">
          <p>
            Didn&apos;t receive an email?{' '}
            {countdown > 0 ? (
              <span className="text-gray-500">Request again in {countdown} seconds</span>
            ) : (
              <button className="text-[#006CE4] font-semibold hover:underline bg-transparent border-none p-0 m-0">Request another code</button>
            )}
          </p>
        </div> */}
        <div className="text-center mt-2">
          <Link href="/signin" className="text-[#006CE4] font-semibold hover:underline text-xs">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
