import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES, TOOLS } from '../lib/tools-registry';
import { usePageMeta } from '../hooks/usePageMeta';
import ToolCard from '../components/tools/ToolCard';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const cat = CATEGORIES.find(c => c.id === id);
  const tools = TOOLS.filter(t => t.category === id);

  usePageMeta({
    title: cat ? `${cat.name} Tools — NetAsia` : 'Category — NetAsia',
    description: cat ? `${cat.description} Free tools for developers and sysadmins.` : 'Browse NetAsia tools by category.',
  });

  if (!cat || tools.length === 0) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <p className="text-2xl mb-4" style={{ color: 'var(--text-secondary)' }}>Category not found</p>
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
          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl">{cat.icon}</span>
            <div>
              <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{cat.name}</h1>
              <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>{cat.description}</p>
            </div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
