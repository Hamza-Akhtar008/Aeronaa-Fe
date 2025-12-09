import Image from "next/image";

export default function PeruTravelGuide() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-10 mb-8 border-b border-blue-100">
        <div className="max-w-3xl mx-auto flex flex-col items-center px-4 text-center">
          <Image src="/images/aeronalogo.png" alt="Aeronaa Logo" width={80} height={80} className="mb-4" priority />
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Peru Travel Guide</h1>
          <p className="text-lg text-blue-800 mb-2">Uncover the wonders of Peru</p>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <span>By Aeronaa Team</span>
            <span>•</span>
            <span>August 2025</span>
          </div>
          <Image src="https://images.unsplash.com/photo-1465156799763-2c087c332922?auto=format&fit=crop&w=800&q=80" alt="Peru Mountains" width={600} height={300} className="rounded-xl shadow mb-4 object-cover w-full max-w-lg h-56" />
        </div>
      </section>
      {/* Blog Content */}
      <article className="max-w-2xl mx-auto px-4 py-8 prose prose-blue">
        <h2>Must-See in Peru</h2>
        <ul>
          <li><b>Machu Picchu & Sacred Valley</b> – Ancient Inca wonders</li>
          <li><b>Cusco & Lima city tours</b></li>
          <li><b>Lake Titicaca</b></li>
          <li><b>Amazon rainforest adventures</b></li>
          <li><b>Peruvian cuisine:</b> Ceviche, Lomo Saltado</li>
        </ul>
  <Image src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80" alt="Machu Picchu" width={600} height={300} className="rounded-lg shadow my-6 object-cover w-full max-w-lg h-56 mx-auto" />
        <h2>Travel Tips</h2>
        <ul>
          <li>Acclimatize to the altitude in Cusco before hiking.</li>
          <li>Try local markets for authentic food and crafts.</li>
          <li>Book Machu Picchu tickets in advance.</li>
        </ul>
        <h2>Plan with Aeronaa</h2>
        <p>Start your Peruvian journey with Aeronaa—your trusted partner for unique experiences, expert support, and the best deals.</p>
      </article>
    </main>
  );
}
