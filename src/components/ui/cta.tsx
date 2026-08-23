import { Link, useNavigate } from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { APP_URL, APP_IS_EXTERNAL, track } from "@/lib/fyndo";
import { useT, useI18n } from "@/i18n/provider";
import { useInstallPrompt } from "@/hooks/use-pwa-install";


type Variant = "primary" | "accent" | "outline" | "ghost" | "onInk";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 select-none disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_10px_24px_-12px_var(--primary)] hover:brightness-110 hover:-translate-y-0.5",
  accent:
    "bg-accent text-accent-foreground shadow-[0_10px_24px_-12px_var(--accent)] hover:brightness-105 hover:-translate-y-0.5",
  outline: "border border-border bg-card text-foreground hover:bg-secondary hover:-translate-y-0.5",
  ghost: "text-foreground hover:bg-secondary",
  onInk: "bg-ink-foreground text-primary-deep hover:brightness-95 hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function ButtonLink({
  to,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: { to: string; variant?: Variant; size?: Size; className?: string; children: ReactNode } & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
>) {
  const cls = buttonClass(variant, size, className);
  if (/^https?:|^mailto:|^tel:/.test(to)) {
    return (
      <a href={to} className={cls} rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={cls} {...(rest as Record<string, unknown>)}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: { variant?: Variant; size?: Size } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={buttonClass(variant, size, className)} {...rest} />;
}

/**
 * The site's most important conversion: opening the FYNDO application.
 * If the app is not installed yet, the click first offers installation
 * (native prompt, or manual steps on iOS). Once installed — or when the
 * device cannot install — the click launches the app at /app.
 */
export function OpenAppButton({
  label,
  source,
  variant = "primary",
  size = "md",
  className,
}: {
  label?: string;
  source: string;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const t = useT();
  const tx = useI18n().tx;
  const navigate = useNavigate();
  const { mode, install, installed } = useInstallPrompt();
  const [showIosSteps, setShowIosSteps] = useState(false);
  const text = label ?? t("common.cta.openApp");

  const launch = () => {
    if (APP_IS_EXTERNAL) window.location.href = APP_URL;
    else navigate({ to: "/app" });
  };

  const onClick = async (e: MouseEvent) => {
    e.preventDefault();
    track("open_app_clicked", { source });
    track("website_to_app_conversion", { source });

    // A standalone window is the only reliable browser signal that this
    // installed PWA is already running. In that case, enter the app directly.
    if (installed) {
      launch();
      return;
    }

    if (mode === "native") {
      track("install_prompt_shown", { mode, source });
      const outcome = await install();
      if (outcome === "accepted") {
        track("install_prompt_accepted", { mode, source });
        launch();
      } else {
        track("install_prompt_dismissed", { mode, source });
      }
      return;
    }

    if (mode === "ios-manual") {
      track("install_prompt_shown", { mode, source });
      setShowIosSteps(true);
      return;
    }

    // Never guess that an unavailable install event means the PWA is already
    // installed. That event can arrive after hydration or be withheld by the
    // browser. Most importantly, do not fall through to /app.
    track("install_prompt_shown", { mode, source });
    setShowIosSteps(true);
  };

  const cls = buttonClass(variant, size, className);

  return (
    <>
      <button type="button" onClick={onClick} className={cls}>
        {text}
      </button>


      {showIosSteps ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="open-app-install-title"
          className="fixed inset-0 z-[80] flex items-end justify-center bg-foreground/40 p-3 backdrop-blur-sm"
          onClick={() => setShowIosSteps(false)}
        >
          <div
            className="surface-card w-full max-w-lg p-4 shadow-[var(--shadow-lift)]"
            onClick={(ev) => ev.stopPropagation()}
          >
            <h2 id="open-app-install-title" className="font-display text-base font-bold">
              {t("common.install.title")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("common.install.body")}</p>
            <ol className="mt-3 space-y-1.5 rounded-xl bg-secondary p-3 text-sm text-muted-foreground">
              {tx<readonly string[]>("common.install.iosSteps").map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="mt-4 flex gap-2">
              <Button className="flex-1" onClick={() => setShowIosSteps(false)}>
                {t("common.install.later")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}


/**
 * Explicit "Install FYNDO" action. Triggers the browser PWA install flow
 * (or iOS manual steps). It never navigates to /app on its own — the app is
 * launched only after the installation is accepted.
 */
export function InstallAppButton({
  className,
  onDone,
}: {
  className?: string;
  onDone?: () => void;
}) {
  const t = useT();
  const tx = useI18n().tx;
  const navigate = useNavigate();
  const { mode, install } = useInstallPrompt();
  const [showIosSteps, setShowIosSteps] = useState(false);

  const launch = () => {
    if (APP_IS_EXTERNAL) window.location.href = APP_URL;
    else navigate({ to: "/app" });
  };

  const onClick = async () => {
    track("install_prompt_shown", { mode, source: "install_button" });
    if (mode === "ios-manual") {
      setShowIosSteps(true);
      return;
    }
    const outcome = await install();
    if (outcome === "accepted") {
      track("install_prompt_accepted", { mode, source: "install_button" });
      onDone?.();
      launch();
    } else {
      track("install_prompt_dismissed", { mode, source: "install_button" });
    }
  };

  return (
    <>
      <button type="button" onClick={onClick} className={className}>
        {t("common.nav.installOnPhone")}
      </button>
      {showIosSteps ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-end justify-center bg-foreground/40 p-3 backdrop-blur-sm"
          onClick={() => setShowIosSteps(false)}
        >
          <div
            className="surface-card w-full max-w-lg p-4 shadow-[var(--shadow-lift)]"
            onClick={(ev) => ev.stopPropagation()}
          >
            <h2 className="font-display text-base font-bold">{t("common.install.title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("common.install.body")}</p>
            <ol className="mt-3 space-y-1.5 rounded-xl bg-secondary p-3 text-sm text-muted-foreground">
              {tx<readonly string[]>("common.install.iosSteps").map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="mt-4 flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setShowIosSteps(false)}>
                {t("common.install.later")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
