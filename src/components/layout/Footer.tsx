import { Link } from 'react-router-dom';
import { LogoWordmark } from '../ui/Logo';

const TOOL_LINKS = [
  { label: 'IP Lookup',               path: '/tools/ip-lookup' },
  { label: 'GeoIP Lookup',            path: '/tools/geoip-lookup' },
  { label: 'DNS Lookup',              path: '/tools/dns-lookup' },
  { label: 'DNS Propagation',         path: '/tools/dns-propagation' },
  { label: 'WHOIS Lookup',            path: '/tools/whois-lookup' },
  { label: 'SSL Certificate Checker', path: '/tools/ssl-checker' },
  { label: 'HTTP Headers',            path: '/tools/http-headers' },
  { label: 'Website Tech Detector',   path: '/tools/website-tech' },
  { label: 'Reverse DNS',             path: '/tools/reverse-dns' },
  { label: 'URL Redirect Checker',    path: '/tools/redirect-checker' },
];

const CO_LINKS = [
  { label: 'About',          path: '/about' },
  { label: 'Contact',        path: '/contact' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Use',   path: '/terms' },
  { label: 'Disclaimer',     path: '/disclaimer' },
  { label: 'Favorites',      path: '/favorites' },
];

function FooterGroup({ title, links }: { title: string; links: { label: string; path: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map(l => (
          <li key={l.path}>
            <Link
              to={l.path}
              className="text-sm transition-colors hover:text-blue-400"
              style={{ color: 'var(--text-muted)' }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand — spans 1 col on mobile, 1 on desktop */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-5" aria-label="NetAsia home">
              <LogoWordmark size={28} />
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Internet Intelligence Platform. Free network and web tools for developers, sysadmins, and security professionals.
            </p>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              All systems operational
            </div>
          </div>

          <FooterGroup title="Tools"      links={TOOL_LINKS.slice(0, 5)} />
          <FooterGroup title="More Tools" links={TOOL_LINKS.slice(5)} />
          <FooterGroup title="Company"    links={CO_LINKS} />
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} NetAsia. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy</Link>
            <span className="opacity-40">·</span>
            <Link to="/terms"   className="hover:text-blue-400 transition-colors">Terms</Link>
            <span className="opacity-40">·</span>
            <Link to="/disclaimer" className="hover:text-blue-400 transition-colors">Disclaimer</Link>
            <span className="opacity-40">·</span>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
