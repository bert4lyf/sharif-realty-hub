import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building, Search } from "lucide-react";
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
};

const TYPES: { value: SearchValues["type"]; label: string }[] = [
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" },
  { value: "commercial", label: "Commercial" },
];

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
    max: initial?.max ?? 5000000,
    beds: initial?.beds ?? 0,
  });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    track("property_search", { type: values.type, beds: values.beds });
    if (onSearch) {
      onSearch(values);
      return;
    }
    void navigate({
      to: "/properties",
      search: {
        type: values.type,
        q: values.q || undefined,
        max: values.max,
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
          ? "space-y-5 rounded-sm border border-border/40 bg-card/95 p-5 shadow-xl backdrop-blur sm:p-6"
          : "space-y-5 rounded-sm border border-border bg-card p-5"
      }
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Property type">
        {TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            aria-pressed={values.type === type.value}
            onClick={() => setValues((v) => ({ ...v, type: type.value }))}
            className={`rounded-sm px-4 py-1.5 text-sm font-semibold transition-colors ${
              values.type === type.value
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="search-location">Location</Label>
          <Input
            id="search-location"
            value={values.q}
            onChange={(event) => setValues((v) => ({ ...v, q: event.target.value }))}
            placeholder="City, neighborhood, address or ZIP"
            maxLength={120}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="search-beds">Bedrooms</Label>
          <Select
            value={String(values.beds)}
            onValueChange={(value) => setValues((v) => ({ ...v, beds: Number(value) }))}
          >
            <SelectTrigger id="search-beds">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any bedrooms</SelectItem>
              <SelectItem value="1">1+ bedrooms</SelectItem>
              <SelectItem value="2">2+ bedrooms</SelectItem>
              <SelectItem value="3">3+ bedrooms</SelectItem>
              <SelectItem value="4">4+ bedrooms</SelectItem>
              <SelectItem value="5">5+ bedrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="search-price">Maximum price</Label>
          <span className="text-sm font-semibold text-foreground">
            {values.max >= 20000000 ? "No limit" : formatPrice(values.max)}
          </span>
        </div>
        <Slider
          id="search-price"
          value={[values.max]}
          min={5000}
          max={20000000}
          step={5000}
          onValueChange={([value]) => setValues((v) => ({ ...v, max: value ?? v.max }))}
          aria-label="Maximum price"
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
          <Search className="size-4" aria-hidden="true" />
          Search Properties
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={() => {
            track("valuation_request_click", {});
            const target = document.getElementById("request-info");
            if (target) target.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Building className="size-4" aria-hidden="true" />
          Request Valuation
        </Button>
      </div>
    </form>
  );
}
