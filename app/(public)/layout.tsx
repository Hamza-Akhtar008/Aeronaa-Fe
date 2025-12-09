import type React from "react"
import "../globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Footer } from "@/components/home"
import { Suspense } from 'react'
import { SigninSiteHeader } from "@/components/signin-header"
import Script from "next/script"
import { HeroTabProvider } from "@/components/home/hero-tab-context"
const inter = Inter({ subsets: ["latin"] })


export const metadata: Metadata = {
  title: "Aeronna",
  description: "",
  icons: {
  icon: "/images/logo.ico",
  apple: "/images/logo.ico",
},
   
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense>
  
       
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBCit9qsp_C6ePD126N1h6avxnQ7EH9xGU&libraries=places`}
        strategy="beforeInteractive"
      />
       <HeroTabProvider>
       <SigninSiteHeader />
        <main className="p-0 m-0 bg-[#FFFFFF]">{children}</main>
        
       </HeroTabProvider>
        <Footer/>
     
   
    </Suspense>
  )
}
