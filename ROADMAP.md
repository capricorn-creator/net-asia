# NetAsia Roadmap

## ✅ Phase 1 — Foundation (v1.0.0 · June 2025)

| Tool | Status | Category |
|------|--------|----------|
| IP Lookup | ✅ Live | Network |
| DNS Lookup | ✅ Live | DNS |
| WHOIS Lookup | ✅ Live | Domain |
| SSL Certificate Checker | ✅ Live | SSL |
| HTTP Headers Checker | ✅ Live | Website |

---

## ✅ Phase 1.5 — Product Polish (v1.5.0 · July 2025)

No new tools — focused on UX, branding, and performance.

**Highlights:** SVG logo, search history, favorites system, recently used, page transitions, BackToTop, ScrollProgress, dynamic meta, PWA manifest, CHANGELOG.md.

---

## ✅ Phase 2A — API Architecture Refactor (v2.0.0-arch)

No new tools, no UI changes — internal-only refactor of the networking layer.

**Highlights:** scalable `services/<tool>/{service,parser}.ts` pattern for every tool,
shared `httpClient` with timeout + normalized `AppError` handling, generic
`useAsyncLookup` hook with stale-request protection, dedicated hook per tool
(`useIPLookup`, `useDNSLookup`, `useWHOISLookup`, `useSSLChecker`, `useHeadersLookup`),
`lib/api.ts` fully decomposed and removed. Lays the foundation so every Phase 2B+
tool follows the same Tool Page → Hook → Service → Parser flow from day one.

---

## ✅ Phase 2B — Core Internet Tools (v2.1.0)

5 new live tools. All follow the Phase 2A service/parser/hook architecture.

| Tool | Status | API |
|------|--------|-----|
| Website Tech Detector | ✅ Live | Wappalyzer free lookup |
| GeoIP Lookup | ✅ Live | ip-api.com (free) |
| Reverse DNS Lookup | ✅ Live | Google DoH PTR |
| DNS Propagation Checker | ✅ Live | 8× parallel DoH resolvers |
| URL Redirect Checker | ✅ Live | CORS proxy + fetch |

---

## ⬜ Phase 2C — Developer Utilities (Planned)

| Tool | Category | Description |
|------|----------|-------------|
| Password Generator | Security | Strong passwords with entropy meter |
| Hash Generator | Developer | MD5, SHA-1, SHA-256, SHA-512 |
| UUID Generator | Developer | v1, v4, v5 UUIDs in bulk |
| Base64 Encode/Decode | Encoding | Text and file encoding |
| URL Encode/Decode | Encoding | Percent-encoding for URLs |
| JSON Formatter | Developer | Beautify, minify, validate, query JSON |

Each tool follows the Phase 2A architecture: `services/<tool>/` with
`service.ts` + `parser.ts`, a `use<Tool>()` hook, and a page with zero fetch logic.

---

## ⬜ Phase 3 — Web Intelligence (Planned · Q4 2025)

| Tool | Category | Description |
|------|----------|-------------|
| Website Technology Detector | Website | CMS, frameworks, analytics, hosting |
| QR Code Generator | Utilities | Custom QR with logo support |
| Timestamp Converter | Utilities | Unix ↔ human-readable dates |
| Robots.txt Viewer | Website | Fetch and parse robots.txt |
| Sitemap Viewer | Website | Parse and explore XML sitemaps |
| HTTP Status Explorer | Website | Reference for all HTTP status codes |
| DNS Propagation Checker | DNS | Check DNS across global nameservers |

---

## ⬜ Phase 4 — Advanced Network Tools (Planned · 2026)

| Tool | Category | Description |
|------|----------|-------------|
| Port Scanner | Network | Common open ports on any host |
| Online Ping | Network | Ping from multiple global locations |
| Reverse DNS Lookup | Network | PTR record lookup |
| CIDR Calculator | Network | Subnet and CIDR calculations |
| CSR Decoder | SSL | Parse certificate signing requests |
| HTTP/2 Checker | Website | HTTP/2 and HTTP/3 support |
| Mixed Content Checker | Security | Find insecure resources on HTTPS pages |
| Email Header Analyzer | Utilities | Parse and analyze email headers |
| DKIM Checker | DNS | Verify DKIM records |
| SPF Checker | DNS | Validate SPF configuration |
| DMARC Checker | DNS | Check DMARC policy |
| ASN Lookup | Network | ASN → organization mapping |
| JWT Decoder | Developer | Decode and verify JWT tokens |
| Regex Tester | Developer | Live regex testing with highlights |
| CSV to JSON | Developer | Convert between data formats |
| Cron Parser | Developer | Parse and explain cron expressions |
| Color Converter | Developer | HEX, RGB, HSL, HSV |
| HTML Entity Encoder | Encoding | Encode/decode HTML entities |

---

## 📊 Milestones

| Phase | Tools | Version | Status |
|-------|-------|---------|--------|
| 1 — Foundation | 5 | 1.0.0 | ✅ Done |
| 1.5 — Polish | 0 new | 1.5.0 | ✅ Done |
| 2A — Architecture | 0 new | 2.0.0-arch | ✅ Done |
| 2B — Core Internet | +5 | 2.1.0 | ✅ Done |
| 2C — Developer Utils | +6 | 2.2.0 | 🔵 Planned |
| 3 — Web Intelligence | +7 | 3.0.0 | ⬜ Planned |
| 4 — Advanced | +18 | 4.0.0 | ⬜ Planned |
| Vision | 100+ | — | 🔮 Future |

---

Have a tool suggestion? [Contact us](/contact) or check the [Changelog](/changelog).
