import Image from 'next/image'

interface MainProps {
  bgImage?: string;
  logo?: string;
  title?: string;
  subtitle?: string;
}

const Main = ({ 
  bgImage = "/images/bgimage.jpg",
  logo = "/images/Aeronaa-Logo.png",
  title = "Travelers' Choice Awards",
  subtitle = "Best of the Best Hotels"
}: MainProps) => {
  return (
    <div className="relative h-[500px] w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt="Background View"
          fill
          className="object-cover brightness-75"
          priority
          sizes="100vw"
          quality={85}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
        <div className="w-[160px] h-[160px] relative mb-6">
          <Image
            src={logo}
            alt="Logo"
            fill
            className="object-contain"
            loading="eager"
            sizes="160px"
            quality={90}
          />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          {title}
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-center">
          {subtitle}
        </h2>
      </div>
    </div>
  )
}

export default Main
