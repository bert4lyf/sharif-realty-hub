import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle, Phone, Timer } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { FULL_ADDRESS, SITE, whatsappHref } from "@/lib/site";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank You — We'll Reply Within 15 Minutes | Sharif Realty" },
      {
        name: "description",
        content:
          "Your request reached Sharif Realty. Here's what happens next, plus direct call and WhatsApp links if you'd rather talk now.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Thank You | Sharif Realty" },
      {
        property: "og:description",
        content: "Your inquiry is in — expect a reply within 15 minutes during business hours.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ThankYouPage,
});

const STEPS = [
  {
    title: "We review your request",
    body: "An agent reads your details and pulls matching listings or comparable sales for your address.",
  },
  {
    title: "You hear from us within 15 minutes",
    body: "By phone, text or email — whichever you gave us. Nights and weekends included.",
  },
  {
    title: "We schedule the walkthrough",
    body: "Private showings, virtual tours or an in-person valuation, usually within 48 hours.",
  },
];

function ThankYouPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Thank You" }]} />
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent/15 text-accent-strong">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl sm:text-4xl">Thank you — your request is in</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {SITE.owner} and the Sharif Realty team have your inquiry. Here's exactly what happens next.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <Timer className="size-4 text-accent" aria-hidden="true" />
          Response guarantee: within 15 minutes
        </div>

        <ol className="mt-10 space-y-5">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                {index + 1}
              </span>
              <div>
                <h2 className="font-semibold text-foreground">{step.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <a href={SITE.phoneHref} onClick={() => track("call_click", { location: "thank_you" })}>
              <Phone className="size-4" aria-hidden="true" />
              Call {SITE.phone}
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a
              href={whatsappHref("Hi Sharif Realty, I just submitted a request on your website.")}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => track("whatsapp_click", { location: "thank_you" })}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp us
            </a>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/properties">Keep browsing listings</Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Office: {FULL_ADDRESS} · {SITE.hours} · Email{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-accent hover:underline">
            {SITE.email}
          </a>
        </p>
      </div>
    </>
  );
}
