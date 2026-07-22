import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '../../components/tools/ToolPageLayout';
import { CopyButton } from '../../components/tools/ResultField';
import { SkeletonResult } from '../../components/ui/Skeleton';
import { useTechDetector } from '../../hooks/useTechDetector';
import ToolInfo from '../../components/tools/ToolInfo';
import type { TechCategory, DetectedTech } from '../../types';

// ── Category metadata ─────────────────────────────────────────────────────────

const CATEGORY_META: Record<TechCategory, { label: string; icon: string; color: string; bg: string }> = {
  'framework':    { label: 'Framework',    icon: '⚙️',  color: '#60A5FA', bg: 'rgba(59,130,246,0.1)'  },
  'cms':          { label: 'CMS',          icon: '📝',  color: '#A78BFA', bg: 'rgba(139,92,246,0.1)'  },
  'js-framework': { label: 'JS Framework', icon: '🟨',  color: '#FBBF24', bg: 'rgba(251,191,36,0.1)'  },
  'ui-library':   { label: 'UI Library',   icon: '🎨',  color: '#F472B6', bg: 'rgba(244,114,182,0.1)' },
  'analytics':    { label: 'Analytics',    icon: '📊',  color: '#22D3EE', bg: 'rgba(6,182,212,0.1)'   },
  'cdn':          { label: 'CDN',          icon: '🌍',  color: '#4ADE80', bg: 'rgba(34,197,94,0.1)'   },
  'hosting':      { label: 'Hosting',      icon: '☁️',  color: '#FB923C', bg: 'rgba(249,115,22,0.1)'  },
  'server':       { label: 'Server',       icon: '🖥️',  color: '#60A5FA', bg: 'rgba(59,130,246,0.1)'  },
  'language':     { label: 'Language',     icon: '💻',  color: '#4ADE80', bg: 'rgba(34,197,94,0.1)'   },
  'security':     { label: 'Security',     icon: '🔒',  color: '#F87171', bg: 'rgba(239,68,68,0.1)'   },
  'ecommerce':    { label: 'E-Commerce',   icon: '🛒',  color: '#FB923C', bg: 'rgba(249,115,22,0.1)'  },
  'database':     { label: 'Database',     icon: '🗄️',  color: '#A78BFA', bg: 'rgba(139,92,246,0.1)'  },
  'other':        { label: 'Other',        icon: '🔧',  color: '#94A3B8', bg: 'rgba(148,163,184,0.1)' },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function TechBadge({ tech }: { tech: DetectedTech }) {
  const meta = CATEGORY_META[tech.category];
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl transition-all"
      style={{ background: meta.bg, border: `1px solid ${meta.color}22` }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
        style={{ background: `${meta.color}20` }}>
        {meta.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{tech.name}</span>
          {tech.version && (
            <span className="text-xs px-1.5 py-0.5 rounded mono"
              style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
              v{tech.version}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs" style={{ color: meta.color }}>{meta.label}</span>
          {tech.confidence < 100 && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {tech.confidence}% confidence</span>
          )}
        </div>
      </div>
    </div>
  );
}

function CategorySection({ category, techs }: { category: TechCategory; techs: DetectedTech[] }) {
  const meta = CATEGORY_META[category];
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{meta.icon}</span>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{meta.label}</h3>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${meta.color}15`, color: meta.color }}>
          {techs.length}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {techs.map((tech, i) => <TechBadge key={i} tech={tech} />)}
      </div>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="card p-5 flex items-start gap-3"
      style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(239,68,68,0.1)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div>
        <p className="font-semibold text-sm" style={{ color: '#F87171' }}>Detection Failed</p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{message}</p>
      </div>
    </motion.div>
  );
}

// ── Educational content ───────────────────────────────────────────────────────

const WEBTECH_SECTIONS = [
  { heading: 'What this tool does', content: 'The Website Tech Detector identifies the technologies powering any website — including CMS platforms, JavaScript frameworks, UI libraries, analytics providers, CDN services, web servers, programming languages, and e-commerce systems. Results are grouped by category with confidence scores.' },
  { heading: 'How it works', content: 'Detection data is retrieved from the Wappalyzer public lookup API, which fingerprints websites using HTTP headers, HTML patterns, script names, cookie signatures, and other publicly visible signals. The API has catalogued thousands of technologies across hundreds of categories.' },
  { heading: 'When to use it', content: 'Use this tool during competitor analysis, technical due diligence, security assessments, or when evaluating whether a site uses specific technology before building an integration. It is also useful for sales prospecting and market research in the technology sector.' },
  { heading: 'Limitations', content: 'Technology detection relies on publicly visible signals. Sites that obfuscate their stack, use custom builds without identifiable fingerprints, or serve different content to crawlers may return incomplete results. Server-side technologies without client-visible indicators cannot be detected.' },
];

const WEBTECH_FAQS = [
  { q: 'Why is confidence less than 100%?', a: 'Confidence reflects how many fingerprinting signals matched for a given technology. A score below 100% means some — but not all — expected signals were found. A framework might be detected from a script filename alone, which gives moderate confidence rather than certainty.' },
  { q: 'Can I detect technologies on password-protected sites?', a: 'No. The tool can only analyse publicly accessible pages. Login walls, paywalls, and access-controlled content will not yield technology results since the API cannot access protected content.' },
  { q: 'Why might results differ from what I know a site uses?', a: 'Some technologies are intentionally hidden. Others may not be detected if confidence is very low. Sites also change their stack over time, and detection databases may not reflect the most recent changes immediately.' },
  { q: 'Is this tool useful for security auditing?', a: 'Yes. Knowing which framework, server version, or plugin is in use can help identify whether known vulnerabilities apply. Combine tech detection with your SSL and HTTP Headers results for a more complete security picture.' },
];

const WEBTECH_RELATED = [
  { name: 'HTTP Headers Checker', path: '/tools/http-headers', icon: '📋', description: 'Inspect server headers and security coverage' },
  { name: 'SSL Certificate Checker', path: '/tools/ssl-checker', icon: '🔒', description: 'Verify SSL certificate and issuer details' },
  { name: 'URL Redirect Checker', path: '/tools/redirect-checker', icon: '🔀', description: 'Trace redirect chains including CDN hops' },
];

// ── Main page ─────────────────────────────────────────────────────────────────

const categoryOrder: TechCategory[] = [
  'cms', 'framework', 'js-framework', 'ui-library',
  'server', 'language', 'hosting', 'cdn',
  'analytics', 'security', 'ecommerce', 'database', 'other',
];

export default function WebTechPage() {
  const [url, setUrl] = useState('');
  const { result, loading, error, detect } = useTechDetector();

  const handleDetect = () => { if (url.trim()) detect(url.trim()); };

  const grouped = result?.technologies.reduce<Partial<Record<TechCategory, DetectedTech[]>>>((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category]!.push(tech);
    return acc;
  }, {});

  const allText = result?.technologies.map(t =>
    `${t.name}${t.version ? ` v${t.version}` : ''} (${CATEGORY_META[t.category].label})`
  ).join('\n') ?? '';

  return (
    <ToolPageLayout
      title="Website Tech Detector"
      description="Detect the technologies, frameworks, CMS, analytics, and hosting providers used by any website."
      icon="🔭"
      color="purple"
      category="Website"
      toolId="website-tech"
    >
      {/* Input */}
      <div className="card p-6 mb-4">
        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
          Website URL or Domain
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            className="input-field text-base"
            placeholder="e.g. vercel.com or https://stripe.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleDetect()}
            disabled={loading}
            aria-label="Website URL or domain to analyse"
          />
          <button onClick={handleDetect} disabled={loading || !url.trim()} className="btn-primary flex-shrink-0">
            {loading
              ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            }
            Detect
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Try:</span>
          {['github.com', 'shopify.com', 'wordpress.com'].map(d => (
            <button key={d} onClick={() => { setUrl(d); detect(d); }}
              className="text-xs px-2.5 py-1 rounded-lg hover:text-purple-400 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {loading && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SkeletonResult /></motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {error && !loading && <ErrorCard message={error} />}
      </AnimatePresence>

      <AnimatePresence>
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
            {/* Summary header */}
            <div className="card p-5 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Analysed</p>
                <p className="font-bold mono text-sm" style={{ color: 'var(--text-primary)' }}>{result.url}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-black gradient-text">{result.technologies.length}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>technologies</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black" style={{ color: '#A78BFA' }}>{Object.keys(result.summary).length}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>categories</p>
                </div>
                <CopyButton text={allText} label="Copy All" />
              </div>
            </div>

            {/* Category sections */}
            {categoryOrder.filter(cat => grouped?.[cat]?.length).map(cat => (
              <motion.div key={cat} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="card p-5">
                <CategorySection category={cat} techs={grouped![cat]!} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <ToolInfo sections={WEBTECH_SECTIONS} faqs={WEBTECH_FAQS} relatedTools={WEBTECH_RELATED} />
    </ToolPageLayout>
  );
}
