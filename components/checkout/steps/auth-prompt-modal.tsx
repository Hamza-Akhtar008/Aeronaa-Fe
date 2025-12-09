"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import type { BookingFormData, Ticket } from "@/types/checkout"

interface AuthPromptModalProps {
  isOpen: boolean
  onClose: () => void
  formData: BookingFormData
  ticket: Ticket
}

export function AuthPromptModal({ isOpen, onClose, formData, ticket }: AuthPromptModalProps) {
  const router = useRouter()

  const handleSignInRedirect = () => {
    // Save current booking data to session storage before redirecting
    sessionStorage.setItem("bookingFormData", JSON.stringify(formData))
    sessionStorage.setItem("ticketData", JSON.stringify(ticket))
    
    // Redirect to sign-in page with current path as redirect parameter
    router.push(`/signin?redirect=${encodeURIComponent(window.location.pathname)}`)
    onClose() // Close the modal
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Sign In Required</DialogTitle>
          <DialogDescription className="text-gray-200">
            You need to be logged in to complete your booking. Please sign in or create an account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button onClick={handleSignInRedirect} className="bg-blue-500/70 hover:bg-blue-600/80 text-white">
            Sign In
          </Button>
          <Button variant="outline" onClick={onClose} className="border-white/30 bg-gray text-white hover:bg-white/20">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
