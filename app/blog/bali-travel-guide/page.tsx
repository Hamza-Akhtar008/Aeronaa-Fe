import Image from "next/image";

export default function BaliTravelGuide() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-10 mb-8 border-b border-blue-100">
        <div className="max-w-3xl mx-auto flex flex-col items-center px-4 text-center">
          <Image src="/images/aeronalogo.png" alt="Aeronaa Logo" width={80} height={80} className="mb-4" priority />
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Bali Travel Guide</h1>
          <p className="text-lg text-blue-800 mb-2">Your gateway to the Island of the Gods</p>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <span>By Aeronaa Team</span>
            <span>•</span>
            <span>August 2025</span>
          </div>
          <Image src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80" alt="Bali Beach" width={600} height={300} className="rounded-xl shadow mb-4 object-cover w-full max-w-lg h-56" />
        </div>
      </section>
      {/* Blog Content */}
      <article className="max-w-2xl mx-auto px-4 py-8 prose prose-blue">
        <h2>Why Visit Bali?</h2>
        <p>Bali is a paradise for every traveler. From stunning beaches and vibrant culture to world-class cuisine and spiritual retreats, there's something for everyone.</p>
        <ul>
          <li><b>Top beaches:</b> Kuta, Seminyak, Nusa Dua</li>
          <li><b>Must-see temples:</b> Uluwatu, Tanah Lot, Besakih</li>
          <li><b>Adventure:</b> Surfing, hiking Mount Batur, diving</li>
          <li><b>Local food:</b> Nasi Goreng, Babi Guling, Satay</li>
        </ul>
  <Image src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80" alt="Bali Temple" width={600} height={300} className="rounded-lg shadow my-6 object-cover w-full max-w-lg h-56 mx-auto" />
        <h2>Tips for Your Bali Trip</h2>
        <ul>
          <li>Respect local customs and dress modestly at temples.</li>
          <li>Try a traditional Balinese massage.</li>
          <li>Rent a scooter for easy island exploration.</li>
          <li>Book popular attractions in advance.</li>
        </ul>
        <h2>Plan with Aeronaa</h2>
        <p>Ready to explore? Book your Bali adventure with Aeronaa and unlock exclusive deals, local insights, and 24/7 support for a seamless journey.</p>
      </article>
    </main>
  );
}
