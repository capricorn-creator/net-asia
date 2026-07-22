import type { Tool, Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'network',
    name: 'Network',
    description: 'IP geolocation, reverse DNS, and network diagnostics',
    icon: '🌐',
    color: 'text-blue-400',
    gradient: 'from-blue-600/20 to-blue-400/5',
  },
  {
    id: 'dns',
    name: 'DNS',
    description: 'DNS record lookup, propagation checking, and reverse resolution',
    icon: '🔍',
    color: 'text-cyan-400',
    gradient: 'from-cyan-600/20 to-cyan-400/5',
  },
  {
    id: 'domain',
    name: 'Domain',
    description: 'WHOIS registration data, ownership details, and expiry tracking',
    icon: '🏷️',
    color: 'text-purple-400',
    gradient: 'from-purple-600/20 to-purple-400/5',
  },
  {
    id: 'ssl',
    name: 'SSL / TLS',
    description: 'Certificate validity checking, expiry monitoring, and issuer details',
    icon: '🔒',
    color: 'text-green-400',
    gradient: 'from-green-600/20 to-green-400/5',
  },
  {
    id: 'website',
    name: 'Website',
    description: 'HTTP headers, technology detection, redirect tracing, and site analysis',
    icon: '🌍',
    color: 'text-orange-400',
    gradient: 'from-orange-600/20 to-orange-400/5',
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Security header analysis, vulnerability exposure, and threat detection',
    icon: '🛡️',
    color: 'text-red-400',
    gradient: 'from-red-600/20 to-red-400/5',
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Utilities, formatters, generators, and converters for developers',
    icon: '⚙️',
    color: 'text-yellow-400',
    gradient: 'from-yellow-600/20 to-yellow-400/5',
  },
  {
    id: 'encoding',
    name: 'Encoding',
    description: 'Base64, URL encoding, and data format conversion tools',
    icon: '🔄',
    color: 'text-pink-400',
    gradient: 'from-pink-600/20 to-pink-400/5',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    description: 'General purpose web and internet utilities',
    icon: '🔧',
    color: 'text-indigo-400',
    gradient: 'from-indigo-600/20 to-indigo-400/5',
  },
];

// Live tools — visible everywhere in the public UI
export const TOOLS: Tool[] = [
  {
    id: 'ip-lookup',
    name: 'IP Lookup',
    description: 'Identify the geolocation, ISP, ASN, and timezone of any IPv4 or IPv6 address',
    icon: '🌐',
    category: 'network',
    path: '/tools/ip-lookup',
    isPopular: true,
    color: 'blue',
  },
  {
    id: 'dns-lookup',
    name: 'DNS Lookup',
    description: 'Query A, AAAA, MX, CNAME, TXT, NS, SOA, and CAA records for any domain',
    icon: '🔍',
    category: 'dns',
    path: '/tools/dns-lookup',
    isPopular: true,
    color: 'cyan',
  },
  {
    id: 'whois-lookup',
    name: 'WHOIS Lookup',
    description: 'Retrieve domain registration details, registrar, nameservers, and expiry date',
    icon: '🏷️',
    category: 'domain',
    path: '/tools/whois-lookup',
    isPopular: true,
    color: 'purple',
  },
  {
    id: 'ssl-checker',
    name: 'SSL Certificate Checker',
    description: 'Verify SSL/TLS certificate validity, expiry date, issuer chain, and SANs',
    icon: '🔒',
    category: 'ssl',
    path: '/tools/ssl-checker',
    isPopular: true,
    color: 'green',
  },
  {
    id: 'http-headers',
    name: 'HTTP Headers Checker',
    description: 'Inspect HTTP response headers, status codes, and security header coverage',
    icon: '📋',
    category: 'website',
    path: '/tools/http-headers',
    color: 'blue',
  },
  {
    id: 'website-tech',
    name: 'Website Tech Detector',
    description: 'Detect CMS, frameworks, analytics, CDN, and infrastructure used by any website',
    icon: '🔭',
    category: 'website',
    path: '/tools/website-tech',
    color: 'purple',
  },
  {
    id: 'geoip-lookup',
    name: 'GeoIP Lookup',
    description: 'Detailed geolocation for any IP — country flag, city, timezone, ISP, ASN, and map links',
    icon: '🗺️',
    category: 'network',
    path: '/tools/geoip-lookup',
    isPopular: true,
    color: 'cyan',
  },
  {
    id: 'reverse-dns',
    name: 'Reverse DNS Lookup',
    description: 'Resolve the PTR hostname record for any IPv4 or IPv6 address',
    icon: '🔄',
    category: 'dns',
    path: '/tools/reverse-dns',
    color: 'blue',
  },
  {
    id: 'dns-propagation',
    name: 'DNS Propagation Checker',
    description: 'Check DNS propagation across 8 global resolvers including Google, Cloudflare, and Quad9',
    icon: '📡',
    category: 'dns',
    path: '/tools/dns-propagation',
    color: 'cyan',
  },
  {
    id: 'redirect-checker',
    name: 'URL Redirect Checker',
    description: 'Trace every redirect step of a URL — HTTP to HTTPS upgrades, www redirects, and final destination',
    icon: '🔀',
    category: 'website',
    path: '/tools/redirect-checker',
    color: 'orange',
  },
];

// Hidden from public UI — routes still exist to avoid broken links
export const HIDDEN_TOOLS: Tool[] = [
  { id: 'password-gen',   name: 'Password Generator',   description: '', icon: '🔑', category: 'security',  path: '/tools/password-generator', comingSoon: true, color: 'green'  },
  { id: 'hash-gen',       name: 'Hash Generator',       description: '', icon: '#️⃣', category: 'developer', path: '/tools/hash-generator',     comingSoon: true, color: 'orange' },
  { id: 'qr-gen',         name: 'QR Code Generator',    description: '', icon: '▦',  category: 'utilities', path: '/tools/qr-generator',       comingSoon: true, color: 'cyan'   },
  { id: 'uuid-gen',       name: 'UUID Generator',       description: '', icon: '🎲', category: 'developer', path: '/tools/uuid-generator',     comingSoon: true, color: 'blue'   },
  { id: 'base64',         name: 'Base64 Encode/Decode', description: '', icon: '📦', category: 'encoding',  path: '/tools/base64',             comingSoon: true, color: 'purple' },
  { id: 'url-encode',     name: 'URL Encode/Decode',    description: '', icon: '🔗', category: 'encoding',  path: '/tools/url-encoder',        comingSoon: true, color: 'blue'   },
  { id: 'json-formatter', name: 'JSON Formatter',       description: '', icon: '{}', category: 'developer', path: '/tools/json-formatter',     comingSoon: true, color: 'cyan'   },
  { id: 'timestamp',      name: 'Timestamp Converter',  description: '', icon: '⏱️', category: 'utilities', path: '/tools/timestamp',          comingSoon: true, color: 'purple' },
  { id: 'robots-viewer',  name: 'Robots.txt Viewer',    description: '', icon: '🤖', category: 'website',   path: '/tools/robots-viewer',      comingSoon: true, color: 'green'  },
  { id: 'sitemap-viewer', name: 'Sitemap Viewer',       description: '', icon: '🗂️', category: 'website',   path: '/tools/sitemap-viewer',     comingSoon: true, color: 'orange' },
  { id: 'http-status',    name: 'HTTP Status Explorer', description: '', icon: '📡', category: 'website',   path: '/tools/http-status',        comingSoon: true, color: 'blue'   },
  { id: 'port-scanner',   name: 'Port Scanner',         description: '', icon: '🔓', category: 'network',   path: '/tools/port-scanner',       comingSoon: true, color: 'purple' },
  { id: 'ping',           name: 'Online Ping',          description: '', icon: '📶', category: 'network',   path: '/tools/ping',               comingSoon: true, color: 'blue'   },
];

export const getLiveTool   = ()            => TOOLS;
export const getPopularTools = ()          => TOOLS.filter(t => t.isPopular);
export const getToolsByCategory = (cat: string) => TOOLS.filter(t => t.category === cat);
export const getToolById   = (id: string)  => [...TOOLS, ...HIDDEN_TOOLS].find(t => t.id === id);
export const searchTools   = (query: string) => {
  const q = query.toLowerCase();
  return TOOLS.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q)
  );
};
