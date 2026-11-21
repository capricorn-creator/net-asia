import { Link } from 'react-router-dom';
import Seo from '../components/seo/Seo';
import { PAGE_META } from '../lib/page-meta';

const sections: { heading: string; body: string[] }[] = [
  {
    heading: 'What we publish',
    body: [
      'NET Asia publishes free diagnostic tools for networks and websites, plus written explanations and guides that help readers understand what those tools return.',
    ],
  },
  {
    heading: 'How we write',
    body: [
      'Each tool page and guide is written for a specific reader, such as a developer debugging DNS or a site owner checking a certificate. We use plain English and show worked examples so a reader can compare them with their own results.',
    ],
  },
  {
    heading: 'Sources',
    body: [
      'When we make a technical claim, we link to a primary source where one exists, such as an RFC, the IANA registries, ICANN, MDN, or vendor documentation. Tool results come from third-party data sources, and each tool names the source and the time of the lookup next to the result.',
    ],
  },
  {
    heading: 'Review and updates',
    body: [
      'Tool pages and guides show their author and a last-reviewed date. We update that date only when someone has re-read the page against its sources.',
    ],
  },
  {
    heading: 'Corrections',
    body: [
      'If you find an error or an outdated statement, please tell us through the contact page. We correct confirmed errors and update the last-reviewed date on the page.',
    ],
  },
  {
    heading: 'Advertising',
    body: [
      'NET Asia may show advertising from third-party services. Advertising does not decide what we write or what a tool reports.',
    ],
  },
];

export default function EditorialPolicyPage() {
  const m = PAGE_META['/editorial-policy'];
  return (
    <div className="min-h-screen pt-24 pb-20">
      <Seo title={m.title} description={m.description} path="/editorial-policy" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>Editorial policy</h1>
        <div className="space-y-8">
          {sections.map(s => (
            <section key={s.heading}>
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p}</p>
              ))}
            </section>
          ))}
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Questions about this policy? Use the <Link to="/contact" className="underline">contact page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}