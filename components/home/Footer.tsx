"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  MapPin,
  Mail,
  Phone,
  LocateIcon,
  Map,
  Building,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative text-white">
      {/* Top Half: Newsletter Background */}

      {/* Bottom Half: Solid Background */}
      <div className=" bg-[linear-gradient(to_bottom,white_0%,white_30%,#0a3a7a_30%,#0a3a7a_100%)]">
        <div className="px-6 py-16">
          <div className="container mx-auto">
            <div className="relative rounded-3xl overflow-hidden border-4 border-white">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src="/images/subscribeimg.png"
                  alt="Travel couple"
                  fill

                  className="object-cover object-center-right"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/60 via-slate-500/40 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative flex flex-col sm:flex-row px-4 sm:px-8 md:px-12 py-12 sm:py-16 ">

                <div className="w-full max-w-xl mx-auto sm:mx-0 text-center sm:text-left">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-white">
                    Subscribe Newsletter
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-white/90">
                    Get inspired! Receive travel discounts, tips and
                    behind the scenes stories.
                  </p>

                  {/* Input & Button */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border-0"
                    />
                    <button className="bg-[#0a3a7a] hover:bg-[#1d4ed8] px-6 sm:px-8 py-3 sm:py-4 rounded-md text-white font-medium transition-colors whitespace-nowrap">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Content */}
        <div className="py-16 ">
          <div className="container   w-full  max-w-[98rem] mx-auto px-2 sm:px-4 lg:px-6 pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
              {/* Logo and Social */}
              <div className="lg:col-span-1 col-span-2">
                <div className="flex items-center mb-8 justify-center lg:justify-start">
                  <Link href="/" passHref>
                    <Image
                      src="/images/footerlogo.png"
                      alt="Aerona Logo"
                      width={200}
                      height={200}
                      priority
                      className="cursor-pointer"
                    />
                  </Link>
                </div>
                <div className="flex justify-center lg:justify-start space-x-4">
                  <Link
                    href="#"
                    className="hover:text-white/80 transition-colors"
                  >
                    <Facebook size={24} />
                  </Link>
                  <Link
                    href="#"
                    className="hover:text-white/80 transition-colors"
                  >
                    <Twitter size={24} />
                  </Link>
                  <Link
                    href="#"
                    className="hover:text-white/80 transition-colors"
                  >
                    <Youtube size={24} />
                  </Link>
                  <Link
                    href="#"
                    className="hover:text-white/80 transition-colors"
                  >
                    <Instagram size={24} />
                  </Link>
                </div>
              </div>

         
              {/* Our Activities */}
              <div>
                <h3 className="text-xl mb-4 sm:mb-6">Our Activities</h3>
                <ul className="space-y-2 sm:space-y-3  sm:text-left">
                  <li>
                    <Link
                      href="/activities/northern-lights"
                      className="text-white/80 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Northern Lights
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/activities/cruising-sailing"
                      className="text-white/80 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Cruising & sailing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/activities/multi-activities"
                      className="text-white/80 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Multi-activities
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/activities/kayaking"
                      className="text-white/80 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Kayaking
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Travel Blogs */}
              <div>
                <h3 className="text-xl mb-4 sm:mb-6">Travel Blogs</h3>
                <ul className="space-y-2 sm:space-y-3 sm:text-left">
                  <li>
                    <Link
                      href="/blog/bali-travel-guide"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors whitespace-nowrap"
                    >
                      Bali Travel Guide
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog/sri-lanka-travel-guide"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors whitespace-nowrap"
                    >
                      Sri Lanka Travel Guide
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog/peru-travel-guide"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors whitespace-nowrap"
                    >
                      Peru Travel Guide
                    </Link>
                  </li>
                </ul>
              </div>

              {/* About Us */}
              <div>
                <h3 className="text-xl mb-4 sm:mb-6">About Us</h3>
                <ul className="space-y-2 sm:space-y-3  sm:text-left">
                  <li>
                    <Link
                      href="/our-story"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      Our Story
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/work-with-us"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      Work with us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Us */}
              <div>
                <h3 className="font-bold text-lg mb-4">
                  Contact Detail
                </h3>
                
                <ul className="space-y-3 text-sm">
                 
                  <li className="flex gap-2">
                    <Mail className="text-blue-400" size={20} />
                    <Link
                      href="mailto:info@aeronaa.com"
                      className=" hover:underline"
                    >
                      info@aeronaa.com
                    </Link>
                  </li>
                   <li className="flex  gap-2">
                    <Building className="text-blue-400" size={60} />
                    <span>Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates</span>
                  </li>
                 
                  <li className="flex  gap-2">
                    <Phone className="text-blue-400" size={20} />
                    <span>+447746660080</span>
                  </li>
                  <li className="flex  gap-2">
                    <Phone className="text-blue-400" size={20} />
                    <span>+971 55 511 6556</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-black py-4">
          <div className="container mx-auto px-6">
            <div className="text-center text-white/70 text-sm">
              © 2025 Aeronaa | Designed By Firnas.Tech | All Rights
              Reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
