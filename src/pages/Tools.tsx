import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TOOLS, CATEGORIES } from '../lib/tools-registry';
import { usePageMeta } from '../hooks/usePageMeta';
import ToolCard from '../components/tools/ToolCard';
import Breadcrumbs from '../components/ui/Breadcrumbs';

// Only show categories that have at least one live tool
const LIVE_CATEGORY_IDS = [...new Set(TOOLS.map(t => t.category))];
const LIVE_CATEGORIES = CATEGORIES.filter(c => LIVE_CATEGORY_IDS.includes(c.id));

export default function ToolsPage() {
  usePageMeta({
    title: 'All Tools — NetAsia',
    description: 'Browse 10 free network and web tools. IP Lookup, GeoIP, DNS, WHOIS, SSL, HTTP Headers, Tech Detector, Reverse DNS, Propagation Checker, and URL Redirect Checker.',
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  const filtered = TOOLS.filter(tool => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q) || tool.category.includes(q);
    const matchCat = activeCategory === 'all' || tool.category === activeCategory;
    return matchQ && matchCat;
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'Tools' }]} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>All Tools</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            <span className="font-semibold" style={{ color: '#4ADE80' }}>{TOOLS.length} free tools</span>
            {' — '} no account required
          </p>
        </motion.div>

        {/* Filter panel */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5 mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="search"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setSearchParams(e.target.value ? { q: e.target.value } : {});
              }}
              placeholder="Filter tools..."
              className="input-field pl-11"
              aria-label="Filter tools"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setSearchParams({}); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors hover:bg-white/8"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Clear search"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter by category">
            {[{ id: 'all', name: 'All', icon: '🧰' }, ...LIVE_CATEGORIES].map(cat => {
              const count = cat.id === 'all' ? TOOLS.length : TOOLS.filter(t => t.category === cat.id).length;
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(active && cat.id !== 'all' ? 'all' : cat.id)}
                  aria-pressed={active}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium transition-all"
                  style={{
                    background: active ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`,
                    color: active ? '#60A5FA' : 'var(--text-muted)',
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="text-xs opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} tool{filtered.length !== 1 ? 's' : ''} shown
          </p>
        </motion.div>

        {/* Results */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="card p-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No tools found</h2>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Try a different keyword or category</p>
            <button onClick={() => { setQuery(''); setActiveCategory('all'); setSearchParams({}); }} className="btn-secondary text-sm">
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
