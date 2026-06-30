import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import Breadcrumbs from '../ui/Breadcrumbs';
import { useFavorites } from '../../hooks/useFavorites';
import { useRecentTools } from '../../hooks/useRecentTools';
import { getToolById } from '../../lib/tools-registry';
import { usePageMeta } from '../../hooks/usePageMeta';

interface Props {
  title: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  toolId: string;
  children: ReactNode;
}

const COLOR_STYLES: Record<string, { bg: string; text: string; glow: string; border: string }> = {
  blue:   { bg: 'rgba(59,130,246,0.1)',  text: '#60A5FA', glow: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.22)' },
  cyan:   { bg: 'rgba(6,182,212,0.1)',   text: '#22D3EE', glow: 'rgba(6,182,212,0.15)',  border: 'rgba(6,182,212,0.22)' },
  purple: { bg: 'rgba(139,92,246,0.1)',  text: '#A78BFA', glow: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.22)' },
  green:  { bg: 'rgba(34,197,94,0.1)',   text: '#4ADE80', glow: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.22)' },
  orange: { bg: 'rgba(249,115,22,0.1)',  text: '#FB923C', glow: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.22)' },
};

function ShareButton() {
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ url, title: document.title }); return; } catch { /* fallback */ }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleShare} className="btn-secondary text-sm" aria-label="Share this tool">
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Share
        </>
      )}
    </button>
  );
}

function FavoriteButton({ toolId }: { toolId: string }) {
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(toolId);
  return (
    <button
      onClick={() => toggle(toolId)}
      className="btn-secondary text-sm"
      style={{ color: fav ? '#F87171' : undefined }}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      {fav ? 'Saved' : 'Save'}
    </button>
  );
}

export default function ToolPageLayout({ title, description, icon, color, category, toolId, children }: Props) {
  usePageMeta({ title, description });
  const { addRecent } = useRecentTools();
  const style = COLOR_STYLES[color] || COLOR_STYLES.blue;
  const tool = getToolById(toolId);

  // Track this tool as recently used on mount
  useEffect(() => { addRecent(toolId); }, [toolId, addRecent]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'Tools', path: '/tools' }, { label: title }]} />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex items-start gap-5">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                boxShadow: `0 0 24px ${style.glow}`,
              }}
            >
              {icon}
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
                >
                  {category}
                </span>
                {tool?.isNew && <span className="badge badge-cyan">New</span>}
                {tool?.isPopular && <span className="badge badge-blue">Popular</span>}
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-1.5" style={{ color: 'var(--text-primary)' }}>
                {title}
              </h1>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {description}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-5 flex-wrap">
            <FavoriteButton toolId={toolId} />
            <ShareButton />
          </div>
        </motion.div>

        {/* Tool content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
