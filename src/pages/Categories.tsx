import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES, TOOLS } from '../lib/tools-registry';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'Categories' }]} />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Categories</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Browse tools organized by purpose and function</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, i) => {
            const tools = TOOLS.filter(t => t.category === cat.id);
            const liveTools = tools.filter(t => !t.comingSoon);
            return (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Link to={`/categories/${cat.id}`} className="card p-6 flex flex-col gap-5 group h-full">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{cat.icon}</div>
                    <div className="text-right">
                      <p className="text-xs font-bold" style={{ color: '#4ADE80' }}>{liveTools.length} live</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{tools.length} total</p>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold mb-1.5 group-hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {cat.name}
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{cat.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {liveTools.slice(0, 3).map(t => (
                      <span key={t.id} className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                        {t.name}
                      </span>
                    ))}
                    {tools.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(59,130,246,0.08)', color: '#60A5FA' }}>
                        +{tools.length - 3} more
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
