import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TOOLS } from '../lib/tools-registry';
import { usePageMeta } from '../hooks/usePageMeta';
import { useFavorites } from '../hooks/useFavorites';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const FEATURES = [
  'Clean, modern interface',
  'Real-time results with animations',
  'Copy to clipboard on all fields',
  'No API key or signup required',
  'Works on mobile and desktop',
  'Dark and light mode support',
];

export default function ComingSoonPage() {
  const { id } = useParams<{ id: string }>();
  const tool = TOOLS.find(t => t.path === `/tools/${id}`);
  usePageMeta({
    title: tool?.name || 'Coming Soon',
    description: tool?.description || 'This tool is coming soon to NetAsia.',
  });
  const { toggle, isFavorite } = useFavorites();
  const fav = tool ? isFavorite(tool.id) : false;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'Tools', path: '/tools' }, { label: tool?.name || 'Coming Soon' }]} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          {/* Icon with rings */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute w-24 h-24 rounded-full opacity-20 animate-ping" style={{ background: 'rgba(139,92,246,0.4)', animationDuration: '2s' }} />
            <div className="absolute w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent)', filter: 'blur(20px)' }} />
            <div className="relative w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
              style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', boxShadow: '0 0 32px rgba(139,92,246,0.2)' }}>
              {tool?.icon || '🔧'}
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-medium"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', color: '#A78BFA' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Coming in Phase 2
          </div>

          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            {tool?.name || 'Tool Coming Soon'}
          </h1>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {tool?.description || 'This tool is currently being built and will be available soon.'}
          </p>

          {/* Features preview */}
          <div className="card p-6 mb-8 text-left">
            <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span className="w-1.5 h-4 rounded-full bg-purple-400 inline-block" />
              What to expect when it launches
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,92,246,0.1)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/tools" className="btn-primary text-sm">Browse Live Tools</Link>
            {tool && (
              <button
                onClick={() => toggle(tool.id)}
                className="btn-secondary text-sm"
                style={{ color: fav ? '#F87171' : undefined }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {fav ? 'Saved to favorites' : 'Save to favorites'}
              </button>
            )}
            <Link to="/roadmap" className="btn-ghost text-sm">View Roadmap</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
