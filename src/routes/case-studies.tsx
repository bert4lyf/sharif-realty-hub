import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Quote, TrendingUp } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { listCaseStudies } from "@/lib/public.functions";
import { formatNumber, formatPrice } from "@/lib/format";

const caseStudiesQuery = queryOptions({
  queryKey: ["case-studies"],
  queryFn: () => listCaseStudies(),
});

export const Route = createFileRoute("/case-studies")({
  loader: ({ context }) => context.queryClient.ensureQueryData(caseStudiesQuery),
  head: () => ({
    meta: [
      { title: "Sold Case Studies & Client Results | Sharif Realty" },
      {
        name: "description",
        content:
          "See how Sharif Realty sells South Florida homes fast and above asking — real timelines, real percentages, and client stories from recent closings.",
      },
      { property: "og:title", content: "Sold Case Studies | Sharif Realty" },
      {
        property: "og:description",
        content: "Real Miami closings: days on market, percent of asking achieved, and client stories.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CaseStudiesPage,
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl">Case studies didn't load</h1>
      <p className="mt-2 text-sm text-muted-foreground">Please refresh to try again.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl">No case studies yet</h1>
    </div>
  ),
});

function CaseStudiesPage() {
  const { data } = useSuspenseQuery(caseStudiesQuery);

  return (
    <>
      <Breadcrumbs items={[{ label: "Case Studies" }]} />
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <p className="eyebrow text-accent">Proof, not promises</p>
        <h1 className="mt-2 max-w-2xl font-display text-3xl sm:text-4xl">
          Recent Sharif Realty closings and what made them work
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Every listing below was priced, staged and marketed in-house. The numbers are pulled from
          the closing statements.
        </p>

        <div className="mt-10 space-y-6">
          {data.caseStudies.map((study) => (
            <article
              key={study.id}
              className="grid gap-6 rounded-xl border border-border bg-card p-6 md:grid-cols-[1fr_280px]"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-strong">
                  <TrendingUp className="size-3.5" aria-hidden="true" />
                  {study.days_on_market !== null && study.percent_of_asking !== null
                    ? `Sold in ${study.days_on_market} days for ${Number(study.percent_of_asking)}% of asking`
                    : "Recent Sharif Realty closing"}
                </span>
                <h2 className="mt-4 font-display text-2xl">{study.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{study.address}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{study.summary}</p>
                {study.story && (
                  <blockquote className="mt-5 border-l-2 border-accent pl-4 text-sm italic text-foreground">
                    <Quote className="mb-1 size-4 text-accent" aria-hidden="true" />
                    {study.story}
                    {study.client_name && (
                      <footer className="mt-2 text-xs font-semibold not-italic text-muted-foreground">
                        — {study.client_name}
                      </footer>
                    )}
                  </blockquote>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-4 self-start rounded-lg bg-muted/60 p-5 md:grid-cols-1">
                {study.sale_price !== null && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Sold price</dt>
                    <dd className="font-display text-xl">{formatPrice(Number(study.sale_price))}</dd>
                  </div>
                )}
                {study.days_on_market !== null && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Days on market</dt>
                    <dd className="font-display text-xl">{formatNumber(study.days_on_market)}</dd>
                  </div>
                )}
                {study.percent_of_asking !== null && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Of asking price</dt>
                    <dd className="font-display text-xl">{Number(study.percent_of_asking)}%</dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-primary p-8 text-primary-foreground">
          <h2 className="font-display text-2xl">Want these numbers for your address?</h2>
          <p className="mt-2 max-w-xl text-sm text-primary-foreground/75">
            Request a valuation and we'll show you the comparables behind the price — or start with
            our{" "}
            <Link to="/faqs" className="font-semibold text-accent hover:underline">
              selling FAQs
            </Link>
            .
          </p>
          <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/properties">Browse current listings</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
