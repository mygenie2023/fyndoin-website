import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Section } from "@/components/site/Section";
import { pageMeta } from "@/i18n/head";
import { useT } from "@/i18n/provider";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: pageMeta("extra.terms.meta", "/terms"),
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  const t = useT();
  return (
    <SiteLayout>
      <Section>
        <Breadcrumbs
          items={[
            { label: t("extra.terms.breadcrumb.home"), to: "/" },
            { label: t("extra.terms.breadcrumb.terms") },
          ]}
        />
        <div className="mx-auto mt-8 max-w-3xl space-y-5 text-sm leading-relaxed text-muted-foreground">
          <h1 className="font-display text-4xl font-extrabold text-foreground">
            {t("extra.terms.heading")}
          </h1>
          <p>{t("extra.terms.intro")}</p>
          <h2 className="pt-3 font-display text-xl font-bold text-foreground">
            {t("extra.terms.roleHeading")}
          </h2>
          <p>{t("extra.terms.roleBody")}</p>
          <h2 className="pt-3 font-display text-xl font-bold text-foreground">
            {t("extra.terms.useHeading")}
          </h2>
          <p>{t("extra.terms.useBody")}</p>
          <h2 className="pt-3 font-display text-xl font-bold text-foreground">
            {t("extra.terms.contentHeading")}
          </h2>
          <p>{t("extra.terms.contentBody")}</p>
          <h2 className="pt-3 font-display text-xl font-bold text-foreground">
            {t("extra.terms.changesHeading")}
          </h2>
          <p>{t("extra.terms.changesBody")}</p>
        </div>
      </Section>
    </SiteLayout>
  );
}
