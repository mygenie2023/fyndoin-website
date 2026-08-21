import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { Reveal, Section, SectionHeading } from "@/components/site/Section";
import { AppCTA, TrustSection } from "@/components/site/Sections";
import { OpenAppButton } from "@/components/ui/cta";
import { headLang, langMeta, t as tHead } from "@/i18n/head";
import { useI18n } from "@/i18n/provider";
import { getService, useService, useServices } from "@/i18n/taxonomy";
import { getService as getRawService } from "@/lib/services";

function fill(template: string, name: string) {
  return template.replaceAll("{name}", name);
}

export const Route = createFileRoute("/services/$service")({
  loader: ({ params }) => {
    const service = getRawService(params.service);
    if (!service) throw notFound();
    return { slug: service.slug };
  },
  head: ({ params, loaderData }) => {
    const service = loaderData ? getService(headLang(), loaderData.slug) : undefined;
    if (!service) {
      return {
        meta: [
          { title: tHead("services.service.notFound.metaTitle") },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = fill(tHead("services.service.metaTitle"), service.name);
    return {
      meta: [
        { title },
        { name: "description", content: service.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: service.summary },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/services/${params.service}` },
        { name: "twitter:card", content: "summary_large_image" },
        ...langMeta(),
      ],
      links: [{ rel: "canonical", href: `/services/${params.service}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: tHead("common.nav.home"), path: "/" },
              { name: tHead("common.footer.links.services"), path: "/services" },
              { name: service.name, path: `/services/${params.service}` },
            ]),
          ),
        },
      ],
    };
  },
  notFoundComponent: ServiceNotFound,
  component: ServicePage,
});

function ServiceNotFound() {
  const t = useI18n().t;
  return (
    <SiteLayout>
      <Section>
        <h1 className="text-3xl font-extrabold">{t("services.service.notFound.title")}</h1>
        <p className="mt-3 text-muted-foreground">{t("services.service.notFound.body")}</p>
        <Link to="/services" className="mt-6 inline-block font-semibold text-primary">
          {t("services.service.notFound.cta")}
        </Link>
      </Section>
    </SiteLayout>
  );
}

function ServicePage() {
  const { slug } = Route.useLoaderData();
  const t = useI18n().t;
  const service = useService(slug);
  const related = useServices()
    .filter((s) => s.slug !== slug)
    .slice(0, 3);

  if (!service) return <ServiceNotFound />;

  return (
    <SiteLayout>
      <Section className="hero-wash pt-10 pb-4">
        <Breadcrumbs
          items={[
            { label: t("common.nav.home"), to: "/" },
            { label: t("common.footer.links.services"), to: "/services" },
            { label: service.name },
          ]}
        />
        <div className="mt-6 max-w-3xl">
          <p className="text-sm font-semibold text-primary">{service.category}</p>
          <h1 className="mt-2 text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            {fill(t("services.service.hero.findNear"), service.name)}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {service.summary}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <OpenAppButton source={`service_${service.slug}`} size="lg" />
          </div>
        </div>
      </Section>

      <Section className="pt-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="surface-card h-full p-7">
              <h2 className="text-2xl font-extrabold">
                {fill(t("services.service.covers.title"), service.name)}
              </h2>
              <ul className="mt-5 space-y-2.5">
                {service.covers.map((c) => (
                  <li key={c} className="flex gap-2.5 text-sm">
                    <span aria-hidden="true" className="text-primary">
                      ✓
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
          <Reveal delay={110}>
            <article className="surface-card h-full p-7">
              <h2 className="text-2xl font-extrabold">{t("services.service.when.title")}</h2>
              <ul className="mt-5 space-y-2.5">
                {service.whenYouNeed.map((c) => (
                  <li key={c} className="flex gap-2.5 text-sm">
                    <span aria-hidden="true" className="text-accent-foreground">
                      •
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-secondary/40 pt-4">
        <SectionHeading
          align="left"
          eyebrow={t("services.service.onFyndo.eyebrow")}
          title={fill(t("services.service.onFyndo.title"), service.name)}
          description={fill(t("services.service.onFyndo.description"), service.name)}
        />
      </Section>

      <TrustSection />

      <Section className="pt-0">
        <h2 className="text-2xl font-extrabold">{t("services.service.other.title")}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              to="/services/$service"
              params={{ service: r.slug }}
              className="surface-card p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <h3 className="font-display font-bold">{r.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{r.category}</p>
            </Link>
          ))}
        </div>
      </Section>

      <AppCTA source={`service_${service.slug}_cta`} />
    </SiteLayout>
  );
}
