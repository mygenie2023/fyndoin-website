import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * The public contact page was removed. Contact details now live in the footer,
 * so this legacy URL redirects home instead of 404-ing for old links.
 */
export const Route = createFileRoute("/contact")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
