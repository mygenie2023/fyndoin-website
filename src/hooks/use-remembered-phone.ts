import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "fyndo.phone";

/** Keep only digits, capped at a sane length. */
export function normalisePhone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 15);
}

/** Display formatting for Indian 10-digit numbers: 98765 43210. */
export function formatPhone(value: string): string {
  const digits = normalisePhone(value);
  if (digits.length === 10) return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  if (digits.length > 10) return `${digits.slice(0, digits.length - 10)} ${formatPhone(digits.slice(-10))}`;
  return digits;
}

/**
 * Remembers ONLY the user's phone number, for convenience on the login screen.
 *
 * Security notes:
 * - This is not authentication. A remembered number never implies a session.
 * - OTPs, tokens and any other secret are never written here.
 * - The number is never placed in a URL or in page metadata.
 */
export function useRememberedPhoneNumber() {
  const [phone, setPhone] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setPhone(normalisePhone(stored));
    } catch {
      /* storage can be blocked — remembering is optional */
    }
    setHydrated(true);
  }, []);

  const remember = useCallback((value: string) => {
    const digits = normalisePhone(value);
    setPhone(digits);
    try {
      if (digits.length >= 8) window.localStorage.setItem(STORAGE_KEY, digits);
    } catch {
      /* ignore */
    }
  }, []);

  const forget = useCallback(() => {
    setPhone("");
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return {
    phone,
    formatted: formatPhone(phone),
    hasRemembered: hydrated && phone.length >= 8,
    hydrated,
    remember,
    forget,
  } as const;
}
