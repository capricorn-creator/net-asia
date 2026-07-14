import type { Tool, Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'network',
    name: 'Network',
    description: 'IP lookup, traceroute, ping and network diagnostics',
    icon: '🌐',
    color: 'text-blue-400',
    gradient: 'from-blue-600/20 to-blue-400/5',
  },
  {
    id: 'dns',
    name: 'DNS',
    description: 'DNS record lookup, propagation check and analysis',
    icon: '🔍',
    color: 'text-cyan-400',
    gradient: 'from-cyan-600/20 to-cyan-400/5',
  },
  {
    id: 'domain',
    name: 'Domain',
    description: 'WHOIS, domain availability and registration info',
    icon: '🏷️',
    color: 'text-purple-400',
    gradient: 'from-purple-600/20 to-purple-400/5',
  },
  {
    id: 'ssl',
    name: 'SSL',
    description: 'SSL certificate checker and security analysis',
    icon: '🔒',
    color: 'text-green-400',
    gradient: 'from-green-600/20 to-green-400/5',
  },
  {
    id: 'website',
    name: 'Website',
    description: 'HTTP headers, status codes and website analysis',
    icon: '🌍',
    color: 'text-orange-400',
    gradient: 'from-orange-600/20 to-orange-400/5',
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Security scanning, vulnerability and exposure checks',
    icon: '🛡️',
    color: 'text-red-400',
    gradient: 'from-red-600/20 to-red-400/5',
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Dev utilities, formatters, generators and converters',
    icon: '⚙️',
    color: 'text-yellow-400',
    gradient: 'from-yellow-600/20 to-yellow-400/5',
  },
  {
    id: 'encoding',
    name: 'Encoding',
    description: 'Base64, URL encoding/decoding and hash tools',
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

export const TOOLS: Tool[] = [
  // ── Phase 1: Live Tools ──────────────────────────────────────
  {
    id: 'ip-lookup',
    name: 'IP Lookup',
    description: 'Get detailed geolocation, ISP, and ASN info for any IP address',
    icon: '🌐',
    category: 'network',
    path: '/tools/ip-lookup',
    isPopular: true,
    color: 'blue',
  },
  {
    id: 'dns-lookup',
    name: 'DNS Lookup',
    description: 'Query all DNS record types including A, MX, CNAME, TXT and more',
    icon: '🔍',
    category: 'dns',
    path: '/tools/dns-lookup',
    isPopular: true,
    color: 'cyan',
  },
  {
    id: 'whois-lookup',
    name: 'WHOIS Lookup',
    description: 'Retrieve domain registration, ownership, and expiry details',
    icon: '🏷️',
    category: 'domain',
    path: '/tools/whois-lookup',
    isPopular: true,
    color: 'purple',
  },
  {
    id: 'ssl-checker',
    name: 'SSL Certificate Checker',
    description: 'Verify SSL/TLS certificate validity, expiry, and chain details',
    icon: '🔒',
    category: 'ssl',
    path: '/tools/ssl-checker',
    isPopular: true,
    color: 'green',
  },
  {
    id: 'http-headers',
    name: 'HTTP Headers Checker',
    description: 'Inspect HTTP response headers, status codes, and server info',
    icon: '📋',
    category: 'website',
    path: '/tools/http-headers',
    isNew: true,
    color: 'blue',
  },

  // ── Phase 2B: Live Tools ─────────────────────────────────────
  {
    id: 'website-tech',
    name: 'Website Tech Detector',
    description: 'Detect CMS, frameworks, analytics, CDN, and hosting technology used by any website',
    icon: '🔭',
    category: 'website',
    path: '/tools/website-tech',
    isNew: true,
    color: 'purple',
  },
  {
    id: 'geoip-lookup',
    name: 'GeoIP Lookup',
    description: 'Detailed geolocation for any IP address with country flag, city, ASN, ISP, and map links',
    icon: '🗺️',
    category: 'network',
    path: '/tools/geoip-lookup',
    isNew: true,
    isPopular: true,
    color: 'cyan',
  },
  {
    id: 'reverse-dns',
    name: 'Reverse DNS Lookup',
    description: 'Find the PTR hostname record for any IPv4 or IPv6 address via reverse DNS lookup',
    icon: '🔄',
    category: 'dns',
    path: '/tools/reverse-dns',
    isNew: true,
    color: 'blue',
  },
  {
    id: 'dns-propagation',
    name: 'DNS Propagation Checker',
    description: 'Check DNS propagation across 8 global resolvers including Google, Cloudflare, Quad9, and OpenDNS',
    icon: '📡',
    category: 'dns',
    path: '/tools/dns-propagation',
    isNew: true,
    color: 'cyan',
  },
  {
    id: 'redirect-checker',
    name: 'URL Redirect Checker',
    description: 'Trace every redirect step of a URL — HTTP→HTTPS upgrades, www redirects, and all intermediate hops',
    icon: '🔀',
    category: 'website',
    path: '/tools/redirect-checker',
    isNew: true,
    color: 'orange',
  },

  // ── Coming Soon Tools ────────────────────────────────────────

  { id: 'password-gen', name: 'Password Generator', description: 'Generate strong, customizable passwords with entropy analysis', icon: '🔑', category: 'security', path: '/tools/password-generator', comingSoon: true, color: 'green' },
  { id: 'hash-gen', name: 'Hash Generator', description: 'Compute MD5, SHA-1, SHA-256, SHA-512 hashes instantly', icon: '#️⃣', category: 'developer', path: '/tools/hash-generator', comingSoon: true, color: 'orange' },
  { id: 'qr-gen', name: 'QR Code Generator', description: 'Generate customizable QR codes for URLs, text and contact info', icon: '▦', category: 'utilities', path: '/tools/qr-generator', comingSoon: true, color: 'cyan' },
  { id: 'uuid-gen', name: 'UUID Generator', description: 'Generate v1, v4, and v5 UUIDs in bulk with formatting options', icon: '🎲', category: 'developer', path: '/tools/uuid-generator', comingSoon: true, color: 'blue' },
  { id: 'base64', name: 'Base64 Encode/Decode', description: 'Encode or decode Base64 strings and files with a single click', icon: '📦', category: 'encoding', path: '/tools/base64', comingSoon: true, color: 'purple' },
  { id: 'url-encode', name: 'URL Encode/Decode', description: 'Percent-encode and decode URLs for safe transmission', icon: '🔗', category: 'encoding', path: '/tools/url-encoder', comingSoon: true, color: 'blue' },
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Beautify, minify, validate and query JSON documents', icon: '{ }', category: 'developer', path: '/tools/json-formatter', comingSoon: true, color: 'cyan' },
  { id: 'timestamp', name: 'Timestamp Converter', description: 'Convert between Unix timestamps and human-readable dates', icon: '⏱️', category: 'utilities', path: '/tools/timestamp', comingSoon: true, color: 'purple' },
  { id: 'robots-viewer', name: 'Robots.txt Viewer', description: 'Fetch and analyze any website\'s robots.txt rules', icon: '🤖', category: 'website', path: '/tools/robots-viewer', comingSoon: true, color: 'green' },
  { id: 'sitemap-viewer', name: 'Sitemap Viewer', description: 'Parse and explore XML sitemaps with URL count and structure', icon: '🗂️', category: 'website', path: '/tools/sitemap-viewer', comingSoon: true, color: 'orange' },
  { id: 'http-status', name: 'HTTP Status Explorer', description: 'Reference guide for all HTTP status codes with examples', icon: '📡', category: 'website', path: '/tools/http-status', comingSoon: true, color: 'blue' },

  { id: 'port-scanner', name: 'Port Scanner', description: 'Check common open ports on any host', icon: '🔓', category: 'network', path: '/tools/port-scanner', comingSoon: true, color: 'purple' },
  { id: 'ping', name: 'Online Ping', description: 'Ping any host from multiple locations simultaneously', icon: '📶', category: 'network', path: '/tools/ping', comingSoon: true, color: 'blue' },
];

export const getLiveTool = () => TOOLS.filter(t => !t.comingSoon);
export const getPopularTools = () => TOOLS.filter(t => t.isPopular);
export const getToolsByCategory = (category: string) => TOOLS.filter(t => t.category === category);
export const getToolById = (id: string) => TOOLS.find(t => t.id === id);
export const searchTools = (query: string) => {
  const q = query.toLowerCase();
  return TOOLS.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q)
  );
};
