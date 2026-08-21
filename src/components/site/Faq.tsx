import { useState } from "react";
import { track } from "@/lib/fyndo";

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What is FYNDO?",
    a: "FYNDO is a hyperlocal marketplace that connects Work Providers — people or businesses who need something done — with Operators, the skilled workers, technicians, service providers and equipment owners in the same town or service area.",
  },
  {
    q: "How does FYNDO work?",
    a: "You create an account with your phone number and choose a role. Work Providers post a work request with details, location and budget, then browse nearby operators and assign one. Operators build a profile with their trades, service area and pricing, see nearby work requests, and respond to the ones that fit. After the work is complete, ratings are exchanged.",
  },
  {
    q: "Who can use FYNDO?",
    a: "Anyone who needs local work done — homeowners, farmers, shopkeepers and small businesses — and anyone who offers a local skill or service, including masons, carpenters, electricians, mechanics, drivers, tailors, farm labour and equipment owners.",
  },
  {
    q: "Can I find a local service provider through FYNDO?",
    a: "Yes. You can browse operators by category and trade, filter by rating, price and distance, and open an operator's profile to see their ratings before contacting them.",
  },
  {
    q: "Can skilled workers find work through FYNDO?",
    a: "Yes. Operators see a feed of nearby open work requests and can be notified when a matching request is posted in their service area. They respond only to jobs that genuinely fit.",
  },
  {
    q: "How do I post a work request?",
    a: "In the FYNDO app, choose to post work and add the category, a description of the job, photos if useful, your location and your budget. Operators nearby can then see and respond to it.",
  },
  {
    q: "How are operators discovered?",
    a: "Operators are discovered by category and trade within a service area, and can be filtered by rating, price and distance. Nearby matches are surfaced for each posted work request.",
  },
  {
    q: "Does FYNDO charge a commission?",
    a: "FYNDO connects both sides directly, without reselling leads through middlemen. Monetisation options such as operator subscriptions or lead-based plans are being considered for a later phase, so the exact charges that apply to you are shown in the app before you commit to anything.",
  },
  {
    q: "How does FYNDO build trust?",
    a: "Every account signs up with phone verification, so there are no anonymous accounts. New operator profiles go through an admin review queue before appearing publicly, ratings are collected after completed work and shown on profiles, and any profile, listing or work request can be reported for review.",
  },
  {
    q: "How do ratings work?",
    a: "After a job is marked complete, both sides can rate each other. Those ratings roll up and are displayed on the profile, so future users can see a track record rather than a claim.",
  },
  {
    q: "Can I use FYNDO on my phone?",
    a: "Yes — FYNDO is designed mobile-first and works in your phone's browser as well as in the app.",
  },
  {
    q: "Can I install FYNDO on my phone?",
    a: "Yes. FYNDO can be installed to your home screen from a supported mobile browser, so it opens like an app without you having to remember a web address. On iPhone, use Safari's Share menu and choose “Add to Home Screen”.",
  },
];

export function FaqList({ items = FAQ_ITEMS }: { items?: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => {
                  setOpen(isOpen ? null : i);
                  if (!isOpen) track("faq_opened", { question: item.q });
                }}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-base font-bold transition-colors hover:bg-secondary/60"
              >
                {item.q}
                <span
                  aria-hidden="true"
                  className={`grid size-7 shrink-0 place-items-center rounded-full bg-secondary transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              hidden={!isOpen}
              className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function faqSchema(items: FaqItem[] = FAQ_ITEMS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
