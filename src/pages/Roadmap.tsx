import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TOOLS } from '../lib/tools-registry';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const PHASES = [
  {
    phase: 'Phase 1',
    label: 'Foundation',
    status: 'live',
    description: 'Core network and security tools',
    tools: TOOLS.filter(t => !t.comingSoon),
  },
  {
    phase: 'Phase 2',
    label: 'Developer Tools',
    status: 'upcoming',
    description: 'Developer utilities, encoding, and generation tools',
    tools: TOOLS.filter(t => t.comingSoon).slice(0, 7),
  },
  {
    phase: 'Phase 3',
    label: 'Web Intelligence',
    status: 'planned',
    description: 'Website analysis, SEO tools, and monitoring',
    tools: TOOLS.filter(t => t.comingSoon).slice(7),
  },
];

const STATUS_STYLES = {
  live: { label: '🟢 Live', bg: 'rgba(34,197,94,0.1)', color: '#4ADE80', border: 'rgba(34,197,94,0.2)' },
  upcoming: { label: '🔵 In Progress', bg: 'rgba(59,130,246,0.1)', color: '#60A5FA', border: 'rgba(59,130,246,0.2)' },
  planned: { label: '⬜ Planned', bg: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: 'var(--border)' },
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'Roadmap' }]} />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-label">🗺️ Roadmap</div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>What's coming</h1>
          <p className="mb-12" style={{ color: 'var(--text-secondary)' }}>
            NetAsia is built in phases. Each phase ships a coherent set of tools with full polish before moving on.
          </p>

          <div className="space-y-8">
            {PHASES.map((phase, i) => {
              const s = STATUS_STYLES[phase.status as keyof typeof STATUS_STYLES];
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="card p-6">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{phase.phase}</span>
                        <span className="text-sm px-2.5 py-0.5 rounded-full font-medium" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                          {s.label}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{phase.label}</h2>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{phase.description}</p>
                    </div>
                    <span className="text-2xl font-black opacity-10 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {phase.tools.map(tool => (
                      <Link key={tool.id} to={tool.path}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all hover:bg-white/5"
                        style={{ border: '1px solid var(--border)', color: phase.status === 'live' ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                        <span>{tool.icon}</span>
                        <span className="truncate">{tool.name}</span>
                        {phase.status === 'live' && (
                          <svg className="ml-auto flex-shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="card p-8 text-center mt-8">
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Have a tool suggestion?</p>
            <p className="mb-5" style={{ color: 'var(--text-muted)' }}>We're always looking for more tools to add to the platform.</p>
            <Link to="/contact" className="btn-primary">Suggest a Tool</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
