#!/usr/bin/env node
// Usage:
//   node scripts/migrate-tool-content.mjs --dry-run   preview only
//   node scripts/migrate-tool-content.mjs             write files
//   add --force to overwrite existing src/content/tools/<id>.ts files
// Commit to git first so you can review the diff.
import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const DRY = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');
const PAGES_DIR = 'src/pages/tools';
const OUT_DIR = 'src/content/tools';
const TODAY = new Date().toISOString().slice(0, 10);

// 140-160 characters each. scripts/check-seo.mjs verifies the final HTML.
const META = {
  'ip-lookup': 'Look up the location, ISP, ASN, and timezone of any IPv4 or IPv6 address, or check your own public IP. Free, no signup, with the data source shown.',
  'geoip-lookup': 'Get detailed GeoIP data for any IP address: country, region, city, timezone, ISP, and ASN, plus map links. Free, no signup, and the data source is shown.',
  'dns-lookup': 'Query A, AAAA, MX, CNAME, TXT, NS, SOA, and CAA records for any domain. Free, no signup, with the resolver that answered shown next to the result.',
  'whois-lookup': 'Look up domain registration data: registrar, creation and expiry dates, nameservers, and status codes. Free, no signup, with the data source shown.',
  'ssl-checker': 'Check an SSL/TLS certificate for any domain: validity dates, days until expiry, issuer, and subject alternative names. Free, no signup, source shown.',
  'http-headers': 'Inspect the HTTP status code and response headers for any URL, and see which common security headers are present or missing. Free, no signup required.',
  'website-tech': 'Detect the CMS, frameworks, analytics, CDN, and server software a website uses, based on its HTML and response headers. Free, no signup required.',
  'reverse-dns': 'Find the PTR hostname for any IPv4 or IPv6 address with a reverse DNS lookup, and learn why many addresses have none. Free, no signup required.',
  'dns-propagation': 'Check whether a DNS change has reached public resolvers worldwide. Compare answers from eight resolvers side by side. Free, no signup required.',
  'redirect-checker': 'Trace every redirect hop for a URL, including HTTP to HTTPS upgrades and www redirects, and see the final destination. Free, no signup required.',
};

function skipString(src, i) {
  const q = src[i];
  for (i++; i < src.length; i++) {
    if (src[i] === '\\') { i++; continue; }
    if (src[i] === q) return i;
  }
  return src.length;
}

function matchBracket(src, open) {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (ch === '"' || ch === "'" || ch === '`') { i = skipString(src, i); continue; }
    if (ch === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i < 0) break; continue; }
    if (ch === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2) + 1; continue; }
    if (ch === '[') depth++;
    else if (ch === ']' && --depth === 0) return i;
  }
  return -1;
}

/** Finds `const NAME = [ ... ];` and returns its range plus the raw array literal. */
function extractConst(src, name) {
  const re = new RegExp(`(^|\\n)[ \\t]*(?:export\\s+)?const\\s+${name}\\s*(?::[^=\\n]+)?=\\s*\\[`);
  const m = re.exec(src);
  if (!m) return null;
  const open = m.index + m[0].length - 1;
  const close = matchBracket(src, open);
  if (close < 0) return null;
  let end = close + 1;
  if (src[end] === ';') end++;
  if (src[end] === '\r') end++;
  if (src[end] === '\n') end++;
  return { start: m.index + m[1].length, end, literal: src.slice(open, close + 1) };
}

const exists = p => access(p).then(() => true, () => false);
const report = [];
const files = (await readdir(PAGES_DIR)).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const pagePath = path.join(PAGES_DIR, file);
  const src = await readFile(pagePath, 'utf8');
  if (!/<ToolInfo\b/.test(src)) { report.push(`skip   ${file} (no <ToolInfo>, already migrated)`); continue; }

  const toolId = src.match(/toolId=["']([\w-]+)["']/)?.[1];
  const info = src.match(/<ToolInfo\b([\s\S]*?)\/>/)?.[1];
  if (!toolId || !info) { report.push(`FAIL   ${file}: could not find toolId or the <ToolInfo> props`); continue; }

  const prop = n => info.match(new RegExp(`${n}=\\{\\s*(\\w+)\\s*\\}`))?.[1];
  const names = { sections: prop('sections'), faqs: prop('faqs'), related: prop('relatedTools') };
  const found = {
    sections: names.sections ? extractConst(src, names.sections) : null,
    faqs: names.faqs ? extractConst(src, names.faqs) : null,
    related: names.related ? extractConst(src, names.related) : null,
  };
  const missing = Object.keys(names).filter(k => names[k] && !found[k]);
  if (missing.length) { report.push(`FAIL   ${file}: could not locate constant(s) for ${missing.join(', ')}`); continue; }

  let relatedIds = [];
  if (found.related) {
    try {
      const arr = new Function(`"use strict"; return (${found.related.literal});`)();
      relatedIds = arr.map(r => String(r.path).split('/').filter(Boolean).pop()).filter(Boolean);
    } catch (e) {
      report.push(`FAIL   ${file}: related tools array is not plain data (${e.message})`);
      continue;
    }
  }

  const pageDesc = src.match(/description=["']([^"']+)["']/)?.[1] ?? '';
  const meta = META[toolId] ?? pageDesc;
  const todo = META[toolId] ? '' : ' // TODO: write 140-160 characters';

  const contentSrc = `import type { ToolContent } from '../types';
import { DEFAULT_AUTHOR } from '../../lib/site';

export const content: ToolContent = {
  toolId: ${JSON.stringify(toolId)},
  metaDescription:
    ${JSON.stringify(meta)},${todo}
  sections: ${found.sections ? found.sections.literal : '[]'},
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
  faqs: ${found.faqs ? found.faqs.literal : '[]'},
  relatedGuides: [],
  relatedTools: ${JSON.stringify(relatedIds)},
  lastReviewed: '${TODAY}', // update only when you actually re-review this text
  author: DEFAULT_AUTHOR,
};
`;

  // Rewrite the page. Cut constants from the bottom up so offsets stay valid.
  let out = src;
  for (const c of Object.values(found).filter(Boolean).sort((a, b) => b.start - a.start)) {
    out = out.slice(0, c.start) + out.slice(c.end);
  }
  out = out.replace(/^import\s+ToolInfo\s+from\s+['"][^'"]+['"];?[ \t]*\r?\n/m, '');
  out = out.replace(/\r?\n[ \t]*<ToolInfo\b[\s\S]*?\/>/, '');

  let lastImportEnd = 0;
  for (const m of out.matchAll(/^import[\s\S]*?from\s+['"][^'"]+['"];?[ \t]*\r?\n/gm)) lastImportEnd = m.index + m[0].length;
  out = out.slice(0, lastImportEnd) + `import { content } from '../../content/tools/${toolId}';\n` + out.slice(lastImportEnd);
  out = out.replace('<ToolPageLayout', '<ToolPageLayout\n      content={content}');
  out = out.replace(/\n{3,}/g, '\n\n');

  if (/ToolInfo/.test(out)) { report.push(`FAIL   ${file}: ToolInfo is still referenced after rewrite, left untouched`); continue; }

  const contentPath = path.join(OUT_DIR, `${toolId}.ts`);
  const hasContent = await exists(contentPath);
  if (!DRY) {
    await mkdir(OUT_DIR, { recursive: true });
    if (!hasContent || FORCE) await writeFile(contentPath, contentSrc);
    await writeFile(pagePath, out);
  }
  report.push(
    `${DRY ? 'would ' : ''}migrate ${file} -> ${contentPath}` +
    `${hasContent && !FORCE ? ' (content file already existed, kept)' : ''}` +
    `${META[toolId] ? '' : '  [!] no preset metaDescription'}`
  );
}

console.log(report.join('\n'));
if (report.some(r => r.startsWith('FAIL'))) process.exitCode = 1;