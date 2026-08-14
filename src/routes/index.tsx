import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, MapPin, Shield, Star, Timer } from "lucide-react";
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
import { FULL_ADDRESS, SITE } from "@/lib/site";
import { formatNumber } from "@/lib/format";

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
      ...(schema ? { scripts: [{ type: "application/ld+json", children: JSON.stringify(schema) }] } : {}),
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

  return (
    <>
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
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_460px] lg:py-24">
          <div className="max-w-xl text-slate-deep-foreground">
            <p className="eyebrow text-accent">Miami · South Florida · Since 2009</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
              Find Your Ideal Property with Sharif Realty
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-deep-foreground/80">
              A boutique brokerage led by {SITE.owner}. We price precisely, market aggressively, and
              answer every inquiry within 15 minutes — from Brickell towers to Key Biscayne
              waterfront.
            </p>
            <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-slate-deep-foreground/15 pt-6">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-deep-foreground/60">
                  Avg. days to contract
                </dt>
                <dd className="font-display text-2xl text-accent">14</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-deep-foreground/60">
                  Of asking achieved
                </dt>
                <dd className="font-display text-2xl text-accent">101%</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-deep-foreground/60">
                  Client rating
                </dt>
                <dd className="font-display text-2xl text-accent">5.0</dd>
              </div>
            </dl>
          </div>
          <div className="lg:pt-6">
            <SearchPanel />
          </div>
        </div>
      </section>

      <ResponseBanner />

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-accent">Featured listings</p>
            <h2 className="mt-2 font-display text-3xl">Homes moving fastest right now</h2>
          </div>
          <Button asChild variant="secondary">
            <Link to="/properties">
              View all listings
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.featured.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3">
          {[
            {
              icon: Timer,
              title: "15-minute replies",
              body: "Every inquiry routes straight to a licensed agent — nights and weekends included.",
            },
            {
              icon: Shield,
              title: "Pricing you can defend",
              body: "We bring written comparables and a net-proceeds estimate to the first meeting.",
            },
            {
              icon: Star,
              title: "Results, not adjectives",
              body: "Read the case studies: eight days to contract at 102% of asking is typical, not cherry-picked.",
            },
          ].map((item) => (
            <div key={item.title} className="space-y-3">
              <item.icon className="size-6 text-accent" aria-hidden="true" />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-primary-foreground/70">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <p className="eyebrow text-accent">Verified reviews</p>
        <h2 className="mt-2 font-display text-3xl">What clients say after closing</h2>
        <div className="mt-8">
          <Testimonials reviews={data.reviews} />
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-accent">Case studies</p>
              <h2 className="mt-2 font-display text-3xl">Recent outcomes</h2>
            </div>
            <Button asChild variant="secondary">
              <Link to="/case-studies">
                All case studies
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {topCases.map((study) => (
              <article key={study.id} className="rounded-sm border border-border bg-card p-6">
                <h3 className="font-display text-xl leading-snug">{study.title}</h3>
                <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
                  {study.address}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{study.summary}</p>
                <dl className="mt-5 flex gap-6 border-t border-border pt-4 text-sm">
                  {study.days_on_market !== null && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Days on market</dt>
                      <dd className="font-semibold text-foreground">
                        {formatNumber(study.days_on_market)}
                      </dd>
                    </div>
                  )}
                  {study.percent_of_asking !== null && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Of asking</dt>
                      <dd className="font-semibold text-foreground">
                        {Number(study.percent_of_asking)}%
                      </dd>
                    </div>
                  )}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="request-info" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <p className="eyebrow text-accent">Visit or request a valuation</p>
              <h2 className="mt-2 font-display text-3xl">Talk to Sharif Realty today</h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
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
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4 text-accent" aria-hidden="true" />
              {SITE.hours}
            </p>
          </div>
          <div className="rounded-sm border border-border bg-card p-6">
            <LeadForm source="homepage" />
          </div>
        </div>
      </section>
    </>
  );
}
