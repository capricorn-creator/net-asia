import { useState } from 'react';

interface ResultFieldProps {
  label: string;
  value: string | string[] | number | boolean | undefined | null;
  mono?: boolean;
  copyable?: boolean;
  badge?: boolean;
  highlight?: 'success' | 'error' | 'warning' | 'info';
  fullWidth?: boolean;
}

const BADGE_STYLES = {
  success: { bg: 'rgba(34,197,94,0.1)', color: '#4ADE80', border: 'rgba(34,197,94,0.2)' },
  error: { bg: 'rgba(239,68,68,0.1)', color: '#F87171', border: 'rgba(239,68,68,0.2)' },
  warning: { bg: 'rgba(245,158,11,0.1)', color: '#FBBF24', border: 'rgba(245,158,11,0.2)' },
  info: { bg: 'rgba(59,130,246,0.1)', color: '#60A5FA', border: 'rgba(59,130,246,0.2)' },
};

export function ResultField({ label, value, mono, copyable, badge, highlight, fullWidth }: ResultFieldProps) {
  const [copied, setCopied] = useState(false);

  if (value === undefined || value === null || value === '') return null;

  const display = Array.isArray(value) ? value.join(', ') : String(value);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hs = highlight ? BADGE_STYLES[highlight] : null;

  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          {badge && hs ? (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold"
              style={{ background: hs.bg, color: hs.color, border: `1px solid ${hs.border}` }}
            >
              {highlight === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />}
              {highlight === 'error' && <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />}
              {highlight === 'warning' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />}
              {display}
            </span>
          ) : (
            <p
              className={`text-sm break-all ${mono ? 'mono' : ''}`}
              style={{ color: 'var(--text-primary)' }}
            >
              {display}
            </p>
          )}
        </div>
        {copyable && display && display !== 'N/A' && (
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-1.5 rounded-lg transition-all hover:bg-white/8"
            style={{ color: copied ? '#4ADE80' : 'var(--text-muted)' }}
            title="Copy to clipboard"
          >
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

interface ResultGridProps {
  children: React.ReactNode;
  title?: string;
}

export function ResultGrid({ children, title }: ResultGridProps) {
  return (
    <div className="card p-6">
      {title && (
        <h3 className="text-sm font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <span className="w-1.5 h-4 rounded-full bg-blue-500 inline-block" />
          {title}
        </h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {children}
      </div>
    </div>
  );
}

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = 'Copy All' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="btn-secondary text-sm">
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#4ADE80' }}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
