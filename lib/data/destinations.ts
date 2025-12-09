export interface Destination {
  name: string;
  image: string;
  imageQuery: string;
  properties: string;
  rating: number;
  reviews: string;
  description: string;
  topRated: boolean;
}

export const destinations: Destination[] = [
  { 
    name: "Dubai",
    image: "/Dubai.png",
    imageQuery: "dubai skyline burj khalifa night",
    properties: "2,342 properties",
    rating: 4.8,
    reviews: "12,456",
    description: "Luxury shopping, ultramodern architecture",
    topRated: true
  },
  { 
    name: "Lahore",
    image: "/Lahore.png",
    imageQuery: "lahore badshahi mosque fort",
    properties: "1,423 properties",
    rating: 4.6,
    reviews: "8,234",
    description: "Historical landmarks, cultural heritage",
    topRated: true
  },
  { 
    name: "Karachi",
    image: "/Karachi.png",
    imageQuery: "karachi clifton beach city",
    properties: "1,876 properties",
    rating: 4.5,
    reviews: "9,876",
    description: "Coastal city, vibrant food scene",
    topRated: false
  },
  { 
    name: "Islamabad",
    image: "/Islamabad.png",
    imageQuery: "islamabad faisal mosque margalla hills",
    properties: "943 properties",
    rating: 4.7,
    reviews: "6,543",
    description: "Modern capital, scenic beauty",
    topRated: true
  },
  {
    name: "Paris",
    image: "/placeholder.jpg",
    imageQuery: "paris eiffel tower cityscape sunset",
    properties: "3,567 properties",
    rating: 4.9,
    reviews: "15,789",
    description: "Romance, art, and world-class cuisine",
    topRated: true
  },
  {
    name: "Tokyo",
    image: "/placeholder.jpg",
    imageQuery: "tokyo shibuya crossing night",
    properties: "2,890 properties",
    rating: 4.8,
    reviews: "13,245",
    description: "Modern technology meets ancient traditions",
    topRated: true
  },
  {
    name: "New York",
    image: "/placeholder.jpg",
    imageQuery: "new york manhattan skyline sunset",
    properties: "4,123 properties",
    rating: 4.7,
    reviews: "18,901",
    description: "The city that never sleeps",
    topRated: true
  },
  {
    name: "Santorini",
    image: "/placeholder.jpg",
    imageQuery: "santorini oia sunset white buildings",
    properties: "892 properties",
    rating: 4.9,
    reviews: "9,234",
    description: "Breathtaking views, romantic sunsets",
    topRated: true
  },
  {
    name: "Bali",
    image: "/placeholder.jpg",
    imageQuery: "bali ubud rice terraces sunset",
    properties: "1,765 properties",
    rating: 4.8,
    reviews: "11,432",
    description: "Tropical paradise, cultural experiences",
    topRated: true
  },
  {
    name: "Maldives",
    image: "/placeholder.jpg",
    imageQuery: "maldives overwater villas aerial",
    properties: "456 properties",
    rating: 4.9,
    reviews: "7,654",
    description: "Crystal clear waters, luxury resorts",
    topRated: true
  },
  {
    name: "Barcelona",
    image: "/placeholder.jpg",
    imageQuery: "barcelona sagrada familia aerial",
    properties: "2,234 properties",
    rating: 4.7,
    reviews: "10,567",
    description: "Stunning architecture, Mediterranean charm",
    topRated: true
  },
  {
    name: "Cairo",
    image: "/placeholder.jpg",
    imageQuery: "cairo pyramids giza sphinx",
    properties: "1,543 properties",
    rating: 4.6,
    reviews: "8,765",
    description: "Ancient wonders, rich history",
    topRated: false
  }
];
