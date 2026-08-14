import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/wp-shell";
import { SHARIF_MEDIA_BASE, useAdmin, withImageFallback } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/media")({
  component: MediaPage,
});

const EXTRA_MEDIA = [
  { url: `${SHARIF_MEDIA_BASE}/2026/04/sharif-realty-team.jpg`, label: "Sharif Realty team portrait" },
  { url: `${SHARIF_MEDIA_BASE}/2026/03/sharif-realty-office.jpg`, label: "Sharif Realty office exterior" },
  { url: `${SHARIF_MEDIA_BASE}/2026/02/sharif-realty-banner.jpg`, label: "Homepage banner artwork" },
  { url: `${SHARIF_MEDIA_BASE}/2026/01/sharif-realty-logo.png`, label: "Sharif Realty logo" },
];

function MediaPage() {
  const { posts } = useAdmin();
  const items = [
    ...posts.map((post) => ({ url: post.image, label: post.address || post.title })),
    ...EXTRA_MEDIA,
  ];

  return (
    <>
      <AdminPageHeader
        title="Media Library"
        description="All assets are served from sharifrealty.com uploads."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <figure key={item.url} className="overflow-hidden rounded-sm border border-border bg-card">
            <img
              src={item.url}
              onError={withImageFallback}
              alt={item.label}
              loading="lazy"
              className="aspect-video w-full object-cover"
            />
            <figcaption className="space-y-1 p-3">
              <p className="truncate text-sm font-semibold text-foreground">{item.label}</p>
              <p className="truncate text-xs text-muted-foreground">{item.url}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
