import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '../../components/tools/ToolPageLayout';
import { CopyButton } from '../../components/tools/ResultField';
import { SkeletonResult } from '../../components/ui/Skeleton';
import { useRedirectChecker } from '../../hooks/useRedirectChecker';
import type { RedirectStep } from '../../types';

function ErrorCard({ message }: { message: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="card p-5 flex items-start gap-3"
      style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div>
        <p className="font-semibold text-sm" style={{ color: '#F87171' }}>Check Failed</p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{message}</p>
      </div>
    </motion.div>
  );
}

function statusColor(status: number) {
  if (status >= 500) return { color: '#F87171', bg: 'rgba(239,68,68,0.12)' };
  if (status >= 400) return { color: '#FBBF24', bg: 'rgba(245,158,11,0.12)' };
  if (status >= 300) return { color: '#60A5FA', bg: 'rgba(59,130,246,0.12)' };
  if (status >= 200) return { color: '#4ADE80', bg: 'rgba(34,197,94,0.12)' };
  return { color: '#94A3B8', bg: 'rgba(148,163,184,0.12)' };
}

function StepRow({ step, index, isLast }: { step: RedirectStep; index: number; isLast: boolean }) {
  const sc = statusColor(step.status);
  const isRedirect = step.status >= 300 && step.status < 400;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="relative"
    >
      <div className="flex items-start gap-4 p-5">
        {/* Step number + connector line */}
        <div className="flex flex-col items-center gap-0 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: sc.bg, color: sc.color, border: `1.5px solid ${sc.color}40` }}
          >
            {index + 1}
          </div>
          {!isLast && (
            <div className="w-px flex-1 mt-1" style={{ background: 'var(--border)', minHeight: 24 }} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pb-4">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className="text-sm font-bold mono px-2.5 py-1 rounded-lg flex-shrink-0"
              style={{ background: sc.bg, color: sc.color }}
            >
              {step.status || '—'}
            </span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {step.statusText}
            </span>
            {isLast && (
              <span className="badge badge-green text-xs">Final URL</span>
            )}
            {isRedirect && !isLast && (
              <span className="badge badge-blue text-xs">Redirect</span>
            )}
          </div>
          <p className="text-sm mono break-all" style={{ color: '#60A5FA' }}>{step.url}</p>
        </div>
      </div>

      {/* Down arrow between steps */}
      {!isLast && (
        <div className="absolute left-9 -translate-x-1/2" style={{ top: 'calc(2rem + 8px)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      )}
    </motion.div>
  );
}

export default function RedirectCheckerPage() {
  const [url, setUrl] = useState('');
  const { result, loading, error, check } = useRedirectChecker();

  const handleCheck = () => { if (url.trim()) check(url.trim()); };

  const allText = result?.steps.map(s => `${s.status} ${s.statusText}: ${s.url}`).join('\n → ') ?? '';

  return (
    <ToolPageLayout
      title="URL Redirect Checker"
      description="Trace every redirect step of a URL — HTTP to HTTPS upgrades, www redirects, and all intermediate hops."
      icon="🔀"
      color="orange"
      category="Website"
      toolId="redirect-checker"
    >
      {/* Input */}
      <div className="card p-6 mb-4">
        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
          URL to Check
        </label>
        <div className="flex gap-3">
          <input
            type="url"
            className="input-field text-base"
            placeholder="e.g. http://github.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCheck()}
            disabled={loading}
          />
          <button onClick={handleCheck} disabled={loading || !url.trim()} className="btn-primary flex-shrink-0">
            {loading
              ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            }
            Trace
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Examples:</span>
          {['http://github.com', 'http://twitter.com', 'http://google.com'].map(u => (
            <button key={u} onClick={() => setUrl(u)}
              className="text-xs px-2.5 py-1 rounded-lg hover:text-orange-400 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {u.replace('http://', '')}
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
            {/* Summary bar */}
            <div className="card p-5 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-5 flex-wrap">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Redirects</p>
                  <p className="text-2xl font-black" style={{ color: result.redirectCount > 0 ? '#60A5FA' : '#4ADE80' }}>
                    {result.redirectCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Total Steps</p>
                  <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{result.steps.length}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Time</p>
                  <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{result.totalResponseTime}<span className="text-sm font-normal ml-0.5">ms</span></p>
                </div>
                {result.isHttpsUpgrade && (
                  <span className="badge badge-green">🔒 HTTPS Upgrade</span>
                )}
              </div>
              <CopyButton text={allText} />
            </div>

            {/* Redirect chain */}
            <div className="card overflow-hidden divide-y" style={{ borderColor: 'var(--border)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Redirect Chain
                </p>
              </div>
              <div className="py-2">
                {result.steps.map((step, i) => (
                  <StepRow key={i} step={step} index={i} isLast={i === result.steps.length - 1} />
                ))}
              </div>
            </div>

            {/* Final destination */}
            <div className="card p-5" style={{ borderColor: 'rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.04)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#4ADE80' }}>
                Final Destination
              </p>
              <p className="text-sm mono break-all font-semibold" style={{ color: 'var(--text-primary)' }}>{result.finalUrl}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolPageLayout>
  );
}
