import { useState } from "react";
import { Navigation, MapPin, Bed, Bath, Maximize2, ExternalLink, Layers, Eye } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { directionsHref } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { track } from "@/lib/analytics";

export type MapProperty = {
  id: string;
  title: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  price: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  latitude: number;
  longitude: number;
  image?: string;
  images?: string[];
  propertyStatus?: string;
  listingType?: string;
  category?: string;
};

const DEFAULT_PROPERTIES: MapProperty[] = [
  {
    id: "31948",
    title: "Waterbury Connecticut",
    slug: "waterbury-connecticut",
    address: "Southington Ct",
    city: "Southington Ct",
    state: "CT",
    price: 0,
    beds: 3,
    baths: 2,
    sqft: 2400,
    latitude: 41.5542,
    longitude: -73.0423,
    image: "/wp-content/uploads/2025/05/image-16.png",
    listingType: "Residential",
    category: "Residential",
    propertyStatus: "For Sale",
  },
  {
    id: "31207",
    title: "Commercial Property At North Main St Waterbury",
    slug: "commercial-property-at-north-main-st-waterbury",
    address: "North Main St Waterbury",
    city: "Waterbury",
    state: "CT",
    price: 0,
    beds: 0,
    baths: 4,
    sqft: 8500,
    latitude: 41.5835,
    longitude: -73.0368,
    image: "/wp-content/uploads/2025/05/IMG_4535.jpg",
    listingType: "Commercial",
    category: "Commercial",
    propertyStatus: "Commercial",
  },
  {
    id: "31073",
    title: "Single Family 4 Bedrooms 3 Baths",
    slug: "single-family-4-bedrooms-3-baths",
    address: "East Hartford",
    city: "East Hartford",
    state: "CT",
    price: 0,
    beds: 4,
    baths: 3,
    sqft: 2100,
    latitude: 41.7637,
    longitude: -72.6128,
    image: "/wp-content/uploads/2025/05/16-thendara.jpg",
    listingType: "Residential",
    category: "Houses",
    propertyStatus: "For Sale",
  },
];

type Props = {
  properties?: any[];
  className?: string;
  centerAddress?: string;
  zoom?: number;
};

export function PropertyMap({
  properties,
  className = "h-[560px] w-full rounded-2xl overflow-hidden",
  centerAddress = "3125 North Main St Waterbury Ct 06704",
  zoom = 11,
}: Props) {
  const list: MapProperty[] =
    properties && properties.length > 0
      ? properties.map((p) => ({
          id: String(p.id || p.mlsId || Math.random()),
          title: p.title || "Sharif Realty Property",
          slug: p.slug || "property",
          address: p.address || "Waterbury, CT",
          city: p.city || "Waterbury",
          state: p.state || "CT",
          price: p.price || 0,
          beds: p.beds,
          baths: p.baths,
          sqft: p.sqft,
          latitude: p.latitude || 41.5542,
          longitude: p.longitude || -73.0423,
          image: p.image || p.images?.[0] || "/wp-content/uploads/2025/05/image-16.png",
          propertyStatus: p.propertyStatus || p.status || "For Sale",
          listingType: p.listingType || "Residential",
          category: p.category || (p.listingType === "commercial" ? "Commercial" : "Residential"),
        }))
      : DEFAULT_PROPERTIES;

  const [selectedProp, setSelectedProp] = useState<MapProperty>(
    list[0] || (DEFAULT_PROPERTIES[0] as MapProperty),
  );
  const [mapType, setMapType] = useState<"m" | "k">("m"); // 'm' = standard roadmap, 'k' = satellite

  // Construct real-time Google Maps embed URL centered on the selected property or address
  const activeQuery = selectedProp
    ? `${selectedProp.address}, ${selectedProp.city}, ${selectedProp.state}`
    : centerAddress;

  const googleEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    activeQuery
  )}&t=${mapType}&z=${zoom}&output=embed&iwloc=near`;

  return (
    <div className={`relative flex flex-col lg:flex-row border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl ${className}`}>
      {/* Sidebar with property selector list */}
      <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 flex flex-col bg-slate-50 dark:bg-slate-950/90 border-r border-slate-200 dark:border-white/10 max-h-[560px] overflow-y-auto">
        <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-[#B38B59]">Interactive Map</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-[#B38B59] dark:bg-red-950/60">
              {list.length} Verified Locations
            </span>
          </div>
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mt-1">
            Connecticut & Massachusetts
          </h3>
        </div>

        <div className="divide-y divide-slate-200/80 dark:divide-white/10 p-2 space-y-1">
          {list.map((prop) => {
            const isSelected = selectedProp.id === prop.id;
            return (
              <button
                key={prop.id}
                type="button"
                onClick={() => {
                  setSelectedProp(prop);
                  track("map_pin_select", { propertyId: prop.id, title: prop.title });
                }}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex gap-3 items-center ${
                  isSelected
                    ? "bg-white dark:bg-slate-900 border border-[#C5A880] shadow-md ring-1 ring-[#C5A880]/20"
                    : "hover:bg-white/70 dark:hover:bg-slate-900/60 border border-transparent"
                }`}
              >
                <div className="relative size-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="size-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute top-1 left-1 bg-[#0F172A]/90 text-[9px] font-bold text-white px-1.5 py-0.5 rounded">
                    {prop.city}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {prop.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="size-3 text-[#B38B59] flex-shrink-0" />
                    {prop.address}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-[#B38B59]">
                      {prop.category || "Exclusive"}
                    </span>
                    {prop.beds ? (
                      <span className="text-[10px] text-slate-500 font-medium">
                        {prop.beds} Beds · {prop.baths} Baths
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative flex-1 min-h-[350px] lg:min-h-full bg-slate-100 dark:bg-slate-950">
        {/* Map Type Controls Floating Pill */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-200 dark:border-white/10 shadow-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setMapType("m")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              mapType === "m"
                ? "bg-[#0F172A] text-white font-bold"
                : "text-slate-700 dark:text-slate-300 hover:text-black"
            }`}
          >
            Street Map
          </button>
          <button
            type="button"
            onClick={() => setMapType("k")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              mapType === "k"
                ? "bg-[#0F172A] text-white font-bold"
                : "text-slate-700 dark:text-slate-300 hover:text-black"
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Real-time Google Maps Iframe */}
        <iframe
          title={`Google Map - ${activeQuery}`}
          src={googleEmbedUrl}
          loading="lazy"
          className="size-full border-0 min-h-[380px] lg:min-h-full"
          allowFullScreen
        />

        {/* Floating Active Property Card Overlay on Bottom of Map */}
        {selectedProp && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-xl p-4 border border-slate-200 dark:border-white/15 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-red-100 text-[#B38B59] dark:bg-red-950/60 mb-1">
                  {selectedProp.listingType || "Featured Property"}
                </span>
                <h4 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                  {selectedProp.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="size-3.5 text-[#B38B59] flex-shrink-0" />
                  {selectedProp.address}, {selectedProp.city}, {selectedProp.state}
                </p>
              </div>

              <span className="text-xs font-bold text-[#B38B59] uppercase tracking-wider whitespace-nowrap">
                {selectedProp.category || "Exclusive"}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2">
              <Button asChild size="sm" className="h-9 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold">
                <a
                  href={directionsHref(`${selectedProp.address}, ${selectedProp.city}, ${selectedProp.state}`)}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => track("get_directions", { destination: selectedProp.address })}
                >
                  <Navigation className="size-3.5 mr-1.5" />
                  Get Directions
                </a>
              </Button>

              <Button asChild size="sm" variant="outline" className="h-9 text-xs border-slate-300 dark:border-white/20">
                <Link to="/properties/$id" params={{ id: selectedProp.slug }}>
                  <Eye className="size-3.5 mr-1.5" />
                  View Listing
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
