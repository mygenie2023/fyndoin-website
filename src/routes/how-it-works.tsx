import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { Reveal, Section, SectionHeading } from "@/components/site/Section";
import { AppCTA, HowItWorksSection, TrustSection } from "@/components/site/Sections";
import { pageMeta, t as tHead, tx as txHead } from "@/i18n/head";
import { useI18n } from "@/i18n/provider";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: pageMeta("pages.howItWorks.meta", "/how-it-works"),
    links: [{ rel: "canonical", href: "/how-it-works" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          breadcrumbSchema([
            { name: tHead("pages.howItWorks.breadcrumb.home"), path: "/" },
            { name: tHead("pages.howItWorks.breadcrumb.current"), path: "/how-it-works" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: tHead("pages.howItWorks.jsonLd.howToName"),
            step: txHead<Array<{ title: string; body: string }>>("home.howItWorks.steps").map((s) => ({
              "@type": "HowToStep",
              name: s.title,
              text: s.body,
            })),
          },
        ]),
      },
    ],
  }),
  component: HowItWorksPage,
});

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
  const { t, tx } = useI18n();
  const providerSteps = tx<string[]>("pages.howItWorks.flow.workProvider.steps");
  const operatorSteps = tx<string[]>("pages.howItWorks.flow.operator.steps");
  return (
    <SiteLayout>
      <Section className="hero-wash pt-10 pb-4">
        <Breadcrumbs
          items={[
            { label: t("pages.howItWorks.breadcrumb.home"), to: "/" },
            { label: t("pages.howItWorks.breadcrumb.current") },
          ]}
        />
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            {t("pages.howItWorks.hero.title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("pages.howItWorks.hero.body")}
          </p>
        </div>
      </Section>

      <HowItWorksSection />

      <Section>
        <SectionHeading
          eyebrow={t("pages.howItWorks.flow.eyebrow")}
          title={t("pages.howItWorks.flow.title")}
          description={t("pages.howItWorks.flow.description")}
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <Flow title={t("pages.howItWorks.flow.workProvider.title")} steps={providerSteps} tone="primary" />
          </Reveal>
          <Reveal delay={110}>
            <Flow title={t("pages.howItWorks.flow.operator.title")} steps={operatorSteps} tone="accent" />
          </Reveal>
        </div>
      </Section>

      <TrustSection />
      <AppCTA source="how_it_works_cta" />
    </SiteLayout>
  );
}
