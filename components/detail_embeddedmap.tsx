import { useState } from "react";

export default function DetailEmbeddedMap({ name, address }: { name: string; address: string }) {
  const [showMap, setShowMap] = useState(false);

  const encodedQuery = encodeURIComponent(`${name}, ${address}`);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBCit9qsp_C6ePD126N1h6avxnQ7EH9xGU&q=${encodedQuery}`;

  return (
    <>
      {/* Small preview map */}
      <div className="w-full h-24 sm:h-28 rounded-md border border-gray-200 overflow-hidden relative">
        <iframe
          title="Google Map Preview"
          src={mapUrl}
          width="100%"
          height="100%"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="border-0 w-full h-full pointer-events-none"
        ></iframe>

        {/* Overlay button */}
        <button
          onClick={() => setShowMap(true)}
          className="absolute bottom-2 right-2 bg-white text-gray-700 rounded px-3 py-1 shadow hover:bg-gray-100 transition pointer-events-auto"
        >
          View Larger
        </button>
      </div>

      {/* Fullscreen Map Modal */}
      {showMap && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowMap(false)}
        >
          <div
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-4 right-4 z-50 bg-white text-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-gray-100 transition"
            >
              ✕
            </button>

            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              className="border-0"
              style={{ minHeight: "100vh" }}
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
