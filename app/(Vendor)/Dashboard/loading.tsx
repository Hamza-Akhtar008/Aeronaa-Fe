export default function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Multi-layer spinner */}
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#023e8a] rounded-full animate-spin"></div>

          {/* Middle ring */}
          <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-[#0077b6] rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>

          {/* Inner ring */}
          <div className="absolute inset-4 w-8 h-8 border-4 border-transparent border-t-[#00b4d8] rounded-full animate-spin [animation-duration:0.8s]"></div>

          {/* Center dot */}
          <div className="absolute inset-6 w-4 h-4 bg-gradient-to-r from-[#023e8a] to-[#00b4d8] rounded-full animate-pulse"></div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-lg font-medium bg-gradient-to-r from-[#023e8a] to-[#00b4d8] bg-clip-text text-transparent">
            Loading...
          </p>
        </div>
      </div>
    </div>
  )
}
