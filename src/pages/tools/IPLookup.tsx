import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '../../components/tools/ToolPageLayout';
import { ResultField, ResultGrid, CopyButton } from '../../components/tools/ResultField';
import { SkeletonResult } from '../../components/ui/Skeleton';
import { lookupIP } from '../../lib/api';
import type { IPInfo } from '../../types';

export default function IPLookupPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IPInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (ip?: string) => {
    const target = ip ?? input.trim();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await lookupIP(target);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to lookup IP');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLookup();
  };

  const resultText = result ? Object.entries(result)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n') : '';

  return (
    <ToolPageLayout
      title="IP Lookup"
      description="Get detailed geolocation, ISP, timezone, and ASN information for any IPv4 or IPv6 address."
      icon="🌐"
      color="blue"
      category="Network"
      toolId="ip-lookup"
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
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={() => handleLookup()}
            disabled={loading}
            className="btn-primary flex-shrink-0"
          >
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
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Quick lookup:</span>
          {['My IP', '8.8.8.8', '1.1.1.1', '208.67.222.222'].map(ip => (
            <button
              key={ip}
              onClick={() => {
                if (ip === 'My IP') {
                  setInput('');
                  handleLookup('');
                } else {
                  setInput(ip);
                  handleLookup(ip);
                }
              }}
              className="text-xs px-2.5 py-1 rounded-lg transition-colors hover:text-blue-400"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >
              {ip}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SkeletonResult />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="card p-5 flex items-start gap-3"
            style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}
          >
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

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* IP Header */}
            <div className="card p-5 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  🌐
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>IP Address</p>
                  <p className="text-xl font-bold mono" style={{ color: 'var(--text-primary)' }}>{result.ip}</p>
                </div>
              </div>
              <CopyButton text={resultText} label="Copy All" />
            </div>

            {/* Location */}
            <ResultGrid title="Location">
              <ResultField label="City" value={result.city} copyable />
              <ResultField label="Region" value={result.region} copyable />
              <ResultField label="Country" value={result.country_name} copyable />
              <ResultField label="Timezone" value={result.timezone} copyable />
              {result.latitude && result.longitude && (
                <ResultField label="Coordinates" value={`${result.latitude}, ${result.longitude}`} copyable mono />
              )}
            </ResultGrid>

            {/* Network */}
            <ResultGrid title="Network Info">
              <ResultField label="Organization / ISP" value={result.org} copyable fullWidth />
              <ResultField label="ASN" value={result.asn} copyable mono />
              <ResultField label="Country Code" value={result.country} copyable />
            </ResultGrid>

            {/* Map link */}
            {result.latitude && result.longitude && (
              <a
                href={`https://www.google.com/maps?q=${result.latitude},${result.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-4 flex items-center gap-3 group hover:border-blue-500/30 transition-colors block"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                  📍
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  View on Google Maps — {result.latitude?.toFixed(4)}, {result.longitude?.toFixed(4)}
                </span>
                <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ToolPageLayout>
  );
}
