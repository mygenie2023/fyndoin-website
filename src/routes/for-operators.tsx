import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { Reveal, Section, SectionHeading } from "@/components/site/Section";
import { AppCTA, TrustSection } from "@/components/site/Sections";
import { OpenAppButton } from "@/components/ui/cta";

const TITLE = "For Operators — Find Work Near You | FYNDO";
const DESC =
  "Have a skill, a service or equipment? Build a FYNDO profile with your trades, service area and pricing, see nearby work requests, and respond only to the jobs that fit.";

export const Route = createFileRoute("/for-operators")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/for-operators" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/for-operators" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "For Operators", path: "/for-operators" },
          ]),
        ),
      },
    ],
  }),
  component: OperatorsPage,
});

const BENEFITS = [
  {
    title: "Be findable in your own area",
    body: "Your trade, service area and pricing sit on a profile that nearby people can actually search and browse.",
  },
  {
    title: "Work that comes to you",
    body: "A feed of nearby open requests, plus notifications when something matching your trade is posted close by.",
  },
  {
    title: "Only the jobs that fit",
    body: "You see the details, location and budget before responding — so you spend time on work worth travelling for.",
  },
  {
    title: "A rating that follows you",
    body: "Ratings collected after completed jobs roll up on your profile and build a track record over time.",
  },
];

function OperatorsPage() {
  return (
    <SiteLayout>
      <Section className="hero-wash pt-10 pb-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "For Operators" }]} />
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            Have a skill? Find work nearby.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Masons, carpenters, electricians, mechanics, drivers, tailors, farm hands and equipment
            owners — FYNDO puts your skills in front of the people around you who need them.
          </p>
          <div className="mt-7">
            <OpenAppButton source="operators_hero" label="Join FYNDO" size="lg" variant="accent" />
          </div>
        </div>
      </Section>

      <Section className="pt-6">
        <SectionHeading eyebrow="Why FYNDO" title="Your skills, visible where the work is." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={(i % 2) * 90}>
              <article className="surface-card h-full p-6">
                <h3 className="text-lg font-bold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <TrustSection />
      <AppCTA source="operators_cta" />
    </SiteLayout>
  );
}
