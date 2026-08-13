import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FULL_ADDRESS, SITE } from "@/lib/site";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy & Real Estate Disclosures | Sharif Realty" },
      {
        name: "description",
        content:
          "How Sharif Realty collects, uses and protects your information, plus Fair Housing, MLS, brokerage and TCPA consent disclosures.",
      },
      { property: "og:title", content: "Privacy Policy | Sharif Realty" },
      {
        property: "og:description",
        content: "Data practices, Fair Housing, MLS and TCPA disclosures for Sharif Realty.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPolicyPage,
});

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "1. Information we collect",
    body: [
      "When you submit an inquiry, valuation request or viewing request we collect the name, email address, phone number and message you provide, along with the listing you were viewing.",
      "We also collect standard analytics data — pages viewed, approximate location derived from IP address, device type and referring site — through Google Analytics 4.",
    ],
  },
  {
    heading: "2. How we use your information",
    body: [
      "To respond to your inquiry (our 15-minute response guarantee), schedule showings, prepare valuations, and send listing matches you have asked for.",
      "To meet brokerage recordkeeping obligations under Florida real estate law, and to improve the performance and content of this website.",
      "We do not sell your personal information. We share it only with the licensed agents working your request and with service providers (hosting, email, analytics) acting on our instructions.",
    ],
  },
  {
    heading: "3. Telephone, text and TCPA consent",
    body: [
      "By submitting a form with your phone number you consent to be contacted by Sharif Realty by phone, SMS or WhatsApp about your inquiry, including by automated dialing where applicable. Consent is not a condition of purchasing or selling any property. Message and data rates may apply. Reply STOP to opt out of texts at any time.",
    ],
  },
  {
    heading: "4. Cookies and analytics",
    body: [
      "This site uses cookies and similar technologies for essential functionality and for Google Analytics 4 measurement. You can block or delete cookies in your browser settings; essential site features will continue to work.",
    ],
  },
  {
    heading: "5. Fair Housing and equal opportunity",
    body: [
      "Sharif Realty is committed to the letter and spirit of the U.S. Fair Housing Act and the Equal Opportunity Act. We do not discriminate on the basis of race, color, religion, sex, disability, familial status, national origin, or any class protected under applicable state or local law.",
    ],
  },
  {
    heading: "6. Listing accuracy and MLS disclosure",
    body: [
      "Listing information is believed to be accurate but is not guaranteed and is subject to change or withdrawal without notice. Square footage, lot dimensions, taxes, HOA fees and year built are obtained from public records or third parties and should be independently verified by buyers.",
      "Nothing on this site constitutes an offer to sell or a solicitation of an offer to buy real estate in jurisdictions where Sharif Realty is not licensed.",
    ],
  },
  {
    heading: "7. Brokerage relationship notice",
    body: [
      "Unless a written agreement states otherwise, Sharif Realty acts as a transaction broker under Florida law and owes you limited representation, including dealing honestly and fairly, accounting for funds, using skill and care, and disclosing known material facts affecting the value of residential property.",
    ],
  },
  {
    heading: "8. Data retention and security",
    body: [
      "Inquiry records are retained for at least five years to satisfy brokerage recordkeeping rules. Data is stored with access controls and row-level security so only authorized staff can view lead records.",
    ],
  },
  {
    heading: "9. Your choices",
    body: [
      "You may request access to, correction of, or deletion of the personal information we hold about you, subject to legal retention requirements. Email us and we will respond within 30 days.",
    ],
  },
];

function PrivacyPolicyPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <p className="eyebrow text-accent">Legal</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Privacy Policy & Disclosures</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Effective date: January 1, 2026 · Applies to {SITE.name} and this website.
        </p>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section>
            <h2 className="font-display text-xl">10. Contact us</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {SITE.name}, {FULL_ADDRESS}. Phone{" "}
              <a href={SITE.phoneHref} className="font-semibold text-accent hover:underline">
                {SITE.phone}
              </a>
              , email{" "}
              <a href={`mailto:${SITE.email}`} className="font-semibold text-accent hover:underline">
                {SITE.email}
              </a>
              . Broker of record: {SITE.owner}.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
