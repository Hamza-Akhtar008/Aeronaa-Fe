import { useState } from "react";

export default function EmbeddedMap({ name, address }: { name: string; address: string }) {
  const [showMap, setShowMap] = useState(false);

  const encodedQuery = encodeURIComponent(`${name}, ${address}`);
  // Use maps.google.com to allow embedding + full controls
  const mapUrl = `https://maps.google.com/maps?q=${encodedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <>
      {address && (
        <div
          onClick={() => setShowMap(true)}
          className="text-gray-500 text-sm mb-2 line-clamp-1 cursor-pointer hover:underline"
        >
          {name}, {address}
        </div>
      )}

      {showMap && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowMap(false)}
        >
          <div
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()} // Prevent close on inner click
          >
            {/* Close Button */}
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-4 right-4 z-50 bg-white text-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-gray-100 transition"
            >
              ✕
            </button>

            {/* Fullscreen Google Map */}
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              className="border-0 rounded-none"
              style={{ minHeight: "100vh" }}
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
