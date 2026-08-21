import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { InstallFyndoPrompt } from "./InstallFyndoPrompt";
import { MobileActionBar } from "./MobileActionBar";
import { useT } from "@/i18n/provider";

export function SiteLayout({ children }: { children: ReactNode }) {
  const t = useT();
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t("common.a11y.skipToContent")}
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      {/* Reserve room for the mobile sticky bar so it never covers the footer. */}
      <div aria-hidden="true" className="h-[calc(3.5rem+env(safe-area-inset-bottom))] lg:hidden" />
      <InstallFyndoPrompt />
      <MobileActionBar />
    </div>
  );
}
