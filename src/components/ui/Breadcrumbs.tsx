import { Link } from 'react-router-dom';

interface Crumb { label: string; path?: string; }

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        <li>
          <Link to="/" className="transition-colors hover:text-blue-400" style={{ color: 'var(--text-muted)' }}>Home</Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            {crumb.path && i < crumbs.length - 1 ? (
              <Link to={crumb.path} className="transition-colors hover:text-blue-400" style={{ color: 'var(--text-muted)' }}>{crumb.label}</Link>
            ) : (
              <span style={{ color: 'var(--text-primary)' }} className="font-medium">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
