// app/layout.tsx (or wherever this is)

import "../globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/store/authContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aeronaa",
  description: "Luxury Hotel Booking Platform",
};

// ❌ Named export
// export function RootLayout({ children }: { children: React.ReactNode }) { ... }

// ✅ Correct: Default export
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
   
       <>
            {children}
       </>
       
     
  );
}