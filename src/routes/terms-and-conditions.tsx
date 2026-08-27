import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FULL_ADDRESS, SITE } from "@/lib/site";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Sharif Realty" },
      {
        name: "description",
        content: "Terms and conditions of use for Sharif Realty services and website.",
      },
    ],
  }),
  component: TermsPage,
});

export function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Terms & Conditions" }]} />
      <article className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
          Terms & Conditions
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">Effective Date: January 1, 2026</p>

        <div className="prose prose-slate mt-8 max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Sharif Realty website ({SITE.url}) and associated real estate advisory services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-foreground">2. Real Estate Information & Listing Accuracy</h2>
            <p>
              All property listing information, pricing, square footage, boundaries, taxes, and amenities displayed on this website are provided for informational purposes only. While deemed reliable and verified against SmartMLS and RETS sources, all specifications are subject to errors, omissions, change of price, prior sale, or withdrawal without prior notice. Prospective purchasers and lessees are advised to conduct independent architectural, structural, and legal due diligence.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-foreground">3. Agency & Fiduciary Relationships</h2>
            <p>
              Transmission of information through this website, contact forms, or email does not automatically establish an exclusive brokerage agency relationship. A formal fiduciary agency relationship is established exclusively upon execution of a written Connecticut Buyer Representation Agreement or Exclusive Right to Sell Agreement signed by Principal Broker Majeed Sharif.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-foreground">4. Fair Housing & Equal Opportunity</h2>
            <p>
              Sharif Realty fully complies with Title VIII of the Civil Rights Act of 1968 (Fair Housing Act) and Connecticut General Statutes governing fair housing. We do not discriminate on the basis of race, color, religion, sex, disability, familial status, national origin, sexual orientation, gender identity, or source of income.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-foreground">5. Intellectual Property</h2>
            <p>
              All content, high-resolution photography, architectural renderings, floor plans, trademarks, logos, and custom code on this site are the exclusive property of Sharif Realty and protected by copyright laws. Unauthorized reproduction or syndication is prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-foreground">6. Contact Information</h2>
            <p>
              Questions regarding these Terms should be directed to:
              <br />
              <strong className="text-foreground">Sharif Realty Executive Office</strong>
              <br />
              {FULL_ADDRESS}
              <br />
              Email: {SITE.email} · Phone: {SITE.phone}
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
