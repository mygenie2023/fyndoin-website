import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { Section } from "@/components/site/Section";
import { AppCTA } from "@/components/site/Sections";
import { FaqList, faqSchema } from "@/components/site/Faq";
import { pageMeta, t as tHead } from "@/i18n/head";
import { useT } from "@/i18n/provider";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: pageMeta("extra.faq.meta", "/faq"),
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          breadcrumbSchema([
            { name: tHead("extra.faq.breadcrumb.home"), path: "/" },
            { name: tHead("extra.faq.breadcrumb.faq"), path: "/faq" },
          ]),
          faqSchema(),
        ]),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const t = useT();
  return (
    <SiteLayout>
      <Section className="hero-wash pt-10 pb-4">
        <Breadcrumbs
          items={[
            { label: t("extra.faq.breadcrumb.home"), to: "/" },
            { label: t("extra.faq.breadcrumb.faq") },
          ]}
        />
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            {t("extra.faq.heading")}
          </h1>
        </div>
      </Section>

      <Section className="pt-8">
        <FaqList />
      </Section>

      <AppCTA source="faq_cta" />
    </SiteLayout>
  );
}
