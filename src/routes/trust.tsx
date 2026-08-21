import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { Section } from "@/components/site/Section";
import { AppCTA, TrustSection } from "@/components/site/Sections";

const TITLE = "Trust & Safety on FYNDO — Verification, Ratings and Reporting";
const DESC =
  "How FYNDO builds trust: phone verification on every account, administrative review of operator profiles, ratings after completed work, and reporting tools for listings and users.";

export const Route = createFileRoute("/trust")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/trust" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/trust" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Trust & Safety", path: "/trust" },
          ]),
        ),
      },
    ],
  }),
  component: TrustPage,
});

function TrustPage() {
  return (
    <SiteLayout>
      <Section className="hero-wash pt-10 pb-4">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Trust & Safety" }]} />
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            Know who you're connecting with.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            An informal arrangement gives you no record and no recourse. FYNDO adds a verification
            and accountability layer to the same local connection.
          </p>
        </div>
      </Section>

      <TrustSection />

      <Section className="bg-secondary/40 pt-4">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-2xl font-extrabold">What FYNDO does not claim</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            FYNDO connects people; it does not employ operators, guarantee outcomes, or set prices
            on their behalf. Ratings reflect what other users reported after completed work, and
            profile review is an administrative check — not a professional certification or a
            background check.
          </p>
          <h2 className="text-2xl font-extrabold">Staying safe on both sides</h2>
          <ul className="space-y-2.5 text-sm leading-relaxed text-muted-foreground">
            <li>• Agree the scope, price and timing clearly before work starts.</li>
            <li>• Keep the conversation and the details inside the app where possible.</li>
            <li>• Check the profile's ratings and history before assigning.</li>
            <li>• Report any profile, listing or request that looks wrong — it goes for review.</li>
            <li>• Never share OTPs with anyone, including someone claiming to be from FYNDO.</li>
          </ul>
        </div>
      </Section>

      <AppCTA source="trust_cta" />
    </SiteLayout>
  );
}
