export const HIGHWAY_ONBOARDING_EMAIL = "onboarding@shipfivenines.com";

/** Opens a carrier-written draft; it never sends email or changes verification. */
export function highwayOnboardingMailto(company: string, intent: "setup" | "help" = "setup"): string {
  const carrier = company.replace(/[\r\n]+/g, " ").trim().slice(0, 200);
  const subject = `${intent === "help" ? "Highway setup support" : "Highway setup request"}${carrier ? ` - ${carrier}` : ""}`;
  const body = [
    "Hello Five Nines onboarding,",
    "",
    intent === "help"
      ? "I need help with my existing Highway setup."
      : "Please help me complete Highway setup.",
    "",
    `Carrier company: ${carrier}`,
    "DOT number:",
    "MC number (if applicable):",
    "Contact name:",
    "Phone:",
  ].join("\n");
  return `mailto:${HIGHWAY_ONBOARDING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
