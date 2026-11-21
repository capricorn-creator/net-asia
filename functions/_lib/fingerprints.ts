export type Category =
  | 'framework' | 'cms' | 'js-framework' | 'ui-library' | 'analytics' | 'cdn'
  | 'hosting' | 'server' | 'language' | 'security' | 'ecommerce' | 'database' | 'other';

export interface Fingerprint {
  name: string;
  category: Category;
  website: string;
  /** header name (lowercase) -> regex; first capture group is the version */
  headers?: Record<string, string>;
  /** meta name (lowercase) -> regex */
  meta?: Record<string, string>;
  /** regexes tested against the raw HTML */
  html?: string[];
  /** regexes tested against each <script src> */
  scripts?: string[];
}

// Maintained by us. Add a rule only when you have seen it in a real response.
export const FINGERPRINTS: Fingerprint[] = [
  { name: 'WordPress', category: 'cms', website: 'https://wordpress.org', meta: { generator: '^WordPress\\s*([\\d.]+)?' }, html: ['/wp-content/', '/wp-includes/'] },
  { name: 'Drupal', category: 'cms', website: 'https://www.drupal.org', headers: { 'x-generator': 'Drupal\\s*([\\d.]+)?' }, meta: { generator: '^Drupal\\s*([\\d.]+)?' }, html: ['Drupal\\.settings'] },
  { name: 'Joomla', category: 'cms', website: 'https://www.joomla.org', meta: { generator: '^Joomla!?\\s*-?\\s*([\\d.]+)?' } },
  { name: 'Ghost', category: 'cms', website: 'https://ghost.org', meta: { generator: '^Ghost\\s*([\\d.]+)?' } },
  { name: 'Shopify', category: 'ecommerce', website: 'https://www.shopify.com', scripts: ['cdn\\.shopify\\.com'], html: ['Shopify\\.theme'] },
  { name: 'Wix', category: 'cms', website: 'https://www.wix.com', headers: { 'x-wix-request-id': '.+' }, html: ['static\\.wixstatic\\.com'] },
  { name: 'Squarespace', category: 'cms', website: 'https://www.squarespace.com', meta: { generator: '^Squarespace' }, html: ['static1\\.squarespace\\.com'] },
  { name: 'Webflow', category: 'cms', website: 'https://webflow.com', meta: { generator: '^Webflow' }, html: ['data-wf-(?:page|site)='] },
  { name: 'Next.js', category: 'framework', website: 'https://nextjs.org', headers: { 'x-powered-by': 'Next\\.js\\s*([\\d.]+)?' }, html: ['__NEXT_DATA__', '/_next/static/'] },
  { name: 'Nuxt', category: 'framework', website: 'https://nuxt.com', html: ['window\\.__NUXT__', '/_nuxt/'] },
  { name: 'Gatsby', category: 'framework', website: 'https://www.gatsbyjs.com', meta: { generator: '^Gatsby\\s*([\\d.]+)?' }, html: ['id="___gatsby"'] },
  { name: 'SvelteKit', category: 'framework', website: 'https://kit.svelte.dev', html: ['/_app/immutable/'] },
  { name: 'Angular', category: 'js-framework', website: 'https://angular.dev', html: ['ng-version="([\\d.]+)"'] },
  { name: 'React', category: 'js-framework', website: 'https://react.dev', html: ['data-reactroot'], scripts: ['react(?:-dom)?(?:\\.production)?(?:\\.min)?\\.js'] },
  { name: 'Vue.js', category: 'js-framework', website: 'https://vuejs.org', html: ['data-v-app', 'data-server-rendered="true"'], scripts: ['vue(?:\\.runtime)?(?:\\.global)?(?:\\.prod)?(?:\\.min)?\\.js'] },
  { name: 'jQuery', category: 'ui-library', website: 'https://jquery.com', scripts: ['jquery[.-]?(\\d[\\d.]*)?(?:\\.min)?\\.js'] },
  { name: 'Bootstrap', category: 'ui-library', website: 'https://getbootstrap.com', scripts: ['bootstrap(?:\\.bundle)?(?:\\.min)?\\.js'], html: ['bootstrap(?:[.-]([\\d.]+))?(?:\\.min)?\\.css'] },
  { name: 'Google Analytics', category: 'analytics', website: 'https://marketingplatform.google.com/about/analytics/', scripts: ['googletagmanager\\.com/gtag/js', 'google-analytics\\.com/(?:analytics|ga)\\.js'] },
  { name: 'Google Tag Manager', category: 'analytics', website: 'https://tagmanager.google.com', scripts: ['googletagmanager\\.com/gtm\\.js'] },
  { name: 'Google AdSense', category: 'other', website: 'https://adsense.google.com', scripts: ['pagead2\\.googlesyndication\\.com/pagead/js/adsbygoogle\\.js'] },
  { name: 'Meta Pixel', category: 'analytics', website: 'https://www.facebook.com/business/tools/meta-pixel', scripts: ['connect\\.facebook\\.net/.+/fbevents\\.js'] },
  { name: 'reCAPTCHA', category: 'security', website: 'https://www.google.com/recaptcha/', scripts: ['google\\.com/recaptcha/'] },
  { name: 'Cloudflare', category: 'cdn', website: 'https://www.cloudflare.com', headers: { server: '^cloudflare$', 'cf-ray': '.+' } },
  { name: 'Amazon CloudFront', category: 'cdn', website: 'https://aws.amazon.com/cloudfront/', headers: { 'x-amz-cf-id': '.+', via: 'CloudFront' } },
  { name: 'Fastly', category: 'cdn', website: 'https://www.fastly.com', headers: { 'x-served-by': 'cache-[a-z0-9-]+', 'x-fastly-request-id': '.+' } },
  { name: 'Akamai', category: 'cdn', website: 'https://www.akamai.com', headers: { server: 'AkamaiGHost' } },
  { name: 'Vercel', category: 'hosting', website: 'https://vercel.com', headers: { server: '^Vercel$', 'x-vercel-id': '.+' } },
  { name: 'Netlify', category: 'hosting', website: 'https://www.netlify.com', headers: { server: '^Netlify$', 'x-nf-request-id': '.+' } },
  { name: 'GitHub Pages', category: 'hosting', website: 'https://pages.github.com', headers: { server: '^GitHub\\.com$' } },
  { name: 'nginx', category: 'server', website: 'https://nginx.org', headers: { server: 'nginx(?:/([\\d.]+))?' } },
  { name: 'Apache HTTP Server', category: 'server', website: 'https://httpd.apache.org', headers: { server: 'Apache(?:/([\\d.]+))?' } },
  { name: 'Microsoft IIS', category: 'server', website: 'https://www.iis.net', headers: { server: 'Microsoft-IIS(?:/([\\d.]+))?' } },
  { name: 'LiteSpeed', category: 'server', website: 'https://www.litespeedtech.com', headers: { server: 'LiteSpeed' } },
  { name: 'PHP', category: 'language', website: 'https://www.php.net', headers: { 'x-powered-by': 'PHP(?:/([\\d.]+))?' } },
  { name: 'ASP.NET', category: 'framework', website: 'https://dotnet.microsoft.com/apps/aspnet', headers: { 'x-powered-by': 'ASP\\.NET', 'x-aspnet-version': '([\\d.]+)' } },
  { name: 'Express', category: 'framework', website: 'https://expressjs.com', headers: { 'x-powered-by': '^Express' } },
];