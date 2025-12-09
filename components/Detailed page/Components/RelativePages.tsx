'use client'
import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Star, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';

const RelativePages = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [savedItems, setSavedItems] = useState<number[]>([]);
  const [loadingItems, setLoadingItems] = useState<number[]>([]);

  const handleSave = async (id: number) => {
    setLoadingItems(prev => [...prev, id]);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSavedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
    setLoadingItems(prev => prev.filter(itemId => itemId !== id));
  };

  const hotels = [
    {
      id: 1,
      name: "Hotel Moments Budapest",
      location: "Budapest, Hungary",
      image: "/images/one.png",
      rating: 4.9,
      reviews: 4604,
      description: "Check out Hotel Moments Budapest, where cool architecture meets modern vibes in a central location. Its large well-appointed rooms boast great showers, strong Wi-Fi, and loads of storage space, while the helpful staff goes above and beyond to make your stay special. Perfect for both business and leisure travelers, with easy access to restaurants and attractions.",
      link: "#"
    },
    {
      id: 2,
      name: "Shangri-La The Shard",
      location: "London, United Kingdom",
      image: "/images/two.jpg",
      rating: 4.8,
      reviews: 3892,
      description: "Experience luxury at new heights in Western Europe's tallest building. Floor-to-ceiling windows offer spectacular views of London, complemented by exquisite dining and an infinity pool with a view. The perfect blend of British charm and Asian hospitality.",
      link: "#"
    },
    {
      id: 3,
      name: "Grandvrio Ocean Resort",
      location: "Danang, Vietnam",
      image: "/images/four.jpg",
      rating: 4.9,
      reviews: 2772,
      description: "Grandvrio Ocean Resort sets guests up with stunning sea views and pristine beach access. Rooms come with modern amenities and a cozy vibe.",
      link: "#"
    },
    {
      id: 4,
      name: "Gokulam Grand Resort",
      location: "Kovalam, India",
      image: "/images/three.jpg",
      rating: 4.7,
      reviews: 1937,
      description: "This property gives a boutique vibe with its artistic decor and stunning sea views. Right by the beach, it has a relaxing atmosphere.",
      link: "#"
    },
    {
      id: 5,
      name: "Grand Plaza Resort",
      location: "Bali, Indonesia",
      image: "/images/two.jpg",
      rating: 4.7,
      reviews: 2156,
      description: "A stunning property offering luxurious amenities and breathtaking views. Perfect for both leisure and business travelers.",
      link: "#"
    },
    {
      id: 6,
      name: "Azure Bay Hotel",
      location: "Santorini, Greece",
      image: "/images/one.png",
      rating: 4.8,
      reviews: 3245,
      description: "Perched on the cliffs with stunning views of the Aegean Sea. Experience world-class service and unforgettable sunsets.",
      link: "#"
    },
    {
      id: 7,
      name: "Mountain View Lodge",
      location: "Swiss Alps, Switzerland",
      image: "/images/four.jpg",
      rating: 4.6,
      reviews: 1876,
      description: "Nestled in the heart of the Alps, offering luxury accommodation with breathtaking mountain views and premium ski facilities.",
      link: "#"
    },
    {
      id: 8,
      name: "Desert Oasis Resort",
      location: "Dubai, UAE",
      image: "/images/three.jpg",
      rating: 4.9,
      reviews: 2987,
      description: "An exclusive desert retreat combining Arabian luxury with modern comfort. Features private pools and desert adventures.",
      link: "#"
    },
    {
      id: 9,
      name: "Coral Beach Resort",
      location: "Maldives",
      image: "/images/two.jpg",
      rating: 4.8,
      reviews: 3124,
      description: "Overwater villas with direct access to crystal clear waters. Perfect for honeymoons and luxury escapes.",
      link: "#"
    },
    {
      id: 10,
      name: "City Lights Hotel",
      location: "Tokyo, Japan",
      image: "/images/one.png",
      rating: 4.7,
      reviews: 2654,
      description: "Modern luxury in the heart of Tokyo. Featuring spectacular city views and award-winning restaurants.",
      link: "#"
    },
    {
      id: 11,
      name: "Rainforest Eco Lodge",
      location: "Costa Rica",
      image: "/images/four.jpg",
      rating: 4.6,
      reviews: 1932,
      description: "Sustainable luxury in the heart of the rainforest. Unique experiences with nature without compromising on comfort.",
      link: "#"
    },
    {
      id: 12,
      name: "Historic Palace Hotel",
      location: "Prague, Czech Republic",
      image: "/images/three.jpg",
      rating: 4.8,
      reviews: 2876,
      description: "A restored palace offering classical luxury with modern amenities. Located in the heart of historic Prague.",
      link: "#"
    }
  ];

  const toggleReadMore = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-[#023e8a] px-4">For you</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative">
              <Link href={hotel.link || "#"}>
                <div className="relative h-[240px] hover:opacity-90 transition-opacity">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <button
                onClick={() => handleSave(hotel.id)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  savedItems.includes(hotel.id)
                    ? 'bg-[#023e8a] text-white'
                    : 'bg-white text-[#023e8a] hover:bg-[#023e8a] hover:text-white'
                }`}
                disabled={loadingItems.includes(hotel.id)}
              >
                {loadingItems.includes(hotel.id) ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart className={`h-5 w-5 ${savedItems.includes(hotel.id) ? 'fill-current' : ''}`} />
                )}
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#023e8a] line-clamp-2">{hotel.name}</h3>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{hotel.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-[#023e8a] text-[#023e8a]" />
                  <span className="ml-1 font-semibold">{hotel.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-600">({hotel.reviews.toLocaleString()} reviews)</span>
              </div>

              <p className="text-gray-600">
                {expandedItems.includes(hotel.id)
                  ? hotel.description
                  : `${hotel.description.slice(0, 100)}...`}
                <button
                  onClick={() => toggleReadMore(hotel.id)}
                  className="ml-2 text-[#023e8a] hover:underline font-medium"
                >
                  Read {expandedItems.includes(hotel.id) ? 'less' : 'more'}
                </button>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelativePages;
