import { createServerFn } from "@tanstack/react-start";
import { contactSchema } from "./contact-schema";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    // Validated server-side. Wire to email/CRM delivery when available.
    console.log("[contact] message received from", data.email.replace(/(.).*(@.*)/, "$1***$2"));
    return { ok: true as const };
  });
