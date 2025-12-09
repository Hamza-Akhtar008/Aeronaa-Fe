import Image from "next/image";

export default function WorkWithUsPage() {
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
            Work With Us
          </h1>
          <p className="text-lg sm:text-xl text-blue-800 max-w-2xl mb-2 font-medium">
            Join our journey. Shape the future of travel.
          </p>
          <p className="text-gray-600 max-w-2xl">
            At Aeronaa, we believe in the power of collaboration, creativity, and a
            shared passion for making travel better for everyone. Whether you're
            seeking a career or a partnership, we want to hear from you.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          Why Work With Aeronaa?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-50 rounded-xl p-6 shadow text-center">
            <h3 className="font-bold text-blue-700 mb-2">Innovation</h3>
            <p className="text-gray-600 text-sm">
              We embrace new ideas and technologies to create a smarter, more
              seamless travel experience.
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow text-center">
            <h3 className="font-bold text-blue-700 mb-2">Diversity</h3>
            <p className="text-gray-600 text-sm">
              Our team and partners come from all over the world, bringing unique
              perspectives and talents.
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow text-center">
            <h3 className="font-bold text-blue-700 mb-2">Growth</h3>
            <p className="text-gray-600 text-sm">
              We support personal and professional growth, offering opportunities
              to learn and lead.
            </p>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            Open Opportunities
          </h3>
          <p className="text-gray-700 mb-4">
            We're always looking for talented people and partners. If you don't
            see a role that fits, reach out anyway!
          </p>
          <a
            href="mailto:info@aeronaa.com"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors mb-2"
          >
            Email Us: info@aeronaa.com
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full bg-blue-50 py-10 mt-8 border-t border-blue-100">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h3 className="text-2xl font-bold text-blue-900 mb-2">
            Contact Details
          </h3>
          <div className="flex flex-col items-center gap-2 text-gray-700">
            <div>
              <span className="font-semibold">Address:</span>{" "}
              195, High Street Road Leytonstone, Stratford, London, UK
            </div>
            <div>
              <span className="font-semibold">Email:</span>{" "}
              <a
                href="mailto:info@aeronaa.com"
                className="text-blue-600 underline"
              >
                info@aeronaa.com
              </a>
            </div>
            <div>
              <span className="font-semibold">Phone:</span>{" "}
               +447746660080, +442033931178
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
