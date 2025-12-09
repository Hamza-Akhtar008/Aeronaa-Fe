"use client";

import Image from "next/image";

type CountryFlagProps = {
  countryCode?: string; // e.g., "US", "PK", "GB"
  width?: number; 
  height?: number; 

         // optional size
};

export default function CountryFlag({ countryCode, width = 20,height=20 }: CountryFlagProps) {
  return (
    <>
    {countryCode&&
       <div className="flex items-center bg-transparent">
      <Image
        src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
        alt={`${countryCode} flag`}
        width={width}
        height={height} // keep aspect ratio
        className="rounded-sm bg-transparent border"
      />
    </div>
    }
        </>
   
  );
}
