import { useState } from "react";
import { Layers, Maximize2, ZoomIn, ZoomOut, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type FloorLevel = {
  id: string;
  name: string;
  sqft: string;
  rooms: string;
  ceilingHeight: string;
  image: string;
  highlights: string[];
};

const DEFAULT_FLOORS: FloorLevel[] = [
  {
    id: "level-1",
    name: "Main Living & Pool Level",
    sqft: "2,850 sq ft",
    rooms: "Grand Salon, Chef Kitchen, Wine Cellar, Covered Loggia",
    ceilingHeight: "12' - 14' Beamed",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    highlights: [
      "Seamless indoor-outdoor sliding structural glass pocket doors",
      "Custom prep pantry with secondary dishwasher & Sub-Zero refrigeration",
      "Direct walk-out access to zero-edge infinity pool & outdoor summer kitchen",
    ],
  },
  {
    id: "level-2",
    name: "Upper Private Suite Level",
    sqft: "2,550 sq ft",
    rooms: "Primary Suite, 3 Ensuite Bedrooms, Media Lounge, Laundry",
    ceilingHeight: "10' Coffered",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80",
    highlights: [
      "Dual walk-in boutique dressing rooms with custom LED-lit cabinetry",
      "Spa primary bath with soaking tub overlooking sunset views and steam shower",
      "Private cantilevered terrace off the primary bedroom suite",
    ],
  },
  {
    id: "level-3",
    name: "Rooftop Sky Deck & Spa",
    sqft: "1,200 sq ft (Outdoor)",
    rooms: "Observation Lounge, Outdoor Fireplace, Sky Bar",
    ceilingHeight: "Open Air",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
    highlights: [
      "360-degree panoramic vista across waterfront and surrounding canopy",
      "Built-in gas firepit with custom teak perimeter benching",
      "Structural reinforcement for hot tub and rooftop catering setups",
    ],
  },
];

export function FloorPlanViewer({
  floors = DEFAULT_FLOORS,
  propertyName,
}: {
  floors?: FloorLevel[];
  propertyName?: string;
}) {
  const [activeFloor, setActiveFloor] = useState(floors[0]?.id ?? "level-1");
  const [zoomLevel, setZoomLevel] = useState(100);

  const current = floors.find((f) => f.id === activeFloor) ?? floors[0]!;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-accent">
            <Layers className="size-5" aria-hidden="true" />
            <span className="eyebrow text-xs font-bold text-accent">Architectural Layout</span>
          </div>
          <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
            Interactive Floor Plans & Schematics
          </h3>
          {propertyName && <p className="text-xs text-muted-foreground mt-0.5">{propertyName}</p>}
        </div>

        {/* Floor Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-muted/60 p-1.5 rounded-lg border border-border">
          {floors.map((floor) => (
            <button
              key={floor.id}
              type="button"
              onClick={() => {
                setActiveFloor(floor.id);
                setZoomLevel(100);
              }}
              className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeFloor === floor.id
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/60"
              }`}
            >
              {floor.name}
            </button>
          ))}
        </div>
      </div>

      {/* Plan Visualizer Container */}
      <div className="relative overflow-hidden rounded-lg border border-border bg-slate-950/90 text-white min-h-[380px] flex items-center justify-center">
        <div
          className="relative size-full transition-transform duration-300 flex items-center justify-center p-4"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          <img
            src={current.image}
            alt={`${current.name} architectural view`}
            className="max-h-[440px] w-full rounded object-cover shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none rounded" />
          <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="rounded bg-accent/90 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent-foreground">
                  {current.sqft}
                </span>
                <h4 className="font-display text-xl font-semibold mt-1">{current.name}</h4>
                <p className="text-xs text-white/80">{current.rooms}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-white/60 block">Ceilings</span>
                <span className="text-sm font-semibold">{current.ceilingHeight}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zoom Controls Overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-md p-1 border border-white/20">
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-white hover:bg-white/20 hover:text-accent"
            onClick={() => setZoomLevel((z) => Math.max(80, z - 15))}
            title="Zoom Out"
          >
            <ZoomOut className="size-4" />
          </Button>
          <span className="text-xs font-semibold px-1 text-white/80">{zoomLevel}%</span>
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-white hover:bg-white/20 hover:text-accent"
            onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
            title="Zoom In"
          >
            <ZoomIn className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-white hover:bg-white/20 hover:text-accent"
            onClick={() => setZoomLevel(100)}
            title="Reset Zoom"
          >
            <Maximize2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Highlights List */}
      <div className="rounded-lg bg-muted/40 p-5 space-y-3">
        <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
          <Sparkles className="size-3.5 text-accent" />
          Level Highlights & Architectural Features
        </h5>
        <ul className="grid gap-2.5 sm:grid-cols-3">
          {current.highlights.map((highlight, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
              <Check className="size-4 shrink-0 text-accent mt-0.5" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
