export const HIGHWAY_ONBOARDING_EMAIL = "onboarding@shipfivenines.com";

/** Opens a carrier-written draft; it never sends email or changes verification. */
export function highwayOnboardingMailto(company: string): string {
  const carrier = company.replace(/[\r\n]+/g, " ").trim().slice(0, 200);
  const subject = `Highway setup request${carrier ? ` - ${carrier}` : ""}`;
  const body = [
    "Hello Five Nines onboarding,",
    "",
    "Please help me complete Highway setup.",
    "",
    `Carrier company: ${carrier}`,
    "DOT number:",
    "MC number (if applicable):",
    "Contact name:",
    "Phone:",
  ].join("\n");
  return `mailto:${HIGHWAY_ONBOARDING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
