import type { ToolContent } from '../types';
import { DEFAULT_AUTHOR } from '../../lib/site';

export const content: ToolContent = {
  toolId: "dns-propagation",
  metaDescription:
    "Check whether a DNS change has reached public resolvers worldwide. Compare answers from eight resolvers side by side. Free, no signup required.",
  sections: [
  { heading: "What this tool does", content: "The DNS Propagation Checker queries 8 public DNS-over-HTTPS resolvers simultaneously \u2014 including Google (8.8.8.8), Cloudflare (1.1.1.1), Quad9 (9.9.9.9), OpenDNS, Comodo, Yandex, AdGuard, and Neustar \u2014 and shows the result from each one. This lets you see whether a DNS change has reached different parts of the global resolver network." },
  { heading: "How it works", content: "All 8 resolvers are queried in parallel via their DNS-over-HTTPS endpoints. Each query is independent, so you see the actual record currently cached by each resolver. Results include the resolved value, status, and response time from each location." },
  { heading: "When to use it", content: "Use DNS Propagation Checker after making DNS changes \u2014 such as updating A records when migrating a server, changing MX records for email migration, or adding TXT records for domain verification. It helps confirm that your changes are visible globally before you complete a migration or go-live." },
  { heading: "Understanding propagation times", content: "DNS changes do not propagate instantly. Resolvers cache records until the TTL expires, then fetch fresh copies. If your TTL was 86400 (24 hours) before the change, some resolvers may serve the old record for up to 24 hours. Lowering your TTL to 300 seconds an hour before making changes significantly reduces propagation time." },
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
  { q: "Why do different resolvers show different values?", a: "Each resolver independently caches DNS records based on when it last fetched a fresh copy. If a record was recently changed, some resolvers may still be serving the cached old value while others have already picked up the new record." },
  { q: "What does NXDOMAIN mean?", a: "NXDOMAIN (Non-Existent Domain) means the resolver could not find any records for the queried name. This may indicate the domain does not exist, the record type has not been configured, or the domain has recently been deleted." },
  { q: "How do I speed up DNS propagation?", a: "Before making DNS changes, reduce your record's TTL to 300 seconds (5 minutes) and wait for the old TTL to expire. Then make the change. After propagation is confirmed, you can restore the original TTL." },
  { q: "What record types can I check?", a: "The tool supports A, AAAA, MX, TXT, NS, and CNAME records \u2014 the most commonly changed types during domain migrations and server moves." },
],
  relatedGuides: [],
  relatedTools: ["dns-lookup","whois-lookup","reverse-dns"],
  lastReviewed: '2026-11-21', // update only when you actually re-review this text
  author: DEFAULT_AUTHOR,
};
