# NetAsia — Internet Intelligence Platform

**v1.5.0** · Phase 1.5 · 5 live tools · 100+ planned

A premium SaaS-style network intelligence platform built for developers, sysadmins, and security professionals. Zero backend, zero signup, zero cost.

## 🚀 Live Tools

| Tool | API | Description |
|------|-----|-------------|
| **IP Lookup** | ipapi.co | Geolocation, ISP, ASN, timezone for any IP |
| **DNS Lookup** | Google DoH | All record types (A, AAAA, MX, TXT, NS, SOA, CAA, CNAME) |
| **WHOIS Lookup** | RDAP / rdap.org | Domain registration, expiry, nameservers |
| **SSL Certificate Checker** | crt.sh | Validity, expiry, issuer, SANs |
| **HTTP Headers Checker** | corsproxy.io | Response headers with security scoring |

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
│   ├── hooks/
│   │   ├── useTheme.tsx         # Dark/light context + toggle
│   │   ├── useToast.ts          # Toast queue management
│   │   ├── useLocalStorage.ts   # Generic localStorage hook
│   │   ├── useFavorites.ts      # Favorited tool IDs
│   │   ├── useRecentTools.ts    # Recently visited tools
│   │   └── usePageMeta.ts       # Dynamic title + meta description
│   ├── lib/
│   │   ├── api.ts               # All external API calls (one file)
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
│   │       ├── IPLookup.tsx
│   │       ├── DNSLookup.tsx
│   │       ├── WHOISLookup.tsx
│   │       ├── SSLChecker.tsx
│   │       └── HTTPHeaders.tsx
│   ├── styles/globals.css       # CSS variables + component classes
│   ├── types/index.ts           # TypeScript interfaces
│   ├── App.tsx                  # Router + page transitions + global UI
│   └── main.tsx                 # Entry point
├── CHANGELOG.md
├── ROADMAP.md
└── README.md
```

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
2. **Add API function** in `src/lib/api.ts`
3. **Build page** in `src/pages/tools/MyTool.tsx` using `<ToolPageLayout toolId="my-tool" ...>`
4. **Add route** in `src/App.tsx`
5. **Remove** the placeholder route for that tool

The tool automatically appears in: search modal, Tools directory, category pages, favorites, recent tools.

## 🔮 Migrate to Cloudflare Workers (Future)

```
workers/
  src/
    routes/
      ip.ts
      dns.ts
      whois.ts
  wrangler.toml
```

Move API calls from `src/lib/api.ts` → Workers.
Update base URL to `https://api.netasia.workers.dev`.
Deploy with `wrangler deploy`.

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
