import { CONTACT_EMAIL, DEFAULT_OG_IMAGE, HOME_TITLE, LOGO_URL, SITE_NAME, SITE_URL } from './site';

export interface Crumb { name: string; path: string }

export interface SeoData {
  /** Page title WITHOUT the site suffix. */
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  image?: string;
  noindex?: boolean;
  published?: string;
  modified?: string;
  author?: string;
  crumbs?: Crumb[];
  jsonLd?: Record<string, unknown>[];
}

export interface HeadTag {
  tag: 'meta' | 'link' | 'script';
  attrs: Record<string, string>;
  json?: string;
}

type Ld = Record<string, unknown>;

const SEGMENT_LABELS: Record<string, string> = {
  tools: 'Tools',
  categories: 'Categories',
  guides: 'Guides',
};

const ORG_ID = `${SITE_URL}/#organization`;

export function normalizePath(path: string): string {
  const clean = path.split('#')[0].split('?')[0] || '/';
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
  if (withSlash.length === 1) return '/';
  return withSlash.replace(/\/+$/, '') || '/';
}

/** Root keeps its slash, every other path has none. */
export function canonicalUrl(path: string): string {
  return `${SITE_URL}${normalizePath(path)}`;
}

export function formatTitle(title: string): string {
  const clean = title.replace(/\s*[|\u2014\u2013-]\s*net ?asia\s*$/i, '').trim();
  if (!clean || /^net ?asia$/i.test(clean)) return `${HOME_TITLE} | ${SITE_NAME}`;
  return `${clean} | ${SITE_NAME}`;
}

function titleCase(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function deriveCrumbs(path: string, title: string): Crumb[] {
  const segs = normalizePath(path).split('/').filter(Boolean);
  if (!segs.length) return [];
  const crumbs: Crumb[] = [{ name: 'Home', path: '/' }];
  segs.forEach((seg, i) => {
    const last = i === segs.length - 1;
    crumbs.push({
      name: last ? title : SEGMENT_LABELS[seg] ?? titleCase(seg),
      path: `/${segs.slice(0, i + 1).join('/')}`,
    });
  });
  return crumbs;
}

/* ───────────────────────── JSON-LD builders ───────────────────────── */

export function organizationLd(): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${SITE_URL}/contact`,
      ...(CONTACT_EMAIL ? { email: CONTACT_EMAIL } : {}),
    },
  };
}

/** No SearchAction: /tools?q= is client-side filtering, not server-visible search. */
export function websiteLd(): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbLd(crumbs: Crumb[]): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: canonicalUrl(c.path),
    })),
  };
}

export function webApplicationLd(a: { name: string; description: string; path: string }): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: a.name,
    description: a.description,
    url: canonicalUrl(a.path),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

export function faqLd(faqs: { q: string; a: string }[]): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function articleLd(a: {
  headline: string;
  description: string;
  path: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  authorUrl?: string;
}): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.headline,
    description: a.description,
    mainEntityOfPage: canonicalUrl(a.path),
    image: a.image ?? DEFAULT_OG_IMAGE,
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    author: { '@type': 'Person', name: a.authorName, ...(a.authorUrl ? { url: a.authorUrl } : {}) },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL, logo: { '@type': 'ImageObject', url: LOGO_URL } },
  };
}

/* ───────────────────────── Head tags ───────────────────────── */

export function buildHeadTags(d: SeoData): HeadTag[] {
  const title = formatTitle(d.title);
  const robots = d.noindex
    ? 'noindex, follow'
    : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
  const meta = (attr: 'name' | 'property', key: string, content: string): HeadTag => ({
    tag: 'meta',
    attrs: { [attr]: key, content },
  });

  const tags: HeadTag[] = [
    meta('name', 'description', d.description),
    meta('name', 'robots', robots),
  ];
  if (d.noindex) return tags;

  const url = canonicalUrl(d.path);
  const image = d.image ?? DEFAULT_OG_IMAGE;
  const type = d.type ?? 'website';

  tags.push(
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    meta('property', 'og:type', type),
    meta('property', 'og:title', title),
    meta('property', 'og:description', d.description),
    meta('property', 'og:url', url),
    meta('property', 'og:image', image),
    meta('property', 'og:image:alt', title),
    meta('property', 'og:site_name', SITE_NAME),
    meta('property', 'og:locale', 'en_US'),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', d.description),
    meta('name', 'twitter:image', image),
  );
  if (!d.image) {
    tags.push(meta('property', 'og:image:width', '1200'), meta('property', 'og:image:height', '630'));
  }
  if (type === 'article') {
    if (d.published) tags.push(meta('property', 'article:published_time', d.published));
    if (d.modified) tags.push(meta('property', 'article:modified_time', d.modified));
    if (d.author) tags.push(meta('property', 'article:author', d.author));
  }

  const graph: Ld[] = [organizationLd(), websiteLd()];
  if (normalizePath(d.path) !== '/') graph.push(breadcrumbLd(d.crumbs ?? deriveCrumbs(d.path, d.title)));
  graph.push(...(d.jsonLd ?? []));
  for (const obj of graph) {
    tags.push({
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      json: JSON.stringify(obj).replace(/</g, '\\u003c'),
    });
  }
  return tags;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Server side: the HTML string the prerender injects into <head>. */
export function renderHeadTags(d: SeoData): string {
  const lines = [`<title>${esc(formatTitle(d.title))}</title>`];
  for (const t of buildHeadTags(d)) {
    const attrs = Object.entries(t.attrs).map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
    lines.push(
      t.tag === 'script'
        ? `<script${attrs} data-seo>${t.json}</script>`
        : `<${t.tag}${attrs} data-seo>`
    );
  }
  return lines.join('\n    ');
}