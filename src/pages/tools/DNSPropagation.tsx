import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '../../components/tools/ToolPageLayout';
import { CopyButton } from '../../components/tools/ResultField';
import { SkeletonResult } from '../../components/ui/Skeleton';
import { useDNSPropagation } from '../../hooks/useDNSPropagation';
import ToolInfo from '../../components/tools/ToolInfo';
import { PROPAGATION_RECORD_TYPES } from '../../services/propagation';
import type { PropagationResult } from '../../types';

const PROP_SECTIONS = [
  { heading: "What this tool does", content: "The DNS Propagation Checker queries 8 public DNS-over-HTTPS resolvers simultaneously \u2014 including Google (8.8.8.8), Cloudflare (1.1.1.1), Quad9 (9.9.9.9), OpenDNS, Comodo, Yandex, AdGuard, and Neustar \u2014 and shows the result from each one. This lets you see whether a DNS change has reached different parts of the global resolver network." },
  { heading: "How it works", content: "All 8 resolvers are queried in parallel via their DNS-over-HTTPS endpoints. Each query is independent, so you see the actual record currently cached by each resolver. Results include the resolved value, status, and response time from each location." },
  { heading: "When to use it", content: "Use DNS Propagation Checker after making DNS changes \u2014 such as updating A records when migrating a server, changing MX records for email migration, or adding TXT records for domain verification. It helps confirm that your changes are visible globally before you complete a migration or go-live." },
  { heading: "Understanding propagation times", content: "DNS changes do not propagate instantly. Resolvers cache records until the TTL expires, then fetch fresh copies. If your TTL was 86400 (24 hours) before the change, some resolvers may serve the old record for up to 24 hours. Lowering your TTL to 300 seconds an hour before making changes significantly reduces propagation time." },
];

const PROP_FAQS = [
  { q: "Why do different resolvers show different values?", a: "Each resolver independently caches DNS records based on when it last fetched a fresh copy. If a record was recently changed, some resolvers may still be serving the cached old value while others have already picked up the new record." },
  { q: "What does NXDOMAIN mean?", a: "NXDOMAIN (Non-Existent Domain) means the resolver could not find any records for the queried name. This may indicate the domain does not exist, the record type has not been configured, or the domain has recently been deleted." },
  { q: "How do I speed up DNS propagation?", a: "Before making DNS changes, reduce your record's TTL to 300 seconds (5 minutes) and wait for the old TTL to expire. Then make the change. After propagation is confirmed, you can restore the original TTL." },
  { q: "What record types can I check?", a: "The tool supports A, AAAA, MX, TXT, NS, and CNAME records \u2014 the most commonly changed types during domain migrations and server moves." },
];

const PROP_RELATED = [
  { name: "DNS Lookup", path: "/tools/dns-lookup", icon: "\ud83d\udd0d", description: "Query all DNS record types for a domain" },
  { name: "WHOIS Lookup", path: "/tools/whois-lookup", icon: "\ud83c\udff7\ufe0f", description: "Check nameserver configuration" },
  { name: "Reverse DNS Lookup", path: "/tools/reverse-dns", icon: "\ud83d\udd04", description: "Resolve PTR records for IP addresses" },
];


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
        <p className="font-semibold text-sm" style={{ color: '#F87171' }}>Check Failed</p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{message}</p>
      </div>
    </motion.div>
  );
}

const STATUS_STYLES = {
  success:  { color: '#4ADE80', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)',   label: 'Propagated', dot: '#4ADE80' },
  nxdomain: { color: '#F87171', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)',   label: 'NXDOMAIN',   dot: '#F87171' },
  timeout:  { color: '#FBBF24', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)',  label: 'Timeout',    dot: '#FBBF24' },
  error:    { color: '#94A3B8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)', label: 'Error',      dot: '#94A3B8' },
};

function ResolverRow({ row, index }: { row: PropagationResult; index: number }) {
  const s = STATUS_STYLES[row.status as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.error;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="flex items-start gap-4 px-5 py-4 border-b last:border-b-0"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="flex-shrink-0 mt-1">
        <span className="relative flex h-2.5 w-2.5">
          {row.status === 'success' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ background: s.dot }} />
          )}
          <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: s.dot }} />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{row.resolverName}</span>
          <span className="text-xs mono" style={{ color: 'var(--text-muted)' }}>{row.resolver}</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {row.location}</span>
        </div>
        {row.status === 'success' && row.values.length > 0 ? (
          <div className="space-y-0.5">
            {row.values.map((v: string, i: number) => (
              <p key={i} className="text-xs mono break-all" style={{ color: '#60A5FA' }}>{v}</p>
            ))}
          </div>
        ) : (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {row.status === 'nxdomain' ? 'Domain not found (NXDOMAIN)' :
             row.status === 'timeout'  ? 'Request timed out' : 'No data returned'}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-1">
        <span className="badge text-xs" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
          {s.label}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{row.responseTime}ms</span>
      </div>
    </motion.div>
  );
}


export default function DNSPropagationPage() {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const { result, loading, error, check } = useDNSPropagation();

  const handleCheck = () => { if (domain.trim()) check(domain.trim(), recordType); };

  const propagatedCount = result?.results.filter(r => r.status === 'success').length ?? 0;
  const totalCount = result?.results.length ?? 0;
  const propagationPct = totalCount > 0 ? Math.round((propagatedCount / totalCount) * 100) : 0;

  const allText = result?.results.map(r =>
    `${r.resolverName} (${r.resolver}) [${r.location}]: ${r.status === 'success' ? r.values.join(', ') : r.status} — ${r.responseTime}ms`
  ).join('\n') ?? '';

  return (
    <ToolPageLayout
      title="DNS Propagation Checker"
      description="Check whether your DNS changes have propagated across 8 global resolvers including Google, Cloudflare, Quad9, and OpenDNS."
      icon="📡"
      color="cyan"
      category="DNS"
      toolId="dns-propagation"
    >
      {/* Input */}
      <div className="card p-6 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            type="text"
            className="input-field text-base flex-1"
            placeholder="e.g. example.com"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCheck()}
            disabled={loading}
          />
          <select
            value={recordType}
            onChange={e => setRecordType(e.target.value)}
            className="input-field sm:w-28 text-sm"
            disabled={loading}
          >
            {PROPAGATION_RECORD_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button onClick={handleCheck} disabled={loading || !domain.trim()} className="btn-primary flex-shrink-0">
            {loading
              ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            }
            Check
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Try:</span>
          {['cloudflare.com', 'github.com'].map(d => (
            <button key={d} onClick={() => { setDomain(d); }}
              className="text-xs px-2.5 py-1 rounded-lg hover:text-cyan-400 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="card p-5 mb-4 flex items-center gap-3">
              <svg className="animate-spin flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Querying 8 global DNS resolvers simultaneously…
              </p>
            </div>
            <SkeletonResult />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && !loading && <ErrorCard message={error} />}
      </AnimatePresence>

      <AnimatePresence>
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
            {/* Propagation summary */}
            <div className="card p-5 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                  Propagation Status
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold" style={{ color: propagationPct === 100 ? '#4ADE80' : propagationPct > 50 ? '#FBBF24' : '#F87171' }}>
                    {propagationPct}%
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {propagatedCount}/{totalCount} resolvers propagated
                  </p>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 rounded-full overflow-hidden w-48" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${propagationPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: propagationPct === 100 ? '#4ADE80' : propagationPct > 50 ? '#FBBF24' : '#F87171' }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm font-bold mono" style={{ color: 'var(--text-primary)' }}>{result.domain}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Record: <span className="font-bold" style={{ color: '#22D3EE' }}>{result.recordType}</span></p>
                </div>
                <CopyButton text={allText} />
              </div>
            </div>

            {/* Resolver results */}
            <div className="card overflow-hidden">
              {result.results.map((row, i) => (
                <ResolverRow key={row.resolver} row={row} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToolInfo sections={PROP_SECTIONS} faqs={PROP_FAQS} relatedTools={PROP_RELATED} />
    </ToolPageLayout>
  );
}
