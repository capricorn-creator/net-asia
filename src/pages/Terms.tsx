import { motion } from 'framer-motion';
import { usePageMeta } from '../hooks/usePageMeta';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const LAST_UPDATED = 'July 15, 2026';

export default function TermsPage() {
  usePageMeta({
    title: 'Terms of Use — NetAsia',
    description: 'NetAsia Terms of Use. Free internet tools provided as-is for lawful purposes. No account required.',
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'Terms of Use' }]} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Terms of Use</h1>
          <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>Last updated: {LAST_UPDATED}</p>

          <div className="space-y-10" style={{ color: 'var(--text-secondary)' }}>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Acceptance of terms</h2>
              <p className="leading-relaxed">
                By accessing or using NetAsia ("the Service"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Description of service</h2>
              <p className="leading-relaxed">
                NetAsia is a free Internet Intelligence Platform providing network diagnostics, DNS analysis, domain inspection, SSL verification, and website analysis tools. All tools are provided free of charge and require no registration.
              </p>
              <p className="leading-relaxed mt-3">
                The Service relies on public third-party APIs to return results. NetAsia does not guarantee the accuracy, completeness, or availability of data returned by those APIs. See our <a href="/disclaimer" className="text-blue-400 hover:underline">Disclaimer</a> for details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Permitted use</h2>
              <p className="leading-relaxed mb-3">You may use NetAsia for lawful purposes including:</p>
              <ul className="space-y-2 text-sm">
                {[
                  'Network diagnostics and troubleshooting',
                  'DNS research and propagation verification',
                  'Domain and SSL certificate monitoring',
                  'Website security analysis and header inspection',
                  'Academic research and educational purposes',
                  'Professional IT and security work',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Prohibited use</h2>
              <p className="leading-relaxed mb-3">You must not use the Service to:</p>
              <ul className="space-y-2 text-sm">
                {[
                  'Violate any applicable law or regulation',
                  'Perform unauthorised reconnaissance or scanning of systems you do not own or have permission to test',
                  'Harass, stalk, or harm any individual or organisation',
                  'Circumvent access controls of third-party systems',
                  'Systematically scrape, crawl, or abuse the Service in a manner that places excessive load on our infrastructure or upstream APIs',
                  'Attempt to reverse engineer or compromise the Service',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Intellectual property</h2>
              <p className="leading-relaxed">
                The NetAsia name, logo, design, and original content are the intellectual property of NetAsia. Data returned by tool queries is sourced from public APIs and is subject to those providers' respective terms and licences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Disclaimers and limitation of liability</h2>
              <p className="leading-relaxed">
                The Service is provided "as is" without warranties of any kind, either express or implied. NetAsia does not warrant that the Service will be uninterrupted, error-free, or that results will be accurate or complete.
              </p>
              <p className="leading-relaxed mt-3">
                To the fullest extent permitted by law, NetAsia shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Service.
              </p>
              <p className="leading-relaxed mt-3">
                Results from our tools should be used for informational purposes only. Do not rely solely on NetAsia for decisions that have significant security, financial, or operational consequences. See our <a href="/disclaimer" className="text-blue-400 hover:underline">Disclaimer</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Third-party services</h2>
              <p className="leading-relaxed">
                NetAsia tools query third-party public APIs on your behalf. These services operate under their own terms and privacy policies. NetAsia is not responsible for the availability, accuracy, or conduct of third-party API providers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Availability</h2>
              <p className="leading-relaxed">
                We aim to keep the Service available at all times but cannot guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Changes to these terms</h2>
              <p className="leading-relaxed">
                We may update these Terms of Use from time to time. The date at the top of this page reflects when the terms were last revised. Continued use of the Service after changes are posted constitutes acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Contact</h2>
              <p className="leading-relaxed">
                If you have questions about these Terms of Use, please <a href="/contact" className="text-blue-400 hover:underline">contact us</a>.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
