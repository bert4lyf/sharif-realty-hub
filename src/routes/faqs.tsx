import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LeadForm } from "@/components/lead-form";
import { listFaqs } from "@/lib/public.functions";
import { faqJsonLd } from "@/components/jsonld";

const faqsQuery = queryOptions({
  queryKey: ["faqs"],
  queryFn: () => listFaqs(),
});

const CATEGORY_ORDER = ["Buying", "Selling", "Financing", "Closing Costs", "General"];

export const Route = createFileRoute("/faqs")({
  loader: ({ context }) => context.queryClient.ensureQueryData(faqsQuery),
  head: ({ loaderData }) => {
    const schema = faqJsonLd(loaderData?.faqs ?? []);
    return {
      meta: [
        { title: "Buying, Selling & Closing Cost FAQs | Sharif Realty" },
        {
          name: "description",
          content:
            "Answers to the questions Miami buyers and sellers ask most: offers, inspections, financing, closing costs and timelines — from Sharif Realty.",
        },
        { property: "og:title", content: "Real Estate FAQs | Sharif Realty" },
        {
          property: "og:description",
          content: "Buying, selling, financing and closing-cost questions answered plainly.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      ...(schema ? { scripts: [{ type: "application/ld+json", children: JSON.stringify(schema) }] } : {}),
    };
  },
  component: FaqsPage,
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl">FAQs didn't load</h1>
      <p className="mt-2 text-sm text-muted-foreground">Please refresh to try again.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl">No FAQs published yet</h1>
    </div>
  ),
});

function FaqsPage() {
  const { data } = useSuspenseQuery(faqsQuery);
  const categories = [...new Set(data.faqs.map((faq) => faq.category))].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b),
  );

  return (
    <>
      <Breadcrumbs items={[{ label: "FAQs" }]} />
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <p className="eyebrow text-accent">Frequently asked</p>
        <h1 className="mt-2 max-w-2xl font-display text-3xl sm:text-4xl">
          Buying, selling, financing and closing — explained
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-10">
            {categories.map((category) => (
              <section key={category}>
                <h2 className="font-display text-2xl">{category}</h2>
                <Accordion type="single" collapsible className="mt-3">
                  {data.faqs
                    .filter((faq) => faq.category === category)
                    .map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left text-base">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </section>
            ))}
          </div>

          <aside id="request-info" className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl">Still have a question?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask us directly — we answer within 15 minutes.
              </p>
              <div className="mt-4">
                <LeadForm compact source="faqs" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Prefer proof?{" "}
              <Link to="/case-studies" className="font-semibold text-accent hover:underline">
                Read recent case studies
              </Link>{" "}
              or{" "}
              <Link to="/properties" className="font-semibold text-accent hover:underline">
                browse listings
              </Link>
              .
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
