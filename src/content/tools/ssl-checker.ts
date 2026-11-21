import type { ToolContent } from '../types';
import { DEFAULT_AUTHOR } from '../../lib/site';

export const content: ToolContent = {
  toolId: "ssl-checker",
  metaDescription:
    "Check an SSL/TLS certificate for any domain: validity dates, days until expiry, issuer, and subject alternative names. Free, no signup, source shown.",
  sections: [
  { heading: "What this tool does", content: "The SSL Certificate Checker verifies the TLS certificate for any domain, showing its validity status, expiry date, days remaining, issuer, and Subject Alternative Names (SANs). It also displays the certificate's serial number for cross-referencing with certificate transparency logs." },
  { heading: "How it works", content: "This tool queries the crt.sh certificate transparency database, which aggregates certificates from all major CT logs. It retrieves the most recently issued certificate for the domain and derives validity and expiry information from the certificate's notBefore and notAfter fields." },
  { heading: "When to use it", content: "Use SSL Checker to verify a certificate is valid before launching a site, monitor upcoming expiry dates, confirm a newly installed certificate is visible in transparency logs, check which domains a wildcard or multi-SAN certificate covers, or investigate certificate issuance as part of security monitoring." },
  { heading: "Best practices", content: "Renew SSL certificates at least 30 days before expiry to allow time for troubleshooting. Set up automated monitoring or calendar reminders for expiry dates. Wildcard certificates (*.example.com) cover all immediate subdomains but not second-level subdomains (e.g. api.v2.example.com requires a separate certificate)." },
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
  { q: "Why might a recently installed certificate not appear?", a: "Certificate transparency logs aggregate entries from all CAs, but there is typically a short delay \u2014 usually minutes to a couple of hours \u2014 between certificate issuance and appearance in CT log searches." },
  { q: "What are Subject Alternative Names (SANs)?", a: "SANs are additional domain names that a single certificate is valid for. Modern certificates use SANs instead of the Common Name field to list all covered domains. A SAN certificate can protect hundreds of domains simultaneously." },
  { q: "What does \"days remaining\" mean?", a: "This is the number of days until the certificate's notAfter date. Browsers begin showing warnings when certificates expire. Aim to renew before the count reaches 30 days." },
  { q: "Is a self-signed certificate detected?", a: "Yes. If the issuer and subject are the same organisation, the certificate is self-signed. Browsers do not trust self-signed certificates and will display security warnings for end users." },
],
  relatedGuides: [],
  relatedTools: ["http-headers","whois-lookup","website-tech"],
  lastReviewed: '2026-11-21', // update only when you actually re-review this text
  author: DEFAULT_AUTHOR,
};
