import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { searchTools, TOOLS } from '../../lib/tools-registry';
import type { Tool } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useFavorites } from '../../hooks/useFavorites';

interface Props { open: boolean; onClose: () => void; }

const COLOR_MAP: Record<string, string> = {
  blue:'#3B82F6', cyan:'#06B6D4', purple:'#8B5CF6',
  green:'#22C55E', orange:'#F97316', pink:'#EC4899',
};

function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase()
          ? <mark key={i} style={{ background: 'rgba(59,130,246,0.3)', color: '#93C5FD', borderRadius: 2, padding: '0 1px' }}>{p}</mark>
          : p
      )}
    </>
  );
}

const POPULAR = ['IP Lookup', 'DNS Lookup', 'WHOIS', 'SSL Checker', 'HTTP Headers'];

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('netasia-search-history', []);
  const { isFavorite } = useFavorites();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const favoriteTools = TOOLS.filter(t => isFavorite(t.id));

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const q = query.trim();
    setResults(q ? searchTools(q).slice(0, 8) : []);
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = useCallback((tool: Tool) => {
    // Save to history
    const name = tool.name;
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h !== name);
      return [name, ...filtered].slice(0, 8);
    });
    navigate(tool.path);
    onClose();
  }, [navigate, onClose, setSearchHistory]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      const list = results.length > 0 ? results : [];
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, list.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && list[selectedIndex]) {
        handleSelect(list[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, selectedIndex, handleSelect, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', paddingTop: 'max(10vh, 60px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: -8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: -8, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-strong)',
              borderRadius: 20,
              boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#60A5FA', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search tools, categories..."
                className="flex-1 bg-transparent text-base outline-none"
                style={{ color: 'var(--text-primary)', fontSize: 15 }}
                aria-label="Search tools"
                role="combobox"
                aria-expanded={results.length > 0}
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 rounded hover:bg-white/8 transition-colors" style={{ color: 'var(--text-muted)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
              <kbd className="hidden sm:flex items-center gap-1 text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontSize: 11, border: '1px solid var(--border)' }}>
                ESC
              </kbd>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <ul className="overflow-y-auto no-scrollbar py-2" style={{ maxHeight: 380 }} role="listbox">
                {results.map((tool, i) => {
                  const color = COLOR_MAP[tool.color] || '#3B82F6';
                  const active = i === selectedIndex;
                  return (
                    <li key={tool.id} role="option" aria-selected={active}>
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                        style={{ background: active ? 'rgba(59,130,246,0.09)' : 'transparent' }}
                        onMouseEnter={() => setSelectedIndex(i)}
                        onClick={() => handleSelect(tool)}
                      >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 transition-all"
                          style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
                          {tool.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {highlight(tool.name, query)}
                            </span>
                            {tool.isNew && <span className="badge badge-cyan">New</span>}
                            {tool.comingSoon && <span className="badge badge-purple">Soon</span>}
                          </div>
                          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {highlight(tool.description, query)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs capitalize px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                            {tool.category}
                          </span>
                          {active && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#60A5FA' }}>
                              <path d="m9 18 6-6-6-6"/>
                            </svg>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* No results */}
            {query && results.length === 0 && (
              <div className="py-14 text-center px-6">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No tools found</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  No results for "<span style={{ color: 'var(--text-secondary)' }}>{query}</span>" — try a different keyword
                </p>
              </div>
            )}

            {/* Empty state — show history + favorites + popular */}
            {!query && (
              <div className="py-3 px-4 space-y-5 overflow-y-auto no-scrollbar" style={{ maxHeight: 380 }}>
                {/* Search history */}
                {searchHistory.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Recent Searches</p>
                      <button onClick={() => setSearchHistory([])} className="text-xs transition-colors hover:text-red-400" style={{ color: 'var(--text-muted)' }}>
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map(h => (
                        <button key={h} onClick={() => setQuery(h)}
                          className="text-xs px-3 py-1.5 rounded-lg transition-all hover:border-blue-500/30 hover:text-blue-400 flex items-center gap-1.5"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.02"/>
                          </svg>
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Favorites */}
                {favoriteTools.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                      ❤️ Favorites
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {favoriteTools.slice(0, 4).map(tool => (
                        <button key={tool.id} onClick={() => handleSelect(tool)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-white/6"
                          style={{ border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                          <span className="text-base">{tool.icon}</span>
                          <span className="text-xs font-medium truncate" style={{ color: 'var(--text-secondary)' }}>{tool.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    🔥 Popular
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR.map(name => (
                      <button key={name} onClick={() => setQuery(name)}
                        className="text-xs px-3 py-1.5 rounded-lg transition-all hover:border-blue-500/30 hover:text-blue-400"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)' }}>↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)' }}>↵</kbd>
                  open
                </span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {results.length > 0 ? `${results.length} results` : `${TOOLS.length} tools`}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
