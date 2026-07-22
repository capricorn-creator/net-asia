import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const VALUES = [
  {
    icon: '🔒',
    title: 'Privacy by design',
    text: 'Every lookup runs entirely in your browser. No queries are sent to our servers, no results are logged, and no personal data is collected.',
  },
  {
    icon: '⚡',
    title: 'Performance first',
    text: 'Tools are optimised for speed. Most queries return in under a second. The interface loads instantly from Cloudflare\'s global edge network.',
  },
  {
    icon: '💎',
    title: 'Genuine utility',
    text: 'We build tools that solve real problems. Each tool is polished to professional quality before it ships — not a prototype, not a placeholder.',
  },
  {
    icon: '🌐',
    title: 'Open standards',
    text: 'NetAsia is built on public standards — DNS-over-HTTPS, RDAP, and certificate transparency logs. No proprietary lock-in, no obscure dependencies.',
  },
];

const TECH = [
  { name: 'React',           desc: 'UI framework',         icon: '⚛️', color: '#60A5FA' },
  { name: 'TypeScript',      desc: 'Type safety',          icon: '🔷', color: '#22D3EE' },
  { name: 'Vite',            desc: 'Build tooling',        icon: '⚡', color: '#FBBF24' },
  { name: 'Tailwind CSS',    desc: 'Styling system',       icon: '🎨', color: '#A78BFA' },
  { name: 'Framer Motion',   desc: 'Animations',           icon: '🎬', color: '#F472B6' },
  { name: 'React Router',    desc: 'Client routing',       icon: '🛣️', color: '#4ADE80' },
  { name: 'Cloudflare Pages',desc: 'Edge hosting',         icon: '☁️', color: '#FB923C' },
  { name: 'Google DoH',      desc: 'DNS over HTTPS',       icon: '🔍', color: '#60A5FA' },
  { name: 'RDAP Protocol',   desc: 'WHOIS standard',       icon: '📋', color: '#22D3EE' },
];

const TOOLS_OVERVIEW = [
  { name: 'IP Lookup',               desc: 'Geolocation, ISP, ASN, and timezone for any IP address',              path: '/tools/ip-lookup' },
  { name: 'GeoIP Lookup',            desc: 'Detailed location data with flag, coordinates, and map links',         path: '/tools/geoip-lookup' },
  { name: 'DNS Lookup',              desc: 'Full DNS record query — A, AAAA, MX, TXT, CNAME, NS, SOA, CAA',        path: '/tools/dns-lookup' },
  { name: 'DNS Propagation Checker', desc: 'Verify propagation across 8 global resolvers simultaneously',          path: '/tools/dns-propagation' },
  { name: 'Reverse DNS Lookup',      desc: 'Resolve PTR records for IPv4 and IPv6 addresses',                      path: '/tools/reverse-dns' },
  { name: 'WHOIS Lookup',            desc: 'Domain registration data, expiry, nameservers via RDAP',              path: '/tools/whois-lookup' },
  { name: 'SSL Certificate Checker', desc: 'Certificate validity, expiry countdown, issuer chain, and SANs',       path: '/tools/ssl-checker' },
  { name: 'HTTP Headers Checker',    desc: 'Response headers, security scoring, and server information',           path: '/tools/http-headers' },
  { name: 'Website Tech Detector',   desc: 'Identify CMS, frameworks, analytics, CDN, and hosting technology',    path: '/tools/website-tech' },
  { name: 'URL Redirect Checker',    desc: 'Trace the full redirect chain with status codes and final destination',path: '/tools/redirect-checker' },
];

export default function AboutPage() {
  usePageMeta({
    title: 'About NetAsia',
    description: 'Learn about NetAsia — a free Internet Intelligence Platform built for developers, sysadmins, and security teams. Privacy-first, no signup required.',
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'About' }]} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Hero */}
          <section className="mb-16">
            <div className="section-label">About NetAsia</div>
            <h1 className="text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Professional tools for people who work on the internet
            </h1>
            <div className="space-y-4 max-w-2xl">
              <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                NetAsia is a free Internet Intelligence Platform — a collection of network diagnostics, DNS analysis, domain inspection, SSL verification, and website analysis tools designed for professionals who need accurate, fast results.
              </p>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Every tool runs in your browser. Queries go directly from your device to the relevant public APIs — DNS-over-HTTPS, RDAP, certificate transparency logs — without passing through any NetAsia server. Nothing is logged. Nothing is stored.
              </p>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                NetAsia is free to use with no account, no API key, and no usage limits.
              </p>
            </div>
          </section>

          {/* Tools */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Available tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TOOLS_OVERVIEW.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.3 }}>
                  <Link to={t.path} className="card p-4 flex flex-col gap-1 group card-hover">
                    <span className="text-sm font-semibold group-hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {t.name}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.desc}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Our approach</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VALUES.map((v, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }} className="card p-6">
                  <div className="text-2xl mb-3">{v.icon}</div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v.text}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Data & Privacy */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Data and privacy</h2>
            <div className="card p-6 space-y-3" style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
              {[
                'NetAsia does not collect, store, or sell any personal data.',
                'IP addresses you look up are sent directly from your browser to the third-party API (e.g. ipapi.co, ip-api.com). NetAsia never sees them.',
                'Domain names, URLs, and search queries do not pass through NetAsia servers.',
                'The only data stored locally is your favorites and recent tools list, saved in your browser\'s localStorage and never transmitted.',
                'No cookies are used for tracking or advertising.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Tech stack */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Built with</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TECH.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05, duration: 0.35 }}
                  className="card p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${t.color}18`, border: `1px solid ${t.color}28` }}>
                    {t.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="card p-8 text-center" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Start using NetAsia</h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              All tools are free, open to everyone, and require no registration.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/tools" className="btn-primary">Browse All Tools</Link>
              <Link to="/contact" className="btn-secondary">Get in Touch</Link>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
