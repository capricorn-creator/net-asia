import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFoundPage() {
  usePageMeta({ title: '404 — Page Not Found' });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-lg"
      >
        {/* Animated 404 */}
        <div className="relative mb-8 inline-block">
          <div className="text-[120px] font-black leading-none select-none" style={{ letterSpacing: '-0.05em' }}>
            <span className="gradient-text">4</span>
            <span style={{ color: 'var(--border-strong)' }}>0</span>
            <span className="gradient-text">4</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 rounded-full opacity-15" style={{ background: 'radial-gradient(ellipse, #3B82F6, transparent)', filter: 'blur(30px)' }} />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Page not found
        </h1>
        <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          This page doesn't exist or may have moved. Use the search or browse all available tools below.
        </p>

        {/* Quick links */}
        <div className="card p-5 mb-8 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Where would you like to go?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '🌐 IP Lookup', path: '/tools/ip-lookup' },
              { label: '🔍 DNS Lookup', path: '/tools/dns-lookup' },
              { label: '🏷️ WHOIS', path: '/tools/whois-lookup' },
              { label: '🔒 SSL Checker', path: '/tools/ssl-checker' },
            ].map(link => (
              <Link key={link.path} to={link.path}
                className="px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-white/6 hover:text-blue-400"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)' }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button onClick={() => navigate(-1)} className="btn-secondary text-sm">
            ← Go back
          </button>
          <Link to="/" className="btn-primary text-sm">
            Home
          </Link>
          <Link to="/tools" className="btn-ghost text-sm">
            All Tools
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
