import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { APP_IS_EXTERNAL, APP_URL } from "@/lib/fyndo";

/**
 * /app is the mount point of the actual FYNDO application.
 * It is NOT a marketing, download or interstitial page.
 *
 * When VITE_FYNDO_APP_URL points at the deployed application, every visit is
 * handed straight over to it (no intermediate screen). Until that is
 * configured, a bare app shell renders — no site chrome of any kind.
 */
export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (APP_IS_EXTERNAL) throw redirect({ href: APP_URL, reloadDocument: true });
  },
  head: () => ({
    meta: [
      { title: "FYNDO" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "FYNDO application." },
    ],
    links: [{ rel: "canonical", href: "/app" }],
  }),
  component: FyndoApp,
});

function FyndoApp() {
  useEffect(() => {
    if (APP_IS_EXTERNAL) window.location.replace(APP_URL);
  }, []);

  return (
    <div
      id="fyndo-app-root"
      className="flex min-h-screen items-center justify-center bg-background"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <span
        aria-label="Loading FYNDO"
        role="status"
        className="size-8 animate-spin rounded-full border-2 border-border border-t-primary"
      />
    </div>
  );
}
