"use client"

import React from "react"
import { Dialog } from "@headlessui/react"
import { Button } from "@/components/ui/button"

type ConfirmModalProps = {
  isOpen: boolean
  title?: string
  message?: string
  onCancel: () => void
  onConfirm: () => void
}

export const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 space-y-4">
          <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600">{message}</Dialog.Description>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
