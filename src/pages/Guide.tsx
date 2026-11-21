import { Link, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import Seo from '../components/seo/Seo';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import NotFoundPage from './NotFound';
import { getGuide, getGuideMeta } from '../content/guides';
import { articleLd } from '../lib/seo';
import { collectHeadings } from '../lib/toc';
import { formatDate } from '../lib/format';
import { getToolById } from '../lib/tools-registry';

const secondary = { color: 'var(--text-secondary)' } as const;
const primary = { color: 'var(--text-primary)' } as const;

export default function GuidePage() {
  const { slug = '' } = useParams();
  const guide = getGuide(slug);

  if (!guide) {
    return (
      <>
        <NotFoundPage />
        <Seo title="Page not found" description="This page does not exist." noindex />
      </>
    );
  }

  const { meta, Body } = guide;
  const path = `/guides/${meta.slug}`;
  const headings = collectHeadings((Body as () => ReactNode)());
  const tools = meta.relatedTools.map(getToolById).filter((t): t is NonNullable<typeof t> => !!t);
  const guides = meta.relatedGuides.map(getGuideMeta).filter((g): g is NonNullable<typeof g> => !!g);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <Seo
        title={meta.title}
        description={meta.description}
        path={path}
        type="article"
        published={meta.datePublished}
        modified={meta.dateModified}
        author={meta.author.name}
        jsonLd={[
          articleLd({
            headline: meta.title,
            description: meta.description,
            path,
            datePublished: meta.datePublished,
            dateModified: meta.dateModified,
            authorName: meta.author.name,
            authorUrl: meta.author.url,
          }),
        ]}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'Guides', path: '/guides' }, { label: meta.title }]} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3" style={primary}>{meta.title}</h1>
        <p className="text-base leading-relaxed mb-4" style={secondary}>{meta.description}</p>
        <p className="text-sm mb-8" style={secondary}>
          By {meta.author.name} · Published <time dateTime={meta.datePublished}>{formatDate(meta.datePublished)}</time> · Last
          reviewed <time dateTime={meta.dateModified}>{formatDate(meta.dateModified)}</time> · {meta.readingMinutes} min read
        </p>

        {headings.length > 1 && (
          <nav aria-label="On this page" className="card p-5 mb-8">
            <p className="text-sm font-semibold mb-2" style={primary}>On this page</p>
            <ol className="space-y-1 text-sm">
              {headings.map(h => (
                <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
                  <a href={`#${h.id}`} className="underline" style={secondary}>{h.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div
          className="text-base leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_a]:underline [&_code]:mono [&_figure]:max-w-full"
          style={secondary}
        >
          <Body />
        </div>

        {(tools.length > 0 || guides.length > 0) && (
          <aside className="mt-12 grid gap-8 sm:grid-cols-2">
            {tools.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3" style={primary}>Related tools</h2>
                <ul className="space-y-2 text-sm">
                  {tools.map(t => (
                    <li key={t.id}><Link to={t.path} className="underline" style={primary}>{t.name}</Link></li>
                  ))}
                </ul>
              </div>
            )}
            {guides.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3" style={primary}>Related guides</h2>
                <ul className="space-y-2 text-sm">
                  {guides.map(g => (
                    <li key={g.slug}><Link to={`/guides/${g.slug}`} className="underline" style={primary}>{g.title}</Link></li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        )}
      </article>
    </div>
  );
}