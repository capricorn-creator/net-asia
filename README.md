# NetAsia — Internet Intelligence Platform

**v2.1.0** · Phase 2B · 10 live tools · 100+ planned

A premium SaaS-style network intelligence platform built for developers, sysadmins, and security professionals. Zero backend, zero signup, zero cost.

## 🚀 Live Tools

| Tool | API | Description |
|------|-----|-------------|
| **IP Lookup** | ipapi.co | Geolocation, ISP, ASN, timezone for any IP |
| **DNS Lookup** | Google DoH | All record types (A, AAAA, MX, TXT, NS, SOA, CAA, CNAME) |
| **WHOIS Lookup** | RDAP / rdap.org | Domain registration, expiry, nameservers |
| **SSL Certificate Checker** | crt.sh | Validity, expiry, issuer, SANs |
| **HTTP Headers Checker** | corsproxy.io | Response headers with security scoring |
| **Website Tech Detector** | Wappalyzer API | Frameworks, CMS, analytics, CDN, hosting |
| **GeoIP Lookup** | ip-api.com (free) | Country flag, city, ISP, ASN, map links |
| **Reverse DNS Lookup** | Google DoH PTR | PTR record + hostname for any IP |
| **DNS Propagation Checker** | 8× DoH resolvers | Global propagation status across 8 resolvers |
| **URL Redirect Checker** | CORS proxy | Full redirect chain with step-by-step status |

## 🛠 Tech Stack

- **React 19** + **TypeScript** — UI + type safety
- **Vite 6** — fast builds, HMR, code splitting
- **Tailwind CSS 3** — utility-first with CSS variable design tokens
- **Framer Motion** — page transitions, spring animations
- **React Router 6** — lazy-loaded routes
- **Cloudflare Pages** — edge deployment, global CDN

## 📁 Project Structure

```
net-asia/
├── public/
│   ├── favicon.svg          # SVG globe icon
│   ├── manifest.json        # PWA manifest
│   ├── robots.txt           # SEO crawling rules
│   └── _redirects           # Cloudflare Pages SPA rule
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx       # Sticky nav, ⌘K search, favorites badge
│   │   │   ├── Footer.tsx       # Multi-col footer with version number
│   │   │   └── SearchModal.tsx  # History, highlights, favorites, keyboard hints
│   │   ├── tools/
│   │   │   ├── ToolPageLayout.tsx  # Shared wrapper: meta, recent, fav, share
│   │   │   ├── ToolCard.tsx        # Reusable card with heart toggle
│   │   │   └── ResultField.tsx     # Copy-able result display
│   │   └── ui/
│   │       ├── Logo.tsx         # LogoMark + LogoWordmark SVG components
│   │       ├── BackToTop.tsx    # Scroll-triggered back-to-top button
│   │       ├── ScrollProgress.tsx # Gradient progress bar
│   │       ├── Toast.tsx        # Toast notification container
│   │       ├── Breadcrumbs.tsx  # Route breadcrumbs
│   │       └── Skeleton.tsx     # Shimmer loading states
│   ├── services/                # ⭐ API / networking layer (Phase 2A)
│   │   ├── http/
│   │   │   ├── client.ts        # httpClient.get/post/head — the only fetch() caller
│   │   │   ├── request.ts       # Timeout + abort handling primitives
│   │   │   ├── errors.ts        # AppError + normalizeError/errorFromStatus
│   │   │   └── index.ts
│   │   ├── ip/
│   │   │   ├── ip.service.ts    # lookupIP() — owns the ipapi.co endpoint
│   │   │   ├── ip.parser.ts     # Raw ipapi.co shape → IPInfo
│   │   │   └── index.ts
│   │   ├── dns/
│   │   │   ├── dns.service.ts   # lookupDNS() — owns the Google DoH endpoint
│   │   │   ├── dns.parser.ts    # Raw DoH shape → DNSRecord[]
│   │   │   └── index.ts
│   │   ├── whois/
│   │   │   ├── whois.service.ts # lookupWHOIS() — owns the RDAP endpoint
│   │   │   ├── whois.parser.ts  # Raw RDAP shape → { raw, parsed }
│   │   │   └── index.ts
│   │   ├── ssl/
│   │   │   ├── ssl.service.ts   # lookupSSL() — owns the crt.sh endpoint
│   │   │   ├── ssl.parser.ts    # Raw crt.sh entries → SSLCertificate
│   │   │   └── index.ts
│   │   ├── headers/
│   │   │   ├── headers.service.ts # lookupHeaders() — owns the CORS proxy
│   │   │   ├── headers.parser.ts  # Response → HTTPResponse
│   │   │   └── index.ts
│   │   └── index.ts             # Top-level barrel re-exporting everything above
│   ├── hooks/
│   │   ├── useAsyncLookup.ts    # Generic loading/error/stale-request state machine
│   │   ├── useIPLookup.ts       # Wraps services/ip for the IP Lookup page
│   │   ├── useDNSLookup.ts      # Wraps services/dns for the DNS Lookup page
│   │   ├── useWHOISLookup.ts    # Wraps services/whois for the WHOIS page
│   │   ├── useSSLChecker.ts     # Wraps services/ssl for the SSL Checker page
│   │   ├── useHeadersLookup.ts  # Wraps services/headers for the Headers page
│   │   ├── useTheme.tsx         # Dark/light context + toggle
│   │   ├── useToast.ts          # Toast queue management
│   │   ├── useLocalStorage.ts   # Generic localStorage hook
│   │   ├── useFavorites.ts      # Favorited tool IDs
│   │   ├── useRecentTools.ts    # Recently visited tools
│   │   └── usePageMeta.ts       # Dynamic title + meta description
│   ├── lib/
│   │   └── tools-registry.ts    # Tool + category definitions
│   ├── pages/
│   │   ├── Home.tsx             # Landing page (recent, favorites, trending)
│   │   ├── Tools.tsx            # Directory with search + filter
│   │   ├── Categories.tsx       # Category listing
│   │   ├── Category.tsx         # Category detail
│   │   ├── About.tsx            # Mission, values, tech stack
│   │   ├── Contact.tsx          # Contact form
│   │   ├── Roadmap.tsx          # Phased roadmap timeline
│   │   ├── Favorites.tsx        # Saved tools page
│   │   ├── Changelog.tsx        # In-app version history
│   │   ├── ComingSoon.tsx       # Placeholder for future tools
│   │   ├── NotFound.tsx         # 404 with quick links
│   │   └── tools/
│   │       ├── IPLookup.tsx     # Uses useIPLookup() only — no fetch logic
│   │       ├── DNSLookup.tsx    # Uses useDNSLookup() only
│   │       ├── WHOISLookup.tsx  # Uses useWHOISLookup() only
│   │       ├── SSLChecker.tsx   # Uses useSSLChecker() only
│   │       └── HTTPHeaders.tsx  # Uses useHeadersLookup() only
│   ├── styles/globals.css       # CSS variables + component classes
│   ├── types/index.ts           # TypeScript interfaces
│   ├── App.tsx                  # Router + page transitions + global UI
│   └── main.tsx                 # Entry point
├── CHANGELOG.md
├── ROADMAP.md
└── README.md
```

## 🏗 API Architecture (Phase 2A)

Every tool follows the same one-directional data flow:

```
Tool Page  →  Custom Hook  →  Service  →  Parser  →  Normalized Model  →  UI Components
```

- **Tool Page** (`src/pages/tools/*.tsx`) — owns only form state and JSX. It calls a hook
  and renders `{ result, loading, error }`. It never imports `fetch`, never knows an
  endpoint URL, and never touches a raw API response shape.
- **Custom Hook** (`src/hooks/use*Lookup.ts`) — thin wrapper around `useAsyncLookup`
  (the shared loading/error/stale-request state machine) plus one service call.
- **Service** (`src/services/<tool>/<tool>.service.ts`) — the only place that knows the
  external endpoint URL. Calls `httpClient`, handles provider-specific error shapes
  (e.g. ipapi.co's `{ error: true, reason }`), and returns parsed, normalized data.
- **Parser** (`src/services/<tool>/<tool>.parser.ts`) — the only place that knows the raw
  third-party response shape (field names, nested arrays, vCard quirks, etc.). Converts
  raw data into the app's stable `types/index.ts` models.
- **HTTP Client** (`src/services/http/`) — `httpClient.get/post/head` wraps every
  `fetch()` call with a 12s timeout, abort handling, and normalized `AppError`s
  (`NETWORK_ERROR`, `TIMEOUT`, `NOT_FOUND`, `RATE_LIMITED`, `INVALID_RESPONSE`,
  `INVALID_INPUT`). This is the **only** file that would need to change to move from
  free public APIs to Cloudflare Workers or a custom backend — every service already
  calls `httpClient`, never `fetch` directly.

**Why this matters:** if `ipapi.co` changes its response shape, only `ip.parser.ts`
changes. If we replace it with a Cloudflare Worker, only `ip.service.ts`'s `BASE_URL`
changes. The page and hook are untouched in both cases.

## ⚡ Quick Start


```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

## ☁️ Deploy to Cloudflare Pages

### Option A: Git integration (recommended)

1. Push to GitHub / GitLab
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect Git
3. Set build command: `npm run build`
4. Set build output directory: `dist`
5. Save & Deploy — auto-deploys on every push to `main`

### Option B: Wrangler CLI

```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist --project-name=net-asia
```

The `public/_redirects` file ensures React Router works correctly:
```
/* /index.html 200
```

## 🌍 Environment Variables

Everything runs client-side — no environment variables required out of the box.

For future Cloudflare Workers integration:
```bash
# .env.local (never commit)
VITE_WORKERS_API=https://api.netasia.workers.dev
```

Access via `import.meta.env.VITE_WORKERS_API`.

## 🔧 Adding a New Tool

1. **Register** in `src/lib/tools-registry.ts`
2. **Create a service module** in `src/services/<tool>/`:
   - `<tool>.parser.ts` — define the raw provider response interface and a
     `parse<Tool>Response()` function that converts it into a model from `types/index.ts`
   - `<tool>.service.ts` — define `lookup<Tool>()`, call `httpClient.get/post/head`,
     throw `AppError` for provider-specific failures, return the parsed model
   - `index.ts` — barrel export both
3. **Create a hook** in `src/hooks/use<Tool>.ts` wrapping `useAsyncLookup(lookup<Tool>)`
4. **Build the page** in `src/pages/tools/MyTool.tsx`:
   - Call your hook for `{ result, loading, error, lookup }`
   - Use `<ToolPageLayout toolId="my-tool" ...>` — never call `fetch` or parse responses here
5. **Add route** in `src/App.tsx`
6. **Remove** the placeholder route for that tool

The tool automatically appears in: search modal, Tools directory, category pages, favorites, recent tools.

See `src/services/ip/` for the simplest reference implementation, or
`src/services/whois/` for one handling a more complex nested response shape.

## 🔮 Migrate to Cloudflare Workers (Future)

Thanks to the Phase 2A service architecture, this migration touches **only**
`src/services/<tool>/<tool>.service.ts` files — no hooks, pages, or components change.

```
workers/
  src/
    routes/
      ip.ts
      dns.ts
      whois.ts
      ssl.ts
      headers.ts
  wrangler.toml
```

For each service:
1. Move the provider request logic from `<tool>.service.ts` into a Worker route
2. Change `BASE_URL` in `<tool>.service.ts` to `https://api.netasia.workers.dev/<tool>`
3. Keep the parser (`<tool>.parser.ts`) as-is, or move parsing into the Worker if preferred

Deploy with `wrangler deploy`. Optionally set `VITE_WORKERS_API` (see Environment
Variables above) so `BASE_URL` can be swapped per-environment without code changes.

## 📊 Lighthouse Targets

| Metric | Target |
|--------|--------|
| Performance | 95+ |
| Accessibility | 95+ |
| Best Practices | 100 |
| SEO | 95+ |
| FCP | < 1.5s |
| TBT | < 200ms |

## 📜 License

MIT — free for personal and commercial use.
