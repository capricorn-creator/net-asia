import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '../../components/tools/ToolPageLayout';
import { ResultField, ResultGrid, CopyButton } from '../../components/tools/ResultField';
import { SkeletonResult } from '../../components/ui/Skeleton';
import { useSSLChecker } from '../../hooks/useSSLChecker';
import ToolInfo from '../../components/tools/ToolInfo';

const SSL_SECTIONS = [
  { heading: "What this tool does", content: "The SSL Certificate Checker verifies the TLS certificate for any domain, showing its validity status, expiry date, days remaining, issuer, and Subject Alternative Names (SANs). It also displays the certificate's serial number for cross-referencing with certificate transparency logs." },
  { heading: "How it works", content: "This tool queries the crt.sh certificate transparency database, which aggregates certificates from all major CT logs. It retrieves the most recently issued certificate for the domain and derives validity and expiry information from the certificate's notBefore and notAfter fields." },
  { heading: "When to use it", content: "Use SSL Checker to verify a certificate is valid before launching a site, monitor upcoming expiry dates, confirm a newly installed certificate is visible in transparency logs, check which domains a wildcard or multi-SAN certificate covers, or investigate certificate issuance as part of security monitoring." },
  { heading: "Best practices", content: "Renew SSL certificates at least 30 days before expiry to allow time for troubleshooting. Set up automated monitoring or calendar reminders for expiry dates. Wildcard certificates (*.example.com) cover all immediate subdomains but not second-level subdomains (e.g. api.v2.example.com requires a separate certificate)." },
];

const SSL_FAQS = [
  { q: "Why might a recently installed certificate not appear?", a: "Certificate transparency logs aggregate entries from all CAs, but there is typically a short delay \u2014 usually minutes to a couple of hours \u2014 between certificate issuance and appearance in CT log searches." },
  { q: "What are Subject Alternative Names (SANs)?", a: "SANs are additional domain names that a single certificate is valid for. Modern certificates use SANs instead of the Common Name field to list all covered domains. A SAN certificate can protect hundreds of domains simultaneously." },
  { q: "What does \"days remaining\" mean?", a: "This is the number of days until the certificate's notAfter date. Browsers begin showing warnings when certificates expire. Aim to renew before the count reaches 30 days." },
  { q: "Is a self-signed certificate detected?", a: "Yes. If the issuer and subject are the same organisation, the certificate is self-signed. Browsers do not trust self-signed certificates and will display security warnings for end users." },
];

const SSL_RELATED = [
  { name: "HTTP Headers Checker", path: "/tools/http-headers", icon: "\ud83d\udccb", description: "Check HSTS and other security headers" },
  { name: "WHOIS Lookup", path: "/tools/whois-lookup", icon: "\ud83c\udff7\ufe0f", description: "Domain registration and expiry details" },
  { name: "Website Tech Detector", path: "/tools/website-tech", icon: "\ud83d\udd2d", description: "Detect CDN and hosting technology" },
];


function formatDate(isoStr: string | undefined) {
  if (!isoStr) return undefined;
  try {
    return new Date(isoStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
  } catch { return isoStr; }
}

function getExpiryStatus(days: number | undefined): 'success' | 'warning' | 'error' {
  if (days === undefined) return 'error';
  if (days < 0) return 'error';
  if (days < 30) return 'warning';
  return 'success';
}

function ExpiryMeter({ days }: { days: number }) {
  const totalDays = 365;
  const pct = Math.max(0, Math.min(100, (days / totalDays) * 100));
  const color = days < 0 ? '#F87171' : days < 30 ? '#FBBF24' : '#4ADE80';

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
        <span>Validity remaining</span>
        <span style={{ color }}>{days < 0 ? 'Expired' : `${days} days`}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function SSLCheckerPage() {
  const [domain, setDomain] = useState('');
  const { result, loading, error, check } = useSSLChecker();

  const handleCheck = () => {
    if (!domain.trim()) return;
    check(domain.trim());
  };

  const expiryStatus = getExpiryStatus(result?.daysRemaining);
  const resultText = result ? [
    `Subject: ${result.subject}`,
    `Issuer: ${result.issuer}`,
    `Valid From: ${result.validFrom}`,
    `Valid To: ${result.validTo}`,
    `Days Remaining: ${result.daysRemaining}`,
    result.subjectAltNames?.length ? `SANs: ${result.subjectAltNames.join(', ')}` : '',
  ].filter(Boolean).join('\n') : '';

  return (
    <ToolPageLayout
      title="SSL Certificate Checker"
      description="Verify SSL/TLS certificate validity, expiry date, issuer chain, and Subject Alternative Names for any domain."
      icon="🔒"
      color="green"
      category="SSL"
      toolId="ssl-checker"
    >
      <div className="card p-6 mb-4">
        <div className="flex gap-3">
          <input
            type="text"
            className="input-field text-base"
            placeholder="e.g. github.com or api.example.org"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCheck()}
            disabled={loading}
          />
          <button onClick={handleCheck} disabled={loading || !domain.trim()} className="btn-primary flex-shrink-0">
            {loading
              ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            Check SSL
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Try:</span>
          {['github.com', 'cloudflare.com', 'google.com'].map(d => (
            <button key={d} onClick={() => setDomain(d)}
              className="text-xs px-2.5 py-1 rounded-lg hover:text-green-400 transition-colors"
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
              <p className="font-semibold text-sm" style={{ color: '#F87171' }}>Check Failed</p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
            {/* Status card */}
            <div className="card p-5" style={{
              borderColor: expiryStatus === 'success' ? 'rgba(34,197,94,0.2)' : expiryStatus === 'warning' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
            }}>
              <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: expiryStatus === 'success' ? 'rgba(34,197,94,0.1)' : expiryStatus === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)' }}
                  >
                    {expiryStatus === 'success' ? '🔒' : expiryStatus === 'warning' ? '⚠️' : '🔓'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm"
                        style={{ color: expiryStatus === 'success' ? '#4ADE80' : expiryStatus === 'warning' ? '#FBBF24' : '#F87171' }}
                      >
                        {expiryStatus === 'success' ? 'Certificate Valid' : expiryStatus === 'warning' ? 'Expiring Soon' : 'Certificate Expired'}
                      </span>
                    </div>
                    <p className="text-sm mono font-semibold" style={{ color: 'var(--text-primary)' }}>{result.subject}</p>
                  </div>
                </div>
                <CopyButton text={resultText} />
              </div>
              {result.daysRemaining !== undefined && <ExpiryMeter days={result.daysRemaining} />}
            </div>

            <ResultGrid title="Certificate Details">
              <ResultField label="Common Name / Subject" value={result.subject} copyable fullWidth />
              <ResultField label="Issuer" value={result.issuer} copyable fullWidth />
              <ResultField label="Valid From" value={formatDate(result.validFrom)} />
              <ResultField label="Expires On" value={formatDate(result.validTo)} highlight={expiryStatus} />
              <ResultField label="Days Remaining" value={result.daysRemaining !== undefined ? `${result.daysRemaining} days` : undefined}
                highlight={expiryStatus} badge />
              {result.serialNumber && <ResultField label="Serial Number" value={result.serialNumber} mono copyable />}
            </ResultGrid>

            {result.subjectAltNames && result.subjectAltNames.length > 0 && (
              <div className="card p-6">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <span className="w-1.5 h-4 rounded-full bg-green-500 inline-block" />
                  Subject Alternative Names ({result.subjectAltNames.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.subjectAltNames.map((san, i) => (
                    <span key={i} className="text-xs px-2.5 py-1.5 rounded-lg mono"
                      style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', color: '#4ADE80' }}>
                      {san}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <ToolInfo sections={SSL_SECTIONS} faqs={SSL_FAQS} relatedTools={SSL_RELATED} />
    </ToolPageLayout>
  );
}
