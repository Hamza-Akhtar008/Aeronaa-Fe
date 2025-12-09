export interface Restaurant {
  name: string;
  image: string;
  imageQuery: string;
  location: string;
  rating: number;
  reviews: number;
  cuisine: string;
  priceRange: string;
  features: string[];
  topDishes: string[];
  timing: string;
  topRated: boolean;
  highlights: string[];
}

export const restaurants: Restaurant[] = [
  { 
    name: "Desert Delight", 
    image: "/todo1.png", 
    imageQuery: "luxury middle eastern restaurant dubai",
    location: "Dubai, UAE", 
    rating: 4.7, 
    reviews: 356, 
    cuisine: "Middle Eastern",
    priceRange: "$$$",
    features: ["Outdoor Seating", "Views", "Reservations"],
    topDishes: ["Hummus", "Shawarma", "Arabic Coffee"],
    timing: "12:00 PM - 11:30 PM",
    topRated: true,
    highlights: ["Certificate of Excellence", "Romantic Atmosphere"]
  },
  { 
    name: "Spice Fusion", 
    image: "/todo2.png", 
    imageQuery: "pakistani restaurant karachi biryani",
    location: "Karachi, PK", 
    rating: 4.5, 
    reviews: 289, 
    cuisine: "Pakistani",
    priceRange: "$$",
    features: ["Delivery", "Takeout", "Family Style"],
    topDishes: ["Biryani", "Karahi", "Naan"],
    timing: "11:30 AM - 11:00 PM",
    topRated: false,
    highlights: ["Local Favorite", "Authentic Cuisine"]
  },
  { 
    name: "Lahori Bites", 
    image: "/todo3.png", 
    imageQuery: "traditional lahore restaurant food",
    location: "Lahore, PK", 
    rating: 4.8, 
    reviews: 412, 
    cuisine: "Traditional",
    priceRange: "$$",
    features: ["Breakfast", "Late Night", "Groups"],
    topDishes: ["Nihari", "Chargha", "Lassi"],
    timing: "7:00 AM - 12:00 AM",
    topRated: true,
    highlights: ["Best Breakfast", "Local Gem"]
  },
  { 
    name: "Mountain View Cafe", 
    image: "/todo4.png", 
    imageQuery: "cafe islamabad margalla hills view",
    location: "Islamabad, PK", 
    rating: 4.6, 
    reviews: 178, 
    cuisine: "Continental",
    priceRange: "$$$",
    features: ["Scenic View", "Outdoor Seating", "Bar"],
    topDishes: ["Steak", "Pasta", "Tiramisu"],
    timing: "10:00 AM - 10:00 PM",
    topRated: true,
    highlights: ["Scenic Views", "Perfect for Date Night"]
  },
  {
    name: "Sakura Japanese",
    image: "/placeholder.jpg",
    imageQuery: "authentic japanese restaurant sushi tokyo",
    location: "Tokyo, Japan",
    rating: 4.9,
    reviews: 521,
    cuisine: "Japanese",
    priceRange: "$$$$",
    features: ["Sushi Bar", "Private Dining", "Sake Selection"],
    topDishes: ["Omakase", "Wagyu Beef", "Fresh Sashimi"],
    timing: "5:00 PM - 11:00 PM",
    topRated: true,
    highlights: ["Michelin Star", "Master Chef"]
  },
  {
    name: "Parisian Bistro",
    image: "/placeholder.jpg",
    imageQuery: "parisian cafe bistro eiffel tower view",
    location: "Paris, France",
    rating: 4.7,
    reviews: 438,
    cuisine: "French",
    priceRange: "$$$$",
    features: ["Outdoor Terrace", "Wine List", "Live Music"],
    topDishes: ["Coq au Vin", "Beef Bourguignon", "Crème Brûlée"],
    timing: "11:00 AM - 11:00 PM",
    topRated: true,
    highlights: ["Authentic French", "Romantic Setting"]
  },
  {
    name: "Manhattan Steakhouse",
    image: "/placeholder.jpg",
    imageQuery: "luxury steakhouse new york manhattan",
    location: "New York, USA",
    rating: 4.8,
    reviews: 612,
    cuisine: "American",
    priceRange: "$$$$",
    features: ["Bar", "Business Meetings", "Private Events"],
    topDishes: ["Dry-Aged Steak", "Lobster Mac & Cheese", "New York Cheesecake"],
    timing: "4:00 PM - 12:00 AM",
    topRated: true,
    highlights: ["Award-Winning", "Celebrity Chef"]
  },
  {
    name: "Santorini Taverna",
    image: "/placeholder.jpg",
    imageQuery: "greek restaurant santorini sunset view",
    location: "Santorini, Greece",
    rating: 4.9,
    reviews: 387,
    cuisine: "Greek",
    priceRange: "$$$",
    features: ["Sunset Views", "Outdoor Dining", "Family-Owned"],
    topDishes: ["Fresh Seafood", "Moussaka", "Baklava"],
    timing: "12:00 PM - 10:00 PM",
    topRated: true,
    highlights: ["Oceanfront", "Authentic Greek Cuisine"]
  },
  {
    name: "Bali Beachfront",
    image: "/placeholder.jpg",
    imageQuery: "bali beach restaurant sunset seafood",
    location: "Bali, Indonesia",
    rating: 4.6,
    reviews: 342,
    cuisine: "Seafood",
    priceRange: "$$$",
    features: ["Beachfront", "Sunset Views", "Fresh Catch"],
    topDishes: ["Grilled Lobster", "Balinese Fish Curry", "Coconut Desserts"],
    timing: "12:00 PM - 10:00 PM",
    topRated: true,
    highlights: ["Romantic Dining", "Live Music"]
  },
  {
    name: "Maldives Overwater",
    image: "/placeholder.jpg",
    imageQuery: "maldives overwater restaurant luxury",
    location: "Malé, Maldives",
    rating: 4.9,
    reviews: 276,
    cuisine: "International",
    priceRange: "$$$$$",
    features: ["Overwater Setting", "Private Dining", "Sunset Views"],
    topDishes: ["Seafood Platter", "Reef Fish", "Tropical Desserts"],
    timing: "7:00 AM - 10:00 PM",
    topRated: true,
    highlights: ["Unique Dining Experience", "Underwater Views"]
  },
  {
    name: "Barcelona Tapas",
    image: "/placeholder.jpg",
    imageQuery: "spanish tapas bar barcelona authentic",
    location: "Barcelona, Spain",
    rating: 4.7,
    reviews: 456,
    cuisine: "Spanish",
    priceRange: "$$$",
    features: ["Wine Cellar", "Live Flamenco", "Late Night"],
    topDishes: ["Paella", "Patatas Bravas", "Sangria"],
    timing: "6:00 PM - 2:00 AM",
    topRated: true,
    highlights: ["Local Favorite", "Historic Building"]
  },
  {
    name: "Cairo Nile View",
    image: "/placeholder.jpg",
    imageQuery: "cairo restaurant nile river view",
    location: "Cairo, Egypt",
    rating: 4.5,
    reviews: 324,
    cuisine: "Egyptian",
    priceRange: "$$",
    features: ["River Views", "Shisha", "Live Entertainment"],
    topDishes: ["Koshari", "Stuffed Pigeon", "Um Ali"],
    timing: "11:00 AM - 1:00 AM",
    topRated: false,
    highlights: ["Nile Views", "Traditional Experience"]
  }
];
