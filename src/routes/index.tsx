import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { MarketplaceVisual } from "@/components/site/MarketplaceVisual";
import { Reveal } from "@/components/site/Section";
import { ButtonLink, OpenAppButton } from "@/components/ui/cta";
import {
  AppCTA,
  CategoriesSection,
  HowItWorksSection,
  NearbySection,
  ProblemSection,
  TrustSection,
  TwoSidedSection,
} from "@/components/site/Sections";

const TITLE = "FYNDO — Find Skilled Workers & Local Services Near You";
const DESC =
  "FYNDO is a hyperlocal marketplace connecting people who need work done with skilled workers, service providers and equipment owners nearby. Post work, compare operators, connect directly.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "FYNDO",
          description: DESC,
          publisher: { "@type": "Organization", name: "FYNDO" },
        }),
      },
    ],
  }),
  component: Home,
});

function Hero() {
  return (
    <section className="hero-wash relative overflow-hidden pt-10 pb-16 sm:pt-14 lg:pt-16 lg:pb-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              Hyperlocal skilled workers & local services
            </span>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mt-5 text-[2.4rem] leading-[1.03] font-extrabold sm:text-6xl lg:text-[4.1rem]">
              Find the right person for the work. Right around you.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              FYNDO connects people who need work done with skilled workers, service providers and
              equipment owners nearby — directly, with no middlemen in between.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-8 flex flex-wrap gap-3">
              <OpenAppButton source="hero" size="lg" />
              <ButtonLink to="/how-it-works" variant="outline" size="lg">
                Explore how FYNDO works
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <ButtonLink
                to="/for-work-providers"
                variant="outline"
                className="h-auto justify-start rounded-2xl px-5 py-4 text-left"
              >
                <span>
                  <span className="block font-display text-base font-bold">I need work done</span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    Post a requirement and find someone nearby
                  </span>
                </span>
              </ButtonLink>
              <ButtonLink
                to="/for-operators"
                variant="outline"
                className="h-auto justify-start rounded-2xl px-5 py-4 text-left"
              >
                <span>
                  <span className="block font-display text-base font-bold">I offer my skills</span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    Get discovered for work in your area
                  </span>
                </span>
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <Reveal delay={140}>
          <MarketplaceVisual />
        </Reveal>
      </div>
    </section>
  );
}

function Home() {
  return (
    <SiteLayout>
      <Hero />
      <ProblemSection />
      <TwoSidedSection />
      <HowItWorksSection />
      <CategoriesSection />
      <NearbySection />
      <TrustSection />
      <AppCTA source="home_final_cta" />
    </SiteLayout>
  );
}
