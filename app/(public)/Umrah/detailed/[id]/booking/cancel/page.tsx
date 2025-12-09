"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { XCircle, RefreshCw, Phone, ArrowLeft, CreditCard, AlertTriangle } from "lucide-react"

export default function PaymentCancelPage() {
  const searchParams = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState({
    sessionId: "",
    packageName: "",
    amount: "",
    reason: "",
  })

  useEffect(() => {
    // Extract details from URL parameters
    const sessionId = searchParams.get("session_id") || ""
    const packageName = searchParams.get("package") || "Premium Umrah Experience"
    const amount = searchParams.get("amount") || "2,520"
    const reason = searchParams.get("reason") || "Payment was cancelled by user"

    setPaymentDetails({
      sessionId,
      packageName,
      amount,
      reason,
    })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#023e8a] via-[#0077b6] to-[#00b4d8]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Cancel Header */}
          <div className="text-center mb-8">
            <div className="backdrop-blur-md bg-white/10 p-8 rounded-2xl border border-white/20 shadow-2xl">
              <XCircle className="h-20 w-20 text-red-400 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-white mb-4">Payment Cancelled</h1>
              <p className="text-xl text-blue-100 mb-6">Your payment was not completed and no charges were made</p>
              <Badge className="bg-red-500/20 text-red-100 border-red-400/30 text-lg px-4 py-2">
                No Booking Created
              </Badge>
            </div>
          </div>

          {/* Payment Details */}
          <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="h-5 w-5 text-blue-300" />
                Payment Information
              </CardTitle>
              <CardDescription className="text-blue-100">Details about the cancelled payment attempt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Package:</span>
                  <span className="text-white font-medium">{paymentDetails.packageName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Amount:</span>
                  <span className="text-white font-medium">${paymentDetails.amount} USD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Status:</span>
                  <Badge className="bg-red-500/20 text-red-100 border-red-400/30">Cancelled</Badge>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-red-500/20 p-4 rounded-lg border border-red-400/30">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-300 mt-0.5" />
                  <div>
                    <p className="text-red-100 font-medium">Payment Not Processed</p>
                    <p className="text-sm text-red-200">{paymentDetails.reason}</p>
                  </div>
                </div>
              </div>

              {paymentDetails.sessionId && (
                <div className="text-xs text-blue-200">
                  <p>Session ID: {paymentDetails.sessionId}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* What You Can Do */}
          <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-white">What You Can Do</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 text-blue-300 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white">Try Payment Again</h4>
                  <p className="text-sm text-blue-100">
                    You can return to the booking page and attempt payment again. Your booking details are still saved.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-300 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white">Contact Support</h4>
                  <p className="text-sm text-blue-100">
                    If you're experiencing payment issues, our support team can help you complete your booking over the
                    phone.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-blue-300 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white">Payment Methods</h4>
                  <p className="text-sm text-blue-100">
                    We accept all major credit cards, debit cards, and digital wallets. You can also pay via bank
                    transfer.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                asChild
              >
                <Link href="/umrah">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Booking Again
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
            </div>

            <div className="flex justify-center">
              <Link href="/">
                <Button variant="ghost" className="text-blue-100 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Homepage
                </Button>
              </Link>
            </div>
          </div>

          {/* Support Information */}
          <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl mt-12">
            <CardHeader>
              <CardTitle className="text-white">Need Help with Payment?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100 mb-4">
                Our payment specialists are available to help you complete your booking securely.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-100">
                <div>
                  <p className="font-medium text-white mb-2">Immediate Assistance:</p>
                  <p>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p>
                    <strong>WhatsApp:</strong> +1 (555) 987-6543
                  </p>
                  <p className="text-green-200 font-medium">Available 24/7 for payment issues</p>
                </div>
                <div>
                  <p className="font-medium text-white mb-2">Email Support:</p>
                  <p>
                    <strong>General:</strong> support@umrahtravel.com
                  </p>
                  <p>
                    <strong>Payments:</strong> payments@umrahtravel.com
                  </p>
                  <p className="text-blue-200">Response within 1 hour</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                <p className="text-blue-100 text-sm">
                  <strong>Common Payment Issues:</strong> Expired cards, insufficient funds, international transaction
                  blocks. Our team can help resolve these quickly.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
