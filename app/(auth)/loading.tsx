export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="flex items-center space-x-2">
        <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="h-3 w-3 bg-[#1d5296] rounded-full animate-bounce" />
      </div>
    </div>
  )
}