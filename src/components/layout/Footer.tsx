import { Link } from 'react-router-dom';
import { LogoWordmark } from '../ui/Logo';

const VERSION = '1.5.0';

const TOOLS_LINKS = [
  { label: 'IP Lookup', path: '/tools/ip-lookup' },
  { label: 'DNS Lookup', path: '/tools/dns-lookup' },
  { label: 'WHOIS Lookup', path: '/tools/whois-lookup' },
  { label: 'SSL Checker', path: '/tools/ssl-checker' },
  { label: 'HTTP Headers', path: '/tools/http-headers' },
];
const CAT_LINKS = [
  { label: 'Network', path: '/categories/network' },
  { label: 'DNS', path: '/categories/dns' },
  { label: 'Domain', path: '/categories/domain' },
  { label: 'Security', path: '/categories/security' },
  { label: 'Developer', path: '/categories/developer' },
];
const CO_LINKS = [
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Roadmap', path: '/roadmap' },
  { label: 'Changelog', path: '/changelog' },
  { label: 'Favorites', path: '/favorites' },
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
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand col — spans 2 */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="inline-block mb-5">
              <LogoWordmark size={28} />
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Internet Intelligence Platform. Professional network and web tools built for developers, sysadmins, and security teams.
            </p>
            {/* Status */}
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              All systems operational
            </div>
          </div>

          <FooterGroup title="Tools" links={TOOLS_LINKS} />
          <FooterGroup title="Categories" links={CAT_LINKS} />
          <FooterGroup title="Company" links={CO_LINKS} />
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} NetAsia. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>Phase 1.5</span>
            <span className="opacity-40">·</span>
            <span className="mono">v{VERSION}</span>
            <span className="opacity-40">·</span>
            <span>5 live tools</span>
            <span className="opacity-40">·</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
