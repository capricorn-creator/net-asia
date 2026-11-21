import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { ToolContent } from '../../content/types';
import { getToolById } from '../../lib/tools-registry';
import { getGuideMeta } from '../../content/guides';

const primary = { color: 'var(--text-primary)' } as const;
const secondary = { color: 'var(--text-secondary)' } as const;
const rule = { borderColor: 'var(--border)' } as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3" style={primary}>{title}</h2>
      {children}
    </section>
  );
}

function Table({ label, head, rows }: { label: string; head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto" role="region" aria-label={label} tabIndex={0}>
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr>
            {head.map(h => (
              <th key={h} scope="col" className="py-2 pr-4 font-semibold border-b" style={{ ...primary, ...rule }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className="py-2 pr-4 align-top border-b" style={{ ...secondary, ...rule }}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ToolContentSections({ content: c }: { content: ToolContent }) {
  const relatedTools = c.relatedTools.map(getToolById).filter((t): t is NonNullable<typeof t> => !!t);
  const relatedGuides = c.relatedGuides.map(getGuideMeta).filter((g): g is NonNullable<typeof g> => !!g);

  return (
    <div className="space-y-10">
      {c.sections?.map(s => (
        <Section key={s.heading} title={s.heading}>
          <p className="text-sm leading-relaxed" style={secondary}>{s.content}</p>
        </Section>
      ))}

      {c.intro.length > 0 && (
        <Section title="About this tool">
          <div className="space-y-3 text-sm leading-relaxed" style={secondary}>
            {c.intro.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </Section>
      )}

      {c.whatItShows.length > 0 && (
        <Section title="What the results show">
          <Table
            label="Result fields"
            head={['Field', 'What it means', 'Example']}
            rows={c.whatItShows.map(r => [r.field, r.meaning, <code key="e" className="mono">{r.example}</code>])}
          />
        </Section>
      )}

      {c.howToUse.length > 0 && (
        <Section title="How to use this tool">
          <ol className="list-decimal pl-6 space-y-2 text-sm leading-relaxed" style={secondary}>
            {c.howToUse.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </Section>
      )}

      {c.useCases.length > 0 && (
        <Section title="Common use cases">
          <div className="space-y-5">
            {c.useCases.map(u => (
              <div key={u.title}>
                <h3 className="text-base font-semibold mb-1" style={primary}>{u.title}</h3>
                <p className="text-sm leading-relaxed mb-1" style={secondary}>{u.scenario}</p>
                <p className="text-sm leading-relaxed" style={secondary}>
                  <strong style={primary}>What to look for:</strong> {u.whatToLookFor}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {c.sampleOutput && (
        <Section title="Example result">
          <p className="text-sm mb-3" style={secondary}>
            Input: <code className="mono" style={primary}>{c.sampleOutput.input}</code>
          </p>
          <Table
            label="Example result"
            head={['Field', 'Value']}
            rows={c.sampleOutput.rows.map(r => [r.field, <code key="v" className="mono">{r.value}</code>])}
          />
          <p className="text-sm leading-relaxed mt-3" style={secondary}>{c.sampleOutput.interpretation}</p>
        </Section>
      )}

      {c.troubleshooting.length > 0 && (
        <Section title="Troubleshooting">
          <Table
            label="Troubleshooting"
            head={['Symptom', 'Likely cause', 'Fix']}
            rows={c.troubleshooting.map(t => [t.symptom, t.cause, t.fix])}
          />
        </Section>
      )}

      {c.bestPractices.length > 0 && (
        <Section title="Best practices">
          <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed" style={secondary}>
            {c.bestPractices.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </Section>
      )}

      {c.glossary.length > 0 && (
        <Section title="Terms used on this page">
          <dl className="space-y-3 text-sm leading-relaxed">
            {c.glossary.map(g => (
              <div key={g.term}>
                <dt className="font-semibold" style={primary}>{g.term}</dt>
                <dd style={secondary}>{g.definition}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {c.limitations.length > 0 && (
        <Section title="Limitations">
          <div className="space-y-3 text-sm leading-relaxed" style={secondary}>
            {c.limitations.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </Section>
      )}

      {c.dataSources.length > 0 && (
        <Section title="Data sources">
          <ul className="space-y-2 text-sm leading-relaxed" style={secondary}>
            {c.dataSources.map(d => (
              <li key={d.url}>
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="underline" style={primary}>{d.name}</a>
                {d.note ? `: ${d.note}` : ''}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {c.faqs.length > 0 && (
        <Section title="Frequently asked questions">
          <div className="space-y-4">
            {c.faqs.map(f => (
              <div key={f.q} className="card p-5">
                <h3 className="text-sm font-semibold mb-2" style={primary}>{f.q}</h3>
                <p className="text-sm leading-relaxed" style={secondary}>{f.a}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {relatedTools.length > 0 && (
        <Section title="Related tools">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedTools.map(t => (
              <Link key={t.id} to={t.path} className="card card-hover p-4 block min-h-[44px]">
                <p className="text-sm font-semibold" style={primary}>{t.name}</p>
                <p className="text-xs mt-1" style={secondary}>{t.description}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {relatedGuides.length > 0 && (
        <Section title="Related guides">
          <ul className="space-y-2 text-sm">
            {relatedGuides.map(g => (
              <li key={g.slug}>
                <Link to={`/guides/${g.slug}`} className="underline" style={primary}>{g.title}</Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}