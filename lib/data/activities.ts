export interface Activity {
  name: string;
  image: string;
  imageQuery: string;
  location: string;
  rating: number;
  reviews: string;
  price: string;
  description: string;
  topRated: boolean;
  category: string;
}

export const activities: Activity[] = [
  {
    name: "Desert Safari",
    image: "/todo1.png",
    imageQuery: "dubai desert safari sunset camels",
    location: "Dubai, UAE",
    rating: 4.8,
    reviews: "5,623",
    price: "$75",
    description: "Experience thrilling dune bashing and traditional entertainment",
    topRated: true,
    category: "Adventure"
  },
  {
    name: "Historic Tour",
    image: "/todo2.png",
    imageQuery: "lahore badshahi mosque fort tour",
    location: "Lahore, Pakistan",
    rating: 4.7,
    reviews: "3,241",
    price: "$40",
    description: "Explore ancient architecture and cultural sites",
    topRated: true,
    category: "Cultural"
  },
  {
    name: "Beach Day",
    image: "/todo3.png",
    imageQuery: "karachi beach sunset clifton",
    location: "Karachi, Pakistan",
    rating: 4.5,
    reviews: "2,876",
    price: "$25",
    description: "Relax by the Arabian Sea with water sports",
    topRated: false,
    category: "Relaxation"
  },
  {
    name: "Mountain Hike",
    image: "/todo4.png",
    imageQuery: "islamabad margalla hills hiking trail",
    location: "Islamabad, Pakistan",
    rating: 4.6,
    reviews: "1,954",
    price: "$30",
    description: "Scenic trails with breathtaking views",
    topRated: true,
    category: "Nature"
  },
  {
    name: "Eiffel Tower Visit",
    image: "/placeholder.jpg",
    imageQuery: "paris eiffel tower visit tourists",
    location: "Paris, France",
    rating: 4.8,
    reviews: "12,345",
    price: "$60",
    description: "Iconic landmark with panoramic city views",
    topRated: true,
    category: "Sightseeing"
  },
  {
    name: "Shibuya Crossing Tour",
    image: "/placeholder.jpg",
    imageQuery: "tokyo shibuya crossing pedestrians",
    location: "Tokyo, Japan",
    rating: 4.7,
    reviews: "8,765",
    price: "$45",
    description: "Experience the world's busiest pedestrian crossing",
    topRated: true,
    category: "Urban"
  },
  {
    name: "Central Park Bike Tour",
    image: "/placeholder.jpg",
    imageQuery: "new york central park biking tour",
    location: "New York, USA",
    rating: 4.9,
    reviews: "6,543",
    price: "$55",
    description: "Explore the green heart of Manhattan on wheels",
    topRated: true,
    category: "Active"
  },
  {
    name: "Santorini Sunset Cruise",
    image: "/placeholder.jpg",
    imageQuery: "santorini sunset catamaran cruise",
    location: "Santorini, Greece",
    rating: 4.9,
    reviews: "4,321",
    price: "$120",
    description: "Sail around the caldera at sunset with dinner",
    topRated: true,
    category: "Romantic"
  },
  {
    name: "Bali Temple Tour",
    image: "/placeholder.jpg",
    imageQuery: "bali water temple ulun danu",
    location: "Bali, Indonesia",
    rating: 4.8,
    reviews: "5,678",
    price: "$50",
    description: "Discover sacred temples and Balinese culture",
    topRated: true,
    category: "Cultural"
  },
  {
    name: "Maldives Snorkeling",
    image: "/placeholder.jpg",
    imageQuery: "maldives snorkeling coral reef fishes",
    location: "Malé, Maldives",
    rating: 4.9,
    reviews: "3,456",
    price: "$85",
    description: "Explore vibrant coral reefs and marine life",
    topRated: true,
    category: "Water"
  },
  {
    name: "Sagrada Familia Tour",
    image: "/placeholder.jpg",
    imageQuery: "barcelona sagrada familia interior tour",
    location: "Barcelona, Spain",
    rating: 4.8,
    reviews: "7,890",
    price: "$45",
    description: "Guided tour of Gaudí's architectural masterpiece",
    topRated: true,
    category: "Architecture"
  },
  {
    name: "Pyramids Excursion",
    image: "/placeholder.jpg",
    imageQuery: "cairo giza pyramids sphinx tour",
    location: "Cairo, Egypt",
    rating: 4.7,
    reviews: "6,789",
    price: "$70",
    description: "Discover ancient Egyptian wonders with expert guides",
    topRated: true,
    category: "Historical"
  }
];
