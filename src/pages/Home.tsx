import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES, getPopularTools, TOOLS, getToolById } from '../lib/tools-registry';
import { useRecentTools } from '../hooks/useRecentTools';
import { useFavorites } from '../hooks/useFavorites';
import { usePageMeta } from '../hooks/usePageMeta';
import ToolCard from '../components/tools/ToolCard';

const STATS = [
  { value: '10', label: 'Free Tools', icon: '🧰', color: '#60A5FA' },
  { value: '100%', label: 'Client-Side', icon: '⚡', color: '#FBBF24' },
  { value: '0', label: 'Account Required', icon: '🚀', color: '#4ADE80' },
  { value: 'Free', label: 'Always', icon: '💎', color: '#A78BFA' },
];

const WHY_ITEMS = [
  {
    icon: '⚡',
    title: 'Instant Results',
    description: 'Tools run directly in your browser with no server roundtrips. Most queries return in under a second.',
    color: '#FBBF24',
  },
  {
    icon: '🔒',
    title: 'Private by Design',
    description: 'Your queries never leave your browser. No analytics on lookups, no query logs, no data collection.',
    color: '#4ADE80',
  },
  {
    icon: '🌐',
    title: 'Globally Reliable',
    description: "Served from Cloudflare's global edge network. Fast load times from anywhere in the world.",
    color: '#60A5FA',
  },
  {
    icon: '🧰',
    title: 'Growing Toolkit',
    description: 'Ten tools today — network, DNS, domain, SSL, and website analysis. New utilities added regularly.',
    color: '#A78BFA',
  },
  {
    icon: '📱',
    title: 'Works Everywhere',
    description: 'Fully responsive across phones, tablets, and desktops. Dark and light themes supported.',
    color: '#22D3EE',
  },
  {
    icon: '🆓',
    title: 'No Cost, No Catch',
    description: 'No accounts, no API keys, no rate limits, no paywalls. Open to everyone.',
    color: '#F472B6',
  },
];

function GlowOrb({ color, style }: { color: string; style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        background: `radial-gradient(ellipse, ${color} 0%, transparent 70%)`,
        filter: 'blur(70px)',
        opacity: 0.18,
        ...style,
      }}
    />
  );
}

function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card p-6 flex flex-col items-center text-center gap-2"
    >
      <div className="text-3xl mb-1">{stat.icon}</div>
      <div className="text-3xl font-black tracking-tight" style={{
        background: `linear-gradient(135deg, ${stat.color}, white)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>
        {stat.value}
      </div>
      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
    </motion.div>
  );
}

// Live categories that have at least one tool
const LIVE_CATEGORY_IDS = [...new Set(TOOLS.map(t => t.category))];
const liveCategories = CATEGORIES.filter(c => LIVE_CATEGORY_IDS.includes(c.id));

export default function HomePage() {
  usePageMeta({
    title: 'NetAsia — Internet Intelligence Platform',
    description: 'Free professional network and web tools for developers, sysadmins, and security teams. IP Lookup, DNS, WHOIS, SSL Checker, GeoIP and more — no signup required.',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const popularTools = getPopularTools();
  const { recent } = useRecentTools();
  const { favorites } = useFavorites();

  const recentToolObjects = recent.map(id => getToolById(id)).filter(Boolean) as typeof TOOLS;
  const favoriteToolObjects = favorites.map(id => getToolById(id)).filter(Boolean) as typeof TOOLS;
  const trendingTools = TOOLS.slice(5, 8); // surface newer tools

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <GlowOrb color="rgba(59,130,246,0.6)"   style={{ top: '-10%', left: '20%',  width: 700, height: 500 }} />
          <GlowOrb color="rgba(139,92,246,0.5)"   style={{ top: '10%',  left: '5%',   width: 400, height: 300 }} />
          <GlowOrb color="rgba(6,182,212,0.5)"    style={{ top: '15%',  right: '5%',  width: 400, height: 300 }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', color: '#60A5FA' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
              </span>
              10 free tools — no signup required
            </motion.div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-balance"
              style={{ lineHeight: 1.08, letterSpacing: '-0.03em' }}
            >
              <span style={{ color: 'var(--text-primary)' }}>Internet</span>{' '}
              <span className="gradient-text">Intelligence</span>
              <br />
              <span style={{ color: 'var(--text-primary)' }}>Platform</span>
            </h1>

            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
              style={{ color: 'var(--text-secondary)' }}
            >
              Professional network diagnostics, DNS analysis, SSL verification, and web inspection tools.
              Built for developers, sysadmins, and security teams — free, fast, and private.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8 relative">
              <div
                className="flex items-center rounded-2xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500/40"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                }}
              >
                <svg className="ml-5 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tools — IP, DNS, WHOIS, SSL..."
                  className="flex-1 bg-transparent px-4 py-4 text-base outline-none"
                  style={{ color: 'var(--text-primary)' }}
                  aria-label="Search tools"
                />
                <button type="submit" className="btn-primary m-1.5 text-sm">
                  Search
                </button>
              </div>
            </form>

            {/* Quick links */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Popular:</span>
              {[
                { label: 'IP Lookup', path: '/tools/ip-lookup' },
                { label: 'DNS Lookup', path: '/tools/dns-lookup' },
                { label: 'WHOIS', path: '/tools/whois-lookup' },
                { label: 'SSL Check', path: '/tools/ssl-checker' },
                { label: 'GeoIP', path: '/tools/geoip-lookup' },
              ].map(link => (
                <Link key={link.label} to={link.path}
                  className="text-sm px-3 py-1.5 rounded-lg transition-all hover:text-blue-400 hover:border-blue-500/30"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-strong)', color: 'var(--text-secondary)' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── Recently Used ── */}
      {recentToolObjects.length > 0 && (
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-7">
              <div>
                <div className="section-label">🕐 Recently Used</div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Pick up where you left off</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {recentToolObjects.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} size="sm" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Favorites ── */}
      {favoriteToolObjects.length > 0 && (
        <section className="py-14" style={{ background: 'rgba(239,68,68,0.02)', borderTop: '1px solid rgba(239,68,68,0.06)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-7">
              <div>
                <div className="section-label" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: '#F87171' }}>
                  ❤️ Your Favorites
                </div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Your saved tools</h2>
              </div>
              <Link to="/favorites" className="btn-secondary text-sm">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {favoriteToolObjects.slice(0, 4).map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Popular Tools ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="section-label">🔥 Most Used</div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Start with the essentials</h2>
              <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>The most-used tools in our network toolkit</p>
            </div>
            <Link to="/tools" className="btn-secondary text-sm hidden sm:flex">
              View all tools
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {popularTools.map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20" style={{ background: 'rgba(255,255,255,0.012)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-label" style={{ display: 'inline-flex' }}>📂 Categories</div>
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Browse by category</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Find the right tool for every job</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {liveCategories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={`/categories/${cat.id}`} className="card card-hover p-5 flex flex-col items-center text-center gap-3 group h-full">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</div>
                  <div>
                    <h3 className="font-semibold text-sm mb-0.5 group-hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {cat.name}
                    </h3>
                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                      {cat.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── More Tools ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="section-label">🛠️ More Tools</div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Explore the full toolkit</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {trendingTools.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={tool.path} className="card card-hover p-6 flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform"
                    style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold mb-1 group-hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>{tool.name}</h3>
                    <p className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>{tool.description}</p>
                  </div>
                  <svg className="flex-shrink-0 group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why NetAsia ── */}
      <section className="py-20" style={{ background: 'rgba(255,255,255,0.012)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-label" style={{ display: 'inline-flex' }}>✨ Why NetAsia</div>
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Built for professionals</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Reliable tools that stay out of your way</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="card p-6 group hover:border-blue-500/20 transition-colors"
              >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-105 transition-transform"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}28` }}>
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card relative overflow-hidden p-12"
            style={{ borderColor: 'rgba(59,130,246,0.2)' }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full"
                style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.3), transparent)', filter: 'blur(40px)' }} />
            </div>
            <div className="relative">
              <div className="text-5xl mb-5">🚀</div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Ready to get started?
              </h2>
              <p className="mb-8 text-lg" style={{ color: 'var(--text-secondary)' }}>
                All tools are free to use. No signup, no API keys, no limits.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link to="/tools" className="btn-primary text-sm">
                  Browse All Tools
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </Link>
                <Link to="/tools/ip-lookup" className="btn-secondary text-sm">
                  Try IP Lookup →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
