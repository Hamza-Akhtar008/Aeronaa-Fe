import Image from "next/image";

export default function NorthernLights() {
  return (
    <main className="min-h-screen bg-white">
      <section className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-10 mb-8 border-b border-blue-100">
        <div className="max-w-3xl mx-auto flex flex-col items-center px-4 text-center">
          <Image src="/images/aeronalogo.png" alt="Aeronaa Logo" width={200} height={200} className="mb-4" priority />
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Northern Lights Adventure</h1>
          <p className="text-lg text-blue-800 mb-2">Experience the magic of the Aurora Borealis</p>
        </div>
      </section>
      <article className="max-w-2xl mx-auto px-4 py-8 prose prose-blue">
        <h2>What Are the Northern Lights?</h2>
        <p>The Northern Lights, or Aurora Borealis, are a mesmerizing natural phenomenon that lights up the night sky in vibrant shades of green, pink, and purple. Caused by solar particles colliding with the Earth's atmosphere, these lights are best viewed in the Arctic Circle during the winter months. The experience of seeing the auroras dance across the sky is truly unforgettable and often described as magical.</p>
        <h2>Where to See Them</h2>
        <p>Top destinations for viewing the Northern Lights include Norway, Iceland, Finland, Sweden, and Canada. Each location offers unique experiences, such as staying in glass igloos, snow hotels, or cozy lodges. Activities like dog sledding, snowmobiling, and ice fishing can be combined with your aurora adventure for a complete Arctic experience.</p>
        <h2>Tips for the Best Experience</h2>
        <ul>
          <li>Visit between September and March for the highest chance of sightings.</li>
          <li>Choose remote locations away from city lights for optimal viewing.</li>
          <li>Dress warmly in layers and bring a camera with manual settings to capture the lights.</li>
          <li>Be patient—nature is unpredictable, but the wait is worth it!</li>
        </ul>
        <h2>Why Book with Aeronaa?</h2>
        <p>Our expert guides, curated itineraries, and local partnerships ensure you have a safe, memorable, and awe-inspiring Northern Lights adventure. We handle all logistics, from transportation to accommodation, so you can focus on enjoying the show. Join Aeronaa for a once-in-a-lifetime journey beneath the auroras.</p>
        <h2>Ready to Chase the Lights?</h2>
        <p>Contact Aeronaa to start planning your Northern Lights adventure. Let us help you create memories that will last a lifetime.</p>
      </article>
    </main>
  );
}
