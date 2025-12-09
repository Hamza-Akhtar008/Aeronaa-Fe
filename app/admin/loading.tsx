"use client"

export default function LoadingWaves() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-8">
        {/* Wave animation */}
        <div className="flex items-end space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 bg-gradient-to-t from-[#023e8a] to-[#00b4d8] rounded-t-full animate-[wave_1.5s_ease-in-out_infinite]"
              style={{
                height: "20px",
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Pulsing text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#023e8a] to-[#00b4d8] bg-clip-text text-transparent animate-pulse">
            Loading
          </h2>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { height: 20px; }
          50% { height: 40px; }
        }
      `}</style>
    </div>
  )
}
