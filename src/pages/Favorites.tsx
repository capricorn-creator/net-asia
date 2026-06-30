import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';
import { getToolById } from '../lib/tools-registry';
import { usePageMeta } from '../hooks/usePageMeta';
import ToolCard from '../components/tools/ToolCard';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function FavoritesPage() {
  usePageMeta({ title: 'Favorites', description: 'Your saved NetAsia tools.' });
  const { favorites, toggle } = useFavorites();
  const tools = favorites.map(id => getToolById(id)).filter(Boolean) as NonNullable<ReturnType<typeof getToolById>>[];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'Favorites' }]} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="section-label" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: '#F87171' }}>
            ❤️ Favorites
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Your Favorites</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {tools.length > 0
              ? `${tools.length} tool${tools.length !== 1 ? 's' : ''} saved — hover any card to remove`
              : 'Save tools by hovering a card and clicking the heart icon'}
          </p>
        </motion.div>

        {tools.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="card p-20 text-center">
            <div className="text-6xl mb-5">💔</div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>No favorites yet</h2>
            <p className="mb-8 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
              Hover any tool card and click the ❤️ icon to save it here for quick access.
            </p>
            <Link to="/tools" className="btn-primary">Browse Tools</Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        )}

        {tools.length > 0 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => tools.forEach(t => toggle(t.id))}
              className="btn-danger text-sm"
            >
              Clear All Favorites
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
