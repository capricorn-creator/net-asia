import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useFavorites } from '../../hooks/useFavorites';
import { LogoWordmark } from '../ui/Logo';
import SearchModal from './SearchModal';

const NAV_LINKS = [
  { label: 'Tools', path: '/tools' },
  { label: 'Categories', path: '/categories' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

export default function Navbar() {
  const { toggleTheme, isDark } = useTheme();
  const { favorites } = useFavorites();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass' : 'bg-transparent'
        }`}
        style={{ borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent' }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" aria-label="NetAsia home">
              <LogoWordmark size={30} />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => {
                const active = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active ? 'text-blue-400' : 'hover:text-white'
                    }`}
                    style={{ color: active ? undefined : 'var(--text-secondary)' }}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: 'rgba(59,130,246,0.1)' }}
                        transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              {/* Search trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 hover:border-white/15"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-muted)',
                  minWidth: 185,
                }}
                aria-label="Search tools (⌘K)"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <span className="flex-1 text-left text-xs">Search tools...</span>
                <span className="text-xs px-1.5 py-0.5 rounded-md font-mono" style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>⌘K</span>
              </button>

              {/* Mobile search icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 rounded-lg transition-all hover:bg-white/5"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>

              {/* Favorites */}
              <Link
                to="/favorites"
                className="relative p-2 rounded-lg transition-all hover:bg-white/5"
                style={{ color: favorites.length > 0 ? '#F87171' : 'var(--text-muted)' }}
                aria-label={`Favorites (${favorites.length})`}
              >
                <HeartIcon filled={favorites.length > 0} />
                {favorites.length > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full text-white font-bold"
                    style={{ fontSize: 9, background: '#EF4444' }}
                  >
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </span>
                )}
              </Link>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all hover:bg-white/5"
                style={{ color: 'var(--text-secondary)' }}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg transition-all hover:bg-white/5"
                style={{ color: 'var(--text-secondary)' }}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {mobileOpen ? (
                    <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  ) : (
                    <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden border-t"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
            >
              <div className="px-4 py-3 space-y-0.5">
                {NAV_LINKS.map((link, i) => {
                  const active = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          active ? 'text-blue-400 bg-blue-500/10' : 'hover:bg-white/5'
                        }`}
                        style={{ color: active ? undefined : 'var(--text-secondary)' }}
                      >
                        {link.label}
                        {active && (
                          <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.2 }}>
                  <Link
                    to="/favorites"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <HeartIcon filled={favorites.length > 0} />
                    Favorites
                    {favorites.length > 0 && (
                      <span className="ml-auto badge badge-red">{favorites.length}</span>
                    )}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
