import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Breadcrumbs, breadcrumbSchema } from "@/components/site/Breadcrumbs";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/cta";
import { BRAND } from "@/lib/fyndo";
import { contactSchema } from "@/lib/contact-schema";
import { submitContact } from "@/lib/contact.functions";

const TITLE = "Contact FYNDO — Get in Touch";
const DESC =
  "Contact the FYNDO team with a question, a partnership idea, or a report about a listing or profile on the platform.";


export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ),
      },
    ],
  }),
  component: ContactPage,
});

const field =
  "mt-1.5 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary";

function ContactPage() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      message: String(form.get("message") || ""),
    };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      setError("Please check your name, email and message (at least 10 characters).");
      setState("error");
      return;
    }
    setState("sending");
    setError(null);
    try {
      await submitContact({ data: parsed.data });
      setState("sent");
    } catch {
      setError("Something went wrong. Please email us instead.");
      setState("error");
    }
  };

  return (
    <SiteLayout>
      <Section className="hero-wash pt-10 pb-4">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Contact" }]} />
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl">Get in touch</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Questions about how FYNDO works, feedback, or something to report? Send us a message.
          </p>
        </div>
      </Section>

      <Section className="pt-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="surface-card p-7">
            {state === "sent" ? (
              <div>
                <h2 className="text-xl font-extrabold">Thanks — message received.</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We'll get back to you at the email address you provided.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <h2 className="text-xl font-extrabold">Send a message</h2>
                <div className="mt-6 grid gap-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-semibold">
                      Your name
                    </label>
                    <input id="name" name="name" required maxLength={80} className={field} />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-semibold">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      maxLength={160}
                      className={field}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-semibold">
                      Message
                    </label>
                    <textarea id="message" name="message" required rows={5} maxLength={2000} className={field} />
                  </div>
                </div>
                {error && (
                  <p role="alert" className="mt-3 text-sm text-destructive">
                    {error}
                  </p>
                )}
                <Button type="submit" className="mt-6" disabled={state === "sending"}>
                  {state === "sending" ? "Sending…" : "Send message"}
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  Please don't include OTPs, passwords or payment details in this form.
                </p>
              </form>
            )}
          </div>

          <aside className="surface-card h-fit p-7">
            <h2 className="text-lg font-bold">Other ways to reach us</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Email:{" "}
              <a href={`mailto:${BRAND.contactEmail}`} className="font-semibold text-primary">
                {BRAND.contactEmail}
              </a>
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Reporting a profile, listing or work request is fastest from inside the app — every
              report goes to the moderation queue.
            </p>
            <Link to="/trust" className="mt-4 inline-block text-sm font-semibold text-primary">
              Read about Trust & Safety →
            </Link>
          </aside>
        </div>
      </Section>
    </SiteLayout>
  );
}
