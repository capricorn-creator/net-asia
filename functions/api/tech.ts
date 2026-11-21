import { HttpError, json, sourceInfo, toResponse } from '../_lib/http';
import type { Ctx } from '../_lib/http';
import { limited } from '../_lib/ratelimit';
import { followChain, parseTarget, readText } from '../_lib/ssrf';
import { detect } from '../_lib/detect';

// Kept below 1 MB on purpose: regex scanning costs CPU, and the free Workers plan allows about 10 ms per request.
const MAX_HTML_BYTES = 300_000;

const CATEGORIES = [
  'framework', 'cms', 'js-framework', 'ui-library', 'analytics', 'cdn',
  'hosting', 'server', 'language', 'security', 'ecommerce', 'database', 'other',
];

export const onRequestGet = async ({ request }: Ctx) => {
  const over = limited(request);
  if (over) return over;
  try {
    const start = parseTarget(new URL(request.url).searchParams.get('url') ?? '');
    const chain = await followChain(start, 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5');
    if (chain.truncated) throw new HttpError('provider', 502, 'The site redirected more than 10 times.');

    const type = chain.response.headers.get('content-type') ?? '';
    let html = '';
    if (!type || /html|xml/i.test(type)) html = await readText(chain.response, MAX_HTML_BYTES);
    else await chain.response.body?.cancel();

    const technologies = detect(chain.response.headers, html);
    const summary = Object.fromEntries(CATEGORIES.map(c => [c, 0])) as Record<string, number>;
    technologies.forEach(t => (summary[t.category] += 1));

    return json({
      url: chain.finalUrl,
      technologies,
      summary,
      responseTime: chain.totalMs,
      source: sourceInfo('NET Asia fingerprint rules applied to a live request'),
    });
  } catch (e) {
    return toResponse(e);
  }
};