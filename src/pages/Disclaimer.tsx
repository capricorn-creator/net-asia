import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const LAST_UPDATED = 'July 15, 2026';

export default function DisclaimerPage() {
  usePageMeta({
    title: 'Disclaimer — NetAsia',
    description: 'NetAsia Disclaimer. Tools rely on third-party public APIs. Results are for informational purposes only. Please verify critical information independently.',
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'Disclaimer' }]} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Disclaimer</h1>
          <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>Last updated: {LAST_UPDATED}</p>

          <div className="space-y-10" style={{ color: 'var(--text-secondary)' }}>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>General disclaimer</h2>
              <p className="leading-relaxed">
                The information and results provided by NetAsia are for <strong style={{ color: 'var(--text-primary)' }}>informational and diagnostic purposes only</strong>. While we strive to display accurate results, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information provided.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Third-party APIs</h2>
              <p className="leading-relaxed mb-4">
                All NetAsia tools retrieve data from public third-party APIs. NetAsia does not control these services and cannot guarantee their accuracy, uptime, or continued availability. The following providers are used:
              </p>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                      <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>Tool</th>
                      <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>Data Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['IP Lookup',               'ipapi.co'],
                      ['GeoIP Lookup',            'ip-api.com'],
                      ['DNS Lookup',              'Google DNS-over-HTTPS (dns.google)'],
                      ['DNS Propagation Checker', '8 public DoH resolvers (Google, Cloudflare, Quad9, OpenDNS, others)'],
                      ['Reverse DNS Lookup',      'Google DNS-over-HTTPS (dns.google)'],
                      ['WHOIS Lookup',            'RDAP protocol via rdap.org'],
                      ['SSL Certificate Checker', 'Certificate Transparency logs via crt.sh'],
                      ['HTTP Headers Checker',    'CORS proxy via corsproxy.io'],
                      ['Website Tech Detector',   'Wappalyzer public lookup API'],
                      ['URL Redirect Checker',    'CORS proxy via corsproxy.io'],
                    ].map(([tool, provider], i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{tool}</td>
                        <td className="px-4 py-3 mono text-xs" style={{ color: 'var(--text-muted)' }}>{provider}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="leading-relaxed mt-4">
                Each of these providers operates under its own terms of service and privacy policy. NetAsia is not affiliated with, endorsed by, or responsible for these third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Result accuracy</h2>
              <p className="leading-relaxed mb-3">
                Results may vary or be incomplete for several reasons:
              </p>
              <ul className="space-y-2 text-sm">
                {[
                  'DNS data may be cached or not yet propagated across all resolvers',
                  'WHOIS and RDAP data depends on registrars publishing accurate, up-to-date records',
                  'SSL certificate data from certificate transparency logs may lag behind real-time certificate changes by minutes to hours',
                  'IP geolocation is an estimate — physical location may differ from database records, particularly for mobile networks and VPNs',
                  'Technology detection results depend on server-side headers and publicly visible signals; tools that obfuscate their stack will not be detected',
                  'HTTP header results depend on the availability and behaviour of third-party CORS proxies',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5" style={{ color: 'var(--text-secondary)' }}>
                    <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Independent verification</h2>
              <p className="leading-relaxed">
                For decisions with significant security, financial, legal, or operational consequences, you should independently verify results using authoritative sources such as your DNS registrar, certificate authority, or hosting provider. NetAsia results should supplement — not replace — professional judgement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>No professional advice</h2>
              <p className="leading-relaxed">
                Nothing on NetAsia constitutes professional IT, security, legal, or financial advice. Always consult a qualified professional for matters requiring expert guidance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>External links</h2>
              <p className="leading-relaxed">
                NetAsia may include links to external websites such as Google Maps and OpenStreetMap. We have no control over those sites and accept no responsibility for their content or availability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Contact</h2>
              <p className="leading-relaxed">
                Questions about this Disclaimer? <Link to="/contact" className="text-blue-400 hover:underline">Contact us</Link>.
                You may also review our <Link to="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link> and <Link to="/terms" className="text-blue-400 hover:underline">Terms of Use</Link>.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
