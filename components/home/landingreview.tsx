import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const reviews = [
  {
    id: 1,
    name: "Hannah Parker",
    avatar: "/images/review1.png",
    rating: 5,
    text: "The book club has been such a wonderful experience. I’ve met like-minded people, discovered amazing authors, and genuinely feel part of a community.",
    hasImage: false,
  },
  {
    id: 2,
    name: "Samuel Frost",
    avatar: "/images/review2.png",
    rating: 5,
    text: "",
    hasImage: true,
    image: "/images/review1img.png",
    title: "A Guide to Fantasy Worlds",
    description:
      "An incredible deep-dive into world-building. From Tolkien’s Middle-earth to modern fantasy realms, this guide gave me new appreciation for storytelling craft.",
  },
  {
    id: 3,
    name: "Grace Sutton",
    avatar: "/images/review3.png",
    rating: 5,
    text: "I’ve been reading along for a few months now, and every recommendation has been spot-on. It’s refreshing to have a trusted source for great books.",
    hasImage: false,
  },
  {
    id: 4,
    name: "Ethan Hughes",
    avatar: "/images/review4.png",
    rating: 5,
    text: "",
    hasImage: true,
    image: "/images/review2img.png",
    title: "How to Build a Reading Habit",
    description:
      "This article gave me practical strategies to stay consistent with daily reading. I now finish at least one book every month thanks to these tips.",
  },
  {
    id: 5,
    name: "Olivia Turner",
    avatar: "/images/review5.png",
    rating: 5,
    text: "",
    hasImage: true,
    image: "/images/review3img.png",
    title: "Top Mystery Novels",
    description:
      "A brilliant curated list of mystery novels. I picked up two from this article and couldn’t put them down. Highly recommended for thriller fans!",
  },
  {
    id: 6,
    name: "Emma Bennett",
    avatar: "/images/review6.png",
    rating: 5,
    text: "I love how interactive this platform is — not just reviews, but real discussions around books. It makes the reading journey so much richer.",
    hasImage: false,
  },
];

export function Reviews() {
  return (
    <section className=" px-4 sm:px-0 w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
            <h1 className="  text-black  text-[32px] font-bold">Reviews</h1>
     
      </div>

      <p className="text-muted-foreground ">What people says about Golobe facilities</p>

      {/* Reviews Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 ">
        {reviews.map((review) => (
          <div key={review.id} className="mb-6 break-inside-avoid">
            <Card className="overflow-hidden border-lg shadow-sm bg-card">
              <CardContent className="p-6">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                    <AvatarFallback>
                      {review.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{review.name}</h3>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">5/5</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                {review.image ? (
                  <div className="space-y-2">
                    <img
                      src={review.image}
                      alt={review.title}
                      className="w-full object-cover rounded-lg" // removed fixed h-48
                    />
                    <div>
                      <h4 className="text-lg text-foreground mb-2">
                        {review.title}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {review.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className=" text-lg text-foreground mb-2">
                      {review.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {review.text || review.description}
                    </p>
                  </div>
                )}

              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* View All Button */}

    </section>
  )
}

