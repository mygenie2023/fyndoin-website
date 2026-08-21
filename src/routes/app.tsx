import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section } from "@/components/site/Section";
import { Button, ButtonLink } from "@/components/ui/cta";
import { APP_IS_EXTERNAL, APP_URL, track } from "@/lib/fyndo";
import { useInstallPrompt } from "@/hooks/use-pwa-install";
import { formatPhone, normalisePhone, useRememberedPhoneNumber } from "@/hooks/use-remembered-phone";

const TITLE = "Open the FYNDO App — Local Work and Services on Your Phone";
const DESC =
  "Open FYNDO to post work or find work nearby. Install FYNDO on your phone for one-tap access to local skilled workers and services.";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/app" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/app" }],
  }),
  component: AppEntryPage,
});

function AppEntryPage() {
  const { mode, isMobile, installed, install, isIos } = useInstallPrompt();
  const { phone, hasRemembered, remember, forget, hydrated } = useRememberedPhoneNumber();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [showIos, setShowIos] = useState(false);

  useEffect(() => {
    setDraft(phone);
  }, [phone]);

  const openApp = () => {
    track("open_app_clicked", { source: "app_entry" });
    track("website_to_app_conversion", { source: "app_entry" });
    if (APP_IS_EXTERNAL) window.location.href = APP_URL;
  };

  const showNumberCard = hydrated && (hasRemembered || editing);

  return (
    <SiteLayout>
      <Section className="hero-wash">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            FYNDO is ready
          </span>
          <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            {installed ? "Open FYNDO" : isMobile ? "Open FYNDO on your phone" : "Continue to FYNDO"}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {installed
              ? "You already have FYNDO installed. Launch it to pick up where you left off."
              : isMobile
                ? "Post work or find work nearby. Install FYNDO for faster access — no web address to remember."
                : "The full FYNDO marketplace works in your browser. On a phone, you can also install it as an app."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {APP_IS_EXTERNAL ? (
              <ButtonLink to={APP_URL} size="lg" onClick={openApp}>
                {installed ? "Open FYNDO" : "Open FYNDO App"}
              </ButtonLink>
            ) : (
              <Button size="lg" onClick={openApp} title="Set VITE_FYNDO_APP_URL to link the live app">
                Open FYNDO App
              </Button>
            )}

            {!installed && isMobile && mode !== "unavailable" && (
              <Button
                variant="outline"
                size="lg"
                onClick={async () => {
                  if (mode === "ios-manual") {
                    setShowIos(true);
                    return;
                  }
                  const outcome = await install();
                  track(
                    outcome === "accepted" ? "install_prompt_accepted" : "install_prompt_dismissed",
                    { mode, source: "app_entry" },
                  );
                }}
              >
                Install FYNDO
              </Button>
            )}
          </div>

          {showIos && (
            <ol className="surface-card mx-auto mt-6 max-w-sm space-y-1.5 p-4 text-left text-sm text-muted-foreground">
              <li>1. Tap the Share button in Safari.</li>
              <li>2. Choose “Add to Home Screen”.</li>
              <li>3. Tap “Add” — FYNDO appears on your home screen.</li>
            </ol>
          )}

          {!isMobile && !isIos && (
            <p className="mt-6 text-xs text-muted-foreground">
              Installing FYNDO is available on phones and tablets.
            </p>
          )}
        </div>

        {/* Remembered phone number: convenience only, never proof of a session. */}
        {showNumberCard && (
          <div className="surface-card mx-auto mt-10 max-w-sm p-6 text-left">
            <h2 className="font-display text-base font-bold">Mobile number</h2>
            {editing ? (
              <>
                <label htmlFor="phone" className="sr-only">
                  Mobile number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={draft}
                  onChange={(e) => setDraft(normalisePhone(e.target.value))}
                  placeholder="98765 43210"
                  className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-lg tracking-wide outline-none focus:border-primary"
                />
                <Button
                  className="mt-4 w-full"
                  onClick={() => {
                    remember(draft);
                    setEditing(false);
                  }}
                  disabled={draft.length < 8}
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <p className="mt-2 text-2xl font-semibold tracking-wide">{formatPhone(phone)}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Saved on this device for convenience. You'll still verify with an OTP in the app.
                </p>
                <Button className="mt-4 w-full" onClick={openApp}>
                  Continue
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    forget();
                    setEditing(true);
                    setDraft("");
                  }}
                  className="mt-3 w-full text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Use a different number
                </button>
              </>
            )}
          </div>
        )}

        {hydrated && !showNumberCard && (
          <p className="mt-8 text-center text-sm">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Remember my mobile number on this device
            </button>
          </p>
        )}
      </Section>
    </SiteLayout>
  );
}
