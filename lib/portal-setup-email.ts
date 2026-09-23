export function carrierSetupMailto(recipient: string): string {
  const subject = "Five Nines carrier setup documents";
  const body = [
    "Hello Five Nines carrier setup team,",
    "",
    "Please help me complete my carrier setup.",
    "",
    "Company legal name:",
    "USDOT / MC number:",
    "Portal account email:",
    "Dispatch contact and phone:",
    "",
    "Please attach these documents before sending:",
    "- Completed carrier packet",
    "- Certificate of insurance (COI)",
    "- W-9",
    "- Notice of assignment (NOA), if factoring applies",
    "",
    "Please confirm receipt and let me know the next steps, including Highway verification.",
  ].join("\r\n");
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
