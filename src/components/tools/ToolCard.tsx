import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Tool } from '../../types';
import { useFavorites } from '../../hooks/useFavorites';

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue:   { bg: 'rgba(59,130,246,0.1)',  text: '#60A5FA', border: 'rgba(59,130,246,0.22)' },
  cyan:   { bg: 'rgba(6,182,212,0.1)',   text: '#22D3EE', border: 'rgba(6,182,212,0.22)' },
  purple: { bg: 'rgba(139,92,246,0.1)',  text: '#A78BFA', border: 'rgba(139,92,246,0.22)' },
  green:  { bg: 'rgba(34,197,94,0.1)',   text: '#4ADE80', border: 'rgba(34,197,94,0.22)' },
  orange: { bg: 'rgba(249,115,22,0.1)',  text: '#FB923C', border: 'rgba(249,115,22,0.22)' },
  pink:   { bg: 'rgba(236,72,153,0.1)',  text: '#F472B6', border: 'rgba(236,72,153,0.22)' },
};

interface Props {
  tool: Tool;
  index?: number;
  size?: 'sm' | 'md';
}

export default function ToolCard({ tool, index = 0, size = 'md' }: Props) {
  const { toggle, isFavorite } = useFavorites();
  const s = COLOR_MAP[tool.color] || COLOR_MAP.blue;
  const fav = isFavorite(tool.id);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(tool.id);
  };

  const isSmall = size === 'sm';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={tool.path}
        className={`card card-hover flex flex-col gap-3 relative group ${isSmall ? 'p-4' : 'p-5'}`}
        style={{ height: '100%' }}
      >
        {/* Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {tool.isNew && <span className="badge badge-cyan">New</span>}
        </div>

        {/* Favorite btn */}
        <button
          onClick={handleFav}
          className="absolute bottom-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
          style={{
            color: fav ? '#F87171' : 'var(--text-muted)',
            background: fav ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${fav ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
          }}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Icon */}
        <div
          className={`flex items-center justify-center flex-shrink-0 text-xl rounded-xl ${isSmall ? 'w-10 h-10' : 'w-11 h-11'}`}
          style={{ background: s.bg, border: `1px solid ${s.border}` }}
        >
          {tool.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <h3
            className={`font-semibold mb-1 group-hover:text-blue-400 transition-colors ${isSmall ? 'text-xs' : 'text-sm'}`}
            style={{ color: 'var(--text-primary)' }}
          >
            {tool.name}
          </h3>
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
            {tool.description}
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-1 text-xs" style={{ color: s.text }}>
          <span>Open tool</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}
