# Changelog

All notable changes to NetAsia are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).

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
