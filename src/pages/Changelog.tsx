import { motion } from 'framer-motion';
import { usePageMeta } from '../hooks/usePageMeta';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const CHANGELOG = [
  {
    version: '1.5.0',
    date: 'July 2025',
    label: 'Phase 1.5 — Product Polish',
    type: 'major',
    changes: [
      { cat: 'Branding', items: ['New SVG globe logo mark replacing text-only N', 'Consistent LogoWordmark component used everywhere', 'Gradient favicon with globe icon', 'PWA manifest.json for installability', 'Full Open Graph and Twitter Card meta tags', 'JSON-LD structured data for SEO'] },
      { cat: 'Navigation', items: ['Animated active route indicator (spring layout animation)', 'Favorites count badge in navbar', 'Improved mobile menu with staggered item animations', 'Body scroll lock when mobile menu is open', 'Better keyboard accessibility and ARIA labels'] },
      { cat: 'Search', items: ['Search history stored in localStorage with clear option', 'Highlighted keyword matches in result names and descriptions', 'Favorites shown in empty search state', 'Popular searches quick-chips', 'Keyboard navigation hints in footer', 'Improved no-results empty state with emoji'] },
      { cat: 'Homepage', items: ['Grid dot background overlay in hero section', 'Live pulsing status badge', 'Recently Used section (localStorage-powered)', 'Favorites section on homepage', 'Trending Tools section', 'Improved stat cards with per-stat accent colors', 'Category icons scale on hover', 'Smoother staggered reveal animations'] },
      { cat: 'New Pages', items: ['Favorites page at /favorites with clear-all action', 'Changelog page at /changelog', 'BackToTop button (appears after 400px scroll)', 'Scroll progress indicator at page top'] },
      { cat: 'ToolCard', items: ['Reusable ToolCard component extracted from Home and Tools pages', 'Heart/favorite toggle appears on hover', 'Animated entrance with stagger delay', 'Size prop (sm/md) for compact grids'] },
      { cat: 'Design System', items: ['Expanded CSS design tokens (bg-elevated, border-strong, border-subtle)', 'Shimmer skeleton animation replacing static pulse', 'card-hover and card-interactive utility classes', 'btn-ghost and btn-danger button variants', 'gradient-text-blue and gradient-text-purple utilities', 'Improved focus-visible ring for keyboard nav', 'Theme transition on background and color properties'] },
      { cat: 'Performance', items: ['AnimatePresence page transitions (opacity + y-axis)', 'Framer Motion layout animations for nav active state', 'useLocalStorage hook with error safety', 'usePageMeta hook for dynamic title/description per route', 'Vite code splitting preserved and extended'] },
      { cat: 'SEO & PWA', items: ['Dynamic document.title per page via usePageMeta', 'robots.txt created', 'manifest.json created', 'apple-mobile-web-app-capable meta tags', 'Canonical URL meta tag', 'Structured data (WebSite schema with SearchAction)'] },
      { cat: 'Footer', items: ['Version number display (v1.5.0)', 'Changelog link', 'Favorites link', 'GitHub placeholder link', 'Animated live status indicator', 'Column headers with uppercase tracking style'] },
    ],
  },
  {
    version: '1.0.0',
    date: 'June 2025',
    label: 'Phase 1 — Foundation',
    type: 'release',
    changes: [
      { cat: 'Architecture', items: ['React 19 + TypeScript + Vite 6 project setup', 'Tailwind CSS 3 with custom design tokens', 'Framer Motion for animations', 'React Router 6 with lazy loading and code splitting', 'Cloudflare Pages deployment with _redirects SPA rule'] },
      { cat: 'Tools', items: ['IP Lookup via ipapi.co — geolocation, ISP, ASN, timezone', 'DNS Lookup via Google DNS-over-HTTPS — all record types grouped', 'WHOIS Lookup via RDAP — parsed + raw view with expiry alerts', 'SSL Certificate Checker via crt.sh — validity meter, SANs', 'HTTP Headers Checker — security header scoring, status badge'] },
      { cat: 'UI', items: ['Dark mode by default with light mode toggle (localStorage persisted)', 'Global ⌘K search modal', 'Glassmorphism navbar with scroll-aware background', 'Responsive mobile navigation', 'Toast notification system', 'Breadcrumb navigation', 'Shimmer skeleton loading states', 'Copy-to-clipboard on all result fields'] },
      { cat: 'Pages', items: ['Homepage with hero, stats, popular tools, categories, why section, CTA', 'Tools directory with search and category filter', 'Categories listing and category detail pages', 'About, Contact, Roadmap, NotFound, ComingSoon pages', '16 placeholder routes for planned tools'] },
      { cat: 'Content', items: ['20 tools registered in registry (5 live, 15 coming soon)', '9 tool categories', 'ROADMAP.md with 40+ planned tools across 4 phases', 'README.md with full deployment guide'] },
    ],
  },
];

const TYPE_STYLES = {
  major:   { bg: 'rgba(59,130,246,0.1)',  color: '#60A5FA',  border: 'rgba(59,130,246,0.25)',  label: 'Major Release' },
  release: { bg: 'rgba(34,197,94,0.1)',   color: '#4ADE80',  border: 'rgba(34,197,94,0.25)',   label: 'Release' },
  patch:   { bg: 'rgba(249,115,22,0.1)',  color: '#FB923C',  border: 'rgba(249,115,22,0.25)',  label: 'Patch' },
};

const CAT_COLORS: Record<string, string> = {
  'Branding': '#A78BFA', 'Navigation': '#60A5FA', 'Search': '#22D3EE',
  'Homepage': '#4ADE80', 'New Pages': '#FB923C', 'ToolCard': '#F472B6',
  'Design System': '#FBBF24', 'Performance': '#60A5FA', 'SEO & PWA': '#4ADE80',
  'Footer': '#94A3B8', 'Architecture': '#A78BFA', 'Tools': '#22D3EE',
  'UI': '#60A5FA', 'Pages': '#4ADE80', 'Content': '#FBBF24',
};

export default function ChangelogPage() {
  usePageMeta({ title: 'Changelog', description: 'NetAsia version history and release notes.' });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'Changelog' }]} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-label">📋 Changelog</div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>What's new</h1>
          <p className="mb-12" style={{ color: 'var(--text-secondary)' }}>
            Every improvement, fix, and feature addition to NetAsia, newest first.
          </p>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-8 bottom-8 w-px" style={{ background: 'var(--border)' }} />

            <div className="space-y-12">
              {CHANGELOG.map((entry, ei) => {
                const ts = TYPE_STYLES[entry.type as keyof typeof TYPE_STYLES];
                return (
                  <motion.div
                    key={entry.version}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ei * 0.1, duration: 0.4 }}
                    className="relative pl-12"
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute left-0 top-1.5 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: ts.bg, border: `2px solid ${ts.border}`, color: ts.color }}
                    >
                      {entry.version.split('.')[0]}
                    </div>

                    {/* Header */}
                    <div className="flex items-start gap-3 mb-6 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <span className="text-xl font-black mono" style={{ color: 'var(--text-primary)' }}>
                            v{entry.version}
                          </span>
                          <span className="badge text-xs" style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}>
                            {ts.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{entry.label}</span>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {entry.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Change groups */}
                    <div className="space-y-5">
                      {entry.changes.map((group) => {
                        const catColor = CAT_COLORS[group.cat] || '#60A5FA';
                        return (
                          <div key={group.cat} className="card p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-1.5 h-4 rounded-full" style={{ background: catColor }} />
                              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{group.cat}</h3>
                              <span className="text-xs ml-auto px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                                {group.items.length} changes
                              </span>
                            </div>
                            <ul className="space-y-2">
                              {group.items.map((item, ii) => (
                                <li key={ii} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                  <svg className="mt-0.5 flex-shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={catColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
