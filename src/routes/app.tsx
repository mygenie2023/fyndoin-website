import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section } from "@/components/site/Section";
import { Button, ButtonLink } from "@/components/ui/cta";
import { APP_IS_EXTERNAL, APP_URL, track } from "@/lib/fyndo";
import { useInstallPrompt } from "@/hooks/use-pwa-install";
import { formatPhone, normalisePhone, useRememberedPhoneNumber } from "@/hooks/use-remembered-phone";
import { pageMeta } from "@/i18n/head";
import { useI18n, useT } from "@/i18n/provider";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [...pageMeta("extra.app.meta", "/app"), { name: "robots", content: "noindex, follow" }],
    links: [{ rel: "canonical", href: "/app" }],
  }),
  component: AppEntryPage,
});

function AppEntryPage() {
  const t = useT();
  const { tx } = useI18n();
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
  const iosSteps = tx<string[]>("extra.app.iosSteps");

  return (
    <SiteLayout>
      <Section className="hero-wash">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {t("extra.app.readyBadge")}
          </span>
          <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold sm:text-5xl">
            {installed
              ? t("extra.app.heading.installed")
              : isMobile
                ? t("extra.app.heading.mobile")
                : t("extra.app.heading.desktop")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {installed
              ? t("extra.app.subtitle.installed")
              : isMobile
                ? t("extra.app.subtitle.mobile")
                : t("extra.app.subtitle.desktop")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {APP_IS_EXTERNAL ? (
              <ButtonLink to={APP_URL} size="lg" onClick={openApp}>
                {installed ? t("extra.app.openAppInstalled") : t("extra.app.openApp")}
              </ButtonLink>
            ) : (
              <Button size="lg" onClick={openApp} title={t("extra.app.installHint")}>
                {t("extra.app.openApp")}
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
                {t("extra.app.installButton")}
              </Button>
            )}
          </div>

          {showIos && (
            <ol className="surface-card mx-auto mt-6 max-w-sm space-y-1.5 p-4 text-left text-sm text-muted-foreground">
              {iosSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}

          {!isMobile && !isIos && (
            <p className="mt-6 text-xs text-muted-foreground">{t("extra.app.desktopNote")}</p>
          )}
        </div>

        {/* Remembered phone number: convenience only, never proof of a session. */}
        {showNumberCard && (
          <div className="surface-card mx-auto mt-10 max-w-sm p-6 text-left">
            <h2 className="font-display text-base font-bold">{t("extra.app.phoneCard.heading")}</h2>
            {editing ? (
              <>
                <label htmlFor="phone" className="sr-only">
                  {t("extra.app.phoneCard.inputLabel")}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={draft}
                  onChange={(e) => setDraft(normalisePhone(e.target.value))}
                  placeholder={t("extra.app.phoneCard.placeholder")}
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
                  {t("extra.app.phoneCard.continue")}
                </Button>
              </>
            ) : (
              <>
                <p className="mt-2 text-2xl font-semibold tracking-wide">{formatPhone(phone)}</p>
                <p className="mt-2 text-xs text-muted-foreground">{t("extra.app.phoneCard.savedNote")}</p>
                <Button className="mt-4 w-full" onClick={openApp}>
                  {t("extra.app.phoneCard.continue")}
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
                  {t("extra.app.phoneCard.useDifferent")}
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
              {t("extra.app.rememberLink")}
            </button>
          </p>
        )}
      </Section>
    </SiteLayout>
  );
}
