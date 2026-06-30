import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const TECH = [
  { name: 'React 19', desc: 'UI framework', icon: '⚛️', color: '#60A5FA' },
  { name: 'TypeScript', desc: 'Type safety', icon: '🔷', color: '#22D3EE' },
  { name: 'Vite 6', desc: 'Build tooling', icon: '⚡', color: '#FBBF24' },
  { name: 'Tailwind CSS 3', desc: 'Styling system', icon: '🎨', color: '#A78BFA' },
  { name: 'Framer Motion', desc: 'Animations', icon: '🎬', color: '#F472B6' },
  { name: 'React Router 6', desc: 'Client routing', icon: '🛣️', color: '#4ADE80' },
  { name: 'Cloudflare Pages', desc: 'Edge hosting', icon: '☁️', color: '#FB923C' },
  { name: 'Google DNS API', desc: 'DNS over HTTPS', icon: '🔍', color: '#60A5FA' },
  { name: 'RDAP Protocol', desc: 'WHOIS standard', icon: '📋', color: '#22D3EE' },
];

const VALUES = [
  { icon: '🔒', title: 'Privacy by design', text: 'Every query runs in your browser. We have no servers to log your lookups, no databases to breach.' },
  { icon: '⚡', title: 'Speed first', text: 'Tools should return results in milliseconds, not seconds. We obsess over perceived and actual performance.' },
  { icon: '💎', title: 'Quality over quantity', text: "5 polished tools beat 50 broken ones. Every feature ships only when it's truly ready." },
  { icon: '🌐', title: 'Open web', text: 'Built on public standards — DNS-over-HTTPS, RDAP, crt.sh. No proprietary lock-in.' },
];

export default function AboutPage() {
  usePageMeta({ title: 'About', description: 'Learn about NetAsia — who built it, why, and what we use.' });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'About' }]} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Hero */}
          <div className="mb-16">
            <div className="section-label">🌐 About NetAsia</div>
            <h1 className="text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Built for the people who keep<br />
              <span className="gradient-text">the internet running</span>
            </h1>
            <div className="space-y-4 max-w-2xl">
              <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                NetAsia is a modern Internet Intelligence Platform designed for developers, sysadmins, DevOps engineers,
                and security professionals who need reliable, fast, and beautifully presented network and web tools.
              </p>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                We believe that professional tools shouldn't look like they were designed in 2005. Every tool in our
                platform is crafted with the same attention to detail you'd expect from products like Vercel or Linear —
                from loading animations to how results are presented.
              </p>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Everything runs client-side. Your queries are never logged, stored, or shared.
                We use public APIs like Google's DNS-over-HTTPS, RDAP, and crt.sh — the same open
                infrastructure that powers the modern web.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Our values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VALUES.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="card p-6"
                >
                  <div className="text-2xl mb-3">{v.icon}</div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Technology stack</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TECH.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className="card p-4 flex items-center gap-3"
                >
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
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-8 text-center" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Phase 1.5 is live</h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              5 polished tools, 15+ coming soon, 100+ on the roadmap.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/tools" className="btn-primary">Explore Tools</Link>
              <Link to="/roadmap" className="btn-secondary">View Roadmap</Link>
              <Link to="/changelog" className="btn-ghost text-sm">Changelog</Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
