import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { Reveal, Section, SectionHeading } from "@/components/site/Section";
import { AppCTA, TrustSection } from "@/components/site/Sections";
import { OpenAppButton } from "@/components/ui/cta";
import { getService, SERVICES } from "@/lib/services";

export const Route = createFileRoute("/services/$service")({
  loader: ({ params }) => {
    const service = getService(params.service);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Service not found — FYNDO" }, { name: "robots", content: "noindex" }],
      };
    }
    const { service } = loaderData;
    const title = `${service.name} Near You — Find Local ${service.name}s on FYNDO`;
    return {
      meta: [
        { title },
        { name: "description", content: service.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: service.summary },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/services/${params.service}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/services/${params.service}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
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
  return (
    <SiteLayout>
      <Section>
        <h1 className="text-3xl font-extrabold">We don't have a page for that service yet</h1>
        <p className="mt-3 text-muted-foreground">
          Browse all categories to find the trade you're looking for.
        </p>
        <Link to="/services" className="mt-6 inline-block font-semibold text-primary">
          Explore all services →
        </Link>
      </Section>
    </SiteLayout>
  );
}

function ServicePage() {
  const { service } = Route.useLoaderData();
  const related = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <SiteLayout>
      <Section className="hero-wash pt-10 pb-4">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Services", to: "/services" },
            { label: service.name },
          ]}
        />
        <div className="mt-6 max-w-3xl">
          <p className="text-sm font-semibold text-primary">{service.category}</p>
          <h1 className="mt-2 text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            Find a {service.name.toLowerCase()} near you
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
              <h2 className="text-2xl font-extrabold">What a {service.name.toLowerCase()} covers</h2>
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
              <h2 className="text-2xl font-extrabold">When people usually look</h2>
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
          eyebrow="On FYNDO"
          title={`How to find a ${service.name.toLowerCase()} through FYNDO`}
          description={`Post what needs doing with your location and budget. Nearby ${service.name.toLowerCase()}s can see the request and respond. You compare profiles, ratings, distance and price, then assign the one that fits — and rate them once the work is done.`}
        />
      </Section>

      <TrustSection />

      <Section className="pt-0">
        <h2 className="text-2xl font-extrabold">Other services</h2>
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
