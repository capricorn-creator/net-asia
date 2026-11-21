import { normalizePath } from './seo';

export interface PageMetaEntry {
  title: string;
  description: string;
  noindex?: boolean;
}

export const PAGE_META: Record<string, PageMetaEntry> = {
  '/': {
    title: 'Free Network and DNS Diagnostic Tools',
    description:
      'Free network and web diagnostic tools: IP and GeoIP lookup, DNS, WHOIS, SSL certificate, HTTP headers, redirect, and technology checks. No signup required.',
  },
  '/tools': {
    title: 'Network and Web Diagnostic Tools',
    description:
      'Browse all ten free NET Asia tools: IP lookup, GeoIP, DNS lookup, DNS propagation, reverse DNS, WHOIS, SSL, HTTP headers, redirects, and tech detection.',
  },
  '/categories': {
    title: 'Tool Categories',
    description:
      'Explore NET Asia tools by category: network, DNS, domain, SSL/TLS, and website diagnostics. Each category lists the free tools available and what they check.',
  },
  '/about': {
    title: 'About Us',
    description:
      'NET Asia offers free network and web diagnostic tools for developers, sysadmins, and site owners. See what we build, how tools work, and who maintains them.',
  },
  '/contact': {
    title: 'Contact Us',
    description:
      'Contact the NET Asia team with questions, corrections, or feedback about our free network tools and guides. Report errors, data issues, or outdated facts.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description:
      'Read the NET Asia privacy policy: what data the site and its tools process, how cookies and third-party advertising services work, and how to contact us.',
  },
  '/terms': {
    title: 'Terms of Service',
    description:
      'Read the terms for using NET Asia: acceptable use of the free tools, accuracy limits of lookup results, intellectual property, and limits of liability.',
  },
  '/disclaimer': {
    title: 'Disclaimer',
    description:
      'Important limits on NET Asia results: lookup data comes from third-party sources, can be incomplete or delayed, and should be verified before you act on it.',
  },
  '/editorial-policy': {
    title: 'Editorial Policy',
    description:
      'How NET Asia researches, writes, reviews, and corrects its tool explanations and guides, including how we cite primary sources and handle error reports.',
  },
  '/guides': {
    title: 'Guides',
    description:
      'Practical guides to DNS, SSL certificates, HTTP headers, redirects, and IP data, written for developers and site owners and linked to the tools that help.',
  },
  '/glossary': {
    title: 'Glossary',
    description:
      'A plain-English glossary of DNS, IP, SSL/TLS, HTTP, and domain terms used across NET Asia tools, with short definitions and links to the tools that use them.',
  },
  '/favorites': {
    title: 'Saved Tools',
    description: 'Your saved NET Asia tools, stored in this browser only.',
    noindex: true,
  },
};

/** Only categories that contain at least one live tool are prerendered. */
export const CATEGORY_META: Record<string, PageMetaEntry> = {
  network: {
    title: 'Network Tools',
    description:
      'Free network tools for looking up IP address location, ISP, and ASN data. Includes IP Lookup and GeoIP Lookup, with the data source shown for every result.',
  },
  dns: {
    title: 'DNS Tools',
    description:
      'Free DNS tools: query records for any domain, check how a change has propagated across public resolvers, and find the PTR hostname for an IP address.',
  },
  domain: {
    title: 'Domain Tools',
    description:
      "Free domain tools: look up WHOIS registration data to see a domain's registrar, creation and expiry dates, nameservers, and status codes in one place.",
  },
  ssl: {
    title: 'SSL/TLS Tools',
    description:
      "Free SSL/TLS tools: check a certificate's validity dates, days until expiry, issuer, and subject alternative names so you can catch problems early.",
  },
  website: {
    title: 'Website Tools',
    description:
      'Free website tools: inspect HTTP response headers, trace redirect chains, and detect the CMS, frameworks, and server software a site uses from its responses.',
  },
};

export function lookupPageMeta(rawPath: string): PageMetaEntry | undefined {
  const path = normalizePath(rawPath);
  if (PAGE_META[path]) return PAGE_META[path];
  const m = path.match(/^\/categories\/([^/]+)$/);
  return m ? CATEGORY_META[m[1]] : undefined;
}