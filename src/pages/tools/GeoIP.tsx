import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '../../components/tools/ToolPageLayout';
import { ResultField, ResultGrid, CopyButton } from '../../components/tools/ResultField';
import { SkeletonResult } from '../../components/ui/Skeleton';
import { useGeoIPLookup } from '../../hooks/useGeoIPLookup';
import ToolInfo from '../../components/tools/ToolInfo';

const GEOIP_SECTIONS = [
  { heading: "What this tool does", content: "GeoIP Lookup provides detailed geolocation and network information for any IPv4 or IPv6 address \u2014 including continent, country with emoji flag, region, city, postal code, timezone, coordinates, ISP, ASN, and proxy or VPN detection. Map links are generated automatically for addresses with valid coordinates." },
  { heading: "How it works", content: "Queries are sent from your browser to ip-api.com, a free geolocation API. The service maintains its own IP-to-location database, updated regularly from regional internet registries and other authoritative sources. Fields are requested selectively to minimise response size." },
  { heading: "When to use it", content: "GeoIP Lookup is useful for access log analysis, identifying the origin of network traffic, verifying geofencing rules, supporting fraud investigations, or building context around IP addresses seen in security incidents. It extends the basic IP Lookup with richer location detail and visual map integration." },
  { heading: "Proxy and VPN detection", content: "The tool includes basic proxy and VPN detection. When an address is flagged as a proxy or VPN exit node, a warning badge is displayed. This detection is not exhaustive \u2014 dedicated residential proxies and some commercial VPNs may not be flagged." },
];

const GEOIP_FAQS = [
  { q: "How is GeoIP Lookup different from IP Lookup?", a: "GeoIP Lookup uses a different provider (ip-api.com) and returns additional fields including continent, ZIP code, mobile/proxy detection, and country flag. It also provides both Google Maps and OpenStreetMap links. Use either tool depending on which data points you need." },
  { q: "How accurate is the city-level geolocation?", a: "Accuracy varies by country, ISP, and connection type. Broadband connections in densely populated areas are typically accurate to within 25\u201350 kilometres. Mobile, satellite, and VPN addresses may be significantly less accurate." },
  { q: "What does the \"proxy\" flag mean?", a: "The proxy flag indicates the IP address is associated with a known proxy, VPN, Tor exit node, or hosting provider commonly used for anonymisation. It is based on ip-api.com's database and may not detect all proxies." },
  { q: "Can I look up my own IP?", a: "Yes. Click the \"My IP\" button or leave the input blank to look up your own public IP address and see how it appears to websites you visit." },
];

const GEOIP_RELATED = [
  { name: "IP Lookup", path: "/tools/ip-lookup", icon: "\ud83c\udf10", description: "Basic geolocation using the ipapi.co API" },
  { name: "Reverse DNS Lookup", path: "/tools/reverse-dns", icon: "\ud83d\udd04", description: "Resolve the hostname for an IP address" },
  { name: "WHOIS Lookup", path: "/tools/whois-lookup", icon: "\ud83c\udff7\ufe0f", description: "Find who owns a domain or IP block" },
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
        <p className="font-semibold text-sm" style={{ color: '#F87171' }}>Lookup Failed</p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{message}</p>
      </div>
    </motion.div>
  );
}


export default function GeoIPPage() {
  const [input, setInput] = useState('');
  const { result, loading, error, lookup } = useGeoIPLookup();

  const handleLookup = (ip?: string) => lookup(ip ?? input.trim());

  const resultText = result ? [
    `IP: ${result.ip}`,
    `Type: ${result.type}`,
    result.flag ? `Country: ${result.flag} ${result.country_name} (${result.country_code})` : '',
    result.region ? `Region: ${result.region}` : '',
    result.city ? `City: ${result.city}` : '',
    result.zip ? `ZIP: ${result.zip}` : '',
    result.timezone ? `Timezone: ${result.timezone}` : '',
    result.latitude && result.longitude ? `Coordinates: ${result.latitude}, ${result.longitude}` : '',
    result.asn ? `ASN: ${result.asn}` : '',
    result.isp ? `ISP: ${result.isp}` : '',
    result.org ? `Organization: ${result.org}` : '',
  ].filter(Boolean).join('\n') : '';

  return (
    <ToolPageLayout
      title="GeoIP Lookup"
      description="Detailed geolocation for any IPv4 or IPv6 address — country, region, city, ISP, ASN, and coordinates."
      icon="🗺️"
      color="cyan"
      category="Network"
      toolId="geoip-lookup"
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
            placeholder="e.g. 8.8.8.8 or 2606:4700:4700::1111"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            disabled={loading}
          />
          <button onClick={() => handleLookup()} disabled={loading} className="btn-primary flex-shrink-0">
            {loading
              ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            }
            Lookup
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Quick:</span>
          {[{ label: 'My IP', ip: '' }, { label: '8.8.8.8', ip: '8.8.8.8' }, { label: '1.1.1.1', ip: '1.1.1.1' }].map(item => (
            <button key={item.label} onClick={() => { setInput(item.ip); handleLookup(item.ip); }}
              className="text-xs px-2.5 py-1 rounded-lg hover:text-cyan-400 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {item.label}
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
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
            {/* IP Header */}
            <div className="card p-5 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {result.flag && <span className="text-4xl" title={result.country_name}>{result.flag}</span>}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>IP Address</p>
                  <p className="text-xl font-bold mono" style={{ color: 'var(--text-primary)' }}>{result.ip}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                    style={{ background: 'rgba(6,182,212,0.1)', color: '#22D3EE', border: '1px solid rgba(6,182,212,0.2)' }}>
                    {result.type}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {result.is_proxy && (
                  <span className="badge badge-red">⚠️ Proxy/VPN</span>
                )}
                {result.is_mobile && (
                  <span className="badge badge-orange">📱 Mobile</span>
                )}
                <CopyButton text={resultText} />
              </div>
            </div>

            {/* Location */}
            <ResultGrid title="Location">
              <ResultField label="Country" value={result.country_name ? `${result.flag ?? ''} ${result.country_name}`.trim() : undefined} copyable />
              <ResultField label="Country Code" value={result.country_code} copyable mono />
              <ResultField label="Region" value={result.region} copyable />
              <ResultField label="City" value={result.city} copyable />
              <ResultField label="ZIP / Postal" value={result.zip} copyable mono />
              <ResultField label="Timezone" value={result.timezone} copyable />
              {result.latitude !== undefined && result.longitude !== undefined && (
                <ResultField label="Coordinates" value={`${result.latitude}, ${result.longitude}`} copyable mono />
              )}
            </ResultGrid>

            {/* Network */}
            <ResultGrid title="Network">
              <ResultField label="ISP" value={result.isp} copyable fullWidth />
              <ResultField label="Organization" value={result.org} copyable fullWidth />
              <ResultField label="ASN" value={result.asn} copyable mono />
              <ResultField label="Continent" value={result.continent} />
            </ResultGrid>

            {/* Map link */}
            {result.latitude !== undefined && result.longitude !== undefined && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a href={`https://www.google.com/maps?q=${result.latitude},${result.longitude}`}
                  target="_blank" rel="noopener noreferrer"
                  className="card p-4 flex items-center gap-3 group hover:border-cyan-500/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.1)' }}>🗺️</div>
                  <span className="text-sm font-medium group-hover:text-cyan-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    Google Maps
                  </span>
                  <svg className="ml-auto" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
                <a href={`https://www.openstreetmap.org/?mlat=${result.latitude}&mlon=${result.longitude}&zoom=10`}
                  target="_blank" rel="noopener noreferrer"
                  className="card p-4 flex items-center gap-3 group hover:border-cyan-500/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.1)' }}>🌍</div>
                  <span className="text-sm font-medium group-hover:text-cyan-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    OpenStreetMap
                  </span>
                  <svg className="ml-auto" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <ToolInfo sections={GEOIP_SECTIONS} faqs={GEOIP_FAQS} relatedTools={GEOIP_RELATED} />
    </ToolPageLayout>
  );
}
