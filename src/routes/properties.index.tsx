import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { SearchX } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PropertyCard } from "@/components/property-card";
import { SearchPanel } from "@/components/search-panel";
import { ResponseBanner } from "@/components/response-banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listProperties } from "@/lib/public.functions";
import { LISTING_TYPE_LABELS } from "@/lib/format";

const searchSchema = z.object({
  type: z.enum(["buy", "rent", "commercial", "all"]).optional(),
  q: z.string().max(120).optional(),
  max: z.number().optional(),
  beds: z.number().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc"]).optional(),
});

type PropertySearch = z.infer<typeof searchSchema>;

const propertiesQuery = (search: PropertySearch) =>
  queryOptions({
    queryKey: ["properties", search],
    queryFn: () =>
      listProperties({
        data: {
          listingType: search.type ?? "all",
          query: search.q,
          maxPrice: search.max && search.max < 20000000 ? search.max : undefined,
          beds: search.beds,
          sort: search.sort ?? "newest",
          limit: 60,
        },
      }),
  });

export const Route = createFileRoute("/properties/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(propertiesQuery(deps)),
  head: () => ({
    meta: [
      { title: "Miami Property Listings for Sale & Rent | Sharif Realty" },
      {
        name: "description",
        content:
          "Browse Sharif Realty listings across Miami and South Florida — waterfront homes, Brickell condos, rentals and commercial space. Filter by price, beds and location.",
      },
      { property: "og:title", content: "Miami Property Listings | Sharif Realty" },
      {
        property: "og:description",
        content: "Filter luxury homes, rentals and commercial space across South Florida.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PropertiesPage,
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl">We couldn't load listings</h1>
      <p className="mt-2 text-sm text-muted-foreground">Please refresh to try again.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl">No listings found</h1>
    </div>
  ),
});

function PropertiesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data } = useSuspenseQuery(propertiesQuery(search));
  const properties = data.properties;
  const activeType = search.type ?? "all";

  return (
    <>
      <Breadcrumbs items={[{ label: "Properties" }]} />
      <ResponseBanner />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <p className="eyebrow text-accent">
          {activeType === "all" ? "All listings" : `${LISTING_TYPE_LABELS[activeType]} listings`}
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">
          {properties.length} propert{properties.length === 1 ? "y" : "ies"} available
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[340px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <SearchPanel
              variant="inline"
              initial={{
                type: activeType === "all" ? "buy" : activeType,
                q: search.q ?? "",
                max: search.max ?? 20000000,
                beds: search.beds ?? 0,
              }}
              onSearch={(values) =>
                void navigate({
                  search: {
                    type: values.type,
                    q: values.q || undefined,
                    max: values.max,
                    beds: values.beds || undefined,
                    sort: search.sort,
                  },
                })
              }
            />
          </aside>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <Link
                to="/properties"
                search={{}}
                className="text-sm font-semibold text-accent hover:underline"
              >
                Clear filters
              </Link>
              <div className="w-48">
                <Select
                  value={search.sort ?? "newest"}
                  onValueChange={(value) =>
                    void navigate({
                      search: {
                        ...search,
                        sort: value as PropertySearch["sort"],
                      },
                    })
                  }
                >
                  <SelectTrigger aria-label="Sort listings">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="price_asc">Price: low to high</SelectItem>
                    <SelectItem value="price_desc">Price: high to low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {properties.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-12 text-center">
                <SearchX className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-semibold">No matches for those filters</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Widen your price range or clear the filters to see everything we have listed.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
