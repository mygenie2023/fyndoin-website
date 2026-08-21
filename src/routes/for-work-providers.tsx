import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { Reveal, Section, SectionHeading } from "@/components/site/Section";
import { AppCTA, NearbySection, TrustSection } from "@/components/site/Sections";
import { OpenAppButton } from "@/components/ui/cta";
import { pageMeta, t as tHead } from "@/i18n/head";
import { useI18n } from "@/i18n/provider";

export const Route = createFileRoute("/for-work-providers")({
  head: () => ({
    meta: pageMeta("pages.forWorkProviders.meta", "/for-work-providers"),
    links: [{ rel: "canonical", href: "/for-work-providers" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: tHead("pages.forWorkProviders.breadcrumb.home"), path: "/" },
            { name: tHead("pages.forWorkProviders.breadcrumb.current"), path: "/for-work-providers" },
          ]),
        ),
      },
    ],
  }),
  component: WorkProvidersPage,
});

function WorkProvidersPage() {
  const { t, tx } = useI18n();
  const benefits = tx<Array<{ title: string; body: string }>>("pages.forWorkProviders.benefits.items");
  return (
    <SiteLayout>
      <Section className="hero-wash pt-10 pb-6">
        <Breadcrumbs
          items={[
            { label: t("pages.forWorkProviders.breadcrumb.home"), to: "/" },
            { label: t("pages.forWorkProviders.breadcrumb.current") },
          ]}
        />
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            {t("pages.forWorkProviders.hero.title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("pages.forWorkProviders.hero.body")}
          </p>
          <div className="mt-7">
            <OpenAppButton source="work_providers_hero" size="lg" />
          </div>
        </div>
      </Section>

      <Section className="pt-6">
        <SectionHeading
          eyebrow={t("pages.forWorkProviders.benefits.eyebrow")}
          title={t("pages.forWorkProviders.benefits.title")}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {benefits.map((b, i) => (
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
