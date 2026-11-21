import type { ToolContent } from '../types';
import { DEFAULT_AUTHOR } from '../../lib/site';

export const content: ToolContent = {
  toolId: "dns-lookup",
  metaDescription:
    "Query A, AAAA, MX, CNAME, TXT, NS, SOA, and CAA records for any domain. Free, no signup, with the resolver that answered shown next to the result.",
  sections: [
  { heading: "What this tool does", content: "The DNS Lookup tool queries any domain's DNS records in real time. You can retrieve A records (IPv4 addresses), AAAA records (IPv6), MX records (mail servers), CNAME (aliases), TXT (text, SPF, DKIM), NS (nameservers), SOA (start of authority), and CAA (certificate authority authorisation) records." },
  { heading: "How it works", content: "DNS queries are sent from your browser directly to Google's DNS-over-HTTPS API (dns.google), which returns authoritative responses in JSON format. Selecting ALL queries each supported record type in parallel and merges the results." },
  { heading: "When to use it", content: "Use DNS Lookup to troubleshoot email delivery issues (MX and SPF records), verify domain ownership (TXT records), diagnose website connectivity problems (A/AAAA), check nameserver configuration (NS/SOA), or confirm SSL certificate policy (CAA). It is a standard tool for system administrators, email deliverability engineers, and developers." },
  { heading: "Tips", content: "When investigating a domain issue, start with ALL to get a complete picture. If you are checking email deliverability, look at MX, SPF (TXT), and DKIM (TXT) records together. CAA records tell you which certificate authorities are permitted to issue SSL certificates for the domain." },
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
  { q: "What is TTL?", a: "TTL (Time to Live) is the number of seconds a DNS resolver is permitted to cache a record before fetching a fresh copy. Lower TTL values mean changes propagate faster, but increase load on authoritative nameservers. Common values are 300 (5 minutes), 3600 (1 hour), and 86400 (24 hours)." },
  { q: "Why might DNS records be missing?", a: "Some record types are optional. For example, not every domain has AAAA or CAA records. If a record type returns empty, it means no records of that type are configured, not that the domain is broken." },
  { q: "What is the difference between A and AAAA?", a: "A records map a domain to an IPv4 address (e.g. 93.184.216.34). AAAA records map to an IPv6 address (e.g. 2606:2800::). Many domains support both for dual-stack connectivity." },
  { q: "How do I check if DNS changes have propagated?", a: "Use the DNS Propagation Checker to query the same record type across multiple global resolvers simultaneously." },
],
  relatedGuides: [],
  relatedTools: ["dns-propagation","whois-lookup","reverse-dns"],
  lastReviewed: '2026-11-21', // update only when you actually re-review this text
  author: DEFAULT_AUTHOR,
};
