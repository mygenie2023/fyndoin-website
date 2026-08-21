import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { Reveal, Section, SectionHeading } from "@/components/site/Section";
import { AppCTA, CategoryGrid } from "@/components/site/Sections";
import { pageMeta, t as tHead } from "@/i18n/head";
import { useI18n } from "@/i18n/provider";
import { useServices } from "@/i18n/taxonomy";
import { track } from "@/lib/fyndo";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: pageMeta("services.index.meta", "/services"),
    links: [{ rel: "canonical", href: "/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: tHead("common.nav.home"), path: "/" },
            { name: tHead("common.footer.links.services"), path: "/services" },
          ]),
        ),
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const t = useI18n().t;
  const services = useServices();

  return (
    <SiteLayout>
      <Section className="hero-wash pt-10 pb-4">
        <Breadcrumbs
          items={[
            { label: t("common.nav.home"), to: "/" },
            { label: t("common.footer.links.services") },
          ]}
        />
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            {t("services.index.hero.title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("services.index.hero.subtitle")}
          </p>
        </div>
      </Section>

      <Section className="pt-8">
        <CategoryGrid />
      </Section>

      <Section className="bg-secondary/40">
        <SectionHeading
          eyebrow={t("services.index.guides.eyebrow")}
          title={t("services.index.guides.title")}
          description={t("services.index.guides.description")}
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 70}>
              <Link
                to="/services/$service"
                params={{ service: s.slug }}
                onClick={() => track("service_category_clicked", { trade: s.slug })}
                className="surface-card flex h-full flex-col justify-between gap-3 p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <div>
                  <h3 className="font-display text-lg font-bold">{s.name}</h3>
                  <p className="mt-1 text-xs font-medium text-primary">{s.category}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {t("services.index.guides.readMore")}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <AppCTA source="services_cta" />
    </SiteLayout>
  );
}
