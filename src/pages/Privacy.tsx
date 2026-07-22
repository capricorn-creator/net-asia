import { motion } from 'framer-motion';
import { usePageMeta } from '../hooks/usePageMeta';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const LAST_UPDATED = 'July 15, 2026';

export default function PrivacyPage() {
  usePageMeta({
    title: 'Privacy Policy — NetAsia',
    description: 'NetAsia Privacy Policy. We do not collect personal data. Your queries go directly from your browser to public APIs and are never logged or stored by us.',
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'Privacy Policy' }]} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Privacy Policy</h1>
          <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>Last updated: {LAST_UPDATED}</p>

          <div className="space-y-10" style={{ color: 'var(--text-secondary)' }}>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Overview</h2>
              <p className="leading-relaxed">
                NetAsia is committed to protecting your privacy. This policy explains what information we collect (very little), what we do not collect, and how the platform works in relation to your data.
              </p>
              <p className="leading-relaxed mt-3">
                The short version: <strong style={{ color: 'var(--text-primary)' }}>we do not collect, store, sell, or share your personal data.</strong> All tool queries run directly from your browser to public third-party APIs. NetAsia's servers are never involved in your lookups.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Information we do not collect</h2>
              <ul className="space-y-2">
                {[
                  'IP addresses, domain names, or URLs you look up using our tools',
                  'Your personal IP address from tool usage',
                  'Usernames, email addresses, or account information (no accounts exist)',
                  'Payment information (all tools are free)',
                  'Browsing history or cross-site tracking data',
                  'Device fingerprints or advertising identifiers',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>How tools work</h2>
              <p className="leading-relaxed mb-3">
                Each tool on NetAsia queries a public third-party API directly from your browser. For example:
              </p>
              <ul className="space-y-2 text-sm">
                {[
                  ['IP Lookup / GeoIP', 'Query sent from your browser to ipapi.co or ip-api.com'],
                  ['DNS Lookup / Propagation / Reverse DNS', 'Query sent from your browser to dns.google'],
                  ['WHOIS Lookup', 'Query sent from your browser to rdap.org'],
                  ['SSL Certificate Checker', 'Query sent from your browser to crt.sh'],
                  ['HTTP Headers / Redirect Checker', 'Request routed through corsproxy.io (a public CORS proxy)'],
                  ['Website Tech Detector', 'Query sent from your browser to the Wappalyzer public API'],
                ].map(([tool, desc], i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span><strong style={{ color: 'var(--text-primary)' }}>{tool}:</strong> {desc}</span>
                  </li>
                ))}
              </ul>
              <p className="leading-relaxed mt-4">
                Those third-party APIs operate under their own privacy policies. We encourage you to review them if you have specific concerns about the data those services may process.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Local storage</h2>
              <p className="leading-relaxed">
                NetAsia stores a small amount of data in your browser's <code className="mono text-sm px-1 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>localStorage</code> to provide optional convenience features:
              </p>
              <ul className="space-y-2 mt-3 text-sm">
                {[
                  'Your saved favourite tools (a list of tool IDs)',
                  'Your recently visited tools (a list of tool IDs)',
                  'Your theme preference (dark or light)',
                  'Your recent search terms within the tool search modal',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="leading-relaxed mt-4">
                This data is stored entirely on your own device and is never transmitted to us. You can clear it at any time by clearing your browser's local storage or site data for netasia.dev.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Cookies</h2>
              <p className="leading-relaxed">
                NetAsia does not use cookies for tracking, analytics, or advertising. No third-party tracking scripts or advertising networks are loaded on this website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Analytics</h2>
              <p className="leading-relaxed">
                We may use privacy-preserving, aggregate analytics (such as page view counts derived from Cloudflare's infrastructure-level data) to understand general usage patterns. These analytics do not identify individual users and do not involve placing any code or cookies on your device.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Children's privacy</h2>
              <p className="leading-relaxed">
                NetAsia is a professional tool suite not directed at children under the age of 13. We do not knowingly collect any information from children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Changes to this policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. The date at the top of this page reflects when the policy was last revised. Continued use of NetAsia after changes are posted constitutes acceptance of the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Contact</h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please <a href="/contact" className="text-blue-400 hover:underline">contact us</a>.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
