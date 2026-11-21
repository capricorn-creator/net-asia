import { json, sourceInfo, toResponse } from '../_lib/http';
import type { Ctx } from '../_lib/http';
import { limited } from '../_lib/ratelimit';
import { followChain, parseTarget } from '../_lib/ssrf';

export const onRequestGet = async ({ request }: Ctx) => {
  const over = limited(request);
  if (over) return over;
  try {
    const start = parseTarget(new URL(request.url).searchParams.get('url') ?? '');
    const chain = await followChain(start);
    await chain.response.body?.cancel();
    const res = chain.response;

    const headers: { name: string; value: string }[] = [];
    res.headers.forEach((value, name) => headers.push({ name, value }));
    const cookies = res.headers.getSetCookie?.() ?? [];
    if (cookies.length > 1) {
      const rest = headers.filter(h => h.name !== 'set-cookie');
      cookies.forEach(value => rest.push({ name: 'set-cookie', value }));
      headers.length = 0;
      headers.push(...rest);
    }

    return json({
      url: chain.finalUrl,
      status: res.status,
      statusText: res.statusText,
      headers,
      redirects: chain.hops.slice(0, -1).map(h => h.url),
      responseTime: chain.totalMs,
      serverInfo: res.headers.get('server') ?? undefined,
      truncatedRedirects: chain.truncated,
      source: sourceInfo(),
    });
  } catch (e) {
    return toResponse(e);
  }
};