import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { Reveal, Section, SectionHeading } from "@/components/site/Section";
import { AppCTA, HowItWorksSection, STEPS, TrustSection } from "@/components/site/Sections";

const TITLE = "How FYNDO Works — Post Work, Find Operators, Get It Done";
const DESC =
  "See how FYNDO works for both sides: Work Providers post a requirement with location and budget, Operators discover nearby work, and both connect directly until the job is complete.";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/how-it-works" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/how-it-works" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "How FYNDO Works", path: "/how-it-works" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How FYNDO works",
            step: STEPS.map((s) => ({ "@type": "HowToStep", name: s.title, text: s.body })),
          },
        ]),
      },
    ],
  }),
  component: HowItWorksPage,
});

const PROVIDER_FLOW = [
  "Sign up and verify your phone number",
  "Post the work with details, budget and location",
  "View matched operators nearby",
  "Contact and assign an operator",
  "Track status, mark complete and rate",
];

const OPERATOR_FLOW = [
  "Sign up and verify your phone number",
  "Build a profile with skills, area and rate",
  "Browse or get notified of nearby work",
  "Respond and confirm directly",
  "Complete the job and receive a rating",
];

function Flow({ title, steps, tone }: { title: string; steps: string[]; tone: "primary" | "accent" }) {
  return (
    <article className="surface-card h-full p-7">
      <h3 className="text-xl font-extrabold">{title}</h3>
      <ol className="mt-5 space-y-4">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3 text-sm">
            <span
              aria-hidden="true"
              className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                tone === "primary"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground"
              }`}
            >
              {i + 1}
            </span>
            <span className="pt-0.5">{s}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}

function HowItWorksPage() {
  return (
    <SiteLayout>
      <Section className="hero-wash pt-10 pb-4">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "How FYNDO Works" }]} />
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            How FYNDO works, on both sides of the job
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            FYNDO is a two-sided local marketplace. One side posts work. The other side does it.
            Everything in between is designed to be as short as possible.
          </p>
        </div>
      </Section>

      <HowItWorksSection />

      <Section>
        <SectionHeading
          eyebrow="Step by step"
          title="The full flow, end to end"
          description="Every step below is a real screen in the FYNDO app."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <Flow title="Work Provider" steps={PROVIDER_FLOW} tone="primary" />
          </Reveal>
          <Reveal delay={110}>
            <Flow title="Operator" steps={OPERATOR_FLOW} tone="accent" />
          </Reveal>
        </div>
      </Section>

      <TrustSection />
      <AppCTA source="how_it_works_cta" />
    </SiteLayout>
  );
}
