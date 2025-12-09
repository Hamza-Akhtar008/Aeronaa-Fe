// components/GlobalLoader.tsx
"use client";

import React from "react";
import { useLoading } from "./LoadingContext";

const GlobalLoader = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex flex-col items-center space-y-6">
        {/* Travel-themed animation */}
        <div className="relative w-32 h-20">
          {/* Airplane path */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 128 80">
              <path
                d="M10 40 Q 64 10 118 40"
                stroke="url(#gradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#023e8a" />
                  <stop offset="100%" stopColor="#00b4d8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Animated airplane */}
          <div className="absolute top-8 left-0 w-6 h-6 animate-[fly_3s_ease-in-out_infinite]">
            <div className="w-full h-full bg-gradient-to-r from-[#023e8a] to-[#00b4d8] transform rotate-45 rounded-sm"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-[#023e8a] to-[#00b4d8] bg-clip-text text-transparent mb-2">
            Finding the Best Deals
          </h2>
          <p className="text-gray-600 text-sm">Please wait while we search...</p>
        </div>

        {/* Animated progress dots */}
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-[#023e8a] to-[#00b4d8] animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fly {
          0% { transform: translateX(0) translateY(0) rotate(45deg); }
          50% { transform: translateX(50px) translateY(-10px) rotate(45deg); }
          100% { transform: translateX(100px) translateY(0) rotate(45deg); }
        }
      `}</style>
    </div>
  );
};

export default GlobalLoader;
