export interface Property {
  name: string;
  imageQuery: string;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  perNight: boolean;
  amenities: string[];
  type: string;
  distance: string;
  topRated: boolean;
  deals: string[];
  description?: string;
}

export const properties: Property[] = [
  { 
    name: "Palm Vista", 
    imageQuery: "luxury resort dubai", 
    image: "/palmvesta.png",
    location: "Dubai, UAE", 
    rating: 4.8, 
    reviews: 246, 
    price: "$199",
    perNight: true,
    amenities: ["Pool", "Spa", "Beach Access", "Free WiFi", "Restaurant", "Room Service", "Gym", "Concierge"],
    type: "Luxury Resort",
    distance: "0.3 km from beach",
    topRated: true,
    deals: ["Free cancellation", "Breakfast included"],
    description: "Enjoy an exquisite stay at Palm Vista, where luxury meets comfort. This upscale beachfront resort features world-class amenities and stunning views of the Arabian Gulf. With spacious rooms and suites, each designed with elegant furnishings and modern technology, your stay promises to be memorable and relaxing."
  },  { 
      name: "Ocean Breeze", 
      imageQuery: "beach hotel karachi", 
      image: "/Lahore.png", 
      location: "Karachi, PK", 
      rating: 4.6, 
      reviews: 182, 
      price: "$149",
      perNight: true,
      amenities: ["Sea View", "Restaurant", "Gym", "Free WiFi", "Private Beach", "Airport Shuttle", "Business Center"],
      type: "Boutique Hotel",
      distance: "Beachfront",
      topRated: false,
      deals: ["Free cancellation"],
      description: "Ocean Breeze offers a tranquil escape with beautiful sea views and modern amenities. This beachfront property combines traditional Pakistani hospitality with contemporary luxury, making it an ideal choice for both leisure and business travelers."
    },
    { 
      name: "Green Valley", 
      imageQuery: "resort lahore garden", 
      image: "/Karachi.png",
      location: "Lahore, PK", 
      rating: 4.7, 
      reviews: 215, 
      price: "$169",
      perNight: true,
      amenities: ["Garden", "Pool", "Restaurant", "Free WiFi", "Conference Room", "Spa", "Children's Playground"],
      type: "Resort",
      distance: "2 km from city center",
      topRated: true,
      deals: ["Breakfast included", "Free parking"],
      description: "Green Valley is a lush oasis in the heart of Lahore. Set amidst beautiful gardens, this resort offers spacious rooms, excellent dining options, and comprehensive recreational facilities. Perfect for families, couples, and corporate retreats."
    },
    { 
      name: "Skyline Residency", 
      imageQuery: "luxury hotel islamabad", 
      image: "/Islamabad.png",
      location: "Islamabad, PK", 
      rating: 4.9, 
      reviews: 198, 
      price: "$189",
      perNight: true,
      amenities: ["City View", "Spa", "Restaurant", "Free WiFi", "Executive Lounge", "Meeting Rooms", "Fitness Center"],
      type: "Luxury Hotel",
      distance: "City center",
      topRated: true,
      deals: ["Free cancellation", "Breakfast included"],
      description: "Experience luxury and sophistication at Skyline Residency, located in the heart of Islamabad. With panoramic views of the city and the Margalla Hills, this premium hotel offers elegant accommodations, gourmet dining, and top-notch business facilities."
    },
    { 
      name: "Maldives Retreat", 
      imageQuery: "luxury overwater bungalow maldives", 
      image: "/placeholder.jpg",
      location: "Malé, Maldives", 
      rating: 4.9, 
      reviews: 310, 
      price: "$499",
      perNight: true,
      amenities: ["Overwater Bungalow", "Private Pool", "Snorkeling", "Free WiFi", "Spa", "Fine Dining", "Butler Service", "Water Sports"],
      type: "Luxury Resort",
      distance: "Beachfront",
      topRated: true,
      deals: ["Free cancellation", "Breakfast included"],
      description: "Escape to paradise at Maldives Retreat, featuring luxurious overwater bungalows with direct access to the crystal-clear waters of the Indian Ocean. Immerse yourself in the ultimate tranquility with private pools, personalized butler service, and world-class dining experiences surrounded by breathtaking natural beauty."
    },
    { 
      name: "Manhattan Suites", 
      imageQuery: "luxury hotel manhattan skyline view", 
      image: "/placeholder.jpg",
      location: "New York, USA", 
      rating: 4.7, 
      reviews: 428, 
      price: "$349",
      perNight: true,
      amenities: ["City View", "Spa", "Fitness Center", "Free WiFi", "Rooftop Bar", "Fine Dining", "Concierge", "Business Center"],
      type: "Luxury Hotel",
      distance: "Central Manhattan",
      topRated: true,
      deals: ["Free cancellation"],
      description: "Experience the pulse of New York City at Manhattan Suites, where sophisticated urban design meets unparalleled luxury. Enjoy breathtaking skyline views, exquisite dining, and easy access to the city's iconic attractions, shopping, and entertainment. The perfect base for both business and leisure travelers in the city that never sleeps."
    },
    { 
      name: "Santorini Cliffside", 
      imageQuery: "santorini greece luxury hotel view", 
      image: "/placeholder.jpg",
      location: "Santorini, Greece", 
      rating: 4.9, 
      reviews: 352, 
      price: "$289",
      perNight: true,
      amenities: ["Infinity Pool", "Sea View", "Restaurant", "Free WiFi", "Private Balcony", "Spa", "Wine Tasting", "Sunset Views"],
      type: "Boutique Hotel",
      distance: "Caldera View",
      topRated: true,
      deals: ["Free cancellation", "Breakfast included"],
      description: "Perched on the cliffs of Santorini, this stunning boutique hotel offers uninterrupted views of the Aegean Sea and the famous caldera. The white-washed suites with private terraces, infinity pools that blend with the horizon, and authentic Greek hospitality create an unforgettable Mediterranean escape."
    },
    { 
      name: "Tokyo Towers", 
      imageQuery: "luxury hotel tokyo skyline", 
      image: "/placeholder.jpg",
      location: "Tokyo, Japan", 
      rating: 4.8, 
      reviews: 271, 
      price: "$279",
      perNight: true,
      amenities: ["City View", "Hot Springs", "Restaurant", "Free WiFi", "Japanese Garden", "Sushi Bar", "Tea Ceremony", "Technology Hub"],
      type: "Luxury Hotel",
      distance: "1 km from Tokyo Tower",
      topRated: true,
      deals: ["Free cancellation"],
      description: "Tokyo Towers blends traditional Japanese elegance with modern luxury in the heart of Tokyo. Featuring panoramic city views, authentic hot springs, and sleek contemporary design, this urban oasis offers the perfect balance between Japan's rich cultural heritage and its cutting-edge innovation."
    },
    { 
      name: "Bali Beachfront Villa", 
      imageQuery: "luxury beach villa bali", 
      image: "/placeholder.jpg",
      location: "Bali, Indonesia", 
      rating: 4.8, 
      reviews: 389, 
      price: "$229",
      perNight: true,
      amenities: ["Private Beach", "Infinity Pool", "Spa", "Free WiFi", "Personal Chef", "Yoga Deck", "Garden", "Water Sports"],
      type: "Private Villa",
      distance: "Beachfront",
      topRated: true,
      deals: ["Free cancellation", "Breakfast included"],
      description: "Experience the magic of Bali in your own private beachfront villa. Surrounded by lush tropical gardens and just steps from pristine white sands, this exclusive retreat offers personalized service, authentic Balinese design, and complete privacy for the ultimate island getaway."
    },
    { 
      name: "Paris Elegance", 
      imageQuery: "luxury hotel paris eiffel view", 
      image: "/placeholder.jpg",
      location: "Paris, France", 
      rating: 4.7, 
      reviews: 412, 
      price: "$299",
      perNight: true,
      amenities: ["Eiffel Tower View", "Restaurant", "Bar", "Free WiFi", "Concierge Service", "Spa", "Airport Transfer", "Shopping Service"],
      type: "Boutique Hotel",
      distance: "0.6 km from Eiffel Tower",
      topRated: false,
      deals: ["Breakfast included"],
      description: "Paris Elegance embodies French sophistication in the heart of the City of Light. This exquisitely renovated 19th-century building offers rooms with stunning Eiffel Tower views, gourmet dining experiences, and the perfect balance of historic charm and modern comforts, all within walking distance of Paris's most beloved landmarks."
    },
    { 
      name: "Sydney Harbour View", 
      imageQuery: "sydney harbour hotel view", 
      image: "/placeholder.jpg",
      location: "Sydney, Australia", 
      rating: 4.8, 
      reviews: 304, 
      price: "$259",
      perNight: true,
      amenities: ["Harbour View", "Rooftop Pool", "Restaurant", "Free WiFi", "Fitness Center", "Bar", "Business Center", "Concierge"],
      type: "Luxury Hotel",
      distance: "City center",
      topRated: true,
      deals: ["Free cancellation", "Breakfast included"],
      description: "Offering spectacular panoramic views of Sydney Harbour and the Opera House, this premium hotel combines contemporary Australian style with world-class amenities. The rooftop infinity pool, award-winning restaurants, and spacious, elegantly appointed rooms provide an unforgettable Sydney experience."
    },
    { 
      name: "Amazon Eco Lodge", 
      imageQuery: "amazon rainforest eco lodge", 
      image: "/placeholder.jpg",
      location: "Manaus, Brazil", 
      rating: 4.6, 
      reviews: 196, 
      price: "$189",
      perNight: true,
      amenities: ["Jungle View", "Guided Tours", "Organic Food", "Eco-Friendly", "Wildlife Watching", "Canopy Walks", "River Excursions", "Cultural Experiences"],
      type: "Eco Lodge",
      distance: "Inside Amazon Rainforest",
      topRated: true,
      deals: ["All-inclusive", "Free cancellation"],
      description: "Immerse yourself in the heart of the Amazon Rainforest at this sustainable eco-lodge. Built with minimal environmental impact and operated with conservation principles, this unique accommodation offers authentic jungle experiences, wildlife encounters, and cultural exchanges with indigenous communities while providing comfortable amenities in harmony with nature."
    }
];
