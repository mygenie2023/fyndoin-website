import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Section } from "@/components/site/Section";

const TITLE = "Terms of Service — FYNDO";
const DESC =
  "The terms that apply to using the FYNDO website, and how the FYNDO marketplace relates to the work agreed between Work Providers and Operators.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/terms" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteLayout>
      <Section>
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Terms of Service" }]} />
        <div className="mx-auto mt-8 max-w-3xl space-y-5 text-sm leading-relaxed text-muted-foreground">
          <h1 className="font-display text-4xl font-extrabold text-foreground">Terms of Service</h1>
          <p>
            These terms cover the public FYNDO website. Additional terms shown inside the FYNDO
            application apply when you create an account and use the marketplace.
          </p>
          <h2 className="pt-3 font-display text-xl font-bold text-foreground">FYNDO's role</h2>
          <p>
            FYNDO is a platform that helps Work Providers and Operators find each other locally.
            FYNDO does not employ Operators, does not perform the work, and is not a party to the
            arrangement agreed between two users. Scope, price, timing and payment are agreed
            directly between them.
          </p>
          <h2 className="pt-3 font-display text-xl font-bold text-foreground">Acceptable use</h2>
          <p>
            Don't post misleading information, impersonate another person or business, or use the
            platform for unlawful purposes. Profiles, listings and work requests can be reported and
            reviewed, and accounts can be suspended.
          </p>
          <h2 className="pt-3 font-display text-xl font-bold text-foreground">Content on this site</h2>
          <p>
            Interface examples shown on this website — including sample service cards, ratings and
            distances — are illustrative and do not represent real listings or real users.
          </p>
          <h2 className="pt-3 font-display text-xl font-bold text-foreground">Changes</h2>
          <p>These terms may be updated as the product develops. The current version is always the one published here.</p>
        </div>
      </Section>
    </SiteLayout>
  );
}
