import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building, Filter, MapPin, Search, Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/format";
import { track } from "@/lib/analytics";

export type SearchValues = {
  type: "buy" | "rent" | "commercial";
  q: string;
  max: number;
  beds: number;
  baths: number;
  category?: string;
};

const TYPES: { value: SearchValues["type"]; label: string }[] = [
  { value: "buy", label: "Buy Estates" },
  { value: "rent", label: "Luxury Rentals" },
  { value: "commercial", label: "Commercial / NNN" },
];

const QUICK_TAGS = ["Waterfront", "Infinity Pool", "Penthouse", "Private Dock", "Gated Compound"];

export function SearchPanel({
  initial,
  onSearch,
  variant = "hero",
}: {
  initial?: Partial<SearchValues>;
  onSearch?: (values: SearchValues) => void;
  variant?: "hero" | "inline";
}) {
  const navigate = useNavigate();
  const [values, setValues] = useState<SearchValues>({
    type: initial?.type ?? "buy",
    q: initial?.q ?? "",
    max: initial?.max ?? 8000000,
    beds: initial?.beds ?? 0,
    baths: initial?.baths ?? 0,
    category: initial?.category ?? "",
  });
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    track("property_search", { type: values.type, beds: values.beds, tag: selectedTag });
    if (onSearch) {
      onSearch(values);
      return;
    }
    void navigate({
      to: "/properties",
      search: {
        category: values.category || undefined,
        type: values.type,
        q: (values.q + (selectedTag ? ` ${selectedTag}` : "")).trim() || undefined,
        beds: values.beds || undefined,
      },
    });
  }

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={submit}
      className={
        isHero
          ? "space-y-5 rounded-2xl border border-white/20 bg-slate-950/80 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl text-white"
          : "space-y-5 rounded-xl border border-border bg-card p-6 shadow-md"
      }
    >
      {/* Search Header Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Property type">
          {TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              aria-pressed={values.type === type.value}
              onClick={() => setValues((v) => ({ ...v, type: type.value }))}
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                values.type === type.value
                  ? "bg-accent text-accent-foreground shadow-md font-extrabold"
                  : "bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-accent">
          <Sparkles className="size-3.5" />
          <span className="font-semibold">Curated MLS & Off-Market</span>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className={isHero ? "grid gap-4 sm:grid-cols-3" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-1.5 sm:col-span-1">
          <Label htmlFor="search-location" className="text-xs uppercase tracking-wider text-white/80">
            Location or Estate Name
          </Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent" />
            <Input
              id="search-location"
              value={values.q}
              onChange={(event) => setValues((v) => ({ ...v, q: event.target.value }))}
              placeholder="Waterbury, Stamford, Berlin, ZIP..."
              maxLength={120}
              className="bg-white/10 border-white/15 text-white placeholder:text-white/40 pl-9 focus-visible:border-accent"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="search-beds" className="text-xs uppercase tracking-wider text-white/80">
            Minimum Bedrooms
          </Label>
          <Select
            value={String(values.beds)}
            onValueChange={(value) => setValues((v) => ({ ...v, beds: Number(value) }))}
          >
            <SelectTrigger id="search-beds" className="bg-white/10 border-white/15 text-white focus-visible:border-accent">
              <SelectValue placeholder="Any Bedrooms" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/20 text-white">
              <SelectItem value="0">Any Bedrooms</SelectItem>
              <SelectItem value="2">2+ Bedrooms</SelectItem>
              <SelectItem value="3">3+ Bedrooms</SelectItem>
              <SelectItem value="4">4+ Bedrooms (Estates)</SelectItem>
              <SelectItem value="5">5+ Bedrooms (Mansions)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="search-baths" className="text-xs uppercase tracking-wider text-white/80">
            Minimum Bathrooms
          </Label>
          <Select
            value={String(values.baths)}
            onValueChange={(value) => setValues((v) => ({ ...v, baths: Number(value) }))}
          >
            <SelectTrigger id="search-baths" className="bg-white/10 border-white/15 text-white focus-visible:border-accent">
              <SelectValue placeholder="Any Bathrooms" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/20 text-white">
              <SelectItem value="0">Any Bathrooms</SelectItem>
              <SelectItem value="2">2+ Bathrooms</SelectItem>
              <SelectItem value="3">3+ Bathrooms</SelectItem>
              <SelectItem value="4">4+ Bathrooms</SelectItem>
              <SelectItem value="5">5+ Bathrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category & City Selectors */}
      <div className="grid gap-4 sm:grid-cols-2 rounded-xl bg-white/5 p-4 border border-white/10">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-white/80">
            Property Category
          </Label>
          <Select
            value={values.category || "all"}
            onValueChange={(value) => setValues((v) => ({ ...v, category: value === "all" ? "" : value }))}
          >
            <SelectTrigger className="bg-white/10 border-white/15 text-white focus-visible:border-accent">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/20 text-white">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Residential">Residential</SelectItem>
              <SelectItem value="Houses">Houses (Single Family)</SelectItem>
              <SelectItem value="Condos">Condos / Townhomes</SelectItem>
              <SelectItem value="Off-Market">Off-Market Listings</SelectItem>
              <SelectItem value="Land">Land / Acreage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-white/80">
            Target City / Region
          </Label>
          <Select
            value={values.q || "all"}
            onValueChange={(value) => setValues((v) => ({ ...v, q: value === "all" ? "" : value }))}
          >
            <SelectTrigger className="bg-white/10 border-white/15 text-white focus-visible:border-accent">
              <SelectValue placeholder="All Regions (CT & MA)" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/20 text-white">
              <SelectItem value="all">All Regions (CT & MA)</SelectItem>
              <SelectItem value="Waterbury">Waterbury, CT</SelectItem>
              <SelectItem value="Southington">Southington, CT</SelectItem>
              <SelectItem value="East Hartford">East Hartford, CT</SelectItem>
              <SelectItem value="Berlin">Berlin, CT</SelectItem>
              <SelectItem value="Burlington">Burlington, CT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Amenities Tags */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-white/60 mr-1 flex items-center gap-1">
          <Filter className="size-3 text-accent" /> Filter:
        </span>
        {QUICK_TAGS.map((tag) => {
          const active = selectedTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(active ? null : tag)}
              className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
                active
                  ? "bg-accent text-accent-foreground font-bold shadow-sm"
                  : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className={isHero ? "flex flex-col gap-3 sm:flex-row pt-2" : "flex flex-col gap-2 sm:flex-row"}>
        <Button
          type="submit"
          className="flex-1 h-12 bg-accent text-accent-foreground font-bold uppercase tracking-widest hover:bg-accent/90 shadow-lg text-sm transition-transform hover:scale-[1.01]"
        >
          <Search className="size-4 mr-2" aria-hidden="true" />
          Search Luxury Portfolio
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 border-white/20 bg-white/5 text-white hover:bg-white/15 hover:border-accent text-xs font-bold uppercase tracking-wider"
          onClick={() => {
            track("valuation_request_click", {});
            const target = document.getElementById("request-info");
            if (target) target.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Building className="size-4 mr-2 text-accent" aria-hidden="true" />
          Request Private Valuation
        </Button>
      </div>
    </form>
  );
}
