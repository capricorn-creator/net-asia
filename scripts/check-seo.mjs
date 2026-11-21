import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = process.env.SITE_URL ?? 'https://net-asia.com';
const SUFFIX = ' | NET Asia';
const DIST = path.resolve('dist');
// HTML files in /public that are not pages (for example a Search Console verification file).
const IGNORE = [/^google[0-9a-f]+\.html$/i];
const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(e.name === 'assets' ? [] : await walk(p)));
    else out.push(p);
  }
  return out;
}

const decode = s => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const metaContent = (html, attr, key) => {
  const m = html.match(new RegExp(`<meta ${attr}="${escRe(key)}" content="([^"]*)"`));
  return m ? decode(m[1]) : null;
};

const files = (await walk(DIST))
  .map(f => path.relative(DIST, f).split(path.sep).join('/'))
  .filter(f => f.endsWith('.html') && !IGNORE.some(re => re.test(f)));

const seen = { title: new Map(), description: new Map(), canonical: new Map() };
const dupe = (kind, value, file) => {
  const prev = seen[kind].get(value);
  if (prev) fail(file, `duplicate ${kind} (also on ${prev})`);
  else seen[kind].set(value, file);
};

for (const rel of files) {
  const html = await readFile(path.join(DIST, rel), 'utf8');
  // index.html is "/", every other page is written as <path>.html and served without a trailing slash.
  const expectedPath = rel === 'index.html' ? '/' : '/' + rel.replace(/\.html$/, '');
  const isTool = /^tools\/[^/]+\.html$/.test(rel);
  const isGuide = /^guides\/[^/]+\.html$/.test(rel);

  if (html.includes('<div id="root"></div>')) fail(rel, 'root div is empty (page was not prerendered)');
  if (html.includes('<!--seo-head-->')) fail(rel, 'the <!--seo-head--> placeholder was not replaced');

  // The page text must be inline, not in a streamed hidden block behind a loading skeleton.
  if (html.includes('<template id="B:') || /<div hidden id="S:/.test(html)) {
    fail(rel, 'page content is in a streamed hidden block (React sent the loading fallback first)');
  }
  if (html.includes('Loading page')) fail(rel, 'the loading skeleton is present in the prerendered HTML');

  const title = (html.match(/<title>([^<]*)<\/title>/) ?? [])[1];
  if (!title) fail(rel, 'missing <title>');
  else {
    const t = decode(title);
    if (t.length > 60) fail(rel, `title is ${t.length} chars (max 60): "${t}"`);
    if (!t.endsWith(SUFFIX)) fail(rel, `title must end with "${SUFFIX}": "${t}"`);
    dupe('title', t, rel);
  }

  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) fail(rel, `expected exactly 1 <h1>, found ${h1s}`);

  const robots = metaContent(html, 'name', 'robots');
  if (!robots) fail(rel, 'missing robots meta');
  const noindex = /noindex/.test(robots ?? '');
  if ((rel === '404.html' || expectedPath === '/favorites') && !noindex) fail(rel, 'must be noindex');
  if (noindex) continue;

  const desc = metaContent(html, 'name', 'description');
  if (!desc) fail(rel, 'missing meta description');
  else {
    if (desc.length < 140 || desc.length > 160) fail(rel, `description is ${desc.length} chars (need 140-160)`);
    dupe('description', desc, rel);
  }

  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) ?? [])[1];
  if (!canonical) fail(rel, 'missing canonical');
  else {
    if (canonical !== SITE_URL + expectedPath) fail(rel, `canonical is ${canonical}, expected ${SITE_URL + expectedPath}`);
    dupe('canonical', canonical, rel);
  }

  for (const [attr, key] of [
    ['property', 'og:title'], ['property', 'og:description'], ['property', 'og:url'],
    ['property', 'og:type'], ['property', 'og:image'], ['name', 'twitter:card'],
  ]) {
    if (!metaContent(html, attr, key)) fail(rel, `missing ${key}`);
  }
  if (isGuide) {
    for (const k of ['article:published_time', 'article:modified_time', 'article:author']) {
      if (!metaContent(html, 'property', k)) fail(rel, `missing ${k}`);
    }
  }

  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  const byType = new Map();
  blocks.forEach((b, i) => {
    try {
      const obj = JSON.parse(b[1]);
      if (obj['@context'] !== 'https://schema.org') fail(rel, `JSON-LD #${i + 1} has no schema.org @context`);
      if (!obj['@type']) fail(rel, `JSON-LD #${i + 1} has no @type`);
      byType.set(obj['@type'], obj);
    } catch (e) {
      fail(rel, `JSON-LD #${i + 1} is not valid JSON (${e.message})`);
    }
  });

  const need = types => types.forEach(t => !byType.has(t) && fail(rel, `missing JSON-LD ${t}`));
  need(['Organization', 'WebSite']);
  if (byType.get('WebSite')?.potentialAction) fail(rel, 'WebSite must not declare a SearchAction');
  if (expectedPath !== '/') {
    need(['BreadcrumbList']);
    const items = byType.get('BreadcrumbList')?.itemListElement ?? [];
    if (items.length < 2) fail(rel, 'BreadcrumbList needs at least 2 items');
    items.forEach(it => (!it.name || !it.item || !it.position) && fail(rel, 'BreadcrumbList item missing name/item/position'));
  }
  if (isTool) {
    need(['WebApplication', 'FAQPage']);
    if (!(byType.get('FAQPage')?.mainEntity?.length > 0)) fail(rel, 'FAQPage has no questions');
  }
  if (isGuide) {
    need(['Article']);
    const a = byType.get('Article') ?? {};
    for (const k of ['headline', 'image', 'datePublished', 'dateModified']) if (!a[k]) fail(rel, `Article missing ${k}`);
    if (!a.author?.name) fail(rel, 'Article missing author.name');
    if (!a.publisher?.name) fail(rel, 'Article missing publisher.name');
  }
}

if (errors.length) {
  console.error(`\nSEO check failed (${errors.length} problem${errors.length > 1 ? 's' : ''}):\n`);
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}
console.log(`SEO check passed for ${files.length} prerendered pages.`);