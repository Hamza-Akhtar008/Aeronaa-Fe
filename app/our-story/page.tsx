import Image from "next/image";

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-12 mb-8 border-b border-blue-100">
        <div className="max-w-4xl mx-auto flex flex-col items-center px-4 text-center">
          <Image
            src="/images/aeronalogo.png"
            alt="Aeronaa Logo"
            width={200}
            height={200}
            className="mb-4 drop-shadow-lg"
            priority
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 mb-3">
            Our Story
          </h1>
          <p className="text-lg sm:text-xl text-blue-800 max-w-2xl mb-2 font-medium">
            Connecting the world, one journey at a time.
          </p>
          <p className="text-gray-600 max-w-2xl">
            Aeronaa is more than a travel platform—it's a movement to make
            travel seamless, affordable, and inspiring for everyone. Discover how
            our passion became your passport to the world.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="relative border-l-4 border-blue-200 pl-8">
          {/* Timeline Item 1 */}
          <div className="mb-10">
            <div className="absolute -left-5 top-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-1">
              A Dream Takes Flight
            </h2>
            <p className="text-gray-700 mb-2">
              In 2020, a group of passionate travelers and tech enthusiasts came
              together with a vision: to make global travel accessible and joyful
              for all. Aeronaa was born from this shared dream, starting as a
              small project with big ambitions.
            </p>
          </div>
          {/* Timeline Item 2 */}
          <div className="mb-10">
            <div className="absolute -left-5 top-28 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-1">
              Building Connections
            </h2>
            <p className="text-gray-700 mb-2">
              We partnered with airlines, hotels, and local experts to curate
              unique experiences. Our platform grew, powered by innovation and a
              relentless focus on customer happiness.
            </p>
          </div>
          {/* Timeline Item 3 */}
          <div className="mb-10">
            <div className="absolute -left-5 top-56 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-1">
              A Global Community
            </h2>
            <p className="text-gray-700 mb-2">
              Today, Aeronaa connects thousands of travelers and partners
              worldwide. Every booking, every journey, and every story shared is a
              testament to our commitment to making travel better for everyone.
            </p>
          </div>
          {/* Timeline Item 4 */}
          <div>
            <div className="absolute -left-5 top-80 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">4</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-1">
              The Road Ahead
            </h2>
            <p className="text-gray-700 mb-2">
              Our journey is just beginning. We are committed to innovation,
              sustainability, and creating unforgettable experiences for every
              traveler. Thank you for being part of the Aeronaa family.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-blue-50 py-10 mt-8 border-t border-blue-100">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h3 className="text-2xl font-bold text-blue-900 mb-2">
            Ready to start your journey?
          </h3>
          <p className="text-gray-700 mb-4">
            Join us as we continue to connect the world, one adventure at a
            time.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors"
          >
            Explore Aeronaa
          </a>
        </div>
      </section>
    </main>
  );
}
