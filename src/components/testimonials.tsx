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

export function Testimonials({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent>
        {reviews.map((review) => (
          <CarouselItem key={review.id} className="sm:basis-1/2 lg:basis-1/3">
            <figure className="flex h-full flex-col justify-between gap-5 rounded-xl border border-border bg-card p-6">
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
