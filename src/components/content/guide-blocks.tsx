import type { ReactNode } from 'react';

const primary = { color: 'var(--text-primary)' } as const;

/** `id` is required: the table of contents is built from these at render time. */
export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl font-semibold mt-10 mb-3" style={primary}>
      {children}
    </h2>
  );
}

export function H3({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3 id={id} className="scroll-mt-24 text-lg font-semibold mt-6 mb-2" style={primary}>
      {children}
    </h3>
  );
}

const CALLOUT_LABEL = { note: 'Note', tip: 'Tip', warning: 'Warning' } as const;

export function Callout({
  kind = 'note',
  title,
  children,
}: {
  kind?: keyof typeof CALLOUT_LABEL;
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="card p-4 my-6 border-l-4" style={{ borderLeftColor: 'var(--text-secondary)' }}>
      <p className="text-sm font-semibold mb-1" style={primary}>
        {CALLOUT_LABEL[kind]}
        {title ? `: ${title}` : ''}
      </p>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </aside>
  );
}

export function CodeBlock({ language, caption, children }: { language?: string; caption?: string; children: string }) {
  return (
    <figure className="my-6">
      {caption && (
        <figcaption className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
          {caption}
        </figcaption>
      )}
      <pre
        tabIndex={0}
        className="card p-4 overflow-x-auto text-sm leading-relaxed mono"
        style={primary}
        aria-label={language ? `${language} code` : 'Code'}
      >
        <code>{children}</code>
      </pre>
    </figure>
  );
}

export function DataTable({ caption, headers, rows }: { caption: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="my-6 overflow-x-auto" role="region" aria-label={caption} tabIndex={0}>
      <table className="w-full text-sm text-left border-collapse">
        <caption className="text-left text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
          {caption}
        </caption>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} scope="col" className="py-2 pr-4 font-semibold border-b" style={{ ...primary, borderColor: 'var(--border)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className="py-2 pr-4 align-top border-b" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Wrap an inline <svg>. `description` is read by screen readers. */
export function Diagram({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <figure className="my-6" role="group" aria-label={title}>
      <div className="card p-4 overflow-x-auto" role="img" aria-label={description}>
        {children}
      </div>
      <figcaption className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
        {title}
      </figcaption>
    </figure>
  );
}