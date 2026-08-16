import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadForm } from "@/components/lead-form";
import { SITE, whatsappHref } from "@/lib/site";
import { OFFICIAL_MEDIA } from "@/lib/media";

export const Route = createFileRoute("/list-your-property")({
  head: () => ({
    meta: [
      { title: "List Your Property | Sharif Realty Group LLC, Waterbury CT" },
      {
        name: "description",
        content:
          "List your Waterbury, Berlin or Wolcott property with Majeed Sharif of Sharif Realty Group LLC. Free pricing opinion and a response within 15 minutes.",
      },
      { property: "og:title", content: "List Your Connecticut Property with Sharif Realty Group" },
      {
        property: "og:description",
        content:
          "Free written pricing opinion, off-market buyer network and full transaction management across Waterbury, Berlin and Wolcott, CT.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: OFFICIAL_MEDIA.hero },
      { name: "twitter:image", content: OFFICIAL_MEDIA.hero },
    ],
  }),
  component: ListYourProperty,
});

const STEPS = [
  {
    title: "Walkthrough and pricing opinion",
    body: "Majeed visits the property, photographs condition notes and prepares a written opinion of value built on closed Waterbury, Berlin and Wolcott comparables.",
  },
  {
    title: "Off-market first, then MLS",
    body: "Your listing goes to our cash and hard-money buyer list before it hits the public feed. If we do not have a match in seven days, we launch on the MLS with full photography.",
  },
  {
    title: "Offer review and closing",
    body: "Every offer is presented with net-to-seller numbers. We track title, lender and inspection deadlines and send a short weekly update until closing.",
  },
];

function ListYourProperty() {
  return (
    <>
      <Breadcrumbs items={[{ label: "List Your Property" }]} />

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="rule-label text-accent">Sellers</p>
          <h1 className="mt-4 font-display text-3xl leading-tight sm:text-5xl">
            List your Connecticut property with {SITE.owner}.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {SITE.experience}. Whether it is a Bucks Hill single family, a West End multi-family or a
            North Main Street commercial building, you get a licensed principal agent on site — not a
            call centre.
          </p>

          <ol className="mt-10 space-y-7">
            {STEPS.map((step, index) => (
              <li key={step.title} className="border-t border-border pt-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-xl">{step.title}</h2>
                  <span className="numeral text-sm text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              "Free written pricing opinion",
              "Professional listing photography",
              "Off-market buyer network",
              "Response within 15 minutes",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="size-4 shrink-0 text-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border pt-6 text-sm">
            <a href={SITE.phoneHref} className="inline-flex items-center gap-2 font-semibold">
              <Phone className="size-4 text-accent" aria-hidden="true" />
              {SITE.phone}
            </a>
            <a
              href={whatsappHref("Hi Majeed, I would like to list my property.")}
              target="_blank"
              rel="noreferrer noopener"
              className="link-underline font-semibold text-foreground"
            >
              WhatsApp Majeed
            </a>
          </div>
        </div>

        <aside id="request-info" className="h-fit border border-border bg-card p-6">
          <h2 className="font-display text-xl">Request a listing appointment</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us the address and we will reply with a pricing range the same day.
          </p>
          <div className="mt-6">
            <LeadForm source="list_your_property" defaultMessage="I would like to list my property at " />
          </div>
        </aside>
      </section>
    </>
  );
}
