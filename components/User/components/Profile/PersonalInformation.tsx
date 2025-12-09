"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Key, User, Mail, Phone, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FetchUser, PatchUser } from "@/lib/api"
import { toast, ToastContainer } from "react-toastify"
import { PasswordChangeModal } from "./password-change-modal"


const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").nonempty("Name is required"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  phone: z.string().min(10, "Invalid phone number").nonempty("Phone number is required"),
})

export default function PersonalInformation() {
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [storedPassword, setStoredPassword] = useState("")
  const [userId, setUserId] = useState<string>("")

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const authString = localStorage.getItem("auth")
        const auth = authString ? JSON.parse(authString) : null

        if (!auth?.id) {
          toast.error("Please login first")
          return
        }

        setUserId(auth.id.toString())
        const userData = await FetchUser(auth.id.toString())
        setStoredPassword(userData.password)

        form.reset({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
        })
      } catch (error) {
        toast.error("Failed to load user data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [form])

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
        <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
        <div className="absolute inset-4 w-8 h-8 border-4 border-transparent border-t-blue-400 rounded-full animate-spin [animation-duration:0.8s]" />
        <div className="absolute inset-6 w-4 h-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full animate-pulse" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
          Loading your profile...
        </p>
      </div>
    </div>
  )

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsLoading(true)
    try {
      const authString = localStorage.getItem("auth")
      const auth = authString ? JSON.parse(authString) : null

      if (!auth?.id) {
        throw new Error("User not authenticated")
      }

      const [updateResponse] = await Promise.all([
        PatchUser(auth.id.toString(), values),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ])

      console.log(updateResponse)
      toast.success("Profile updated successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="text-slate-600 text-lg">Manage your personal information and account settings</p>
            </div>

            {/* Main Profile Card */}
            <Card className="border-0 bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100 p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-800">Personal Information</CardTitle>
                      <CardDescription className="text-slate-600">Update your basic profile details</CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsPasswordModalOpen(true)}
                    variant="outline"
                    className="flex items-center space-x-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-xl"
                  >
                    <Key className="h-4 w-4" />
                    <span>Change Password</span>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Name Field */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                              <User className="h-4 w-4 text-slate-500" />
                              <span>Full Name</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="h-12 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all rounded-xl text-slate-700"
                                placeholder="Enter your full name"
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />

                      {/* Email Field */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-slate-500" />
                              <span>Email Address</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                className="h-12 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all rounded-xl text-slate-700"
                                placeholder="Enter your email address"
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />

                      {/* Phone Field */}
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="space-y-3 md:col-span-2">
                            <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-slate-500" />
                              <span>Phone Number</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="h-12 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all rounded-xl text-slate-700 max-w-md"
                                placeholder="Enter your phone number"
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6 border-t border-slate-100">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="border-0 bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-slate-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Key className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800">Security Settings</CardTitle>
                    <CardDescription className="text-slate-600">
                      Manage your account security and password
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-800">Password</h3>
                    <p className="text-sm text-slate-600">Last updated: Recently</p>
                  </div>
                  <Button
                    onClick={() => setIsPasswordModalOpen(true)}
                    variant="outline"
                    className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 rounded-xl"
                  >
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Password Change Modal */}
        <PasswordChangeModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          storedPassword={storedPassword}
          userId={userId}
        />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="mt-16"
        />
      </div>
    </div>
  )
}
