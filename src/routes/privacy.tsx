import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Section } from "@/components/site/Section";

const TITLE = "Privacy Policy — FYNDO";
const DESC =
  "How FYNDO handles personal information on this website: what is stored, what is stored only on your device, and how to get in touch about your data.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/privacy" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteLayout>
      <Section>
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Privacy Policy" }]} />
        <div className="mx-auto mt-8 max-w-3xl space-y-5 text-sm leading-relaxed text-muted-foreground">
          <h1 className="font-display text-4xl font-extrabold text-foreground">Privacy Policy</h1>
          <p>
            This policy covers the public FYNDO website. Use of the FYNDO application is additionally
            governed by the terms and privacy notices shown inside the app.
          </p>
          <h2 className="pt-3 font-display text-xl font-bold text-foreground">
            Information stored on your device
          </h2>
          <p>
            If you choose to have FYNDO remember your mobile number, it is saved only in your
            browser's local storage on that device, purely so you don't have to type it again. It is
            never placed in a URL, never included in page metadata, and never treated as proof that
            you are signed in. One-time passwords and authentication secrets are never stored this
            way. You can remove the saved number at any time with “Use a different number”, or by
            clearing your browser storage.
          </p>
          <h2 className="pt-3 font-display text-xl font-bold text-foreground">Information you send us</h2>
          <p>
            If you use the contact form, we receive the name, email address and message you submit,
            and use them only to reply to you.
          </p>
          <h2 className="pt-3 font-display text-xl font-bold text-foreground">Analytics</h2>
          <p>
            Where analytics is configured, we record aggregate interaction events such as opening the
            app or dismissing the install prompt. These events do not include your phone number or
            message content.
          </p>
          <h2 className="pt-3 font-display text-xl font-bold text-foreground">Contact</h2>
          <p>
            For any question about your data, reach us through the contact page and we'll respond.
          </p>
        </div>
      </Section>
    </SiteLayout>
  );
}
