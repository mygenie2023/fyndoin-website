import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { Section } from "@/components/site/Section";
import { AppCTA } from "@/components/site/Sections";

const TITLE = "About FYNDO — A Local Network for Local Work";
const DESC =
  "FYNDO exists to solve a connection problem: local communities already have skill, equipment and demand. FYNDO makes local skills discoverable and local work accessible.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "FYNDO",
            description:
              "Hyperlocal marketplace connecting people who need work done with skilled workers, service providers and equipment owners nearby.",
            slogan: "Your Work. Our Network.",
          },
        ]),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <Section className="hero-wash pt-10 pb-4">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "About" }]} />
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            Local skill isn't scarce. Connection is.
          </h1>
        </div>
      </Section>

      <Section className="pt-8">
        <div className="mx-auto max-w-3xl space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>
            Every town already contains an enormous amount of skill, experience and equipment. There
            are masons who can build the wall, mechanics who can fix the bike, tailors who can finish
            the order before the function, and tractor owners whose machine sits idle between seasons.
          </p>
          <p>
            There is also no shortage of demand. Somebody nearby needs exactly that work done, this
            week. What's missing between the two is a reliable way to find each other.
          </p>
          <p>
            Today that gap is filled by word of mouth — neighbours, WhatsApp groups, phone calls,
            and requests passed along until they reach someone who can actually do the job. It works
            unevenly, it's slow, and it leaves capable people invisible while others struggle to find
            them.
          </p>
          <h2 className="pt-2 font-display text-2xl font-extrabold text-foreground">
            What FYNDO is building
          </h2>
          <p>
            FYNDO is a digital network for local work. Work Providers post what they need with
            location, budget and detail. Operators publish what they do, where they work and what
            they charge. Both sides see each other, connect directly, and rate the outcome — so the
            next person has more to go on than a recommendation from a friend of a friend.
          </p>
          <p>
            Trust is built into the product rather than bolted on: phone verification for every
            account, administrative review of operator profiles, ratings after completed work, and
            tools to report anything that looks wrong.
          </p>
          <p className="font-display text-xl font-bold text-foreground">Your Work. Our Network.</p>
        </div>
      </Section>

      <AppCTA source="about_cta" />
    </SiteLayout>
  );
}
