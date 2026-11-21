import type { ToolContent } from '../types';
import { DEFAULT_AUTHOR } from '../../lib/site';

export const content: ToolContent = {
  toolId: "geoip-lookup",
  metaDescription:
    "Get detailed GeoIP data for any IP address: country, region, city, timezone, ISP, and ASN, plus map links. Free, no signup, and the data source is shown.",
  sections: [
  { heading: "What this tool does", content: "GeoIP Lookup provides detailed geolocation and network information for any IPv4 or IPv6 address \u2014 including continent, country with emoji flag, region, city, postal code, timezone, coordinates, ISP, ASN, and proxy or VPN detection. Map links are generated automatically for addresses with valid coordinates." },
  { heading: "How it works", content: "Queries are sent from your browser to ip-api.com, a free geolocation API. The service maintains its own IP-to-location database, updated regularly from regional internet registries and other authoritative sources. Fields are requested selectively to minimise response size." },
  { heading: "When to use it", content: "GeoIP Lookup is useful for access log analysis, identifying the origin of network traffic, verifying geofencing rules, supporting fraud investigations, or building context around IP addresses seen in security incidents. It extends the basic IP Lookup with richer location detail and visual map integration." },
  { heading: "Proxy and VPN detection", content: "The tool includes basic proxy and VPN detection. When an address is flagged as a proxy or VPN exit node, a warning badge is displayed. This detection is not exhaustive \u2014 dedicated residential proxies and some commercial VPNs may not be flagged." },
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
  { q: "How is GeoIP Lookup different from IP Lookup?", a: "GeoIP Lookup uses a different provider (ip-api.com) and returns additional fields including continent, ZIP code, mobile/proxy detection, and country flag. It also provides both Google Maps and OpenStreetMap links. Use either tool depending on which data points you need." },
  { q: "How accurate is the city-level geolocation?", a: "Accuracy varies by country, ISP, and connection type. Broadband connections in densely populated areas are typically accurate to within 25\u201350 kilometres. Mobile, satellite, and VPN addresses may be significantly less accurate." },
  { q: "What does the \"proxy\" flag mean?", a: "The proxy flag indicates the IP address is associated with a known proxy, VPN, Tor exit node, or hosting provider commonly used for anonymisation. It is based on ip-api.com's database and may not detect all proxies." },
  { q: "Can I look up my own IP?", a: "Yes. Click the \"My IP\" button or leave the input blank to look up your own public IP address and see how it appears to websites you visit." },
],
  relatedGuides: [],
  relatedTools: ["ip-lookup","reverse-dns","whois-lookup"],
  lastReviewed: '2026-11-21', // update only when you actually re-review this text
  author: DEFAULT_AUTHOR,
};
