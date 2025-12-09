export interface hotDeals {
  name: string;
  image: string;
  imageQuery: string;
  properties: string;
  rating: number;
  reviews: string;
  description: string;
  topRated: boolean;
}

export const hotdeal: hotDeals[] = [
  { 
    name: "Hotel One",
    image: "/images/Hotel1.jpg",
    imageQuery: "Hotel is very cool.",
    properties: "2,342 properties",
    rating: 5.0,
    reviews: "12,456",
    description: "Hotel is very cool.",
    topRated: true
  },
  { 
    name: "Serena",
    image: "/images/Serena.jpg",
    imageQuery: "Read more..",
    properties: "1,423 properties",
    rating: 4.0,
    reviews: "8,234",
    description: "Read more..",
    topRated: false
  },
  { 
    name: "Hotel PC",
    image: "/images/PC.jpg",
    imageQuery: "Read more..",
    properties: "943 properties",
    rating: 4.0,
    reviews: "6,543",
    description: "Read more..",
    topRated: false
  }
];
