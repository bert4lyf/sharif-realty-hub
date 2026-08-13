import { useState } from "react";
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
import {
  FALLBACK_IMAGE,
  POST_CATEGORIES,
  PROPERTY_TYPES,
  SHARIF_MEDIA_BASE,
  withImageFallback,
  type AdminPost,
  type PostDraft,
  type PostStatus,
} from "@/lib/admin-store";

type Props = {
  post?: AdminPost;
  onSubmit: (draft: PostDraft) => void;
  onCancel: () => void;
};

export function PostForm({ post, onSubmit, onCancel }: Props) {
  const [category, setCategory] = useState(post?.category ?? POST_CATEGORIES[0]!);
  const [propertyType, setPropertyType] = useState(post?.propertyType ?? PROPERTY_TYPES[0]!);
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "Published");
  const [image, setImage] = useState(post?.image ?? `${SHARIF_MEDIA_BASE}/2026/07/sharif-realty-listing.jpg`);
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "").trim();
    const num = (key: string) => Number(text(key) || 0);

    if (!text("title")) {
      setError("A property name / post title is required.");
      return;
    }
    setError(null);
    onSubmit({
      title: text("title"),
      description: text("description"),
      address: text("address"),
      price: num("price"),
      beds: num("beds"),
      baths: num("baths"),
      sqft: num("sqft"),
      propertyType,
      category,
      status,
      tags: text("tags")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      image: text("image") || FALLBACK_IMAGE,
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_320px]" noValidate>
      <div className="space-y-5 rounded-md border border-border bg-card p-5">
        <div className="space-y-1.5">
          <Label htmlFor="f-title">Post Title / Property Name</Label>
          <Input
            id="f-title"
            name="title"
            defaultValue={post?.title ?? ""}
            placeholder="Off Market 4 bed 3 bath 1,724sqft 102 Madera Dr, Waterbury, CT 06704"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-description">Description</Label>
          <Textarea id="f-description" name="description" rows={7} defaultValue={post?.description ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-address">Address / Location</Label>
          <Input id="f-address" name="address" defaultValue={post?.address ?? ""} />
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="f-price">Price (USD)</Label>
            <Input id="f-price" name="price" type="number" min={0} defaultValue={post?.price ?? 0} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="f-beds">Bedrooms</Label>
            <Input id="f-beds" name="beds" type="number" min={0} defaultValue={post?.beds ?? 0} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="f-baths">Bathrooms</Label>
            <Input id="f-baths" name="baths" type="number" min={0} step="0.5" defaultValue={post?.baths ?? 0} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="f-sqft">SqFt</Label>
            <Input id="f-sqft" name="sqft" type="number" min={0} defaultValue={post?.sqft ?? 0} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-type">Property Type</Label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger id="f-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <aside className="space-y-5">
        <div className="space-y-4 rounded-md border border-border bg-card p-5">
          <p className="text-sm font-semibold text-foreground">Publish</p>
          <div className="space-y-1.5">
            <Label htmlFor="f-status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as PostStatus)}>
              <SelectTrigger id="f-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
              {post ? "Update" : "Publish"}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>

        <div className="space-y-4 rounded-md border border-border bg-card p-5">
          <p className="text-sm font-semibold text-foreground">Category &amp; Tags</p>
          <div className="space-y-1.5">
            <Label htmlFor="f-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="f-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POST_CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="f-tags">Tags (comma separated)</Label>
            <Input id="f-tags" name="tags" defaultValue={(post?.tags ?? []).join(", ")} />
          </div>
        </div>

        <div className="space-y-3 rounded-md border border-border bg-card p-5">
          <p className="text-sm font-semibold text-foreground">Featured Image URL</p>
          <Input
            id="f-image"
            name="image"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            placeholder={`${SHARIF_MEDIA_BASE}/2026/07/listing.jpg`}
          />
          <img
            src={image || FALLBACK_IMAGE}
            onError={withImageFallback}
            alt={post?.title ? `Featured image for ${post.title}` : "Sharif Realty featured image preview"}
            loading="lazy"
            className="aspect-video w-full rounded-sm border border-border object-cover"
          />
          <p className="text-xs text-muted-foreground">
            Use absolute sharifrealty.com media URLs only.
          </p>
        </div>
      </aside>
    </form>
  );
}
