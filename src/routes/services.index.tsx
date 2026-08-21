import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { Reveal, Section, SectionHeading } from "@/components/site/Section";
import { AppCTA, CategoryGrid } from "@/components/site/Sections";
import { SERVICES } from "@/lib/services";
import { track } from "@/lib/fyndo";

const TITLE = "Local Services on FYNDO — Every Trade, Grouped by Category";
const DESC =
  "Browse local services on FYNDO: home & construction, repair, rental, agriculture, labour, emergency, health & beauty and more. Find skilled operators near you.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/services" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        ),
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteLayout>
      <Section className="hero-wash pt-10 pb-4">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Services" }]} />
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            Local services and trades on FYNDO
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Trades are grouped into broad categories so browsing stays simple. Categories and trades
            are adjusted per region to match what's actually in demand locally.
          </p>
        </div>
      </Section>

      <Section className="pt-8">
        <CategoryGrid />
      </Section>

      <Section className="bg-secondary/40">
        <SectionHeading
          eyebrow="Service guides"
          title="Popular trades people search for"
          description="Detailed pages for the trades where we have genuinely useful guidance to share."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 70}>
              <Link
                to="/services/$service"
                params={{ service: s.slug }}
                onClick={() => track("service_category_clicked", { trade: s.name })}
                className="surface-card flex h-full flex-col justify-between gap-3 p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <div>
                  <h3 className="font-display text-lg font-bold">{s.name}</h3>
                  <p className="mt-1 text-xs font-medium text-primary">{s.category}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
                </div>
                <span className="text-sm font-semibold text-primary">Read more →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <AppCTA source="services_cta" />
    </SiteLayout>
  );
}
