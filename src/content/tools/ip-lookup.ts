import type { ToolContent } from '../types';
import { DEFAULT_AUTHOR } from '../../lib/site';

export const content: ToolContent = {
  toolId: 'ip-lookup',
  metaDescription:
    'Look up the location, ISP, ASN, and timezone of any IPv4 or IPv6 address, or check your own public IP. Free, no signup, with the data source shown.',
  sections: [
    { heading: "What this tool does", content: "The IP Lookup tool retrieves geolocation and network information for any IPv4 or IPv6 address. Enter an address to see its approximate location, timezone, ISP, ASN, and coordinates. Leave the field empty to look up your own public IP address." },
    { heading: "How it works", content: "Queries are sent directly from your browser to ipapi.co, a public geolocation API. The API maps IP addresses to physical locations using regularly updated databases from regional internet registries (RIRs) such as ARIN, RIPE NCC, and APNIC." },
    { heading: "When to use it", content: "Use IP Lookup to verify the origin of traffic, investigate suspicious requests, confirm geolocation for debugging, or identify which organisation or ISP owns a particular IP block. It is commonly used by network engineers, security analysts, and developers working with access control rules." },
    { heading: "Limitations", content: "Geolocation is an estimate and is not 100% accurate. Mobile devices, VPN users, and Tor exit nodes may show incorrect locations. Corporate networks and cloud providers may geolocate to a data centre rather than the actual user location. For precise location data, use device GPS." },
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
    { q: "How accurate is IP geolocation?", a: "Country-level accuracy is typically above 95%. City-level accuracy varies considerably. It can be within a few kilometres for broadband connections, but may be off by hundreds of kilometres for mobile or satellite connections." },
    { q: "Why does my IP show the wrong city?", a: "ISPs route traffic through regional points of presence, so your IP may geolocate to your ISP's nearest data centre rather than your physical location. VPNs and proxies will show the server's location instead." },
    { q: "What is an ASN?", a: "An Autonomous System Number (ASN) identifies a network operated by a single organisation on the internet. Large ISPs, universities, and cloud providers each have one or more ASNs assigned to them by regional internet registries." },
    { q: "Can I look up my own IP?", a: "Yes. Leave the input field blank and click Lookup to see your own public IP address and its associated location and network details." },
    { q: "Is IPv6 supported?", a: "Yes. Paste any valid IPv4 or IPv6 address into the input and the tool will return full geolocation and network information." },
  ],
  relatedGuides: [],
  relatedTools: ['geoip-lookup', 'reverse-dns', 'dns-lookup'],
  lastReviewed: '2026-11-20', // update only when you actually re-review this text
  author: DEFAULT_AUTHOR,
};