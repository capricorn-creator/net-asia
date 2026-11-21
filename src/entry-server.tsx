import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { HeadContext } from './components/seo/HeadContext';
import type { HeadCollector } from './components/seo/HeadContext';
import { renderHeadTags } from './lib/seo';
import { CATEGORIES, TOOLS, getToolsByCategory } from './lib/tools-registry';
import { GUIDES } from './content/guides';

export interface RouteSpec {
  path: string;
  file: string;
  noindex: boolean;
}

export function getRoutes(): RouteSpec[] {
  const out: RouteSpec[] = [];
  // /tools/ip-lookup is written to tools/ip-lookup.html so the host serves it WITHOUT a trailing slash,
  // matching the canonical URL. (tools/ip-lookup/index.html would be served at /tools/ip-lookup/ instead.)
  const add = (path: string, noindex = false) =>
    out.push({ path, file: path === '/' ? 'index.html' : `${path.slice(1)}.html`, noindex });

  ['/', '/tools', '/categories'].forEach(p => add(p));
  // Categories without a live tool would be empty, thin pages, so they are not prerendered.
  CATEGORIES.filter(c => getToolsByCategory(c.id).length > 0).forEach(c => add(`/categories/${c.id}`));
  TOOLS.forEach(t => add(t.path));
  add('/guides');
  GUIDES.forEach(g => add(`/guides/${g.slug}`));
  ['/glossary', '/about', '/contact', '/privacy', '/terms', '/disclaimer', '/editorial-policy'].forEach(p => add(p));
  // Client-only page: prerendered (so the host does not 404 it) but noindex.
  add('/favorites', true);
  out.push({ path: '/404', file: '404.html', noindex: true });
  return out;
}

export function render(url: string, noindex = false): Promise<{ html: string; head: string }> {
  return new Promise((resolve, reject) => {
    const collector: HeadCollector = { data: null, forceNoIndex: noindex };
    let html = '';
    let failure: unknown = null;

    const sink = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString();
        cb();
      },
    });
    sink.on('finish', () => {
      if (failure) return reject(failure);
      if (!collector.data) return reject(new Error(`No SEO data was set while rendering ${url}`));
      resolve({ html, head: renderHeadTags(collector.data) });
    });

    const { pipe } = renderToPipeableStream(
      <HeadContext.Provider value={collector}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadContext.Provider>,
      {
        // Never move a finished Suspense boundary into a separate hidden chunk: write the whole page inline.
        progressiveChunkSize: Infinity,
        onAllReady() {
          pipe(sink);
        },
        onShellError: reject,
        onError(err: unknown) {
          failure = err;
        },
      }
    );
  });
}