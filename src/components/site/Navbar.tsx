import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { OpenAppButton } from "@/components/ui/cta";
import { useT } from "@/i18n/provider";
import { CONTACT } from "@/lib/fyndo";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/how-it-works", key: "howItWorks" },
  { to: "/services", key: "services" },
  { to: "/for-operators", key: "findWork" },
  { to: "/trust", key: "trust" },
  { to: "/about", key: "about" },
  { to: "/faq", key: "faq" },
] as const;

export function Navbar() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled ? "border-b border-border bg-background/85 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-3 lg:h-[4.5rem]">
        <Logo />

        <nav aria-label={t("common.nav.aria")} className="hidden items-center gap-1 xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {t(`common.nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 items-center gap-2">
          <OpenAppButton source="navbar" className="hidden sm:inline-flex" />
          <OpenAppButton
            source="navbar_mobile"
            label={t("common.cta.openAppShort")}
            size="sm"
            className="sm:hidden"
          />
          <LanguageSwitcher className="hidden lg:block" />
          <Link
            to="/contact"
            className="hidden h-10 items-center rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:inline-flex"
          >
            {t("common.nav.contact")}
          </Link>
          <a
            href={CONTACT.phoneHref}
            aria-label={t("common.contact.callAria")}
            className="hidden h-10 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-semibold transition-colors hover:bg-secondary xl:inline-flex"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M6.6 3h2.2l1.4 3.5-1.8 1.3a12 12 0 0 0 5.8 5.8l1.3-1.8L19 13.2v2.2A2.4 2.4 0 0 1 16.4 18 13.4 13.4 0 0 1 6 7.6 2.4 2.4 0 0 1 6.6 3Z"
                strokeLinejoin="round"
              />
            </svg>
            <span className="whitespace-nowrap">{CONTACT.phone}</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("common.nav.closeMenu") : t("common.nav.openMenu")}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-card xl:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background xl:hidden">
          <nav aria-label={t("common.nav.mobileAria")} className="container-page flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium hover:bg-secondary"
              >
                {t(`common.nav.${item.key}`)}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-base font-medium hover:bg-secondary"
            >
              {t("common.nav.contact")}
            </Link>
            <a
              href={CONTACT.phoneHref}
              aria-label={t("common.contact.callAria")}
              className="rounded-xl px-3 py-3 text-base font-medium hover:bg-secondary"
            >
              {CONTACT.phone}
            </a>
            <Link
              to="/app"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-base font-semibold text-primary hover:bg-secondary"
            >
              {t("common.nav.installOnPhone")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
