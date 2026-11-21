import { useSyncExternalStore } from 'react';
import type { DataSourceInfo } from '../../lib/api';
import { getServerSnapshot, getSnapshot, subscribe } from '../../lib/source-store';

export default function DataSource({ source }: { source: DataSourceInfo | null }) {
  if (!source) return null;
  return (
    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
      Data source:{' '}
      {source.url ? (
        <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline">{source.name}</a>
      ) : (
        source.name
      )}
      {' · '}Retrieved <time dateTime={source.fetchedAt}>{new Date(source.fetchedAt).toLocaleString()}</time>
    </p>
  );
}

/** Shows whichever source answered the most recent lookup on this page. Rendered by ToolPageLayout. */
export function CurrentDataSource() {
  const source = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <DataSource source={source} />;
}