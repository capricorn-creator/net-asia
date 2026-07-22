import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '../../components/tools/ToolPageLayout';
import { CopyButton } from '../../components/tools/ResultField';
import { SkeletonResult } from '../../components/ui/Skeleton';
import { useDNSLookup } from '../../hooks/useDNSLookup';
import ToolInfo from '../../components/tools/ToolInfo';

const DNS_SECTIONS = [
  { heading: "What this tool does", content: "The DNS Lookup tool queries any domain's DNS records in real time. You can retrieve A records (IPv4 addresses), AAAA records (IPv6), MX records (mail servers), CNAME (aliases), TXT (text, SPF, DKIM), NS (nameservers), SOA (start of authority), and CAA (certificate authority authorisation) records." },
  { heading: "How it works", content: "DNS queries are sent from your browser directly to Google's DNS-over-HTTPS API (dns.google), which returns authoritative responses in JSON format. Selecting ALL queries each supported record type in parallel and merges the results." },
  { heading: "When to use it", content: "Use DNS Lookup to troubleshoot email delivery issues (MX and SPF records), verify domain ownership (TXT records), diagnose website connectivity problems (A/AAAA), check nameserver configuration (NS/SOA), or confirm SSL certificate policy (CAA). It is a standard tool for system administrators, email deliverability engineers, and developers." },
  { heading: "Tips", content: "When investigating a domain issue, start with ALL to get a complete picture. If you are checking email deliverability, look at MX, SPF (TXT), and DKIM (TXT) records together. CAA records tell you which certificate authorities are permitted to issue SSL certificates for the domain." },
];

const DNS_FAQS = [
  { q: "What is TTL?", a: "TTL (Time to Live) is the number of seconds a DNS resolver is permitted to cache a record before fetching a fresh copy. Lower TTL values mean changes propagate faster, but increase load on authoritative nameservers. Common values are 300 (5 minutes), 3600 (1 hour), and 86400 (24 hours)." },
  { q: "Why might DNS records be missing?", a: "Some record types are optional. For example, not every domain has AAAA or CAA records. If a record type returns empty, it means no records of that type are configured, not that the domain is broken." },
  { q: "What is the difference between A and AAAA?", a: "A records map a domain to an IPv4 address (e.g. 93.184.216.34). AAAA records map to an IPv6 address (e.g. 2606:2800::). Many domains support both for dual-stack connectivity." },
  { q: "How do I check if DNS changes have propagated?", a: "Use the DNS Propagation Checker to query the same record type across multiple global resolvers simultaneously." },
];

const DNS_RELATED = [
  { name: "DNS Propagation Checker", path: "/tools/dns-propagation", icon: "\ud83d\udce1", description: "Verify propagation across 8 global resolvers" },
  { name: "WHOIS Lookup", path: "/tools/whois-lookup", icon: "\ud83c\udff7\ufe0f", description: "Domain registration and nameserver details" },
  { name: "Reverse DNS Lookup", path: "/tools/reverse-dns", icon: "\ud83d\udd04", description: "Resolve PTR records for IP addresses" },
];

import { DNS_RECORD_TYPES } from '../../services/dns';
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
  const { results, loading, error: lookupError, lookup } = useDNSLookup();

  const handleLookup = () => {
    if (!domain.trim()) return;
    lookup(domain.trim(), recordType);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLookup();
  };

  // Preserve original UX: a successful-but-empty result set is shown
  // as a friendly "no records found" message rather than a blank state.
  const error = lookupError || (results && results.length === 0
    ? 'No DNS records found for this domain and record type.'
    : null);

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
      <ToolInfo sections={DNS_SECTIONS} faqs={DNS_FAQS} relatedTools={DNS_RELATED} />
    </ToolPageLayout>
  );
}
