"use client"

import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#023e88] via-[#034a9a] to-[#023e88] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00b4d7]/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00b4d7]/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#00b4d7]/25 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00b4d7]/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(#00b4d7 1px, transparent 1px), linear-gradient(90deg, #00b4d7 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-12">
        {/* Logo with brand color glow */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00b4d7] to-[#00b4d7]/60 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            <div className="relative bg-[#023e88]/20 backdrop-blur-sm rounded-full p-6 border border-[#00b4d7]/30 shadow-2xl shadow-[#00b4d7]/20">
              <Image src="images/logo.ico" alt="Logo" width={64} height={64} className="w-16 h-16 drop-shadow-2xl" />
            </div>
          </div>
        </div>

        {/* Main content with glassmorphism */}
        <div className="bg-[#023e88]/10 backdrop-blur-md rounded-3xl p-12 border border-[#00b4d7]/20 shadow-2xl shadow-[#00b4d7]/10">
          <div className="space-y-8">
            {/* 404 with neon effect using brand colors */}
            <div className="relative">
              <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d7] via-[#00b4d7]/80 to-[#00b4d7] animate-pulse drop-shadow-2xl">
                404
              </h1>
              <div className="absolute inset-0 text-9xl font-black text-[#00b4d7]/20 blur-sm">404</div>
              {/* Additional glow layer */}
              <div className="absolute inset-0 text-9xl font-black text-[#00b4d7]/10 blur-lg">404</div>
            </div>

            {/* Error message */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">Page Not Found</h2>
              <p className="text-xl text-[#00b4d7]/90 max-w-md mx-auto leading-relaxed font-medium">
                This destination seems to be off the map. Let's navigate you back home.
              </p>
            </div>

            {/* Animated home button with brand colors */}
            <div className="pt-4">
              <Button
                asChild
                size="lg"
                className="group relative bg-gradient-to-r from-[#00b4d7] to-[#00b4d7]/80 hover:from-[#00b4d7]/90 hover:to-[#00b4d7] text-[#023e88] font-bold px-10 py-4 rounded-full shadow-2xl shadow-[#00b4d7]/30 hover:shadow-[#00b4d7]/50 transition-all duration-300 transform hover:scale-105 border-0 hover:brightness-110"
              >
                <Link href="/" className="flex items-center gap-3">
                  <div className="relative">
                    <Home className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-[#023e88]/20 rounded-full blur-sm group-hover:bg-[#023e88]/30 transition-all duration-300"></div>
                  </div>
                  <span className="text-lg">Return Home</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Subtle footer text */}
        <p className="text-[#00b4d7]/60 text-sm animate-fade-in font-medium" style={{ animationDelay: "1s" }}>
          "Every journey needs a compass back to home"
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-25px) rotate(180deg);
            opacity: 0.4;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
