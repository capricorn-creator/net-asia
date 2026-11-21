import { Link } from 'react-router-dom';
import Seo from '../components/seo/Seo';
import { PAGE_META } from '../lib/page-meta';
import { getGlossary } from '../content/tools';
import { getToolById } from '../lib/tools-registry';
import { slugify } from '../content/guides';

export default function GlossaryPage() {
  const entries = getGlossary();
  const letter = (t: string) => (/^[a-z]/i.test(t) ? t[0].toUpperCase() : '#');
  const groups = new Map<string, typeof entries>();
  for (const e of entries) groups.set(letter(e.term), [...(groups.get(letter(e.term)) ?? []), e]);
  const letters = [...groups.keys()];
  const m = PAGE_META['/glossary'];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <Seo title={m.title} description={m.description} path="/glossary" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>Glossary</h1>
        <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
          Short definitions of the terms used across our tools.
        </p>

        {entries.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Terms are added as each tool page is written. Browse the <Link to="/tools" className="underline">tools</Link> in the meantime.
          </p>
        ) : (
          <>
            <nav aria-label="Jump to letter" className="mb-8">
              <ul className="flex flex-wrap gap-2">
                {letters.map(l => (
                  <li key={l}>
                    <a href={`#letter-${l === '#' ? 'other' : l}`} className="btn-secondary text-sm inline-flex items-center justify-center min-w-[44px] min-h-[44px]">{l}</a>
                  </li>
                ))}
              </ul>
            </nav>
            {letters.map(l => (
              <section key={l} id={`letter-${l === '#' ? 'other' : l}`} className="mb-8 scroll-mt-24">
                <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{l}</h2>
                <dl className="space-y-4">
                  {groups.get(l)!.map(e => (
                    <div key={e.term} id={`term-${slugify(e.term)}`} className="scroll-mt-24">
                      <dt className="font-semibold" style={{ color: 'var(--text-primary)' }}>{e.term}</dt>
                      <dd className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {e.definition}{' '}
                        <span className="block mt-1">
                          Used in:{' '}
                          {e.toolIds.map((id, i) => {
                            const t = getToolById(id);
                            return t ? (
                              <span key={id}>
                                {i > 0 && ', '}
                                <Link to={t.path} className="underline">{t.name}</Link>
                              </span>
                            ) : null;
                          })}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
}