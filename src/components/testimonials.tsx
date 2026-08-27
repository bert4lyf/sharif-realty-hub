import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Review } from "@/lib/types";

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "rev-1",
    author_name: "Jonathan & Claire Vance",
    author_location: "Greenwich & Palm Beach",
    avatar_url: null,
    is_approved: true,
    rating: 5,
    quote: "Majeed Sharif navigated our waterfront acquisition with surgical discretion. His market intelligence and immediate responsiveness set a gold standard in luxury real estate.",
    created_at: new Date().toISOString(),
  },
  {
    id: "rev-2",
    author_name: "Dr. Alistair Sterling",
    author_location: "Waterbury Estate Owner",
    avatar_url: null,
    is_approved: true,
    rating: 5,
    quote: "Selling our historic multi-acre estate in record time for 98% of asking price was extraordinary. Sharif Realty's bespoke staging and marketing reach made all the difference.",
    created_at: new Date().toISOString(),
  },
  {
    id: "rev-3",
    author_name: "Elena Rostova",
    author_location: "Private Equity Portfolio",
    avatar_url: null,
    is_approved: true,
    rating: 5,
    quote: "Flawless execution on our 1031 commercial portfolio transition. Sharif Realty brings unmatched financial acuity and institutional rigor to every private negotiation.",
    created_at: new Date().toISOString(),
  },
];

export function Testimonials({ reviews }: { reviews?: Review[] }) {
  const items = reviews && reviews.length > 0 ? reviews : DEFAULT_REVIEWS;

  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent>
        {items.map((review) => (
          <CarouselItem key={review.id} className="sm:basis-1/2 lg:basis-1/3">
            <figure className="flex h-full flex-col justify-between gap-5 rounded-sm border border-border bg-card p-6">
              <div className="space-y-4">
                <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={
                        index < review.rating
                          ? "size-4 fill-accent text-accent"
                          : "size-4 text-muted-foreground"
                      }
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground">
                  “{review.quote}”
                </blockquote>
              </div>
              <figcaption className="flex items-center gap-3 border-t border-border pt-4">
                <Avatar className="size-10">
                  {review.avatar_url && (
                    <AvatarImage
                      src={review.avatar_url}
                      alt={`Photo of ${review.author_name}`}
                      loading="lazy"
                    />
                  )}
                  <AvatarFallback>{review.author_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">{review.author_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Verified client · {review.author_location ?? "South Florida"}
                  </p>
                </div>
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-6 flex justify-end gap-2">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  );
}
