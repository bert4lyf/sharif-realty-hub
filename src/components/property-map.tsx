import { Navigation, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { directionsHref, mapEmbedSrc } from "@/lib/site";
import { track } from "@/lib/analytics";

type Props = {
  latitude: number | null;
  longitude: number | null;
  label: string;
  destination: string;
  height?: string;
};

export function PropertyMap({ latitude, longitude, label, destination, height = "h-80" }: Props) {
  const hasCoords = typeof latitude === "number" && typeof longitude === "number";

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {hasCoords ? (
        <iframe
          title={`Map showing the location of ${label}`}
          src={mapEmbedSrc(latitude, longitude)}
          loading="lazy"
          className={`w-full ${height} border-0`}
          onLoad={() => track("map_view", { label })}
        />
      ) : (
        <div className={`flex ${height} w-full items-center justify-center bg-muted`}>
          <p className="text-sm text-muted-foreground">Location available on request</p>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4">
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <span>{destination}</span>
        </p>
        <Button asChild size="sm" variant="secondary">
          <a
            href={directionsHref(destination)}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => track("get_directions", { destination })}
          >
            <Navigation className="size-4" aria-hidden="true" />
            Get Directions
          </a>
        </Button>
      </div>
    </div>
  );
}
