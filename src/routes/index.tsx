import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import heroImage from "@/assets/hero-villa.jpg";
import { Button } from "@/components/ui/button";
import { SearchPanel } from "@/components/search-panel";
import { ResponseBanner } from "@/components/response-banner";
import { PropertyCard } from "@/components/property-card";
import { Testimonials } from "@/components/testimonials";
import { PropertyMap } from "@/components/property-map";
import { LeadForm } from "@/components/lead-form";
import { reviewsJsonLd } from "@/components/jsonld";
import { listCaseStudies, listProperties, listReviews } from "@/lib/public.functions";
import { FULL_ADDRESS, SITE, whatsappHref } from "@/lib/site";
import { formatNumber, formatPrice, isRentalType } from "@/lib/format";

const homeQuery = queryOptions({
  queryKey: ["home"],
  queryFn: async () => {
    const [featured, reviews, caseStudies] = await Promise.all([
      listProperties({ data: { featuredOnly: true, limit: 6 } }),
      listReviews(),
      listCaseStudies(),
    ]);
    return {
      featured: featured.properties,
      reviews: reviews.reviews,
      caseStudies: caseStudies.caseStudies,
    };
  },
});

const SERVICES = [
  {
    title: "Home Buying Guidance",
    body: "From the first private showing to the final walkthrough, we handle inspections, comparables and negotiation so you can decide with clear numbers in front of you.",
  },
  {
    title: "Property Valuation",
    body: "A written valuation built on closed sales in your building or block, current absorption rates and the condition notes we take on site — not an automated estimate.",
  },
  {
    title: "Investment Advisory",
    body: "Rental yield, HOA exposure, insurance reality and exit timing for Brickell condos, Coral Gables single-family and short-term-rental-friendly zones.",
  },
  {
    title: "Transaction Management",
    body: "Title, lender, association approval and inspection deadlines tracked in one place, with a Friday summary email until the day you get the keys.",
  },
];

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  head: ({ loaderData }) => {
    const schema = reviewsJsonLd(loaderData?.reviews ?? []);
    return {
      meta: [
        { title: "Sharif Realty | Miami Luxury Homes, Rentals & Commercial" },
        {
          name: "description",
          content:
            "Search Miami and South Florida homes, condos and commercial space with Sharif Realty. Verified reviews, sold-in-days results, and a 15-minute response guarantee.",
        },
        { property: "og:title", content: "Find Your Ideal Property with Sharif Realty" },
        {
          property: "og:description",
          content:
            "Luxury listings across Miami, Miami Beach, Coral Gables and Key Biscayne — with a 15-minute response guarantee.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      ...(schema
        ? { scripts: [{ type: "application/ld+json", children: JSON.stringify(schema) }] }
        : {}),
    };
  },
  component: Home,
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Listings are taking a moment</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Please refresh, or call {SITE.phone} and we will send matches directly.
      </p>
    </div>
  ),
});

function Home() {
  const { data } = useSuspenseQuery(homeQuery);
  const topCases = data.caseStudies.slice(0, 3);
  const spotlight = data.featured[0];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate">
        <img
          src={heroImage}
          alt="Waterfront luxury villa at dusk with an infinity pool overlooking the Miami skyline"
          width={1920}
          height={1280}
          className="absolute inset-0 size-full object-cover"
          fetchPriority="high"
        />
        <div className="hero-scrim absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:pb-16 lg:pt-28">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_320px] lg:items-end">
            <div className="max-w-2xl text-slate-deep-foreground">
              <p className="rule-label text-accent">Miami · South Florida · Since 2009</p>
              <h1 className="mt-6 font-display text-[2.6rem] leading-[1.03] sm:text-6xl lg:text-[4.25rem]">
                Find your ideal property
                <span className="block text-accent">with Sharif Realty.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-deep-foreground/80">
                A boutique brokerage led by {SITE.owner}. We price precisely, market aggressively and
                answer every inquiry within fifteen minutes — from Brickell towers to Key Biscayne
                waterfront.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild className="h-11 bg-accent px-6 text-accent-foreground hover:bg-accent/90">
                  <Link to="/properties">
                    Browse listings
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 border-slate-deep-foreground/30 bg-transparent px-6 text-slate-deep-foreground hover:bg-slate-deep-foreground/10 hover:text-slate-deep-foreground"
                >
                  <a href={whatsappHref()} target="_blank" rel="noreferrer">
                    WhatsApp Majeed
                  </a>
                </Button>
              </div>

              <dl className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-slate-deep-foreground/15 border-t border-slate-deep-foreground/15 pt-6 text-slate-deep-foreground">
                {[
                  { k: "Avg. days to contract", v: "14" },
                  { k: "Of asking achieved", v: "101%" },
                  { k: "Client rating", v: "5.0" },
                ].map((stat, index) => (
                  <div key={stat.k} className={index === 0 ? "pr-4" : "px-4"}>
                    <dd className="numeral text-3xl text-accent">{stat.v}</dd>
                    <dt className="mt-1 text-[11px] uppercase tracking-widest text-slate-deep-foreground/60">
                      {stat.k}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>

            {/* Spotlight listing card, Allys-style */}
            {spotlight && (
              <Link
                to="/properties/$id"
                params={{ id: spotlight.slug }}
                className="group hidden border border-slate-deep-foreground/15 bg-slate-deep/85 p-5 text-slate-deep-foreground backdrop-blur transition-colors hover:border-accent lg:block"
              >
                <p className="rule-label text-accent">Featured listing</p>
                <h2 className="mt-3 font-display text-xl leading-snug">{spotlight.title}</h2>
                <p className="mt-2 text-xs text-slate-deep-foreground/70">
                  {spotlight.city}, {spotlight.state}
                </p>
                <p className="numeral mt-4 text-2xl text-accent">
                  {formatPrice(Number(spotlight.price), isRentalType(spotlight.listing_type))}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest">
                  View details
                  <ArrowUpRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            )}
          </div>

          {/* Search bar sits across the bottom of the hero */}
          <div className="mt-10">
            <SearchPanel />
          </div>
        </div>
      </section>

      <ResponseBanner />

      {/* Services */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
          <div>
            <p className="rule-label text-accent">Our services</p>
            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
              Buying or selling in Miami is complicated. Our job is to make it feel simple.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Four people, one desk, every file handled by a licensed agent who has walked the
              property. No call centre, no handoffs.
            </p>
            <Button asChild variant="secondary" className="mt-6">
              <a href="#request-info">Request a valuation</a>
            </Button>
          </div>

          <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {SERVICES.map((service, index) => (
              <li key={service.title} className="border-t border-border pt-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl">{service.title}</h3>
                  <span className="numeral text-sm text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Featured listings */}
      <section className="border-y border-border bg-muted/40 py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <p className="rule-label text-accent">Featured listings</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                Homes moving fastest right now
              </h2>
            </div>
            <Link
              to="/properties"
              className="link-underline inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-foreground"
            >
              View all listings
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Agent note — human, signed */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="max-w-2xl">
            <p className="rule-label text-accent">A note from the broker</p>
            <blockquote className="mt-5 font-display text-2xl leading-snug sm:text-3xl">
              “I have sat at closing tables in this county since 2009. The difference is rarely the
              marketing budget — it is answering the phone, pricing honestly in week one, and telling
              a seller the thing they do not want to hear.”
            </blockquote>
            <p className="mt-6 text-sm text-muted-foreground">
              {SITE.owner} — Broker, licensed in Florida
            </p>
          </div>
          <div className="space-y-4 border border-border bg-card p-6">
            <h3 className="font-display text-xl">Reach us directly</h3>
            <a
              href={SITE.phoneHref}
              className="flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              <Phone className="size-4 text-accent" aria-hidden="true" />
              {SITE.phone}
            </a>
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              {FULL_ADDRESS}
            </p>
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <Clock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              {SITE.hours}
            </p>
            <p className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
              Serving {SITE.areaServed.slice(0, 6).join(", ")} and the surrounding South Florida
              market.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <p className="rule-label text-accent">Verified reviews</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">What clients say after closing</h2>
          <div className="mt-10">
            <Testimonials reviews={data.reviews} />
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="rule-label text-accent">Case studies</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">Recent outcomes</h2>
          </div>
          <Link
            to="/case-studies"
            className="link-underline inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest"
          >
            All case studies
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-10 grid gap-px bg-border md:grid-cols-3">
          {topCases.map((study) => (
            <article key={study.id} className="bg-card p-6">
              <h3 className="font-display text-xl leading-snug">{study.title}</h3>
              <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
                {study.address}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{study.summary}</p>
              <dl className="mt-5 flex gap-8 border-t border-border pt-4 text-sm">
                {study.days_on_market !== null && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                      Days on market
                    </dt>
                    <dd className="numeral mt-1 text-xl text-foreground">
                      {formatNumber(study.days_on_market)}
                    </dd>
                  </div>
                )}
                {study.percent_of_asking !== null && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                      Of asking
                    </dt>
                    <dd className="numeral mt-1 text-xl text-foreground">
                      {Number(study.percent_of_asking)}%
                    </dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="request-info" className="border-t border-border bg-muted/40 py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <p className="rule-label text-accent">Visit or request a valuation</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">Talk to Sharif Realty today</h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Tell us what you're looking for — or what you're thinking of selling — and we'll come
                back with real numbers, not a brochure.
              </p>
            </div>
            <PropertyMap
              latitude={SITE.geo.lat}
              longitude={SITE.geo.lng}
              label="Sharif Realty office"
              destination={FULL_ADDRESS}
              height="h-72"
            />
          </div>
          <div className="border border-border bg-card p-6 sm:p-8">
            <LeadForm source="homepage" />
          </div>
        </div>
      </section>
    </>
  );
}
