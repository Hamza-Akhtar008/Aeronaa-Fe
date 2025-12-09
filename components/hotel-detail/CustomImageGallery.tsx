import { useState } from "react";

interface CustomImageGalleryProps {
  images: string[];
  hotelName: string;
}

export default function CustomImageGallery({ images, hotelName }: CustomImageGalleryProps) {
  const [mainIdx, setMainIdx] = useState(0);

  // Show up to 5 images in grid (1 main, 4 small)
  const gridImages = [
    images[mainIdx],
    ...images.filter((_, i) => i !== mainIdx).slice(0, 4),
  ];

  const goNext = () => setMainIdx((mainIdx + 1) % images.length);
  const goPrev = () => setMainIdx((mainIdx - 1 + images.length) % images.length);

  return (
    <div className="grid grid-cols-3 gap-2 relative">
      {/* Main Image */}
      <div className="col-span-2 relative rounded-xl overflow-hidden h-64">
        <img
          src={gridImages[0] || "/placeholder.svg"}
          alt={hotelName + " main"}
          className="object-cover w-full h-full"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* 4 Small Images */}
      <div className="grid grid-rows-2 grid-cols-2 gap-2 h-64">
        {gridImages.slice(1, 5).map((img, idx) => (
          <div
            key={idx}
            className="relative rounded-xl overflow-hidden cursor-pointer"
            onClick={() => setMainIdx(images.findIndex((i) => i === img))}
          >
            <img
              src={img || "/placeholder.svg"}
              alt={`img${idx + 1}`}
              height={500}
              className="object-cover w-full"
            />
            {idx === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-semibold">
                +{images.length - 4} photos
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
