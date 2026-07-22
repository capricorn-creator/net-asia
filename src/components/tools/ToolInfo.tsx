import { Link } from 'react-router-dom';

interface FAQ {
  q: string;
  a: string;
}

interface RelatedTool {
  name: string;
  path: string;
  icon: string;
  description: string;
}

interface Section {
  heading: string;
  content: string;
}

interface ToolInfoProps {
  sections: Section[];
  faqs?: FAQ[];
  relatedTools?: RelatedTool[];
}

export default function ToolInfo({ sections, faqs, relatedTools }: ToolInfoProps) {
  return (
    <div className="mt-12 space-y-8">

      {/* Educational sections */}
      <div className="space-y-6">
        {sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {section.heading}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {section.content}
            </p>
          </section>
        ))}
      </div>

      {/* Related Tools */}
      {relatedTools && relatedTools.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Related tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedTools.map((tool, i) => (
              <Link
                key={i}
                to={tool.path}
                className="card p-4 flex items-center gap-3 group card-hover"
              >
                <span className="text-xl flex-shrink-0">{tool.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold group-hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {tool.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {tool.description}
                  </p>
                </div>
                <svg className="ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs && faqs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="card p-5">
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {faq.q}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
