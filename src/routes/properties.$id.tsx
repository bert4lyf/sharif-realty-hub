import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Bath, Bed, Building, CalendarCheck, Check, Phone, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadForm } from "@/components/lead-form";
import { PropertyMap } from "@/components/property-map";
import { PropertyCard } from "@/components/property-card";
import { ResponseBanner } from "@/components/response-banner";
import { getProperty } from "@/lib/public.functions";
import { formatNumber, formatPrice, isRentalType, STATUS_LABELS } from "@/lib/format";
import { SITE, whatsappHref } from "@/lib/site";
import { track } from "@/lib/analytics";

const propertyQuery = (id: string) =>
  queryOptions({
    queryKey: ["property", id],
    queryFn: async () => {
      const result = await getProperty({ data: { id } });
      if (!result.property) throw notFound();
      return result;
    },
  });

export const Route = createFileRoute("/properties/$id")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(propertyQuery(params.id)),
  head: ({ loaderData }) => {
    const property = loaderData?.property;
    if (!property) {
      return {
        meta: [{ title: "Listing Unavailable | Sharif Realty" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${property.title} — ${property.city}, ${property.state} | Sharif Realty`;
    const description = `${STATUS_LABELS[property.status]} · ${formatPrice(Number(property.price), isRentalType(property.listing_type))} · ${property.beds} bed, ${Number(property.baths)} bath, ${formatNumber(property.sqft)} sqft at ${property.address}, ${property.city}.`;
    const image = property.images[0];
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Residence",
            name: property.title,
            description: property.description,
            image: property.images,
            numberOfRooms: property.beds,
            floorSize: { "@type": "QuantitativeValue", value: property.sqft, unitCode: "FTK" },
            address: {
              "@type": "PostalAddress",
              streetAddress: property.address,
              addressLocality: property.city,
              addressRegion: property.state,
              postalCode: property.zip,
              addressCountry: "US",
            },
          }),
        },
      ],
    };
  },
  component: PropertyDetail,
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl">This listing didn't load</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Refresh the page or call {SITE.phone} and we'll send the details.
      </p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl">This property is no longer listed</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        It may be under contract or sold. Browse what is currently available.
      </p>
      <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
        <Link to="/properties">See active listings</Link>
      </Button>
    </div>
  ),
});

function PropertyDetail() {
  const { data } = useSuspenseQuery(propertyQuery(Route.useParams().id));
  const property = data.property!;
  const destination = `${property.address}, ${property.city}, ${property.state} ${property.zip}`;
  const rental = isRentalType(property.listing_type);

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Properties", to: "/properties" }, { label: property.address }]}
      />
      <ResponseBanner />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr] md:grid-rows-2">
          {property.images.slice(0, 3).map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`${property.title} — view ${index + 1} of ${property.address}, ${property.city}`}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              width={1600}
              height={1200}
              className={`w-full rounded-sm object-cover ${
                index === 0 ? "aspect-[16/10] md:row-span-2" : "aspect-[16/10] md:aspect-auto md:h-full"
              }`}
            />
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-sm bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground">
                  {STATUS_LABELS[property.status]}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {property.year_built ? `Built ${property.year_built}` : "Year built on request"}
                </span>
              </div>
              <h1 className="mt-4 font-display text-3xl sm:text-4xl">{property.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{destination}</p>
              <p className="mt-4 font-display text-4xl text-foreground">
                {formatPrice(Number(property.price), rental)}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-4 rounded-sm border border-border bg-card p-6 sm:grid-cols-4">
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Bed className="size-4 text-accent" aria-hidden="true" /> Beds
                </dt>
                <dd className="mt-1 text-lg font-semibold">{property.beds}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Bath className="size-4 text-accent" aria-hidden="true" /> Baths
                </dt>
                <dd className="mt-1 text-lg font-semibold">{Number(property.baths)}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Ruler className="size-4 text-accent" aria-hidden="true" /> Interior
                </dt>
                <dd className="mt-1 text-lg font-semibold">{formatNumber(property.sqft)} sqft</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building className="size-4 text-accent" aria-hidden="true" /> Type
                </dt>
                <dd className="mt-1 text-lg font-semibold capitalize">{property.listing_type}</dd>
              </div>
            </dl>

            <section>
              <h2 className="font-display text-2xl">About this property</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {property.description}
              </p>
            </section>

            {property.features.length > 0 && (
              <section>
                <h2 className="font-display text-2xl">Features</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {property.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 shrink-0 text-accent" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="font-display text-2xl">Location & directions</h2>
              <div className="mt-4">
                <PropertyMap
                  latitude={property.latitude === null ? null : Number(property.latitude)}
                  longitude={property.longitude === null ? null : Number(property.longitude)}
                  label={property.title}
                  destination={destination}
                />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Curious how homes like this perform?{" "}
                <Link to="/case-studies" className="font-semibold text-accent hover:underline">
                  Read our case studies
                </Link>{" "}
                or review{" "}
                <Link to="/faqs" className="font-semibold text-accent hover:underline">
                  buying and closing FAQs
                </Link>
                .
              </p>
            </section>
          </div>

          <aside id="request-info" className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-sm border border-border bg-card p-6">
              <h2 className="font-display text-xl">Book a viewing</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {SITE.owner} personally answers within 15 minutes.
              </p>
              <div className="mt-4">
                <LeadForm
                  compact
                  source={`property:${property.slug}`}
                  propertyId={property.id}
                  defaultMessage={`I'd like to see ${property.address}, ${property.city}.`}
                />
              </div>
              <div className="mt-4 grid gap-2">
                <Button asChild variant="secondary">
                  <a
                    href={SITE.phoneHref}
                    onClick={() => track("call_click", { location: "property_detail" })}
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    Call {SITE.phone}
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <a
                    href={whatsappHref(`Hi, I'm interested in ${property.address}, ${property.city}.`)}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => track("whatsapp_click", { location: "property_detail" })}
                  >
                    <CalendarCheck className="size-4" aria-hidden="true" />
                    WhatsApp us
                  </a>
                </Button>
              </div>
            </div>
          </aside>
        </div>

        {data.related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl">Similar properties</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.related.map((related) => (
                <PropertyCard key={related.id} property={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
