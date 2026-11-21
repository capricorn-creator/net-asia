import { FINGERPRINTS } from './fingerprints';
import type { Category } from './fingerprints';

export interface Detected {
  name: string;
  category: Category;
  confidence: number;
  version?: string;
  website: string;
}

const CONF = { header: 95, meta: 90, script: 85, html: 70 };

function extractMeta(html: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const name = tag.match(/\bname=["']([^"']+)["']/i)?.[1]?.toLowerCase();
    const content = tag.match(/\bcontent=["']([^"']*)["']/i)?.[1];
    if (name && content !== undefined && !(name in out)) out[name] = content;
  }
  return out;
}

export function detect(headers: Headers, html: string): Detected[] {
  const meta = extractMeta(html);
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(m => m[1]);
  const found: Detected[] = [];

  for (const fp of FINGERPRINTS) {
    let confidence = 0;
    let version: string | undefined;
    const hit = (conf: number, m: RegExpMatchArray | null) => {
      confidence = Math.max(confidence, conf);
      if (m?.[1] && !version) version = m[1];
    };

    for (const [h, re] of Object.entries(fp.headers ?? {})) {
      const v = headers.get(h);
      const m = v ? v.match(new RegExp(re, 'i')) : null;
      if (m) hit(CONF.header, m);
    }
    for (const [n, re] of Object.entries(fp.meta ?? {})) {
      const m = meta[n]?.match(new RegExp(re, 'i'));
      if (m) hit(CONF.meta, m);
    }
    for (const re of fp.scripts ?? []) {
      const rx = new RegExp(re, 'i');
      for (const s of scripts) {
        const m = s.match(rx);
        if (m) hit(CONF.script, m);
      }
    }
    for (const re of fp.html ?? []) {
      const m = html.match(new RegExp(re, 'i'));
      if (m) hit(CONF.html, m);
    }

    if (confidence) found.push({ name: fp.name, category: fp.category, confidence, version, website: fp.website });
  }
  return found.sort((a, b) => b.confidence - a.confidence);
}