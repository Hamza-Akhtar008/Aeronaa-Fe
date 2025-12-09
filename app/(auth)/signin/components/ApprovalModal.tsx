"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ApprovalModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ApprovalModal({ isOpen, onClose }: ApprovalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Account Pending Approval
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Your account is waiting for admin approval. Please try again later.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button
            onClick={onClose}
            className="bg-[#0a3a7a] hover:bg-blue-700 px-6"
          >
           ok
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}