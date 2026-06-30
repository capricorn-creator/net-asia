import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '../../components/tools/ToolPageLayout';
import { CopyButton } from '../../components/tools/ResultField';
import { SkeletonResult } from '../../components/ui/Skeleton';
import { lookupDNS, DNS_RECORD_TYPES } from '../../lib/api';
import type { DNSRecord } from '../../types';

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  A: { bg: 'rgba(59,130,246,0.1)', color: '#60A5FA' },
  AAAA: { bg: 'rgba(6,182,212,0.1)', color: '#22D3EE' },
  CNAME: { bg: 'rgba(139,92,246,0.1)', color: '#A78BFA' },
  MX: { bg: 'rgba(249,115,22,0.1)', color: '#FB923C' },
  NS: { bg: 'rgba(234,179,8,0.1)', color: '#FBBF24' },
  TXT: { bg: 'rgba(34,197,94,0.1)', color: '#4ADE80' },
  SOA: { bg: 'rgba(236,72,153,0.1)', color: '#F472B6' },
  CAA: { bg: 'rgba(99,102,241,0.1)', color: '#818CF8' },
};

export default function DNSLookupPage() {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DNSRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await lookupDNS(domain.trim(), recordType);
      setResults(data);
      if (data.length === 0) setError('No DNS records found for this domain and record type.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'DNS lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLookup();
  };

  // Group records by type
  const grouped = results?.reduce<Record<string, DNSRecord[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {}) ?? {};

  const allText = results?.map(r => `${r.type}\t${r.name}\t${r.value}${r.ttl ? `\tTTL: ${r.ttl}` : ''}`).join('\n') ?? '';

  return (
    <ToolPageLayout
      title="DNS Lookup"
      description="Query DNS records for any domain. Supports A, AAAA, CNAME, MX, NS, TXT, SOA, CAA and more."
      icon="🔍"
      color="cyan"
      category="DNS"
      toolId="dns-lookup"
    >
      {/* Input */}
      <div className="card p-6 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            type="text"
            className="input-field text-base flex-1"
            placeholder="e.g. google.com or mail.example.org"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <select
            value={recordType}
            onChange={e => setRecordType(e.target.value)}
            className="input-field sm:w-32 text-sm"
            disabled={loading}
          >
            {DNS_RECORD_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button onClick={handleLookup} disabled={loading || !domain.trim()} className="btn-primary flex-shrink-0">
            {loading ? (
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            )}
            Lookup
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Try:</span>
          {['google.com', 'cloudflare.com', 'github.com'].map(d => (
            <button
              key={d}
              onClick={() => { setDomain(d); }}
              className="text-xs px-2.5 py-1 rounded-lg transition-colors hover:text-cyan-400"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >
              {d}
            </button>
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
            style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {results && results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
            {/* Summary bar */}
            <div className="card p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {results.length} record{results.length !== 1 ? 's' : ''} found for <span className="mono text-cyan-400">{domain}</span>
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {Object.keys(grouped).map(type => {
                    const s = TYPE_COLORS[type] || { bg: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' };
                    return (
                      <span key={type} className="text-xs px-2 py-0.5 rounded-full font-mono font-bold" style={{ background: s.bg, color: s.color }}>
                        {type}
                      </span>
                    );
                  })}
                </div>
              </div>
              <CopyButton text={allText} />
            </div>

            {/* Records by type */}
            {Object.entries(grouped).map(([type, records]) => {
              const s = TYPE_COLORS[type] || { bg: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' };
              return (
                <div key={type} className="card overflow-hidden">
                  <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-xs font-bold px-2 py-0.5 rounded font-mono" style={{ background: s.bg, color: s.color }}>{type}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{records.length} record{records.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {records.map((rec, i) => (
                      <div key={i} className="px-5 py-3 flex items-start gap-4 flex-wrap">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{rec.name}</p>
                          <p className="text-sm mono break-all" style={{ color: 'var(--text-primary)' }}>
                            {rec.priority !== undefined ? `[Priority: ${rec.priority}] ` : ''}{rec.value}
                          </p>
                        </div>
                        {rec.ttl && (
                          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', flexShrink: 0 }}>
                            TTL {rec.ttl}s
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </ToolPageLayout>
  );
}
