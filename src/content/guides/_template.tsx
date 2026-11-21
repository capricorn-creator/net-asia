import type { GuideMeta } from '../types';
import { DEFAULT_AUTHOR } from '../../lib/site';
import { H2, H3, Callout, CodeBlock, DataTable, Diagram } from '../../components/content/guide-blocks';

export const meta: GuideMeta = {
  title: 'Replace with the guide title',
  description: 'Replace with a 140 to 160 character description.',
  slug: 'replace-with-slug',
  category: 'DNS',
  datePublished: '2026-01-01',
  dateModified: '2026-01-01',
  author: DEFAULT_AUTHOR,
  readingMinutes: 5,
  relatedTools: ['dns-lookup'],
  relatedGuides: [],
  draft: true,
};

export default function Body() {
  return (
    <>
      <p>Opening paragraph.</p>

      <H2 id="first-section">First section</H2>
      <p>Text.</p>
      <Callout kind="tip" title="Short title">Callout text.</Callout>

      <H3 id="a-subsection">A subsection</H3>
      <CodeBlock language="bash" caption="Example command">{`dig example.com A`}</CodeBlock>

      <H2 id="a-table">A table</H2>
      <DataTable caption="Example table" headers={['Column A', 'Column B']} rows={[['one', 'two']]} />

      <H2 id="a-diagram">A diagram</H2>
      <Diagram title="Example diagram" description="Two boxes joined by an arrow.">
        <svg viewBox="0 0 220 60" width="100%" height="60" role="presentation">
          <rect x="4" y="10" width="80" height="40" rx="4" fill="none" stroke="currentColor" />
          <rect x="136" y="10" width="80" height="40" rx="4" fill="none" stroke="currentColor" />
          <path d="M84 30h52" stroke="currentColor" />
        </svg>
      </Diagram>
    </>
  );
}