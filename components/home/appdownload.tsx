import Image from "next/image";

export default function AppDownloadSection() {
  return (
<section className=" relative h-[495px] bg-gradient-to-br from-[#c0dbff] to-[#63a6ff] overflow-hidden">
  {/* Background decorative elements */}
  <div className="absolute inset-0 pointer-events-none">
    {/* Top-left ellipse */}
{/* Top-left ellipse */}
<div className="absolute -top-20 -left-20 w-[524px] h-[524px] rounded-full border-[20px] border-[#C4DDFF]/30"></div>

{/* Bottom-right ellipse */}
<div className="absolute -bottom-20 -right-20 w-[524px] h-[524px] rounded-full border-[20px] border-[#C4DDFF]/30"></div>


  </div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Phone mockup */}
      <div className="flex justify-center lg:justify-start">
        <div className="relative h-[400px] overflow-hidden">
          <div className="w-64 h-[520px] bg-black rounded-[3rem] p-2 shadow-2xl">
            <div className="w-full h-full bg-gray-900 rounded-[2.5rem] relative overflow-hidden">
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>

              {/* App content */}
              <div className="flex flex-col items-center justify-center h-full text-white px-8">
                <Image
                  src="/images/footerlogo.png"
                  alt="Aerona Logo"
                  width={200}
                  height={200}
                  priority
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-center lg:text-left">
        <p className="text-white/80 text-lg mb-4">What people say about Golobe facilities</p>
        <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 leading-tight">
          Download our app for free
        </h2>

        {/* Download buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          {/* App Store */}
          <a
            href="#"
            className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <div className="text-xs">Download on the</div>
              <div className="text-lg font-semibold">App Store</div>
            </div>
          </a>

          {/* Google Play */}
          <a
            href="#"
            className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <div className="text-left">
              <div className="text-xs">Get it on</div>
              <div className="text-lg font-semibold">Google Play</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>


  )
}
