import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "fyndo.install.dismissed";

export type InstallMode = "native" | "ios-manual" | "unavailable";

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [snoozed, setSnoozed] = useState(true);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const iosLike = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && "ontouchend" in document);
    setIsIos(iosLike);
    setIsMobile(iosLike || /Android|Mobile|Tablet/i.test(ua) || window.innerWidth < 1024);
    setStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true,
    );

    // The prompt is shown on every page load until the app is actually
    // installed — dismissals are intentionally not remembered.
    setSnoozed(false);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const mode: InstallMode = deferred ? "native" : isIos && !standalone ? "ios-manual" : "unavailable";

  const install = useCallback(async (): Promise<"accepted" | "dismissed" | "unsupported"> => {
    if (!deferred) return "unsupported";
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    if (outcome === "accepted") setInstalled(true);
    return outcome;
  }, [deferred]);

  const snooze = useCallback(() => {
    setSnoozed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }, []);

  return {
    mode,
    isMobile,
    isIos,
    installed: installed || standalone,
    standalone,
    snoozed,
    /** Eligible for the automatic bottom-sheet nudge. */
    canPromote: isMobile && !standalone && !installed && !snoozed && mode !== "unavailable",
    install,
    snooze,
  } as const;
}
