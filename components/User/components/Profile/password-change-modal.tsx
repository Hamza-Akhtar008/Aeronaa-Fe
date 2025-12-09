"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Eye, EyeOff, Key, Shield, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PatchUser } from "@/lib/api"
import { toast } from "react-toastify"

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

interface PasswordChangeModalProps {
  isOpen: boolean
  onClose: () => void
  storedPassword: string
  userId: string
}

export function PasswordChangeModal({ isOpen, onClose, storedPassword, userId }: PasswordChangeModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsLoading(true)
    try {
      // Verify current password
      if (values.currentPassword !== storedPassword) {
        form.setError("currentPassword", {
          type: "manual",
          message: "Current password is incorrect",
        })
        setIsLoading(false)
        return
      }

      if (!userId) {
        throw new Error("User not authenticated")
      }

      const updateData = {
        password: values.newPassword,
      }

      const [updateResponse] = await Promise.all([
        PatchUser(userId, updateData),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ])

      console.log(updateResponse)
      toast.success("Password updated successfully")

      // Reset form and close modal
      form.reset()
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Failed to update password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-0 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-4 pb-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-center space-y-2">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Change Password
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Enter your current password and choose a new secure password
            </DialogDescription>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-slate-500" />
                    <span>Current Password</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        {...field}
                        className="h-12 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all rounded-xl pr-12"
                        placeholder="Enter your current password"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                    <Key className="h-4 w-4 text-slate-500" />
                    <span>New Password</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        {...field}
                        className="h-12 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all rounded-xl pr-12"
                        placeholder="Enter your new password"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-slate-500" />
                    <span>Confirm New Password</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                        className="h-12 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all rounded-xl pr-12"
                        placeholder="Confirm your new password"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 h-12 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl bg-transparent"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
