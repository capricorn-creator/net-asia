import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '../../components/tools/ToolPageLayout';
import { SkeletonResult } from '../../components/ui/Skeleton';
import { CopyButton } from '../../components/tools/ResultField';
import { useReverseDNS } from '../../hooks/useReverseDNS';

function ErrorCard({ message }: { message: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="card p-5 flex items-start gap-3"
      style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div>
        <p className="font-semibold text-sm" style={{ color: '#F87171' }}>Lookup Failed</p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{message}</p>
      </div>
    </motion.div>
  );
}

const STATUS_CONFIG = {
  resolved: { label: 'PTR Record Found', color: '#4ADE80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', icon: '✅' },
  'no-ptr': { label: 'No PTR Record', color: '#FBBF24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: '⚠️' },
  error:    { label: 'Lookup Error', color: '#F87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: '❌' },
};

export default function ReverseDNSPage() {
  const [input, setInput] = useState('');
  const { result, loading, error, lookup } = useReverseDNS();

  const handleLookup = () => { if (input.trim()) lookup(input.trim()); };

  const sc = result ? STATUS_CONFIG[result.status] : null;

  return (
    <ToolPageLayout
      title="Reverse DNS Lookup"
      description="Look up the PTR record for any IPv4 or IPv6 address to find its associated hostname."
      icon="🔄"
      color="blue"
      category="DNS"
      toolId="reverse-dns"
    >
      {/* Input */}
      <div className="card p-6 mb-4">
        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
          IP Address
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            className="input-field text-base"
            placeholder="e.g. 8.8.8.8 or 2001:4860:4860::8888"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            disabled={loading}
          />
          <button onClick={handleLookup} disabled={loading || !input.trim()} className="btn-primary flex-shrink-0">
            {loading
              ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 12l4-4m-4 4 4 4M21 12l-4-4m4 4-4 4"/></svg>
            }
            Lookup
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Examples:</span>
          {['8.8.8.8', '1.1.1.1', '208.67.222.222'].map(ip => (
            <button key={ip} onClick={() => { setInput(ip); lookup(ip); }}
              className="text-xs px-2.5 py-1 rounded-lg hover:text-blue-400 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {ip}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {loading && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SkeletonResult /></motion.div>}
      </AnimatePresence>
      <AnimatePresence>
        {error && !loading && <ErrorCard message={error} />}
      </AnimatePresence>

      <AnimatePresence>
        {result && sc && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
            {/* Status banner */}
            <div className="card p-5 flex items-center justify-between flex-wrap gap-4"
              style={{ borderColor: sc.border, background: sc.bg }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sc.icon}</span>
                <div>
                  <p className="font-bold text-sm" style={{ color: sc.color }}>{sc.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    for <span className="mono">{result.ip}</span>
                    {result.responseTime && ` · ${result.responseTime}ms`}
                  </p>
                </div>
              </div>
              {result.hostname && <CopyButton text={result.hostname} label="Copy Hostname" />}
            </div>

            {/* Result card */}
            <div className="card p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>IP Address</p>
                  <p className="text-sm mono font-semibold" style={{ color: 'var(--text-primary)' }}>{result.ip}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>PTR / Hostname</p>
                  {result.hostname
                    ? <p className="text-sm mono font-semibold break-all" style={{ color: '#60A5FA' }}>{result.hostname}</p>
                    : <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>No PTR record configured</p>
                  }
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Resolution Status</p>
                  <span className="badge" style={{
                    background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                  }}>
                    {sc.label}
                  </span>
                </div>
                {result.ttl && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>TTL</p>
                    <p className="text-sm mono" style={{ color: 'var(--text-primary)' }}>{result.ttl}s</p>
                  </div>
                )}
              </div>
            </div>

            {/* No PTR explanation */}
            {result.status === 'no-ptr' && (
              <div className="card p-5" style={{ borderColor: 'rgba(245,158,11,0.15)', background: 'rgba(245,158,11,0.04)' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: '#FBBF24' }}>What does "no PTR record" mean?</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  A PTR (pointer) record maps an IP address back to a hostname. Not all IP addresses have one configured — this is normal for home connections, dynamic IPs, or servers that don't require reverse DNS. Mail servers typically need PTR records to avoid spam filtering.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ToolPageLayout>
  );
}
