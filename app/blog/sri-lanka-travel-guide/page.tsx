import Image from "next/image";

export default function SriLankaTravelGuide() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-10 mb-8 border-b border-blue-100">
        <div className="max-w-3xl mx-auto flex flex-col items-center px-4 text-center">
          <Image src="/images/aeronalogo.png" alt="Aeronaa Logo" width={80} height={80} className="mb-4" priority />
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Sri Lanka Travel Guide</h1>
          <p className="text-lg text-blue-800 mb-2">The Pearl of the Indian Ocean awaits</p>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <span>By Aeronaa Team</span>
            <span>•</span>
            <span>August 2025</span>
          </div>
          <Image src="https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80" alt="Sri Lanka Beach" width={600} height={300} className="rounded-xl shadow mb-4 object-cover w-full max-w-lg h-56" />
        </div>
      </section>
      {/* Blog Content */}
      <article className="max-w-2xl mx-auto px-4 py-8 prose prose-blue">
        <h2>Highlights of Sri Lanka</h2>
        <ul>
          <li><b>Sigiriya Rock Fortress</b> – Ancient wonder and UNESCO site</li>
          <li><b>Temple of the Tooth, Kandy</b> – Sacred Buddhist relic</li>
          <li><b>Beaches:</b> Mirissa, Unawatuna, Arugam Bay</li>
          <li><b>Wildlife:</b> Yala National Park safaris</li>
          <li><b>Tea country:</b> Nuwara Eliya</li>
        </ul>
  <Image src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80" alt="Sigiriya Rock Fortress" width={600} height={300} className="rounded-lg shadow my-6 object-cover w-full max-w-lg h-56 mx-auto" />
        <h2>Travel Tips</h2>
        <ul>
          <li>Travel by train for scenic views.</li>
          <li>Sample local cuisine: hoppers, kottu, seafood.</li>
          <li>Visit during a cultural festival for a unique experience.</li>
        </ul>
        <h2>Plan with Aeronaa</h2>
        <p>Let Aeronaa help you plan your Sri Lankan adventure with expert advice, curated stays, and local experiences.</p>
      </article>
    </main>
  );
}
