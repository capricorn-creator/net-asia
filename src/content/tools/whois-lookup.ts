import type { ToolContent } from '../types';
import { DEFAULT_AUTHOR } from '../../lib/site';

export const content: ToolContent = {
  toolId: "whois-lookup",
  metaDescription:
    "Look up domain registration data: registrar, creation and expiry dates, nameservers, and status codes. Free, no signup, with the data source shown.",
  sections: [
  { heading: "What this tool does", content: "The WHOIS Lookup tool retrieves domain registration data including the registrar, registration and expiry dates, nameservers, registrant country, and domain status. Results are shown in a structured view with a raw data toggle." },
  { heading: "How it works", content: "This tool uses the RDAP (Registration Data Access Protocol), the modern replacement for the older WHOIS protocol. Queries are sent from your browser to rdap.org, which routes the request to the appropriate registry's authoritative RDAP server and returns structured JSON data." },
  { heading: "When to use it", content: "Use WHOIS Lookup to check domain ownership before a business transaction, verify expiry dates to prevent accidental lapses, identify the registrar for a domain transfer, confirm nameserver configuration, or investigate suspicious domains as part of security research." },
  { heading: "Limitations", content: "Due to GDPR and registrar privacy policies, many registrant details \u2014 particularly email addresses and phone numbers \u2014 are redacted. This is normal for most consumer domains. Business and government domains often display more complete information." },
],
  intro: [],
  whatItShows: [],
  howToUse: [],
  useCases: [],
  sampleOutput: null,
  troubleshooting: [],
  bestPractices: [],
  glossary: [],
  limitations: [],
  dataSources: [],
  faqs: [
  { q: "Why is registrant information redacted?", a: "GDPR and similar privacy regulations require registrars to anonymise personal data in WHOIS records. Contact details for natural persons are typically hidden. Registrars offer WHOIS privacy services that replace personal data with proxy contact information." },
  { q: "What does \"clientTransferProhibited\" status mean?", a: "This status prevents the domain from being transferred to another registrar without the owner's explicit approval. It is a common security measure. Other statuses like \"clientDeleteProhibited\" prevent accidental deletion." },
  { q: "What is RDAP?", a: "RDAP (Registration Data Access Protocol) is the modern successor to the original WHOIS protocol. It returns structured data in JSON format, supports internationalised domain names, and provides better access control for privacy-protected data." },
  { q: "How do I see full registrant contact details?", a: "For most consumer domains, personal data is legitimately redacted. You may be able to obtain contact information by submitting an abuse or legal inquiry to the registrar directly." },
],
  relatedGuides: [],
  relatedTools: ["dns-lookup","ssl-checker","dns-propagation"],
  lastReviewed: '2026-11-21', // update only when you actually re-review this text
  author: DEFAULT_AUTHOR,
};
