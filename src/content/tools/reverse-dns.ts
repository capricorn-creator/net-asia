import type { ToolContent } from '../types';
import { DEFAULT_AUTHOR } from '../../lib/site';

export const content: ToolContent = {
  toolId: "reverse-dns",
  metaDescription:
    "Find the PTR hostname for any IPv4 or IPv6 address with a reverse DNS lookup, and learn why many addresses have none. Free, no signup required.",
  sections: [
  { heading: "What this tool does", content: "Reverse DNS Lookup resolves the PTR (pointer) record for any IPv4 or IPv6 address, returning the hostname associated with that address. It shows the resolution status, the returned hostname, and TTL value when available." },
  { heading: "How it works", content: "The tool constructs the appropriate in-addr.arpa (IPv4) or ip6.arpa (IPv6) query and sends it to Google's DNS-over-HTTPS API. PTR records are maintained by the owner of the IP block and are separate from forward DNS records managed by domain owners." },
  { heading: "When to use it", content: "Reverse DNS is commonly used to verify mail server identity (MTA reverse DNS is checked by spam filters), investigate unknown IP addresses in access logs, confirm server hostname configuration, and validate that forward and reverse DNS match for a given server (a prerequisite for some email configurations)." },
  { heading: "What \"no PTR record\" means", content: "Not all IP addresses have PTR records configured. This is normal for dynamic residential addresses, many cloud instances, and IoT devices. The absence of a PTR record does not indicate a problem unless you specifically need one \u2014 for example, for mail server operation." },
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
  { q: "Why do mail servers need reverse DNS?", a: "Many receiving mail servers perform a reverse DNS check as part of spam filtering. If your mail server's IP does not resolve to a matching hostname, your messages may be rejected or marked as spam. Most hosting providers allow you to set a custom PTR record for static IPs." },
  { q: "Why does my PTR record show my ISP name?", a: "Residential IP addresses typically resolve to automatically generated hostnames owned by your ISP, such as \"pool-123-456-789-012.isp.example.com\". This is normal. Static IPs from business broadband or hosting providers can usually be given custom PTR records." },
  { q: "Can I look up any IP address?", a: "Yes. You can perform reverse DNS lookups on any publicly routable IPv4 or IPv6 address. Private addresses (192.168.x.x, 10.x.x.x, etc.) will not return meaningful results as they are not routable on the public internet." },
  { q: "What is an in-addr.arpa query?", a: "IPv4 reverse lookups use a special domain name format: the octets of the IP are reversed and appended with .in-addr.arpa. For example, 8.8.8.8 becomes 8.8.8.8.in-addr.arpa. IPv6 uses a similar nibble-reversed format with .ip6.arpa." },
],
  relatedGuides: [],
  relatedTools: ["ip-lookup","geoip-lookup","dns-lookup"],
  lastReviewed: '2026-11-21', // update only when you actually re-review this text
  author: DEFAULT_AUTHOR,
};
