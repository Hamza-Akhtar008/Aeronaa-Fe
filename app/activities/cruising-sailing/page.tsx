import Image from "next/image";

export default function CruisingSailing() {
  return (
    <main className="min-h-screen bg-white">
      <section className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-10 mb-8 border-b border-blue-100">
        <div className="max-w-3xl mx-auto flex flex-col items-center px-4 text-center">
          <Image src="/images/aeronalogo.png" alt="Aeronaa Logo" width={200} height={290} className="mb-4" priority />
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Cruising & Sailing</h1>
          <p className="text-lg text-blue-800 mb-2">Set sail for adventure on the world’s most beautiful waters</p>
        </div>
      </section>
      <article className="max-w-2xl mx-auto px-4 py-8 prose prose-blue">
        <h2>Why Choose Cruising & Sailing?</h2>
        <p>Cruising and sailing offer a unique way to explore the world, combining luxury, adventure, and relaxation. Whether you prefer a grand ocean liner, a river cruise, or an intimate yacht, there’s a voyage for every traveler. Each journey is an opportunity to discover new destinations, cultures, and experiences from the comfort of your floating hotel.</p>
        <h2>Top Destinations</h2>
        <ul>
          <li><b>The Mediterranean:</b> Discover ancient ports, sun-soaked beaches, and vibrant cultures. Explore Italy, Greece, Spain, and more.</li>
          <li><b>The Caribbean:</b> Enjoy turquoise waters, tropical islands, and lively local traditions. Perfect for winter escapes and family fun.</li>
          <li><b>Alaska:</b> Witness glaciers, wildlife, and breathtaking fjords. Experience the raw beauty of the Last Frontier.</li>
          <li><b>Asia & The South Pacific:</b> Sail to exotic destinations like Thailand, Indonesia, and Fiji for a blend of adventure and relaxation.</li>
        </ul>
        <h2>Onboard Experiences</h2>
        <p>Modern cruises offer gourmet dining, world-class entertainment, wellness spas, and enriching excursions. Sailing trips provide hands-on adventure, from learning to navigate to exploring hidden coves. Enjoy themed cruises, kids’ clubs, and activities for all ages.</p>
        <h2>What to Expect</h2>
        <p>Expect seamless service, comfortable accommodations, and a variety of activities both onboard and ashore. Our cruises and sailing trips are designed for relaxation, discovery, and fun, with expert crews and local guides to enhance your journey.</p>
        <h2>Why Book with Aeronaa?</h2>
        <p>We partner with top cruise lines and local experts to deliver seamless, unforgettable journeys tailored to your interests and style. From luxury escapes to adventure expeditions, Aeronaa ensures every detail is taken care of.</p>
        <h2>Ready to Set Sail?</h2>
        <p>Contact Aeronaa to find your perfect cruise or sailing adventure. Let us help you explore the world by water, your way.</p>
      </article>
    </main>
  );
}
