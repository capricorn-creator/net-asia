import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES, TOOLS } from '../lib/tools-registry';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'rgba(59,130,246,0.1)', text: '#60A5FA', border: 'rgba(59,130,246,0.2)' },
  cyan: { bg: 'rgba(6,182,212,0.1)', text: '#22D3EE', border: 'rgba(6,182,212,0.2)' },
  purple: { bg: 'rgba(139,92,246,0.1)', text: '#A78BFA', border: 'rgba(139,92,246,0.2)' },
  green: { bg: 'rgba(34,197,94,0.1)', text: '#4ADE80', border: 'rgba(34,197,94,0.2)' },
  orange: { bg: 'rgba(249,115,22,0.1)', text: '#FB923C', border: 'rgba(249,115,22,0.2)' },
  pink: { bg: 'rgba(236,72,153,0.1)', text: '#F472B6', border: 'rgba(236,72,153,0.2)' },
};

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const cat = CATEGORIES.find(c => c.id === id);
  const tools = TOOLS.filter(t => t.category === id);

  if (!cat) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <p className="text-2xl mb-4">Category not found</p>
        <Link to="/categories" className="btn-primary">Back to Categories</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'Categories', path: '/categories' }, { label: cat.name }]} />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{cat.icon}</div>
            <div>
              <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{cat.name}</h1>
              <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>{cat.description}</p>
            </div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => {
            const s = COLOR_MAP[tool.color] || COLOR_MAP.blue;
            return (
              <motion.div key={tool.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Link to={tool.path} className="card p-5 flex flex-col gap-4 group relative h-full">
                  {tool.comingSoon && (
                    <div className="absolute top-3 right-3">
                      <span className="badge badge-purple text-xs">Coming Soon</span>
                    </div>
                  )}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1.5 group-hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>{tool.name}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tool.description}</p>
                  </div>
                  <p className="text-xs" style={{ color: tool.comingSoon ? 'var(--text-muted)' : s.text }}>
                    {tool.comingSoon ? 'Coming soon →' : 'Open tool →'}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
