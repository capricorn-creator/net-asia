import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '../../components/tools/ToolPageLayout';
import { CopyButton } from '../../components/tools/ResultField';
import { SkeletonResult } from '../../components/ui/Skeleton';
import { useHeadersLookup } from '../../hooks/useHeadersLookup';

function getStatusColor(status: number) {
  if (status >= 500) return { color: '#F87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' };
  if (status >= 400) return { color: '#FBBF24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' };
  if (status >= 300) return { color: '#60A5FA', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' };
  if (status >= 200) return { color: '#4ADE80', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' };
  return { color: '#94A3B8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' };
}

const SECURITY_HEADERS = [
  'strict-transport-security', 'content-security-policy', 'x-frame-options',
  'x-content-type-options', 'referrer-policy', 'permissions-policy', 'x-xss-protection',
];

export default function HTTPHeadersPage() {
  const [url, setUrl] = useState('');
  const { result, loading, error, check } = useHeadersLookup();
  const [activeTab, setActiveTab] = useState<'all' | 'security'>('all');

  const handleCheck = () => {
    if (!url.trim()) return;
    check(url.trim());
  };

  const sc = result ? getStatusColor(result.status) : null;
  const headerNames = new Set(result?.headers.map(h => h.name.toLowerCase()) ?? []);
  const missingSecurityHeaders = SECURITY_HEADERS.filter(h => !headerNames.has(h));

  const allText = result?.headers.map(h => `${h.name}: ${h.value}`).join('\n') ?? '';

  const displayHeaders = activeTab === 'security'
    ? result?.headers.filter(h => SECURITY_HEADERS.includes(h.name.toLowerCase()))
    : result?.headers;

  return (
    <ToolPageLayout
      title="HTTP Headers Checker"
      description="Inspect HTTP response headers, status codes, server info, and security header coverage for any URL."
      icon="📋"
      color="blue"
      category="Website"
      toolId="http-headers"
    >
      <div className="card p-6 mb-4">
        <div className="flex gap-3">
          <input
            type="url"
            className="input-field text-base"
            placeholder="https://example.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCheck()}
            disabled={loading}
          />
          <button onClick={handleCheck} disabled={loading || !url.trim()} className="btn-primary flex-shrink-0">
            {loading
              ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
            Fetch
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Try:</span>
          {['https://cloudflare.com', 'https://github.com', 'https://stripe.com'].map(u => (
            <button key={u} onClick={() => setUrl(u)}
              className="text-xs px-2.5 py-1 rounded-lg hover:text-blue-400 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >{u.replace('https://', '')}</button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {loading && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SkeletonResult /></motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {error && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="card p-5 flex items-start gap-3"
            style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#F87171' }}>Request Failed</p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && !loading && sc && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
            {/* Status bar */}
            <div className="card p-5 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-5 flex-wrap">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Status</p>
                  <span className="text-xl font-bold mono px-3 py-1.5 rounded-lg"
                    style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                    {result.status} {result.statusText}
                  </span>
                </div>
                {result.responseTime && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Response Time</p>
                    <p className="text-lg font-bold mono" style={{ color: 'var(--text-primary)' }}>{result.responseTime}ms</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Headers</p>
                  <p className="text-lg font-bold mono" style={{ color: 'var(--text-primary)' }}>{result.headers.length}</p>
                </div>
                {result.serverInfo && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Server</p>
                    <p className="text-sm mono font-medium" style={{ color: 'var(--text-primary)' }}>{result.serverInfo}</p>
                  </div>
                )}
              </div>
              <CopyButton text={allText} />
            </div>

            {/* Security score */}
            {SECURITY_HEADERS.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Security Headers</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {SECURITY_HEADERS.length - missingSecurityHeaders.length} of {SECURITY_HEADERS.length} security headers present
                    </p>
                  </div>
                  <span className="text-xl font-bold" style={{ color: missingSecurityHeaders.length === 0 ? '#4ADE80' : missingSecurityHeaders.length > 4 ? '#F87171' : '#FBBF24' }}>
                    {Math.round(((SECURITY_HEADERS.length - missingSecurityHeaders.length) / SECURITY_HEADERS.length) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full"
                    style={{
                      width: `${((SECURITY_HEADERS.length - missingSecurityHeaders.length) / SECURITY_HEADERS.length) * 100}%`,
                      background: missingSecurityHeaders.length === 0 ? '#4ADE80' : missingSecurityHeaders.length > 4 ? '#F87171' : '#FBBF24',
                    }}
                  />
                </div>
                {missingSecurityHeaders.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Missing headers:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingSecurityHeaders.map(h => (
                        <span key={h} className="text-xs px-2 py-1 rounded mono" style={{ background: 'rgba(239,68,68,0.08)', color: '#F87171', border: '1px solid rgba(239,68,68,0.15)' }}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Headers table */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  {(['all', 'security'] as const).map(tab => (
                    <button key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="px-3 py-1.5 text-xs font-medium capitalize transition-colors"
                      style={{
                        background: activeTab === tab ? 'rgba(59,130,246,0.15)' : 'transparent',
                        color: activeTab === tab ? '#60A5FA' : 'var(--text-muted)',
                      }}
                    >
                      {tab === 'all' ? `All (${result.headers.length})` : `Security (${result.headers.filter(h => SECURITY_HEADERS.includes(h.name.toLowerCase())).length})`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto" style={{ borderColor: 'var(--border)' }}>
                {(displayHeaders ?? []).length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No security headers found</p>
                  </div>
                ) : (
                  (displayHeaders ?? []).map((h, i) => {
                    const isSecurity = SECURITY_HEADERS.includes(h.name.toLowerCase());
                    return (
                      <div key={i} className="px-5 py-3 flex items-start gap-3">
                        {isSecurity && (
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                        )}
                        <div className={`min-w-0 flex-1 ${!isSecurity && activeTab === 'all' ? 'pl-4' : ''}`}>
                          <p className="text-xs font-mono font-semibold mb-0.5" style={{ color: '#60A5FA' }}>{h.name}</p>
                          <p className="text-sm break-all mono" style={{ color: 'var(--text-secondary)' }}>{h.value}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolPageLayout>
  );
}
