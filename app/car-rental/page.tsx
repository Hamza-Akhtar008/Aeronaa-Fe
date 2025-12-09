"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CarRentalRedirect() {
  const router = useRouter();  useEffect(() => {
    // Redirect to the car rental dashboard standalone app
    router.push("/car-rental-dashboard");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold">Redirecting to Car Rental Dashboard...</h2>
        <p>Please wait, you are being redirected to the car rental dashboard.</p>
      </div>
    </div>
  );
}
