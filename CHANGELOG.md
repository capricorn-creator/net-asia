# Changelog

All notable changes to NetAsia are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [2.0.0-arch] — Phase 2A — API Architecture Refactor

Pure internal refactor — **no UI, routing, styling, or user-facing behavior
changes**. Every existing tool produces identical results through a new,
scalable service layer.

### Added — Service Layer (`src/services/`)
- `services/http/client.ts` — `httpClient.get/post/head/getRaw`, the single
  entry point for all network calls. Every service calls this; no service
  or page calls `fetch()` directly anymore.
- `services/http/request.ts` — low-level request helper with a 12s timeout,
  `AbortController` composition with caller-supplied signals, and JSON
  parsing with malformed-response detection.
- `services/http/errors.ts` — `AppError` class with a closed set of error
  codes (`NETWORK_ERROR`, `TIMEOUT`, `NOT_FOUND`, `RATE_LIMITED`,
  `INVALID_RESPONSE`, `INVALID_INPUT`, `UNKNOWN`), plus `errorFromStatus()`
  and `normalizeError()` to convert any thrown value into a friendly,
  typed error.
- `services/ip/` — `ip.service.ts` (`lookupIP`) + `ip.parser.ts`
  (raw ipapi.co shape → `IPInfo`)
- `services/dns/` — `dns.service.ts` (`lookupDNS`, `DNS_RECORD_TYPES`) +
  `dns.parser.ts` (raw Google DoH shape → `DNSRecord[]`)
- `services/whois/` — `whois.service.ts` (`lookupWHOIS`) + `whois.parser.ts`
  (raw RDAP shape, including vCard array parsing, → `{ raw, parsed }`)
- `services/ssl/` — `ssl.service.ts` (`lookupSSL`) + `ssl.parser.ts`
  (raw crt.sh certificate transparency entries → `SSLCertificate`, with
  `daysRemaining`/`isValid` computed at parse time)
- `services/headers/` — `headers.service.ts` (`lookupHeaders`) +
  `headers.parser.ts` (proxy response → `HTTPResponse`, including the
  opaque-response CORS fallback path)
- Every service folder has an `index.ts` barrel; a top-level
  `services/index.ts` re-exports all of them.

### Added — Hooks Layer
- `hooks/useAsyncLookup.ts` — generic `{ data, loading, error, run, reset }`
  state machine shared by every tool hook. Includes stale-request
  protection: if a user fires a second lookup before the first resolves,
  the first response is discarded instead of overwriting the newer one.
- `hooks/useIPLookup.ts`, `useDNSLookup.ts`, `useWHOISLookup.ts`,
  `useSSLChecker.ts`, `useHeadersLookup.ts` — one thin hook per tool,
  each wrapping `useAsyncLookup` with its corresponding service function.

### Changed — Tool Pages Migrated to New Architecture
- `pages/tools/IPLookup.tsx` — now calls `useIPLookup()`; removed local
  `loading`/`result`/`error` state and inline `lookupIP` import.
- `pages/tools/DNSLookup.tsx` — now calls `useDNSLookup()`; preserved the
  original "no records found" empty-state message via a derived check
  rather than mutating hook internals.
- `pages/tools/WHOISLookup.tsx` — now calls `useWHOISLookup()`; removed
  the duplicated local `WHOISResult` interface in favor of the one
  exported by `services/whois`.
- `pages/tools/SSLChecker.tsx` — now calls `useSSLChecker()`.
- `pages/tools/HTTPHeaders.tsx` — now calls `useHeadersLookup()`.
- All five pages are unchanged visually and behaviorally — same inputs,
  same loading skeletons, same error cards, same result layouts.

### Removed
- `lib/api.ts` — fully decomposed into the five service modules above.
  No remaining references anywhere in the codebase (verified via
  project-wide search before deletion).

### Architecture Decisions
- **One-directional data flow enforced**: Tool Page → Hook → Service →
  Parser → normalized model → UI. Pages never import `fetch`, never see
  a raw third-party response shape, and never construct an endpoint URL.
- **Parsers own raw shapes; services own endpoints**: if a provider
  changes its response format, only the parser changes. If we swap
  providers (e.g. move to a Cloudflare Worker), only the service's
  `BASE_URL` changes.
- **WHOIS shape preserved intentionally**: `WHOISResult` keeps the
  existing `{ raw, parsed: Record<string,string> }` shape with
  human-readable display-label keys (e.g. `parsed['Domain Name']`)
  rather than introducing new field names, since the page's JSX reads
  those labels directly. This avoided unnecessary UI changes per the
  phase constraints.
- **No new dependencies**: the entire layer uses native `fetch`,
  `AbortController`, and TypeScript — no axios, no React Query.
- **Strict typing throughout**: zero use of `any`. Raw provider response
  interfaces (e.g. `IpApiCoResponse`, `GoogleDoHResponse`, `RdapResponse`,
  `CrtShEntry`) are private to their parser file and never leak into
  hooks or pages.

### Verified
- Production build (`npm run build`) succeeds with zero TypeScript errors.
- `npx oxlint` reports zero errors (one pre-existing, unrelated warning
  in `useTheme.tsx` from Phase 1.5).
- Dev server boots and serves all routes without runtime errors.
- Bundle size essentially unchanged (348 modules vs. 325 pre-refactor;
  total gzipped JS within ~1% of the previous build).

---

## [1.5.0] — July 2025 · Phase 1.5 — Product Polish

### Branding
- New SVG globe logo mark replacing simple "N" text block
- `LogoWordmark` React component for consistent logo usage
- Gradient favicon.svg with globe icon (blue → cyan → purple)
- PWA `manifest.json` for add-to-homescreen support
- Full Open Graph + Twitter Card meta tags in `index.html`
- JSON-LD `WebSite` structured data with `SearchAction`
- `robots.txt` allowing all crawlers, linking sitemap

### Navigation
- Framer Motion `layoutId` spring animation for active nav item
- Favorites count badge in navbar with red dot counter
- Improved mobile menu with per-item stagger entrance animations
- Body scroll lock (`overflow: hidden`) when mobile menu open
- Better keyboard `aria-label` attributes throughout
- Separate close (×) / open (≡) icons in mobile toggle

### Search (⌘K Modal)
- Search history stored in `localStorage` via `useLocalStorage` hook
- Clear search history button
- Highlighted keyword matches in result names and descriptions (regex highlight)
- Favorites shown in empty search state for quick access
- Popular searches chip group
- Keyboard navigation hint bar at modal footer (↑↓ navigate, ↵ open)
- Improved no-results empty state with emoji and helpful text
- Result count shown in footer

### Homepage
- Dot-grid background overlay in hero section
- Animated pulsing live status badge (using CSS ping animation)
- "Recently Used" section — appears when user has used ≥1 tool
- "Your Favorites" section — appears when user has ≥1 favorite
- "Trending" section with horizontal tool cards
- Per-stat accent color gradient in stats section
- Category icon scales on hover via CSS group-hover
- Smoother stagger reveal animations (spring easing everywhere)
- Glow orbs use consistent `GlowOrb` helper component

### New Pages
- `/favorites` — Favorites management page with clear-all
- `/changelog` — In-app changelog with timeline UI

### New Global UI
- `BackToTop` button — appears after 400px scroll with spring animation
- `ScrollProgress` — gradient progress bar fixed at top of viewport
- `ToolCard` — extracted reusable card with favorite heart on hover, `size` prop

### Design System (`globals.css`)
- Expanded tokens: `--bg-elevated`, `--border-subtle`, `--border-strong`
- Shimmer skeleton animation replacing static pulse
- `.card-hover` and `.card-interactive` utility classes
- `.btn-ghost` and `.btn-danger` button variants
- `.gradient-text-blue` and `.gradient-text-purple` utilities
- Improved `:focus-visible` ring for keyboard navigation accessibility
- `background-color` and `color` CSS transitions on `body` for smooth theme switch
- `::selection` highlight styled to brand blue

### ToolPageLayout
- `toolId` prop — auto-tracks the tool as "recently used" on mount
- `FavoriteButton` embedded in header — save from within the tool page
- `ShareButton` — Web Share API with clipboard fallback
- `usePageMeta` hook sets `document.title` and meta description per page
- Tool badges (New / Popular) shown in header
- Icon entrance animation (scale + fade)

### Hooks
- `useLocalStorage<T>` — generic localStorage hook with error safety
- `useFavorites` — toggle/isFavorite using localStorage
- `useRecentTools` — addRecent with max-6 deduped list
- `usePageMeta` — sets title and meta description, restores on unmount

### Pages Updated
- **About** — values section, tech stack cards with colors, improved CTA
- **NotFound** — gradient 404 digits, quick tool links grid, go-back button
- **ComingSoon** — pulse ring animation, feature preview grid, save-to-favorites
- **Tools** — uses new `ToolCard` component, clear-filter button, live-only pulse dot
- **All tool pages** — receive `toolId`, show Favorite + Share buttons

### Performance
- Page transitions via `AnimatePresence` (opacity + y-axis, 220ms)
- Framer Motion `layout` animation for nav active state (no positional jank)
- All new hooks memoized with `useCallback`
- `Suspense` fallback upgraded with branded spinner + bounce dots

### SEO
- `usePageMeta` gives every page a unique `<title>` and `<meta description>`
- `robots.txt` added to `/public`
- `manifest.json` added for PWA metadata

### Footer
- Version number (`v1.5.0`) in bottom bar
- Changelog and Favorites links added
- GitHub placeholder link
- Animated live status pulsing dot
- Column headers with `uppercase tracking-widest` style

---

## [1.0.0] — June 2025 · Phase 1 — Foundation

### Added
- React 19 + TypeScript + Vite 6 project bootstrapped
- Tailwind CSS 3 with custom design tokens (dark/light CSS variables)
- Framer Motion animations throughout
- React Router 6 with lazy loading + Suspense
- Cloudflare Pages deployment (`public/_redirects` SPA rule)
- Dark mode default, light mode toggle (localStorage persisted)
- Global ⌘K search modal with keyboard navigation
- Glassmorphism navbar with scroll-aware backdrop
- Toast notification system with 4 types (success/error/info/warning)
- Breadcrumb navigation component
- Skeleton loading states

### Live Tools (5)
- **IP Lookup** — ipapi.co, geolocation + ISP + ASN + timezone
- **DNS Lookup** — Google DNS-over-HTTPS, all record types grouped by type, TTL shown
- **WHOIS Lookup** — RDAP protocol, parsed + raw view toggle, expiry date alerts
- **SSL Certificate Checker** — crt.sh API, animated validity meter, SANs list
- **HTTP Headers Checker** — security header scoring with missing-header highlights

### Pages (10)
- Homepage with hero, stats, popular tools, categories, why-section, CTA
- Tools directory with search + category filter
- Categories listing and category detail
- About, Contact, Roadmap, NotFound, ComingSoon

### Infrastructure
- `src/lib/tools-registry.ts` — central tool/category registry
- `src/lib/api.ts` — all external API calls isolated
- `src/types/index.ts` — TypeScript interfaces
- `ROADMAP.md` — 40+ planned tools across 4 phases
- `README.md` — full deployment guide

---

## [2.1.0] — Phase 2B — Core Internet Tools

Five new live tools following the Phase 2A service/parser/hook architecture exactly.

### New Tools (5)

**Website Technology Detector** (`/tools/website-tech`)
- Detects CMS, frameworks, JS libraries, analytics, CDN, hosting, server, language, security, e-commerce, database tech
- Uses Wappalyzer public lookup API (no key required)
- Results grouped by category with confidence scores and version numbers
- Architecture: `services/tech/` (tech.service.ts + tech.parser.ts) + `useTechDetector` hook

**GeoIP Lookup** (`/tools/geoip-lookup`)
- Detailed geolocation: continent, country (with emoji flag), region, city, ZIP, timezone, coordinates
- Network info: ISP, organization, ASN
- Proxy/VPN detection + mobile detection badges
- Google Maps and OpenStreetMap deep links
- IPv4/IPv6 type detection, "My IP" quick lookup
- Architecture: `services/geoip/` (ip-api.com free tier) + `useGeoIPLookup` hook

**Reverse DNS Lookup** (`/tools/reverse-dns`)
- PTR record lookup for any IPv4 or IPv6 address via Google DNS-over-HTTPS
- Full IPv6 expansion + nibble-reversal for `.ip6.arpa` queries
- Graceful "no PTR record" state with educational explanation
- Shows TTL when available
- Architecture: `services/rdns/` (rdns.service.ts + rdns.parser.ts) + `useReverseDNS` hook

**DNS Propagation Checker** (`/tools/dns-propagation`)
- Queries 8 public DoH resolvers in parallel: Google, Cloudflare, Quad9, OpenDNS, Comodo, Yandex, AdGuard, Neustar
- Animated propagation percentage bar with color coding (green/yellow/red)
- Per-resolver status: propagated, NXDOMAIN, timeout, error
- Animated live pulse dot for propagated results
- Supports A, AAAA, MX, TXT, NS, CNAME record types
- Architecture: `services/propagation/` + `useDNSPropagation` hook

**URL Redirect Checker** (`/tools/redirect-checker`)
- Traces complete redirect chain via CORS proxy with HEAD requests
- Step-by-step visual chain with status badges and arrow connectors
- Detects HTTP→HTTPS upgrade automatically
- Shows redirect count, total step count, and total response time
- Animated step-by-step reveal with stagger delay
- Architecture: `services/redirect/` + `useRedirectChecker` hook

### New Types
- `TechCategory`, `DetectedTech`, `TechDetectionResult` — website tech detection models
- `GeoIPResult` — enhanced geolocation (superset of IPInfo with flag, type, proxy detection)
- `ReverseDNSResult` — PTR lookup result with status enum
- `PropagationResult`, `DNSPropagationResult` — multi-resolver propagation results
- `RedirectStep`, `RedirectResult` — redirect chain tracing models

### New Service Modules (5)
- `services/tech/` — Wappalyzer API
- `services/geoip/` — ip-api.com
- `services/rdns/` — Google DoH PTR
- `services/propagation/` — 8× parallel DoH resolvers
- `services/redirect/` — CORS proxy redirect tracing

### New Hooks (5)
- `useTechDetector`, `useGeoIPLookup`, `useReverseDNS`, `useDNSPropagation`, `useRedirectChecker`
- All wrap `useAsyncLookup` — inherit stale-request protection, consistent error handling

### Registry Updates
- 5 new tools promoted from `comingSoon: true` to fully live
- GeoIP Lookup marked `isPopular: true` — appears in homepage popular section
- All 5 new tools carry `isNew: true` badge

### Build Metrics
- Total modules: 373 (up from 348)
- New lazy-loaded chunks: 5 (one per tool page)
- All new tool chunks: 7–10 kB gzipped — no bundle bloat
- TypeScript errors: 0
- Lint errors: 0
