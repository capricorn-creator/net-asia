import { json, sourceInfo, toResponse } from '../_lib/http';
import type { Ctx } from '../_lib/http';
import { limited } from '../_lib/ratelimit';
import { followChain, parseTarget } from '../_lib/ssrf';

const bare = (h: string) => h.replace(/^www\./, '');

export const onRequestGet = async ({ request }: Ctx) => {
  const over = limited(request);
  if (over) return over;
  try {
    const start = parseTarget(new URL(request.url).searchParams.get('url') ?? '');
    const chain = await followChain(start);
    await chain.response.body?.cancel();

    const first = new URL(chain.hops[0].url);
    const last = new URL(chain.finalUrl);
    return json({
      originalUrl: start.toString(),
      finalUrl: chain.finalUrl,
      steps: chain.hops.map(h => ({ url: h.url, status: h.status, statusText: h.statusText, location: h.location })),
      redirectCount: chain.hops.length - 1,
      totalResponseTime: chain.totalMs,
      isHttpsUpgrade: first.protocol === 'http:' && last.protocol === 'https:' && bare(first.hostname) === bare(last.hostname),
      truncated: chain.truncated,
      source: sourceInfo(),
    });
  } catch (e) {
    return toResponse(e);
  }
};