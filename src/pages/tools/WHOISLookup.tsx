import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '../../components/tools/ToolPageLayout';
import { ResultField, ResultGrid, CopyButton } from '../../components/tools/ResultField';
import { SkeletonResult } from '../../components/ui/Skeleton';
import { lookupWHOIS } from '../../lib/api';

interface WHOISResult {
  raw: string;
  parsed: Record<string, string>;
}

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return undefined;
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getDaysUntilExpiry(expiryStr: string | undefined): { days: number; status: 'ok' | 'warning' | 'expired' } | null {
  if (!expiryStr) return null;
  try {
    const expiry = new Date(expiryStr);
    const days = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { days, status: 'expired' };
    if (days < 30) return { days, status: 'warning' };
    return { days, status: 'ok' };
  } catch {
    return null;
  }
}

export default function WHOISLookupPage() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WHOISResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const handleLookup = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await lookupWHOIS(domain.trim());
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'WHOIS lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const p = result?.parsed ?? {};
  const expiryInfo = getDaysUntilExpiry(p['Expiry Date']);

  return (
    <ToolPageLayout
      title="WHOIS Lookup"
      description="Retrieve domain registration data, ownership details, nameservers, and expiry information via RDAP."
      icon="🏷️"
      color="purple"
      category="Domain"
      toolId="whois-lookup"
    >
      <div className="card p-6 mb-4">
        <div className="flex gap-3">
          <input
            type="text"
            className="input-field text-base"
            placeholder="e.g. example.com or github.io"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            disabled={loading}
          />
          <button onClick={handleLookup} disabled={loading || !domain.trim()} className="btn-primary flex-shrink-0">
            {loading ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>}
            Lookup
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Examples:</span>
          {['cloudflare.com', 'stripe.com', 'vercel.com'].map(d => (
            <button key={d} onClick={() => setDomain(d)}
              className="text-xs px-2.5 py-1 rounded-lg hover:text-purple-400 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >{d}</button>
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
              <p className="font-semibold text-sm" style={{ color: '#F87171' }}>Lookup Failed</p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
            {/* Header */}
            <div className="card p-5 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>🏷️</div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Domain</p>
                  <p className="text-xl font-bold mono" style={{ color: 'var(--text-primary)' }}>{p['Domain Name'] || domain}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowRaw(!showRaw)}
                  className="btn-secondary text-sm"
                >
                  {showRaw ? 'Parsed View' : 'Raw View'}
                </button>
                <CopyButton text={result.raw} />
              </div>
            </div>

            {/* Expiry alert */}
            {expiryInfo && expiryInfo.status !== 'ok' && (
              <div className="card p-4 flex items-center gap-3"
                style={{
                  borderColor: expiryInfo.status === 'expired' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)',
                  background: expiryInfo.status === 'expired' ? 'rgba(239,68,68,0.05)' : 'rgba(245,158,11,0.05)',
                }}
              >
                <span className="text-xl">{expiryInfo.status === 'expired' ? '🔴' : '⚠️'}</span>
                <p className="text-sm font-medium" style={{ color: expiryInfo.status === 'expired' ? '#F87171' : '#FBBF24' }}>
                  {expiryInfo.status === 'expired'
                    ? `This domain expired ${Math.abs(expiryInfo.days)} days ago`
                    : `This domain expires in ${expiryInfo.days} days — renewal recommended`}
                </p>
              </div>
            )}

            {showRaw ? (
              <div className="card p-5">
                <pre className="text-xs mono overflow-x-auto whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {result.raw}
                </pre>
              </div>
            ) : (
              <>
                <ResultGrid title="Registration">
                  <ResultField label="Domain Name" value={p['Domain Name']} copyable />
                  <ResultField label="Registry Domain ID" value={p['Registry Domain ID']} copyable mono />
                  <ResultField label="Status" value={p['Status']} />
                  <ResultField label="Registrar" value={p['Registrar']} copyable />
                  <ResultField label="Registrar IANA ID" value={p['Registrar IANA ID']} mono />
                </ResultGrid>

                <ResultGrid title="Important Dates">
                  <ResultField label="Created Date" value={formatDate(p['Created Date'])} />
                  <ResultField label="Updated Date" value={formatDate(p['Updated Date'])} />
                  <ResultField
                    label="Expiry Date"
                    value={p['Expiry Date'] ? `${formatDate(p['Expiry Date'])}${expiryInfo ? ` (${expiryInfo.days > 0 ? expiryInfo.days + ' days left' : 'EXPIRED'})` : ''}` : undefined}
                    highlight={expiryInfo?.status === 'expired' ? 'error' : expiryInfo?.status === 'warning' ? 'warning' : 'success'}
                  />
                </ResultGrid>

                {(p['Registrant Organization'] || p['Registrant Country']) && (
                  <ResultGrid title="Registrant">
                    <ResultField label="Organization" value={p['Registrant Organization']} copyable />
                    <ResultField label="Country" value={p['Registrant Country']} />
                  </ResultGrid>
                )}

                {p['Name Servers'] && (
                  <ResultGrid title="Name Servers">
                    <ResultField label="Nameservers" value={p['Name Servers']} copyable mono fullWidth />
                  </ResultGrid>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ToolPageLayout>
  );
}
