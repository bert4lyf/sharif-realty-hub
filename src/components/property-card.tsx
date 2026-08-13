import { Link } from "@tanstack/react-router";
import { Bath, Bed, MapPin, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatPrice, isRentalType, STATUS_LABELS } from "@/lib/format";
import type { Property } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  for_sale: "bg-accent text-accent-foreground",
  for_rent: "bg-accent text-accent-foreground",
  pending: "bg-primary text-primary-foreground",
  sold: "bg-muted text-muted-foreground",
  rented: "bg-muted text-muted-foreground",
};

export function PropertyCard({ property }: { property: Property }) {
  const image = property.images[0];
  const alt = `${property.title} — ${property.address}, ${property.city}, ${property.state}`;

  return (
    <article className="card-lift group overflow-hidden rounded-xl border border-border bg-card">
      <Link
        to="/properties/$id"
        params={{ id: property.slug }}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {image ? (
            <img
              src={image}
              alt={alt}
              loading="lazy"
              decoding="async"
              width={800}
              height={600}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              Photography coming soon
            </div>
          )}
          <Badge
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${STATUS_STYLES[property.status] ?? ""}`}
          >
            {STATUS_LABELS[property.status]}
          </Badge>
        </div>

        <div className="space-y-3 p-5">
          <p className="font-display text-2xl font-semibold text-foreground">
            {formatPrice(Number(property.price), isRentalType(property.listing_type))}
          </p>
          <h3 className="text-base font-semibold leading-snug text-foreground">{property.title}</h3>
          <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
            <span>
              {property.address}, {property.city}, {property.state} {property.zip}
            </span>
          </p>
          <dl className="flex flex-wrap items-center gap-4 border-t border-border pt-3 text-sm text-muted-foreground">
            {property.beds > 0 && (
              <div className="flex items-center gap-1.5">
                <Bed className="size-4 text-accent" aria-hidden="true" />
                <dt className="sr-only">Bedrooms</dt>
                <dd>{property.beds} bd</dd>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Bath className="size-4 text-accent" aria-hidden="true" />
              <dt className="sr-only">Bathrooms</dt>
              <dd>{Number(property.baths)} ba</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Ruler className="size-4 text-accent" aria-hidden="true" />
              <dt className="sr-only">Interior size</dt>
              <dd>{formatNumber(property.sqft)} sqft</dd>
            </div>
          </dl>
        </div>
      </Link>
    </article>
  );
}
