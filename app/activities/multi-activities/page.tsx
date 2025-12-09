import Image from "next/image";

export default function MultiActivities() {
  return (
    <main className="min-h-screen bg-white">
      <section className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-10 mb-8 border-b border-blue-100">
        <div className="max-w-3xl mx-auto flex flex-col items-center px-4 text-center">
          <Image src="/images/aeronalogo.png" alt="Aeronaa Logo" width={200} height={200} className="mb-4" priority />
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Multi-Activities</h1>
          <p className="text-lg text-blue-800 mb-2">A world of adventure in one trip</p>
        </div>
      </section>
      <article className="max-w-2xl mx-auto px-4 py-8 prose prose-blue">
        <h2>What Are Multi-Activity Holidays?</h2>
        <p>Multi-activity holidays are the ultimate way to experience more in a single journey. These trips combine a variety of outdoor adventures—such as hiking, biking, kayaking, climbing, and wildlife tours—into one seamless itinerary. Whether you’re an adrenaline seeker or a family looking for fun, multi-activity holidays offer something for everyone, blending excitement, discovery, and relaxation.</p>
        <h2>Who Are They For?</h2>
        <p>These holidays are perfect for active travelers, families, groups of friends, and anyone who wants to maximize their time and try new things. With flexible options for all fitness levels, you can choose your pace and preferred activities.</p>
        <h2>Popular Combinations & Destinations</h2>
        <ul>
          <li><b>Hiking & Kayaking:</b> Trek through scenic mountains by day and paddle tranquil rivers or lakes by afternoon.</li>
          <li><b>Cycling & Wildlife Safaris:</b> Pedal through national parks and spot exotic animals in their natural habitats.</li>
          <li><b>Winter Sports:</b> Mix skiing, snowshoeing, and dog sledding for a snowy adventure in destinations like the Alps or Scandinavia.</li>
          <li><b>Coastal Adventures:</b> Combine snorkeling, stand-up paddleboarding, and coastal hikes for a sun-soaked escape.</li>
        </ul>
        <h2>What to Expect</h2>
        <p>Expect expertly planned itineraries, professional guides, and top-quality equipment. Each day brings a new adventure, with plenty of time to relax, enjoy local cuisine, and immerse yourself in the culture. Safety is always a priority, and activities are tailored to your interests and abilities.</p>
        <h2>Why Book with Aeronaa?</h2>
        <p>At Aeronaa, we specialize in crafting multi-activity holidays that are safe, fun, and unforgettable. Our team handles all logistics, so you can focus on making memories. Enjoy small group sizes, personalized service, and access to unique experiences you won’t find anywhere else.</p>
        <h2>Ready for Your Next Adventure?</h2>
        <p>Contact Aeronaa today to start planning your custom multi-activity holiday. Whether you want to climb mountains, ride waves, or explore forests, we’ll help you create the perfect adventure—your way.</p>
      </article>
    </main>
  );
}
