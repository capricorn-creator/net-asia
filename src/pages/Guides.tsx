import { Link } from 'react-router-dom';
import Seo from '../components/seo/Seo';
import { PAGE_META } from '../lib/page-meta';
import { GUIDES, slugify } from '../content/guides';
import { formatDate } from '../lib/format';

export default function GuidesPage() {
  const byCategory = new Map<string, typeof GUIDES>();
  for (const g of GUIDES) byCategory.set(g.category, [...(byCategory.get(g.category) ?? []), g]);
  const categories = [...byCategory.keys()].sort((a, b) => a.localeCompare(b, 'en'));
  const m = PAGE_META['/guides'];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <Seo title={m.title} description={m.description} path="/guides" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>Guides</h1>
        <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
          Practical explanations of the data our tools return, with links to the tool that checks it.
        </p>

        {GUIDES.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Guides are being written. In the meantime, see the <Link to="/tools" className="underline">tools</Link> and the{' '}
            <Link to="/glossary" className="underline">glossary</Link>.
          </p>
        ) : (
          <>
            <nav aria-label="Guide categories" className="mb-10">
              <ul className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <li key={c}>
                    <a href={`#category-${slugify(c)}`} className="btn-secondary text-sm inline-flex items-center min-h-[44px]">
                      {c}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            {categories.map(c => (
              <section key={c} id={`category-${slugify(c)}`} className="mb-10 scroll-mt-24">
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{c}</h2>
                <div className="space-y-3">
                  {byCategory.get(c)!.map(g => (
                    <Link key={g.slug} to={`/guides/${g.slug}`} className="card card-hover p-5 block">
                      <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{g.title}</h3>
                      <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{g.description}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Updated {formatDate(g.dateModified)} · {g.readingMinutes} min read
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
}