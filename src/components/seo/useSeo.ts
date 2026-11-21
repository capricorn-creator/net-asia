import { useContext, useEffect } from 'react';
import { HeadContext } from './HeadContext';
import { buildHeadTags, formatTitle } from '../../lib/seo';
import type { SeoData } from '../../lib/seo';

function applyHead(data: SeoData) {
  document.title = formatTitle(data.title);
  document.head.querySelectorAll('[data-seo]').forEach(n => n.remove());
  for (const t of buildHeadTags(data)) {
    const el = document.createElement(t.tag);
    for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v);
    el.setAttribute('data-seo', '');
    if (t.json) el.textContent = t.json;
    document.head.appendChild(el);
  }
}

/**
 * Server: records the data so the prerender can write it into <head>.
 * Client: replaces the [data-seo] tags in <head> after mount.
 * Last writer wins, so a page's own <Seo> overrides the route fallback.
 */
export function useSeo(data: SeoData | null) {
  const collector = useContext(HeadContext);
  const resolved = data && collector?.forceNoIndex ? { ...data, noindex: true } : data;
  if (collector && resolved) collector.data = resolved;
  const key = resolved ? JSON.stringify(resolved) : '';
  useEffect(() => {
    if (key) applyHead(JSON.parse(key) as SeoData);
  }, [key]);
}