import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { propertyInputSchema, type PropertyInput } from "@/lib/schemas";
import type { Property } from "@/lib/types";

type Props = {
  property?: Property | null;
  onSave: (values: PropertyInput) => Promise<void>;
  onCancel: () => void;
};

export function PropertyEditor({ property, onSave, onCancel }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(property?.status ?? "for_sale");
  const [listingType, setListingType] = useState(property?.listing_type ?? "buy");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const number = (key: string) => {
      const raw = String(form.get(key) ?? "").trim();
      return raw === "" ? null : Number(raw);
    };
    const list = (key: string) =>
      String(form.get(key) ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const parsed = propertyInputSchema.safeParse({
      ...(property ? { id: property.id } : {}),
      title: String(form.get("title") ?? ""),
      slug: String(form.get("slug") ?? ""),
      description: String(form.get("description") ?? ""),
      price: number("price") ?? 0,
      status,
      listing_type: listingType,
      address: String(form.get("address") ?? ""),
      city: String(form.get("city") ?? ""),
      state: String(form.get("state") ?? ""),
      zip: String(form.get("zip") ?? ""),
      beds: number("beds") ?? 0,
      baths: number("baths") ?? 0,
      sqft: number("sqft") ?? 0,
      latitude: number("latitude"),
      longitude: number("longitude"),
      images: list("images"),
      features: list("features"),
      is_featured: property?.is_featured ?? false,
      is_archived: property?.is_archived ?? false,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the form values");
      return;
    }
    setError(null);
    setPending(true);
    try {
      await onSave(parsed.data);
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not save property");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="p-title">Title</Label>
          <Input id="p-title" name="title" defaultValue={property?.title ?? ""} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-slug">Slug</Label>
          <Input id="p-slug" name="slug" defaultValue={property?.slug ?? ""} required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="p-description">Description</Label>
        <Textarea id="p-description" name="description" rows={4} defaultValue={property?.description ?? ""} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="p-price">Price (USD)</Label>
          <Input id="p-price" name="price" type="number" min={0} defaultValue={property?.price ?? 0} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-status">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
            <SelectTrigger id="p-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="for_sale">For Sale</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="for_rent">For Rent</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-type">Listing type</Label>
          <Select
            value={listingType}
            onValueChange={(value) => setListingType(value as typeof listingType)}
          >
            <SelectTrigger id="p-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="p-address">Address</Label>
          <Input id="p-address" name="address" defaultValue={property?.address ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-city">City</Label>
          <Input id="p-city" name="city" defaultValue={property?.city ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-zip">ZIP</Label>
          <Input id="p-zip" name="zip" defaultValue={property?.zip ?? ""} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-5">
        <div className="space-y-1.5">
          <Label htmlFor="p-state">State</Label>
          <Input id="p-state" name="state" defaultValue={property?.state ?? "FL"} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-beds">Beds</Label>
          <Input id="p-beds" name="beds" type="number" min={0} defaultValue={property?.beds ?? 0} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-baths">Baths</Label>
          <Input
            id="p-baths"
            name="baths"
            type="number"
            step="0.5"
            min={0}
            defaultValue={Number(property?.baths ?? 0)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-sqft">Sqft</Label>
          <Input id="p-sqft" name="sqft" type="number" min={0} defaultValue={property?.sqft ?? 0} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-lat">Latitude</Label>
          <Input
            id="p-lat"
            name="latitude"
            type="number"
            step="any"
            defaultValue={property?.latitude ?? ""}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="p-lng">Longitude</Label>
          <Input
            id="p-lng"
            name="longitude"
            type="number"
            step="any"
            defaultValue={property?.longitude ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-features">Features (one per line)</Label>
          <Textarea
            id="p-features"
            name="features"
            rows={3}
            defaultValue={(property?.features ?? []).join("\n")}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="p-images">Image URLs (one per line, first is the cover)</Label>
        <Textarea
          id="p-images"
          name="images"
          rows={3}
          placeholder="https://images.unsplash.com/..."
          defaultValue={(property?.images ?? []).join("\n")}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending} className="bg-accent text-accent-foreground hover:bg-accent/90">
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {property ? "Save changes" : "Create listing"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
