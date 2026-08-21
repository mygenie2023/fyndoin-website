import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { BRAND } from "@/lib/fyndo";

const COLUMNS: Array<{ title: string; links: Array<{ to: string; label: string }> }> = [
  {
    title: "Product",
    links: [
      { to: "/app", label: "Open App" },
      { to: "/how-it-works", label: "How It Works" },
      { to: "/services", label: "Services" },
    ],
  },
  {
    title: "For you",
    links: [
      { to: "/for-work-providers", label: "For Work Providers" },
      { to: "/for-operators", label: "For Operators" },
      { to: "/trust", label: "Trust & Safety" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/faq", label: "FAQ" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            FYNDO is a hyperlocal marketplace connecting people who need work done with skilled
            workers, service providers and equipment owners nearby.
          </p>
          <p className="mt-4 font-display text-base font-bold">{BRAND.line}</p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="font-display text-sm font-bold tracking-wide uppercase">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FYNDO. All rights reserved.</p>
          <p>{BRAND.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
