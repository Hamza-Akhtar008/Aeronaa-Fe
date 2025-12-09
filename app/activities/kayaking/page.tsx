import Image from "next/image";

export default function Kayaking() {
  return (
    <main className="min-h-screen bg-white">
      <section className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-10 mb-8 border-b border-blue-100">
        <div className="max-w-3xl mx-auto flex flex-col items-center px-4 text-center">
          <Image src="/images/aeronalogo.png" alt="Aeronaa Logo" width={200} height={200} className="mb-4" priority />
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Kayaking</h1>
          <p className="text-lg text-blue-800 mb-2">Paddle through stunning landscapes and tranquil waters</p>
        </div>
      </section>
      <article className="max-w-2xl mx-auto px-4 py-8 prose prose-blue">
        <h2>Why Go Kayaking?</h2>
        <p>Kayaking is a versatile and accessible adventure, perfect for exploring rivers, lakes, and coastlines. It offers a unique perspective on nature, allowing you to get close to wildlife and enjoy peaceful surroundings. Whether you’re a beginner or an experienced paddler, kayaking can be tailored to your skill level and interests.</p>
        <h2>Types of Kayaking Adventures</h2>
        <ul>
          <li><b>Sea Kayaking:</b> Glide along dramatic coastlines, explore sea caves, and discover hidden beaches. Sea kayaking is ideal for those who love the ocean and want to experience marine life up close.</li>
          <li><b>River Kayaking:</b> Navigate gentle streams or tackle thrilling rapids. River kayaking offers both peaceful journeys and adrenaline-pumping whitewater adventures.</li>
          <li><b>Lake Kayaking:</b> Enjoy calm waters and scenic views, perfect for families and those seeking a relaxing day on the water. Lakes are great for wildlife spotting and picnics on secluded shores.</li>
        </ul>
        <h2>What to Expect</h2>
        <p>Our kayaking trips include expert instruction, safety briefings, and all necessary equipment. You’ll learn paddling techniques, water safety, and how to make the most of your adventure. Many trips also include opportunities for swimming, fishing, and exploring local culture along the way.</p>
        <h2>Why Book with Aeronaa?</h2>
        <p>Our kayaking experiences are led by experienced guides who know the best routes and hidden gems. We offer trips for all ages and abilities, with flexible itineraries and personalized service. Let Aeronaa help you discover the joy of kayaking in some of the world’s most beautiful locations.</p>
        <h2>Ready to Paddle?</h2>
        <p>Contact Aeronaa to plan your kayaking adventure—whether you want a peaceful paddle or an action-packed expedition, we’ll make it happen.</p>
      </article>
    </main>
  );
}
