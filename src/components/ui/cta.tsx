import { Link } from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { APP_URL, APP_IS_EXTERNAL, track } from "@/lib/fyndo";
import { useT } from "@/i18n/provider";

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
 * The site's most important conversion.
 * Shows "Install FYNDO" while the app is not installed and the browser offers
 * an install path; otherwise it opens the FYNDO application.
 */
export function OpenAppButton({
  label,
  installLabel,
  source,
  variant = "primary",
  size = "md",
  className,
}: {
  label?: string;
  installLabel?: string;
  source: string;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const t = useT();
  const { tx } = useI18n();
  const { mode, installed, install } = useInstallPrompt();
  const [showIosSteps, setShowIosSteps] = useState(false);

  const canInstall = !installed && (mode === "native" || mode === "ios-manual");
  const text = canInstall
    ? (installLabel ?? t("common.cta.installApp"))
    : (label ?? t("common.cta.openApp"));

  const onClick = () => {
    track("open_app_clicked", { source });
    track("website_to_app_conversion", { source });
  };

  const cls = buttonClass(variant, size, className);

  if (canInstall) {
    const onInstall = async () => {
      if (mode === "ios-manual") {
        setShowIosSteps((v) => !v);
        track("install_prompt_shown", { source, mode });
        return;
      }
      track("install_prompt_shown", { source, mode });
      const outcome = await install();
      if (outcome === "accepted") track("install_prompt_accepted", { source, mode });
      else track("install_prompt_dismissed", { source, mode });
    };

    return (
      <span className="relative inline-flex flex-col items-stretch">
        <button type="button" onClick={onInstall} className={cls}>
          {text}
        </button>
        {showIosSteps ? (
          <ol className="mt-2 space-y-1 rounded-xl bg-secondary p-3 text-left text-sm text-muted-foreground">
            {tx<readonly string[]>("common.install.iosSteps").map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        ) : null}
      </span>
    );
  }

  if (APP_IS_EXTERNAL) {
    return (
      <a href={APP_URL} onClick={onClick} className={cls}>
        {text}
      </a>
    );
  }
  return (
    <Link to="/app" onClick={onClick} className={cls}>
      {text}
    </Link>

  );
}
