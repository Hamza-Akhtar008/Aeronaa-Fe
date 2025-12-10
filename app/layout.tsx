// app/layout.tsx (or wherever this is)
"use client";
import "./globals.css";
import { AuthProvider, useAuth } from "@/store/authContext";  // Ensure correct import

import { HeroTabProvider } from "@/components/home/HeroTabContext";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
     <html lang="en" className={montserrat.className}>
      <body suppressHydrationWarning>
        
          <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBCit9qsp_C6ePD126N1h6avxnQ7EH9xGU&libraries=places`}
        strategy="beforeInteractive"
      />
        {/* Wrap the entire component tree with AuthProvider */}
        <AuthProvider>
          <AuthContent>
            <HeroTabProvider>{children}</HeroTabProvider>
          </AuthContent>
        </AuthProvider>
          <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      </body>
    </html>
  );
}

// Create a component to check auth and render FloatingSpeedDial
const AuthContent = ({ children }: { children: React.ReactNode }) => {
  const { auth, loading } = useAuth(); // useAuth hook inside the provider
  
  // Show FloatingSpeedDial only when authenticated and role is "vendor"
  return (
    <>
  
      <HeroTabProvider>
 <meta
          name="google-site-verification"
          content="wMRrNlbkwdJKpY7ZbMWOj3dE5wVeFmLLz1ovz4ne4tg"
        />
      {children}
      </HeroTabProvider>
    </>
  );
};
