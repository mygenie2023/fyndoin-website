import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { Reveal, Section, SectionHeading } from "@/components/site/Section";
import { AppCTA, NearbySection, TrustSection } from "@/components/site/Sections";
import { OpenAppButton } from "@/components/ui/cta";

const TITLE = "For Work Providers — Post a Job and Find Someone Nearby | FYNDO";
const DESC =
  "Need work done? Post your requirement with location and budget on FYNDO, compare nearby operators by rating and price, assign directly and track the job to completion.";

export const Route = createFileRoute("/for-work-providers")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/for-work-providers" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/for-work-providers" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "For Work Providers", path: "/for-work-providers" },
          ]),
        ),
      },
    ],
  }),
  component: WorkProvidersPage,
});

const BENEFITS = [
  {
    title: "Describe the job once",
    body: "Category, description, photos, location and budget — posted once instead of explained over a dozen phone calls.",
  },
  {
    title: "See who's actually nearby",
    body: "Operators are surfaced by trade and service area, so you start with people who can realistically reach you.",
  },
  {
    title: "Compare before you commit",
    body: "Ratings, price range and distance sit side by side on every profile, so the choice isn't guesswork.",
  },
  {
    title: "Assign and track",
    body: "Assign an operator, connect directly, follow the status from posted to complete, then leave a rating.",
  },
];

function WorkProvidersPage() {
  return (
    <SiteLayout>
      <Section className="hero-wash pt-10 pb-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "For Work Providers" }]} />
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            Got a job? Find someone nearby.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Post what needs doing, see the skilled people around you, and assign the one that fits
            your budget and timing — without working your way through a chain of contacts.
          </p>
          <div className="mt-7">
            <OpenAppButton source="work_providers_hero" size="lg" />
          </div>
        </div>
      </Section>

      <Section className="pt-6">
        <SectionHeading
          eyebrow="Why FYNDO"
          title="Less asking around. More getting it done."
        />
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

      <NearbySection />
      <TrustSection />
      <AppCTA source="work_providers_cta" />
    </SiteLayout>
  );
}
