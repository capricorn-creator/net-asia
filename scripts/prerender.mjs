import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const template = await readFile(path.join(dist, 'index.html'), 'utf8');

if (!template.includes('<!--seo-head-->') || !template.includes('<div id="root"></div>')) {
  throw new Error('dist/index.html is missing <!--seo-head--> or an empty <div id="root"></div>.');
}

const entry = pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href;
const { render, getRoutes } = await import(entry);

const routes = getRoutes();
let failed = 0;

for (const route of routes) {
  try {
    const { html, head } = await render(route.path, route.noindex);
    const page = template
      .replace('<!--seo-head-->', () => head)
      .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`);
    const out = path.join(dist, route.file);
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, page);
    console.log(`prerendered ${route.path.padEnd(32)} -> ${route.file}`);
  } catch (err) {
    failed++;
    console.error(`\nFAILED ${route.path}\n`, err, '\n');
  }
}

if (failed) {
  console.error(`${failed} route(s) failed to prerender. Fix the errors above (usually code that touches window/localStorage during render).`);
  process.exit(1);
}
console.log(`\nPrerendered ${routes.length} pages.`);