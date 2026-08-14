import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pencil, PlusCircle, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/wp-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin, withImageFallback } from "@/lib/admin-store";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/admin/dashboard")({
  component: AllPostsPage,
});

const FILTERS = ["All", "Mine", "Published"] as const;

function AllPostsPage() {
  const { posts, deletePost, user } = useAdmin();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (filter === "Published" && post.status !== "Published") return false;
      if (filter === "Mine" && post.author !== (user?.name ?? "Majeed")) return false;
      if (!term) return true;
      return (
        post.title.toLowerCase().includes(term) || post.address.toLowerCase().includes(term)
      );
    });
  }, [posts, filter, query, user]);

  const counts = {
    All: posts.length,
    Mine: posts.filter((post) => post.author === (user?.name ?? "Majeed")).length,
    Published: posts.filter((post) => post.status === "Published").length,
  };

  return (
    <>
      <AdminPageHeader
        title="All Posts"
        description="Property listings and posts published on sharifrealty.com."
        action={
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/admin/posts/new">
              <PlusCircle className="size-4" aria-hidden="true" /> Add New Property
            </Link>
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-sm px-2 py-1 transition-colors ${
                filter === item ? "font-semibold text-accent" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item} <span className="text-muted-foreground">({counts[item]})</span>
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            aria-label="Search posts by title or address"
            placeholder="Search title or address"
            className="pl-8"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Title / Property</th>
              <th className="px-4 py-3 font-semibold">Author</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Comments</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((post) => (
              <tr key={post.id} className="border-t border-border align-top">
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <img
                      src={post.image}
                      onError={withImageFallback}
                      alt={`Listing photo of ${post.address || post.title}`}
                      loading="lazy"
                      className="h-14 w-20 shrink-0 rounded-sm border border-border object-cover"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{post.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {post.address} · {formatPrice(post.price)} · {post.beds} bd / {post.baths} ba /{" "}
                        {post.sqft.toLocaleString("en-US")} sqft
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {post.status === "Published" ? "Published" : "— Draft"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{post.author}</td>
                <td className="px-4 py-3">{post.category}</td>
                <td className="px-4 py-3">{post.comments}</td>
                <td className="px-4 py-3">{post.date}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" asChild>
                      <Link to="/admin/posts/$id/edit" params={{ id: post.id }}>
                        <Pencil className="size-3.5" aria-hidden="true" /> Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        deletePost(post.id);
                        toast.success("Post deleted");
                      }}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No posts match this view.{" "}
                  <button
                    type="button"
                    className="font-semibold text-accent hover:underline"
                    onClick={() => void navigate({ to: "/admin/posts/new" })}
                  >
                    Add a new property
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
