import { Link } from "@tanstack/react-router";
import { Reveal, Section, SectionHeading } from "./Section";
import { ButtonLink, OpenAppButton } from "@/components/ui/cta";
import { CATEGORIES, SERVICES } from "@/lib/services";
import { track } from "@/lib/fyndo";
import { useEffect, useRef } from "react";

/* -------------------------------------------------- problem / value prop */

const PROBLEMS = [
  {
    title: "No central place to look",
    body: "Finding a mason, electrician, tractor or tailor still means asking neighbours, posting in WhatsApp groups, or calling around and hoping someone picks up.",
  },
  {
    title: "No easy way to compare",
    body: "There's little visibility into who is actually skilled, available, fairly priced or trustworthy before you commit to hiring them.",
  },
  {
    title: "Skilled workers stay invisible",
    body: "Carpenters, drivers and equipment owners with real skills have no reliable channel to reach the people nearby who need exactly what they offer.",
  },
];

export function ProblemSection() {
  return (
    <Section className="bg-secondary/40">
      <SectionHeading
        eyebrow="The problem"
        title="Finding reliable local help shouldn't depend on who you know."
        description="Local demand and local skill already exist in every town. What's missing is the connection between them."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {PROBLEMS.map((p, i) => (
          <Reveal key={p.title} delay={i * 90}>
            <article className="surface-card h-full p-6">
              <span className="font-display text-4xl font-extrabold text-primary/25">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal delay={200}>
        <div className="ink-panel mt-8 rounded-3xl p-8 text-center sm:p-12">
          <h3 className="text-2xl font-extrabold sm:text-3xl">FYNDO changes this.</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed opacity-85 sm:text-base">
            One local network connecting people who need work done with the people nearby who can
            do it — directly, without leads being resold through a chain of contacts.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------- two-sided split */

const PROVIDER_STEPS = [
  "Post your requirement",
  "Add location and budget",
  "Describe the work",
  "See nearby operators",
  "Compare profiles and ratings",
  "Contact and assign",
  "Track it to completion",
  "Rate the experience",
];

const OPERATOR_STEPS = [
  "Create your profile",
  "Add your skills and trades",
  "Set your service area",
  "Set your pricing",
  "Discover nearby work",
  "Respond to suitable requests",
  "Complete the job",
  "Build your rating",
];

function Ticks({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
      {items.map((s) => (
        <li key={s} className="flex items-start gap-2.5 text-sm">
          <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
            <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3.4">
              <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {s}
        </li>
      ))}
    </ul>
  );
}

export function TwoSidedSection() {
  return (
    <Section id="two-sided">
      <SectionHeading
        eyebrow="Two sides, one network"
        title="Both sides of local work, in one place"
        description="FYNDO is built for the person who needs the job done and the person who does it."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <article className="surface-card flex h-full flex-col p-7 sm:p-9">
            <span className="text-xs font-bold tracking-wider text-primary uppercase">
              For people who need work done
            </span>
            <h3 className="mt-3 text-2xl font-extrabold sm:text-3xl">Got a job? Find someone nearby.</h3>
            <Ticks items={PROVIDER_STEPS} />
            <div className="mt-8 flex flex-wrap gap-3">
              <OpenAppButton source="two_sided_provider" />
              <ButtonLink to="/for-work-providers" variant="outline">
                Learn more
              </ButtonLink>
            </div>
          </article>
        </Reveal>

        <Reveal delay={120}>
          <article className="surface-card flex h-full flex-col border-accent/40 bg-accent-soft/50 p-7 sm:p-9">
            <span className="text-xs font-bold tracking-wider text-accent-foreground uppercase">
              For skilled workers & service providers
            </span>
            <h3 className="mt-3 text-2xl font-extrabold sm:text-3xl">Have a skill? Find work nearby.</h3>
            <Ticks items={OPERATOR_STEPS} />
            <div className="mt-8 flex flex-wrap gap-3">
              <OpenAppButton source="two_sided_operator" label="Join FYNDO" variant="accent" />
              <ButtonLink to="/for-operators" variant="outline">
                Learn more
              </ButtonLink>
            </div>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------ how it works */

export const STEPS = [
  {
    n: "01",
    title: "Create account",
    body: "Sign up with your phone number as a Work Provider or an Operator. Operators add their trade, service area and pricing.",
  },
  {
    n: "02",
    title: "Post or find work",
    body: "Work Providers post a requirement with details, location and budget. Operators discover nearby opportunities that fit them.",
  },
  {
    n: "03",
    title: "Connect & complete",
    body: "The Work Provider assigns an operator, both sides connect directly, and progress is tracked until the work is marked complete.",
  },
];

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track("how_it_works_viewed");
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Section className="bg-secondary/40">
      <div ref={ref}>
        <SectionHeading
          eyebrow="How it works"
          title="Create → Discover → Connect → Complete"
          description="Three simple steps, on both sides of the marketplace."
        />
      </div>
      <ol className="mt-12 grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 110}>
            <li className="surface-card relative h-full list-none p-7">
              <span className="font-display text-sm font-extrabold text-accent-foreground">{s.n}</span>
              <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -right-3 hidden size-6 place-items-center rounded-full bg-primary text-primary-foreground md:grid"
                >
                  →
                </span>
              )}
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* --------------------------------------------------------------- categories */

export function CategoryGrid({ limit }: { limit?: number }) {
  const list = limit ? CATEGORIES.slice(0, limit) : CATEGORIES;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {list.map((c, i) => (
        <Reveal key={c.slug} delay={(i % 4) * 80}>
          <article className="surface-card group h-full p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
            <span aria-hidden="true" className="text-2xl">
              {c.emoji}
            </span>
            <h3 className="mt-3 text-lg font-bold">{c.name}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{c.blurb}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {c.trades.map((t) => {
                const service = SERVICES.find((s) => s.name.toLowerCase() === t.toLowerCase());
                return (
                  <li key={t}>
                    {service ? (
                      <Link
                        to="/services/$service"
                        params={{ service: service.slug }}
                        onClick={() => track("service_category_clicked", { category: c.name, trade: t })}
                        className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        {t}
                      </Link>
                    ) : (
                      <span className="inline-block rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                        {t}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export function CategoriesSection() {
  return (
    <Section id="categories">
      <SectionHeading
        eyebrow="Categories"
        title="Local trades, grouped so they're easy to find"
        description="Browse by category, then narrow down to the exact trade you need."
      />
      <div className="mt-12">
        <CategoryGrid limit={4} />
      </div>
      <Reveal delay={150}>
        <div className="mt-8 text-center">
          <ButtonLink to="/services" variant="outline" size="lg">
            Explore all services
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------- near you */

const NEARBY = [
  { trade: "Electrician", rating: "4.8", distance: "2.4 km away", tag: "Available today" },
  { trade: "Tractor Rental", rating: "4.7", distance: "4.1 km away", tag: "Owner operated" },
  { trade: "Carpenter", rating: "4.9", distance: "1.8 km away", tag: "Available today" },
];

export function NearbySection() {
  return (
    <Section className="bg-secondary/40">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Near you"
            title="The people you need may already be nearby."
            description="FYNDO surfaces operators by trade, distance, price and rating inside your service area — so the shortlist starts local instead of starting from scratch."
          />
          <Reveal delay={120}>
            <div className="mt-8">
              <OpenAppButton source="near_you" size="lg" />
            </div>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="surface-card relative overflow-hidden p-6">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:34px_34px]"
            />
            <ul className="relative space-y-3">
              {NEARBY.map((n) => (
                <li
                  key={n.trade}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <div>
                    <p className="font-display font-bold">{n.trade}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      <span aria-hidden="true" className="text-accent">
                        ★
                      </span>{" "}
                      {n.rating} · {n.distance}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {n.tag}
                  </span>
                </li>
              ))}
            </ul>
            <p className="relative mt-4 text-center text-xs text-muted-foreground">
              Example interface — these are not real listings.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- trust */

export const TRUST_POINTS = [
  {
    title: "Phone verification",
    body: "Every account, on both sides, signs up with phone verification. No anonymous accounts on the platform.",
  },
  {
    title: "Profile approval",
    body: "New operator profiles can go through an administrative review queue before they become publicly visible.",
  },
  {
    title: "Ratings & reviews",
    body: "Ratings are collected after completed work and roll up visibly on the profile, so a track record builds over time.",
  },
  {
    title: "Report & flag",
    body: "Any profile, listing or work request can be reported, and accounts can be suspended after review.",
  },
];

export function TrustSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Trust is the product"
        title="Know who you're connecting with."
        description="In a hyperlocal marketplace, trust isn't a feature bolted on later — it's the reason the network works at all."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {TRUST_POINTS.map((t, i) => (
          <Reveal key={t.title} delay={(i % 2) * 90}>
            <article className="surface-card flex h-full gap-4 p-6">
              <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3 5 6v6c0 4.4 3 7.9 7 9 4-1.1 7-4.6 7-9V6l-7-3Z" strokeLinejoin="round" />
                  <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-bold">{t.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------- final CTA */

export function AppCTA({ source = "final_cta" }: { source?: string }) {
  return (
    <Section>
      <Reveal>
        <div className="ink-panel relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,var(--accent),transparent_45%),radial-gradient(circle_at_80%_70%,var(--primary),transparent_45%)]"
          />
          <div className="relative">
            <h2 className="text-3xl font-extrabold sm:text-5xl">Your Work. Our Network.</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed opacity-85 sm:text-lg">
              Whether you need someone to get the job done, or you have the skills to do it, FYNDO
              helps you connect locally.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <OpenAppButton source={source} size="lg" variant="onInk" />
              <ButtonLink
                to="/services"
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-ink-foreground hover:bg-white/10"
              >
                Explore services
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
